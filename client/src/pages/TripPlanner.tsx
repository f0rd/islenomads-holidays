import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
  Star,
  Utensils,
  Activity,
} from "lucide-react";
import {
  AVAILABLE_DESTINATIONS,
  findDirectRoutes,
  findOptimalItinerary,
  generateItineraryOptions,
  calculateTripStats,
  validateItinerary,
  TripItinerary,
} from "@/utils/tripPlanner";
import { calculateRoute, FERRY_ROUTES } from "@/utils/ferryRoutes";
import { getDestinationInfo } from "@/utils/destinationInfo";
import WeatherForecast from "@/components/WeatherForecast";
import WeatherRecommendations from "@/components/WeatherRecommendations";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function TripPlanner() {
  const [selectedDestinations, setSelectedDestinations] = useState<string[]>([]);
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [itineraryOptions, setItineraryOptions] = useState<TripItinerary[]>([]);
  const [selectedItinerary, setSelectedItinerary] = useState<TripItinerary | null>(
    null
  );
  const [preferences, setPreferences] = useState<"speed" | "cost" | "comfort" | "balanced">(
    "balanced"
  );
  const [showWeather, setShowWeather] = useState(false);
  const [weatherDestination, setWeatherDestination] = useState<string | null>(null);
  const [weatherCoords, setWeatherCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [showGuesthouses, setShowGuesthouses] = useState(false);
  const [selectedDestinationInfo, setSelectedDestinationInfo] = useState<string | null>(null);
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

  const handleGenerateItinerary = () => {
    if (selectedDestinations.length < 2) {
      alert("Please select at least 2 destinations");
      return;
    }

    console.log("Generating itinerary for destinations:", selectedDestinations);
    const options = generateItineraryOptions(selectedDestinations, startDate);
    console.log("Generated options:", options);

    if (options.length === 0) {
      alert("No routes available for the selected destinations");
      return;
    }

    setItineraryOptions(options);
    setSelectedItinerary(options[0]);
  };

  const handleSelectItinerary = (itinerary: TripItinerary) => {
    setSelectedItinerary(itinerary);
  };

  const selectedDestinationObjects = selectedDestinations
    .map((id) => AVAILABLE_DESTINATIONS.find((d) => d.id === id))
    .filter((d) => d !== undefined);

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <section className="flex-1 py-12 bg-gradient-to-b from-background to-secondary/20 pt-24">
        <div className="container max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Multi-Destination Trip Planner
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Plan your perfect island-hopping adventure. Select destinations and 
              we'll suggest optimal ferry and speedboat combinations for your journey.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Panel - Destination Selection */}
            <div className="lg:col-span-1 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-cyan-600" />
                    Select Destinations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Start Date */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Start Date
                    </label>
                    <Input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full"
                    />
                  </div>

                  {/* Selected Destinations */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Your Itinerary ({selectedDestinations.length})
                    </label>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {selectedDestinationObjects.map((dest, idx) => (
                        <div
                          key={dest?.id}
                          className="flex items-center justify-between bg-secondary p-3 rounded-lg"
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-cyan-600 w-6 text-center">
                              {idx + 1}
                            </span>
                            <div>
                              <p className="font-semibold text-foreground">
                                {dest?.name}
                              </p>
                              <p className="text-xs text-muted-foreground capitalize">
                                {dest?.type}
                              </p>
                            </div>
                          </div>
                          {selectedDestinations.length > 2 && (
                            <button
                              onClick={() =>
                                handleRemoveDestination(dest?.id || "")
                              }
                              className="p-1 hover:bg-destructive/20 rounded transition-colors"
                            >
                              <X className="w-4 h-4 text-destructive" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Guesthouse Filter */}
                  <div className="flex items-center gap-2 p-3 bg-secondary rounded-lg border border-cyan-200">
                    <input
                      type="checkbox"
                      id="guesthouse-filter"
                      checked={showGuesthouses}
                      onChange={(e) => setShowGuesthouses(e.target.checked)}
                      className="w-4 h-4 cursor-pointer"
                    />
                    <label htmlFor="guesthouse-filter" className="text-sm font-medium text-foreground cursor-pointer">
                      Show Guesthouse Islands
                    </label>
                  </div>

                  {/* Destination Search */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Add Destination
                    </label>
                    <Input
                      placeholder="Search destinations..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full mb-2"
                    />

                    {searchTerm && (
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {filteredDestinations.length > 0 ? (
                          filteredDestinations.map((dest) => (
                            <button
                              key={dest.id}
                              onClick={() => handleAddDestination(dest.id)}
                              className="w-full text-left p-2 hover:bg-secondary rounded transition-colors flex items-center justify-between"
                            >
                              <div>
                                <p className="font-medium text-foreground">
                                  {dest.name}
                                </p>
                                <p className="text-xs text-muted-foreground capitalize">
                                  {dest.type}
                                </p>
                              </div>
                              <Plus className="w-4 h-4 text-cyan-600" />
                            </button>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            No destinations found
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Preferences */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Optimize For
                    </label>
                    <div className="space-y-2">
                      {[
                        { value: "speed", label: "⚡ Speed", icon: Zap },
                        { value: "cost", label: "💰 Cost", icon: DollarSign },
                        {
                          value: "comfort",
                          label: "🛳️ Comfort",
                          icon: Ship,
                        },
                        { value: "balanced", label: "⚖️ Balanced", icon: Clock },
                      ].map(({ value, label }) => (
                        <button
                          key={value}
                          onClick={() =>
                            setPreferences(
                              value as "speed" | "cost" | "comfort" | "balanced"
                            )
                          }
                          className={`w-full px-3 py-2 rounded-lg font-medium transition-all text-left ${
                            preferences === value
                              ? "bg-cyan-600 text-white"
                              : "bg-secondary text-foreground hover:bg-secondary/80"
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Generate Button */}
                  <Button
                    onClick={handleGenerateItinerary}
                    className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-3"
                    disabled={selectedDestinations.length < 2}
                  >
                    Generate Itinerary
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Right Panel - Itinerary Options and Details */}
            <div className="lg:col-span-2 space-y-4">
              {itineraryOptions.length > 0 ? (
                <>
                  {/* Itinerary Options */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-cyan-600" />
                        Trip Options ({itineraryOptions.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {itineraryOptions.map((option, idx) => (
                        <button
                          key={option.id}
                          onClick={() => handleSelectItinerary(option)}
                          className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                            selectedItinerary?.id === option.id
                              ? "border-cyan-600 bg-cyan-50"
                              : "border-border hover:border-cyan-400"
                          }`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="font-bold text-foreground">
                                Option {idx + 1}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {option.destinations.length} destinations
                              </p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-cyan-600" />
                          </div>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Duration</p>
                              <p className="font-semibold text-foreground">
                                {option.totalDuration}
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Cost</p>
                              <p className="font-semibold text-cyan-600">
                                {option.totalCost}
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Distance</p>
                              <p className="font-semibold text-foreground">
                                {option.totalDistance}
                              </p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Selected Itinerary Details */}
                  {selectedItinerary && (
                    <>
                      {/* Trip Summary */}
                      <Card className="border-cyan-600">
                        <CardHeader className="bg-cyan-50">
                          <CardTitle className="text-cyan-900">
                            Trip Summary
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-6">
                          {/* Key Metrics */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="p-4 bg-secondary rounded-lg">
                              <p className="text-sm text-muted-foreground mb-1">
                                Total Cost
                              </p>
                              <p className="text-2xl font-bold text-cyan-600">
                                {selectedItinerary.totalCost}
                              </p>
                            </div>
                            <div className="p-4 bg-secondary rounded-lg">
                              <p className="text-sm text-muted-foreground mb-1">
                                Duration
                              </p>
                              <p className="text-2xl font-bold text-foreground">
                                {selectedItinerary.totalDuration}
                              </p>
                            </div>
                            <div className="p-4 bg-secondary rounded-lg">
                              <p className="text-sm text-muted-foreground mb-1">
                                Distance
                              </p>
                              <p className="text-2xl font-bold text-foreground">
                                {selectedItinerary.totalDistance}
                              </p>
                            </div>
                            <div className="p-4 bg-secondary rounded-lg">
                              <p className="text-sm text-muted-foreground mb-1">
                                Segments
                              </p>
                              <p className="text-2xl font-bold text-foreground">
                                {selectedItinerary.segments.length}
                              </p>
                            </div>
                          </div>

                          {/* Date Range */}
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-5 h-5 text-cyan-600" />
                              <div>
                                <p className="text-sm text-muted-foreground">
                                  From
                                </p>
                                <p className="font-semibold text-foreground">
                                  {selectedItinerary.startDate}
                                </p>
                              </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-muted-foreground" />
                            <div className="flex items-center gap-2">
                              <Calendar className="w-5 h-5 text-cyan-600" />
                              <div>
                                <p className="text-sm text-muted-foreground">
                                  To
                                </p>
                                <p className="font-semibold text-foreground">
                                  {selectedItinerary.endDate}
                                </p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Route Segments */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Ship className="w-5 h-5 text-cyan-600" />
                            Route Segments
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {selectedItinerary.segments.map((segment, idx) => (
                            <div
                              key={segment.id}
                              className="border border-border rounded-lg p-4"
                            >
                              <div className="flex items-start justify-between mb-3">
                                <div>
                                  <p className="font-bold text-foreground">
                                    Leg {idx + 1}: {segment.from} → {segment.to}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    {segment.routeName}
                                  </p>
                                </div>
                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                    segment.routeType === "speedboat"
                                      ? "bg-blue-100 text-blue-700"
                                      : "bg-cyan-100 text-cyan-700"
                                  }`}
                                >
                                  {segment.routeType === "speedboat"
                                    ? "⚡ Speedboat"
                                    : "🛳️ Ferry"}
                                </span>
                              </div>

                              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3 text-sm">
                                <div>
                                  <p className="text-muted-foreground">Duration</p>
                                  <p className="font-semibold text-foreground">
                                    {segment.duration}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">Distance</p>
                                  <p className="font-semibold text-foreground">
                                    {segment.distance}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">Price</p>
                                  <p className="font-semibold text-cyan-600">
                                    {segment.price}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">Departure</p>
                                  <p className="font-semibold text-foreground">
                                    {segment.departureTime}
                                  </p>
                                </div>
                              </div>

                              <div className="pt-3 border-t border-border">
                                <p className="text-sm font-medium text-foreground mb-2">
                                  Amenities
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {segment.amenities.map((amenity, idx) => (
                                    <span
                                      key={idx}
                                      className="px-2 py-1 bg-secondary text-foreground rounded text-xs"
                                    >
                                      {amenity}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ))}
                        </CardContent>
                      </Card>

                      {/* Weather Forecast */}
                      {selectedItinerary && (
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                              <span>Weather Forecast</span>
                              <button
                                onClick={() => {
                                  const firstDest = selectedItinerary.destinations[0];
                                  setWeatherDestination(firstDest.name);
                                  setWeatherCoords({ lat: firstDest.lat, lng: firstDest.lng });
                                  setShowWeather(!showWeather);
                                }}
                                className="text-xs px-3 py-1 bg-secondary hover:bg-secondary/80 rounded transition-colors"
                              >
                                {showWeather ? "Hide" : "View"} Weather
                              </button>
                            </CardTitle>
                          </CardHeader>
                          {showWeather && weatherCoords && weatherDestination && (
                            <CardContent>
                              <WeatherForecast
                                lat={weatherCoords.lat}
                                lng={weatherCoords.lng}
                                destination={weatherDestination}
                                startDate={selectedItinerary.startDate}
                                endDate={selectedItinerary.endDate}
                              />
                            </CardContent>
                          )}
                        </Card>
                      )}

                      {/* Book Now Button */}
                      <Button className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-3">
                        Book This Trip
                      </Button>
                    </>
                  )}
                </>
              ) : (
                <Card className="h-96 flex items-center justify-center">
                  <CardContent className="text-center">
                    <MapPin className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <p className="text-lg text-muted-foreground">
                      Select at least 2 destinations and click "Generate Itinerary" 
                      to see available trip options.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Destination Info Modal */}
      <Dialog open={!!selectedDestinationInfo} onOpenChange={() => setSelectedDestinationInfo(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {destinationInfo && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-cyan-600" />
                  {destinationInfo.name}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Atoll</p>
                    <p className="font-semibold text-foreground">{destinationInfo.atoll}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Type</p>
                    <p className="font-semibold text-foreground capitalize">{destinationInfo.type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Distance from Malé</p>
                    <p className="font-semibold text-foreground">{destinationInfo.distanceFromMale} km</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Rating</p>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <p className="font-semibold text-foreground">{destinationInfo.rating}/5 ({destinationInfo.reviews} reviews)</p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <p className="text-sm text-muted-foreground mb-2">About</p>
                  <p className="text-foreground">{destinationInfo.description}</p>
                </div>

                {/* Travel Info */}
                <div>
                  <p className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-cyan-600" />
                    Travel Options
                  </p>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-muted-foreground">Ferry:</span> <span className="font-medium text-foreground">{destinationInfo.ferryDuration}</span></p>
                    {destinationInfo.flightAvailable && destinationInfo.flightDuration && (
                      <p><span className="text-muted-foreground">Flight:</span> <span className="font-medium text-foreground">{destinationInfo.flightDuration}</span></p>
                    )}
                  </div>
                </div>

                {/* Amenities */}
                <div>
                  <p className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Utensils className="w-4 h-4 text-cyan-600" />
                    Amenities
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {destinationInfo.amenities.map((amenity, idx) => (
                      <p key={idx} className="text-sm text-foreground">• {amenity}</p>
                    ))}
                  </div>
                  <div className="mt-3 space-y-1 text-sm">
                    <p className="text-muted-foreground">Guesthouses: <span className="font-semibold text-foreground">{destinationInfo.guesthouses}</span></p>
                    <p className="text-muted-foreground">Resorts: <span className="font-semibold text-foreground">{destinationInfo.resorts}</span></p>
                    <p className="text-muted-foreground">Restaurants: <span className="font-semibold text-foreground">{destinationInfo.restaurants}</span></p>
                  </div>
                </div>

                {/* Activities */}
                <div>
                  <p className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-cyan-600" />
                    Activities
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {destinationInfo.activities.map((activity, idx) => (
                      <p key={idx} className="text-sm text-foreground">• {activity}</p>
                    ))}
                  </div>
                </div>

                {/* Best Time to Visit */}
                <div>
                  <p className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-cyan-600" />
                    Best Time to Visit
                  </p>
                  <p className="text-sm text-foreground mb-2">{destinationInfo.bestMonths.join(", ")}</p>
                  <p className="text-sm text-muted-foreground">{destinationInfo.weatherSummary}</p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
