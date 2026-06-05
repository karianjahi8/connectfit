// Cross-platform health bridge.
// On native iOS we use @perfood/capacitor-healthkit; on Android, capacitor-health-connect.
// In the browser, all functions become no-ops so the app keeps working.

import { Capacitor } from '@capacitor/core';

export type HealthSample = {
  type: 'steps' | 'run' | 'cycle' | 'workout' | 'yoga' | 'swim' | 'hike' | 'strength' | 'hiit' | 'other';
  source: 'healthkit' | 'health_connect';
  external_id?: string | null;
  started_at: string;
  ended_at?: string | null;
  duration_minutes: number;
  distance_km?: number | null;
  steps?: number | null;
  calories?: number | null;
  avg_heart_rate?: number | null;
};

export function isNativeHealthAvailable() {
  if (!Capacitor.isNativePlatform()) return false;
  const p = Capacitor.getPlatform();
  return p === 'ios' || p === 'android';
}

function mapWorkoutType(name: string): HealthSample['type'] {
  const n = (name || '').toLowerCase();
  if (n.includes('run')) return 'run';
  if (n.includes('cycl') || n.includes('bike')) return 'cycle';
  if (n.includes('yoga')) return 'yoga';
  if (n.includes('swim')) return 'swim';
  if (n.includes('hik')) return 'hike';
  if (n.includes('hiit')) return 'hiit';
  if (n.includes('strength') || n.includes('weight')) return 'strength';
  return 'workout';
}

export async function requestHealthPermissions(): Promise<boolean> {
  if (!isNativeHealthAvailable()) return false;
  const platform = Capacitor.getPlatform();
  try {
    if (platform === 'ios') {
      const { CapacitorHealthkit } = await import('@perfood/capacitor-healthkit');
      await CapacitorHealthkit.requestAuthorization({
        all: [''],
        read: ['steps', 'distance', 'calories', 'activity'],
        write: [],
      });
      return true;
    }
    if (platform === 'android') {
      const mod: any = await import('capacitor-health-connect');
      const HealthConnect = mod.HealthConnect;
      const result: any = await HealthConnect.requestHealthPermissions({
        read: ['Steps', 'Distance', 'TotalCaloriesBurned', 'ExerciseSession', 'HeartRate'],
        write: [],
      });
      return (result?.grantedPermissions?.length ?? 0) > 0;
    }
  } catch (e) {
    console.error('Health permission error', e);
  }
  return false;
}

export async function readRecentHealth(daysBack = 7): Promise<HealthSample[]> {
  if (!isNativeHealthAvailable()) return [];
  const end = new Date();
  const start = new Date(end.getTime() - daysBack * 86400000);
  const platform = Capacitor.getPlatform();
  const out: HealthSample[] = [];

  try {
    if (platform === 'ios') {
      const { CapacitorHealthkit } = await import('@perfood/capacitor-healthkit');
      const queryBase = {
        startDate: start.toISOString(),
        endDate: end.toISOString(),
        limit: 0,
      };

      // Aggregated daily steps
      try {
        const steps: any = await CapacitorHealthkit.queryHKitSampleType({
          ...queryBase, sampleName: 'stepCount',
        });
        for (const s of steps?.resultData ?? []) {
          out.push({
            type: 'steps', source: 'healthkit',
            external_id: s.uuid ?? null,
            started_at: s.startDate, ended_at: s.endDate,
            duration_minutes: Math.max(0, Math.round((new Date(s.endDate).getTime() - new Date(s.startDate).getTime()) / 60000)),
            steps: Math.round(s.value ?? 0),
          });
        }
      } catch {}

      // Workouts
      try {
        const workouts: any = await CapacitorHealthkit.queryHKitSampleType({
          ...queryBase, sampleName: 'workoutType',
        });
        for (const w of workouts?.resultData ?? []) {
          const duration = Math.max(0, Math.round((new Date(w.endDate).getTime() - new Date(w.startDate).getTime()) / 60000));
          out.push({
            type: mapWorkoutType(w.workoutActivityName ?? w.activityName ?? ''),
            source: 'healthkit',
            external_id: w.uuid ?? null,
            started_at: w.startDate, ended_at: w.endDate,
            duration_minutes: duration,
            distance_km: w.totalDistance ? Number(w.totalDistance) / 1000 : null,
            calories: w.totalEnergyBurned ? Math.round(Number(w.totalEnergyBurned)) : null,
          });
        }
      } catch {}
    }

    if (platform === 'android') {
      const { HealthConnect } = await import('capacitor-health-connect');
      const time = { startTime: start.toISOString(), endTime: end.toISOString() };

      try {
        const steps: any = await HealthConnect.readRecords({ type: 'Steps', timeRangeFilter: { type: 'between', ...time } });
        for (const r of steps?.records ?? []) {
          out.push({
            type: 'steps', source: 'health_connect',
            external_id: r.metadata?.id ?? null,
            started_at: r.startTime, ended_at: r.endTime,
            duration_minutes: Math.max(0, Math.round((new Date(r.endTime).getTime() - new Date(r.startTime).getTime()) / 60000)),
            steps: Number(r.count ?? 0),
          });
        }
      } catch {}

      try {
        const ex: any = await HealthConnect.readRecords({ type: 'ExerciseSession', timeRangeFilter: { type: 'between', ...time } });
        for (const r of ex?.records ?? []) {
          const duration = Math.max(0, Math.round((new Date(r.endTime).getTime() - new Date(r.startTime).getTime()) / 60000));
          out.push({
            type: mapWorkoutType(r.exerciseType ?? r.title ?? ''),
            source: 'health_connect',
            external_id: r.metadata?.id ?? null,
            started_at: r.startTime, ended_at: r.endTime,
            duration_minutes: duration,
          });
        }
      } catch {}
    }
  } catch (e) {
    console.error('readRecentHealth error', e);
  }
  return out;
}
