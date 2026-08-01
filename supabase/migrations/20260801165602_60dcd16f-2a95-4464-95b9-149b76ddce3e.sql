CREATE TABLE public.waitlist_signups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  persona TEXT,
  country TEXT,
  referral_source TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX waitlist_signups_email_key ON public.waitlist_signups (lower(email));

GRANT INSERT ON public.waitlist_signups TO anon;
GRANT INSERT ON public.waitlist_signups TO authenticated;
GRANT ALL ON public.waitlist_signups TO service_role;

ALTER TABLE public.waitlist_signups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can join the waitlist"
ON public.waitlist_signups
FOR INSERT
TO anon, authenticated
WITH CHECK (
  email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND length(email) <= 254
  AND (persona IS NULL OR persona IN ('trainer','client','club','merchant'))
  AND (country IS NULL OR length(country) <= 64)
  AND (referral_source IS NULL OR length(referral_source) <= 120)
);