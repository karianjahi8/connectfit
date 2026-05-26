import { useCallback, useEffect, useState } from 'react';
import { getAccessToken, usePrivy } from '@privy-io/react-auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type ProfileRow = {
  id: string;
  full_name: string | null;
  email: string | null;
  bio: string | null;
  avatar_url: string | null;
  city: string | null;
  country: string | null;
  phone: string | null;
  wallet_address: string | null;
  latitude: number | null;
  longitude: number | null;
  fitness_goals: string[] | null;
  is_trainer: boolean;
  trainer_rate_usdc: number | null;
  trainer_specialties: string[] | null;
  trainer_experience: string | null;
};

async function invoke(body: Record<string, unknown>) {
  const token = await getAccessToken();
  if (!token) throw new Error('Not signed in');
  const { data, error } = await supabase.functions.invoke('profile-rpc', {
    body,
    headers: { Authorization: `Bearer ${token}` },
  });
  if (error) throw error;
  if ((data as any)?.error) throw new Error(JSON.stringify((data as any).error));
  return (data as { profile: ProfileRow | null }).profile;
}

export function useProfile() {
  const { ready, authenticated } = usePrivy();
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const reload = useCallback(async () => {
    if (!ready || !authenticated) return;
    setLoading(true);
    try {
      const p = await invoke({ action: 'load' });
      setProfile(p);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [ready, authenticated]);

  useEffect(() => { reload(); }, [reload]);

  const save = useCallback(async (patch: Partial<ProfileRow>) => {
    setSaving(true);
    try {
      const p = await invoke({ action: 'save', ...patch });
      setProfile(p);
      toast.success('Profile saved');
      return p;
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Save failed';
      toast.error(msg);
      throw e;
    } finally {
      setSaving(false);
    }
  }, []);

  return { profile, loading, saving, save, reload };
}
