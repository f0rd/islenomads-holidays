import { useEffect, useState } from "react";
import { Plane, MapPin, Clock, DollarSign, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AirportRoute {
  id: number;
  airportId: number;
  islandGuideId: number;
  transportType: "speedboat" | "ferry" | "seaplane" | "dhoni";
  distance: string | null;
  duration: string;
  price: number | null;
  frequency: string | null;
  operatingDays: string | null;
  description: string | null;
  isPopular: number;
  published: number;
}

interface Airport {
  id: number;
  name: string;
  slug: string;
  iataCode: string;
  icaoCode: string | null;
  description: string | null;
  latitude: string;
  longitude: string;
  atoll: string | null;
  facilities: string | null;
  airlines: string | null;
  internationalFlights: number;
  domesticFlights: number;
  phone: string | null;
  email: string | null;
  website: string | null;
  isActive: number;
  published: number;
}

interface AirportInfoProps {
  islandGuideId: number;
  islandName: string;
}

export default function AirportInfo({ islandGuideId, islandName }: AirportInfoProps) {
  const [airportRoutes, setAirportRoutes] = useState<(AirportRoute & { airport: Airport })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAirportRoutes = async () => {
      try {
        const response = await fetch(
          `/api/airport-routes?islandGuideId=${islandGuideId}`
        );
        if (response.ok) {
          const data = await response.json();
          setAirportRoutes(data);
        }
      } catch (error) {
        console.error("Error fetching airport routes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAirportRoutes();
  }, [islandGuideId]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-32 bg-gray-200 rounded-lg animate-pulse" />
      </div>
    );
  }

  if (airportRoutes.length === 0) {
    return null;
  }

  const getTransportIcon = (type: string) => {
    switch (type) {
      case "speedboat":
        return "🚤";
      case "ferry":
        return "⛴️";
      case "seaplane":
        return "✈️";
      case "dhoni":
        return "🛥️";
      default:
        return "🚤";
    }
  };

  const formatPrice = (price: number | null) => {
    if (!price) return "Contact for price";
    return `MVR ${(price / 100).toFixed(0)}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Plane className="w-6 h-6 text-accent" />
        <h3 className="text-2xl font-bold">How to Get There</h3>
      </div>

      <div className="grid gap-4">
        {airportRoutes.map((route) => (
          <Card key={route.id} className="p-6 border-l-4 border-l-accent hover:shadow-lg transition-shadow">
            {/* Airport Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="text-xl font-bold">{route.airport.name}</h4>
                  <Badge variant="secondary" className="text-sm">
                    {route.airport.iataCode}
                  </Badge>
                </div>
                {route.airport.atoll && (
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {route.airport.atoll}
                  </p>
                )}
              </div>
              {route.isPopular === 1 && (
                <Badge className="bg-accent text-primary">Popular Route</Badge>
              )}
            </div>

            {/* Transfer Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Transport Type */}
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <span className="text-2xl">{getTransportIcon(route.transportType)}</span>
                <div>
                  <p className="text-sm text-muted-foreground">Transfer Type</p>
                  <p className="font-semibold capitalize">{route.transportType.replace("_", " ")}</p>
                </div>
              </div>

              {/* Duration */}
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <Clock className="w-5 h-5 text-accent" />
                <div>
                  <p className="text-sm text-muted-foreground">Travel Time</p>
                  <p className="font-semibold">{route.duration}</p>
                </div>
              </div>

              {/* Distance */}
              {route.distance && (
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <MapPin className="w-5 h-5 text-accent" />
                  <div>
                    <p className="text-sm text-muted-foreground">Distance</p>
                    <p className="font-semibold">{route.distance}</p>
                  </div>
                </div>
              )}

              {/* Price */}
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <DollarSign className="w-5 h-5 text-accent" />
                <div>
                  <p className="text-sm text-muted-foreground">Estimated Cost</p>
                  <p className="font-semibold">{formatPrice(route.price)}</p>
                </div>
              </div>
            </div>

            {/* Frequency & Operating Days */}
            <div className="flex flex-wrap gap-4 text-sm mb-4">
              {route.frequency && (
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    <strong>Frequency:</strong> {route.frequency}
                  </span>
                </div>
              )}
              {route.operatingDays && (
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    <strong>Operating:</strong> {route.operatingDays}
                  </span>
                </div>
              )}
            </div>

            {/* Description */}
            {route.description && (
              <p className="text-sm text-muted-foreground italic border-t pt-3">
                {route.description}
              </p>
            )}

            {/* Airport Facilities */}
            {route.airport.facilities && (
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm font-semibold mb-2">Airport Facilities:</p>
                <div className="flex flex-wrap gap-2">
                  {JSON.parse(route.airport.facilities).map((facility: string, idx: number) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {facility}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Info */}
            {(route.airport.phone || route.airport.email || route.airport.website) && (
              <div className="mt-4 pt-4 border-t text-sm">
                <p className="font-semibold mb-2">Contact:</p>
                <div className="space-y-1 text-muted-foreground">
                  {route.airport.phone && <p>📞 {route.airport.phone}</p>}
                  {route.airport.email && <p>📧 {route.airport.email}</p>}
                  {route.airport.website && (
                    <p>
                      🌐{" "}
                      <a
                        href={`https://${route.airport.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent hover:underline"
                      >
                        {route.airport.website}
                      </a>
                    </p>
                  )}
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Helpful Info */}
      <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
        <p className="text-sm text-muted-foreground">
          <strong>💡 Tip:</strong> Most international flights arrive at Malé International Airport (MLE).
          From there, you can take a speedboat to {islandName}. Check with your resort for transfer arrangements.
        </p>
      </div>
    </div>
  );
}
