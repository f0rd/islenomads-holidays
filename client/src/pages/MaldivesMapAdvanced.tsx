import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { MapView } from "@/components/Map";
import Footer from "@/components/Footer";
import { trpc } from "@/lib/trpc";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Marker {
  id: string;
  index: number;
  name: string;
  type: "island" | "atoll" | "dive" | "surf" | "snorkel";
  lat: number;
  lng: number;
  slug?: string;
  image?: string;
  description?: string;
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string; marker: string }> = {
  island: { bg: "bg-blue-100", text: "text-blue-900", marker: "#3B82F6" },
  atoll: { bg: "bg-green-100", text: "text-green-900", marker: "#10B981" },
  dive: { bg: "bg-purple-100", text: "text-purple-900", marker: "#A855F7" },
  surf: { bg: "bg-orange-100", text: "text-orange-900", marker: "#F97316" },
  snorkel: { bg: "bg-cyan-100", text: "text-cyan-900", marker: "#06B6D4" },
};

export default function MaldivesMapAdvanced() {
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<Map<string, any>>(new Map());

  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null);
  const [visitedLocations, setVisitedLocations] = useState<Set<string>>(new Set());
  const [carouselIndex, setCarouselIndex] = useState(0);

  // Fetch island data
  const { data: islandData } = trpc.islandGuides.listWithActivitySpots.useQuery();

  // Build markers array with index
  const allMarkers: Marker[] = (islandData || [])
    .filter((island) => island.latitude && island.longitude)
    .map((island, idx) => ({
      id: `island-${island.id}`,
      index: idx + 1,
      name: island.name,
      type: "island" as const,
      lat: typeof island.latitude === "number" ? island.latitude : parseFloat(String(island.latitude)) || 0,
      lng: typeof island.longitude === "number" ? island.longitude : parseFloat(String(island.longitude)) || 0,
      slug: island.slug,
      image: island.images?.[0] || "/images/default-island.jpg",
      description: island.overview?.substring(0, 100) + "..." || "Discover this beautiful island",
    }));

  // Filter markers based on search and active filter
  const filteredMarkers = allMarkers.filter((marker) => {
    const matchesSearch = marker.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === "all" || marker.type === activeFilter;
    return matchesSearch && matchesFilter;
  });

  // Deduplicate markers by ID
  const deduplicatedMarkers = Array.from(
    new Map(filteredMarkers.map((m) => [m.id, m])).values()
  );

  // Featured islands (first 5)
  const featuredMarkers = allMarkers.slice(0, 5);

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

  const toggleVisited = (markerId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newVisited = new Set(visitedLocations);
    if (newVisited.has(markerId)) {
      newVisited.delete(markerId);
    } else {
      newVisited.add(markerId);
    }
    setVisitedLocations(newVisited);
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
      const colors = CATEGORY_COLORS[markerData.type] || CATEGORY_COLORS.island;
      
      const marker = new google.maps.marker.AdvancedMarkerElement({
        map: mapRef.current,
        position: { lat: markerData.lat, lng: markerData.lng },
        title: `${markerData.index}. ${markerData.name}`,
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
    const colors = CATEGORY_COLORS[marker.type] || CATEGORY_COLORS.island;
    
    div.innerHTML = `
      <div style="
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        background-color: ${colors.marker};
        border-radius: 50%;
        color: white;
        font-weight: bold;
        font-size: 16px;
        border: 2px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        cursor: pointer;
      ">
        ${marker.index}
      </div>
    `;
    return div;
  };

  useEffect(() => {
    addMarkers();
  }, [deduplicatedMarkers]);

  const nextCarousel = () => {
    setCarouselIndex((prev) => (prev + 1) % featuredMarkers.length);
  };

  const prevCarousel = () => {
    setCarouselIndex((prev) => (prev - 1 + featuredMarkers.length) % featuredMarkers.length);
  };

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
          {/* Featured Carousel */}
          <div className="p-4 border-b border-border bg-gradient-to-r from-primary/10 to-accent/10">
            <h3 className="text-sm font-semibold mb-3">Featured Destinations</h3>
            <div className="relative">
              <div className="aspect-video rounded-lg overflow-hidden bg-muted relative">
                {featuredMarkers[carouselIndex] && (
                  <>
                    <img
                      src={featuredMarkers[carouselIndex].image || "/images/default-island.jpg"}
                      alt={featuredMarkers[carouselIndex].name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/images/default-island.jpg";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-3">
                      <p className="text-white font-semibold text-sm">
                        {featuredMarkers[carouselIndex].index}. {featuredMarkers[carouselIndex].name}
                      </p>
                      <p className="text-white/80 text-xs">{featuredMarkers[carouselIndex].description}</p>
                    </div>
                  </>
                )}
              </div>
              <button
                onClick={prevCarousel}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1 rounded"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={nextCarousel}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1 rounded"
              >
                <ChevronRight size={20} />
              </button>
              <div className="flex justify-center gap-1 mt-2">
                {featuredMarkers.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-1 w-1 rounded-full transition-all ${
                      idx === carouselIndex ? "bg-primary w-3" : "bg-muted"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="p-4 border-b border-border space-y-3">
            <Input
              placeholder="Search locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9"
            />

            <div className="flex flex-wrap gap-2">
              <Button
                variant={activeFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter("all")}
                className="text-xs h-8"
              >
                All ({deduplicatedMarkers.length})
              </Button>
              {Object.entries(CATEGORY_COLORS).map(([type, colors]) => (
                <Button
                  key={type}
                  variant={activeFilter === type ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveFilter(type)}
                  className={`text-xs h-8 ${
                    activeFilter === type ? "" : `${colors.bg} ${colors.text}`
                  }`}
                >
                  {getMarkerIcon(type)} {getTypeLabel(type)}
                </Button>
              ))}
            </div>
          </div>

          {/* Location List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {deduplicatedMarkers.length > 0 ? (
              deduplicatedMarkers.map((marker) => {
                const colors = CATEGORY_COLORS[marker.type] || CATEGORY_COLORS.island;
                const isVisited = visitedLocations.has(marker.id);

                return (
                  <div
                    key={marker.id}
                    onClick={() => handleListItemClick(marker.id)}
                    className={`p-3 rounded cursor-pointer transition-all text-sm border ${
                      selectedMarkerId === marker.id
                        ? "bg-primary text-primary-foreground border-primary"
                        : `${colors.bg} ${colors.text} border-transparent hover:border-border`
                    } ${isVisited ? "opacity-60" : ""}`}
                  >
                    <div className="flex items-start gap-2">
                      {/* Number Badge */}
                      <div
                        className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                        style={{ backgroundColor: colors.marker }}
                      >
                        {marker.index}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{getMarkerIcon(marker.type)}</span>
                          <p className="font-semibold truncate">{marker.name}</p>
                        </div>
                        <Badge variant="secondary" className="text-xs mt-1">
                          {getTypeLabel(marker.type)}
                        </Badge>

                        {marker.type === "island" && marker.slug && (
                          <Link
                            href={getDetailLink(marker)}
                            className="text-xs hover:underline mt-1 block inline-block"
                          >
                            View Guide →
                          </Link>
                        )}
                      </div>

                      {/* Visited Checkbox */}
                      <Checkbox
                        checked={isVisited}
                        onChange={(e) => toggleVisited(marker.id, e as any)}
                        className="mt-1"
                      />
                    </div>
                  </div>
                );
              })
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
