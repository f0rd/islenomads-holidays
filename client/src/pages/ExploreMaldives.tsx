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
  Zap,
  Wind,
  Users,
  Star,
  X
} from 'lucide-react';
import { Link } from 'wouter';
import { trpc } from '@/lib/trpc';
import { getIslandGuideUrl } from '@shared/locations';

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

interface IslandWithSpots extends IslandGuideData {
  activitySpots: ActivitySpotData[];
}

export default function ExploreMaldives() {
  const [activeTab, setActiveTab] = useState<'atolls' | 'islands' | 'poi'>('atolls');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedActivities, setSelectedActivities] = useState<Set<string>>(new Set());

  // Fetch atolls
  const { data: atolls = [] } = trpc.atolls.list.useQuery();

  // Fetch island guides
  const { data: islands = [] } = trpc.islandGuides.list.useQuery();

  // Fetch islands with activity spots
  const { data: islandsWithSpots = [] } = trpc.islandGuides.listWithActivitySpots.useQuery();

  // Fetch activity spots
  const { data: activitySpots = [] } = trpc.activitySpots.list.useQuery();

  // Get unique regions from atolls
  const regions = useMemo(() => {
    const uniqueRegions = new Set(atolls.map((a: AtollData) => a.region));
    return ['All', ...Array.from(uniqueRegions)];
  }, [atolls]);

  // Get activity types available on islands
  const availableActivities = useMemo(() => {
    const activities = new Set<string>();
    islandsWithSpots.forEach((island: IslandWithSpots) => {
      island.activitySpots?.forEach((spot: ActivitySpotData) => {
        if (spot.spotType === 'dive_site') activities.add('diving');
        if (spot.spotType === 'snorkeling_spot') activities.add('snorkeling');
        if (spot.spotType === 'surf_spot') activities.add('surfing');
      });
    });
    return Array.from(activities).sort();
  }, [islandsWithSpots]);

  // Get activity counts
  const activityCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    islandsWithSpots.forEach((island: IslandWithSpots) => {
      island.activitySpots?.forEach((spot: ActivitySpotData) => {
        let activity = '';
        if (spot.spotType === 'dive_site') activity = 'diving';
        if (spot.spotType === 'snorkeling_spot') activity = 'snorkeling';
        if (spot.spotType === 'surf_spot') activity = 'surfing';
        if (activity) {
          counts[activity] = (counts[activity] || 0) + 1;
        }
      });
    });
    return counts;
  }, [islandsWithSpots]);

  // Filter and search atolls
  const filteredAtolls = useMemo(() => {
    return atolls.filter((atoll: AtollData) => {
      const matchesRegion = selectedRegion === 'All' || atoll.region === selectedRegion;
      const matchesSearch = atoll.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (atoll.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
      return matchesRegion && matchesSearch;
    });
  }, [atolls, selectedRegion, searchQuery]);

  // Filter and search islands with activity filtering
  const filteredIslands = useMemo(() => {
    return islandsWithSpots.filter((island: IslandWithSpots) => {
      const matchesSearch = island.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (island.overview?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
      const isPublished = island.published === 1;
      const isActualIsland = island.contentType !== 'point_of_interest';
      
      // Activity filtering
      let matchesActivities = true;
      if (selectedActivities.size > 0) {
        const islandActivityTypes = new Set<string>();
        island.activitySpots?.forEach((spot: ActivitySpotData) => {
          if (spot.spotType === 'dive_site') islandActivityTypes.add('diving');
          if (spot.spotType === 'snorkeling_spot') islandActivityTypes.add('snorkeling');
          if (spot.spotType === 'surf_spot') islandActivityTypes.add('surfing');
        });
        
        // Island must have at least one of the selected activities
        matchesActivities = Array.from(selectedActivities).some(activity => 
          islandActivityTypes.has(activity)
        );
      }
      
      return matchesSearch && isPublished && isActualIsland && matchesActivities;
    });
  }, [islandsWithSpots, searchQuery, selectedActivities]);

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

  const toggleActivity = (activity: string) => {
    const newActivities = new Set(selectedActivities);
    if (newActivities.has(activity)) {
      newActivities.delete(activity);
    } else {
      newActivities.add(activity);
    }
    setSelectedActivities(newActivities);
  };

  const getActivityIcon = (activity: string) => {
    switch (activity) {
      case 'diving':
        return <Fish className="w-4 h-4" />;
      case 'snorkeling':
        return <Zap className="w-4 h-4" />;
      case 'surfing':
        return <Wind className="w-4 h-4" />;
      default:
        return null;
    }
  };

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

              {/* Activity Filter - Only show for Islands tab */}
              {activeTab === 'islands' && availableActivities.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {availableActivities.map((activity) => (
                    <Button
                      key={activity}
                      variant={selectedActivities.has(activity) ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => toggleActivity(activity)}
                      className="rounded-full gap-2 capitalize"
                    >
                      {getActivityIcon(activity)}
                      {activity}
                      {activityCounts[activity] && (
                        <span className="text-xs opacity-75">({activityCounts[activity]})</span>
                      )}
                    </Button>
                  ))}
                  {selectedActivities.size > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedActivities(new Set())}
                      className="rounded-full gap-2"
                    >
                      <X className="w-4 h-4" />
                      Clear
                    </Button>
                  )}
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
                <h2 className="text-3xl font-bold mb-2">
                  {selectedActivities.size > 0 
                    ? `Islands with ${Array.from(selectedActivities).join(', ')}`
                    : 'Featured Islands'
                  }
                </h2>
                <p className="text-muted-foreground">
                  {filteredIslands.length} island{filteredIslands.length !== 1 ? 's' : ''} found
                </p>
              </div>

              {filteredIslands.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredIslands.map((island: IslandWithSpots) => (
                    <Link key={island.id} href={getIslandGuideUrl(island.slug || island.id)}>
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

                          {/* Activity Badges */}
                          {island.activitySpots && island.activitySpots.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-4">
                              {Array.from(new Set(
                                island.activitySpots.map(spot => {
                                  if (spot.spotType === 'dive_site') return 'diving';
                                  if (spot.spotType === 'snorkeling_spot') return 'snorkeling';
                                  if (spot.spotType === 'surf_spot') return 'surfing';
                                  return '';
                                }).filter(Boolean)
                              )).map((activity) => (
                                <Badge key={activity} variant="secondary" className="text-xs capitalize gap-1">
                                  {getActivityIcon(activity)}
                                  {activity}
                                </Badge>
                              ))}
                            </div>
                          )}

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
                    {selectedActivities.size > 0 
                      ? `No islands found with ${Array.from(selectedActivities).join(', ')}.`
                      : 'No islands found matching your search.'
                    }
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
                    <Link key={poi.id} href={getIslandGuideUrl((poi as any).slug || poi.id)}>
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
                              <p className="text-sm text-primary-foreground/80 font-semibold">Point of Interest</p>
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <CardContent className="flex-1 flex flex-col p-6">
                          <h3 className="text-xl font-bold mb-2 group-hover:text-accent transition-colors">
                            {poi.name}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-4 line-clamp-3 flex-1">
                            {poi.overview || 'Discover this amazing point of interest.'}
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
                        <div className="text-center">
                          {spot.spotType === 'dive_site' && <Fish className="w-12 h-12 text-accent mx-auto mb-2 group-hover:scale-110 transition-transform" />}
                          {spot.spotType === 'snorkeling_spot' && <Zap className="w-12 h-12 text-accent mx-auto mb-2 group-hover:scale-110 transition-transform" />}
                          {spot.spotType === 'surf_spot' && <Wind className="w-12 h-12 text-accent mx-auto mb-2 group-hover:scale-110 transition-transform" />}
                          <p className="text-sm text-primary-foreground/80 font-semibold capitalize">{spot.spotType.replace('_', ' ')}</p>
                        </div>
                        {spot.difficulty && (
                          <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground capitalize">
                            {spot.difficulty}
                          </Badge>
                        )}
                      </div>

                      {/* Content */}
                      <CardContent className="flex-1 flex flex-col p-6">
                        <h3 className="text-xl font-bold mb-2 group-hover:text-accent transition-colors">
                          {spot.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-3 flex-1">
                          {spot.description || 'Discover this amazing activity spot.'}
                        </p>

                        {spot.bestSeason && (
                          <Badge variant="secondary" className="mb-4 w-fit text-xs">
                            Best: {spot.bestSeason}
                          </Badge>
                        )}
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

      <Footer />
    </div>
  );
}
