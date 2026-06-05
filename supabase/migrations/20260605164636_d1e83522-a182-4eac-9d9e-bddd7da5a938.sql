
-- =========================================================
-- Enums
-- =========================================================
DO $$ BEGIN
  CREATE TYPE public.activity_type AS ENUM (
    'steps','run','cycle','workout','yoga','swim','hike','strength','hiit','other'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.activity_source AS ENUM (
    'healthkit','health_connect','manual','sensor','geofence'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- =========================================================
-- profiles.timezone (for per-user streak day evaluation)
-- =========================================================
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS timezone text NOT NULL DEFAULT 'UTC';

-- =========================================================
-- activities
-- =========================================================
CREATE TABLE IF NOT EXISTS public.activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  type public.activity_type NOT NULL,
  source public.activity_source NOT NULL,
  external_id text,
  started_at timestamptz NOT NULL,
  ended_at timestamptz,
  duration_minutes integer NOT NULL DEFAULT 0,
  distance_km numeric(8,3),
  steps integer,
  calories integer,
  avg_heart_rate integer,
  verified boolean NOT NULL DEFAULT false,
  notes text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT activities_external_unique UNIQUE (user_id, source, external_id)
);

CREATE INDEX IF NOT EXISTS activities_user_started_idx
  ON public.activities (user_id, started_at DESC);
CREATE INDEX IF NOT EXISTS activities_user_verified_idx
  ON public.activities (user_id, verified, started_at DESC);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.activities TO authenticated;
GRANT ALL ON public.activities TO service_role;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own activities"
  ON public.activities FOR SELECT TO authenticated
  USING ((auth.uid())::text = user_id);
CREATE POLICY "Users insert own activities"
  ON public.activities FOR INSERT TO authenticated
  WITH CHECK ((auth.uid())::text = user_id);
CREATE POLICY "Users update own activities"
  ON public.activities FOR UPDATE TO authenticated
  USING ((auth.uid())::text = user_id);
CREATE POLICY "Users delete own activities"
  ON public.activities FOR DELETE TO authenticated
  USING ((auth.uid())::text = user_id);

CREATE TRIGGER activities_updated_at
  BEFORE UPDATE ON public.activities
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================================================
-- gym_checkins
-- =========================================================
CREATE TABLE IF NOT EXISTS public.gym_checkins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  club_id uuid,
  checked_in_at timestamptz NOT NULL DEFAULT now(),
  checked_out_at timestamptz,
  latitude double precision,
  longitude double precision,
  distance_meters integer,
  verified_location boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS gym_checkins_user_time_idx
  ON public.gym_checkins (user_id, checked_in_at DESC);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.gym_checkins TO authenticated;
GRANT ALL ON public.gym_checkins TO service_role;
ALTER TABLE public.gym_checkins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own checkins"
  ON public.gym_checkins FOR SELECT TO authenticated
  USING ((auth.uid())::text = user_id);
CREATE POLICY "Users insert own checkins"
  ON public.gym_checkins FOR INSERT TO authenticated
  WITH CHECK ((auth.uid())::text = user_id);
CREATE POLICY "Users update own checkins"
  ON public.gym_checkins FOR UPDATE TO authenticated
  USING ((auth.uid())::text = user_id);
CREATE POLICY "Users delete own checkins"
  ON public.gym_checkins FOR DELETE TO authenticated
  USING ((auth.uid())::text = user_id);

-- =========================================================
-- streak_stats
-- =========================================================
CREATE TABLE IF NOT EXISTS public.streak_stats (
  user_id text PRIMARY KEY,
  current_streak integer NOT NULL DEFAULT 0,
  longest_streak integer NOT NULL DEFAULT 0,
  last_qualifying_date date,
  total_sessions integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.streak_stats TO authenticated;
GRANT ALL ON public.streak_stats TO service_role;
ALTER TABLE public.streak_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own streak"
  ON public.streak_stats FOR SELECT TO authenticated
  USING ((auth.uid())::text = user_id);

-- =========================================================
-- Streak update trigger
-- =========================================================
CREATE OR REPLACE FUNCTION public.update_streak_on_activity()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_tz text;
  today_local date;
  s public.streak_stats%ROWTYPE;
BEGIN
  IF NEW.verified IS NOT TRUE THEN
    RETURN NEW;
  END IF;

  SELECT COALESCE(timezone, 'UTC') INTO user_tz
  FROM public.profiles WHERE id = NEW.user_id;
  IF user_tz IS NULL THEN user_tz := 'UTC'; END IF;

  today_local := (NEW.started_at AT TIME ZONE user_tz)::date;

  SELECT * INTO s FROM public.streak_stats WHERE user_id = NEW.user_id;

  IF NOT FOUND THEN
    INSERT INTO public.streak_stats (user_id, current_streak, longest_streak, last_qualifying_date, total_sessions, updated_at)
    VALUES (NEW.user_id, 1, 1, today_local, 1, now());
    RETURN NEW;
  END IF;

  IF s.last_qualifying_date = today_local THEN
    UPDATE public.streak_stats
      SET total_sessions = s.total_sessions + 1, updated_at = now()
      WHERE user_id = NEW.user_id;
  ELSIF s.last_qualifying_date = today_local - INTERVAL '1 day' THEN
    UPDATE public.streak_stats
      SET current_streak = s.current_streak + 1,
          longest_streak = GREATEST(s.longest_streak, s.current_streak + 1),
          last_qualifying_date = today_local,
          total_sessions = s.total_sessions + 1,
          updated_at = now()
      WHERE user_id = NEW.user_id;
  ELSE
    UPDATE public.streak_stats
      SET current_streak = 1,
          longest_streak = GREATEST(s.longest_streak, 1),
          last_qualifying_date = today_local,
          total_sessions = s.total_sessions + 1,
          updated_at = now()
      WHERE user_id = NEW.user_id;
  END IF;

  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.update_streak_on_activity() FROM PUBLIC, anon, authenticated;

CREATE TRIGGER activities_streak_after_insert
  AFTER INSERT ON public.activities
  FOR EACH ROW EXECUTE FUNCTION public.update_streak_on_activity();

CREATE TRIGGER activities_streak_after_update
  AFTER UPDATE OF verified ON public.activities
  FOR EACH ROW
  WHEN (OLD.verified IS DISTINCT FROM NEW.verified AND NEW.verified = true)
  EXECUTE FUNCTION public.update_streak_on_activity();

-- =========================================================
-- Daily streak-reset job
-- =========================================================
CREATE OR REPLACE FUNCTION public.reset_lapsed_streaks()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.streak_stats s
  SET current_streak = 0, updated_at = now()
  FROM public.profiles p
  WHERE p.id = s.user_id
    AND s.current_streak > 0
    AND s.last_qualifying_date IS NOT NULL
    AND s.last_qualifying_date < ((now() AT TIME ZONE COALESCE(p.timezone, 'UTC'))::date - INTERVAL '1 day');
END;
$$;

REVOKE EXECUTE ON FUNCTION public.reset_lapsed_streaks() FROM PUBLIC, anon, authenticated;

CREATE EXTENSION IF NOT EXISTS pg_cron;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'reset_lapsed_streaks_daily') THEN
    PERFORM cron.schedule(
      'reset_lapsed_streaks_daily',
      '0 2 * * *',
      $cron$ SELECT public.reset_lapsed_streaks(); $cron$
    );
  END IF;
END $$;
