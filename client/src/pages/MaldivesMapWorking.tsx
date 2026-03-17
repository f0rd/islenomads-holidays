import { useRef, useState, useMemo, useEffect } from "react";
import { Link } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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

export default function MaldivesMapWorking() {
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<Map<string, any>>(new Map());
  const carouselRef = useRef<HTMLDivElement>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [mapLoaded, setMapLoaded] = useState(false);

  // Fetch island data
  const { data: islandData = [], isLoading } = trpc.islandGuides.listWithActivitySpots.useQuery();

  // Build markers array with index - only use islands with valid coordinates
  const allMarkers: Marker[] = useMemo(() => {
    return (islandData || [])
      .filter((island) => {
        const lat = typeof island.latitude === "number" ? island.latitude : parseFloat(String(island.latitude));
        const lng = typeof island.longitude === "number" ? island.longitude : parseFloat(String(island.longitude));
        return !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0;
      })
      .map((island, idx) => {
        const lat = typeof island.latitude === "number" ? island.latitude : parseFloat(String(island.latitude));
        const lng = typeof island.longitude === "number" ? island.longitude : parseFloat(String(island.longitude));
        return {
          id: `island-${island.id}`,
          index: idx + 1,
          name: island.name,
          type: "island" as const,
          lat,
          lng,
          slug: island.slug,
          image: island.images ? JSON.parse(String(island.images))[0] : "/images/default-island.jpg",
          description: island.overview?.substring(0, 100) + "..." || "Discover this beautiful island",
        };
      });
  }, [islandData]);

  // Filter markers based on search and active filter
  const filteredMarkers = useMemo(() => {
    return allMarkers.filter((marker) => {
      const matchesSearch = marker.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = activeFilter === "all" || marker.type === activeFilter;
      return matchesSearch && matchesFilter;
    });
  }, [allMarkers, searchQuery, activeFilter]);

  // Deduplicate markers by ID
  const deduplicatedMarkers = useMemo(() => {
    return Array.from(new Map(filteredMarkers.map((m) => [m.id, m])).values());
  }, [filteredMarkers]);

  // Featured islands (first 10)
  const featuredMarkers = useMemo(() => {
    return allMarkers.slice(0, 10);
  }, [allMarkers]);

  const handleMapReady = (map: google.maps.Map) => {
    console.log("Map is ready, adding markers...");
    mapRef.current = map;
    setMapLoaded(true);
    addMarkers();
  };

  const addMarkers = () => {
    if (!mapRef.current) {
      console.log("Map not ready yet");
      return;
    }

    console.log(`Adding ${deduplicatedMarkers.length} markers to map`);

    // Clear existing markers
    markersRef.current.forEach((markerData) => {
      if (markerData.marker) {
        markerData.marker.map = null;
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

      markersRef.current.set(markerData.id, { ...markerData, marker });
    });
  };

  // Re-add markers when filtered markers change
  useEffect(() => {
    if (mapLoaded) {
      addMarkers();
    }
  }, [deduplicatedMarkers, mapLoaded]);

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

  const scrollCarousel = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = 320; // Card width + gap
      carouselRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Map Container */}
      <div className="w-full h-96 md:h-[500px] lg:h-[600px] relative overflow-hidden bg-gray-200">
        {!mapLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
            <div className="text-center">
              <p className="text-gray-600 mb-2">Loading map...</p>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            </div>
          </div>
        )}
        <MapView
          onMapReady={handleMapReady}
          initialCenter={{ lat: 4.1694, lng: 73.5093 }}
          initialZoom={7}
          className="w-full h-full"
        />
      </div>

      {/* Featured Carousel Section */}
      <div className="bg-gradient-to-r from-primary/5 to-accent/5 border-t border-border p-4">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-lg font-semibold mb-4 text-foreground">Featured Destinations ({featuredMarkers.length})</h3>

          <div className="relative">
            {/* Carousel Container */}
            <div
              ref={carouselRef}
              className="flex gap-4 overflow-x-auto pb-2 scroll-smooth"
              style={{ scrollBehavior: "smooth" }}
            >
              {featuredMarkers.map((marker) => (
                <div
                  key={marker.id}
                  className="flex-shrink-0 w-80 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer group"
                >
                  <div className="relative aspect-video overflow-hidden bg-muted">
                    <img
                      src={marker.image}
                      alt={marker.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/images/default-island.jpg";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-4">
                      <p className="text-white font-bold text-lg">
                        {marker.index}. {marker.name}
                      </p>
                      <p className="text-white/90 text-sm mt-1">{marker.description}</p>
                      {marker.slug && (
                        <Link href={`/island/${marker.slug}`} className="text-accent hover:text-accent/80 text-sm font-semibold mt-2 inline-block">
                          View Guide →
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Carousel Controls */}
            {featuredMarkers.length > 0 && (
              <>
                <button
                  onClick={() => scrollCarousel("left")}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-primary hover:bg-primary/90 text-white p-2 rounded-full shadow-lg z-10"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={() => scrollCarousel("right")}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-primary hover:bg-primary/90 text-white p-2 rounded-full shadow-lg z-10"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Search and Filters Section */}
      <div className="bg-background border-t border-border p-4">
        <div className="max-w-7xl mx-auto space-y-3">
          <Input
            placeholder="Search locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10"
          />

          <div className="flex flex-wrap gap-2">
            <Button
              variant={activeFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter("all")}
              className="text-sm"
            >
              All ({deduplicatedMarkers.length})
            </Button>
            {Object.entries(CATEGORY_COLORS).map(([type, colors]) => (
              <Button
                key={type}
                variant={activeFilter === type ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter(type)}
                className={`text-sm ${activeFilter === type ? "" : colors.bg}`}
              >
                {type === "island" && "🏖️"} {type === "atoll" && "🏝️"} {type === "dive" && "🤿"} {type === "surf" && "🏄"} {type === "snorkel" && "🤽"}
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Button>
            ))}
          </div>

          <div className="text-sm text-muted-foreground pt-2">
            {isLoading ? (
              <p>Loading island data...</p>
            ) : (
              <p>
                Showing {deduplicatedMarkers.length} of {allMarkers.length} islands with coordinates
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
}
