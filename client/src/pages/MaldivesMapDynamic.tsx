import { useRef, useState, useMemo, useEffect } from "react";
import { Link } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapView } from "@/components/Map";
import Footer from "@/components/Footer";
import { trpc } from "@/lib/trpc";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Island {
  id: number;
  index: number;
  name: string;
  slug: string;
  lat: number;
  lng: number;
  image: string;
  description: string;
}

const CATEGORY_COLORS = {
  island: { bg: "bg-blue-100", text: "text-blue-900", marker: "#3B82F6" },
};

export default function MaldivesMapDynamic() {
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<Map<number, any>>(new Map());
  const carouselRef = useRef<HTMLDivElement>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [mapLoaded, setMapLoaded] = useState(false);

  // Fetch all islands with coordinates from database
  const { data: allIslandsData = [], isLoading: isLoadingAll } = trpc.islandGuides.mapData.useQuery();

  // Fetch featured islands for carousel
  const { data: featuredIslandsData = [], isLoading: isLoadingFeatured } = trpc.islandGuides.mapFeatured.useQuery({ limit: 10 });

  // Convert database islands to map format with index
  const allIslands: Island[] = useMemo(() => {
    return (allIslandsData || [])
      .filter((island: any) => {
        const lat = typeof island.latitude === "number" ? island.latitude : parseFloat(String(island.latitude));
        const lng = typeof island.longitude === "number" ? island.longitude : parseFloat(String(island.longitude));
        return !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0;
      })
      .map((island: any, idx: number) => {
        const lat = typeof island.latitude === "number" ? island.latitude : parseFloat(String(island.latitude));
        const lng = typeof island.longitude === "number" ? island.longitude : parseFloat(String(island.longitude));
        
        // Parse images JSON if it's a string
        let images = [];
        if (island.images) {
          try {
            images = typeof island.images === "string" ? JSON.parse(island.images) : island.images;
          } catch (e) {
            images = [];
          }
        }

        return {
          id: island.id,
          index: idx + 1,
          name: island.name,
          slug: island.slug,
          lat,
          lng,
          image: images[0] || "/images/default-island.jpg",
          description: island.overview?.substring(0, 100) + "..." || "Discover this beautiful island",
        };
      });
  }, [allIslandsData]);

  // Convert featured islands to map format
  const featuredIslands: Island[] = useMemo(() => {
    return (featuredIslandsData || [])
      .filter((island: any) => {
        const lat = typeof island.latitude === "number" ? island.latitude : parseFloat(String(island.latitude));
        const lng = typeof island.longitude === "number" ? island.longitude : parseFloat(String(island.longitude));
        return !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0;
      })
      .map((island: any, idx: number) => {
        const lat = typeof island.latitude === "number" ? island.latitude : parseFloat(String(island.latitude));
        const lng = typeof island.longitude === "number" ? island.longitude : parseFloat(String(island.longitude));
        
        // Parse images JSON if it's a string
        let images = [];
        if (island.images) {
          try {
            images = typeof island.images === "string" ? JSON.parse(island.images) : island.images;
          } catch (e) {
            images = [];
          }
        }

        return {
          id: island.id,
          index: idx + 1,
          name: island.name,
          slug: island.slug,
          lat,
          lng,
          image: images[0] || "/images/default-island.jpg",
          description: island.overview?.substring(0, 100) + "..." || "Discover this beautiful island",
        };
      });
  }, [featuredIslandsData]);

  // Filter islands based on search
  const filteredIslands = useMemo(() => {
    return allIslands.filter((island) =>
      island.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allIslands, searchQuery]);

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

    console.log(`Adding ${allIslands.length} markers to map`);

    // Clear existing markers
    markersRef.current.forEach((markerData) => {
      if (markerData.marker) {
        markerData.marker.map = null;
      }
    });
    markersRef.current.clear();

    // Add markers for all islands
    allIslands.forEach((island) => {
      const marker = new google.maps.marker.AdvancedMarkerElement({
        map: mapRef.current,
        position: { lat: island.lat, lng: island.lng },
        title: `${island.index}. ${island.name}`,
        content: createMarkerContent(island),
      });

      markersRef.current.set(island.id, { ...island, marker });
    });
  };

  // Re-add markers when all islands data changes
  useEffect(() => {
    if (mapLoaded && allIslands.length > 0) {
      addMarkers();
    }
  }, [allIslands, mapLoaded]);

  const createMarkerContent = (island: Island) => {
    const div = document.createElement("div");
    const colors = CATEGORY_COLORS.island;

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
        ${island.index}
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

  const isLoading = isLoadingAll || isLoadingFeatured;

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
          <h3 className="text-lg font-semibold mb-4 text-foreground">
            Featured Destinations ({featuredIslands.length})
          </h3>

          {isLoadingFeatured ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <p className="text-gray-600 mb-2">Loading featured islands...</p>
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
              </div>
            </div>
          ) : featuredIslands.length > 0 ? (
            <div className="relative">
              {/* Carousel Container */}
              <div
                ref={carouselRef}
                className="flex gap-4 overflow-x-auto pb-2 scroll-smooth"
                style={{ scrollBehavior: "smooth" }}
              >
                {featuredIslands.map((island) => (
                  <div
                    key={island.id}
                    className="flex-shrink-0 w-80 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer group"
                  >
                    <div className="relative aspect-video overflow-hidden bg-muted">
                      <img
                        src={island.image}
                        alt={island.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/images/default-island.jpg";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-4">
                        <p className="text-white font-bold text-lg">
                          {island.index}. {island.name}
                        </p>
                        <p className="text-white/90 text-sm mt-1">{island.description}</p>
                        <Link
                          href={`/island/${island.slug}`}
                          className="text-accent hover:text-accent/80 text-sm font-semibold mt-2 inline-block"
                        >
                          View Guide →
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Carousel Controls */}
              {featuredIslands.length > 0 && (
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
          ) : (
            <p className="text-gray-600 py-4">No featured islands available</p>
          )}
        </div>
      </div>

      {/* Search and Filters Section */}
      <div className="bg-background border-t border-border p-4">
        <div className="max-w-7xl mx-auto space-y-3">
          <Input
            placeholder="Search destinations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10"
          />

          <div className="flex flex-wrap gap-2">
            <Button variant="default" size="sm" className="text-sm">
              🏖️ All Islands ({filteredIslands.length})
            </Button>
          </div>

          <div className="text-sm text-muted-foreground pt-2">
            {isLoading ? (
              <p>Loading island data...</p>
            ) : (
              <p>
                Showing {filteredIslands.length} of {allIslands.length} islands with coordinates
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
