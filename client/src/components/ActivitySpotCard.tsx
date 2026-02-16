import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Waves, Fish, Wind, AlertCircle, Calendar, Zap } from "lucide-react";
import { Link } from "wouter";

interface ActivitySpotCardProps {
  id: number;
  name: string;
  slug: string;
  spotType: "dive_site" | "snorkeling_spot" | "surf_spot";
  category?: string;
  description?: string;
  difficulty?: "beginner" | "intermediate" | "advanced";
  bestSeason?: string;
  marineLife?: string;
  fishSpecies?: string;
  waveHeight?: string;
  waveType?: string;
  coralCoverage?: string;
  rating?: string;
  reviewCount?: number;
  maxDepth?: number;
  minDepth?: number;
  images?: string[];
}

export default function ActivitySpotCard({
  id,
  name,
  slug,
  spotType,
  category,
  description,
  difficulty,
  bestSeason,
  marineLife,
  fishSpecies,
  waveHeight,
  waveType,
  coralCoverage,
  rating,
  reviewCount,
  maxDepth,
  minDepth,
  images,
}: ActivitySpotCardProps) {
  const getDifficultyColor = (level?: string) => {
    switch (level) {
      case "beginner":
        return "bg-green-100 text-green-800";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "advanced":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getSpotTypeIcon = (type: string) => {
    switch (type) {
      case "dive_site":
        return <Fish className="w-4 h-4" />;
      case "snorkeling_spot":
        return <Zap className="w-4 h-4" />;
      case "surf_spot":
        return <Wind className="w-4 h-4" />;
      default:
        return <Waves className="w-4 h-4" />;
    }
  };

  const getSpotTypeLabel = (type: string) => {
    switch (type) {
      case "dive_site":
        return "Dive Site";
      case "snorkeling_spot":
        return "Snorkeling";
      case "surf_spot":
        return "Surf Break";
      default:
        return "Activity Spot";
    }
  };

  const marineLifeArray = marineLife ? JSON.parse(marineLife) : [];
  const fishSpeciesArray = fishSpecies ? JSON.parse(fishSpecies) : [];

  return (
    <Link href={`/activity-spot/${slug}`} className="block">
      <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer overflow-hidden">
        {/* Image Section */}
        {images && images.length > 0 && (
          <div className="relative w-full h-48 bg-gradient-to-br from-primary/20 to-accent/20 overflow-hidden">
            <img
              src={images[0]}
              alt={name}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute top-3 right-3">
              <Badge variant="secondary" className="gap-1">
                {getSpotTypeIcon(spotType)}
                {getSpotTypeLabel(spotType)}
              </Badge>
            </div>
          </div>
        )}

        <CardContent className="pt-4">
          {/* Title and Category */}
          <div className="mb-3">
            <h3 className="text-lg font-semibold text-foreground mb-1">{name}</h3>
            {category && (
              <p className="text-sm text-muted-foreground">{category}</p>
            )}
          </div>

          {/* Description */}
          {description && (
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {description}
            </p>
          )}

          {/* Difficulty Badge */}
          {difficulty && (
            <div className="mb-3">
              <Badge className={getDifficultyColor(difficulty)}>
                {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Level
              </Badge>
            </div>
          )}

          {/* Key Information Grid */}
          <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
            {/* Best Season */}
            {bestSeason && (
              <div className="flex items-start gap-2">
                <Calendar className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Best Season</p>
                  <p className="font-medium text-foreground">{bestSeason}</p>
                </div>
              </div>
            )}

            {/* Depth Info (for dive sites) */}
            {spotType === "dive_site" && (maxDepth || minDepth) && (
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Depth Range</p>
                  <p className="font-medium text-foreground">
                    {minDepth}-{maxDepth}m
                  </p>
                </div>
              </div>
            )}

            {/* Wave Height (for surf spots) */}
            {spotType === "surf_spot" && waveHeight && (
              <div className="flex items-start gap-2">
                <Waves className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Wave Height</p>
                  <p className="font-medium text-foreground">{waveHeight}</p>
                </div>
              </div>
            )}

            {/* Coral Coverage (for snorkeling) */}
            {spotType === "snorkeling_spot" && coralCoverage && (
              <div className="flex items-start gap-2">
                <Zap className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Coral Coverage</p>
                  <p className="font-medium text-foreground">{coralCoverage}</p>
                </div>
              </div>
            )}
          </div>

          {/* Marine Life / Fish Species Tags */}
          {(marineLifeArray.length > 0 || fishSpeciesArray.length > 0) && (
            <div className="mb-4">
              <p className="text-xs text-muted-foreground mb-2">
                {spotType === "dive_site" ? "Marine Life" : "Species"}
              </p>
              <div className="flex flex-wrap gap-1">
                {(marineLifeArray.length > 0 ? marineLifeArray : fishSpeciesArray)
                  .slice(0, 3)
                  .map((species: string, index: number) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {species}
                    </Badge>
                  ))}
                {(marineLifeArray.length > 3 || fishSpeciesArray.length > 3) && (
                  <Badge variant="outline" className="text-xs">
                    +{(marineLifeArray.length || fishSpeciesArray.length) - 3} more
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Rating */}
          {rating && (
            <div className="flex items-center gap-2 pt-3 border-t border-border">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-accent text-accent" />
                <span className="font-semibold text-foreground">{rating}</span>
              </div>
              {reviewCount && (
                <span className="text-xs text-muted-foreground">
                  ({reviewCount} reviews)
                </span>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
