import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ExchangeRates {
  avaxToUsd: number;
  usdcToUsd: number;
  timestamp: number;
}

let cachedRates: ExchangeRates | null = null;
let cacheTime = 0;
const CACHE_DURATION = 5 * 60 * 1000;

async function fetchRates(): Promise<ExchangeRates> {
  const now = Date.now();
  
  if (cachedRates && (now - cacheTime) < CACHE_DURATION) {
    return cachedRates;
  }

  try {
    const cryptoResponse = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=avalanche-2,usd-coin&vs_currencies=usd',
      { headers: { 'Accept': 'application/json' } }
    );

    if (!cryptoResponse.ok) {
      throw new Error(`CoinGecko API error: ${cryptoResponse.status}`);
    }

    const cryptoData = await cryptoResponse.json();
    const avaxUsd = cryptoData['avalanche-2']?.usd || 35;
    const usdcUsd = cryptoData['usd-coin']?.usd || 1;

    cachedRates = {
      avaxToUsd: avaxUsd,
      usdcToUsd: usdcUsd,
      timestamp: now,
    };
    cacheTime = now;

    return cachedRates;
  } catch (error) {
    console.error('Error fetching rates:', error);
    return {
      avaxToUsd: 35,
      usdcToUsd: 1,
      timestamp: now,
    };
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
    return new Response(
      JSON.stringify({ error: 'Failed to fetch exchange rates' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
