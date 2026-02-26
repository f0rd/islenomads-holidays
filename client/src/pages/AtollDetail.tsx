import { useEffect, useState } from 'react';
import { useRoute, Link } from 'wouter';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MapPin, 
  Compass, 
  Waves, 
  Fish, 
  Hotel, 
  Utensils, 
  Camera,
  ArrowRight,
  ChevronLeft
} from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { getAtollHeroImage, getAttractionImage } from '@shared/atollImages';
import { getIslandFeaturedImage } from '@shared/islandFeaturedImages';
import { getIslandGuideUrl } from '@shared/locations';

interface AtollData {
  id: number;
  name: string;
  slug: string;
  region: string;
  description: string | null;
  heroImage: string | null;
  overview: string | null;
  bestFor: string | null;
  highlights: string | null;
  activities: string | null;
  accommodation: string | null;
  transportation: string | null;
  bestSeason: string | null;
  published: number;
  createdAt: Date;
  updatedAt: Date;
}

interface IslandGuideData {
  id: number;
  name: string;
  slug: string;
  atoll: string | null;
  overview: string | null;
  featured: number;
  published: number;
}

export default function AtollDetail() {
  const [matchExplore, paramsExplore] = useRoute('/explore-maldives/atoll/:slug');
  const [matchAtoll, paramsAtoll] = useRoute('/atoll/:slug');
  const params = paramsExplore || paramsAtoll;

  // Fetch atoll by slug
  const { data: atollData, isLoading: atollLoading } = trpc.atolls.getBySlug.useQuery(
    { slug: params?.slug || '' },
    { enabled: !!params?.slug && (!!matchExplore || !!matchAtoll) }
  );

  // Fetch islands for this atoll from the database
  const { data: regularIslandsData = [], isLoading: regularLoading } = trpc.atolls.getRegularIslands.useQuery(
    { atollId: atollData?.id || 0 },
    { enabled: !!atollData?.id }
  );
  const { data: featuredIslandsData = [], isLoading: featuredLoading } = trpc.atolls.getFeaturedIslands.useQuery(
    { atollId: atollData?.id || 0 },
    { enabled: !!atollData?.id }
  );

  const isLoading = atollLoading || regularLoading || featuredLoading;

  // Parse JSON fields safely
  const parseJSON = (data: string | null) => {
    if (!data) return [];
    try {
      return typeof data === 'string' ? JSON.parse(data) : data;
    } catch {
      return [];
    }
  };

  // Get hero image with fallback
  const getHeroImage = (atoll: AtollData) => {
    if (atoll.heroImage) return atoll.heroImage;
    return getAtollHeroImage(atoll.slug);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!atollData) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container py-24 text-center">
          <h1 className="text-3xl font-bold mb-4">Atoll Not Found</h1>
          <p className="text-muted-foreground mb-6">The atoll you're looking for doesn't exist.</p>
          <Link href="/atolls">
            <Button>Back to Atolls</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const highlights = parseJSON(atollData.highlights);
  const activities = parseJSON(atollData.activities);
  const accommodation = parseJSON(atollData.accommodation);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative h-96 overflow-hidden">
        <img
          src={getHeroImage(atollData)}
          alt={atollData.name}
          className="w-full h-full object-cover"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
        
        {/* Back Button */}
        <Link href="/atolls">
          <Button
            variant="outline"
            size="sm"
            className="absolute top-6 left-6 bg-background/80 backdrop-blur-sm hover:bg-background/90"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Atolls
          </Button>
        </Link>

        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container">
            <div className="flex items-end justify-between">
              <div>
                <Badge className="mb-4 bg-accent text-accent-foreground">
                  {atollData.region} Region
                </Badge>
                <h1 className="text-5xl font-bold text-white mb-2">{atollData.name}</h1>
                <p className="text-lg text-white/90 max-w-2xl">
                  {atollData.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4 mb-8">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="activities">Activities</TabsTrigger>
                  <TabsTrigger value="accommodation">Stay</TabsTrigger>
                  <TabsTrigger value="info">Info</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-6">
                  <div>
                    <h2 className="text-3xl font-bold mb-4">About {atollData.name}</h2>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                      {atollData.overview}
                    </p>
                  </div>

                  {highlights && highlights.length > 0 && (
                    <div>
                      <h3 className="text-2xl font-bold mb-4">Highlights</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {highlights.map((highlight: any, idx: number) => (
                          <Card key={idx} className="border-l-4 border-l-accent">
                            <CardContent className="p-4">
                              <p className="font-semibold text-foreground mb-2">
                                {highlight.title || highlight}
                              </p>
                              {highlight.description && (
                                <p className="text-sm text-muted-foreground">
                                  {highlight.description}
                                </p>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </TabsContent>

                {/* Activities Tab */}
                <TabsContent value="activities" className="space-y-6">
                  <div>
                    <h2 className="text-3xl font-bold mb-4">Activities & Experiences</h2>
                    {activities && activities.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {activities.map((activity: any, idx: number) => (
                          <Card key={idx} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-6">
                              <div className="flex items-start gap-4">
                                <div className="text-4xl">{activity.emoji || '🏝️'}</div>
                                <div className="flex-1">
                                  <h3 className="text-xl font-bold mb-2">{activity.title || activity}</h3>
                                  {activity.description && (
                                    <p className="text-muted-foreground">
                                      {activity.description}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No activities listed for this atoll.</p>
                    )}
                  </div>
                </TabsContent>

                {/* Accommodation Tab */}
                <TabsContent value="accommodation" className="space-y-6">
                  <div>
                    <h2 className="text-3xl font-bold mb-4">Accommodation Options</h2>
                    {accommodation && accommodation.length > 0 ? (
                      <div className="space-y-4">
                        {accommodation.map((option: any, idx: number) => (
                          <Card key={idx} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-6">
                              <div className="flex items-start gap-4">
                                <Hotel className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                                <div>
                                  <h3 className="text-lg font-bold mb-2">{option.type || option}</h3>
                                  {option.description && (
                                    <p className="text-muted-foreground">
                                      {option.description}
                                    </p>
                                  )}
                                  {option.priceRange && (
                                    <p className="text-sm font-semibold text-accent mt-2">
                                      {option.priceRange}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No accommodation information available.</p>
                    )}
                  </div>
                </TabsContent>

                {/* Info Tab */}
                <TabsContent value="info" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {atollData.bestSeason && (
                      <Card>
                        <CardContent className="p-6">
                          <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                            <Compass className="w-5 h-5 text-accent" />
                            Best Season
                          </h3>
                          <p className="text-muted-foreground">{atollData.bestSeason}</p>
                        </CardContent>
                      </Card>
                    )}
                    {atollData.transportation && (
                      <Card>
                        <CardContent className="p-6">
                          <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-accent" />
                            Getting There
                          </h3>
                          <p className="text-muted-foreground">{atollData.transportation}</p>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Right Column - Quick Facts */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-6">Quick Facts</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">REGION</p>
                      <p className="font-semibold">{atollData.region}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">FEATURED ISLANDS</p>
                      <p className="font-semibold">{featuredIslandsData.length}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">BEST TIME</p>
                      <p className="font-semibold text-sm">{atollData.bestSeason || 'Year-round'}</p>
                    </div>
                    <Link href="/trip-planner">
                      <Button className="w-full gap-2 mt-4">
                        Plan Your Trip
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Islands Section */}
      {featuredIslandsData.length > 0 && (
        <section className="py-16 md:py-24 bg-muted/50">
          <div className="container">
            <div className="mb-12">
              <h2 className="text-4xl font-bold mb-4">Featured Islands</h2>
              <p className="text-lg text-muted-foreground max-w-2xl">
                Discover the most popular islands in {atollData.name}.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredIslandsData.map((island: IslandGuideData) => (
                <Link key={island.id} href={getIslandGuideUrl(island.slug)}>
                  <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer h-full flex flex-col group">
                    <div className="h-48 bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center overflow-hidden relative">
                      {island.slug ? (
                        <>
                          <img
                            src={getIslandFeaturedImage(island.slug)}
                            alt={island.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            loading="lazy"
                            decoding="async"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        </>
                      ) : null}
                    </div>

                    <CardContent className="flex-1 flex flex-col p-6">
                      <h3 className="text-lg font-bold mb-2 group-hover:text-accent transition-colors">
                        {island.name}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-3 flex-1">
                        {island.overview || 'Discover this beautiful island.'}
                      </p>
                      <Button variant="ghost" size="sm" className="w-full gap-1 mt-4 group/btn">
                        View Guide
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Regular Islands Section */}
      {regularIslandsData.length > 0 && (
        <section className="py-16 md:py-24 bg-background">
          <div className="container">
            <div className="mb-12">
              <h2 className="text-4xl font-bold mb-4">All Islands in {atollData.name}</h2>
              <p className="text-lg text-muted-foreground max-w-2xl">
                Browse all islands available in this atoll region.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {regularIslandsData.map((island: IslandGuideData) => (
                <Link key={island.id} href={getIslandGuideUrl(island.slug)}>
                  <Card className="overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer h-full flex flex-col group">
                    <div className="h-32 bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center overflow-hidden relative">
                      {island.slug ? (
                        <>
                          <img
                            src={getIslandFeaturedImage(island.slug)}
                            alt={island.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                            decoding="async"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                        </>
                      ) : null}
                    </div>

                    <CardContent className="flex-1 flex flex-col p-4">
                      <h3 className="text-base font-bold mb-1 group-hover:text-accent transition-colors line-clamp-2">
                        {island.name}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-2 flex-1">
                        {island.overview || 'Discover this beautiful island.'}
                      </p>
                      <Button variant="ghost" size="sm" className="w-full gap-1 mt-2 group/btn">
                        View
                        <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
