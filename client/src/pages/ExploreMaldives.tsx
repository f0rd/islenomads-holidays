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
import { useMemo, useState } from 'react';

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
  poiType?: 'thila' | 'reef' | 'channel' | 'dive_site' | 'attraction' | 'landmark' | null;
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
  const [activeTab, setActiveTab] = useState<'atolls' | 'islands' | 'poi' | 'dive-sites'>('atolls');
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

  // Filter and search points of interest (POIs only, excluding dive sites)
  const filteredPointsOfInterest = useMemo(() => {
    const pois = islands.filter((island: IslandGuideData) => {
      const matchesSearch = island.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (island.overview?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
      const isPublished = island.published === 1;
      const isPOI = island.contentType === 'point_of_interest';
      // Exclude dive sites and thilas from general POI tab
      const isDiveSite = island.poiType === 'dive_site' || island.poiType === 'thila';
      return matchesSearch && isPublished && isPOI && !isDiveSite;
    });
    return { pois };
  }, [islands, searchQuery]);

  // Filter and search dive sites (thilas and dive sites)
  const filteredDiveSites = useMemo(() => {
    const diveSites = islands.filter((island: IslandGuideData) => {
      const matchesSearch = island.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (island.overview?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
      const isPublished = island.published === 1;
      const isPOI = island.contentType === 'point_of_interest';
      // Include only dive sites and thilas
      const isDiveSite = island.poiType === 'dive_site' || island.poiType === 'thila';
      return matchesSearch && isPublished && isPOI && isDiveSite;
    });
    return { diveSites };
  }, [islands, searchQuery]);

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
        <div className="absolute inset-0 opacity-10"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-accent rounded-full blur-3xl" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent rounded-full blur-3xl" />

        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">Explore the Maldives</h1>
            <p className="text-lg md:text-xl text-primary-foreground/90 mb-8">
              Discover pristine atolls, beautiful islands, and world-class dive sites. Browse by region or search for your perfect destination.
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
                  {filteredAtolls.length + filteredIslands.length + filteredPointsOfInterest.pois.length + filteredDiveSites.diveSites.length} results found
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 md:py-24">
        <div className="container">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'atolls' | 'islands' | 'poi' | 'dive-sites')} className="w-full">
            {/* Tab Navigation */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12">
              <TabsList className="grid w-full md:w-auto grid-cols-4">
                <TabsTrigger value="atolls" className="gap-2">
                  <Waves className="w-4 h-4" />
                  Atolls
                </TabsTrigger>
                <TabsTrigger value="islands" className="gap-2">
                  <MapPin className="w-4 h-4" />
                  Islands
                </TabsTrigger>
                <TabsTrigger value="dive-sites" className="gap-2">
                  <Fish className="w-4 h-4" />
                  Dive Sites
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
                        <CardContent className="flex-1 flex flex-col p-6">
                          <h3 className="text-xl font-bold mb-2 group-hover:text-accent transition-colors">
                            {atoll.name}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-4 flex-1">
                            {atoll.description}
                          </p>
                          <Button variant="ghost" className="w-full justify-between group/btn">
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
                  <p className="text-muted-foreground">No atolls found matching your search.</p>
                </div>
              )}
            </TabsContent>

            {/* Islands Tab */}
            <TabsContent value="islands" className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold mb-2">All Islands</h2>
                <p className="text-muted-foreground">
                  {filteredIslands.length} island{filteredIslands.length !== 1 ? 's' : ''} found
                </p>
              </div>

              {filteredIslands.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredIslands.map((island: IslandWithSpots) => (
                    <Link key={island.id} href={getIslandGuideUrl(island as any)}>
                      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer h-full flex flex-col group">
                        <div className="h-48 bg-gradient-to-br from-primary/40 to-accent/40 overflow-hidden relative">
                          {island.heroImage ? (
                            <img
                              src={island.heroImage}
                              alt={island.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <MapPin className="w-12 h-12 text-accent/50" />
                            </div>
                          )}
                        </div>
                        <CardContent className="flex-1 flex flex-col p-6">
                          <h3 className="text-xl font-bold mb-1 group-hover:text-accent transition-colors">
                            {island.name}
                          </h3>
                          {island.atoll && (
                            <p className="text-xs text-muted-foreground mb-3">{island.atoll}</p>
                          )}
                          <p className="text-sm text-muted-foreground mb-4 flex-1 line-clamp-2">
                            {island.overview}
                          </p>
                          {island.activitySpots && island.activitySpots.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-4">
                              {Array.from(new Set(island.activitySpots.map((s) => s.spotType))).map((type) => (
                                <Badge key={type} variant="secondary" className="text-xs">
                                  {type === 'dive_site' ? 'Diving' : type === 'snorkeling_spot' ? 'Snorkeling' : 'Surfing'}
                                </Badge>
                              ))}
                            </div>
                          )}
                          <Button variant="ghost" className="w-full justify-between group/btn">
                            Learn More
                            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                          </Button>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No islands found matching your search.</p>
                </div>
              )}
            </TabsContent>

            {/* Dive Sites Tab */}
            <TabsContent value="dive-sites" className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold mb-2">Dive Sites & Thilas</h2>
                <p className="text-muted-foreground">
                  {filteredDiveSites.diveSites.length} dive site{filteredDiveSites.diveSites.length !== 1 ? 's' : ''} found
                </p>
              </div>

              {filteredDiveSites.diveSites.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredDiveSites.diveSites.map((site: IslandGuideData) => (
                    <Link key={site.id} href={`/poi/${site.id}`}>
                      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer h-full flex flex-col group">
                        <div className="h-48 bg-gradient-to-br from-primary/40 to-accent/40 overflow-hidden relative">
                          {site.heroImage ? (
                            <img
                              src={site.heroImage}
                              alt={site.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Fish className="w-12 h-12 text-accent/50" />
                            </div>
                          )}
                          <Badge className="absolute top-4 right-4 bg-accent text-accent-foreground capitalize">
                            {site.poiType || 'Dive Site'}
                          </Badge>
                        </div>
                        <CardContent className="flex-1 flex flex-col p-6">
                          <h3 className="text-xl font-bold mb-1 group-hover:text-accent transition-colors">
                            {site.name}
                          </h3>
                          {site.atoll && (
                            <p className="text-xs text-muted-foreground mb-3">{site.atoll}</p>
                          )}
                          <p className="text-sm text-muted-foreground mb-4 flex-1 line-clamp-2">
                            {site.overview}
                          </p>
                          <Button variant="ghost" className="w-full justify-between group/btn">
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
                  <p className="text-muted-foreground">No dive sites found matching your search.</p>
                </div>
              )}
            </TabsContent>

            {/* Attractions Tab */}
            <TabsContent value="poi" className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold mb-2">Attractions & Points of Interest</h2>
                <p className="text-muted-foreground">
                  {filteredPointsOfInterest.pois.length} attraction{filteredPointsOfInterest.pois.length !== 1 ? 's' : ''} found
                </p>
              </div>

              {filteredPointsOfInterest.pois.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredPointsOfInterest.pois.map((poi: IslandGuideData) => (
                    <Link key={poi.id} href={`/poi/${poi.id}`}>
                      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer h-full flex flex-col group">
                        <div className="h-48 bg-gradient-to-br from-primary/40 to-accent/40 overflow-hidden relative">
                          {poi.heroImage ? (
                            <img
                              src={poi.heroImage}
                              alt={poi.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Star className="w-12 h-12 text-accent/50" />
                            </div>
                          )}
                          <Badge className="absolute top-4 right-4 bg-accent text-accent-foreground">
                            Point of Interest
                          </Badge>
                        </div>
                        <CardContent className="flex-1 flex flex-col p-6">
                          <h3 className="text-xl font-bold mb-1 group-hover:text-accent transition-colors">
                            {poi.name}
                          </h3>
                          {poi.atoll && (
                            <p className="text-xs text-muted-foreground mb-3">{poi.atoll}</p>
                          )}
                          <p className="text-sm text-muted-foreground mb-4 flex-1 line-clamp-2">
                            {poi.overview}
                          </p>
                          <Button variant="ghost" className="w-full justify-between group/btn">
                            Learn More
                            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                          </Button>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No attractions found matching your search.</p>
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
