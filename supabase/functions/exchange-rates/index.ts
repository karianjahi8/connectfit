import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

const fallbackRates: ExchangeRates = {
  avaxToUsd: 35,
  usdcToUsd: 1,
  usdRates: {
    USD: 1,
    KES: 129,
    EUR: 0.92,
    GBP: 0.79,
    NGN: 1550,
    ZAR: 18.4,
    UGX: 3800,
    TZS: 2550,
    RWF: 1285,
    EGP: 49,
    INR: 83.2,
    AED: 3.67,
    SGD: 1.35,
    SAR: 3.75,
    CAD: 1.35,
    AUD: 1.53,
    BRL: 5.1,
    MXN: 17.1,
    JPY: 150,
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

    if (!cryptoResponse.ok) {
      throw new Error(`CoinGecko API error: ${cryptoResponse.status}`);
    }

    if (!forexResponse.ok) {
      throw new Error(`Forex API error: ${forexResponse.status}`);
    }

    const cryptoData = await cryptoResponse.json();
    const forexData = await forexResponse.json();

    cachedRates = {
      avaxToUsd: cryptoData['avalanche-2']?.usd || fallbackRates.avaxToUsd,
      usdcToUsd: cryptoData['usd-coin']?.usd || fallbackRates.usdcToUsd,
      usdRates: {
        ...fallbackRates.usdRates,
        ...(forexData?.rates ?? {}),
      },
      timestamp: now,
    };
    cacheTime = now;

    return cachedRates;
  } catch (error) {
    console.error('Error fetching rates:', error);
    return { ...fallbackRates, timestamp: now };
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const rates = await fetchRates();

    return new Response(JSON.stringify(rates), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Exchange rates error:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch exchange rates' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
