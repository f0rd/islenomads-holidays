import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Info, Waves, Anchor, Building2, Palmtree, BookOpen, Star, Clock, Utensils, Activity, Calendar, Search, Fish } from "lucide-react";
import { Link } from "wouter";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { getIslandGuideUrl } from "@shared/locations";

export default function MaldivesMap() {
  const [activityFilter, setActivityFilter] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [selectedIsland, setSelectedIsland] = useState<any>(null);
  const [selectedDiveSpot, setSelectedDiveSpot] = useState<any>(null);
  const [selectedSurfSpot, setSelectedSurfSpot] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [zoom, setZoom] = useState(1);
  const mapContainer = null;

  // Fetch data from unified database
  const { data: atolls = [] } = trpc.atolls.list.useQuery();
  const { data: islands = [] } = trpc.islandGuides.list.useQuery();
  const { data: activitySpots = [] } = trpc.activitySpots.list.useQuery();

  interface Atoll {
    id: number;
    name: string;
    slug: string;
    latitude?: string;
    longitude?: string;
    description?: string;
    heroImage?: string;
  }

  interface Island {
    id: number;
    name: string;
    slug: string;
    latitude?: string;
    longitude?: string;
    overview?: string;
    heroImage?: string;
    published?: number;
    contentType?: string;
  }

  interface ActivitySpot {
    id: number;
    name: string;
    slug: string;
    spotType: 'surf_spot' | 'dive_site' | 'snorkeling_spot';
    latitude?: string;
    longitude?: string;
    description?: string;
    difficulty?: string;
    maxDepth?: number;
    waveHeight?: string;
    published?: number;
  }

  // Filter activity spots by type
  const diveSites = useMemo(() => {
    return (activitySpots as ActivitySpot[]).filter((spot) => spot.spotType === 'dive_site' && spot.published === 1);
  }, [activitySpots]);

  const surfSpots = useMemo(() => {
    return (activitySpots as ActivitySpot[]).filter((spot) => spot.spotType === 'surf_spot' && spot.published === 1);
  }, [activitySpots]);

  const snorkelingSpots = useMemo(() => {
    return (activitySpots as ActivitySpot[]).filter((spot) => spot.spotType === 'snorkeling_spot' && spot.published === 1);
  }, [activitySpots]);

  // Filter atolls by search
  const filteredAtolls = useMemo(() => {
    return (atolls as Atoll[]).filter((atoll) => {
      const matchesSearch = atoll.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (atoll.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
      return matchesSearch;
    });
  }, [atolls, searchQuery]);

  // Filter islands by search
  const filteredIslands = useMemo(() => {
    return (islands as Island[]).filter((island) => {
      const matchesSearch = island.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (island.overview?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
      const isPublished = island.published === 1;
      const isActualIsland = island.contentType !== 'point_of_interest';
      return matchesSearch && isPublished && isActualIsland;
    });
  }, [islands, searchQuery]);

  // Filter activity spots by search
  const filteredDiveSites = useMemo(() => {
    return (diveSites as ActivitySpot[]).filter((spot) =>
      spot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (spot.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
    );
  }, [diveSites, searchQuery]);

  const filteredSurfSpots = useMemo(() => {
    return (surfSpots as ActivitySpot[]).filter((spot) =>
      spot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (spot.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
    );
  }, [surfSpots, searchQuery]);

  const filteredSnorkelingSpots = useMemo(() => {
    return (snorkelingSpots as ActivitySpot[]).filter((spot) =>
      spot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (spot.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
    );
  }, [snorkelingSpots, searchQuery]);

  // Get display items based on filter
  const getDisplayItems = () => {
    switch (activityFilter) {
      case "atolls":
        return { atolls: filteredAtolls, islands: [], dives: [], surfs: [], snorkels: [] };
      case "islands":
        return { atolls: [], islands: filteredIslands, dives: [], surfs: [], snorkels: [] };
      case "dive":
        return { atolls: [], islands: [], dives: filteredDiveSites, surfs: [], snorkels: [] };
      case "surf":
        return { atolls: [], islands: [], dives: [], surfs: filteredSurfSpots, snorkels: [] };
      case "snorkel":
        return { atolls: [], islands: [], dives: [], surfs: [], snorkels: filteredSnorkelingSpots };
      default:
        return { atolls: filteredAtolls, islands: filteredIslands, dives: filteredDiveSites, surfs: filteredSurfSpots, snorkels: filteredSnorkelingSpots };
    }
  };

  const displayItems = getDisplayItems();

  const renderMapMarkers = () => {
    const markers: any[] = [];

    // Render atolls
    (displayItems.atolls as Atoll[]).forEach((atoll) => {
      if (atoll.latitude && atoll.longitude) {
        const lat = parseFloat(atoll.latitude);
        const lng = parseFloat(atoll.longitude);
        const x = ((lng - 72) / 2) * 350 + 25;
        const y = ((7 - lat) / 7) * 550 + 25;

        markers.push(
          <g key={`atoll-${atoll.id}`} onClick={() => setSelectedLocation(atoll)} style={{ cursor: "pointer" }}>
            <circle
              cx={x}
              cy={y}
              r={selectedLocation?.id === atoll.id ? 16 : 12}
              fill="#0d9488"
              stroke="white"
              strokeWidth="3"
              style={{
                filter: selectedLocation?.id === atoll.id ? "drop-shadow(0 0 8px rgba(13, 148, 136, 0.6))" : "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
                transition: "all 0.3s ease"
              }}
            />
            <text x={x} y={y + 5} textAnchor="middle" fontSize="16" className="pointer-events-none select-none">
              🏝️
            </text>
            <text
              x={x}
              y={y - 22}
              textAnchor="middle"
              fontSize="10"
              fontWeight="bold"
              fill="#0d9488"
              className="pointer-events-none"
              style={{ background: "white", padding: "2px 4px", borderRadius: "3px" }}
            >
              {atoll.name}
            </text>
          </g>
        );
      }
    });

    // Render islands
    (displayItems.islands as Island[]).forEach((island) => {
      if (island.latitude && island.longitude) {
        const lat = parseFloat(island.latitude);
        const lng = parseFloat(island.longitude);
        const x = ((lng - 72) / 2) * 350 + 25;
        const y = ((7 - lat) / 7) * 550 + 25;

        markers.push(
          <g key={`island-${island.id}`} onClick={() => setSelectedIsland(island)} style={{ cursor: "pointer" }}>
            <circle
              cx={x}
              cy={y}
              r={selectedIsland?.id === island.id ? 14 : 10}
              fill="#22c55e"
              stroke="white"
              strokeWidth="3"
              style={{
                filter: selectedIsland?.id === island.id ? "drop-shadow(0 0 8px rgba(34, 197, 94, 0.6))" : "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
                transition: "all 0.3s ease"
              }}
            />
            <text x={x} y={y + 5} textAnchor="middle" fontSize="14" className="pointer-events-none select-none">
              🏖️
            </text>
            <text
              x={x}
              y={y - 20}
              textAnchor="middle"
              fontSize="9"
              fontWeight="bold"
              fill="#15803d"
              className="pointer-events-none"
              style={{ background: "white", padding: "2px 4px", borderRadius: "3px" }}
            >
              {island.name}
            </text>
          </g>
        );
      }
    });

    // Render dive sites
    (displayItems.dives as ActivitySpot[]).forEach((dive) => {
      if (dive.latitude && dive.longitude) {
        const lat = parseFloat(dive.latitude);
        const lng = parseFloat(dive.longitude);
        const x = ((lng - 72) / 2) * 350 + 25;
        const y = ((7 - lat) / 7) * 550 + 25;

        markers.push(
          <g key={`dive-${dive.id}`} onClick={() => setSelectedDiveSpot(dive)} style={{ cursor: "pointer" }}>
            <circle
              cx={x}
              cy={y}
              r={selectedDiveSpot?.id === dive.id ? 12 : 8}
              fill="#3b82f6"
              stroke="white"
              strokeWidth="2"
              style={{
                filter: selectedDiveSpot?.id === dive.id ? "drop-shadow(0 0 6px rgba(59, 130, 246, 0.6))" : "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
                transition: "all 0.3s ease"
              }}
            />
            <text x={x} y={y + 4} textAnchor="middle" fontSize="12" className="pointer-events-none select-none">
              🤿
            </text>
          </g>
        );
      }
    });

    // Render surf spots
    (displayItems.surfs as ActivitySpot[]).forEach((surf) => {
      if (surf.latitude && surf.longitude) {
        const lat = parseFloat(surf.latitude);
        const lng = parseFloat(surf.longitude);
        const x = ((lng - 72) / 2) * 350 + 25;
        const y = ((7 - lat) / 7) * 550 + 25;

        markers.push(
          <g key={`surf-${surf.id}`} onClick={() => setSelectedSurfSpot(surf)} style={{ cursor: "pointer" }}>
            <circle
              cx={x}
              cy={y}
              r={selectedSurfSpot?.id === surf.id ? 12 : 8}
              fill="#f59e0b"
              stroke="white"
              strokeWidth="2"
              style={{
                filter: selectedSurfSpot?.id === surf.id ? "drop-shadow(0 0 6px rgba(245, 158, 11, 0.6))" : "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
                transition: "all 0.3s ease"
              }}
            />
            <text x={x} y={y + 4} textAnchor="middle" fontSize="12" className="pointer-events-none select-none">
              🏄
            </text>
          </g>
        );
      }
    });

    // Render snorkeling spots
    (displayItems.snorkels as ActivitySpot[]).forEach((snorkel) => {
      if (snorkel.latitude && snorkel.longitude) {
        const lat = parseFloat(snorkel.latitude);
        const lng = parseFloat(snorkel.longitude);
        const x = ((lng - 72) / 2) * 350 + 25;
        const y = ((7 - lat) / 7) * 550 + 25;

        markers.push(
          <g key={`snorkel-${snorkel.id}`} onClick={() => setSelectedDiveSpot(snorkel)} style={{ cursor: "pointer" }}>
            <circle
              cx={x}
              cy={y}
              r={8}
              fill="#ec4899"
              stroke="white"
              strokeWidth="2"
              style={{
                filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
                transition: "all 0.3s ease"
              }}
            />
            <text x={x} y={y + 4} textAnchor="middle" fontSize="12" className="pointer-events-none select-none">
              🐠
            </text>
          </g>
        );
      }
    });

    return markers;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="container max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-2">
              <MapPin className="w-8 h-8 text-accent" />
              Maldives Interactive Map
            </h1>
            <p className="text-muted-foreground">Explore atolls, islands, dive sites, and surf spots across the Maldives</p>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search atolls, islands, dive sites, surf spots..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-base"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="mb-6 flex flex-wrap gap-2">
            <button
              onClick={() => setActivityFilter("all")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activityFilter === "all"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-foreground hover:bg-secondary/80"
              }`}
            >
              All Locations ({filteredAtolls.length + filteredIslands.length + filteredDiveSites.length + filteredSurfSpots.length + filteredSnorkelingSpots.length})
            </button>
            <button
              onClick={() => setActivityFilter("atolls")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activityFilter === "atolls"
                  ? "bg-teal-600 text-white"
                  : "bg-secondary text-foreground hover:bg-secondary/80"
              }`}
            >
              Atolls ({filteredAtolls.length})
            </button>
            <button
              onClick={() => setActivityFilter("islands")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activityFilter === "islands"
                  ? "bg-green-600 text-white"
                  : "bg-secondary text-foreground hover:bg-secondary/80"
              }`}
            >
              Islands ({filteredIslands.length})
            </button>
            <button
              onClick={() => setActivityFilter("dive")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activityFilter === "dive"
                  ? "bg-blue-600 text-white"
                  : "bg-secondary text-foreground hover:bg-secondary/80"
              }`}
            >
              Dive Sites ({filteredDiveSites.length})
            </button>
            <button
              onClick={() => setActivityFilter("surf")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activityFilter === "surf"
                  ? "bg-amber-600 text-white"
                  : "bg-secondary text-foreground hover:bg-secondary/80"
              }`}
            >
              Surf Spots ({filteredSurfSpots.length})
            </button>
            <button
              onClick={() => setActivityFilter("snorkel")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activityFilter === "snorkel"
                  ? "bg-pink-600 text-white"
                  : "bg-secondary text-foreground hover:bg-secondary/80"
              }`}
            >
              Snorkeling ({filteredSnorkelingSpots.length})
            </button>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Map Container */}
            <div className="lg:col-span-2">
              <Card className="h-full overflow-hidden">
                <CardHeader className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-accent" />
                    Interactive Map
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setZoom(Math.min(zoom + 0.2, 2))}
                      className="px-3"
                    >
                      +
                    </Button>
                    <span className="text-sm font-medium px-2 py-1 bg-gray-100 rounded">
                      {Math.round(zoom * 100)}%
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setZoom(Math.max(zoom - 0.2, 0.6))}
                      className="px-3"
                    >
                      −
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0 relative">
                  <div className="w-full bg-gradient-to-br from-cyan-100 to-blue-100 rounded-lg overflow-auto flex items-center justify-center" style={{ height: "600px" }}>
                    {/* SVG Map Visualization */}
                    <svg
                      viewBox="0 0 400 600"
                      className="cursor-grab active:cursor-grabbing"
                      style={{
                        background: "linear-gradient(135deg, #e0f7ff 0%, #b3e5fc 100%)",
                        width: "100%",
                        height: "100%",
                        maxWidth: "800px",
                        maxHeight: "600px",
                        transform: `scale(${zoom})`
                      }}
                    >
                      <defs>
                        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                          <feDropShadow dx="2" dy="2" stdDeviation="3" floodOpacity="0.3" />
                        </filter>
                      </defs>

                      {/* Ocean background */}
                      <rect width="400" height="600" fill="#87CEEB" opacity="0.3" />

                      {/* Render all markers */}
                      {renderMapMarkers()}
                    </svg>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Details Panel */}
            <div className="lg:col-span-1">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="w-5 h-5" />
                    Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedLocation ? (
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-semibold text-lg">{selectedLocation.name}</h3>
                        <p className="text-sm text-muted-foreground">Atoll</p>
                      </div>
                      {selectedLocation.heroImage && (
                        <img src={selectedLocation.heroImage} alt={selectedLocation.name} className="w-full h-40 object-cover rounded-lg" />
                      )}
                      <p className="text-sm">{selectedLocation.description}</p>
                      <Link href={`/explore-maldives/atoll/${selectedLocation.slug}`}>
                        <Button className="w-full">View Details</Button>
                      </Link>
                    </div>
                  ) : selectedIsland ? (
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-semibold text-lg">{selectedIsland.name}</h3>
                        <p className="text-sm text-muted-foreground">Island</p>
                      </div>
                      {selectedIsland.heroImage && (
                        <img src={selectedIsland.heroImage} alt={selectedIsland.name} className="w-full h-40 object-cover rounded-lg" />
                      )}
                      <p className="text-sm">{selectedIsland.overview}</p>
                      <Link href={getIslandGuideUrl(selectedIsland.id)}>
                        <Button className="w-full">View Guide</Button>
                      </Link>
                    </div>
                  ) : selectedDiveSpot ? (
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-semibold text-lg flex items-center gap-2">
                          🤿 {(selectedDiveSpot as any).name}
                        </h3>
                        <p className="text-sm text-muted-foreground">Dive Site</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        {(selectedDiveSpot as any).difficulty && (
                          <div>
                            <span className="font-medium">Difficulty:</span>
                            <p className="capitalize">{(selectedDiveSpot as any).difficulty}</p>
                          </div>
                        )}
                        {(selectedDiveSpot as any).maxDepth && (
                          <div>
                            <span className="font-medium">Max Depth:</span>
                            <p>{(selectedDiveSpot as any).maxDepth}m</p>
                          </div>
                        )}
                      </div>
                      <p className="text-sm">{(selectedDiveSpot as any).description}</p>
                      <Button className="w-full">Learn More</Button>
                    </div>
                  ) : selectedSurfSpot ? (
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-semibold text-lg flex items-center gap-2">
                          🏄 {(selectedSurfSpot as any).name}
                        </h3>
                        <p className="text-sm text-muted-foreground">Surf Spot</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        {(selectedSurfSpot as any).difficulty && (
                          <div>
                            <span className="font-medium">Difficulty:</span>
                            <p className="capitalize">{(selectedSurfSpot as any).difficulty}</p>
                          </div>
                        )}
                        {(selectedSurfSpot as any).waveHeight && (
                          <div>
                            <span className="font-medium">Wave Height:</span>
                            <p>{(selectedSurfSpot as any).waveHeight}</p>
                          </div>
                        )}
                      </div>
                      <p className="text-sm">{(selectedSurfSpot as any).description}</p>
                      <Button className="w-full">Learn More</Button>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>Click on a location marker to view details</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Legend */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Map Legend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🏝️</span>
                  <span className="text-sm">Atolls</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🏖️</span>
                  <span className="text-sm">Islands</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🤿</span>
                  <span className="text-sm">Dive Sites</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🏄</span>
                  <span className="text-sm">Surf Spots</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🐠</span>
                  <span className="text-sm">Snorkeling</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-teal-600">{filteredAtolls.length}</div>
                  <p className="text-sm text-muted-foreground">Atolls</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{filteredIslands.length}</div>
                  <p className="text-sm text-muted-foreground">Islands</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{filteredDiveSites.length}</div>
                  <p className="text-sm text-muted-foreground">Dive Sites</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-amber-600">{filteredSurfSpots.length}</div>
                  <p className="text-sm text-muted-foreground">Surf Spots</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
