import { useState, useRef, useEffect, useMemo } from "react";
import { MapView } from "@/components/Map";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { MapPin, Search, X } from "lucide-react";
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

  // Filter markers based on search and filter
  const filteredMarkers = useMemo(() => {
    return allMarkers.filter((marker) => {
      const matchesSearch = marker.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesFilter =
        activeFilter === "all" ||
        (activeFilter === "atolls" && marker.type === "atoll") ||
        (activeFilter === "islands" && marker.type === "island") ||
        (activeFilter === "dive" && marker.type === "dive_site") ||
        (activeFilter === "surf" && marker.type === "surf_spot") ||
        (activeFilter === "snorkel" && marker.type === "snorkeling_spot");

      return matchesSearch && matchesFilter;
    });
  }, [allMarkers, searchQuery, activeFilter]);

  // Get marker icon based on type
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

  // Get marker color based on type
  const getMarkerColor = (type: string) => {
    const colors: Record<string, string> = {
      atoll: "#0d9488",
      island: "#22c55e",
      dive_site: "#3b82f6",
      surf_spot: "#f97316",
      snorkeling_spot: "#8b5cf6",
    };
    return colors[type] || "#6b7280";
  };

  // Handle map ready
  const handleMapReady = (map: google.maps.Map) => {
    mapRef.current = map;
    infoWindowRef.current = new google.maps.InfoWindow();

    // Set initial center to Maldives
    map.setCenter({ lat: 4.1694, lng: 73.5093 });
    map.setZoom(8);
  };

  // Add markers to map
  useEffect(() => {
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
      const content = document.createElement("div");
      content.innerHTML = getMarkerIcon(markerData.type);
      content.style.fontSize = "24px";
      content.style.cursor = "pointer";
      content.style.display = "flex";
      content.style.alignItems = "center";
      content.style.justifyContent = "center";
      content.style.width = "32px";
      content.style.height = "32px";

      const marker = new google.maps.marker.AdvancedMarkerElement({
        map: mapRef.current,
        position: { lat: markerData.lat, lng: markerData.lng },
        content,
      });

      // Create click handler
      const handleMarkerClick = () => {
        setSelectedMarker(markerData);
        setShowDetails(true);
      };

      // Add click listener to content element
      content.addEventListener("click", handleMarkerClick);

      // Also add listener to marker element if available
      if (marker.element) {
        marker.element.addEventListener("click", handleMarkerClick);
      }

      markersRef.current.set(markerData.id, { ...markerData, marker });
    });
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
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-card border-b border-border p-6">
          <div className="container mx-auto">
            <h1 className="text-3xl font-bold mb-2">Maldives Interactive Map</h1>
            <p className="text-muted-foreground">
              Explore atolls, islands, dive sites, and surf spots across the Maldives
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-card border-b border-border p-4 sticky top-0 z-10">
          <div className="container mx-auto space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search atolls, islands, dive sites, surf spots..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant={activeFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter("all")}
              >
                All Locations ({filteredMarkers.length})
              </Button>
              <Button
                variant={activeFilter === "atolls" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter("atolls")}
              >
                🏝️ Atolls (
                {filteredMarkers.filter((m) => m.type === "atoll").length})
              </Button>
              <Button
                variant={activeFilter === "islands" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter("islands")}
              >
                🏖️ Islands (
                {filteredMarkers.filter((m) => m.type === "island").length})
              </Button>
              <Button
                variant={activeFilter === "dive" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter("dive")}
              >
                🤿 Dive Sites (
                {filteredMarkers.filter((m) => m.type === "dive_site").length})
              </Button>
              <Button
                variant={activeFilter === "surf" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter("surf")}
              >
                🏄 Surf Spots (
                {filteredMarkers.filter((m) => m.type === "surf_spot").length})
              </Button>
              <Button
                variant={activeFilter === "snorkel" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter("snorkel")}
              >
                🤽 Snorkeling (
                {filteredMarkers.filter((m) => m.type === "snorkeling_spot").length})
              </Button>
            </div>
          </div>
        </div>

        {/* Map Container */}
        <div className="flex-1 w-full h-full">
          <MapView
            initialCenter={{ lat: 4.1694, lng: 73.5093 }}
            initialZoom={8}
            onMapReady={handleMapReady}
            className="w-full h-full"
          />
        </div>
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
