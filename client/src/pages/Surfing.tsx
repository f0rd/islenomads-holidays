import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { Loader2, MapPin, Waves, Users, AlertCircle } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

interface SurfingSpot {
  id: number;
  name: string;
  difficulty: string;
  waveHeight: string;
  bestSeason: string;
  rating?: number;
  description: string;
  latitude?: number;
  longitude?: number;
}

export default function Surfing() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [selectedSeason, setSelectedSeason] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpot, setSelectedSpot] = useState<SurfingSpot | null>(null);

  // Fetch surfing spots from database
  const { data: allGuides = [], isLoading } = trpc.attractionGuides.list.useQuery();
  
  // Filter for surfing spots only
  const spots = useMemo(() => {
    return allGuides.filter((guide: any) => 
      guide.spotType === 'surf_spot' || guide.type === 'surf_spot'
    );
  }, [allGuides]);

  // Filter spots based on criteria
  const filteredSpots = useMemo(() => {
    return (spots as SurfingSpot[]).filter((spot) => {
      const matchesSearch = spot.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesDifficulty =
        !selectedDifficulty || spot.difficulty === selectedDifficulty;
      const matchesSeason =
        !selectedSeason || (spot.bestSeason && spot.bestSeason.includes(selectedSeason));

      return matchesSearch && matchesDifficulty && matchesSeason;
    });
  }, [spots, searchQuery, selectedDifficulty, selectedSeason]);

  // Get unique difficulty levels
  const difficulties = useMemo(() => {
    return Array.from(new Set((spots as SurfingSpot[]).map((s) => s.difficulty)));
  }, [spots]);

  // Get unique seasons
  const seasons = useMemo(() => {
    const seasonSet = new Set<string>();
    (spots as SurfingSpot[]).forEach((spot) => {
      if (spot.bestSeason) {
        if (spot.bestSeason.includes("March")) seasonSet.add("March");
        if (spot.bestSeason.includes("April")) seasonSet.add("April");
        if (spot.bestSeason.includes("May")) seasonSet.add("May");
        if (spot.bestSeason.includes("June")) seasonSet.add("June");
        if (spot.bestSeason.includes("July")) seasonSet.add("July");
        if (spot.bestSeason.includes("August")) seasonSet.add("August");
        if (spot.bestSeason.includes("September")) seasonSet.add("September");
        if (spot.bestSeason.includes("October")) seasonSet.add("October");
        if (spot.bestSeason.includes("November")) seasonSet.add("November");
        if (spot.bestSeason.includes("December")) seasonSet.add("December");
        if (spot.bestSeason.includes("January")) seasonSet.add("January");
        if (spot.bestSeason.includes("February")) seasonSet.add("February");
        if (spot.bestSeason.includes("Year-round")) seasonSet.add("Year-round");
      }
    });
    return Array.from(seasonSet).sort();
  }, [spots]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-800";
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "Advanced":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-r from-primary to-primary/80">
        <div className="container">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              🏄 Maldives Surfing Spots
            </h1>
            <p className="text-lg text-white/90">
              Discover the best surfing breaks in the Maldives. From beginner-friendly waves to
              world-class reef breaks, find your perfect wave.
            </p>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 bg-gray-50 border-b">
        <div className="container">
          <div className="space-y-6">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Spots
              </label>
              <Input
                placeholder="Search by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-md"
              />
            </div>

            {/* Difficulty Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Difficulty Level
              </label>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedDifficulty === null ? "default" : "outline"}
                  onClick={() => setSelectedDifficulty(null)}
                  size="sm"
                >
                  All Levels
                </Button>
                {difficulties.map((difficulty) => (
                  <Button
                    key={difficulty}
                    variant={selectedDifficulty === difficulty ? "default" : "outline"}
                    onClick={() => setSelectedDifficulty(difficulty)}
                    size="sm"
                  >
                    {difficulty}
                  </Button>
                ))}
              </div>
            </div>

            {/* Season Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Best Season
              </label>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedSeason === null ? "default" : "outline"}
                  onClick={() => setSelectedSeason(null)}
                  size="sm"
                >
                  All Seasons
                </Button>
                {seasons.map((season) => (
                  <Button
                    key={season}
                    variant={selectedSeason === season ? "default" : "outline"}
                    onClick={() => setSelectedSeason(season)}
                    size="sm"
                  >
                    {season}
                  </Button>
                ))}
              </div>
            </div>

            {/* Results Count */}
            <div className="text-sm text-gray-600">
              Showing {filteredSpots.length} of {spots.length} surfing spots
            </div>
          </div>
        </div>
      </section>

      {/* Spots Grid */}
      <section className="py-12 flex-1">
        <div className="container">
          {filteredSpots.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No surfing spots match your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSpots.map((spot) => (
                <Card
                  key={spot.id}
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setSelectedSpot(spot)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <CardTitle className="text-lg">{spot.name}</CardTitle>
                      <Badge className={getDifficultyColor(spot.difficulty)}>
                        {spot.difficulty}
                      </Badge>
                    </div>
                    <CardDescription className="flex items-center gap-2">
                      <Waves className="w-4 h-4" />
                      {spot.waveHeight}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      Best: {spot.bestSeason}
                    </div>

                    {spot.rating && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Rating:</span>
                        <span className="text-sm text-yellow-500">
                          {"⭐".repeat(Math.round(spot.rating))}
                        </span>
                      </div>
                    )}

                    <p className="text-sm text-gray-600 line-clamp-3">
                      {spot.description}
                    </p>

                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setSelectedSpot(spot)}
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Spot Detail Modal */}
      {selectedSpot && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-start justify-between space-y-0">
              <div>
                <CardTitle className="text-2xl">{selectedSpot.name}</CardTitle>
                <CardDescription className="mt-2">
                  {selectedSpot.bestSeason}
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedSpot(null)}
              >
                ✕
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Difficulty and Wave Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Difficulty</p>
                  <Badge className={getDifficultyColor(selectedSpot.difficulty)}>
                    {selectedSpot.difficulty}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Wave Height</p>
                  <p className="text-lg font-semibold">{selectedSpot.waveHeight}</p>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="font-semibold mb-2">About This Spot</h3>
                <p className="text-gray-700 leading-relaxed">
                  {selectedSpot.description}
                </p>
              </div>

              {/* Location */}
              {selectedSpot.latitude && selectedSpot.longitude && (
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">
                    📍 Coordinates
                  </p>
                  <p className="text-sm text-gray-600">
                    {selectedSpot.latitude.toFixed(4)}, {selectedSpot.longitude.toFixed(4)}
                  </p>
                </div>
              )}

              <Button
                variant="outline"
                className="w-full"
                onClick={() => setSelectedSpot(null)}
              >
                Close
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      <Footer />
    </div>
  );
}
