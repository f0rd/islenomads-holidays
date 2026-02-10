import { useState, useEffect } from 'react';
import { useRoute } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Map, MapPin, Compass, Utensils, Backpack, AlertCircle, HelpCircle, Calendar, ArrowLeft } from 'lucide-react';
import { Link } from 'wouter';
import { trpc } from '@/lib/trpc';
import Navigation from '@/components/Navigation';

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
  }, [slug, guides, packages]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!island) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
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
  const faqItems = parseListContent(island.faqContent);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Navigation />
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
        <div className="absolute bottom-0 left-0 right-0 text-white p-8">
          <div className="container">
            <h1 className="text-4xl font-bold mb-2">{island.name}</h1>
            <p className="text-lg text-gray-200">{island.description}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="activities">Activities</TabsTrigger>
                <TabsTrigger value="practical">Practical</TabsTrigger>
                <TabsTrigger value="faq">FAQ</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-gray-700 leading-relaxed">{island.overview || island.description}</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="activities" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Compass className="w-5 h-5" />
                      Activities & Experiences
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {activities.length > 0 ? (
                      <ul className="space-y-2">
                        {activities.map((activity, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <span className="text-accent font-bold">•</span>
                            <span>{activity}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500">No activities listed</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="practical" className="mt-6">
                <div className="space-y-6">
                  {island.howToReach && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <MapPin className="w-5 h-5" />
                          How to Reach
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700">{island.howToReach}</p>
                      </CardContent>
                    </Card>
                  )}

                  {island.bestSeason && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Calendar className="w-5 h-5" />
                          Best Time to Visit
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700">{island.bestSeason}</p>
                      </CardContent>
                    </Card>
                  )}

                  {dining.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Utensils className="w-5 h-5" />
                          Dining Options
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {dining.map((option, idx) => (
                            <li key={idx} className="flex items-start gap-3">
                              <span className="text-accent font-bold">•</span>
                              <span>{option}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}

                  {packingItems.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Backpack className="w-5 h-5" />
                          Packing Tips
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {packingItems.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-3">
                              <span className="text-accent font-bold">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}

                  {island.healthSafety && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <AlertCircle className="w-5 h-5" />
                          Health & Safety
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700">{island.healthSafety}</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="faq" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <HelpCircle className="w-5 h-5" />
                      Frequently Asked Questions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {faqItems.length > 0 ? (
                      <ul className="space-y-2">
                        {faqItems.map((faq, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <span className="text-accent font-bold">Q:</span>
                            <span>{faq}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500">No FAQs available</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Map Card */}
            {island.latitude && island.longitude && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Map className="w-5 h-5" />
                    Location
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Coordinates: {typeof island.latitude === 'string' ? parseFloat(island.latitude).toFixed(2) : island.latitude?.toFixed(2)}, {typeof island.longitude === 'string' ? parseFloat(island.longitude).toFixed(2) : island.longitude?.toFixed(2) || 'N/A'}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Related Packages */}
            {relatedPackages.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Related Packages</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {relatedPackages.map((pkg: any) => (
                      <div key={pkg.id} className="border-b pb-4 last:border-b-0">
                        <h4 className="font-semibold text-sm mb-1">{pkg.name}</h4>
                        <p className="text-xs text-gray-600 mb-2">{pkg.destination}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-accent font-bold">${pkg.price}</span>
                          <Link href={`/packages/${pkg.id}`}>
                            <Button size="sm" variant="outline">View</Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
