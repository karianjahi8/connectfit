import { useEffect, useState } from 'react';

const STORAGE_KEY = 'fitconnect-country';

export function useSelectedCountry(defaultCountry = 'US') {
  const [selectedCountry, setSelectedCountryState] = useState(defaultCountry);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setSelectedCountryState(stored);
    }
  }, []);

  const setSelectedCountry = (country: string) => {
    setSelectedCountryState(country);
    window.localStorage.setItem(STORAGE_KEY, country);
  };

  return { selectedCountry, setSelectedCountry };
}
