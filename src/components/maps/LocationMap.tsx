import { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { MapPin } from 'lucide-react';

interface MapLocation {
  id: string;
  name: string;
  lat: number;
  lng: number;
  type: 'trainer' | 'vendor';
  description?: string;
}

interface LocationMapProps {
  locations: MapLocation[];
  center?: { lat: number; lng: number };
  zoom?: number;
  className?: string;
}

export function LocationMap({ locations, center, zoom = 4, className = '' }: LocationMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      setError('Google Maps API key not configured');
      return;
    }

    if ((window as any).google?.maps) {
      setMapLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => setMapLoaded(true);
    script.onerror = () => setError('Failed to load Google Maps');
    document.head.appendChild(script);

    return () => {
      markersRef.current.forEach((m) => m.setMap(null));
    };
  }, []);

  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;

    const gmaps = (window as any).google.maps;
    const defaultCenter = center || { lat: 0, lng: 20 };

    const map = new gmaps.Map(mapRef.current, {
      center: defaultCenter,
      zoom,
      styles: [
        { featureType: 'poi', stylers: [{ visibility: 'off' }] },
        { featureType: 'transit', stylers: [{ visibility: 'off' }] },
      ],
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
    });
    mapInstanceRef.current = map;

    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];

    const bounds = new gmaps.LatLngBounds();

    locations.forEach((loc) => {
      const marker = new gmaps.Marker({
        position: { lat: loc.lat, lng: loc.lng },
        map,
        title: loc.name,
        icon: {
          path: gmaps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: loc.type === 'trainer' ? '#E8612D' : '#8BC34A',
          fillOpacity: 0.9,
          strokeColor: '#fff',
          strokeWeight: 2,
        },
      });

      const infoWindow = new gmaps.InfoWindow({
        content: `
          <div style="padding:8px;min-width:180px;">
            <strong style="font-size:14px;">${loc.name}</strong>
            <p style="color:#666;margin:4px 0;font-size:12px;">${loc.description || (loc.type === 'trainer' ? 'Fitness Trainer' : 'Vendor')}</p>
            <a href="https://www.google.com/maps/dir/?api=1&destination=${loc.lat},${loc.lng}" 
               target="_blank" rel="noopener"
               style="color:#E8612D;font-size:12px;text-decoration:none;font-weight:600;">
              Get Directions →
            </a>
          </div>
        `,
      });

      marker.addListener('click', () => {
        infoWindow.open(map, marker);
      });

      markersRef.current.push(marker);
      bounds.extend({ lat: loc.lat, lng: loc.lng });
    });

    if (locations.length > 0) {
      map.fitBounds(bounds);
      if (locations.length === 1) {
        map.setZoom(14);
      }
    }
  }, [mapLoaded, locations, center, zoom]);

  if (error) {
    return (
      <Card className={`gradient-card border-border/50 p-8 text-center ${className}`}>
        <MapPin className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
        <p className="text-sm text-muted-foreground">{error}</p>
        <p className="text-xs text-muted-foreground mt-1">Add VITE_GOOGLE_MAPS_API_KEY to enable maps</p>
      </Card>
    );
  }

  return (
    <Card className={`gradient-card border-border/50 overflow-hidden ${className}`}>
      <div ref={mapRef} className="w-full h-full min-h-[300px]" />
    </Card>
  );
}

export function getDirectionsUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}
