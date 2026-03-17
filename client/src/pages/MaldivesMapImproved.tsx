'use client';

import { useRef, useState, useEffect } from "react";
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

export default function MaldivesMapImproved() {
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<Map<string, any>>(new Map());
  const carouselRef = useRef<HTMLDivElement>(null);

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

  // Featured islands (first 10)
  const featuredMarkers = allMarkers.slice(0, 10);

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
    <div className="flex flex-col h-screen bg-background">
      {/* Map Container - Full Width */}
      <div className="flex-1 relative overflow-hidden">
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
          <h3 className="text-lg font-semibold mb-4 text-foreground">Featured Destinations</h3>
          
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
                  onClick={() => handleListItemClick(marker.id)}
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
                      <Link href={getDetailLink(marker)}>
                        <a className="text-accent hover:text-accent/80 text-sm font-semibold mt-2 inline-block">
                          View Guide →
                        </a>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Carousel Controls */}
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
                className={`text-sm ${
                  activeFilter === type ? "" : `${colors.bg} ${colors.text}`
                }`}
              >
                {getMarkerIcon(type)} {getTypeLabel(type)}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
