import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { getCurrencyForCountry, getLocaleForCountry } from '@/lib/countries';

export interface ExchangeRates {
  avaxToUsd: number;
  usdcToUsd: number;
  usdRates: Record<string, number>;
  timestamp: number;
}

const FALLBACK_RATES: ExchangeRates = {
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

async function fetchExchangeRates(): Promise<ExchangeRates> {
  const { data, error } = await supabase.functions.invoke('exchange-rates');

  if (error) {
    if (import.meta.env.DEV) {
      console.error('Error fetching exchange rates:', error);
    }
    return FALLBACK_RATES;
  }

  return {
    ...FALLBACK_RATES,
    ...(data as Partial<ExchangeRates>),
    usdRates: {
      ...FALLBACK_RATES.usdRates,
      ...((data as Partial<ExchangeRates>)?.usdRates ?? {}),
    },
  };
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

function toUsd(amount: number, currency: 'AVAX' | 'USDC', rates: ExchangeRates) {
  return amount * (currency === 'AVAX' ? rates.avaxToUsd : rates.usdcToUsd);
}

export function convertToUSDC(amount: number, currency: 'AVAX' | 'USDC', rates: ExchangeRates) {
  if (currency === 'USDC') return amount;
  return toUsd(amount, currency, rates) / rates.usdcToUsd;
}

export function convertToKES(amount: number, currency: 'AVAX' | 'USDC', rates: ExchangeRates): number {
  return convertToLocalCurrency(amount, currency, 'KE', rates);
}

export function convertToLocalCurrency(
  amount: number,
  currency: 'AVAX' | 'USDC',
  countryCode: string,
  rates: ExchangeRates
): number {
  const localCurrency = getCurrencyForCountry(countryCode);
  const localRate = rates.usdRates[localCurrency] ?? 1;
  return toUsd(amount, currency, rates) * localRate;
}

export function formatKES(amount: number): string {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatLocalCurrency(amount: number, countryCode: string): string {
  const currency = getCurrencyForCountry(countryCode);
  const locale = getLocaleForCountry(countryCode);

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: currency === 'JPY' ? 0 : 2,
  }).format(amount);
}
