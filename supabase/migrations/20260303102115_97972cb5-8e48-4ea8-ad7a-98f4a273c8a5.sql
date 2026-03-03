
-- Add country, city, and geolocation to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS country text,
  ADD COLUMN IF NOT EXISTS city text,
  ADD COLUMN IF NOT EXISTS latitude double precision,
  ADD COLUMN IF NOT EXISTS longitude double precision;

-- Add country, city, and geolocation to vendors
ALTER TABLE public.vendors
  ADD COLUMN IF NOT EXISTS country text,
  ADD COLUMN IF NOT EXISTS city text,
  ADD COLUMN IF NOT EXISTS latitude double precision,
  ADD COLUMN IF NOT EXISTS longitude double precision;

-- Create index for country-based filtering
CREATE INDEX IF NOT EXISTS idx_profiles_country ON public.profiles(country);
CREATE INDEX IF NOT EXISTS idx_vendors_country ON public.vendors(country);
