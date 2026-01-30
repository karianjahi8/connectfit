import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ExchangeRates {
  avaxToKes: number;
  usdcToKes: number;
  avaxToUsd: number;
  usdcToUsd: number;
  timestamp: number;
}

const FALLBACK_RATES: ExchangeRates = {
  avaxToKes: 4500,
  usdcToKes: 129,
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
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    placeholderData: FALLBACK_RATES,
  });
}

export function formatKES(amount: number): string {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function convertToKES(
  amount: number,
  currency: 'AVAX' | 'USDC',
  rates: ExchangeRates
): number {
  if (currency === 'AVAX') {
    return amount * rates.avaxToKes;
  }
  return amount * rates.usdcToKes;
}
