import { useRef, useState, useMemo, useEffect } from "react";
import { MapView } from "@/components/Map";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { MapPin, Search, X, ChevronDown, ChevronUp } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { getIslandGuideUrl } from "@shared/locations";
import Footer from "@/components/Footer";

interface Marker {
  id: number;
  name: string;
  type: "atoll" | "island" | "dive_site" | "surf_spot" | "snorkeling_spot";
  lat: number;
  lng: number;
  description?: string;
  slug?: string;
  marker?: google.maps.marker.AdvancedMarkerElement;
}

export default function MaldivesMapGoogle() {
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<Map<number, Marker>>(new Map());
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMarker, setSelectedMarker] = useState<Marker | null>(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [showDetails, setShowDetails] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Fetch data
  const { data: atolls = [] } = trpc.atolls.list.useQuery();
  const { data: islands = [] } = trpc.islandGuides.list.useQuery();
  const { data: activitySpots = [] } = trpc.attractionGuides.list.useQuery();

  // Prepare markers data
  const allMarkers = useMemo(() => {
    const markers: Marker[] = [];
    const seen = new Set<number>();

    // Add atolls
    (atolls as any[]).forEach((atoll) => {
      if (atoll.latitude && atoll.longitude && !seen.has(atoll.id)) {
        markers.push({
          id: atoll.id,
          name: atoll.name,
          type: "atoll",
          lat: parseFloat(atoll.latitude),
          lng: parseFloat(atoll.longitude),
          description: atoll.description,
          slug: atoll.slug,
        });
        seen.add(atoll.id);
      }
    });

    // Add islands
    (islands as any[]).forEach((island) => {
      if (
        island.latitude &&
        island.longitude &&
        island.published === 1 &&
        island.contentType !== "point_of_interest" &&
        !seen.has(island.id)
      ) {
        markers.push({
          id: island.id,
          name: island.name,
          type: "island",
          lat: parseFloat(island.latitude),
          lng: parseFloat(island.longitude),
          description: island.overview,
          slug: island.slug,
        });
        seen.add(island.id);
      }
    });

    // Add activity spots
    (activitySpots as any[]).forEach((spot) => {
      if (
        spot.latitude &&
        spot.longitude &&
        spot.published === 1 &&
        !seen.has(spot.id)
      ) {
        markers.push({
          id: spot.id,
          name: spot.name,
          type: spot.spotType,
          lat: parseFloat(spot.latitude),
          lng: parseFloat(spot.longitude),
          description: spot.description,
          slug: spot.slug,
        });
        seen.add(spot.id);
      }
    });

    return markers;
  }, [atolls, islands, activitySpots]);

  // Filter markers
  const filteredMarkers = useMemo(() => {
    let filtered = allMarkers;

    // Filter by type
    if (activeFilter === "atolls") {
      filtered = filtered.filter((m) => m.type === "atoll");
    } else if (activeFilter === "islands") {
      filtered = filtered.filter((m) => m.type === "island");
    } else if (activeFilter === "dive") {
      filtered = filtered.filter((m) => m.type === "dive_site");
    } else if (activeFilter === "surf") {
      filtered = filtered.filter((m) => m.type === "surf_spot");
    } else if (activeFilter === "snorkel") {
      filtered = filtered.filter((m) => m.type === "snorkeling_spot");
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((m) =>
        m.name.toLowerCase().includes(query) ||
        m.description?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [allMarkers, activeFilter, searchQuery]);

  const getMarkerIcon = (type: string) => {
    const icons: Record<string, string> = {
      atoll: "🏝️",
      island: "🏖️",
      dive_site: "🤿",
      surf_spot: "🏄",
      snorkeling_spot: "🤽",
    };
    return icons[type] || "📍";
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
    filteredMarkers.forEach((markerData) => {
      const marker = new google.maps.marker.AdvancedMarkerElement({
        map: mapRef.current,
        position: { lat: markerData.lat, lng: markerData.lng },
        title: markerData.name,
        content: createMarkerContent(markerData),
      });

      marker.addEventListener("gmp-click", () => {
        setSelectedMarker(markerData);
        setShowDetails(true);
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
  }, [filteredMarkers]);

  const getDetailLink = () => {
    if (!selectedMarker) return "#";
    if (selectedMarker.type === "island") {
      return getIslandGuideUrl(selectedMarker.slug || "");
    }
    return "#";
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      atoll: "Atoll",
      island: "Island",
      dive_site: "Dive Site",
      surf_spot: "Surf Spot",
      snorkeling_spot: "Snorkeling Spot",
    };
    return labels[type] || type;
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Compact Header */}
      <div className="bg-card border-b border-border px-4 py-2 flex items-center justify-between">
        <div className="flex-1">
          <h1 className="text-lg font-bold">Maldives Map</h1>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className="gap-2"
        >
          {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          Filters
        </Button>
      </div>

      {/* Collapsible Filters */}
      {showFilters && (
        <div className="bg-card border-b border-border p-3 space-y-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-9"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-1">
            <Button
              variant={activeFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter("all")}
              className="text-xs"
            >
              All ({filteredMarkers.length})
            </Button>
            <Button
              variant={activeFilter === "atolls" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter("atolls")}
              className="text-xs"
            >
              🏝️ Atolls
            </Button>
            <Button
              variant={activeFilter === "islands" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter("islands")}
              className="text-xs"
            >
              🏖️ Islands
            </Button>
            <Button
              variant={activeFilter === "dive" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter("dive")}
              className="text-xs"
            >
              🤿 Dive
            </Button>
            <Button
              variant={activeFilter === "surf" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter("surf")}
              className="text-xs"
            >
              🏄 Surf
            </Button>
            <Button
              variant={activeFilter === "snorkel" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter("snorkel")}
              className="text-xs"
            >
              🤽 Snorkel
            </Button>
          </div>
        </div>
      )}

      {/* Map Container - Takes up most of the space */}
      <div className="flex-1 w-full overflow-hidden">
        <MapView
          initialCenter={{ lat: 4.1694, lng: 73.5093 }}
          initialZoom={8}
          onMapReady={handleMapReady}
          className="w-full h-full"
        />
      </div>

      {/* Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{getMarkerIcon(selectedMarker?.type || "")}</span>
              <DialogTitle>{selectedMarker?.name}</DialogTitle>
            </div>
          </DialogHeader>

          {selectedMarker && (
            <div className="space-y-4">
              <div>
                <Badge variant="secondary">{getTypeLabel(selectedMarker.type)}</Badge>
              </div>

              {selectedMarker.description && (
                <div>
                  <p className="text-sm text-muted-foreground">
                    {selectedMarker.description}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-muted-foreground">Latitude</p>
                  <p className="font-mono">{selectedMarker.lat.toFixed(4)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Longitude</p>
                  <p className="font-mono">{selectedMarker.lng.toFixed(4)}</p>
                </div>
              </div>

              {selectedMarker.type === "island" && selectedMarker.slug && (
                <Link href={getDetailLink()}>
                  <Button className="w-full">View Island Guide</Button>
                </Link>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <Footer />
    </div>
  );
}
