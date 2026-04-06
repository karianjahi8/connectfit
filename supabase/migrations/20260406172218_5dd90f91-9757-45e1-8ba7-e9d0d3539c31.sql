-- Fix 1: Profiles - restrict to authenticated users only
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

CREATE POLICY "Authenticated users can view profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (true);

-- Fix 2: Vendors - restrict to authenticated users  
DROP POLICY IF EXISTS "Anyone can view verified vendors" ON public.vendors;

CREATE POLICY "Authenticated users can view verified vendors"
ON public.vendors
FOR SELECT
TO authenticated
USING (status = 'verified'::vendor_status OR auth.uid() = user_id);