import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Waves, MapPin, Clock, DollarSign, Users, ArrowRight, Zap } from "lucide-react";
import { trpc } from "@/lib/trpc";
import TransportationDetails from "./TransportationDetails";

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
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<any>(null);
  const [optimization, setOptimization] = useState<'speed' | 'cost' | 'comfort' | 'balanced'>('balanced');

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

  // Fetch optimized routes using routing system
  const { data: routeOptions = [], isLoading: isLoadingRoutes } = trpc.boatRoutes.findOptimized.useQuery(
    { from: fromLocation, to: toLocation, optimization: 'balanced' },
    { enabled: !!fromLocation && !!toLocation && showResults }
  );

  const handleSearch = () => {
    if (!fromLocation || !toLocation) {
      alert("Please select both origin and destination");
      return;
    }

    setIsSearching(true);
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
            <TransportationDetails
              routes={routeOptions}
              selectedRoute={selectedRoute}
              onRouteSelect={(route: any) => {
                setSelectedRoute(route);
                onRouteSelect?.(route);
              }}
              isLoading={isLoadingRoutes}
              error={routeOptions.length === 0 && !isLoadingRoutes ? "No routes found between these islands" : undefined}
            />
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
