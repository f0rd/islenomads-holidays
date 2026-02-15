import { useState, useMemo } from "react";
import { useParams, useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MapPin,
  Plane,
  Waves,
  Utensils,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  Users,
  HelpCircle,
  Share2,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Ship,
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { getIslandGuideUrl, FEATURED_ISLANDS } from "@shared/locations";

/**
 * UPDATED: IslandGuide component now uses island ID instead of slug
 * 
 * Route: /island/:islandId (e.g., /island/1, /island/5)
 * Navigation: Uses FEATURED_ISLANDS array with island IDs
 * 
 * Key Changes:
 * - Fetches guide by island ID using trpc.islandGuides.getByIslandId
 * - Navigation uses getAdjacentIslands() helper for previous/next
 * - All links use getIslandGuideUrl() to build URLs with IDs
 */

function normalizeGuideData(guide: any) {
  if (!guide) return null;
  
  const parseJSON = (value: any, defaultValue: any = []) => {
    if (!value) return defaultValue;
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch {
        return defaultValue;
      }
    }
    return value;
  };
  
  return {
    ...guide,
    quickFacts: parseJSON(guide.quickFacts, []),
    topThingsToDo: parseJSON(guide.topThingsToDo, []),
    beachesLocalRules: parseJSON(guide.beachesLocalRules, {}),
    foodCafes: parseJSON(guide.foodCafes, []),
    whatToPack: parseJSON(guide.whatToPack, []),
    healthTips: parseJSON(guide.healthTips, []),
    emergencyContacts: parseJSON(guide.emergencyContacts, []),
    threeDayItinerary: parseJSON(guide.threeDayItinerary, []),
    fiveDayItinerary: parseJSON(guide.fiveDayItinerary, []),
    faq: parseJSON(guide.faq, []),
    images: parseJSON(guide.images, []),
    nearbyAirports: parseJSON(guide.nearbyAirports, []),
    nearbyDiveSites: parseJSON(guide.nearbyDiveSites, []),
    nearbySurfSpots: parseJSON(guide.nearbySurfSpots, []),
  };
}

export default function IslandGuide() {
  // Get island ID from URL params (e.g., /island/1)
  const { islandId = "1" } = useParams();
  const [, navigate] = useLocation();
  
  // Convert string ID to number
  const numericIslandId = parseInt(islandId, 10);
  
  // Fetch guide by island ID (using the new getByIslandId procedure)
  const { data: rawGuide, isLoading, error } = trpc.islandGuides.getByIslandId.useQuery(
    { islandId: numericIslandId },
    { enabled: !isNaN(numericIslandId) }
  );
  
  const guide = useMemo(() => normalizeGuideData(rawGuide), [rawGuide]);
  const [activeTab, setActiveTab] = useState("overview");
  
  // Get adjacent islands for navigation (previous/next) from database
  const { data: adjacentIslandsData } = trpc.islandGuides.getAdjacentIslands.useQuery(
    { islandId: numericIslandId },
    { enabled: !isNaN(numericIslandId) }
  );
  
  const adjacentIslands = adjacentIslandsData || { previous: null, next: null };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading island guide...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !guide || rawGuide === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Island Guide Not Found</h2>
            <p className="text-muted-foreground mb-4">
              The island guide you're looking for doesn't exist or could not be loaded.
              {isNaN(numericIslandId) && <br />}
              {isNaN(numericIslandId) && `(Invalid island ID: ${islandId})`}
            </p>
            <Button variant="outline" onClick={() => navigate('/explore-maldives')}>
              Back to Explore
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Bar with Previous/Next Island Links */}
      <div className="bg-background border-b">
        <div className="container py-4 flex items-center justify-between">
          {adjacentIslands.previous ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(getIslandGuideUrl(adjacentIslands.previous!.id))}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              {adjacentIslands.previous.name}
            </Button>
          ) : (
            <div />
          )}
          
          <h2 className="text-lg font-semibold">{guide.name}</h2>
          
          {adjacentIslands.next ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(getIslandGuideUrl(adjacentIslands.next!.id))}
              className="flex items-center gap-2"
            >
              {adjacentIslands.next.name}
              <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <div />
          )}
        </div>
      </div>

      {/* Hero Section with Background Image */}
      <section className="relative h-96 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground overflow-hidden">
        {guide.heroImage && (
          <img 
            src={guide.heroImage} 
            alt={guide.name} 
            className="absolute inset-0 w-full h-full object-cover" 
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/85 via-primary/70 to-primary/85" />
        <div className="container relative z-10 h-full flex flex-col justify-end pb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">{guide.name}</h1>
              <p className="text-primary-foreground/80">{guide.atoll}</p>
            </div>
            <Button 
              variant="outline" 
              className="text-primary-foreground border-primary-foreground hover:bg-primary-foreground/10"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>

          {/* Quick Info Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <Card className="bg-primary-foreground/10 border-primary-foreground/20">
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground mb-1">Best Time</p>
                <p className="text-sm font-semibold">{guide.bestTimeToVisit || 'N/A'}</p>
              </CardContent>
            </Card>
            <Card className="bg-accent/10 border-accent/20">
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground mb-1">Currency</p>
                <p className="text-sm font-semibold">{guide.currency || 'MVR'}</p>
              </CardContent>
            </Card>
            <Card className="bg-accent/10 border-accent/20">
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground mb-1">Language</p>
                <p className="text-sm font-semibold">{guide.language || 'Dhivehi'}</p>
              </CardContent>
            </Card>
            <Card className="bg-accent/10 border-accent/20">
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground mb-1">Coordinates</p>
                <p className="text-sm font-mono">
                  {guide.latitude && guide.longitude 
                    ? `${parseFloat(guide.latitude).toFixed(4)}, ${parseFloat(guide.longitude).toFixed(4)}` 
                    : 'N/A'}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-1">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="getting-there">Getting There</TabsTrigger>
              <TabsTrigger value="activities">Activities</TabsTrigger>
              <TabsTrigger value="food">Food</TabsTrigger>
              <TabsTrigger value="practical">Practical</TabsTrigger>
              <TabsTrigger value="itineraries">Itineraries</TabsTrigger>
              <TabsTrigger value="faq">FAQ</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>About {guide.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    {guide.overview}
                  </p>
                </CardContent>
              </Card>

              {/* Nearby Dive Sites */}
              {guide.nearbyDiveSites && guide.nearbyDiveSites.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Nearby Dive Sites</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {guide.nearbyDiveSites.map((site: any, idx: number) => (
                        <div key={idx} className="border-l-4 border-accent pl-4 py-2">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold text-sm">{site.name}</h4>
                            <span className="text-xs px-2 py-1 bg-accent/20 text-accent rounded capitalize">
                              {site.difficulty || 'Intermediate'}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mb-1">{site.distance}</p>
                          <p className="text-sm text-muted-foreground">{site.description}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Nearby Surf Spots */}
              {guide.nearbySurfSpots && guide.nearbySurfSpots.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Nearby Surf Spots</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {guide.nearbySurfSpots.map((spot: any, idx: number) => (
                        <div key={idx} className="border-l-4 border-accent pl-4 py-2">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold text-sm">{spot.name}</h4>
                            <span className="text-xs px-2 py-1 bg-accent/20 text-accent rounded capitalize">
                              {spot.difficulty || 'Intermediate'}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mb-1">{spot.distance}</p>
                          <p className="text-sm text-muted-foreground">{spot.description}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Getting There Tab */}
            <TabsContent value="getting-there" className="space-y-6 mt-6">
              <div className="space-y-4">
                {/* Flight Info */}
                {guide.flightInfo && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Plane className="w-5 h-5" />
                        Flight Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">{guide.flightInfo}</p>
                    </CardContent>
                  </Card>
                )}

                {/* Speedboat Info */}
                {guide.speedboatInfo && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Waves className="w-5 h-5" />
                        Speedboat
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">{guide.speedboatInfo}</p>
                    </CardContent>
                  </Card>
                )}

                {/* Ferry Info */}
                {guide.ferryInfo && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Ship className="w-5 h-5" />
                        Ferry
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">{guide.ferryInfo}</p>
                    </CardContent>
                  </Card>
                )}

                {!guide.flightInfo && !guide.speedboatInfo && !guide.ferryInfo && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="w-5 h-5" />
                        Getting There
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">Transportation information coming soon.</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            {/* Activities Tab */}
            <TabsContent value="activities" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Top Things to Do</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {Array.isArray(guide.topThingsToDo) && guide.topThingsToDo.map((activity: any, idx: number) => (
                      <div key={idx} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">{activity.emoji || '🎯'}</span>
                          <div className="flex-1">
                            <h4 className="font-semibold text-sm mb-1">{activity.title}</h4>
                            <p className="text-sm text-muted-foreground">{activity.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Food Tab */}
            <TabsContent value="food" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Food & Cafés</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {Array.isArray(guide.foodCafes) && guide.foodCafes.map((item: any, idx: number) => (
                      <div key={idx} className="p-4 border rounded-lg">
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">{item.emoji || '🍽️'}</span>
                          <div className="flex-1">
                            <h4 className="font-semibold text-sm mb-1">{item.name}</h4>
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Practical Tab */}
            <TabsContent value="practical" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Practical Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Getting There</h4>
                    <p className="text-sm text-muted-foreground">{guide.gettingThere || 'Information not available'}</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Itineraries Tab */}
            <TabsContent value="itineraries" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>3-Day Itinerary</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm whitespace-pre-wrap">{guide.threeDayItinerary || 'Itinerary not available'}</p>
                </CardContent>
              </Card>
            </TabsContent>

            {/* FAQ Tab */}
            <TabsContent value="faq" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Frequently Asked Questions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Array.isArray(guide.faq) && guide.faq.map((item: any, idx: number) => (
                    <div key={idx} className="border-b pb-4 last:border-b-0">
                      <h4 className="font-semibold text-sm mb-2">{item.question}</h4>
                      <p className="text-sm text-muted-foreground">{item.answer}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Footer Navigation */}
      <section className="border-t py-8 bg-muted/50">
        <div className="container">
          <div className="flex items-center justify-between">
            {adjacentIslands.previous ? (
              <Button
                variant="outline"
                onClick={() => navigate(getIslandGuideUrl(adjacentIslands.previous!.id))}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous: {adjacentIslands.previous.name}
              </Button>
            ) : (
              <div />
            )}
            
            <Button
              variant="outline"
              onClick={() => navigate('/explore-maldives')}
            >
              View All Islands
            </Button>
            
            {adjacentIslands.next ? (
              <Button
                variant="outline"
                onClick={() => navigate(getIslandGuideUrl(adjacentIslands.next!.id))}
                className="flex items-center gap-2"
              >
                Next: {adjacentIslands.next.name}
                <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <div />
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
