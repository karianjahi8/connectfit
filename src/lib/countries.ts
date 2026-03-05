export interface CountryOption {
  code: string;
  name: string;
  currency: string;
  locale: string;
}

export const COUNTRIES: CountryOption[] = [
  { code: 'US', name: 'United States', currency: 'USD', locale: 'en-US' },
  { code: 'GB', name: 'United Kingdom', currency: 'GBP', locale: 'en-GB' },
  { code: 'CA', name: 'Canada', currency: 'CAD', locale: 'en-CA' },
  { code: 'AU', name: 'Australia', currency: 'AUD', locale: 'en-AU' },
  { code: 'AE', name: 'United Arab Emirates', currency: 'AED', locale: 'en-AE' },
  { code: 'DE', name: 'Germany', currency: 'EUR', locale: 'de-DE' },
  { code: 'FR', name: 'France', currency: 'EUR', locale: 'fr-FR' },
  { code: 'IN', name: 'India', currency: 'INR', locale: 'en-IN' },
  { code: 'JP', name: 'Japan', currency: 'JPY', locale: 'ja-JP' },
  { code: 'BR', name: 'Brazil', currency: 'BRL', locale: 'pt-BR' },
  { code: 'MX', name: 'Mexico', currency: 'MXN', locale: 'es-MX' },
  { code: 'NG', name: 'Nigeria', currency: 'NGN', locale: 'en-NG' },
  { code: 'ZA', name: 'South Africa', currency: 'ZAR', locale: 'en-ZA' },
  { code: 'KE', name: 'Kenya', currency: 'KES', locale: 'en-KE' },
  { code: 'UG', name: 'Uganda', currency: 'UGX', locale: 'en-UG' },
  { code: 'TZ', name: 'Tanzania', currency: 'TZS', locale: 'sw-TZ' },
  { code: 'RW', name: 'Rwanda', currency: 'RWF', locale: 'en-RW' },
  { code: 'EG', name: 'Egypt', currency: 'EGP', locale: 'ar-EG' },
  { code: 'SG', name: 'Singapore', currency: 'SGD', locale: 'en-SG' },
  { code: 'SA', name: 'Saudi Arabia', currency: 'SAR', locale: 'ar-SA' },
];

export function getCountryByCode(code?: string | null) {
  return COUNTRIES.find((country) => country.code === code) ?? COUNTRIES[0];
}

export function getCurrencyForCountry(code?: string | null) {
  return getCountryByCode(code).currency;
}

export function getLocaleForCountry(code?: string | null) {
  return getCountryByCode(code).locale;
}

export function getCountryName(code?: string | null) {
  return getCountryByCode(code).name;
}
