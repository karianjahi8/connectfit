import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

const GATEWAY_URL = 'https://connector-gateway.lovable.dev/google_maps';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const GOOGLE_MAPS_API_KEY = Deno.env.get('GOOGLE_MAPS_API_KEY');
    if (!LOVABLE_API_KEY || !GOOGLE_MAPS_API_KEY) {
      console.error('geocode: missing keys');
      return new Response(JSON.stringify({ error: 'Service unavailable' }), {
        status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { address } = await req.json();
    if (!address || typeof address !== 'string' || address.length > 300) {
      return new Response(JSON.stringify({ error: 'Invalid address' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const res = await fetch(
      `${GATEWAY_URL}/maps/api/geocode/json?address=${encodeURIComponent(address)}`,
      {
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          'X-Connection-Api-Key': GOOGLE_MAPS_API_KEY,
        },
      },
    );
    const data = await res.json();
    if (!res.ok) {
      console.error('geocode upstream failed:', res.status, data);
      return new Response(JSON.stringify({ error: 'Geocoding unavailable' }), {
        status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const first = data.results?.[0];
    const location = first?.geometry?.location ?? null;
    const formatted = first?.formatted_address ?? null;

    return new Response(
      JSON.stringify({ location, formatted, status: data.status }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (err) {
    console.error('geocode error:', err);
    return new Response(JSON.stringify({ error: 'Geocoding unavailable' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
