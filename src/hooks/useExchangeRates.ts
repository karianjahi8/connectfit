import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ExchangeRates {
  avaxToUsd: number;
  usdcToUsd: number;
  timestamp: number;
}

const FALLBACK_RATES: ExchangeRates = {
  avaxToUsd: 35,
  usdcToUsd: 1,
  timestamp: Date.now(),
};

async function fetchExchangeRates(): Promise<ExchangeRates> {
  const { data, error } = await supabase.functions.invoke('exchange-rates');
  
  if (error) {
    console.error('Error fetching exchange rates:', error);
    return FALLBACK_RATES;
  }
  
  return data as ExchangeRates;
}

export function useExchangeRates() {
  return useQuery({
    queryKey: ['exchange-rates'],
    queryFn: fetchExchangeRates,
    staleTime: 5 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
    placeholderData: FALLBACK_RATES,
  });
}

export function formatUSD(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function convertToUSD(
  amount: number,
  currency: 'AVAX' | 'USDC',
  rates: ExchangeRates
): number {
  if (currency === 'AVAX') {
    return amount * rates.avaxToUsd;
  }
  return amount * rates.usdcToUsd;
}

// Keep legacy exports for backward compat
export function formatKES(amount: number): string {
  return formatUSD(amount);
}

export function convertToKES(
  amount: number,
  currency: 'AVAX' | 'USDC',
  rates: ExchangeRates
): number {
  return convertToUSD(amount, currency, rates);
}
