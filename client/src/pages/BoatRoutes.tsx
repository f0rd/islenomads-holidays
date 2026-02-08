import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Palmtree, Waves, Ship, Clock, Users, Zap } from "lucide-react";
import { SPEEDBOAT_ROUTES, PUBLIC_FERRY_ROUTES, BOAT_INFORMATION } from "@/data/boatRoutes";

export default function BoatRoutes() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRoute, setSelectedRoute] = useState<(typeof SPEEDBOAT_ROUTES)[0] | (typeof PUBLIC_FERRY_ROUTES)[0] | null>(null);
  const [selectedBoat, setSelectedBoat] = useState<(typeof BOAT_INFORMATION)[0] | null>(null);
  const [routeType, setRouteType] = useState<"all" | "speedboat" | "ferry">("all");
  const [filteredSpeedboats, setFilteredSpeedboats] = useState(SPEEDBOAT_ROUTES);
  const [filteredFerries, setFilteredFerries] = useState(PUBLIC_FERRY_ROUTES);

  // Filter routes based on search
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    const searchLower = term.toLowerCase();

    const speedboats = SPEEDBOAT_ROUTES.filter(
      (route) =>
        route.name.toLowerCase().includes(searchLower) ||
        route.startPoint.toLowerCase().includes(searchLower) ||
        route.endPoint.toLowerCase().includes(searchLower)
    );

    const ferries = PUBLIC_FERRY_ROUTES.filter(
      (route) =>
        route.name.toLowerCase().includes(searchLower) ||
        route.startPoint.toLowerCase().includes(searchLower) ||
        route.endPoint.toLowerCase().includes(searchLower)
    );

    setFilteredSpeedboats(speedboats);
    setFilteredFerries(ferries);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <section className="flex-1 py-12 bg-gradient-to-b from-background to-secondary/20 pt-24">
        <div className="container max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Boat Routes & Transportation
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore speedboat and ferry routes connecting Malé to islands and atolls. 
              View detailed schedules, pricing, and boat information for your journey.
            </p>
          </div>

          {/* Search and Filter */}
          <div className="mb-8 space-y-4">
            <Input
              placeholder="Search routes by name, start point, or destination..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full h-12 text-base"
            />

            {/* Route Type Filter */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setRouteType("all")}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  routeType === "all"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-foreground hover:bg-secondary/80"
                }`}
              >
                All Routes
              </button>
              <button
                onClick={() => setRouteType("speedboat")}
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  routeType === "speedboat"
                    ? "bg-blue-600 text-white"
                    : "bg-secondary text-foreground hover:bg-secondary/80"
                }`}
              >
                <Zap className="w-4 h-4" />
                Speedboats
              </button>
              <button
                onClick={() => setRouteType("ferry")}
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  routeType === "ferry"
                    ? "bg-cyan-600 text-white"
                    : "bg-secondary text-foreground hover:bg-secondary/80"
                }`}
              >
                <Ship className="w-4 h-4" />
                Ferries
              </button>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Routes List */}
            <div className="lg:col-span-2 space-y-4">
              {/* Speedboat Routes */}
              {(routeType === "all" || routeType === "speedboat") && (
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                    <Zap className="w-6 h-6 text-blue-600" />
                    Speedboat Routes ({filteredSpeedboats.length})
                  </h2>
                  <div className="space-y-3">
                    {filteredSpeedboats.length > 0 ? (
                      filteredSpeedboats.map((route) => (
                        <Card
                          key={route.id}
                          onClick={() => setSelectedRoute(route)}
                          className={`cursor-pointer transition-all ${
                            selectedRoute?.id === route.id
                              ? "border-blue-600 bg-blue-50 shadow-lg"
                              : "hover:shadow-md"
                          }`}
                        >
                          <CardContent className="pt-6">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h3 className="font-bold text-foreground text-lg">{route.name}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {route.startPoint} → {route.endPoint}
                                </p>
                              </div>
                              <div className="text-right">
                                <div className="text-xl font-bold text-blue-600">{route.price}</div>
                                <div className="text-xs text-muted-foreground">{route.duration}</div>
                              </div>
                            </div>
                            <div className="grid grid-cols-4 gap-2 text-sm">
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4 text-muted-foreground" />
                                <span>{route.frequency}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Users className="w-4 h-4 text-muted-foreground" />
                                <span>{route.capacity} pax</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Zap className="w-4 h-4 text-muted-foreground" />
                                <span>{route.speed}</span>
                              </div>
                              <div className="text-muted-foreground">{route.distance}</div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <div className="text-center text-muted-foreground py-8">
                        No speedboat routes found
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Ferry Routes */}
              {(routeType === "all" || routeType === "ferry") && (
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                    <Ship className="w-6 h-6 text-cyan-600" />
                    Public Ferry Routes ({filteredFerries.length})
                  </h2>
                  <div className="space-y-3">
                    {filteredFerries.length > 0 ? (
                      filteredFerries.map((route) => (
                        <Card
                          key={route.id}
                          onClick={() => setSelectedRoute(route)}
                          className={`cursor-pointer transition-all ${
                            selectedRoute?.id === route.id
                              ? "border-cyan-600 bg-cyan-50 shadow-lg"
                              : "hover:shadow-md"
                          }`}
                        >
                          <CardContent className="pt-6">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h3 className="font-bold text-foreground text-lg">{route.name}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {route.startPoint} → {route.endPoint}
                                </p>
                              </div>
                              <div className="text-right">
                                <div className="text-xl font-bold text-cyan-600">{route.price}</div>
                                <div className="text-xs text-muted-foreground">{route.duration}</div>
                              </div>
                            </div>
                            <div className="grid grid-cols-4 gap-2 text-sm">
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4 text-muted-foreground" />
                                <span>{route.frequency}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Users className="w-4 h-4 text-muted-foreground" />
                                <span>{route.capacity} pax</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Zap className="w-4 h-4 text-muted-foreground" />
                                <span>{route.speed}</span>
                              </div>
                              <div className="text-muted-foreground">{route.distance}</div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <div className="text-center text-muted-foreground py-8">
                        No ferry routes found
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar - Boat Information */}
            <div className="lg:col-span-1">
              <Card className="h-full overflow-hidden flex flex-col">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Ship className="w-5 h-5 text-cyan-600" />
                    Boat Fleet ({BOAT_INFORMATION.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto space-y-2 max-h-96">
                  {BOAT_INFORMATION.map((boat) => (
                    <div
                      key={boat.id}
                      onClick={() => setSelectedBoat(boat)}
                      className={`p-3 rounded-lg cursor-pointer transition-all text-sm ${
                        selectedBoat?.id === boat.id
                          ? "bg-cyan-600 text-white shadow-lg"
                          : "bg-secondary hover:bg-secondary/80"
                      }`}
                    >
                      <div className="font-semibold">{boat.name}</div>
                      <div className="text-xs opacity-75">{boat.type}</div>
                      <div className="text-xs opacity-75 mt-1">⭐ {boat.rating}</div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Route Details */}
          {selectedRoute && (
            <Card className="mt-8 border-blue-600">
              <CardHeader className="bg-blue-50">
                <CardTitle className="flex items-center gap-2 text-blue-900">
                  <Zap className="w-5 h-5" />
                  {selectedRoute.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Route Information */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-foreground mb-4">Route Information</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between border-b border-border pb-2">
                          <span className="text-muted-foreground">From</span>
                          <span className="font-semibold">{selectedRoute.startPoint}</span>
                        </div>
                        <div className="flex justify-between border-b border-border pb-2">
                          <span className="text-muted-foreground">To</span>
                          <span className="font-semibold">{selectedRoute.endPoint}</span>
                        </div>
                        <div className="flex justify-between border-b border-border pb-2">
                          <span className="text-muted-foreground">Distance</span>
                          <span className="font-semibold">{selectedRoute.distance}</span>
                        </div>
                        <div className="flex justify-between border-b border-border pb-2">
                          <span className="text-muted-foreground">Duration</span>
                          <span className="font-semibold">{selectedRoute.duration}</span>
                        </div>
                        <div className="flex justify-between border-b border-border pb-2">
                          <span className="text-muted-foreground">Speed</span>
                          <span className="font-semibold">{selectedRoute.speed}</span>
                        </div>
                        <div className="flex justify-between border-b border-border pb-2">
                          <span className="text-muted-foreground">Price</span>
                          <span className="font-semibold text-lg text-blue-600">{selectedRoute.price}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-foreground mb-3">Operator</h3>
                      <p className="text-foreground font-medium">{selectedRoute.operator}</p>
                    </div>
                  </div>

                  {/* Schedule and Amenities */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-foreground mb-3">Departure Schedule</h3>
                      <div className="grid grid-cols-3 gap-2">
                        {selectedRoute.schedule.map((time, idx) => (
                          <div
                            key={idx}
                            className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg text-center font-medium text-sm"
                          >
                            {time}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-foreground mb-3">Amenities</h3>
                      <div className="space-y-2">
                        {selectedRoute.amenities.map((amenity, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                            <span className="text-foreground">{amenity}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-foreground mb-3">Capacity & Frequency</h3>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-blue-600" />
                          <span className="text-foreground">Capacity: {selectedRoute.capacity} passengers</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-blue-600" />
                          <span className="text-foreground">Frequency: {selectedRoute.frequency}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Boat Details */}
          {selectedBoat && (
            <Card className="mt-8 border-cyan-600">
              <CardHeader className="bg-cyan-50">
                <CardTitle className="flex items-center gap-2 text-cyan-900">
                  <Ship className="w-5 h-5" />
                  {selectedBoat.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Boat Specifications */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-foreground mb-4">Specifications</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between border-b border-border pb-2">
                          <span className="text-muted-foreground">Type</span>
                          <span className="font-semibold">{selectedBoat.type}</span>
                        </div>
                        <div className="flex justify-between border-b border-border pb-2">
                          <span className="text-muted-foreground">Length</span>
                          <span className="font-semibold">{selectedBoat.length}</span>
                        </div>
                        <div className="flex justify-between border-b border-border pb-2">
                          <span className="text-muted-foreground">Speed</span>
                          <span className="font-semibold">{selectedBoat.speed}</span>
                        </div>
                        <div className="flex justify-between border-b border-border pb-2">
                          <span className="text-muted-foreground">Capacity</span>
                          <span className="font-semibold">{selectedBoat.capacity} passengers</span>
                        </div>
                        <div className="flex justify-between border-b border-border pb-2">
                          <span className="text-muted-foreground">Year Built</span>
                          <span className="font-semibold">{selectedBoat.yearBuilt}</span>
                        </div>
                        <div className="flex justify-between border-b border-border pb-2">
                          <span className="text-muted-foreground">Rating</span>
                          <span className="font-semibold">⭐ {selectedBoat.rating}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-foreground mb-3">Description</h3>
                      <p className="text-muted-foreground">{selectedBoat.description}</p>
                    </div>
                  </div>

                  {/* Amenities and Safety */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-foreground mb-3">Amenities</h3>
                      <div className="space-y-2">
                        {selectedBoat.amenities.map((amenity, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-cyan-600 rounded-full"></div>
                            <span className="text-foreground">{amenity}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-foreground mb-3">Safety Features</h3>
                      <div className="space-y-2">
                        {selectedBoat.safetyFeatures.map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                            <span className="text-foreground">{feature}</span>
                          </div>
                        ))}
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
