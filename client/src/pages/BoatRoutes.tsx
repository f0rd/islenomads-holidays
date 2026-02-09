import { useState, useMemo } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Palmtree, Waves, Ship, Clock, Users, Zap } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { BOAT_INFORMATION } from "@/data/boatRoutes";

export default function BoatRoutes() {
  const { data: transports = [], isLoading } = trpc.transports.list.useQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRoute, setSelectedRoute] = useState<any | null>(null);
  const [selectedBoat, setSelectedBoat] = useState<(typeof BOAT_INFORMATION)[0] | null>(null);
  const [routeType, setRouteType] = useState<"all" | "speedboat" | "ferry">("all");

  // Convert database transports to display format
  const convertTransportToRoute = (transport: any, type: "speedboat" | "ferry") => ({
    id: `transport-${transport.id}`,
    name: transport.name,
    type: type === "speedboat" ? "Speedboat Route" : "Ferry Route",
    startPoint: transport.fromLocation.replace(/-/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase()),
    endPoint: transport.toLocation.replace(/-/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase()),
    duration: `${transport.durationMinutes} mins`,
    distance: "N/A",
    frequency: "Multiple times daily",
    capacity: transport.capacity,
    speed: type === "speedboat" ? "40 knots" : "25 knots",
    price: `$${transport.priceUSD}`,
    amenities: transport.amenities ? JSON.parse(transport.amenities) : ["Life Jackets"],
    operator: transport.operator,
    schedule: transport.schedule ? JSON.parse(transport.schedule) : [transport.departureTime || "06:00"],
    transportType: transport.transportType,
    durationMinutes: transport.durationMinutes,
    priceUSD: transport.priceUSD,
  });

  // Memoize converted routes to avoid recalculation
  const { speedboats, ferries } = useMemo(() => {
    const speedboatList = transports
      .filter((t: any) => t.transportType === "speedboat")
      .map((t: any) => convertTransportToRoute(t, "speedboat"));
    
    const ferryList = transports
      .filter((t: any) => t.transportType === "ferry")
      .map((t: any) => convertTransportToRoute(t, "ferry"));

    return { speedboats: speedboatList, ferries: ferryList };
  }, [transports]);

  // Filter routes based on search and type
  const filteredRoutes = useMemo(() => {
    const searchLower = searchTerm.toLowerCase();
    let allRoutes = [...speedboats, ...ferries];

    // Filter by type
    if (routeType === "speedboat") {
      allRoutes = speedboats;
    } else if (routeType === "ferry") {
      allRoutes = ferries;
    }

    // Filter by search term
    return allRoutes.filter(
      (route) =>
        route.name.toLowerCase().includes(searchLower) ||
        route.startPoint.toLowerCase().includes(searchLower) ||
        route.endPoint.toLowerCase().includes(searchLower)
    );
  }, [speedboats, ferries, searchTerm, routeType]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-lg text-muted-foreground">Loading boat routes...</p>
        </div>
        <Footer />
      </div>
    );
  }

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
                All Routes ({filteredRoutes.length})
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
                Speedboats ({speedboats.length})
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
                Ferries ({ferries.length})
              </button>
            </div>
          </div>

          {/* Routes Grid */}
          {filteredRoutes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {filteredRoutes.map((route) => (
                <Card
                  key={route.id}
                  className="cursor-pointer hover:shadow-lg transition-all"
                  onClick={() => setSelectedRoute(route)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{route.name}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">{route.type}</p>
                      </div>
                      {route.transportType === "speedboat" ? (
                        <Zap className="w-5 h-5 text-blue-600" />
                      ) : (
                        <Ship className="w-5 h-5 text-cyan-600" />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Waves className="w-4 h-4 text-muted-foreground" />
                      <span>
                        {route.startPoint} → {route.endPoint}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{route.duration}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{route.capacity} pax</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t">
                      <p className="font-semibold text-lg text-primary">{route.price}</p>
                      <p className="text-xs text-muted-foreground">Operator: {route.operator}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">No routes found matching your search.</p>
            </div>
          )}

          {/* Selected Route Details */}
          {selectedRoute && (
            <Card className="mb-12 border-primary/50 bg-primary/5">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl">{selectedRoute.name}</CardTitle>
                  <button
                    onClick={() => setSelectedRoute(null)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    ✕
                  </button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3">Route Information</h3>
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="text-muted-foreground">From:</span> {selectedRoute.startPoint}
                      </p>
                      <p>
                        <span className="text-muted-foreground">To:</span> {selectedRoute.endPoint}
                      </p>
                      <p>
                        <span className="text-muted-foreground">Duration:</span> {selectedRoute.duration}
                      </p>
                      <p>
                        <span className="text-muted-foreground">Distance:</span> {selectedRoute.distance}
                      </p>
                      <p>
                        <span className="text-muted-foreground">Frequency:</span> {selectedRoute.frequency}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Vessel Information</h3>
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="text-muted-foreground">Type:</span> {selectedRoute.type}
                      </p>
                      <p>
                        <span className="text-muted-foreground">Capacity:</span> {selectedRoute.capacity} passengers
                      </p>
                      <p>
                        <span className="text-muted-foreground">Speed:</span> {selectedRoute.speed}
                      </p>
                      <p>
                        <span className="text-muted-foreground">Operator:</span> {selectedRoute.operator}
                      </p>
                      <p>
                        <span className="text-muted-foreground">Price:</span> {selectedRoute.price}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Amenities</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedRoute.amenities.map((amenity: string, idx: number) => (
                      <span key={idx} className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm">
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>

                {selectedRoute.schedule && selectedRoute.schedule.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3">Departure Times</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedRoute.schedule.map((time: string, idx: number) => (
                        <span key={idx} className="bg-primary/10 text-primary px-3 py-1 rounded text-sm font-medium">
                          {time}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
