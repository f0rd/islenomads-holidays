import { useParams, Link as WouterLink } from "wouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Calendar, AlertCircle, Waves, Fish, Wind, Zap, Users, Clock } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Loader2 } from "lucide-react";

export default function ActivitySpotDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: spot, isLoading, error } = trpc.activitySpots.getBySlug.useQuery(
    { slug: slug || "" },
    { enabled: !!slug }
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-accent" />
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !spot) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container py-20 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">Activity Spot Not Found</h1>
          <p className="text-muted-foreground mb-8">The activity spot you're looking for doesn't exist.</p>
          <WouterLink href="/explore-maldives">
            <Button>Back to Explore</Button>
          </WouterLink>
        </div>
        <Footer />
      </div>
    );
  }

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
        return <Fish className="w-5 h-5" />;
      case "snorkeling_spot":
        return <Zap className="w-5 h-5" />;
      case "surf_spot":
        return <Wind className="w-5 h-5" />;
      default:
        return <Waves className="w-5 h-5" />;
    }
  };

  const getSpotTypeLabel = (type: string) => {
    switch (type) {
      case "dive_site":
        return "Dive Site";
      case "snorkeling_spot":
        return "Snorkeling Spot";
      case "surf_spot":
        return "Surf Break";
      default:
        return "Activity Spot";
    }
  };

  const marineLifeArray = spot.marineLife ? JSON.parse(spot.marineLife) : [];
  const fishSpeciesArray = spot.fishSpecies ? JSON.parse(spot.fishSpecies) : [];
  const tipsArray = spot.tips ? JSON.parse(spot.tips) : [];
  const facilitiesArray = spot.facilities ? JSON.parse(spot.facilities) : [];
  const imagesArray = spot.images ? JSON.parse(spot.images) : [];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section with Image */}
      {imagesArray.length > 0 && (
        <div className="relative w-full h-96 bg-gradient-to-br from-primary/20 to-accent/20 overflow-hidden">
          <img
            src={imagesArray[0]}
            alt={spot.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>
      )}

      {/* Main Content */}
      <section className="py-12 md:py-16">
        <div className="container max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              {getSpotTypeIcon(spot.spotType)}
              <Badge variant="secondary">{getSpotTypeLabel(spot.spotType)}</Badge>
              {spot.difficulty && (
                <Badge className={getDifficultyColor(spot.difficulty)}>
                  {spot.difficulty.charAt(0).toUpperCase() + spot.difficulty.slice(1)}
                </Badge>
              )}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">{spot.name}</h1>
            {spot.category && (
              <p className="text-lg text-muted-foreground mb-4">{spot.category}</p>
            )}

            {/* Rating */}
            {spot.rating && (
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 fill-accent text-accent" />
                  <span className="text-2xl font-bold text-foreground">{spot.rating}</span>
                </div>
                {spot.reviewCount && (
                  <span className="text-muted-foreground">({spot.reviewCount} reviews)</span>
                )}
              </div>
            )}
          </div>

          {/* Description */}
          {spot.description && (
            <Card className="mb-8">
              <CardContent className="pt-6">
                <p className="text-lg text-foreground leading-relaxed">{spot.description}</p>
              </CardContent>
            </Card>
          )}

          {/* Key Information Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Best Season */}
            {spot.bestSeason && (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <Calendar className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Best Season</h3>
                      <p className="text-muted-foreground">{spot.bestSeason}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Difficulty Level */}
            {spot.difficulty && (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <AlertCircle className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Difficulty Level</h3>
                      <Badge className={getDifficultyColor(spot.difficulty)}>
                        {spot.difficulty.charAt(0).toUpperCase() + spot.difficulty.slice(1)}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Depth Range (for dive sites) */}
            {spot.spotType === "dive_site" && (spot.maxDepth || spot.minDepth) && (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <Waves className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Depth Range</h3>
                      <p className="text-muted-foreground">
                        {spot.minDepth}-{spot.maxDepth} meters
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Wave Height (for surf spots) */}
            {spot.spotType === "surf_spot" && spot.waveHeight && (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <Wind className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Wave Height</h3>
                      <p className="text-muted-foreground">{spot.waveHeight}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Coral Coverage (for snorkeling) */}
            {spot.spotType === "snorkeling_spot" && spot.coralCoverage && (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <Zap className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Coral Coverage</h3>
                      <p className="text-muted-foreground">{spot.coralCoverage}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Marine Life / Species */}
          {(marineLifeArray.length > 0 || fishSpeciesArray.length > 0) && (
            <Card className="mb-8">
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold text-foreground mb-4">
                  {spot.spotType === "dive_site" ? "Marine Life" : "Fish Species"}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(marineLifeArray.length > 0 ? marineLifeArray : fishSpeciesArray).map(
                    (species: string, index: number) => (
                      <Badge key={index} variant="outline">
                        {species}
                      </Badge>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tips and Recommendations */}
          {tipsArray.length > 0 && (
            <Card className="mb-8">
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold text-foreground mb-4">Tips & Recommendations</h3>
                <ul className="space-y-3">
                  {tipsArray.map((tip: string, index: number) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />
                      <span className="text-muted-foreground">{tip}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Facilities */}
          {facilitiesArray.length > 0 && (
            <Card className="mb-8">
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold text-foreground mb-4">Facilities & Services</h3>
                <div className="flex flex-wrap gap-2">
                  {facilitiesArray.map((facility: string, index: number) => (
                    <Badge key={index} variant="secondary">
                      {facility}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* CTA Section */}
          <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
            <CardContent className="pt-8">
              <h3 className="text-2xl font-bold text-foreground mb-4">Ready to Experience This?</h3>
              <p className="text-muted-foreground mb-6">
                Contact our team to plan your perfect adventure at {spot.name}.
              </p>
              <WouterLink href="/trip-planner">
                <Button size="lg" className="gap-2">
                  <MapPin className="w-4 h-4" />
                  Plan Your Trip
                </Button>
              </WouterLink>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}
