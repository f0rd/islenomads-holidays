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
  description?: string;
  slug?: string;
}

export default function MaldivesMapFullScreen() {
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<Map<string, any>>(new Map());
  const listItemsRef = useRef<Map<string, HTMLElement>>(new Map());

  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null);
  const [showPanel, setShowPanel] = useState(true);

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
      description: "",
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
      {/* Full-screen map */}
      <div className="flex-1 relative">
        <MapView
          onMapReady={handleMapReady}
          initialCenter={{ lat: 4.1694, lng: 73.5093 }}
          initialZoom={7}
          className="w-full h-full"
        />

        {/* Floating Search Panel */}
        <div
          className={`absolute top-4 left-4 bg-background border border-border rounded-lg shadow-lg p-4 w-80 max-h-[calc(100vh-100px)] flex flex-col transition-all duration-300 ${
            showPanel ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-full"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Explore</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPanel(!showPanel)}
              className="h-8 w-8 p-0"
            >
              ✕
            </Button>
          </div>

          {/* Search */}
          <Input
            placeholder="Search locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mb-4 h-9"
          />

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-4">
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
              🏖️
            </Button>
            <Button
              variant={activeFilter === "atoll" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter("atoll")}
              className="text-xs h-8"
            >
              🏝️
            </Button>
            <Button
              variant={activeFilter === "dive" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter("dive")}
              className="text-xs h-8"
            >
              🤿
            </Button>
            <Button
              variant={activeFilter === "surf" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter("surf")}
              className="text-xs h-8"
            >
              🏄
            </Button>
          </div>

          {/* Location List */}
          <div className="flex-1 overflow-y-auto space-y-2">
            {deduplicatedMarkers.map((marker) => (
              <div
                key={marker.id}
                ref={(el) => {
                  if (el) {
                    listItemsRef.current?.set(marker.id, el);
                  }
                }}
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
            ))}
          </div>
        </div>

        {/* Toggle Panel Button */}
        {!showPanel && (
          <Button
            variant="default"
            size="sm"
            onClick={() => setShowPanel(true)}
            className="absolute top-4 left-4 rounded-full h-10 w-10 p-0"
          >
            ☰
          </Button>
        )}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
