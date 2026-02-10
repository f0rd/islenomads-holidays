import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Compass, Waves, ArrowRight } from 'lucide-react';
import { trpc } from '@/lib/trpc';

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

export default function Atolls() {
  const [atolls, setAtolls] = useState<AtollData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  // Fetch atolls from tRPC
  const { data: atollsData = [] } = trpc.atolls.list.useQuery();

  useEffect(() => {
    if (atollsData && atollsData.length > 0) {
      setAtolls(atollsData);
      setIsLoading(false);
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

      {/* Atolls Grid */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAtolls.map((atoll) => {
              const highlights = parseJSON(atoll.highlights);
              const activities = parseJSON(atoll.activities);

              return (
                <Link key={atoll.id} href={`/atoll/${atoll.slug}`}>
                  <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer h-full flex flex-col group">
                    {/* Hero Image */}
                    <div className="relative h-48 overflow-hidden bg-muted">
                      <img
                        src={getHeroImage(atoll)}
                        alt={atoll.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      
                      {/* Region Badge */}
                      <div className="absolute top-4 right-4">
                        <Badge variant="secondary" className="bg-accent text-accent-foreground">
                          {atoll.region}
                        </Badge>
                      </div>

                      {/* Title Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="text-2xl font-bold text-white">{atoll.name}</h3>
                      </div>
                    </div>

                    {/* Content */}
                    <CardContent className="flex-1 flex flex-col p-6">
                      {/* Description */}
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {atoll.description || atoll.overview}
                      </p>

                      {/* Best For Tags */}
                      {atoll.bestFor && (
                        <div className="mb-4">
                          <p className="text-xs font-semibold text-foreground mb-2">Best For:</p>
                          <div className="flex flex-wrap gap-2">
                            {atoll.bestFor.split(',').slice(0, 2).map((tag, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {tag.trim()}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Quick Info */}
                      <div className="space-y-2 mb-6 text-sm">
                        {atoll.bestSeason && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Compass className="w-4 h-4 text-accent" />
                            <span>Best: {atoll.bestSeason}</span>
                          </div>
                        )}
                        {activities && activities.length > 0 && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Waves className="w-4 h-4 text-accent" />
                            <span>{activities.length} activities</span>
                          </div>
                        )}
                        {atoll.transportation && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="w-4 h-4 text-accent" />
                            <span>Easy access</span>
                          </div>
                        )}
                      </div>

                      {/* Explore Button */}
                      <Button
                        className="w-full mt-auto gap-2 group/btn"
                        variant="default"
                      >
                        Explore Atoll
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>

          {/* Empty State */}
          {filteredAtolls.length === 0 && (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">
                No atolls found for the selected region.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Info Section */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">About Maldives Atolls</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-4xl font-bold text-accent mb-2">26</div>
                  <p className="text-sm text-muted-foreground">
                    Natural atolls in the Maldives
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-4xl font-bold text-accent mb-2">1,190</div>
                  <p className="text-sm text-muted-foreground">
                    Coral islands across all atolls
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-4xl font-bold text-accent mb-2">3</div>
                  <p className="text-sm text-muted-foreground">
                    Geographic regions to explore
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="mt-12 p-8 bg-background rounded-lg border border-border">
              <h3 className="text-xl font-semibold mb-4">Atolls Overview</h3>
              <p className="text-muted-foreground mb-4">
                The Maldives consists of 26 natural atolls arranged in a north-south chain. Each atoll is a ring-shaped coral reef with a lagoon in the center, creating unique ecosystems and diving opportunities. Our featured atolls showcase the best destinations across three geographic regions: North, Central, and South.
              </p>
              <p className="text-muted-foreground">
                Whether you're seeking luxury resort experiences, budget-friendly local island stays, world-class diving, or pristine snorkeling, each atoll offers distinct characteristics and attractions tailored to different travel styles and preferences.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
