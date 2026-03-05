import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ExchangeRates {
  avaxToKes: number;
  usdcToKes: number;
  avaxToUsd: number;
  usdcToUsd: number;
  timestamp: number;
}

// Cache rates for 5 minutes
let cachedRates: ExchangeRates | null = null;
let cacheTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

async function fetchRates(): Promise<ExchangeRates> {
  const now = Date.now();
  
  // Return cached rates if still valid
  if (cachedRates && (now - cacheTime) < CACHE_DURATION) {
    console.log('Returning cached exchange rates');
    return cachedRates;
  }

  console.log('Fetching fresh exchange rates...');

  try {
    // Fetch AVAX and USDC prices in USD from CoinGecko
    const cryptoResponse = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=avalanche-2,usd-coin&vs_currencies=usd,kes',
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (!cryptoResponse.ok) {
      console.error('CoinGecko API error:', cryptoResponse.status);
      throw new Error(`CoinGecko API error: ${cryptoResponse.status}`);
    }

    const cryptoData = await cryptoResponse.json();
    console.log('CoinGecko response:', JSON.stringify(cryptoData));

    // CoinGecko might not have direct KES rates, so we'll calculate
    const avaxUsd = cryptoData['avalanche-2']?.usd || 35;
    const usdcUsd = cryptoData['usd-coin']?.usd || 1;
    
    // Try to get KES rates directly, otherwise use USD rate * KES/USD
    let avaxKes = cryptoData['avalanche-2']?.kes;
    let usdcKes = cryptoData['usd-coin']?.kes;
    
    // If KES not available, use approximate USD/KES rate (129 as of 2026)
    const usdToKes = 129;
    
    if (!avaxKes) {
      avaxKes = avaxUsd * usdToKes;
    }
    if (!usdcKes) {
      usdcKes = usdcUsd * usdToKes;
    }

    cachedRates = {
      avaxToKes: avaxKes,
      usdcToKes: usdcKes,
      avaxToUsd: avaxUsd,
      usdcToUsd: usdcUsd,
      timestamp: now,
    };
    cacheTime = now;

    console.log('Updated rates:', JSON.stringify(cachedRates));
    return cachedRates;
  } catch (error) {
    console.error('Error fetching rates:', error);
    
    // Return fallback rates if API fails
    const fallbackRates: ExchangeRates = {
      avaxToKes: 4500, // ~$35 AVAX * 129 KES/USD
      usdcToKes: 129,  // 1 USDC = ~129 KES
      avaxToUsd: 35,
      usdcToUsd: 1,
      timestamp: now,
    };
    
    console.log('Using fallback rates:', JSON.stringify(fallbackRates));
    return fallbackRates;
  }
}

serve(async (req) => {
  // Handle CORS preflight
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
    return new Response(
      JSON.stringify({ error: 'Failed to fetch exchange rates' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
