import { useCallback, useState } from 'react';
import { getAccessToken } from '@privy-io/react-auth';
import { toast } from 'sonner';

type Coords = { lat: number; lng: number };

const cache = new Map<string, Coords>();
const GEOCODE_URL = `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co/functions/v1/geocode`;

export function haversineKm(a: Coords, b: Coords) {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(x));
}

export async function geocodeAddress(address: string): Promise<Coords | null> {
  if (cache.has(address)) return cache.get(address)!;
  try {
    const token = await getAccessToken().catch(() => null);
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
      Authorization: `Bearer ${token ?? import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    };
    const res = await fetch(GEOCODE_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({ address }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const loc = data?.location;
    if (!loc) return null;
    const coords = { lat: loc.lat, lng: loc.lng };
    cache.set(address, coords);
    return coords;
  } catch (e) {
    console.error('geocode failed', address, e);
    return null;
  }
}

export function useNearMe() {
  const [origin, setOrigin] = useState<Coords | null>(null);
  const [locating, setLocating] = useState(false);

  const locate = useCallback(() => {
    if (!navigator.geolocation) {
      toast.error('Geolocation not supported by this browser');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setOrigin({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocating(false);
        toast.success('Sorted by distance from your location');
      },
      (err) => {
        setLocating(false);
        toast.error(err.message || 'Could not get your location');
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
    );
  }, []);

  const clear = useCallback(() => setOrigin(null), []);

  return { origin, locating, locate, clear };
}
