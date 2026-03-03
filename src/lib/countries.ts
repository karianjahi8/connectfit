export interface Country {
  code: string;
  name: string;
  currency: string;
  currencySymbol: string;
  flag: string;
}

export const countries: Country[] = [
  { code: 'US', name: 'United States', currency: 'USD', currencySymbol: '$', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', currency: 'GBP', currencySymbol: '£', flag: '🇬🇧' },
  { code: 'KE', name: 'Kenya', currency: 'KES', currencySymbol: 'KSh', flag: '🇰🇪' },
  { code: 'NG', name: 'Nigeria', currency: 'NGN', currencySymbol: '₦', flag: '🇳🇬' },
  { code: 'ZA', name: 'South Africa', currency: 'ZAR', currencySymbol: 'R', flag: '🇿🇦' },
  { code: 'GH', name: 'Ghana', currency: 'GHS', currencySymbol: 'GH₵', flag: '🇬🇭' },
  { code: 'TZ', name: 'Tanzania', currency: 'TZS', currencySymbol: 'TSh', flag: '🇹🇿' },
  { code: 'UG', name: 'Uganda', currency: 'UGX', currencySymbol: 'USh', flag: '🇺🇬' },
  { code: 'IN', name: 'India', currency: 'INR', currencySymbol: '₹', flag: '🇮🇳' },
  { code: 'AE', name: 'UAE', currency: 'AED', currencySymbol: 'د.إ', flag: '🇦🇪' },
  { code: 'CA', name: 'Canada', currency: 'CAD', currencySymbol: 'C$', flag: '🇨🇦' },
  { code: 'AU', name: 'Australia', currency: 'AUD', currencySymbol: 'A$', flag: '🇦🇺' },
  { code: 'DE', name: 'Germany', currency: 'EUR', currencySymbol: '€', flag: '🇩🇪' },
  { code: 'FR', name: 'France', currency: 'EUR', currencySymbol: '€', flag: '🇫🇷' },
  { code: 'BR', name: 'Brazil', currency: 'BRL', currencySymbol: 'R$', flag: '🇧🇷' },
  { code: 'JP', name: 'Japan', currency: 'JPY', currencySymbol: '¥', flag: '🇯🇵' },
  { code: 'RW', name: 'Rwanda', currency: 'RWF', currencySymbol: 'FRw', flag: '🇷🇼' },
  { code: 'ET', name: 'Ethiopia', currency: 'ETB', currencySymbol: 'Br', flag: '🇪🇹' },
  { code: 'EG', name: 'Egypt', currency: 'EGP', currencySymbol: 'E£', flag: '🇪🇬' },
  { code: 'MX', name: 'Mexico', currency: 'MXN', currencySymbol: 'MX$', flag: '🇲🇽' },
];

export function getCountryByCode(code: string): Country | undefined {
  return countries.find((c) => c.code === code);
}

export function formatLocalCurrency(amount: number, currencyCode: string): string {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currencyCode} ${amount.toFixed(2)}`;
  }
}
