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

const SaveSchema = z.object({
  action: z.literal('save'),
  full_name: z.string().max(100).optional().nullable(),
  email: z.string().email().max(255).optional().nullable().or(z.literal('')),
  bio: z.string().max(500).optional().nullable(),
  city: z.string().max(100).optional().nullable(),
  country: z.string().max(100).optional().nullable(),
  phone: z.string().max(30).optional().nullable(),
  fitness_goals: z.array(z.string().max(50)).max(20).optional(),
  is_trainer: z.boolean().optional(),
  trainer_rate_usdc: z.number().min(0).max(100000).optional().nullable(),
  trainer_specialties: z.array(z.string().max(50)).max(30).optional(),
  trainer_experience: z.string().max(2000).optional().nullable(),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),
});

const LoadSchema = z.object({ action: z.literal('load') });

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    if (!PRIVY_APP_ID || !JWKS) throw new Error('VITE_PRIVY_APP_ID not configured');

    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Missing token' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const token = authHeader.slice(7);
    const { payload } = await jwtVerify(token, JWKS, {
      issuer: 'privy.io',
      audience: PRIVY_APP_ID,
    });
    const userId = payload.sub as string;
    if (!userId) throw new Error('Invalid token: no sub');

    const body = await req.json().catch(() => ({}));
    const admin = createClient(SUPABASE_URL, SERVICE_ROLE);

    if (body?.action === 'load') {
      LoadSchema.parse(body);
      const { data, error } = await admin
        .from('profiles').select('*').eq('id', userId).maybeSingle();
      if (error) throw error;
      return new Response(JSON.stringify({ profile: data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const parsed = SaveSchema.safeParse({ action: 'save', ...body });
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: parsed.error.flatten() }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const { action: _a, email, ...rest } = parsed.data;
    const row: Record<string, unknown> = {
      id: userId,
      ...rest,
      email: email === '' ? null : email,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await admin
      .from('profiles').upsert(row, { onConflict: 'id' }).select().single();
    if (error) throw error;

    return new Response(JSON.stringify({ profile: data }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    console.error('profile-rpc error:', msg);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
