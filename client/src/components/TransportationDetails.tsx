import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Waves,
  Clock,
  DollarSign,
  MapPin,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Info,
  Zap,
} from "lucide-react";

interface RouteSegment {
  id: number;
  fromLocation: string;
  toLocation: string;
  type: "ferry" | "speedboat";
  duration: string;
  durationMinutes: number;
  price: number;
  name: string;
  schedule?: string | null;
  amenities?: string | null;
  boatInfo?: string | null;
}

interface TransportationRoute {
  id: string;
  segments: RouteSegment[];
  totalDuration: string;
  totalDurationMinutes: number;
  totalCost: number;
  totalStops: number;
  isDirectRoute: boolean;
  layoverTime?: number;
  description: string;
}

interface TransportationDetailsProps {
  routes: TransportationRoute[];
  selectedRoute?: TransportationRoute;
  onRouteSelect?: (route: TransportationRoute) => void;
  isLoading?: boolean;
  error?: string;
}

export default function TransportationDetails({
  routes,
  selectedRoute,
  onRouteSelect,
  isLoading = false,
  error,
}: TransportationDetailsProps) {
  const [expandedRoute, setExpandedRoute] = useState<string | null>(
    selectedRoute?.id || null
  );

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <div className="animate-spin">
            <Waves className="w-8 h-8 text-accent mx-auto mb-4" />
          </div>
          <p className="text-muted-foreground">Finding routes...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive/50">
        <CardContent className="py-8">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-destructive mb-1">
                No Routes Found
              </h4>
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (routes.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="py-12 text-center">
          <MapPin className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No Routes Available
          </h3>
          <p className="text-muted-foreground max-w-sm mx-auto">
            Unfortunately, there are no ferry or speedboat routes between these
            islands. Try selecting different destinations.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="bg-gradient-to-br from-accent/5 to-transparent">
          <CardContent className="pt-4">
            <p className="text-xs text-muted-foreground mb-1">Fastest Route</p>
            <p className="text-lg font-bold text-accent">
              {routes[0]?.totalDuration}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/5 to-transparent">
          <CardContent className="pt-4">
            <p className="text-xs text-muted-foreground mb-1">
              Routes Available
            </p>
            <p className="text-lg font-bold text-blue-600">{routes.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Routes List */}
      <div className="space-y-3">
        {routes.map((route) => (
          <Card
            key={route.id}
            className={`cursor-pointer transition-all border-2 ${
              expandedRoute === route.id
                ? "border-accent bg-accent/5"
                : "border-border hover:border-accent/50"
            }`}
            onClick={() => {
              setExpandedRoute(expandedRoute === route.id ? null : route.id);
              onRouteSelect?.(route);
            }}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <CardTitle className="text-base">
                      {route.description}
                    </CardTitle>
                    {route.isDirectRoute && (
                      <Badge variant="default" className="bg-green-600">
                        Direct
                      </Badge>
                    )}
                    {!route.isDirectRoute && (
                      <Badge variant="secondary">
                        {route.totalStops - 1} Stop
                        {route.totalStops - 1 !== 1 ? "s" : ""}
                      </Badge>
                    )}
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>{route.totalDuration}</span>
                    </div>

                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Waves className="w-4 h-4" />
                      <span>{route.segments.length} Leg(s)</span>
                    </div>
                  </div>
                </div>

                <ArrowRight
                  className={`w-5 h-5 text-accent transition-transform ${
                    expandedRoute === route.id ? "rotate-90" : ""
                  }`}
                />
              </div>
            </CardHeader>

            {/* Expanded Details */}
            {expandedRoute === route.id && (
              <CardContent className="pt-0 space-y-4 border-t border-border">
                {/* Route Segments Timeline */}
                <div className="space-y-3">
                  {route.segments.map((segment, idx) => (
                    <div key={segment.id}>
                      {/* Segment Card */}
                      <div className="p-3 bg-secondary rounded-lg border border-border">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-semibold text-sm text-foreground">
                              Leg {idx + 1}: {segment.fromLocation} →{" "}
                              {segment.toLocation}
                            </h4>
                            <p className="text-xs text-muted-foreground mt-1">
                              {segment.name}
                            </p>
                          </div>
                          <Badge
                            variant={
                              segment.type === "ferry"
                                ? "default"
                                : "secondary"
                            }
                            className="text-xs"
                          >
                            {segment.type === "ferry" ? "🚢 Ferry" : "⚡ Speedboat"}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div>
                            <p className="text-muted-foreground">Duration</p>
                            <p className="font-semibold text-foreground">
                              {segment.duration}
                            </p>
                          </div>

                          <div>
                            <p className="text-muted-foreground">Schedule</p>
                            <p className="font-semibold text-foreground">
                              {segment.schedule || "Daily"}
                            </p>
                          </div>
                        </div>

                        {/* Amenities */}
                        {segment.amenities && (
                          <div className="mt-2 pt-2 border-t border-border">
                            <p className="text-xs text-muted-foreground mb-1">
                              Amenities:
                            </p>
                            <p className="text-xs text-foreground">
                              {segment.amenities}
                            </p>
                          </div>
                        )}

                        {/* Boat Info */}
                        {segment.boatInfo && (
                          <div className="mt-2 pt-2 border-t border-border">
                            <p className="text-xs text-muted-foreground mb-1">
                              Vessel:
                            </p>
                            <p className="text-xs text-foreground">
                              {segment.boatInfo}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Layover Time */}
                      {idx < route.segments.length - 1 && (
                        <div className="flex items-center justify-center py-2">
                          <div className="flex-1 h-px bg-border" />
                          <div className="px-3 text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {route.layoverTime || 120} min layover
                          </div>
                          <div className="flex-1 h-px bg-border" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Total Summary */}
                <div className="p-3 bg-accent/10 rounded-lg border border-accent/20">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Total Journey
                    </p>
                    <p className="font-semibold text-foreground">
                      {route.totalDuration}
                    </p>
                  </div>
                </div>

                {/* Action Button */}
                <Button
                  className="w-full bg-accent hover:bg-accent/90 text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRouteSelect?.(route);
                  }}
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Select This Route
                </Button>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {/* Info Box */}
      <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/20">
        <CardContent className="pt-4">
          <div className="flex gap-3">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-1">
                Route Information
              </p>
              <p className="text-xs text-blue-800 dark:text-blue-400">
                Prices shown are per person. Layover times are estimated. For
                real-time availability and exact pricing, please contact the
                ferry operators directly.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
