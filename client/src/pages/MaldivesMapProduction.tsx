import { useRef, useState } from "react";
import { Link } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapView } from "@/components/Map";
import Footer from "@/components/Footer";
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

// Featured islands with coordinates - these are the main tourist destinations
const FEATURED_ISLANDS: Island[] = [
  {
    id: 1,
    index: 1,
    name: "Malé",
    slug: "male",
    lat: 4.1694,
    lng: 73.5093,
    image: "/images/male-city.jpg",
    description: "The capital city of Maldives, gateway to the islands",
  },
  {
    id: 2,
    index: 2,
    name: "Dhigurah",
    slug: "dhigurah",
    lat: 4.2833,
    lng: 73.1833,
    image: "/images/dhigurah.jpg",
    description: "Popular island known for whale shark encounters",
  },
  {
    id: 3,
    index: 3,
    name: "Thulusdhoo",
    slug: "thulusdhoo",
    lat: 4.3667,
    lng: 73.2167,
    image: "/images/thulusdhoo.jpg",
    description: "Vibrant local island with excellent diving and surfing",
  },
  {
    id: 4,
    index: 4,
    name: "Maafushi",
    slug: "maafushi",
    lat: 4.3833,
    lng: 73.4167,
    image: "/images/maafushi.jpg",
    description: "Budget-friendly island with beautiful beaches",
  },
  {
    id: 5,
    index: 5,
    name: "Veligandu",
    slug: "veligandu",
    lat: 4.4,
    lng: 73.5,
    image: "/images/veligandu.jpg",
    description: "Scenic island perfect for snorkeling and diving",
  },
  {
    id: 6,
    index: 6,
    name: "Kandooma",
    slug: "kandooma",
    lat: 4.2667,
    lng: 73.4,
    image: "/images/kandooma.jpg",
    description: "Resort island with world-class water sports",
  },
  {
    id: 7,
    index: 7,
    name: "Fuvahmulah",
    slug: "fuvahmulah",
    lat: 3.8,
    lng: 73.4,
    image: "/images/fuvahmulah.jpg",
    description: "Unique southern atoll with freshwater lakes",
  },
  {
    id: 8,
    index: 8,
    name: "Addu City",
    slug: "addu-city",
    lat: 0.6,
    lng: 73.2,
    image: "/images/addu-city.jpg",
    description: "Southernmost atoll with historical significance",
  },
  {
    id: 9,
    index: 9,
    name: "Haa Alifu Atoll",
    slug: "haa-alifu",
    lat: 6.5,
    lng: 73.0,
    image: "/images/haa-alifu.jpg",
    description: "Northern atoll with pristine reefs and marine life",
  },
  {
    id: 10,
    index: 10,
    name: "Baa Atoll",
    slug: "baa-atoll",
    lat: 5.2,
    lng: 72.9,
    image: "/images/baa-atoll.jpg",
    description: "UNESCO biosphere reserve with incredible biodiversity",
  },
];

const CATEGORY_COLORS = {
  island: { bg: "bg-blue-100", text: "text-blue-900", marker: "#3B82F6" },
};

export default function MaldivesMapProduction() {
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<Map<number, any>>(new Map());
  const carouselRef = useRef<HTMLDivElement>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [mapLoaded, setMapLoaded] = useState(false);

  // Filter islands based on search
  const filteredIslands = FEATURED_ISLANDS.filter((island) =>
    island.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

    console.log(`Adding ${FEATURED_ISLANDS.length} markers to map`);

    // Clear existing markers
    markersRef.current.forEach((markerData) => {
      if (markerData.marker) {
        markerData.marker.map = null;
      }
    });
    markersRef.current.clear();

    // Add markers for all featured islands
    FEATURED_ISLANDS.forEach((island) => {
      const marker = new google.maps.marker.AdvancedMarkerElement({
        map: mapRef.current,
        position: { lat: island.lat, lng: island.lng },
        title: `${island.index}. ${island.name}`,
        content: createMarkerContent(island),
      });

      markersRef.current.set(island.id, { ...island, marker });
    });
  };

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
          <h3 className="text-lg font-semibold mb-4 text-foreground">Featured Destinations ({FEATURED_ISLANDS.length})</h3>

          <div className="relative">
            {/* Carousel Container */}
            <div
              ref={carouselRef}
              className="flex gap-4 overflow-x-auto pb-2 scroll-smooth"
              style={{ scrollBehavior: "smooth" }}
            >
              {FEATURED_ISLANDS.map((island) => (
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
                      <Link href={`/island/${island.slug}`} className="text-accent hover:text-accent/80 text-sm font-semibold mt-2 inline-block">
                        View Guide →
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
            placeholder="Search destinations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10"
          />

          <div className="flex flex-wrap gap-2">
            <Button
              variant="default"
              size="sm"
              className="text-sm"
            >
              🏖️ All Islands ({filteredIslands.length})
            </Button>
          </div>

          <div className="text-sm text-muted-foreground pt-2">
            <p>
              Showing {filteredIslands.length} of {FEATURED_ISLANDS.length} featured destinations
            </p>
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
