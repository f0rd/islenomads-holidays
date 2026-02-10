import { useState, useMemo } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  MapPin, 
  Search,
  ArrowRight,
  Waves,
  Fish,
  Users,
  Star
} from 'lucide-react';
import { Link } from 'wouter';
import { trpc } from '@/lib/trpc';

interface IslandGuideData {
  id: number;
  name: string;
  slug: string;
  atoll: string | null;
  overview: string | null;
  featured: number;
  published: number;
  heroImage?: string | null;
  contentType?: 'island' | 'point_of_interest';
}

interface AtollData {
  id: number;
  name: string;
  slug: string;
  region: string;
  description: string | null;
  heroImage: string | null;
  bestFor: string | null;
}

interface ActivitySpotData {
  id: number;
  name: string;
  slug: string;
  spotType: 'surf_spot' | 'dive_site' | 'snorkeling_spot';
  description: string | null;
  difficulty: string | null;
  bestSeason: string | null;
  islandGuideId: number;
}

export default function ExploreMaldives() {
  const [activeTab, setActiveTab] = useState<'atolls' | 'islands' | 'poi'>('atolls');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch atolls
  const { data: atolls = [] } = trpc.atolls.list.useQuery();

  // Fetch island guides
  const { data: islands = [] } = trpc.islandGuides.list.useQuery();

  // Fetch activity spots
  const { data: activitySpots = [] } = trpc.activitySpots.list.useQuery();

  // Get unique regions from atolls
  const regions = useMemo(() => {
    const uniqueRegions = new Set(atolls.map((a: AtollData) => a.region));
    return ['All', ...Array.from(uniqueRegions)];
  }, [atolls]);

  // Filter and search atolls
  const filteredAtolls = useMemo(() => {
    return atolls.filter((atoll: AtollData) => {
      const matchesRegion = selectedRegion === 'All' || atoll.region === selectedRegion;
      const matchesSearch = atoll.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (atoll.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
      return matchesRegion && matchesSearch;
    });
  }, [atolls, selectedRegion, searchQuery]);

  // Filter and search islands (only actual islands, not POIs)
  const filteredIslands = useMemo(() => {
    return islands.filter((island: IslandGuideData) => {
      const matchesSearch = island.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (island.overview?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
      const isPublished = island.published === 1;
      const isActualIsland = island.contentType !== 'point_of_interest'; // Filter out POIs
      return matchesSearch && isPublished && isActualIsland;
    });
  }, [islands, searchQuery]);

  // Filter and search points of interest (combine POIs and activity spots)
  const filteredPointsOfInterest = useMemo(() => {
    const pois = islands.filter((island: IslandGuideData) => {
      const matchesSearch = island.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (island.overview?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
      const isPublished = island.published === 1;
      const isPOI = island.contentType === 'point_of_interest';
      return matchesSearch && isPublished && isPOI;
    });
    const spots = activitySpots.filter((spot: ActivitySpotData) => {
      const matchesSearch = spot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (spot.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
      return matchesSearch;
    });
    return { pois, spots };
  }, [islands, activitySpots, searchQuery]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-gradient-to-br from-primary/90 to-primary/70 text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent rounded-full blur-3xl" />
        </div>

        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">Explore the Maldives</h1>
            <p className="text-lg md:text-xl text-primary-foreground/90 mb-8">
              Discover pristine atolls and beautiful islands. Browse by region or search for your perfect destination.
            </p>

            {/* Enhanced Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5 group-focus-within:text-accent transition-colors" />
                <Input
                  placeholder="Search atolls, islands, dive sites, attractions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-4 text-base bg-background text-foreground border-2 border-border hover:border-accent focus:border-accent transition-colors rounded-lg shadow-lg"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    X
                  </button>
                )}
              </div>
              {searchQuery && (
                <div className="mt-3 text-sm text-muted-foreground text-center">
                  {filteredAtolls.length + filteredIslands.length + filteredPointsOfInterest.pois.length + filteredPointsOfInterest.spots.length} results found
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 md:py-24">
        <div className="container">
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'atolls' | 'islands' | 'poi')} className="w-full">
            {/* Tab Navigation */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12">
              <TabsList className="grid w-full md:w-auto grid-cols-3">
                <TabsTrigger value="atolls" className="gap-2">
                  <Waves className="w-4 h-4" />
                  Atolls
                </TabsTrigger>
                <TabsTrigger value="islands" className="gap-2">
                  <MapPin className="w-4 h-4" />
                  Islands
                </TabsTrigger>
                <TabsTrigger value="poi" className="gap-2">
                  <Star className="w-4 h-4" />
                  Attractions
                </TabsTrigger>
              </TabsList>

              {/* Region Filter - Only show for Atolls tab */}
              {activeTab === 'atolls' && (
                <div className="flex flex-wrap gap-2">
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
              )}
            </div>

            {/* Atolls Tab */}
            <TabsContent value="atolls" className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold mb-2">
                  {selectedRegion === 'All' ? 'All Atolls' : `${selectedRegion} Region Atolls`}
                </h2>
                <p className="text-muted-foreground">
                  {filteredAtolls.length} atoll{filteredAtolls.length !== 1 ? 's' : ''} found
                </p>
              </div>

              {filteredAtolls.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredAtolls.map((atoll: AtollData) => (
                    <Link key={atoll.id} href={`/explore-maldives/atoll/${atoll.slug}`}>
                      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer h-full flex flex-col group">
                        {/* Hero Image */}
                        <div className="h-48 bg-gradient-to-br from-primary/40 to-accent/40 overflow-hidden relative">
                          {atoll.heroImage ? (
                            <img
                              src={atoll.heroImage}
                              alt={atoll.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Waves className="w-12 h-12 text-accent/50" />
                            </div>
                          )}
                          <Badge className="absolute top-4 right-4 bg-accent text-accent-foreground">
                            {atoll.region}
                          </Badge>
                        </div>

                        {/* Content */}
                        <CardContent className="flex-1 flex flex-col p-6">
                          <h3 className="text-xl font-bold mb-2 group-hover:text-accent transition-colors">
                            {atoll.name}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">
                            {atoll.description || 'Discover this beautiful atoll in the Maldives.'}
                          </p>

                          {atoll.bestFor && (
                            <div className="flex flex-wrap gap-1 mb-4">
                              {atoll.bestFor.split(',').slice(0, 2).map((tag, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  {tag.trim()}
                                </Badge>
                              ))}
                            </div>
                          )}

                          <Button variant="outline" className="w-full gap-2 group/btn">
                            Explore Atoll
                            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                          </Button>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg text-muted-foreground">
                    No atolls found matching your search.
                  </p>
                </div>
              )}
            </TabsContent>

            {/* Islands Tab */}
            <TabsContent value="islands" className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold mb-2">Featured Islands</h2>
                <p className="text-muted-foreground">
                  {filteredIslands.length} island{filteredIslands.length !== 1 ? 's' : ''} found
                </p>
              </div>

              {filteredIslands.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredIslands.map((island: IslandGuideData) => (
                    <Link key={island.id} href={`/island/${island.slug}`}>
                      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer h-full flex flex-col group">
                        {/* Hero Image */}
                        <div className="h-48 bg-gradient-to-br from-accent/40 to-primary/40 overflow-hidden relative flex items-center justify-center">
                          {island.heroImage ? (
                            <img
                              src={island.heroImage}
                              alt={island.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          ) : (
                            <div className="text-center">
                              <MapPin className="w-12 h-12 text-accent mx-auto mb-2 group-hover:scale-110 transition-transform" />
                              <p className="text-sm text-primary-foreground/80 font-semibold">Island Guide</p>
                            </div>
                          )}

                          {island.atoll && (
                            <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground">
                              {island.atoll}
                            </Badge>
                          )}
                        </div>

                        {/* Content */}
                        <CardContent className="flex-1 flex flex-col p-6">
                          <h3 className="text-xl font-bold mb-2 group-hover:text-accent transition-colors">
                            {island.name}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-4 line-clamp-3 flex-1">
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
              ) : (
                <div className="text-center py-12">
                  <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg text-muted-foreground">
                    No islands found matching your search.
                  </p>
                </div>
              )}
            </TabsContent>

            {/* Points of Interest Tab */}
            <TabsContent value="poi" className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold mb-2">Attractions & Points of Interest</h2>
                <p className="text-muted-foreground">
                  {filteredPointsOfInterest.pois.length + filteredPointsOfInterest.spots.length} attraction{(filteredPointsOfInterest.pois.length + filteredPointsOfInterest.spots.length) !== 1 ? 's' : ''} found
                </p>
              </div>

              {(filteredPointsOfInterest.pois.length + filteredPointsOfInterest.spots.length) > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {/* Render POIs */}
                  {filteredPointsOfInterest.pois.map((poi: IslandGuideData) => (
                    <Link key={poi.id} href={`/island/${poi.slug}`}>
                      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer h-full flex flex-col group">
                        {/* Hero Image */}
                        <div className="h-48 bg-gradient-to-br from-accent/40 to-primary/40 overflow-hidden relative flex items-center justify-center">
                          {poi.heroImage ? (
                            <img
                              src={poi.heroImage}
                              alt={poi.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          ) : (
                            <div className="text-center">
                              <Star className="w-12 h-12 text-accent mx-auto mb-2 group-hover:scale-110 transition-transform" />
                              <p className="text-sm text-primary-foreground/80 font-semibold">Attraction</p>
                            </div>
                          )}

                          {poi.atoll && (
                            <Badge className="absolute top-4 right-4 bg-accent text-accent-foreground">
                              {poi.atoll}
                            </Badge>
                          )}
                        </div>

                        {/* Content */}
                        <CardContent className="flex-1 flex flex-col p-6">
                          <h3 className="text-xl font-bold mb-2 group-hover:text-accent transition-colors">
                            {poi.name}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-4 line-clamp-3 flex-1">
                            {poi.overview || 'Discover this amazing attraction in the Maldives.'}
                          </p>

                          <Button variant="outline" className="w-full gap-2 group/btn">
                            Learn More
                            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                          </Button>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}

                  {/* Render Activity Spots */}
                  {filteredPointsOfInterest.spots.map((spot: ActivitySpotData) => (
                    <Card key={spot.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col group">
                      {/* Hero Image */}
                      <div className="h-48 bg-gradient-to-br from-accent/40 to-primary/40 overflow-hidden relative flex items-center justify-center">
                        {spot.description ? (
                          <div className="w-full h-full bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center">
                            <Fish className="w-12 h-12 text-white mx-auto group-hover:scale-110 transition-transform" />
                          </div>
                        ) : (
                          <div className="text-center">
                            <Fish className="w-12 h-12 text-accent mx-auto mb-2 group-hover:scale-110 transition-transform" />
                            <p className="text-sm text-primary-foreground/80 font-semibold">Dive Site</p>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <CardContent className="flex-1 flex flex-col p-6">
                        <h3 className="text-xl font-bold mb-2 group-hover:text-accent transition-colors">
                          {spot.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {spot.spotType === 'dive_site' ? 'Dive Site' : spot.spotType === 'surf_spot' ? 'Surf Spot' : 'Snorkeling Spot'}
                        </p>
                        {spot.difficulty && (
                          <p className="text-xs text-accent font-semibold mb-4">
                            Difficulty: {spot.difficulty}
                          </p>
                        )}
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">
                          {spot.description || 'Explore this amazing dive site.'}
                        </p>

                        <Button variant="outline" className="w-full gap-2 group/btn">
                          Learn More
                          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Star className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg text-muted-foreground">
                    No attractions found matching your search.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Waves className="w-8 h-8 text-accent mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-lg mb-2">26 Atolls</h3>
                    <p className="text-sm text-muted-foreground">
                      Explore the natural atolls that make up the Maldives archipelago.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <MapPin className="w-8 h-8 text-accent mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-lg mb-2">1,190 Islands</h3>
                    <p className="text-sm text-muted-foreground">
                      Discover coral islands with pristine beaches and crystal-clear waters.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Fish className="w-8 h-8 text-accent mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-lg mb-2">World-Class Diving</h3>
                    <p className="text-sm text-muted-foreground">
                      Experience some of the best diving and snorkeling in the world.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
