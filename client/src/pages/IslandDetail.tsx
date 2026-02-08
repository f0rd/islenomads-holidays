import { useEffect, useState } from 'react';
import { useRoute } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Map, MapPin, Compass, Utensils, Backpack, AlertCircle, HelpCircle, Calendar, ArrowLeft } from 'lucide-react';
import { Link } from 'wouter';
import { trpc } from '@/lib/trpc';

interface IslandGuide {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  overview: string | null;
  image: string | null;
  latitude: number;
  longitude: number;
  activities: string | null;
  dining: string | null;
  packingTips: string | null;
  healthSafety: string | null;
  faqContent: string | null;
  itinerary: string | null;
  bestSeason: string | null;
  howToReach: string | null;
  published: number;
  createdAt: Date;
  updatedAt: Date;
}

export default function IslandDetail() {
  const [, params] = useRoute('/island/:slug');
  const slug = params?.slug as string;
  
  const [island, setIsland] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showBooking, setShowBooking] = useState(false);
  const [relatedPackages, setRelatedPackages] = useState<any[]>([]);

  // Fetch island guide
  const { data: guides = [] } = trpc.islandGuides.list.useQuery();
  const { data: packages = [] } = trpc.packages.list.useQuery();

  useEffect(() => {
    if (guides.length > 0 && slug) {
      const foundIsland = guides.find((g: any) => g.slug === slug);
      setIsland(foundIsland || null);
      setIsLoading(false);

      // Find related packages for this island
      if (foundIsland) {
        const related = packages.filter((pkg: any) => 
          pkg.destination?.toLowerCase().includes(foundIsland.name.toLowerCase())
        );
        setRelatedPackages(related);
      }
    }
  }, [guides, packages, slug]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!island) {
    return (
      <div className="container py-12">
        <Link href="/">
          <Button variant="outline" className="gap-2 mb-6">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
        </Link>
        <Card>
          <CardContent className="py-12">
            <p className="text-center text-gray-500">Island guide not found.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const parseListContent = (content: string | null): string[] => {
    if (!content) return [];
    return content.split(',').map(item => item.trim()).filter(Boolean);
  };

  const activities = parseListContent(island.activities);
  const dining = parseListContent(island.dining);
  const packingItems = parseListContent(island.packingTips);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="relative h-96 overflow-hidden">
        {island.image && (
          <img
            src={island.image}
            alt={island.name}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        
        <div className="absolute inset-0 flex flex-col justify-between p-6">
          <Link href="/">
            <Button variant="outline" className="gap-2 w-fit bg-white/90 hover:bg-white">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </Link>
          
          <div className="text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">{island.name}</h1>
            <p className="text-lg text-white/90">{island.description}</p>
          </div>
        </div>
      </div>

      <div className="container py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-8">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="activities">Activities</TabsTrigger>
                <TabsTrigger value="practical">Practical</TabsTrigger>
                <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>About {island.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-700 leading-relaxed">{island.overview}</p>
                    
                    <div className="grid md:grid-cols-2 gap-4 mt-6">
                      <div className="flex gap-3 p-4 bg-blue-50 rounded-lg">
                        <Calendar className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                        <div>
                          <p className="font-semibold text-sm text-blue-900">Best Season</p>
                          <p className="text-sm text-blue-800">{island.bestSeason}</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-3 p-4 bg-green-50 rounded-lg">
                        <MapPin className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                        <div>
                          <p className="font-semibold text-sm text-green-900">Location</p>
                          <p className="text-sm text-green-800">{island.latitude.toFixed(3)}°, {island.longitude.toFixed(3)}°</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Activities Tab */}
              <TabsContent value="activities" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex gap-2">
                      <Compass className="w-5 h-5" />
                      Activities & Attractions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-3">
                      {activities.map((activity, idx) => (
                        <div key={idx} className="flex gap-2 p-3 bg-slate-50 rounded-lg">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-sm">{activity}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex gap-2">
                      <Utensils className="w-5 h-5" />
                      Dining Options
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-3">
                      {dining.map((option, idx) => (
                        <div key={idx} className="flex gap-2 p-3 bg-amber-50 rounded-lg">
                          <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-sm">{option}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Practical Tab */}
              <TabsContent value="practical" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex gap-2">
                      <Backpack className="w-5 h-5" />
                      Packing Tips
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-3">
                      {packingItems.map((item, idx) => (
                        <div key={idx} className="flex gap-2 p-3 bg-purple-50 rounded-lg">
                          <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-sm">{item}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex gap-2">
                      <AlertCircle className="w-5 h-5" />
                      Health & Safety
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-700 leading-relaxed">{island.healthSafety}</p>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Itinerary Tab */}
              <TabsContent value="itinerary" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>3-Day Itinerary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {island.itinerary?.split('Day ').map((day: string, idx: number) => {
                        if (!day.trim()) return null;
                        const [dayNum, ...content] = day.split(':');
                        return (
                          <div key={idx} className="flex gap-4">
                            <div className="flex-shrink-0">
                              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary text-white font-semibold">
                                {idx + 1}
                              </div>
                            </div>
                            <div className="flex-1 pt-1">
                              <p className="text-sm text-gray-700">{content.join(':').trim()}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* FAQ Section */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="flex gap-2">
                  <HelpCircle className="w-5 h-5" />
                  Frequently Asked Questions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                      {island.faq?.split('Q:').map((qa: string, idx: number) => {
                    if (!qa.trim()) return null;
                    const [question, answer] = qa.split('A:');
                    return (
                      <div key={idx} className="border-b pb-4 last:border-b-0">
                        <p className="font-semibold text-sm mb-2">Q: {question.trim()}</p>
                        <p className="text-sm text-gray-600">A: {answer?.trim()}</p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Map Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex gap-2">
                  <Map className="w-5 h-5" />
                  Location
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-slate-100 rounded-lg h-64 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      {island.latitude.toFixed(3)}°N, {island.longitude.toFixed(3)}°E
                    </p>
                    <p className="text-xs text-gray-500 mt-2">Interactive map coming soon</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* How to Reach */}
            <Card>
              <CardHeader>
                <CardTitle>How to Reach</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 leading-relaxed">{island.howToReach}</p>
              </CardContent>
            </Card>

            {/* Related Packages */}
            {relatedPackages.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Related Packages</CardTitle>
                  <CardDescription>Vacation packages for {island.name}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {relatedPackages.slice(0, 3).map((pkg: any) => (
                    <div key={pkg.id} className="p-3 border rounded-lg hover:bg-slate-50 transition-colors">
                      <p className="font-semibold text-sm">{pkg.name}</p>
                      <p className="text-xs text-gray-600 mt-1">{pkg.duration}</p>
                      <p className="text-sm font-bold text-primary mt-2">${pkg.price}</p>
                    </div>
                  ))}
                  <Link href="/packages">
                    <Button variant="outline" className="w-full">
                      View All Packages
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}

            {/* Booking Card */}
            <Card className="border-primary/50 bg-primary/5">
              <CardHeader>
                <CardTitle>Interested in Visiting?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-700">
                  Browse our vacation packages and book your trip to {island.name} today.
                </p>
                <Link href="/packages">
                  <Button className="w-full">
                    Browse Packages
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline" className="w-full">
                    Contact Us
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
