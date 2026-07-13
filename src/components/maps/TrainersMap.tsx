import { useEffect, useRef, useState } from 'react';
import { Loader2, MapPin } from 'lucide-react';
import { geocodeAddress } from '@/hooks/useNearMe';

const BROWSER_KEY = import.meta.env.VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY as string | undefined;
const TRACKING_ID = import.meta.env.VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_TRACKING_ID as string | undefined;

declare global {
  interface Window {
    google?: any;
    __fitconnectInitMap?: () => void;
  }
}

let mapsLoader: Promise<void> | null = null;
function loadMapsApi(): Promise<void> {
  if (window.google?.maps?.importLibrary) return Promise.resolve();
  if (mapsLoader) return mapsLoader;
  mapsLoader = new Promise<void>((resolve, reject) => {
    if (!BROWSER_KEY) return reject(new Error('Google Maps key missing'));
    window.__fitconnectInitMap = () => resolve();
    const existing = document.querySelector('script[data-fitconnect-gmaps]') as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error('Failed to load Google Maps')));
      return;
    }
    const script = document.createElement('script');
    script.setAttribute('data-fitconnect-gmaps', 'true');
    const params = new URLSearchParams({
      key: BROWSER_KEY,
      v: 'weekly',
      loading: 'async',
      callback: '__fitconnectInitMap',
    });
    if (TRACKING_ID) params.set('channel', TRACKING_ID);
    script.src = `https://maps.googleapis.com/maps/api/js?${params.toString()}`;
    script.async = true;
    script.defer = true;
    script.onerror = () => reject(new Error('Failed to load Google Maps'));
    document.head.appendChild(script);
  });
  return mapsLoader;
}

interface TrainerPoint {
  id: string;
  name: string;
  location: string;
}

interface TrainersMapProps {
  trainers: TrainerPoint[];
  origin?: { lat: number; lng: number } | null;
  height?: number;
  onSelect?: (id: string) => void;
}

export function TrainersMap({ trainers, origin, height = 420, onSelect }: TrainersMapProps) {
  const mapNodeRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        await loadMapsApi();
        if (cancelled || !mapNodeRef.current || !window.google?.maps?.importLibrary) return;
        const { Map } = (await window.google.maps.importLibrary('maps')) as any;
        const { Marker } = (await window.google.maps.importLibrary('marker')) as any;

        const points = await Promise.all(
          trainers.map(async (t) => {
            const c = await geocodeAddress(t.location);
            return c ? { ...t, ...c } : null;
          })
        );
        if (cancelled || !mapNodeRef.current) return;
        const valid = points.filter(Boolean) as (TrainerPoint & { lat: number; lng: number })[];

        const bounds = new window.google.maps.LatLngBounds();
        valid.forEach((p) => bounds.extend({ lat: p.lat, lng: p.lng }));
        if (origin) bounds.extend(origin);

        const center = origin ?? (valid[0] ? { lat: valid[0].lat, lng: valid[0].lng } : { lat: 0, lng: 0 });
        const map = new Map(mapNodeRef.current, {
          center,
          zoom: 4,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
        });

        valid.forEach((p) => {
          const m = new Marker({ position: { lat: p.lat, lng: p.lng }, map, title: p.name });
          if (onSelect) m.addListener('click', () => onSelect(p.id));
        });

        if (origin) {
          new Marker({
            position: origin,
            map,
            title: 'You',
            icon: {
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: '#4285F4',
              fillOpacity: 1,
              strokeColor: '#fff',
              strokeWeight: 2,
            },
          });
        }

        if (!bounds.isEmpty()) map.fitBounds(bounds, 60);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Map failed');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [trainers, origin, onSelect]);

  return (
    <div
      style={{ height }}
      className="w-full rounded-xl overflow-hidden border border-border/50 bg-muted/30 relative"
    >
      <div ref={mapNodeRef} className="absolute inset-0" />
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-muted/30 pointer-events-none">
          <Loader2 className="w-5 h-5 animate-spin mr-2" />
          <span className="text-sm">Loading map…</span>
        </div>
      )}
      {error && !loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground p-4 text-center">
          <MapPin className="w-6 h-6 mb-2 opacity-60" />
          <p className="text-sm">{error}</p>
        </div>
      )}
    </div>
  );
}
