import { useRoute } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Map, MapPin, Compass, Utensils, Backpack, AlertCircle, HelpCircle, Calendar, ArrowLeft, Waves, Zap, Plane, Ship } from 'lucide-react';
import { Link } from 'wouter';
import { trpc } from '@/lib/trpc';
import Navigation from '@/components/Navigation';
import WaterActivitiesSection from '@/components/WaterActivitiesSection';
import AirportInfo from '@/components/AirportInfo';
import BoatRoutesInfo from '@/components/BoatRoutesInfo';
import ExcursionsInfo from '@/components/ExcursionsInfo';
import { useState, useEffect } from 'react';

export default function IslandDetail() {
  const [, params] = useRoute('/island/:id');
  const id = params?.id ? parseInt(params.id as string, 10) : null;
  
  const [island, setIsland] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [linkedActivitySpots, setLinkedActivitySpots] = useState<any[]>([]);
  const [nearbyActivitySpots, setNearbyActivitySpots] = useState<any[]>([]);
  const [experiences, setExperiences] = useState<any[]>([]);

  // Fetch island guide
  const { data: guides = [], isLoading: guidesLoading, error: guidesError } = trpc.islandGuides.list.useQuery();
  
  // Debug logging
  useEffect(() => {
    (window as any).debugIslandDetail = { guides, guidesLoading, guidesError, id };
    console.log('[IslandDetail Debug]', { guides, guidesLoading, guidesError, id });
  }, [guides, guidesLoading, guidesError, id]);
  const { data: packages = [] } = trpc.packages.list.useQuery();
  const { data: activitySpots = [] } = trpc.activitySpots.list.useQuery();
  
  // Fetch nearby activity spots when island coordinates are available
  const { data: nearbySpots = [] } = trpc.activitySpots.getNearby.useQuery(
    { latitude: island?.latitude || 0, longitude: island?.longitude || 0, radiusKm: 10 },
    { enabled: !!island?.latitude && !!island?.longitude }
  );

  // Fetch experiences for this island
  const { data: islandExperiences = [] } = trpc.islandGuides.getExperiences.useQuery(
    { islandId: island?.id || 0 },
    { enabled: !!island?.id }
  );

  useEffect(() => {
    console.log('IslandDetail - Checking data:', { id, guidesLoading, guidesLength: guides.length, guidesError });
    
    // Only proceed if we have an ID and guides have finished loading
    if (!id) {
      console.log('No ID provided');
      setIsLoading(false);
      return;
    }

    if (guidesLoading) {
      console.log('Still loading guides...');
      return;
    }

    // Guides have loaded
    console.log('Guides loaded. Looking for island with id:', id);
    console.log('Available guides:', guides.map((g: any) => ({ id: g.id, name: g.name })));
    
    if (guides.length > 0) {
      const foundIsland = guides.find((g: any) => g.id === id);
      console.log('Found island:', foundIsland);
      
      if (foundIsland) {
        setIsland(foundIsland);
        
        // Filter activity spots linked to this island
        const linked = activitySpots.filter((spot: any) => spot.islandGuideId === foundIsland.id);
        setLinkedActivitySpots(linked);
      } else {
        console.log('Island not found with id:', id);
        setIsland(null);
      }
    } else {
      console.log('No guides available');
      setIsland(null);
    }
    
    setIsLoading(false);
  }, [id, guides, guidesLoading, guidesError, activitySpots]);

  // Update nearby spots when fetched
  useEffect(() => {
    if (nearbySpots && nearbySpots.length > 0) {
      setNearbyActivitySpots(nearbySpots);
    }
  }, [nearbySpots]);

  // Update experiences when fetched
  useEffect(() => {
    if (islandExperiences && islandExperiences.length > 0) {
      setExperiences(islandExperiences);
    }
  }, [islandExperiences]);

  // Helper function to parse JSON strings
  const parseJSON = (data: any): any => {
    if (!data) return null;
    if (typeof data === 'string') {
      try {
        return JSON.parse(data);
      } catch {
        return data;
      }
    }
    return data;
  };

  if (isLoading || guidesLoading) {
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
          <Link href="/explore-maldives">
            <Button variant="outline" className="gap-2 mb-6">
              <ArrowLeft className="w-4 h-4" />
              Back to Explore
            </Button>
          </Link>
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-center text-gray-500">Island guide not found.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Parse data from database
  const quickFacts = parseJSON(island.quickFacts) || [];
  const topThingsToDo = parseJSON(island.topThingsToDo) || [];
  const foodCafes = parseJSON(island.foodCafes) || [];
  const faqs = parseJSON(island.faq) || [];
  
  // Debug logging
  console.log('Island name:', island.name);
  console.log('Raw topThingsToDo from DB:', island.topThingsToDo);
  console.log('Parsed topThingsToDo:', topThingsToDo);
  console.log('topThingsToDo length:', topThingsToDo.length);

  // Get all islands for navigation
  const allIslands = guides.filter((g: any) => g.published);
  const currentIslandIndex = allIslands.findIndex((g: any) => g.id === island.id);
  const previousIsland = currentIslandIndex > 0 ? allIslands[currentIslandIndex - 1] : null;
  const nextIsland = currentIslandIndex < allIslands.length - 1 ? allIslands[currentIslandIndex + 1] : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Navigation />
      
      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-gray-200 sticky top-20 z-40">
        <div className="container py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/">
              <span className="text-primary hover:text-accent cursor-pointer transition-colors">Home</span>
            </Link>
            <span className="text-gray-400">/</span>
            <Link href="/explore-maldives">
              <span className="text-primary hover:text-accent cursor-pointer transition-colors">Explore</span>
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600 font-medium">{island.name}</span>
          </div>
          <Link href="/explore-maldives">
            <Button variant="outline" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Explore
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Header */}
      <div className="relative h-96 overflow-hidden">
        {island.heroImage && (
          <img
            src={island.heroImage}
            alt={island.name}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 text-white p-8">
          <div className="container">
            <h1 className="text-4xl font-bold mb-2">{island.name}</h1>
            <p className="text-lg text-gray-200">Explore this beautiful destination</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-5 mb-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="things-to-do">Things to Do</TabsTrigger>
                <TabsTrigger value="how-to-get">How to Get</TabsTrigger>
                <TabsTrigger value="practical">Practical</TabsTrigger>
                <TabsTrigger value="faq">FAQ</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="mt-6 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>About {island.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed">{island.overview}</p>
                  </CardContent>
                </Card>

                {/* Quick Facts */}
                {quickFacts.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <AlertCircle className="w-5 h-5" />
                        Quick Facts
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {quickFacts.map((fact: string, idx: number) => (
                          fact && (
                            <div key={idx} className="flex items-start gap-2 p-3 bg-accent/10 rounded-lg">
                              <span className="text-accent font-bold text-lg">•</span>
                              <span className="text-sm text-gray-700">{fact}</span>
                            </div>
                          )
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Things to Do Tab - WikiTravel Style */}
              <TabsContent value="things-to-do" className="mt-6 space-y-6">
                {/* Excursions Section */}
                {experiences.length > 0 && (
                  <ExcursionsInfo excursions={experiences} islandName={island.name} />
                )}
                {/* See Section - Attractions & Landmarks */}
                {island.attractions && parseJSON(island.attractions).length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="w-5 h-5" />
                        See
                      </CardTitle>
                      <CardDescription>Attractions & Landmarks</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {parseJSON(island.attractions).map((attraction: any, idx: number) => (
                          attraction && (attraction.name || attraction.description) && (
                            <div key={idx} className="border-l-4 border-blue-500 pl-4">
                              {attraction.name && <h4 className="font-semibold text-gray-800">{attraction.name}</h4>}
                              {attraction.description && <p className="text-sm text-gray-600 mt-1">{attraction.description}</p>}
                            </div>
                          )
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Do Section - Activities */}
                {topThingsToDo.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Compass className="w-5 h-5" />
                        Do
                      </CardTitle>
                      <CardDescription>Activities & Experiences</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {topThingsToDo.map((activity: any, idx: number) => (
                          activity && (activity.title || activity.description) && (
                            <div key={idx} className="border-l-4 border-green-500 pl-4">
                              {activity.title && <h4 className="font-semibold text-gray-800">{activity.title}</h4>}
                              {activity.description && <p className="text-sm text-gray-600 mt-1">{activity.description}</p>}
                            </div>
                          )
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Water Activities */}
                {(linkedActivitySpots.length > 0 || nearbyActivitySpots.length > 0) && (
                  <WaterActivitiesSection
                    linkedSpots={linkedActivitySpots}
                    nearbySpots={nearbyActivitySpots}
                    islandLatitude={island.latitude}
                    islandLongitude={island.longitude}
                  />
                )}
              </TabsContent>

              {/* How to Get Tab */}
              <TabsContent value="how-to-get" className="mt-6 space-y-6">
                <AirportInfo islandGuideId={island.id} islandName={island.name} />
              </TabsContent>

              {/* Practical Tab */}
              <TabsContent value="practical" className="mt-6 space-y-6">
                {/* Currency & Language */}
                {(island.currency || island.language) && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Practical Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {island.currency && (
                        <div>
                          <h4 className="font-semibold text-gray-800">Currency</h4>
                          <p className="text-gray-600">{island.currency}</p>
                        </div>
                      )}
                      {island.language && (
                        <div>
                          <h4 className="font-semibold text-gray-800">Language</h4>
                          <p className="text-gray-600">{island.language}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Food & Cafes */}
                {foodCafes.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Utensils className="w-5 h-5" />
                        Eat
                      </CardTitle>
                      <CardDescription>Restaurants & Cafes</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {foodCafes.map((cafe: any, idx: number) => (
                          cafe && (cafe.name || cafe.description) && (
                            <div key={idx} className="border-l-4 border-orange-500 pl-4">
                              {cafe.name && <h4 className="font-semibold text-gray-800">{cafe.name}</h4>}
                              {cafe.type && <p className="text-xs text-gray-500">{cafe.type}</p>}
                              {cafe.description && <p className="text-sm text-gray-600 mt-1">{cafe.description}</p>}
                            </div>
                          )
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* FAQ Tab */}
              <TabsContent value="faq" className="mt-6 space-y-6">
                {faqs.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <HelpCircle className="w-5 h-5" />
                        Frequently Asked Questions
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {faqs.map((faq: any, idx: number) => (
                          faq && (faq.question || faq.answer) && (
                            <div key={idx} className="border-b pb-4 last:border-b-0">
                              {faq.question && <h4 className="font-semibold text-gray-800 mb-2">{faq.question}</h4>}
                              {faq.answer && <p className="text-sm text-gray-600">{faq.answer}</p>}
                            </div>
                          )
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Island Info Card */}
            <Card>
              <CardHeader>
                <CardTitle>Island Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {island.atoll && (
                  <div>
                    <p className="text-sm text-gray-600">Atoll</p>
                    <p className="font-semibold text-gray-800">{island.atoll}</p>
                  </div>
                )}
                {island.bestTimeToVisit && (
                  <div>
                    <p className="text-sm text-gray-600">Best Time to Visit</p>
                    <p className="font-semibold text-gray-800">{island.bestTimeToVisit}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Navigation */}
            {(previousIsland || nextIsland) && (
              <Card>
                <CardHeader>
                  <CardTitle>Explore More Islands</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {previousIsland && (
                    <Link href={`/island/${previousIsland.id}`}>
                      <Button variant="outline" className="w-full justify-start gap-2">
                        <ArrowLeft className="w-4 h-4" />
                        {previousIsland.name}
                      </Button>
                    </Link>
                  )}
                  {nextIsland && (
                    <Link href={`/island/${nextIsland.id}`}>
                      <Button variant="outline" className="w-full justify-end gap-2">
                        {nextIsland.name}
                        <ArrowLeft className="w-4 h-4 rotate-180" />
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
