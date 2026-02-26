import { Link } from 'wouter';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Compass, Waves, ArrowRight } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { getIslandGuideUrl } from '@shared/locations';
import { getIslandFeaturedImage } from '@shared/islandFeaturedImages';
import { useState, useEffect } from 'react';

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

interface IslandData {
  id: number;
  name: string;
  slug: string;
  atoll: string | null;
  overview: string | null;
  featured: number;
  published: number;
}

export default function Atolls() {
  const [atolls, setAtolls] = useState<AtollData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [atollFeaturedIslands, setAtollFeaturedIslands] = useState<Record<number, IslandData[]>>({});

  // Fetch atolls from tRPC
  const { data: atollsData = [] } = trpc.atolls.list.useQuery();

  useEffect(() => {
    if (atollsData && atollsData.length > 0) {
      setAtolls(atollsData);
      setIsLoading(false);
      
      // Fetch featured islands for each atoll
      const fetchFeaturedIslands = async () => {
        const islandsMap: Record<number, IslandData[]> = {};
        
        for (const atoll of atollsData) {
          try {
            // Fetch featured islands for this atoll
            const response = await fetch(`/api/trpc/atolls.getFeaturedIslands?input=${encodeURIComponent(JSON.stringify({ atollId: atoll.id, limit: 3 }))}`)
              .then(res => res.json());
            
            islandsMap[atoll.id] = response.result?.data || [];
          } catch (error) {
            console.error(`Failed to fetch featured islands for atoll ${atoll.id}:`, error);
            islandsMap[atoll.id] = [];
          }
        }
        
        setAtollFeaturedIslands(islandsMap);
      };
      
      fetchFeaturedIslands();
    }
  }, [atollsData]);

  // Filter atolls by region if selected
  const filteredAtolls = selectedRegion
    ? atolls.filter((atoll) => atoll.region === selectedRegion)
    : atolls;

  // Get unique regions for filter buttons
  const regions = Array.from(new Set(atolls.map((atoll) => atoll.region)));

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
    
    // Fallback images based on atoll name
    const fallbackImages: Record<string, string> = {
      'Kaafu Atoll': 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop',
      'Alif Alif Atoll': 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800&h=600&fit=crop',
      'Alif Dhaal Atoll': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop',
      'Baa Atoll': 'https://images.unsplash.com/photo-1439405326854-014607f694d7?w=800&h=600&fit=crop',
      'Vaavu Atoll': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop',
      'Lhaviyani Atoll': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
    };
    
    return fallbackImages[atoll.name] || 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative py-16 md:py-24 bg-gradient-to-r from-primary/95 to-primary/85">
        <div className="container">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
              Explore Maldives by Atolls
            </h1>
            <p className="text-lg text-primary-foreground/90 mb-6">
              Discover the unique characteristics, activities, and experiences of each atoll region. From pristine diving sites to luxury resorts, find your perfect destination.
            </p>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 bg-background border-b border-border">
        <div className="container">
          <div className="flex flex-wrap gap-3 items-center">
            <span className="text-sm font-semibold text-foreground">Filter by Region:</span>
            <Button
              variant={selectedRegion === null ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedRegion(null)}
              className="rounded-full"
            >
              All Atolls
            </Button>
            {regions.map((region) => (
              <Button
                key={region}
                variant={selectedRegion === region ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedRegion(region)}
                className="rounded-full"
              >
                {region}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Atolls with Featured Islands */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="space-y-16">
            {filteredAtolls.map((atoll) => {
              const highlights = parseJSON(atoll.highlights);
              const featuredIslands = atollFeaturedIslands[atoll.id] || [];

              return (
                <div key={atoll.id} className="space-y-8">
                  {/* Atoll Card */}
                  <Link href={`/atoll/${atoll.slug}`}>
                    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
                        {/* Hero Image */}
                        <div className="relative h-64 md:h-full overflow-hidden bg-muted">
                          <img
                            src={getHeroImage(atoll)}
                            alt={atoll.name}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                            decoding="async"
                          />
                          <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground">
                            {atoll.region}
                          </Badge>
                        </div>

                        {/* Content */}
                        <div className="md:col-span-2 p-8">
                          <h3 className="text-3xl font-bold text-foreground mb-3">{atoll.name}</h3>
                          <p className="text-base text-muted-foreground mb-6">
                            {atoll.description || 'Discover this beautiful atoll region'}
                          </p>

                          {/* Quick Info */}
                          <div className="space-y-2 mb-6 text-sm">
                            {atoll.bestFor && (
                              <div className="flex items-start gap-2">
                                <Compass className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                                <span className="text-muted-foreground">{atoll.bestFor}</span>
                              </div>
                            )}
                            {atoll.bestSeason && (
                              <div className="flex items-start gap-2">
                                <Waves className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                                <span className="text-muted-foreground">{atoll.bestSeason}</span>
                              </div>
                            )}
                          </div>

                          {/* Highlights */}
                          {highlights.length > 0 && (
                            <div className="mb-6">
                              <div className="flex flex-wrap gap-2">
                                {highlights.slice(0, 3).map((highlight: string, idx: number) => (
                                  <Badge key={idx} variant="secondary" className="text-xs">
                                    {highlight}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* CTA */}
                          <Button className="gap-2 group/btn">
                            Explore Atoll
                            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </Link>

                  {/* Featured Islands */}
                  {featuredIslands.length > 0 && (
                    <div className="ml-0 md:ml-8">
                      <h4 className="text-xl font-bold text-foreground mb-4">Featured Islands</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {featuredIslands.map((island) => (
                          <Link key={island.id} href={getIslandGuideUrl(island.slug)}>
                            <Card className="overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer h-full flex flex-col group">
                              <div className="h-40 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center overflow-hidden relative">
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
                                <h5 className="font-semibold text-foreground group-hover:text-accent transition-colors mb-2">
                                  {island.name}
                                </h5>
                                {island.overview && (
                                  <p className="text-xs text-muted-foreground line-clamp-2 flex-1 mb-3">
                                    {island.overview}
                                  </p>
                                )}
                                <Button variant="outline" size="sm" className="w-full gap-1 group/btn">
                                  View Guide
                                  <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
                                </Button>
                              </CardContent>
                            </Card>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
