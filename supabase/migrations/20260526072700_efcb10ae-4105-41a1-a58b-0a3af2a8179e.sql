DROP VIEW IF EXISTS public.profiles_public;

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;

ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;
ALTER TABLE public.profiles ALTER COLUMN id TYPE text USING id::text;
ALTER TABLE public.profiles ALTER COLUMN id DROP DEFAULT;

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS email text,
  ADD COLUMN IF NOT EXISTS bio text,
  ADD COLUMN IF NOT EXISTS fitness_goals text[] DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS is_trainer boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS trainer_rate_usdc numeric,
  ADD COLUMN IF NOT EXISTS trainer_specialties text[] DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS trainer_experience text;

CREATE VIEW public.profiles_public AS
  SELECT id, full_name, avatar_url, city, country FROM public.profiles;
