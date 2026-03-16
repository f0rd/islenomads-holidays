import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapView } from "@/components/Map";
import Footer from "@/components/Footer";
import { trpc } from "@/lib/trpc";

interface Marker {
  id: string;
  name: string;
  type: "island" | "atoll" | "dive" | "surf" | "snorkel";
  lat: number;
  lng: number;
  slug?: string;
}

export default function MaldivesMapHalfHalf() {
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<Map<string, any>>(new Map());

  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null);

  // Fetch island data
  const { data: islandData } = trpc.islandGuides.listWithActivitySpots.useQuery();

  // Build markers array
  const allMarkers: Marker[] = (islandData || [])
    .filter((island) => island.latitude && island.longitude)
    .map((island) => ({
      id: `island-${island.id}`,
      name: island.name,
      type: "island" as const,
      lat: typeof island.latitude === "number" ? island.latitude : parseFloat(String(island.latitude)) || 0,
      lng: typeof island.longitude === "number" ? island.longitude : parseFloat(String(island.longitude)) || 0,
      slug: island.slug,
    }));

  // Filter markers based on search and active filter
  const filteredMarkers = allMarkers.filter((marker) => {
    const matchesSearch = marker.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesFilter =
      activeFilter === "all" || marker.type === activeFilter;
    return matchesSearch && matchesFilter;
  });

  // Deduplicate markers by ID
  const deduplicatedMarkers = Array.from(
    new Map(filteredMarkers.map((m) => [m.id, m])).values()
  );

  const handleListItemClick = (markerId: string) => {
    setSelectedMarkerId(markerId);
    const marker = markersRef.current.get(markerId);
    if (marker && mapRef.current) {
      mapRef.current.panTo({
        lat: marker.lat,
        lng: marker.lng,
      });
      mapRef.current.setZoom(14);
    }
  };

  const getMarkerIcon = (type: string): string => {
    const icons: Record<string, string> = {
      island: "🏖️",
      atoll: "🏝️",
      dive: "🤿",
      surf: "🏄",
      snorkel: "🤽",
    };
    return icons[type] || "📍";
  };

  const getTypeLabel = (type: string): string => {
    const labels: Record<string, string> = {
      island: "Island",
      atoll: "Atoll",
      dive: "Dive Site",
      surf: "Surf Spot",
      snorkel: "Snorkeling Spot",
    };
    return labels[type] || type;
  };

  const getDetailLink = (marker: Marker): string => {
    if (marker.type === "island" && marker.slug) {
      return `/island/${marker.slug}`;
    }
    return "#";
  };

  const handleMapReady = (map: google.maps.Map) => {
    mapRef.current = map;
    addMarkers();
  };

  const addMarkers = () => {
    if (!mapRef.current) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => {
      if (marker.marker) {
        marker.marker.map = null;
      }
    });
    markersRef.current.clear();

    // Add new markers
    deduplicatedMarkers.forEach((markerData) => {
      const marker = new google.maps.marker.AdvancedMarkerElement({
        map: mapRef.current,
        position: { lat: markerData.lat, lng: markerData.lng },
        title: markerData.name,
        content: createMarkerContent(markerData),
      });

      marker.addEventListener("gmp-click", () => {
        setSelectedMarkerId(markerData.id);
      });

      markersRef.current.set(markerData.id, { ...markerData, marker });
    });
  };

  const createMarkerContent = (marker: Marker) => {
    const div = document.createElement("div");
    div.innerHTML = getMarkerIcon(marker.type);
    div.style.fontSize = "24px";
    div.style.cursor = "pointer";
    return div;
  };

  useEffect(() => {
    addMarkers();
  }, [deduplicatedMarkers]);

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Main content area with 50/50 split */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left side - Map (50%) */}
        <div className="w-1/2 relative border-r border-border">
          <MapView
            onMapReady={handleMapReady}
            initialCenter={{ lat: 4.1694, lng: 73.5093 }}
            initialZoom={7}
            className="w-full h-full"
          />
        </div>

        {/* Right side - Location Panel (50%) */}
        <div className="w-1/2 bg-background border-l border-border flex flex-col overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-border">
            <h2 className="text-lg font-semibold mb-4">Explore Locations</h2>

            {/* Search */}
            <Input
              placeholder="Search locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9"
            />
          </div>

          {/* Filters */}
          <div className="px-4 pt-4 pb-2 border-b border-border flex flex-wrap gap-2">
            <Button
              variant={activeFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter("all")}
              className="text-xs h-8"
            >
              All ({deduplicatedMarkers.length})
            </Button>
            <Button
              variant={activeFilter === "island" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter("island")}
              className="text-xs h-8"
            >
              🏖️ Islands
            </Button>
            <Button
              variant={activeFilter === "atoll" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter("atoll")}
              className="text-xs h-8"
            >
              🏝️ Atolls
            </Button>
            <Button
              variant={activeFilter === "dive" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter("dive")}
              className="text-xs h-8"
            >
              🤿 Dive
            </Button>
            <Button
              variant={activeFilter === "surf" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter("surf")}
              className="text-xs h-8"
            >
              🏄 Surf
            </Button>
          </div>

          {/* Location List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {deduplicatedMarkers.length > 0 ? (
              deduplicatedMarkers.map((marker) => (
                <div
                  key={marker.id}
                  onClick={() => handleListItemClick(marker.id)}
                  className={`p-3 rounded cursor-pointer transition-colors text-sm border ${
                    selectedMarkerId === marker.id
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-muted hover:bg-muted/80 border-transparent hover:border-border"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <span className="text-lg mt-0.5">{getMarkerIcon(marker.type)}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{marker.name}</p>
                      <Badge variant="secondary" className="text-xs mt-1">
                        {getTypeLabel(marker.type)}
                      </Badge>
                      {marker.type === "island" && marker.slug && (
                        <Link
                          href={getDetailLink(marker)}
                          className="text-xs text-primary hover:underline mt-1 block inline-block"
                        >
                          View Guide →
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No locations found</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
