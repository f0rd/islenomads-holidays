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
} from "lucide-react";
import { trpc } from "@/lib/trpc";

const ISLAND_NAVIGATION = [
  { slug: "male-guide", name: "Male City" },
  { slug: "maafushi-island", name: "Maafushi Island" },
  { slug: "thoddoo-island", name: "Thoddoo Island" },
  { slug: "guraidhoo-island", name: "Guraidhoo Island" },
  { slug: "thulusdhoo-island", name: "Thulusdhoo Island" },
  { slug: "kandooma-island", name: "Kandooma Island" },
  { slug: "fuvamulah-island", name: "Fuvamulah Island" },
];

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
  const { islandId = "male-guide" } = useParams();
  const [, navigate] = useLocation();
  const { data: rawGuide, isLoading, error } = trpc.islandGuides.getBySlug.useQuery({ slug: islandId });
  const guide = useMemo(() => normalizeGuideData(rawGuide), [rawGuide]);
  const [activeTab, setActiveTab] = useState("overview");
  
  const currentIndex = useMemo(() => ISLAND_NAVIGATION.findIndex(i => i.slug === islandId), [islandId]);
  const previousIsland = currentIndex > 0 ? ISLAND_NAVIGATION[currentIndex - 1] : null;
  const nextIsland = currentIndex < ISLAND_NAVIGATION.length - 1 ? ISLAND_NAVIGATION[currentIndex + 1] : null;




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

  if (error || !guide) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Island Guide Not Found</h2>
            <p className="text-muted-foreground mb-4">
              The island guide you're looking for doesn't exist.
            </p>
            <Button variant="outline" onClick={() => window.location.href = '/map'}>Back to Maps</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Image mapping for hero section */}
      {(() => {
        const islandImages = {
          'male': 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/NrfGKIQyisEeoTSa.jpg',
          'maafushi': 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/YYwGlTIcJzLqPXCh.jpg',
          'thoddoo': 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/IFenyYaGxXpkGxds.jpg',
          'guraidhoo': 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/kRpeRnzSKegeoLeX.jpeg',
          'thulusdhoo': 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/kPliERCwFhvovAop.jpeg',
          'kandooma': 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/mCclTHjbSjkDwcsD.jpeg',
          'fuvamulah': 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/RvnbcKAjOnOSwABP.jpg',
        };
        const islandKey = (guide.slug?.split('-')[0] || 'maafushi') as keyof typeof islandImages;
        const heroImage = islandImages[islandKey] || islandImages['maafushi'];
        
        return (
          <>
            {/* Hero Section with Background Image */}
            <section className="relative h-96 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground overflow-hidden">
              <img src={heroImage} alt={guide.name} className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-primary/85 via-primary/70 to-primary/85" />
              <div className="container relative z-10 h-full flex flex-col justify-end pb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">{guide.name}</h1>
              <p className="text-primary-foreground/80">{guide.atoll} Atoll</p>
            </div>
            <Button variant="outline" className="text-primary-foreground border-primary-foreground hover:bg-primary-foreground/10">
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
                  {guide.latitude && guide.longitude ? `${parseFloat(guide.latitude).toFixed(4)}, ${parseFloat(guide.longitude).toFixed(4)}` : 'N/A'}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
            </section>
          </>
        );
      })()}

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
            </TabsContent>

            {/* Quick Facts Tab */}
            <TabsContent value="quick-facts" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Facts</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {Array.isArray(guide.quickFacts) && guide.quickFacts.map((fact: any, idx: number) => (
                      <li key={idx} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{fact}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Getting There Tab */}
            <TabsContent value="getting-there" className="space-y-6 mt-6">
              {/* Nearby Airports */}
              {Array.isArray(guide.nearbyAirports) && guide.nearbyAirports.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Plane className="w-5 h-5" />
                    Nearby Airports
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    {guide.nearbyAirports.map((airport: any, idx: number) => (
                      <Card key={idx}>
                        <CardHeader>
                          <CardTitle className="text-base">{airport.name}</CardTitle>
                          <p className="text-xs text-muted-foreground mt-1">IATA: {airport.iata}</p>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-3">{airport.distance}</p>
                          <Button size="sm" variant="outline">View Details</Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Transportation Methods */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Transportation Methods</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Plane className="w-5 h-5" />
                        Speedboat
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {guide.speedboatInfo || 'Speedboat transfers available from Male Airport'}
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Waves className="w-5 h-5" />
                        Ferry
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {guide.ferryInfo || 'Public ferry services available'}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Activities Tab */}
            <TabsContent value="activities" className="space-y-6 mt-6">
              {/* Top Things to Do */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Top Things to Do</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {Array.isArray(guide.topThingsToDo) && guide.topThingsToDo.map((activity: any, idx: number) => (
                    <Card key={idx}>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <span className="text-2xl">{activity.icon}</span>
                          {activity.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          {activity.description}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Nearby Dive Sites */}
              {Array.isArray(guide.nearbyDiveSites) && guide.nearbyDiveSites.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4 mt-8">🤿 Nearby Dive Sites</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {guide.nearbyDiveSites.map((dive: any, idx: number) => (
                      <Card key={idx}>
                        <CardHeader>
                          <CardTitle className="text-base">{dive.name}</CardTitle>
                          <p className="text-xs text-muted-foreground mt-1">Difficulty: {dive.difficulty}</p>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-3">{dive.distance}</p>
                          <Button size="sm" variant="outline">Explore</Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Nearby Surf Spots */}
              {Array.isArray(guide.nearbySurfSpots) && guide.nearbySurfSpots.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4 mt-8">🏄 Nearby Surf Spots</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {guide.nearbySurfSpots.map((surf: any, idx: number) => (
                      <Card key={idx}>
                        <CardHeader>
                          <CardTitle className="text-base">{surf.name}</CardTitle>
                          <p className="text-xs text-muted-foreground mt-1">Difficulty: {surf.difficulty}</p>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-3">{surf.distance}</p>
                          <Button size="sm" variant="outline">Explore</Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            {/* Food Tab */}
            <TabsContent value="food" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Utensils className="w-5 h-5" />
                    Dining Options
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Array.isArray(guide.foodCafes) && guide.foodCafes.map((cafe: any, idx: number) => (
                      <div key={idx} className="border-b pb-4 last:border-b-0">
                        <h4 className="font-semibold text-sm mb-1">{cafe.name}</h4>
                        <p className="text-xs text-muted-foreground mb-2">{cafe.cuisine} • {cafe.priceRange}</p>
                        <p className="text-sm">{cafe.type}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Practical Tab */}
            <TabsContent value="practical" className="space-y-6 mt-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">What to Pack</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {Array.isArray(guide.whatToPack) && guide.whatToPack.map((item: any, idx: number) => (
                        <li key={idx} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-accent" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Health Tips</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {Array.isArray(guide.healthTips) && guide.healthTips.map((tip: any, idx: number) => (
                        <li key={idx} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-accent" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    Emergency Contacts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {Array.isArray(guide.emergencyContacts) && guide.emergencyContacts.map((contact: any, idx: number) => {
                      const displayText = typeof contact === 'string' ? contact : (contact?.name ? `${contact.name}${contact.phone ? ` - ${contact.phone}` : ''}` : 'Contact information');
                      return <li key={idx} className="text-sm">{displayText}</li>;
                    })}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Itineraries Tab */}
            <TabsContent value="itineraries" className="space-y-6 mt-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">3-Day Itinerary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {Array.isArray(guide.threeDayItinerary) && guide.threeDayItinerary.map((day: any, idx: number) => (
                      <div key={idx} className="border-l-2 border-accent pl-4">
                        <h4 className="font-semibold text-sm mb-2">Day {day.day}</h4>
                        <ul className="space-y-1">
                          {Array.isArray(day.activities) && day.activities.map((activity: any, aidx: number) => (
                            <li key={aidx} className="text-xs text-muted-foreground">• {activity}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">5-Day Itinerary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {Array.isArray(guide.fiveDayItinerary) && guide.fiveDayItinerary.map((day: any, idx: number) => (
                      <div key={idx} className="border-l-2 border-accent pl-4">
                        <h4 className="font-semibold text-sm mb-2">Day {day.day}</h4>
                        <ul className="space-y-1">
                          {Array.isArray(day.activities) && day.activities.map((activity: any, aidx: number) => (
                            <li key={aidx} className="text-xs text-muted-foreground">• {activity}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* FAQ Tab */}
            <TabsContent value="faq" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HelpCircle className="w-5 h-5" />
                    Frequently Asked Questions
                  </CardTitle>
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

          {/* Navigation Buttons */}
          <div className="mt-12 flex justify-between items-center gap-4">
            {previousIsland ? (
              <Button
                variant="outline"
                className="flex items-center gap-2 hover:bg-primary/10"
                onClick={() => navigate(`/island/${previousIsland.slug}`)}
              >
                <ChevronLeft className="w-4 h-4" />
                {previousIsland.name}
              </Button>
            ) : (
              <div />
            )}
            <Button
              variant="outline"
              onClick={() => navigate('/explore-maldives')}
              className="hover:bg-accent/10"
            >
              Explore Maldives
            </Button>
            {nextIsland ? (
              <Button
                variant="outline"
                className="flex items-center gap-2 hover:bg-primary/10"
                onClick={() => navigate(`/island/${nextIsland.slug}`)}
              >
                {nextIsland.name}
                <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <div />
            )}
          </div>

          {/* CTA Section */}
          <div className="mt-12 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Explore {guide.name}?</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Let our travel specialists help you plan the perfect getaway to this beautiful island.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                <BookOpen className="w-4 h-4 mr-2" />
                Plan Your Trip
              </Button>
              <Button size="lg" variant="outline">
                Get Custom Pricing
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
