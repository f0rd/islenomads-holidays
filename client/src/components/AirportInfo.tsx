import { useEffect, useState } from "react";
import { Plane, MapPin, Clock, DollarSign } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface NearbyAirport {
  name: string;
  code: string;
  transferType: string;
  duration: string;
  distance: string;
  description: string;
}

interface AirportInfoProps {
  islandGuideId: number;
  islandName: string;
  nearbyAirports?: string | NearbyAirport[]; // JSON string or array from island_guides
}

export default function AirportInfo({ islandGuideId, islandName, nearbyAirports }: AirportInfoProps) {
  const [airports, setAirports] = useState<NearbyAirport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      if (nearbyAirports) {
        // Handle both string (JSON) and array inputs
        if (typeof nearbyAirports === 'string') {
          const parsed = JSON.parse(nearbyAirports);
          setAirports(Array.isArray(parsed) ? parsed : []);
        } else if (Array.isArray(nearbyAirports)) {
          setAirports(nearbyAirports);
        }
      }
    } catch (error) {
      console.error("Error parsing nearby airports:", error);
    } finally {
      setLoading(false);
    }
  }, [nearbyAirports]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-32 bg-gray-200 rounded-lg animate-pulse" />
      </div>
    );
  }

  if (airports.length === 0) {
    return null;
  }

  const getTransportIcon = (type: string) => {
    const lowerType = type.toLowerCase();
    if (lowerType.includes("speedboat")) return "🚤";
    if (lowerType.includes("ferry")) return "⛴️";
    if (lowerType.includes("seaplane")) return "✈️";
    if (lowerType.includes("dhoni")) return "🛥️";
    if (lowerType.includes("flight")) return "✈️";
    return "🚤";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Plane className="w-6 h-6 text-accent" />
        <h3 className="text-2xl font-bold">How to Get There</h3>
      </div>

      <div className="grid gap-4">
        {airports.map((airport, index) => (
          <Card key={index} className="p-6 border-l-4 border-l-accent hover:shadow-lg transition-shadow">
            {/* Airport Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="text-xl font-bold">{airport.name}</h4>
                  <Badge variant="secondary" className="text-sm">
                    {airport.code}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{airport.description}</p>
              </div>
            </div>

            {/* Transfer Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Transfer Type */}
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <span className="text-2xl">{getTransportIcon(airport.transferType)}</span>
                <div>
                  <p className="text-sm text-muted-foreground">Transfer Method</p>
                  <p className="font-semibold capitalize">{airport.transferType}</p>
                </div>
              </div>

              {/* Duration */}
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <Clock className="w-5 h-5 text-accent" />
                <div>
                  <p className="text-sm text-muted-foreground">Travel Time</p>
                  <p className="font-semibold">{airport.duration}</p>
                </div>
              </div>

              {/* Distance */}
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <MapPin className="w-5 h-5 text-accent" />
                <div>
                  <p className="text-sm text-muted-foreground">Distance</p>
                  <p className="font-semibold">{airport.distance}</p>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Helpful Info */}
      <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
        <p className="text-sm text-muted-foreground">
          <strong>💡 Tip:</strong> Most international flights arrive at Malé International Airport (MLE).
          From there, you can take a speedboat, domestic flight, or seaplane to {islandName}. 
          Check with your resort for transfer arrangements and current schedules.
        </p>
      </div>
    </div>
  );
}
