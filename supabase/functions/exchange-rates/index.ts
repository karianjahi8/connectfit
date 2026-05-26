import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

interface ExchangeRates {
  avaxToUsd: number;
  usdcToUsd: number;
  usdRates: Record<string, number>;
  timestamp: number;
}

let cachedRates: ExchangeRates | null = null;
let cacheTime = 0;
const CACHE_DURATION = 5 * 60 * 1000;

// Simple in-memory rate limiter: max 60 requests per minute per IP
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW = 60_000;
const RATE_LIMIT_MAX = 60;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT_MAX;
}

const fallbackRates: ExchangeRates = {
  avaxToUsd: 35,
  usdcToUsd: 1,
  usdRates: {
    USD: 1, KES: 129, EUR: 0.92, GBP: 0.79, NGN: 1550,
    ZAR: 18.4, UGX: 3800, TZS: 2550, RWF: 1285, EGP: 49,
    INR: 83.2, AED: 3.67, SGD: 1.35, SAR: 3.75, CAD: 1.35,
    AUD: 1.53, BRL: 5.1, MXN: 17.1, JPY: 150,
  },
  timestamp: Date.now(),
};

async function fetchRates(): Promise<ExchangeRates> {
  const now = Date.now();
  if (cachedRates && now - cacheTime < CACHE_DURATION) {
    return cachedRates;
  }

  try {
    const [cryptoResponse, forexResponse] = await Promise.all([
      fetch('https://api.coingecko.com/api/v3/simple/price?ids=avalanche-2,usd-coin&vs_currencies=usd', {
        headers: { Accept: 'application/json' },
      }),
      fetch('https://open.er-api.com/v6/latest/USD', {
        headers: { Accept: 'application/json' },
      }),
    ]);

    if (!cryptoResponse.ok) throw new Error(`CoinGecko API error: ${cryptoResponse.status}`);
    if (!forexResponse.ok) throw new Error(`Forex API error: ${forexResponse.status}`);

    const cryptoData = await cryptoResponse.json();
    const forexData = await forexResponse.json();

    cachedRates = {
      avaxToUsd: cryptoData['avalanche-2']?.usd || fallbackRates.avaxToUsd,
      usdcToUsd: cryptoData['usd-coin']?.usd || fallbackRates.usdcToUsd,
      usdRates: { ...fallbackRates.usdRates, ...(forexData?.rates ?? {}) },
      timestamp: now,
    };
    cacheTime = now;
    return cachedRates;
  } catch (_error) {
    return { ...fallbackRates, timestamp: now };
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  // Allow GET and POST (supabase.functions.invoke uses POST)
  if (req.method !== 'GET' && req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 405,
    });
  }

  // Rate limiting
  const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (isRateLimited(clientIp)) {
    return new Response(JSON.stringify({ error: 'Too many requests' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 429,
    });
  }

  try {
    const rates = await fetchRates();
    return new Response(JSON.stringify(rates), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (_error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch exchange rates' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});