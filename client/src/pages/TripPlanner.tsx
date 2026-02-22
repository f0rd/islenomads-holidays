import { useState, useMemo } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Clock,
  DollarSign,
  Zap,
  Ship,
  Plus,
  X,
  ChevronRight,
  Calendar,
  Users,
  Waves,
  TrendingDown,
  Compass,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Download,
} from "lucide-react";
import {
  AVAILABLE_DESTINATIONS,
  generateItineraryOptionsAsync,
  calculateTripStats,
  validateItinerary,
  TripItinerary,
} from "@/utils/tripPlannerAsync";
import { trpc } from "@/lib/trpc";
import { getDestinationInfo } from "@/utils/destinationInfo";
import WeatherForecast from "@/components/WeatherForecast";
import WeatherRecommendations from "@/components/WeatherRecommendations";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import FerrySearchWidget from "@/components/FerrySearchWidget";

interface FerryRoute {
  id: number;
  name: string;
  type: "ferry" | "speedboat";
  fromLocation: string;
  toLocation: string;
  duration: string;
  price: number;
  capacity: number;
  schedule?: string;
}

export default function TripPlanner() {
  const { data: transports = [] } = trpc.transports.list.useQuery();
  const [selectedDestinations, setSelectedDestinations] = useState<string[]>([]);
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [itineraryOptions, setItineraryOptions] = useState<TripItinerary[]>([]);
  const [selectedItinerary, setSelectedItinerary] = useState<TripItinerary | null>(null);
  const [preferences, setPreferences] = useState<"speed" | "cost" | "comfort" | "balanced">("balanced");
  const [showWeather, setShowWeather] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [weatherDestination, setWeatherDestination] = useState<string | null>(null);
  const [weatherCoords, setWeatherCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [showGuesthouses, setShowGuesthouses] = useState(false);
  const [selectedDestinationInfo, setSelectedDestinationInfo] = useState<string | null>(null);
  const [ferryRoutes, setFerryRoutes] = useState<FerryRoute[]>([]);
  const [showFerrySearch, setShowFerrySearch] = useState(false);
  const [ferrySearchFrom, setFerrySearchFrom] = useState("");
  const [ferrySearchTo, setFerrySearchTo] = useState("");

  const destinationInfo = selectedDestinationInfo ? getDestinationInfo(selectedDestinationInfo) : null;

  const GUESTHOUSE_ISLANDS = [
    "maafushi-island",
    "ukulhas-island",
    "dhigurah-island",
    "eydhafushi-island",
    "hangnaameedhoo-island",
    "gan-island",
    "funadhoo-island",
    "felidhoo-island",
    "naifaru-island",
    "meedhoo-island",
    "rasdhoo-island",
    "isdhoo-island",
    "velidhoo-island",
    "dhaalu-kudahuvadhoo",
    "haa-alif-hanimadhoo",
    "haa-dhaalu-kulhudhuffushi",
  ];

  const filteredDestinations = AVAILABLE_DESTINATIONS.filter(
    (dest) => {
      const matchesSearch = dest.name.toLowerCase().includes(searchTerm.toLowerCase());
      const notSelected = !selectedDestinations.includes(dest.id);
      const matchesGuesthouses = !showGuesthouses || GUESTHOUSE_ISLANDS.includes(dest.id);
      return matchesSearch && notSelected && matchesGuesthouses;
    }
  );

  const handleAddDestination = (destId: string) => {
    setSelectedDestinations([...selectedDestinations, destId]);
    setSearchTerm("");
  };

  const handleRemoveDestination = (destId: string) => {
    setSelectedDestinations(
      selectedDestinations.filter((id) => id !== destId)
    );
  };

  const handleGenerateItinerary = async () => {
    if (selectedDestinations.length < 1) {
      alert("Please select at least 1 destination");
      return;
    }

    setIsGenerating(true);
    try {
      const options = await generateItineraryOptionsAsync(transports, selectedDestinations, startDate);

      if (options.length === 0) {
        alert("No routes available for the selected destinations");
        return;
      }

      setItineraryOptions(options);
      setSelectedItinerary(options[0]);
    } catch (error) {
      console.error("Error generating itinerary:", error);
      alert("Error generating itinerary. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectItinerary = (itinerary: TripItinerary) => {
    setSelectedItinerary(itinerary);
  };

  const selectedDestinationObjects = selectedDestinations
    .map((id) => AVAILABLE_DESTINATIONS.find((d) => d.id === id))
    .filter((d) => d !== undefined);

  const tripDays = Math.ceil(
    (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)
  );

  const tripStats = selectedItinerary
    ? calculateTripStats(selectedItinerary)
    : null;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-secondary/10">
      <Navigation />

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/CDBYkgQqNlaehfeg.jpg')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/80 to-primary/90" />
        </div>

        <div className="container max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
              <Compass className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-white">Plan Your Island Adventure</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight">
              Multi-Destination <span className="text-accent">Trip Planner</span>
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Discover optimal routes, ferry schedules, and island-hopping combinations tailored to your preferences and budget.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="flex-1 py-12">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Sidebar - Planning Controls */}
            <div className="lg:col-span-1 space-y-4">
              {/* Trip Duration Card */}
              <Card className="border-accent/20 bg-gradient-to-br from-accent/5 to-transparent">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-accent" />
                    Trip Duration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-2">
                      Start Date
                    </label>
                    <Input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-2">
                      End Date
                    </label>
                    <Input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full text-sm"
                    />
                  </div>
                  <div className="p-3 bg-accent/10 rounded-lg border border-accent/20">
                    <p className="text-xs text-muted-foreground">Duration</p>
                    <p className="text-2xl font-bold text-accent">{tripDays} Days</p>
                  </div>
                </CardContent>
              </Card>

              {/* Destination Selection Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-cyan-600" />
                    Destinations ({selectedDestinations.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Selected List */}
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {selectedDestinationObjects.length > 0 ? (
                      selectedDestinationObjects.map((dest, idx) => (
                        <div
                          key={dest?.id}
                          className="flex items-center justify-between bg-secondary p-2 rounded-lg hover:bg-secondary/80 transition-colors"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="font-bold text-accent text-sm w-5 text-center flex-shrink-0">
                              {idx + 1}
                            </span>
                            <div className="min-w-0">
                              <p className="font-medium text-sm truncate text-foreground">
                                {dest?.name}
                              </p>
                            </div>
                          </div>
                          {selectedDestinations.length > 1 && (
                            <button
                              onClick={() => handleRemoveDestination(dest?.id || "")}
                              className="p-1 hover:bg-destructive/20 rounded transition-colors flex-shrink-0"
                            >
                              <X className="w-3 h-3 text-destructive" />
                            </button>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-muted-foreground text-center py-4">
                        No destinations selected
                      </p>
                    )}
                  </div>

                  {/* Add Destination */}
                  <div>
                    <Input
                      placeholder="Search islands..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full text-sm"
                    />

                    {searchTerm && (
                      <div className="mt-2 space-y-1 max-h-32 overflow-y-auto">
                        {filteredDestinations.length > 0 ? (
                          filteredDestinations.slice(0, 5).map((dest) => (
                            <button
                              key={dest.id}
                              onClick={() => handleAddDestination(dest.id)}
                              className="w-full text-left p-2 hover:bg-secondary rounded transition-colors flex items-center justify-between text-sm"
                            >
                              <span className="truncate">{dest.name}</span>
                              <Plus className="w-3 h-3 text-accent flex-shrink-0" />
                            </button>
                          ))
                        ) : (
                          <p className="text-xs text-muted-foreground p-2">No results</p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Guesthouse Filter */}
                  <label className="flex items-center gap-2 p-2 bg-secondary rounded-lg cursor-pointer hover:bg-secondary/80 transition-colors">
                    <input
                      type="checkbox"
                      checked={showGuesthouses}
                      onChange={(e) => setShowGuesthouses(e.target.checked)}
                      className="w-4 h-4 cursor-pointer"
                    />
                    <span className="text-xs font-medium text-foreground">Guesthouse Islands</span>
                  </label>
                </CardContent>
              </Card>

              {/* Preferences Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-500" />
                    Optimize For
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {[
                    { value: "speed", label: "⚡ Speed", icon: Zap },
                    { value: "cost", label: "💰 Cost", icon: DollarSign },
                    { value: "comfort", label: "🛳️ Comfort", icon: Ship },
                    { value: "balanced", label: "⚖️ Balanced", icon: Clock },
                  ].map(({ value, label }) => (
                    <button
                      key={value}
                      onClick={() =>
                        setPreferences(value as "speed" | "cost" | "comfort" | "balanced")
                      }
                      className={`w-full px-3 py-2 rounded-lg font-medium transition-all text-sm text-left ${
                        preferences === value
                          ? "bg-accent text-white"
                          : "bg-secondary text-foreground hover:bg-secondary/80"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </CardContent>
              </Card>

              {/* Ferry Search Widget */}
              <FerrySearchWidget showTitle={true} />

              {/* Generate Button */}
              <Button
                onClick={handleGenerateItinerary}
                className="w-full bg-accent hover:bg-accent/90 text-white font-semibold py-6 text-base"
                disabled={selectedDestinations.length < 1 || isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Clock className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Compass className="w-4 h-4 mr-2" />
                    {selectedDestinations.length === 1 ? "View Island" : "Generate Itinerary"}
                  </>
                )}
              </Button>
            </div>

            {/* Right Content - Results */}
            <div className="lg:col-span-3 space-y-6">
              {itineraryOptions.length > 0 && selectedItinerary ? (
                <>
                  {/* Trip Summary Card */}
                  <Card className="border-accent/30 bg-gradient-to-br from-accent/5 to-transparent">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-accent" />
                          Trip Summary
                        </span>
                        <Badge variant="outline" className="text-accent border-accent/30">
                          {selectedItinerary.destinations.length} Islands
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="p-4 bg-white/50 dark:bg-secondary rounded-lg border border-accent/10">
                          <p className="text-xs text-muted-foreground mb-1">Total Cost</p>
                          <p className="text-2xl font-bold text-accent">
                            {selectedItinerary.totalCost}
                          </p>
                        </div>
                        <div className="p-4 bg-white/50 dark:bg-secondary rounded-lg border border-accent/10">
                          <p className="text-xs text-muted-foreground mb-1">Duration</p>
                          <p className="text-2xl font-bold text-foreground">
                            {selectedItinerary.totalDuration}
                          </p>
                        </div>
                        <div className="p-4 bg-white/50 dark:bg-secondary rounded-lg border border-accent/10">
                          <p className="text-xs text-muted-foreground mb-1">Distance</p>
                          <p className="text-2xl font-bold text-foreground">
                            {selectedItinerary.totalDistance}
                          </p>
                        </div>
                        <div className="p-4 bg-white/50 dark:bg-secondary rounded-lg border border-accent/10">
                          <p className="text-xs text-muted-foreground mb-1">Preference</p>
                          <p className="text-lg font-bold text-foreground capitalize">
                            {preferences}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Itinerary Timeline */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Waves className="w-5 h-5 text-cyan-600" />
                        Your Itinerary
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {selectedItinerary.destinations.map((dest, idx) => (
                          <div key={idx} className="flex gap-4">
                            {/* Timeline Marker */}
                            <div className="flex flex-col items-center">
                              <div className="w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center font-bold text-sm">
                                {idx + 1}
                              </div>
                              {idx < selectedItinerary.destinations.length - 1 && (
                                <div className="w-1 h-12 bg-accent/30 my-2" />
                              )}
                            </div>

                            {/* Destination Card */}
                            <div className="flex-1 pt-1">
                              <div className="p-4 bg-secondary rounded-lg border border-accent/10 hover:border-accent/30 transition-colors">
                                <div className="flex items-start justify-between mb-2">
                                  <div>
                                    <h4 className="font-semibold text-foreground">{dest.name}</h4>
                                    <p className="text-sm text-muted-foreground">
                                      {dest.type === "island" ? "🏝️ Island" : "🏨 Resort"}
                                    </p>
                                  </div>
                                  <Badge variant="secondary">Day {idx + 1}</Badge>
                                </div>

                                {idx < selectedItinerary.destinations.length - 1 && (
                                  <div className="mt-3 pt-3 border-t border-border">
                                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                                      <Waves className="w-3 h-3" />
                                      Ferry to next island
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Itinerary Options */}
                  {itineraryOptions.length > 1 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <TrendingDown className="w-5 h-5 text-cyan-600" />
                          Alternative Options ({itineraryOptions.length})
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {itineraryOptions.map((option, idx) => (
                          <button
                            key={option.id}
                            onClick={() => handleSelectItinerary(option)}
                            className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                              selectedItinerary?.id === option.id
                                ? "border-accent bg-accent/5"
                                : "border-border hover:border-accent/50"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <p className="font-semibold text-sm">Option {idx + 1}</p>
                                <div className="flex gap-4 mt-1 text-xs text-muted-foreground">
                                  <span>📅 {option.totalDuration}</span>
                                  <span>💰 {option.totalCost}</span>
                                  <span>📍 {option.totalDistance}</span>
                                </div>
                              </div>
                              <ChevronRight className="w-4 h-4 text-accent" />
                            </div>
                          </button>
                        ))}
                      </CardContent>
                    </Card>
                  )}

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      className="flex items-center justify-center gap-2"
                      onClick={() => setShowWeather(!showWeather)}
                    >
                      <Calendar className="w-4 h-4" />
                      Weather
                    </Button>
                    <Button
                      className="bg-accent hover:bg-accent/90 text-white flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Export
                    </Button>
                  </div>
                </>
              ) : (
                <Card className="border-dashed border-2">
                  <CardContent className="py-12 text-center">
                    <Compass className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Plan Your Adventure
                    </h3>
                    <p className="text-muted-foreground max-w-sm mx-auto">
                      Select destinations and click "Generate Itinerary" to discover optimal routes and ferry combinations for your island-hopping journey.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
