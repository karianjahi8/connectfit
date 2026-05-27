import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MapPin, ExternalLink, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  if (typeof window === 'undefined') return Promise.reject(new Error('No window'));
  if (mapsLoader) return mapsLoader;

  mapsLoader = new Promise<void>((resolve, reject) => {
    if (!BROWSER_KEY) {
      reject(new Error('Google Maps browser key missing'));
      return;
    }
    if (window.google?.maps?.importLibrary) {
      resolve();
      return;
    }
    window.__fitconnectInitMap = () => resolve();
    const existing = document.querySelector('script[data-fitconnect-gmaps]');
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

interface LocationMapProps {
  address: string;
  label?: string;
  height?: number;
  className?: string;
}

export function LocationMap({ address, label, height = 280, className }: LocationMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const { data, error: fnErr } = await supabase.functions.invoke('geocode', {
          body: { address },
        });
        if (fnErr) throw fnErr;
        if (!data?.location) throw new Error('Address not found');
        if (cancelled) return;
        setCoords(data.location);

        await loadMapsApi();
        if (cancelled || !containerRef.current || !window.google?.maps) return;

        const center = { lat: data.location.lat, lng: data.location.lng };
        const map = new window.google.maps.Map(containerRef.current, {
          center,
          zoom: 14,
          disableDefaultUI: false,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
        });
        new window.google.maps.Marker({
          position: center,
          map,
          title: label ?? address,
        });
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Map failed to load');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [address, label]);

  const directionsUrl = coords
    ? `https://www.google.com/maps/dir/?api=1&destination=${coords.lat},${coords.lng}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

  return (
    <div className={className}>
      <div
        ref={containerRef}
        style={{ height }}
        className="w-full rounded-xl overflow-hidden border border-border/50 bg-muted/30 relative"
      >
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
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
      <div className="mt-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground min-w-0">
          <MapPin className="w-4 h-4 shrink-0" />
          <span className="truncate">{label ?? address}</span>
        </div>
        <Button asChild variant="outline" size="sm">
          <a href={directionsUrl} target="_blank" rel="noopener noreferrer">
            Directions <ExternalLink className="w-3.5 h-3.5 ml-1" />
          </a>
        </Button>
      </div>
    </div>
  );
}
