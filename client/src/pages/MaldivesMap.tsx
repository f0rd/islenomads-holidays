import { useEffect, useRef, useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MapPin, Info, Waves, Anchor } from "lucide-react";

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

// Dive Points Data
const DIVE_POINTS = [
  {
    id: "dive-1",
    name: "Banana Reef",
    type: "Dive Point",
    lat: 4.25,
    lng: 73.52,
    difficulty: "Intermediate",
    depth: "5-30m",
    description: "Iconic reef with excellent coral formations and tropical fish",
    highlights: ["Coral Gardens", "Reef Sharks", "Groupers"],
    rating: 4.8,
  },
  {
    id: "dive-2",
    name: "Maaya Thila",
    type: "Dive Point",
    lat: 4.28,
    lng: 73.48,
    difficulty: "Advanced",
    depth: "10-40m",
    description: "Dramatic underwater mountain with strong currents and large pelagics",
    highlights: ["Pelagic Fish", "Sharks", "Eagle Rays"],
    rating: 4.9,
  },
  {
    id: "dive-3",
    name: "Miyaru Kandu",
    type: "Dive Point",
    lat: 4.35,
    lng: 73.45,
    difficulty: "Advanced",
    depth: "15-40m",
    description: "Channel dive with strong currents and abundant marine life",
    highlights: ["Manta Rays", "Snappers", "Trevally"],
    rating: 4.7,
  },
  {
    id: "dive-4",
    name: "Hanifaru Bay",
    type: "Dive Point",
    lat: 5.25,
    lng: 73.32,
    difficulty: "Beginner",
    depth: "3-20m",
    description: "UNESCO site famous for manta ray aggregations",
    highlights: ["Manta Rays", "Whale Sharks", "Snorkeling"],
    rating: 4.9,
  },
  {
    id: "dive-5",
    name: "Fotteyo Kandu",
    type: "Dive Point",
    lat: 4.18,
    lng: 73.52,
    difficulty: "Intermediate",
    depth: "8-35m",
    description: "Channel with excellent visibility and diverse marine life",
    highlights: ["Reef Fish", "Rays", "Octopus"],
    rating: 4.6,
  },
  {
    id: "dive-6",
    name: "Okobe Thila",
    type: "Dive Point",
    lat: 3.95,
    lng: 73.48,
    difficulty: "Intermediate",
    depth: "12-30m",
    description: "Beautiful thila with colorful corals and schooling fish",
    highlights: ["Coral Formations", "Schooling Fish", "Turtles"],
    rating: 4.5,
  },
  {
    id: "dive-7",
    name: "Vaavu Wreck",
    type: "Dive Point",
    lat: 3.6,
    lng: 73.0,
    difficulty: "Advanced",
    depth: "20-40m",
    description: "Wreck dive with historical significance and marine life",
    highlights: ["Wreck Exploration", "Groupers", "Snappers"],
    rating: 4.4,
  },
  {
    id: "dive-8",
    name: "Kandooma Thila",
    type: "Dive Point",
    lat: 3.88,
    lng: 73.52,
    difficulty: "Intermediate",
    depth: "10-35m",
    description: "Popular thila with excellent coral and abundant fish",
    highlights: ["Coral Reefs", "Reef Sharks", "Jacks"],
    rating: 4.7,
  },
];

// Surf Spots Data
const SURF_SPOTS = [
  {
    id: "surf-1",
    name: "Pasta Point",
    type: "Surf Spot",
    lat: 4.15,
    lng: 73.45,
    difficulty: "Intermediate",
    waveHeight: "2-6ft",
    description: "Consistent reef break with long rides and friendly atmosphere",
    highlights: ["Consistent Waves", "Right Hander", "Reef Break"],
    rating: 4.6,
  },
  {
    id: "surf-2",
    name: "Chickens",
    type: "Surf Spot",
    lat: 4.12,
    lng: 73.42,
    difficulty: "Beginner",
    waveHeight: "1-4ft",
    description: "Mellow beach break perfect for beginners and learning",
    highlights: ["Beach Break", "Beginner Friendly", "Sandy Bottom"],
    rating: 4.3,
  },
  {
    id: "surf-3",
    name: "Riptide",
    type: "Surf Spot",
    lat: 4.18,
    lng: 73.48,
    difficulty: "Advanced",
    waveHeight: "3-8ft",
    description: "Powerful reef break with challenging conditions",
    highlights: ["Powerful Waves", "Reef Break", "Left Hander"],
    rating: 4.5,
  },
  {
    id: "surf-4",
    name: "Thalapathi",
    type: "Surf Spot",
    lat: 4.22,
    lng: 73.55,
    difficulty: "Intermediate",
    waveHeight: "2-5ft",
    description: "Consistent point break with smooth waves",
    highlights: ["Point Break", "Long Rides", "Scenic"],
    rating: 4.4,
  },
  {
    id: "surf-5",
    name: "Jailbreaks",
    type: "Surf Spot",
    lat: 4.08,
    lng: 73.38,
    difficulty: "Advanced",
    waveHeight: "3-7ft",
    description: "Challenging reef break with fast walls",
    highlights: ["Reef Break", "Fast Walls", "Barrels"],
    rating: 4.7,
  },
  {
    id: "surf-6",
    name: "Honky's",
    type: "Surf Spot",
    lat: 4.05,
    lng: 73.35,
    difficulty: "Intermediate",
    waveHeight: "2-6ft",
    description: "Fun reef break with multiple peaks",
    highlights: ["Multiple Peaks", "Reef Break", "Fun Waves"],
    rating: 4.5,
  },
];

export default function MaldivesMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<(typeof MALDIVES_LOCATIONS)[0] | null>(null);
  const [selectedDive, setSelectedDive] = useState<(typeof DIVE_POINTS)[0] | null>(null);
  const [selectedSurf, setSelectedSurf] = useState<(typeof SURF_SPOTS)[0] | null>(null);
  const [filteredLocations, setFilteredLocations] = useState(MALDIVES_LOCATIONS);
  const [filteredDives, setFilteredDives] = useState(DIVE_POINTS);
  const [filteredSurfs, setFilteredSurfs] = useState(SURF_SPOTS);
  const [activityFilter, setActivityFilter] = useState<"all" | "atolls" | "dives" | "surfs">("all");

  // Filter locations based on search and activity type
  useEffect(() => {
    const searchLower = searchTerm.toLowerCase();
    
    const locations = MALDIVES_LOCATIONS.filter(
      (location) =>
        location.name.toLowerCase().includes(searchLower) ||
        location.description.toLowerCase().includes(searchLower)
    );
    
    const dives = DIVE_POINTS.filter(
      (dive) =>
        dive.name.toLowerCase().includes(searchLower) ||
        dive.description.toLowerCase().includes(searchLower)
    );
    
    const surfs = SURF_SPOTS.filter(
      (surf) =>
        surf.name.toLowerCase().includes(searchLower) ||
        surf.description.toLowerCase().includes(searchLower)
    );

    setFilteredLocations(locations);
    setFilteredDives(dives);
    setFilteredSurfs(surfs);
  }, [searchTerm]);

  const allMarkers = [
    ...filteredLocations.map(loc => ({ ...loc, markerType: 'atoll' as const })),
    ...filteredDives.map(dive => ({ ...dive, markerType: 'dive' as const })),
    ...filteredSurfs.map(surf => ({ ...surf, markerType: 'surf' as const })),
  ];

  const getMarkerColor = (markerType: string) => {
    switch (markerType) {
      case 'dive':
        return '#0891b2'; // cyan
      case 'surf':
        return '#f59e0b'; // amber
      default:
        return '#0d9488'; // teal
    }
  };

  const getMarkerIcon = (markerType: string) => {
    switch (markerType) {
      case 'dive':
        return '⚓';
      case 'surf':
        return '🌊';
      default:
        return '📍';
    }
  };

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
              Discover atolls, dive points, and surf spots across the Maldives. 
              Explore pristine beaches, vibrant coral reefs, and thrilling water sports.
            </p>
          </div>

          {/* Search and Filter */}
          <div className="mb-8 space-y-4">
            <Input
              placeholder="Search locations, dive sites, or surf spots..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-12 text-base"
            />
            
            {/* Activity Filter Buttons */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActivityFilter("all")}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  activityFilter === "all"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-foreground hover:bg-secondary/80"
                }`}
              >
                All Activities
              </button>
              <button
                onClick={() => setActivityFilter("atolls")}
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  activityFilter === "atolls"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-foreground hover:bg-secondary/80"
                }`}
              >
                <MapPin className="w-4 h-4" />
                Atolls ({filteredLocations.length})
              </button>
              <button
                onClick={() => setActivityFilter("dives")}
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  activityFilter === "dives"
                    ? "bg-cyan-600 text-white"
                    : "bg-secondary text-foreground hover:bg-secondary/80"
                }`}
              >
                <Anchor className="w-4 h-4" />
                Dive Points ({filteredDives.length})
              </button>
              <button
                onClick={() => setActivityFilter("surfs")}
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  activityFilter === "surfs"
                    ? "bg-amber-500 text-white"
                    : "bg-secondary text-foreground hover:bg-secondary/80"
                }`}
              >
                <Waves className="w-4 h-4" />
                Surf Spots ({filteredSurfs.length})
              </button>
            </div>
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
                    {/* SVG Map Visualization */}
                    <svg
                      viewBox="0 0 400 600"
                      className="w-full h-full"
                      style={{ background: "linear-gradient(135deg, #e0f7ff 0%, #b3e5fc 100%)" }}
                    >
                      <defs>
                        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                          <feDropShadow dx="2" dy="2" stdDeviation="3" floodOpacity="0.3" />
                        </filter>
                      </defs>

                      {/* Ocean background */}
                      <rect width="400" height="600" fill="#87CEEB" opacity="0.3" />

                      {/* Render markers based on filter */}
                      {(activityFilter === "all" || activityFilter === "atolls") && filteredLocations.map((location) => {
                        const x = ((location.lng - 72) / 2) * 350 + 25;
                        const y = ((7 - location.lat) / 7) * 550 + 25;

                        return (
                          <g key={location.id} filter="url(#shadow)">
                            <circle
                              cx={x}
                              cy={y}
                              r={selectedLocation?.id === location.id ? 12 : 8}
                              fill="#0d9488"
                              stroke="white"
                              strokeWidth="2"
                              className="cursor-pointer transition-all hover:r-12"
                              onClick={() => setSelectedLocation(location)}
                              style={{ cursor: "pointer", transition: "all 0.3s ease" }}
                            />
                            <text
                              x={x}
                              y={y - 18}
                              textAnchor="middle"
                              fontSize="10"
                              fontWeight="bold"
                              fill="#0d9488"
                              className="pointer-events-none"
                            >
                              {location.name.split(" ")[0]}
                            </text>
                          </g>
                        );
                      })}

                      {/* Dive Points */}
                      {(activityFilter === "all" || activityFilter === "dives") && filteredDives.map((dive) => {
                        const x = ((dive.lng - 72) / 2) * 350 + 25;
                        const y = ((7 - dive.lat) / 7) * 550 + 25;

                        return (
                          <g key={dive.id} filter="url(#shadow)">
                            <circle
                              cx={x}
                              cy={y}
                              r={selectedDive?.id === dive.id ? 10 : 6}
                              fill="#0891b2"
                              stroke="white"
                              strokeWidth="2"
                              className="cursor-pointer transition-all"
                              onClick={() => setSelectedDive(dive)}
                              style={{ cursor: "pointer", transition: "all 0.3s ease" }}
                            />
                            <text
                              x={x}
                              y={y + 2}
                              textAnchor="middle"
                              fontSize="8"
                              fontWeight="bold"
                              fill="white"
                              className="pointer-events-none"
                            >
                              ⚓
                            </text>
                          </g>
                        );
                      })}

                      {/* Surf Spots */}
                      {(activityFilter === "all" || activityFilter === "surfs") && filteredSurfs.map((surf) => {
                        const x = ((surf.lng - 72) / 2) * 350 + 25;
                        const y = ((7 - surf.lat) / 7) * 550 + 25;

                        return (
                          <g key={surf.id} filter="url(#shadow)">
                            <circle
                              cx={x}
                              cy={y}
                              r={selectedSurf?.id === surf.id ? 10 : 6}
                              fill="#f59e0b"
                              stroke="white"
                              strokeWidth="2"
                              className="cursor-pointer transition-all"
                              onClick={() => setSelectedSurf(surf)}
                              style={{ cursor: "pointer", transition: "all 0.3s ease" }}
                            />
                            <text
                              x={x}
                              y={y + 2}
                              textAnchor="middle"
                              fontSize="8"
                              fontWeight="bold"
                              fill="white"
                              className="pointer-events-none"
                            >
                              🌊
                            </text>
                          </g>
                        );
                      })}

                      {/* Legend */}
                      <g>
                        <rect x="10" y="10" width="140" height="90" fill="white" opacity="0.95" rx="4" />
                        <circle cx="25" cy="25" r="4" fill="#0d9488" />
                        <text x="35" y="30" fontSize="11" fill="#333" fontWeight="bold">
                          Atolls
                        </text>
                        <circle cx="25" cy="45" r="4" fill="#0891b2" />
                        <text x="35" y="50" fontSize="11" fill="#333" fontWeight="bold">
                          Dive Points
                        </text>
                        <circle cx="25" cy="65" r="4" fill="#f59e0b" />
                        <text x="35" y="70" fontSize="11" fill="#333" fontWeight="bold">
                          Surf Spots
                        </text>
                        <circle cx="25" cy="85" r="4" fill="#06b6d4" />
                        <text x="35" y="90" fontSize="11" fill="#333" fontWeight="bold">
                          Selected
                        </text>
                      </g>
                    </svg>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar - Locations List */}
            <div className="lg:col-span-1 space-y-4">
              {/* Atolls List */}
              {(activityFilter === "all" || activityFilter === "atolls") && (
                <Card className="h-auto overflow-hidden flex flex-col">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Atolls ({filteredLocations.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 overflow-y-auto space-y-2 max-h-48">
                    {filteredLocations.length > 0 ? (
                      filteredLocations.map((location) => (
                        <div
                          key={location.id}
                          onClick={() => setSelectedLocation(location)}
                          className={`p-2 rounded-lg cursor-pointer transition-all text-sm ${
                            selectedLocation?.id === location.id
                              ? "bg-accent text-white shadow-lg"
                              : "bg-secondary hover:bg-secondary/80"
                          }`}
                        >
                          <div className="font-semibold">{location.name}</div>
                          <div className="text-xs opacity-75">{location.type}</div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-muted-foreground py-4 text-sm">
                        No atolls found
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Dive Points List */}
              {(activityFilter === "all" || activityFilter === "dives") && (
                <Card className="h-auto overflow-hidden flex flex-col">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Anchor className="w-4 h-4 text-cyan-600" />
                      Dive Points ({filteredDives.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 overflow-y-auto space-y-2 max-h-48">
                    {filteredDives.length > 0 ? (
                      filteredDives.map((dive) => (
                        <div
                          key={dive.id}
                          onClick={() => setSelectedDive(dive)}
                          className={`p-2 rounded-lg cursor-pointer transition-all text-sm ${
                            selectedDive?.id === dive.id
                              ? "bg-cyan-600 text-white shadow-lg"
                              : "bg-secondary hover:bg-secondary/80"
                          }`}
                        >
                          <div className="font-semibold">{dive.name}</div>
                          <div className="text-xs opacity-75">{dive.difficulty} • {dive.depth}</div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-muted-foreground py-4 text-sm">
                        No dive points found
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Surf Spots List */}
              {(activityFilter === "all" || activityFilter === "surfs") && (
                <Card className="h-auto overflow-hidden flex flex-col">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Waves className="w-4 h-4 text-amber-500" />
                      Surf Spots ({filteredSurfs.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 overflow-y-auto space-y-2 max-h-48">
                    {filteredSurfs.length > 0 ? (
                      filteredSurfs.map((surf) => (
                        <div
                          key={surf.id}
                          onClick={() => setSelectedSurf(surf)}
                          className={`p-2 rounded-lg cursor-pointer transition-all text-sm ${
                            selectedSurf?.id === surf.id
                              ? "bg-amber-500 text-white shadow-lg"
                              : "bg-secondary hover:bg-secondary/80"
                          }`}
                        >
                          <div className="font-semibold">{surf.name}</div>
                          <div className="text-xs opacity-75">{surf.difficulty} • {surf.waveHeight}</div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-muted-foreground py-4 text-sm">
                        No surf spots found
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Details Sections */}
          {selectedLocation && (
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-accent" />
                  {selectedLocation.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

          {selectedDive && (
            <Card className="mt-8 border-cyan-600">
              <CardHeader className="bg-cyan-50">
                <CardTitle className="flex items-center gap-2 text-cyan-900">
                  <Anchor className="w-5 h-5" />
                  {selectedDive.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-1">
                    <div className="w-full h-48 bg-gradient-to-br from-cyan-300 to-blue-400 rounded-lg flex items-center justify-center text-white font-semibold text-2xl">
                      ⚓
                    </div>
                  </div>
                  <div className="md:col-span-2 space-y-4">
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Description</h3>
                      <p className="text-muted-foreground">{selectedDive.description}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Highlights</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedDive.highlights.map((highlight, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-cyan-100 text-cyan-700 rounded-full text-sm font-medium"
                          >
                            {highlight}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
                      <div>
                        <div className="text-xs text-muted-foreground">Difficulty</div>
                        <div className="font-semibold text-foreground">{selectedDive.difficulty}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Depth</div>
                        <div className="font-semibold text-foreground">{selectedDive.depth}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Rating</div>
                        <div className="font-semibold text-foreground">⭐ {selectedDive.rating}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {selectedSurf && (
            <Card className="mt-8 border-amber-500">
              <CardHeader className="bg-amber-50">
                <CardTitle className="flex items-center gap-2 text-amber-900">
                  <Waves className="w-5 h-5" />
                  {selectedSurf.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-1">
                    <div className="w-full h-48 bg-gradient-to-br from-amber-300 to-orange-400 rounded-lg flex items-center justify-center text-white font-semibold text-4xl">
                      🌊
                    </div>
                  </div>
                  <div className="md:col-span-2 space-y-4">
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Description</h3>
                      <p className="text-muted-foreground">{selectedSurf.description}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Highlights</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedSurf.highlights.map((highlight, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium"
                          >
                            {highlight}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
                      <div>
                        <div className="text-xs text-muted-foreground">Difficulty</div>
                        <div className="font-semibold text-foreground">{selectedSurf.difficulty}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Wave Height</div>
                        <div className="font-semibold text-foreground">{selectedSurf.waveHeight}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Rating</div>
                        <div className="font-semibold text-foreground">⭐ {selectedSurf.rating}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
