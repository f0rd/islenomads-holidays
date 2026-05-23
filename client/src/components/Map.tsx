import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { usePersistFn } from "@/hooks/usePersistFn";
import { cn } from "@/lib/utils";

const ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

interface LatLngLiteral {
  lat: number;
  lng: number;
}

interface MapViewProps {
  className?: string;
  initialCenter?: LatLngLiteral;
  initialZoom?: number;
  onMapReady?: (map: mapboxgl.Map) => void;
}

export function MapView({
  className,
  initialCenter = { lat: 37.7749, lng: -122.4194 },
  initialZoom = 12,
  onMapReady,
}: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [error, setError] = useState<string | null>(null);

  const init = usePersistFn(() => {
    if (!ACCESS_TOKEN) {
      setError("VITE_MAPBOX_TOKEN is not set");
      return;
    }
    if (!mapContainer.current || map.current) return;

    mapboxgl.accessToken = ACCESS_TOKEN;

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/satellite-streets-v12",
        center: [initialCenter.lng, initialCenter.lat],
        zoom: initialZoom,
      });

      map.current.addControl(new mapboxgl.NavigationControl(), "top-right");
      map.current.addControl(new mapboxgl.FullscreenControl(), "top-right");

      map.current.on("load", () => {
        if (onMapReady && map.current) onMapReady(map.current);
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to load map");
    }
  });

  useEffect(() => {
    init();
    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, [init]);

  if (error) {
    return (
      <div
        className={cn(
          "w-full h-[500px] flex items-center justify-center bg-muted text-muted-foreground text-sm p-4 text-center",
          className,
        )}
      >
        Map unavailable. {error}
      </div>
    );
  }

  return <div ref={mapContainer} className={cn("w-full h-[500px]", className)} />;
}

export type { LatLngLiteral };
