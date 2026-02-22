import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Waves, MapPin, Clock, DollarSign, Users, ArrowRight } from "lucide-react";
import { trpc } from "@/lib/trpc";

interface FerryRoute {
  id: number;
  name: string;
  type: "ferry" | "speedboat";
  fromLocation: string;
  toLocation: string;
  duration: string;
  price: number;
  capacity: number;
  schedule?: string | null;
  amenities?: string | null;
  boatInfo?: string | null;
}

interface FerrySearchWidgetProps {
  onRouteSelect?: (route: FerryRoute) => void;
  showTitle?: boolean;
}

export default function FerrySearchWidget({
  onRouteSelect,
  showTitle = true,
}: FerrySearchWidgetProps) {
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [searchDate, setSearchDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [searchResults, setSearchResults] = useState<FerryRoute[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Fetch routes from location
  const { data: outgoingRoutes = [] } = trpc.boatRoutes.fromLocation.useQuery(
    { location: fromLocation },
    { enabled: !!fromLocation && fromLocation.length > 0 }
  );

  // Fetch routes to location
  const { data: incomingRoutes = [] } = trpc.boatRoutes.toLocation.useQuery(
    { location: toLocation },
    { enabled: !!toLocation && toLocation.length > 0 }
  );

  const handleSearch = () => {
    if (!fromLocation || !toLocation) {
      alert("Please select both origin and destination");
      return;
    }

    setIsSearching(true);

    // Filter routes that match the search criteria
    const matchingRoutes = outgoingRoutes.filter(
      (route) => route.toLocation === toLocation
    );

    setSearchResults(matchingRoutes);
    setShowResults(true);
    setIsSearching(false);
  };

  const handleSwapLocations = () => {
    const temp = fromLocation;
    setFromLocation(toLocation);
    setToLocation(temp);
  };

  const commonIslands = [
    "Maafushi",
    "Gulhi",
    "Dhiffushi",
    "Huraa",
    "Thulusdhoo",
    "Himmafushi",
    "Kaashidhoo",
    "Ukulhas",
  ];

  return (
    <Card className="border-accent/20">
      <CardHeader>
        {showTitle && (
          <CardTitle className="flex items-center gap-2">
            <Waves className="w-5 h-5 text-accent" />
            Ferry Search
          </CardTitle>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search Inputs */}
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              From
            </label>
            <Input
              placeholder="Departure island"
              value={fromLocation}
              onChange={(e) => setFromLocation(e.target.value)}
              list="islands-from"
              className="w-full"
            />
            <datalist id="islands-from">
              {commonIslands.map((island) => (
                <option key={island} value={island} />
              ))}
            </datalist>
          </div>

          <div className="flex justify-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSwapLocations}
              className="text-accent hover:bg-accent/10"
            >
              <ArrowRight className="w-4 h-4 rotate-90" />
            </Button>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              To
            </label>
            <Input
              placeholder="Destination island"
              value={toLocation}
              onChange={(e) => setToLocation(e.target.value)}
              list="islands-to"
              className="w-full"
            />
            <datalist id="islands-to">
              {commonIslands.map((island) => (
                <option key={island} value={island} />
              ))}
            </datalist>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Date
            </label>
            <Input
              type="date"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
              className="w-full"
            />
          </div>
        </div>

        {/* Search Button */}
        <Button
          onClick={handleSearch}
          className="w-full bg-accent hover:bg-accent/90 text-white font-semibold"
          disabled={isSearching || !fromLocation || !toLocation}
        >
          {isSearching ? "Searching..." : "Search Ferries"}
        </Button>

        {/* Search Results */}
        {showResults && (
          <div className="space-y-3 pt-4 border-t border-border">
            <h4 className="font-semibold text-sm text-foreground">
              Available Routes ({searchResults.length})
            </h4>

            {searchResults.length > 0 ? (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {searchResults.map((route) => (
                  <button
                    key={route.id}
                    onClick={() => {
                      onRouteSelect?.(route);
                      setShowResults(false);
                    }}
                    className="w-full p-3 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors text-left border border-border hover:border-accent/30"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-sm text-foreground">
                          {route.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {route.fromLocation} → {route.toLocation}
                        </p>
                      </div>
                      <Badge
                        variant={
                          route.type === "ferry" ? "default" : "secondary"
                        }
                        className="text-xs"
                      >
                        {route.type === "ferry" ? "Ferry" : "Speedboat"}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {route.duration}
                      </div>
                      <div className="flex items-center gap-1 text-accent font-semibold">
                        <DollarSign className="w-3 h-3" />
                        ${(route.price / 100).toFixed(2)}
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Users className="w-3 h-3" />
                        {route.capacity}
                      </div>
                    </div>

                    {route.schedule && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Schedule: {route.schedule}
                      </p>
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-secondary rounded-lg text-center">
                <p className="text-sm text-muted-foreground">
                  No direct routes found between {fromLocation} and{" "}
                  {toLocation}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Try different islands or check inter-island routes
                </p>
              </div>
            )}
          </div>
        )}

        {/* Quick Links */}
        <div className="pt-4 border-t border-border">
          <p className="text-xs font-medium text-muted-foreground mb-2">
            Popular Routes
          </p>
          <div className="flex flex-wrap gap-1">
            {[
              { from: "Maafushi", to: "Gulhi" },
              { from: "Male", to: "Maafushi" },
              { from: "Dhiffushi", to: "Huraa" },
            ].map((route, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setFromLocation(route.from);
                  setToLocation(route.to);
                }}
                className="px-2 py-1 bg-secondary rounded text-xs hover:bg-secondary/80 transition-colors text-foreground"
              >
                {route.from} → {route.to}
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
