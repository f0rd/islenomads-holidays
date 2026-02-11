'use client';

import { useRoute } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Map, MapPin, Compass, Utensils, Backpack, AlertCircle, HelpCircle, Calendar, ArrowLeft, Waves, Zap, Plane, Ship } from 'lucide-react';
import { Link } from 'wouter';
import { trpc } from '@/lib/trpc';
import Navigation from '@/components/Navigation';
import { useState, useEffect } from 'react';

export default function IslandDetail() {
  const [, params] = useRoute('/island/:slug');
  const slug = params?.slug as string;
  
  const [island, setIsland] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [linkedActivitySpots, setLinkedActivitySpots] = useState<any[]>([]);
  const [nearbyActivitySpots, setNearbyActivitySpots] = useState<any[]>([]);

  // Fetch island guide
  const { data: guides = [] } = trpc.islandGuides.list.useQuery();
  const { data: packages = [] } = trpc.packages.list.useQuery();
  const { data: activitySpots = [] } = trpc.activitySpots.list.useQuery();
  
  // Fetch nearby activity spots when island coordinates are available
  const { data: nearbySpots = [] } = trpc.activitySpots.getNearby.useQuery(
    { latitude: island?.latitude || 0, longitude: island?.longitude || 0, radiusKm: 10 },
    { enabled: !!island?.latitude && !!island?.longitude }
  );

  useEffect(() => {
    if (guides.length > 0 && slug) {
      const foundIsland = guides.find((g: any) => g.slug === slug);
      setIsland(foundIsland || null);
      setIsLoading(false);
      
      // Filter activity spots linked to this island
      if (foundIsland) {
        const linked = activitySpots.filter((spot: any) => spot.islandGuideId === foundIsland.id);
        setLinkedActivitySpots(linked);
      }
    }
  }, [slug, guides.length, activitySpots]);

  // Update nearby spots when fetched
  useEffect(() => {
    if (nearbySpots && nearbySpots.length > 0) {
      setNearbyActivitySpots(nearbySpots);
    }
  }, [nearbySpots]);

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

  // Parse data from database
  const quickFacts = parseJSON(island.quickFacts) || [];
  const topThingsToDo = parseJSON(island.topThingsToDo) || [];
  const foodCafes = parseJSON(island.foodCafes) || [];
  const faqs = parseJSON(island.faq) || [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Navigation />
      
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
                              {attraction.name && <h4 className="font-semibold text-gray-900 mb-1">{attraction.name}</h4>}
                              {attraction.location && <p className="text-xs text-gray-500 mb-2">{attraction.location}</p>}
                              {attraction.description && <p className="text-gray-700 text-sm">{attraction.description}</p>}
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
                    <CardContent className="space-y-4">
                      <div className="space-y-4">
                        {topThingsToDo.map((item: any, idx: number) => (
                          item && (item.title || item.description) && (
                            <div key={idx} className="border-l-4 border-accent pl-4">
                              {item.title && <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>}
                              {item.description && <p className="text-gray-700 text-sm">{item.description}</p>}
                            </div>
                          )
                        ))}
                      </div>
                      
                      {/* Activity Spots - Dive Sites, Snorkeling, Surfing */}
                      {(linkedActivitySpots.length > 0 || nearbyActivitySpots.length > 0) && (
                        <div className="mt-6 pt-6 border-t space-y-4">
                          <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                            <Waves className="w-4 h-4" />
                            Water Activities
                          </h4>
                          <div className="space-y-3">
                            {linkedActivitySpots.map((spot: any, idx: number) => (
                              <div key={`linked-${idx}`} className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                <div className="flex items-start justify-between mb-2">
                                  <h5 className="font-semibold text-gray-900">{spot.name}</h5>
                                  <Badge className="text-xs bg-blue-600">
                                    {spot.spotType === 'dive_site' ? 'Dive' : spot.spotType === 'surf_spot' ? 'Surf' : 'Snorkel'}
                                  </Badge>
                                </div>
                                {spot.difficulty && (
                                  <p className="text-xs text-gray-600 mb-2">Difficulty: {spot.difficulty}</p>
                                )}
                                {spot.description && (
                                  <p className="text-sm text-gray-700 mb-2">{spot.description}</p>
                                )}
                                {spot.bestSeason && (
                                  <p className="text-xs text-gray-600">Best Season: {spot.bestSeason}</p>
                                )}
                              </div>
                            ))}
                            {nearbyActivitySpots.length > 0 && linkedActivitySpots.length > 0 && (
                              <div className="mt-4 pt-4 border-t">
                                <p className="text-xs text-gray-500 mb-3 flex items-center gap-2">
                                  <MapPin className="w-3 h-3" />
                                  Nearby spots (within 10 km)
                                </p>
                                <div className="space-y-3">
                                  {nearbyActivitySpots.map((spot: any, idx: number) => (
                                    <div key={`nearby-${idx}`} className="bg-green-50 border border-green-200 rounded-lg p-3 opacity-85">
                                      <div className="flex items-start justify-between mb-2">
                                        <h5 className="font-semibold text-gray-900">{spot.name}</h5>
                                        <Badge className="text-xs bg-green-600">
                                          {spot.spotType === 'dive_site' ? 'Dive' : spot.spotType === 'surf_spot' ? 'Surf' : 'Snorkel'}
                                        </Badge>
                                      </div>
                                      {spot.difficulty && (
                                        <p className="text-xs text-gray-600 mb-2">Difficulty: {spot.difficulty}</p>
                                      )}
                                      {spot.description && (
                                        <p className="text-sm text-gray-700 mb-2">{spot.description}</p>
                                      )}
                                      {spot.bestSeason && (
                                        <p className="text-xs text-gray-600">Best Season: {spot.bestSeason}</p>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            {nearbyActivitySpots.length > 0 && linkedActivitySpots.length === 0 && (
                              <div className="space-y-3">
                                {nearbyActivitySpots.map((spot: any, idx: number) => (
                                  <div key={`nearby-${idx}`} className="bg-green-50 border border-green-200 rounded-lg p-3">
                                    <div className="flex items-start justify-between mb-2">
                                      <h5 className="font-semibold text-gray-900">{spot.name}</h5>
                                      <Badge className="text-xs bg-green-600">
                                        {spot.spotType === 'dive_site' ? 'Dive' : spot.spotType === 'surf_spot' ? 'Surf' : 'Snorkel'}
                                      </Badge>
                                    </div>
                                    {spot.difficulty && (
                                      <p className="text-xs text-gray-600 mb-2">Difficulty: {spot.difficulty}</p>
                                    )}
                                    {spot.description && (
                                      <p className="text-sm text-gray-700 mb-2">{spot.description}</p>
                                    )}
                                    {spot.bestSeason && (
                                      <p className="text-xs text-gray-600">Best Season: {spot.bestSeason}</p>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Eat Section - Food & Dining */}
                {foodCafes.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Utensils className="w-5 h-5" />
                        Eat
                      </CardTitle>
                      <CardDescription>Dining & Cafés</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {foodCafes.map((cafe: any, idx: number) => (
                          cafe && (cafe.name || cafe.description) && (
                            <div key={idx} className="border-l-4 border-orange-500 pl-4">
                              {cafe.name && <h4 className="font-semibold text-gray-900 mb-1">{cafe.name}</h4>}
                              {cafe.description && <p className="text-gray-700 text-sm">{cafe.description}</p>}
                            </div>
                          )
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* How to Get There Tab */}
              <TabsContent value="how-to-get" className="mt-6 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      How to Get There
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {island.flightInfo && (
                      <div className="border-l-4 border-blue-500 pl-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Plane className="w-5 h-5 text-blue-500" />
                          <h4 className="font-semibold text-gray-900">By Flight</h4>
                        </div>
                        <p className="text-gray-700 text-sm">{island.flightInfo}</p>
                      </div>
                    )}
                    
                    {island.speedboatInfo && (
                      <div className="border-l-4 border-orange-500 pl-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Ship className="w-5 h-5 text-orange-500" />
                          <h4 className="font-semibold text-gray-900">By Speedboat</h4>
                        </div>
                        <p className="text-gray-700 text-sm">{island.speedboatInfo}</p>
                      </div>
                    )}
                    
                    {island.ferryInfo && (
                      <div className="border-l-4 border-teal-500 pl-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Ship className="w-5 h-5 text-teal-500" />
                          <h4 className="font-semibold text-gray-900">By Ferry</h4>
                        </div>
                        <p className="text-gray-700 text-sm">{island.ferryInfo}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>



              {/* Practical Tab */}
              <TabsContent value="practical" className="mt-6 space-y-6">
                {/* Food & Cafés */}
                {foodCafes.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Utensils className="w-5 h-5" />
                        Food & Cafés
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {foodCafes.map((cafe: string, idx: number) => (
                          cafe && (
                            <li key={idx} className="flex items-start gap-2 text-gray-700">
                              <span className="text-accent font-bold mt-1">•</span>
                              <span>{cafe}</span>
                            </li>
                          )
                        ))}
                      </ul>
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
                              {faq.question && <h4 className="font-semibold text-gray-900 mb-2">{faq.question}</h4>}
                              {faq.answer && <p className="text-gray-700 text-sm">{faq.answer}</p>}
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
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Island Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {island.latitude && island.longitude && (
                  <div>
                    <p className="text-sm font-semibold text-gray-600 mb-2">Coordinates</p>
                    <p className="text-sm text-gray-700">
                      {parseFloat(island.latitude).toFixed(2)}°N, {parseFloat(island.longitude).toFixed(2)}°E
                    </p>
                  </div>
                )}
                
                {island.atollId && (
                  <div>
                    <p className="text-sm font-semibold text-gray-600 mb-2">Atoll</p>
                    <p className="text-sm text-gray-700">{island.atollId}</p>
                  </div>
                )}

                <Button className="w-full bg-accent hover:bg-accent/90">
                  Plan Your Trip
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
