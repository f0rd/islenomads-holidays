import { useParams, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Loader2, MapPin, Calendar, AlertCircle, ArrowLeft, Share2, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

/**
 * Attraction Guide Page
 * Displays detailed information about attractions (dive sites, surf spots, snorkeling spots, POIs)
 * Similar to IslandGuide but tailored for attractions
 */
export default function AttractionGuide() {
  const { slug } = useParams<{ slug: string }>();
  const [, setLocation] = useLocation();

  const { data: guide, isLoading, error } = trpc.attractionGuides.getBySlug.useQuery(
    { slug: slug || "" },
    { enabled: !!slug }
  );

  if (!slug) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="flex-1 container py-12">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-red-600">Attraction not found</h1>
            <p className="text-gray-600 mt-2">The attraction slug is missing</p>
            <Button onClick={() => setLocation("/explore-maldives")} className="mt-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Explore
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="flex-1 container flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !guide) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="flex-1 container py-12">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h2 className="text-lg font-semibold text-red-900">Attraction not found</h2>
                <p className="text-red-700 mt-1">
                  We couldn't find the attraction guide you're looking for.
                </p>
                <Button
                  onClick={() => setLocation("/explore-maldives")}
                  className="mt-4"
                  variant="outline"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Explore
                </Button>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Parse JSON fields if they exist
  const quickFacts = guide.quickFacts ? JSON.parse(guide.quickFacts) : [];
  const marineLife = guide.marineLife ? JSON.parse(guide.marineLife) : [];
  const facilities = guide.facilities ? JSON.parse(guide.facilities) : [];
  const safetyTips = guide.safetyTips ? JSON.parse(guide.safetyTips) : [];
  const localRules = guide.localRules ? JSON.parse(guide.localRules) : [];

  const getAttractionTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      dive_site: "Dive Site",
      surf_spot: "Surf Spot",
      snorkeling_spot: "Snorkeling Spot",
      poi: "Point of Interest",
    };
    return labels[type] || type;
  };

  const NearbyIslandsSection = ({ attractionGuideId }: { attractionGuideId: number }) => {
    const { data: relatedIslands = [] } = trpc.attractionGuides.getRelatedIslands.useQuery({
      attractionGuideId,
    });

    if (relatedIslands.length === 0) return null;

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LinkIcon className="w-5 h-5" />
            Nearby Islands
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {relatedIslands.map((link: any) => (
              <div key={link.id} className="flex items-start justify-between pb-3 border-b last:border-b-0">
                <div className="flex-1">
                  <p className="font-semibold text-primary hover:underline cursor-pointer">
                    {link.island?.name}
                  </p>
                  {link.distance && <p className="text-sm text-gray-600">Distance: {link.distance}</p>}
                  {link.travelTime && <p className="text-sm text-gray-600">Travel Time: {link.travelTime}</p>}
                  {link.transportMethod && <p className="text-sm text-gray-600">Transport: {link.transportMethod}</p>}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };
  const getDifficultyColor = (difficulty: string) => {
    const colors: Record<string, string> = {
      beginner: "bg-green-100 text-green-800",
      intermediate: "bg-yellow-100 text-yellow-800",
      advanced: "bg-orange-100 text-orange-800",
      expert: "bg-red-100 text-red-800",
    };
    return colors[difficulty] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      {/* Hero Section */}
      {guide.heroImage && (
        <div className="relative h-96 bg-gray-900 overflow-hidden">
          <img
            src={guide.heroImage}
            alt={guide.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div className="container">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-1 bg-primary rounded-full text-sm font-semibold">
                      {getAttractionTypeLabel(guide.attractionType)}
                    </span>
                    {guide.difficulty && (
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getDifficultyColor(guide.difficulty)}`}>
                        {guide.difficulty.charAt(0).toUpperCase() + guide.difficulty.slice(1)}
                      </span>
                    )}
                  </div>
                  <h1 className="text-4xl font-bold">{guide.name}</h1>
                  {guide.nearestIsland && (
                    <p className="text-gray-200 mt-2 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Near {guide.nearestIsland}
                      {guide.distanceFromIsland && ` • ${guide.distanceFromIsland}`}
                    </p>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-white/20 border-white text-white hover:bg-white/30"
                >
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="info">Info</TabsTrigger>
                <TabsTrigger value="safety">Safety</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                {guide.overview && (
                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-gray-700 leading-relaxed">{guide.overview}</p>
                    </CardContent>
                  </Card>
                )}

                {quickFacts.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Quick Facts</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {quickFacts.map((fact: string, idx: number) => (
                          <li key={idx} className="flex gap-3">
                            <span className="text-primary font-semibold">•</span>
                            <span className="text-gray-700">{fact}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Details Tab */}
              <TabsContent value="details" className="space-y-6">
                {guide.depthRange && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Depth Range</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-lg font-semibold text-primary">{guide.depthRange}</p>
                    </CardContent>
                  </Card>
                )}

                {guide.waveHeight && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Wave Height</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-lg font-semibold text-primary">{guide.waveHeight}</p>
                    </CardContent>
                  </Card>
                )}

                {marineLife.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Marine Life</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-2">
                        {marineLife.map((species: string, idx: number) => (
                          <div key={idx} className="flex items-center gap-2">
                            <span className="text-primary">✓</span>
                            <span className="text-gray-700">{species}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {guide.bestSeason && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        Best Season
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700">{guide.bestSeason}</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Info Tab */}
              <TabsContent value="info" className="space-y-6">
                {guide.accessInfo && (
                  <Card>
                    <CardHeader>
                      <CardTitle>How to Get There</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 leading-relaxed">{guide.accessInfo}</p>
                    </CardContent>
                  </Card>
                )}

                {facilities.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Facilities</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {facilities.map((facility: string, idx: number) => (
                          <li key={idx} className="flex gap-3">
                            <span className="text-primary">✓</span>
                            <span className="text-gray-700">{facility}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {guide.typicalCost && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Typical Cost</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-lg font-semibold text-primary">{guide.typicalCost}</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Safety Tab */}
              <TabsContent value="safety" className="space-y-6">
                {safetyTips.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Safety Tips</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {safetyTips.map((tip: string, idx: number) => (
                          <li key={idx} className="flex gap-3">
                            <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700">{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {localRules.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Local Rules</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {localRules.map((rule: string, idx: number) => (
                          <li key={idx} className="flex gap-3">
                            <span className="text-primary">•</span>
                            <span className="text-gray-700">{rule}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Quick Info Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Type</p>
                    <p className="font-semibold text-gray-900">
                      {getAttractionTypeLabel(guide.attractionType)}
                    </p>
                  </div>

                  {guide.difficulty && (
                    <div>
                      <p className="text-sm text-gray-600">Difficulty</p>
                      <p className={`font-semibold px-3 py-1 rounded-full w-fit text-sm ${getDifficultyColor(guide.difficulty)}`}>
                        {guide.difficulty.charAt(0).toUpperCase() + guide.difficulty.slice(1)}
                      </p>
                    </div>
                  )}

                  {guide.bestSeason && (
                    <div>
                      <p className="text-sm text-gray-600">Best Season</p>
                      <p className="font-semibold text-gray-900">{guide.bestSeason}</p>
                    </div>
                  )}

                  {guide.typicalCost && (
                    <div>
                      <p className="text-sm text-gray-600">Typical Cost</p>
                      <p className="font-semibold text-gray-900">{guide.typicalCost}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Nearby Islands */}
              <NearbyIslandsSection attractionGuideId={guide.id} />

              {/* CTA Button */}
              <Button className="w-full" size="lg">
                Book Now
              </Button>

              {/* Back Button */}
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setLocation("/explore-maldives")}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Explore
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
