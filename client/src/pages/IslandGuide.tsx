import { useState, useMemo } from "react";
import { useParams, useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AirportInfo from "@/components/AirportInfo";
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
import { getAdjacentIslands, getIslandGuideUrl, FEATURED_ISLANDS } from "@shared/locations";
import { NearbyAttractionsSection } from "@/components/NearbyAttractionsSection";
import TransportComparison from "@/components/TransportComparison";

/**
 * UPDATED: IslandGuide component now uses slug-based URLs for SEO
 * 
 * Route: /island/:slug (e.g., /island/dhigurah, /island/malé)
 * Navigation: Uses slug-based URLs for better SEO and user-friendly URLs
 * 
 * Key Changes:
 * - Fetches guide by slug using trpc.islandGuides.getByPlaceSlug
 * - Navigation uses getAdjacentIslands() helper for previous/next
 * - All links use getIslandGuideUrl(slug) to build slug-based URLs
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
  const { slug = "" } = useParams();
  const [, navigate] = useLocation();
  
  // Fetch guide by slug (using the new getByPlaceSlug procedure)
  const { data: rawGuide, isLoading, error } = trpc.islandGuides.getByPlaceSlug.useQuery(
    { slug },
    { enabled: !!slug }
  );
  
  const guide = useMemo(() => normalizeGuideData(rawGuide), [rawGuide]);
  const [activeTab, setActiveTab] = useState("overview");
  
  // Get adjacent islands for navigation (previous/next)
  // Uses slug-based navigation by finding the current guide in ALL_ISLANDS
  const adjacentIslands = useMemo(() => {
    if (!guide?.slug) return { previous: null, next: null };
    const currentIndex = FEATURED_ISLANDS.findIndex(i => i.slug === guide.slug);
    if (currentIndex === -1) return { previous: null, next: null };
    
    return {
      previous: currentIndex > 0 ? FEATURED_ISLANDS[currentIndex - 1] : null,
      next: currentIndex < FEATURED_ISLANDS.length - 1 ? FEATURED_ISLANDS[currentIndex + 1] : null,
    };
  }, [guide?.slug]);

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
              {!slug && <br />}
              {!slug && `(Invalid island slug: ${slug})`}
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
              onClick={() => navigate(getIslandGuideUrl(adjacentIslands.previous!.slug))}
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
              onClick={() => navigate(getIslandGuideUrl(adjacentIslands.next!.slug))}
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
              
              {/* Nearby Attractions */}
              <NearbyAttractionsSection 
                islandGuideId={guide.id} 
                islandName={guide.name}
              />
            </TabsContent>

            {/* Getting There Tab */}
            <TabsContent value="getting-there" className="space-y-6 mt-6">
              <div className="space-y-4">
                {/* Airport Information - Primary source for transportation */}
                {guide.nearbyAirports && guide.nearbyAirports.length > 0 ? (
                  <AirportInfo islandGuideId={guide.id} islandName={guide.name} nearbyAirports={guide.nearbyAirports} />
                ) : (
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
                
                <TransportComparison
                  fromLocation="Male"
                  toLocation={guide.name}
                  options={[
                    {
                      id: 1,
                      name: "Public Ferry (MTCC)",
                      type: "ferry",
                      operator: "MTCC",
                      vesselType: "Wooden Dhoni Ferry",
                      duration: "45-120 minutes",
                      price: 150,
                      capacity: 50,
                      description: "Government-operated public ferry. Most affordable option with authentic local experience.",
                      amenities: ["Basic seating", "Toilets", "Shelter area"],
                      schedule: "Daily except Friday (varies by route)"
                    },
                    {
                      id: 2,
                      name: "Speedboat",
                      type: "speedboat",
                      operator: "Private Operator",
                      vesselType: "Modern Speedboat",
                      duration: "35-60 minutes",
                      price: 2000,
                      capacity: 20,
                      description: "Faster private speedboat service with modern amenities and comfortable seating.",
                      amenities: ["Air conditioning", "Comfortable seating", "Life jackets"],
                      schedule: "Daily departures"
                    }
                  ]}
                />
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
                onClick={() => navigate(getIslandGuideUrl(adjacentIslands.previous!.slug))}
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
                onClick={() => navigate(getIslandGuideUrl(adjacentIslands.next!.slug))}
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
