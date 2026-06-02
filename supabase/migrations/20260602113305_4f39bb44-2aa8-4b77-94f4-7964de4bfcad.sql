
-- 1. Recreate profiles_public view as SECURITY INVOKER (no SECURITY DEFINER behaviour)
DROP VIEW IF EXISTS public.profiles_public;
CREATE VIEW public.profiles_public
WITH (security_invoker = true) AS
SELECT
  id,
  full_name,
  avatar_url,
  city,
  country,
  bio,
  is_trainer,
  trainer_rate_usdc,
  trainer_specialties,
  trainer_experience,
  fitness_goals,
  created_at
FROM public.profiles;

GRANT SELECT ON public.profiles_public TO anon, authenticated;

-- 2. Add explicit owner-only SELECT policy on profiles (silences "RLS enabled no policy")
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = id);

-- 3. Restrict chatbot anon SELECT (drop blanket anon read of all anonymous chats/messages)
DROP POLICY IF EXISTS "Anonymous conversations allowed" ON public.chatbot_conversations;
CREATE POLICY "Anonymous can create conversations"
  ON public.chatbot_conversations
  FOR INSERT
  TO anon
  WITH CHECK (user_id IS NULL);

CREATE POLICY "Anonymous can update own conversation"
  ON public.chatbot_conversations
  FOR UPDATE
  TO anon
  USING (user_id IS NULL);

DROP POLICY IF EXISTS "Anonymous messages allowed select" ON public.chatbot_messages;
-- keep anon INSERT policy as-is

-- 4. Vendors: public view without sensitive fields, restrict main table to owner-only SELECT
DROP VIEW IF EXISTS public.vendors_public;
CREATE VIEW public.vendors_public
WITH (security_invoker = true) AS
SELECT
  id,
  business_name,
  description,
  logo_url,
  location,
  city,
  country,
  latitude,
  longitude,
  status,
  onchain_verified,
  verified_at,
  created_at
FROM public.vendors
WHERE status = 'verified';

GRANT SELECT ON public.vendors_public TO anon, authenticated;

DROP POLICY IF EXISTS "Authenticated users can view verified vendors" ON public.vendors;
CREATE POLICY "Owners can view own vendor"
  ON public.vendors
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- 5. Lock down SECURITY DEFINER helper functions: no public/anon/authenticated EXECUTE
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
