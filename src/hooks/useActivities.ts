import { useCallback, useEffect, useState } from 'react';
import { getAccessToken, usePrivy } from '@privy-io/react-auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { isNativeHealthAvailable, readRecentHealth, requestHealthPermissions } from '@/lib/health';

export type ActivityRow = {
  id: string;
  user_id: string;
  type: 'steps' | 'run' | 'cycle' | 'workout' | 'yoga' | 'swim' | 'hike' | 'strength' | 'hiit' | 'other';
  source: 'healthkit' | 'health_connect' | 'manual' | 'sensor' | 'geofence';
  started_at: string;
  ended_at: string | null;
  duration_minutes: number;
  distance_km: number | null;
  steps: number | null;
  calories: number | null;
  avg_heart_rate: number | null;
  verified: boolean;
  notes: string | null;
};

export type StreakRow = {
  user_id: string;
  current_streak: number;
  longest_streak: number;
  last_qualifying_date: string | null;
  total_sessions: number;
};

export type CheckinRow = {
  id: string;
  user_id: string;
  club_id: string | null;
  checked_in_at: string;
  distance_meters: number | null;
  verified_location: boolean;
};

async function invoke(body: Record<string, unknown>) {
  const token = await getAccessToken();
  if (!token) throw new Error('Not signed in');
  const { data, error } = await supabase.functions.invoke('activity-rpc', {
    body,
    headers: { Authorization: `Bearer ${token}` },
  });
  if (error) throw error;
  if ((data as any)?.error) throw new Error(JSON.stringify((data as any).error));
  return data as any;
}

export function useActivities(rangeDays = 30) {
  const { ready, authenticated } = usePrivy();
  const [activities, setActivities] = useState<ActivityRow[]>([]);
  const [streak, setStreak] = useState<StreakRow | null>(null);
  const [checkins, setCheckins] = useState<CheckinRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const reload = useCallback(async () => {
    if (!ready || !authenticated) return;
    setLoading(true);
    try {
      const res = await invoke({ action: 'stats', range_days: rangeDays });
      setActivities(res.activities ?? []);
      setStreak(res.streak ?? null);
      setCheckins(res.checkins ?? []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [ready, authenticated, rangeDays]);

  useEffect(() => { reload(); }, [reload]);

  const syncFromDevice = useCallback(async () => {
    if (!isNativeHealthAvailable()) {
      toast.info('Health sync is only available in the mobile app');
      return;
    }
    setSyncing(true);
    try {
      const granted = await requestHealthPermissions();
      if (!granted) {
        toast.error('Permission denied');
        return;
      }
      const samples = await readRecentHealth(7);
      if (samples.length === 0) {
        toast.info('No new activity found in the last 7 days');
        return;
      }
      const res = await invoke({ action: 'sync', samples });
      toast.success(`Synced ${res.count} sessions`);
      await reload();
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Sync failed';
      toast.error(msg);
    } finally {
      setSyncing(false);
    }
  }, [reload]);

  const logManual = useCallback(async (sample: Omit<ActivityRow, 'id' | 'user_id' | 'verified' | 'source'> & { source?: string }) => {
    try {
      await invoke({
        action: 'log',
        sample: {
          type: sample.type,
          source: 'manual',
          started_at: sample.started_at,
          ended_at: sample.ended_at,
          duration_minutes: sample.duration_minutes,
          distance_km: sample.distance_km,
          steps: sample.steps,
          calories: sample.calories,
          avg_heart_rate: sample.avg_heart_rate,
          notes: sample.notes,
        },
      });
      toast.success('Activity logged');
      await reload();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Log failed');
    }
  }, [reload]);

  const checkin = useCallback(async (opts: { club_id?: string | null; club_lat?: number | null; club_lng?: number | null }) => {
    try {
      const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true, timeout: 10000 })
      );
      const res = await invoke({
        action: 'checkin',
        club_id: opts.club_id ?? null,
        club_lat: opts.club_lat ?? null,
        club_lng: opts.club_lng ?? null,
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      });
      if (res.checkin?.verified_location) {
        toast.success('Checked in! Streak updated.');
      } else {
        toast.success('Checked in (unverified location)');
      }
      await reload();
      return res.checkin as CheckinRow;
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Check-in failed';
      toast.error(msg);
      throw e;
    }
  }, [reload]);

  return { activities, streak, checkins, loading, syncing, reload, syncFromDevice, logManual, checkin };
}
