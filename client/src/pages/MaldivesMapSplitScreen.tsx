import { useRef, useState, useMemo, useEffect } from "react";
import { MapView } from "@/components/Map";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, MapPin } from "lucide-react";
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

export default function MaldivesMapSplitScreen() {
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<Map<number, Marker>>(new Map());
  const listItemsRef = useRef<Map<number, HTMLDivElement>>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMarkerId, setSelectedMarkerId] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState("all");

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
        setSelectedMarkerId(markerData.id);
        // Scroll to the item in the list
        const listItem = listItemsRef.current?.get(markerData.id);
        if (listItem) {
          listItem.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
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

  const handleListItemClick = (markerId: number) => {
    setSelectedMarkerId(markerId);
    // Pan map to marker
    const marker = markersRef.current.get(markerId);
    if (marker && mapRef.current) {
      mapRef.current.panTo({ lat: marker.lat, lng: marker.lng });
      mapRef.current.setZoom(12);
    }
  };

  const getDetailLink = (marker: Marker) => {
    if (marker.type === "island") {
      return getIslandGuideUrl(marker.slug || "");
    }
    return "#";
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 py-3">
        <h1 className="text-2xl font-bold">Maldives Interactive Map</h1>
        <p className="text-sm text-muted-foreground">Explore atolls, islands, dive sites, and surf spots</p>
      </div>

      {/* Main Content - Split Screen */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side - Map (80%) */}
        <div className="flex-1 bg-background">
          <MapView
            initialCenter={{ lat: 4.1694, lng: 73.5093 }}
            initialZoom={8}
            onMapReady={handleMapReady}
            className="w-full h-full"
          />
        </div>

        {/* Right Side - Location List (20%) */}
        <div className="w-1/5 bg-card border-l border-border flex flex-col">
          {/* Search and Filters */}
          <div className="p-3 border-b border-border space-y-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-2 top-2.5 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-9 text-sm"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-1">
              <Button
                variant={activeFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter("all")}
                className="text-xs h-8"
              >
                All
              </Button>
              <Button
                variant={activeFilter === "islands" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter("islands")}
                className="text-xs h-8"
              >
                🏖️
              </Button>
              <Button
                variant={activeFilter === "atolls" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter("atolls")}
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

            {/* Count */}
            <div className="text-xs text-muted-foreground">
              {filteredMarkers.length} locations
            </div>
          </div>

          {/* Location List */}
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
              {filteredMarkers.map((marker) => (
                <div
                  key={marker.id}
                  ref={(el) => {
                    if (el && !listItemsRef.current) {
                      listItemsRef.current = new Map();
                    }
                    if (el) {
                      listItemsRef.current?.set(marker.id, el);
                    }
                  }}
                  onClick={() => handleListItemClick(marker.id)}
                  className={`p-2 rounded cursor-pointer transition-colors text-sm ${
                    selectedMarkerId === marker.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-background hover:bg-muted"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <span className="text-lg mt-0.5">{getMarkerIcon(marker.type)}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{marker.name}</p>
                      <Badge variant="secondary" className="text-xs mt-1">
                        {getTypeLabel(marker.type)}
                      </Badge>
                      {marker.description && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {marker.description}
                        </p>
                      )}
                      {marker.type === "island" && marker.slug && (
                        <Link href={getDetailLink(marker)}>
                          <a className="text-xs text-primary hover:underline mt-1 block">
                            View Guide →
                          </a>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
