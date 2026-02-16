import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Compass, Ship, AlertCircle, Loader2 } from "lucide-react";
import { useLocation } from "wouter";
import { getAttractionGuideUrl } from "@/const";

interface NearbyAttractionsSectionProps {
  islandGuideId: number;
  islandName: string;
}

export function NearbyAttractionsSection({
  islandGuideId,
  islandName,
}: NearbyAttractionsSectionProps) {
  const [, navigate] = useLocation();
  const { data: attractions = [], isLoading, error } = trpc.attractionGuides.getNearbyAttractions.useQuery({
    islandGuideId,
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Compass className="w-5 h-5" />
            Nearby Attractions
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (error || !attractions || attractions.length === 0) {
    return null;
  }

  // Group attractions by type
  const groupedAttractions = attractions.reduce(
    (acc: Record<string, any[]>, attraction: any) => {
      const type = attraction.attractionType || "other";
      if (!acc[type]) acc[type] = [];
      acc[type].push(attraction);
      return acc;
    },
    {} as Record<string, any[]>
  );

  const getAttractionTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      dive_site: "🤿 Dive Sites",
      surf_spot: "🏄 Surf Spots",
      snorkeling_spot: "🤽 Snorkeling Spots",
      poi: "📍 Points of Interest",
    };
    return labels[type] || type;
  };

  const getAttractionTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      dive_site: "bg-blue-50 border-blue-200",
      surf_spot: "bg-orange-50 border-orange-200",
      snorkeling_spot: "bg-cyan-50 border-cyan-200",
      poi: "bg-purple-50 border-purple-200",
    };
    return colors[type] || "bg-gray-50 border-gray-200";
  };

  return (
    <Card className="border-accent/20 bg-accent/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-accent" />
          Nearby Attractions from {islandName}
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-2">
          Discover exciting activities and points of interest accessible from this island
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {Object.entries(groupedAttractions).map(([type, typeAttractions]) => (
          <div key={type} className="space-y-3">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              {getAttractionTypeLabel(type)}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {(typeAttractions as any[]).map((attraction: any) => (
                <div
                  key={attraction.id}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${getAttractionTypeColor(
                    attraction.attractionType
                  )}`}
                  onClick={() => navigate(getAttractionGuideUrl(attraction.slug))}
                >
                  {attraction.heroImage && (
                    <div className="mb-3 h-32 rounded-md overflow-hidden bg-gray-200">
                      <img
                        src={attraction.heroImage}
                        alt={attraction.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <h4 className="font-semibold text-sm mb-2 line-clamp-2">
                    {attraction.name}
                  </h4>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                    {attraction.overview}
                  </p>

                  {/* Travel Info */}
                  <div className="space-y-1 text-xs mb-3">
                    {attraction.distance && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        <span>{attraction.distance}</span>
                      </div>
                    )}
                    {attraction.travelTime && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Ship className="w-3 h-3" />
                        <span>{attraction.travelTime}</span>
                      </div>
                    )}
                    {attraction.transportMethod && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <AlertCircle className="w-3 h-3" />
                        <span className="capitalize">{attraction.transportMethod}</span>
                      </div>
                    )}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(getAttractionGuideUrl(attraction.slug));
                    }}
                  >
                    View Guide
                  </Button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
