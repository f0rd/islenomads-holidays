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
  const [atoll, setAtoll] = useState<AtollData | null>(null);
  const [featuredIslands, setFeaturedIslands] = useState<IslandGuideData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch atoll by slug
  const { data: atollData } = trpc.atolls.getBySlug.useQuery(
    { slug: params?.slug || '' },
    { enabled: !!params?.slug && (!!matchExplore || !!matchAtoll) }
  );

  // Fetch islands for this atoll from the database
  const { data: islandsData = [] } = trpc.atolls.getIslands.useQuery(
    { atollId: atollData?.id || 0 },
    { enabled: !!atollData?.id }
  );

  useEffect(() => {
    if (atollData) {
      setAtoll(atollData);
      setFeaturedIslands(islandsData);
      setIsLoading(false);
    }
  }, [atollData, islandsData]);

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

  if (!atoll) {
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

  const highlights = parseJSON(atoll.highlights);
  const activities = parseJSON(atoll.activities);
  const accommodation = parseJSON(atoll.accommodation);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative h-96 overflow-hidden">
        <img
          src={getHeroImage(atoll)}
          alt={atoll.name}
          className="w-full h-full object-cover"
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
                  {atoll.region} Region
                </Badge>
                <h1 className="text-5xl font-bold text-white mb-2">{atoll.name}</h1>
                <p className="text-lg text-white/90 max-w-2xl">
                  {atoll.description}
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
                    <h2 className="text-3xl font-bold mb-4">About {atoll.name}</h2>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                      {atoll.overview}
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
                    <p className="text-muted-foreground mb-6">
                      Discover the diverse activities and experiences available in {atoll.name}.
                    </p>
                  </div>

                  {activities && activities.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {activities.map((activity: any, idx: number) => {
                        const icons: Record<string, any> = {
                          diving: <Fish className="w-5 h-5" />,
                          snorkeling: <Waves className="w-5 h-5" />,
                          photography: <Camera className="w-5 h-5" />,
                          default: <Compass className="w-5 h-5" />,
                        };

                        const activityType = typeof activity === 'string' 
                          ? activity.toLowerCase() 
                          : activity.name?.toLowerCase() || 'default';
                        
                        const icon = Object.keys(icons).some(key => activityType.includes(key))
                          ? icons[Object.keys(icons).find(key => activityType.includes(key)) || 'default']
                          : icons.default;

                        return (
                          <Card key={idx}>
                            <CardContent className="p-6">
                              <div className="flex items-start gap-4">
                                <div className="text-accent mt-1">{icon}</div>
                                <div>
                                  <h4 className="font-semibold text-foreground mb-1">
                                    {typeof activity === 'string' ? activity : activity.name}
                                  </h4>
                                  {activity.description && (
                                    <p className="text-sm text-muted-foreground">
                                      {activity.description}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Activities information coming soon.</p>
                  )}
                </TabsContent>

                {/* Accommodation Tab */}
                <TabsContent value="accommodation" className="space-y-6">
                  <div>
                    <h2 className="text-3xl font-bold mb-4">Where to Stay</h2>
                    <p className="text-muted-foreground mb-6">
                      {atoll.name} offers various accommodation options to suit every budget and preference.
                    </p>
                  </div>

                  {accommodation && accommodation.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {accommodation.map((option: any, idx: number) => (
                        <Card key={idx}>
                          <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                              <Hotel className="w-5 h-5 text-accent mt-1" />
                              <div>
                                <h4 className="font-semibold text-foreground mb-1">
                                  {typeof option === 'string' ? option : option.name}
                                </h4>
                                {option.description && (
                                  <p className="text-sm text-muted-foreground">
                                    {option.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Accommodation information coming soon.</p>
                  )}
                </TabsContent>

                {/* Info Tab */}
                <TabsContent value="info" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {atoll.bestSeason && (
                      <Card>
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <Compass className="w-5 h-5 text-accent mt-1" />
                            <div>
                              <h4 className="font-semibold text-foreground mb-1">Best Season</h4>
                              <p className="text-sm text-muted-foreground">{atoll.bestSeason}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {atoll.transportation && (
                      <Card>
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <MapPin className="w-5 h-5 text-accent mt-1" />
                            <div>
                              <h4 className="font-semibold text-foreground mb-1">Getting There</h4>
                              <p className="text-sm text-muted-foreground">{atoll.transportation}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {atoll.bestFor && (
                      <Card className="md:col-span-2">
                        <CardContent className="p-6">
                          <h4 className="font-semibold text-foreground mb-3">Perfect For</h4>
                          <div className="flex flex-wrap gap-2">
                            {atoll.bestFor.split(',').map((tag, idx) => (
                              <Badge key={idx} variant="secondary">
                                {tag.trim()}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Right Column - Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24 border-2 border-accent/20">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4">Quick Facts</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Region</p>
                      <p className="font-semibold">{atoll.region}</p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Featured Islands</p>
                      <p className="font-semibold">{featuredIslands.length}</p>
                    </div>

                    {atoll.bestSeason && (
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Best Time</p>
                        <p className="font-semibold text-sm">{atoll.bestSeason}</p>
                      </div>
                    )}

                    <div className="pt-4 border-t border-border">
                      <Link href="/trip-planner">
                        <Button className="w-full gap-2">
                          Plan Your Trip
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Islands Section */}
      {featuredIslands.length > 0 && (
        <section className="py-16 md:py-24 bg-muted/50">
          <div className="container">
            <div className="mb-12">
              <h2 className="text-4xl font-bold mb-4">Featured Islands in {atoll.name}</h2>
              <p className="text-lg text-muted-foreground max-w-2xl">
                Explore the islands within this atoll and discover unique experiences, activities, and accommodations.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredIslands.map((island: IslandGuideData) => (
                    <Link key={island.id} href={getIslandGuideUrl(island.id)}>
                  <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer h-full flex flex-col group">
                    <div className="h-48 bg-gradient-to-br from-primary/40 to-accent/40 flex items-center justify-center overflow-hidden relative">
                      {island.slug ? (
                        <>
                          <img
                            src={getIslandFeaturedImage(island.slug)}
                            alt={island.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        </>
                      ) : null}
                    </div>

                    <CardContent className="flex-1 flex flex-col p-6">
                      <h3 className="text-xl font-bold mb-2 group-hover:text-accent transition-colors">
                        {island.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">
                        {island.overview || 'Discover this beautiful island in the Maldives.'}
                      </p>
                      <Button variant="outline" className="w-full gap-2 group/btn">
                        View Guide
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            {featuredIslands.length === 0 && (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">
                  Island guides for {atoll.name} coming soon.
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
