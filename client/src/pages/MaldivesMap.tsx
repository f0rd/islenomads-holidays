import { useEffect, useRef, useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MapPin, Info } from "lucide-react";

// Maldives popular locations data
const MALDIVES_LOCATIONS = [
  {
    id: 1,
    name: "Malé City",
    type: "Capital",
    lat: 4.1748,
    lng: 73.5082,
    description: "The capital city of Maldives, gateway to the islands",
    highlights: ["National Museum", "Grand Friday Mosque", "Local Markets"],
    image: "/images/male-city.jpg",
  },
  {
    id: 2,
    name: "North Malé Atoll",
    type: "Atoll",
    lat: 4.3,
    lng: 73.5,
    description: "Popular atoll with luxury resorts and pristine beaches",
    highlights: ["Crystal Clear Waters", "Coral Reefs", "Water Sports"],
    image: "/images/north-male-atoll.jpg",
  },
  {
    id: 3,
    name: "South Malé Atoll",
    type: "Atoll",
    lat: 3.9,
    lng: 73.5,
    description: "Serene atoll with exclusive resorts and calm lagoons",
    highlights: ["Luxury Resorts", "Calm Lagoons", "Diving Spots"],
    image: "/images/south-male-atoll.jpg",
  },
  {
    id: 4,
    name: "Ari Atoll",
    type: "Atoll",
    lat: 4.2,
    lng: 72.8,
    description: "Famous for manta rays and whale sharks",
    highlights: ["Manta Ray Spotting", "Whale Sharks", "House Reef Diving"],
    image: "/images/ari-atoll.jpg",
  },
  {
    id: 5,
    name: "Baa Atoll",
    type: "Atoll",
    lat: 5.2,
    lng: 73.3,
    description: "UNESCO Biosphere Reserve with exceptional marine life",
    highlights: ["Hanifaru Bay", "Manta Rays", "Snorkeling"],
    image: "/images/baa-atoll.jpg",
  },
  {
    id: 6,
    name: "Vaavu Atoll",
    type: "Atoll",
    lat: 3.6,
    lng: 73.0,
    description: "Pristine diving destination with minimal crowds",
    highlights: ["Pristine Reefs", "Wreck Diving", "Shark Encounters"],
    image: "/images/vaavu-atoll.jpg",
  },
  {
    id: 7,
    name: "Meemu Atoll",
    type: "Atoll",
    lat: 3.2,
    lng: 72.9,
    description: "Tranquil atoll perfect for relaxation and diving",
    highlights: ["Quiet Beaches", "Excellent Diving", "Local Culture"],
    image: "/images/meemu-atoll.jpg",
  },
  {
    id: 8,
    name: "Addu Atoll",
    type: "Atoll",
    lat: 0.6,
    lng: 73.2,
    description: "Southernmost atoll with unique history and charm",
    highlights: ["Historical Sites", "Beautiful Lagoons", "Local Islands"],
    image: "/images/addu-atoll.jpg",
  },
  {
    id: 9,
    name: "Thiladhunmathi Atoll",
    type: "Atoll",
    lat: 6.0,
    lng: 73.2,
    description: "Northern atoll with exclusive resorts and pristine reefs",
    highlights: ["Exclusive Resorts", "Pristine Reefs", "Water Activities"],
    image: "/images/thiladhunmathi-atoll.jpg",
  },
  {
    id: 10,
    name: "Haa Alifu Atoll",
    type: "Atoll",
    lat: 6.8,
    lng: 73.0,
    description: "Northernmost atoll with untouched beauty",
    highlights: ["Untouched Beaches", "Rare Marine Life", "Adventure"],
    image: "/images/haa-alifu-atoll.jpg",
  },
];

export default function MaldivesMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<(typeof MALDIVES_LOCATIONS)[0] | null>(null);
  const [filteredLocations, setFilteredLocations] = useState(MALDIVES_LOCATIONS);

  // Filter locations based on search
  useEffect(() => {
    const filtered = MALDIVES_LOCATIONS.filter(
      (location) =>
        location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        location.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredLocations(filtered);
  }, [searchTerm]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <section className="flex-1 py-12 bg-gradient-to-b from-background to-secondary/20">
        <div className="container max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Explore the Maldives
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover the most beautiful atolls, islands, and destinations in the Maldives. 
              Explore pristine beaches, vibrant coral reefs, and luxury resorts across our interactive map.
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <Input
              placeholder="Search locations, atolls, or activities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-12 text-base"
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Map Container */}
            <div className="lg:col-span-2">
              <Card className="h-full overflow-hidden">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-accent" />
                    Maldives Interactive Map
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div
                    ref={mapContainer}
                    className="w-full bg-gradient-to-br from-cyan-100 to-blue-100 rounded-lg overflow-hidden"
                    style={{ height: "600px" }}
                  >
                    {/* Simple SVG Map Visualization */}
                    <svg
                      viewBox="0 0 400 600"
                      className="w-full h-full"
                      style={{ background: "linear-gradient(135deg, #e0f7ff 0%, #b3e5fc 100%)" }}
                    >
                      {/* Maldives outline - simplified */}
                      <defs>
                        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                          <feDropShadow dx="2" dy="2" stdDeviation="3" floodOpacity="0.3" />
                        </filter>
                      </defs>

                      {/* Ocean background */}
                      <rect width="400" height="600" fill="#87CEEB" opacity="0.3" />

                      {/* Atoll circles */}
                      {filteredLocations.map((location) => {
                        // Normalize coordinates to SVG viewBox
                        const x = ((location.lng - 72) / 2) * 350 + 25;
                        const y = ((7 - location.lat) / 7) * 550 + 25;
                        const isSelected = selectedLocation?.id === location.id;

                        return (
                          <g key={location.id} filter="url(#shadow)">
                            {/* Location circle */}
                            <circle
                              cx={x}
                              cy={y}
                              r={isSelected ? 12 : 8}
                              fill={isSelected ? "#06b6d4" : "#0d9488"}
                              stroke="white"
                              strokeWidth="2"
                              className="cursor-pointer transition-all hover:r-12"
                              onClick={() => setSelectedLocation(location)}
                              style={{
                                cursor: "pointer",
                                transition: "all 0.3s ease",
                              }}
                            />
                            {/* Label */}
                            <text
                              x={x}
                              y={y - 18}
                              textAnchor="middle"
                              fontSize="11"
                              fontWeight="bold"
                              fill="#0d9488"
                              className="pointer-events-none"
                            >
                              {location.name.split(" ")[0]}
                            </text>
                          </g>
                        );
                      })}

                      {/* Legend */}
                      <g>
                        <rect x="10" y="10" width="150" height="60" fill="white" opacity="0.9" rx="4" />
                        <circle cx="25" cy="25" r="4" fill="#0d9488" />
                        <text x="35" y="30" fontSize="12" fill="#333">
                          Atolls & Islands
                        </text>
                        <circle cx="25" cy="45" r="4" fill="#06b6d4" />
                        <text x="35" y="50" fontSize="12" fill="#333">
                          Selected Location
                        </text>
                      </g>
                    </svg>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Locations List */}
            <div className="lg:col-span-1">
              <Card className="h-full overflow-hidden flex flex-col">
                <CardHeader>
                  <CardTitle className="text-lg">
                    Popular Locations ({filteredLocations.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto space-y-3">
                  {filteredLocations.length > 0 ? (
                    filteredLocations.map((location) => (
                      <div
                        key={location.id}
                        onClick={() => setSelectedLocation(location)}
                        className={`p-3 rounded-lg cursor-pointer transition-all ${
                          selectedLocation?.id === location.id
                            ? "bg-accent text-white shadow-lg"
                            : "bg-secondary hover:bg-secondary/80"
                        }`}
                      >
                        <div className="font-semibold text-sm">{location.name}</div>
                        <div className="text-xs opacity-75">{location.type}</div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-muted-foreground py-8">
                      No locations found
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Location Details */}
          {selectedLocation && (
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="w-5 h-5 text-accent" />
                  {selectedLocation.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Image */}
                  <div className="md:col-span-1">
                    <div
                      className="w-full h-48 bg-gradient-to-br from-cyan-300 to-teal-400 rounded-lg flex items-center justify-center text-white font-semibold"
                      style={{
                        backgroundImage: `url(${selectedLocation.image})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    >
                      {selectedLocation.name}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="md:col-span-2 space-y-4">
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Description</h3>
                      <p className="text-muted-foreground">{selectedLocation.description}</p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Highlights</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedLocation.highlights.map((highlight, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-accent/20 text-accent rounded-full text-sm font-medium"
                          >
                            {highlight}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                      <div>
                        <div className="text-xs text-muted-foreground">Latitude</div>
                        <div className="font-semibold text-foreground">
                          {selectedLocation.lat.toFixed(4)}°N
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Longitude</div>
                        <div className="font-semibold text-foreground">
                          {selectedLocation.lng.toFixed(4)}°E
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* All Locations Grid */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">All Destinations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLocations.map((location) => (
                <Card
                  key={location.id}
                  className="cursor-pointer hover:shadow-lg transition-all hover:border-accent"
                  onClick={() => setSelectedLocation(location)}
                >
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center justify-between">
                      <span>{location.name}</span>
                      <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded">
                        {location.type}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">{location.description}</p>
                    <div>
                      <p className="text-xs font-semibold text-foreground mb-2">Key Features:</p>
                      <div className="flex flex-wrap gap-1">
                        {location.highlights.slice(0, 2).map((highlight, idx) => (
                          <span
                            key={idx}
                            className="text-xs bg-secondary px-2 py-1 rounded text-muted-foreground"
                          >
                            {highlight}
                          </span>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
