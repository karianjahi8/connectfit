import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { createClient } from 'npm:@supabase/supabase-js@2';
import { createRemoteJWKSet, jwtVerify } from 'npm:jose@5';
import { z } from 'npm:zod@3';

const PRIVY_APP_ID = Deno.env.get('VITE_PRIVY_APP_ID');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const JWKS = PRIVY_APP_ID
  ? createRemoteJWKSet(new URL(`https://auth.privy.io/api/v1/apps/${PRIVY_APP_ID}/jwks.json`))
  : null;

const ACTIVITY_TYPES = [
  'steps', 'run', 'cycle', 'workout', 'yoga', 'swim', 'hike', 'strength', 'hiit', 'other',
] as const;
const SOURCES = ['healthkit', 'health_connect', 'manual', 'sensor', 'geofence'] as const;

const SampleSchema = z.object({
  type: z.enum(ACTIVITY_TYPES),
  source: z.enum(SOURCES),
  external_id: z.string().max(200).optional().nullable(),
  started_at: z.string().datetime(),
  ended_at: z.string().datetime().optional().nullable(),
  duration_minutes: z.number().int().min(0).max(24 * 60).default(0),
  distance_km: z.number().min(0).max(1000).optional().nullable(),
  steps: z.number().int().min(0).max(200000).optional().nullable(),
  calories: z.number().int().min(0).max(20000).optional().nullable(),
  avg_heart_rate: z.number().int().min(20).max(250).optional().nullable(),
  notes: z.string().max(500).optional().nullable(),
  metadata: z.record(z.unknown()).optional(),
});

const SyncSchema = z.object({
  action: z.literal('sync'),
  samples: z.array(SampleSchema).max(500),
});
const LogSchema = z.object({
  action: z.literal('log'),
  sample: SampleSchema,
});
const CheckinSchema = z.object({
  action: z.literal('checkin'),
  club_id: z.string().uuid().optional().nullable(),
  club_lat: z.number().optional().nullable(),
  club_lng: z.number().optional().nullable(),
  lat: z.number(),
  lng: z.number(),
});
const StatsSchema = z.object({
  action: z.literal('stats'),
  range_days: z.number().int().min(1).max(365).default(30),
});

type Sample = z.infer<typeof SampleSchema>;

const QUALIFY_MIN_DURATION = 20;
const QUALIFY_MIN_DISTANCE_KM = 1.0;
const QUALIFY_MIN_STEPS = 2000;
const QUALIFY_MIN_CALORIES = 100;
const QUALIFY_MIN_HEART_RATE = 110;

function qualifies(s: Sample): boolean {
  if (s.type === 'steps') return false;
  if (s.source !== 'healthkit' && s.source !== 'health_connect') return false;
  if ((s.duration_minutes ?? 0) < QUALIFY_MIN_DURATION) return false;
  return (
    (s.distance_km ?? 0) >= QUALIFY_MIN_DISTANCE_KM ||
    (s.steps ?? 0) >= QUALIFY_MIN_STEPS ||
    (s.calories ?? 0) >= QUALIFY_MIN_CALORIES ||
    (s.avg_heart_rate ?? 0) >= QUALIFY_MIN_HEART_RATE
  );
}

function haversineMeters(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    if (!PRIVY_APP_ID || !JWKS) throw new Error('Privy not configured');

    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Missing token' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const token = authHeader.slice(7);
    const { payload } = await jwtVerify(token, JWKS, {
      issuer: 'privy.io', audience: PRIVY_APP_ID,
    });
    const userId = payload.sub as string;
    if (!userId) throw new Error('Invalid token');

    const body = await req.json().catch(() => ({}));
    const admin = createClient(SUPABASE_URL, SERVICE_ROLE);
    const action = body?.action;

    // ---------- SYNC (batch from HealthKit / Health Connect) ----------
    if (action === 'sync') {
      const parsed = SyncSchema.safeParse(body);
      if (!parsed.success) {
        return new Response(JSON.stringify({ error: parsed.error.flatten() }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      const rows = parsed.data.samples.map((s) => ({
        user_id: userId,
        type: s.type,
        source: s.source,
        external_id: s.external_id ?? null,
        started_at: s.started_at,
        ended_at: s.ended_at ?? null,
        duration_minutes: s.duration_minutes ?? 0,
        distance_km: s.distance_km ?? null,
        steps: s.steps ?? null,
        calories: s.calories ?? null,
        avg_heart_rate: s.avg_heart_rate ?? null,
        verified: qualifies(s),
        notes: s.notes ?? null,
        metadata: s.metadata ?? {},
      }));

      if (rows.length > 0) {
        const withId = rows.filter((r) => r.external_id);
        const withoutId = rows.filter((r) => !r.external_id);
        if (withId.length > 0) {
          const { error } = await admin
            .from('activities')
            .upsert(withId, { onConflict: 'user_id,source,external_id', ignoreDuplicates: false });
          if (error) throw error;
        }
        if (withoutId.length > 0) {
          const { error } = await admin.from('activities').insert(withoutId);
          if (error) throw error;
        }
      }

      const { data: streak } = await admin
        .from('streak_stats').select('*').eq('user_id', userId).maybeSingle();
      return new Response(JSON.stringify({ ok: true, count: rows.length, streak }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // ---------- LOG (manual single entry) ----------
    if (action === 'log') {
      const parsed = LogSchema.safeParse(body);
      if (!parsed.success) {
        return new Response(JSON.stringify({ error: parsed.error.flatten() }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      const s = parsed.data.sample;
      const row = {
        user_id: userId,
        type: s.type,
        source: 'manual' as const,
        external_id: null,
        started_at: s.started_at,
        ended_at: s.ended_at ?? null,
        duration_minutes: s.duration_minutes ?? 0,
        distance_km: s.distance_km ?? null,
        steps: s.steps ?? null,
        calories: s.calories ?? null,
        avg_heart_rate: s.avg_heart_rate ?? null,
        verified: false, // manual alone never qualifies
        notes: s.notes ?? null,
        metadata: s.metadata ?? {},
      };
      const { data, error } = await admin.from('activities').insert(row).select().single();
      if (error) throw error;
      return new Response(JSON.stringify({ activity: data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // ---------- CHECKIN ----------
    if (action === 'checkin') {
      const parsed = CheckinSchema.safeParse(body);
      if (!parsed.success) {
        return new Response(JSON.stringify({ error: parsed.error.flatten() }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      const { club_id, club_lat, club_lng, lat, lng } = parsed.data;
      let distance: number | null = null;
      let verified = false;
      if (typeof club_lat === 'number' && typeof club_lng === 'number') {
        distance = haversineMeters(lat, lng, club_lat, club_lng);
        verified = distance <= 200;
      }

      const { data: checkin, error } = await admin
        .from('gym_checkins')
        .insert({
          user_id: userId,
          club_id: club_id ?? null,
          latitude: lat,
          longitude: lng,
          distance_meters: distance,
          verified_location: verified,
        })
        .select().single();
      if (error) throw error;

      // Pair with a qualifying activity within ±2h: promote the manual one if found
      if (verified) {
        const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
        const twoHoursAhead = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString();
        await admin
          .from('activities')
          .update({ verified: true, source: 'geofence' })
          .eq('user_id', userId)
          .eq('verified', false)
          .gte('started_at', twoHoursAgo)
          .lte('started_at', twoHoursAhead)
          .gte('duration_minutes', QUALIFY_MIN_DURATION);
      }

      const { data: streak } = await admin
        .from('streak_stats').select('*').eq('user_id', userId).maybeSingle();
      return new Response(JSON.stringify({ checkin, streak }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // ---------- STATS ----------
    if (action === 'stats') {
      const parsed = StatsSchema.safeParse(body);
      if (!parsed.success) {
        return new Response(JSON.stringify({ error: parsed.error.flatten() }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      const since = new Date(Date.now() - parsed.data.range_days * 86400000).toISOString();
      const [activitiesRes, streakRes, checkinsRes] = await Promise.all([
        admin.from('activities').select('*').eq('user_id', userId)
          .gte('started_at', since).order('started_at', { ascending: false }).limit(500),
        admin.from('streak_stats').select('*').eq('user_id', userId).maybeSingle(),
        admin.from('gym_checkins').select('*').eq('user_id', userId)
          .gte('checked_in_at', since).order('checked_in_at', { ascending: false }).limit(100),
      ]);
      if (activitiesRes.error) throw activitiesRes.error;
      return new Response(JSON.stringify({
        activities: activitiesRes.data ?? [],
        streak: streakRes.data ?? null,
        checkins: checkinsRes.data ?? [],
      }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify({ error: 'Unknown action' }), {
      status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('activity-rpc error:', e);
    return new Response(JSON.stringify({ error: 'Activity operation failed' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
