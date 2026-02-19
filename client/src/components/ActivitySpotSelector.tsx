import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Trash2, Loader2, Filter } from 'lucide-react';
import { trpc } from '@/lib/trpc';

interface ActivitySpot {
  id?: number;
  name: string;
  slug?: string;
  spotType: 'surf_spot' | 'dive_site' | 'snorkeling_spot';
  difficulty?: string;
  description?: string;
  bestSeason?: string;
  maxDepth?: number;
  minDepth?: number;
  [key: string]: any;
}

interface ActivitySpotSelectorProps {
  islandGuideId: number;
  selectedSpots: ActivitySpot[];
  onSpotsChange: (spots: ActivitySpot[]) => void;
}

const spotTypeLabels = {
  dive_site: '🤿 Dive Sites',
  snorkeling_spot: '🏊 Snorkeling Spots',
  surf_spot: '🏄 Surf Spots',
};

const difficultyColors = {
  beginner: 'bg-green-100 text-green-800',
  intermediate: 'bg-yellow-100 text-yellow-800',
  advanced: 'bg-red-100 text-red-800',
};

export function ActivitySpotSelector({
  islandGuideId,
  selectedSpots,
  onSpotsChange,
}: ActivitySpotSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'dive_site' | 'snorkeling_spot' | 'surf_spot'>('all');
  const [isExpanded, setIsExpanded] = useState(false);

  // Fetch all activity spots for this island
  const { data: availableSpots = [], isLoading } = trpc.activitySpots.forIslandSelector.useQuery(
    { islandGuideId },
    { enabled: isExpanded }
  );

  // Filter spots based on search and type
  const filteredSpots = useMemo(() => {
    return availableSpots.filter((spot: any) => {
      const matchesSearch =
        spot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        spot.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (spot.description && spot.description.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesType = selectedType === 'all' || spot.spotType === selectedType;

      // Exclude already selected spots
      const isNotSelected = !selectedSpots.some((s) => s.id === spot.id);

      return matchesSearch && matchesType && isNotSelected;
    });
  }, [availableSpots, searchTerm, selectedType, selectedSpots]);

  const handleAddSpot = (spot: any) => {
    onSpotsChange([...selectedSpots, spot]);
  };

  const handleRemoveSpot = (spotId: number) => {
    onSpotsChange(selectedSpots.filter((s) => s.id !== spotId));
  };

  // Group selected spots by type
  const spotsByType = useMemo(() => {
    const grouped: Record<string, ActivitySpot[]> = {
      dive_site: [],
      snorkeling_spot: [],
      surf_spot: [],
    };
    selectedSpots.forEach((spot) => {
      grouped[spot.spotType].push(spot);
    });
    return grouped;
  }, [selectedSpots]);

  return (
    <Card>
      <CardHeader className="cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Link Activity Spots</CardTitle>
            <CardDescription>
              Connect dive sites, snorkeling spots, and surf breaks to this island guide
            </CardDescription>
          </div>
          <Badge variant="secondary" className="text-lg">
            {selectedSpots.length}
          </Badge>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-4">
          {/* Selected Spots Display */}
          {selectedSpots.length > 0 && (
            <div className="space-y-3">
              <Label className="text-sm font-semibold">Selected Activity Spots</Label>
              {Object.entries(spotsByType).map(([type, spots]) =>
                spots.length > 0 ? (
                  <div key={type} className="space-y-2">
                    <h4 className="text-xs font-medium text-muted-foreground uppercase">
                      {spotTypeLabels[type as keyof typeof spotTypeLabels]}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {spots.map((spot) => (
                        <div
                          key={spot.id}
                          className="flex items-start justify-between p-2 bg-muted rounded-lg border border-border"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{spot.name}</p>
                            <div className="flex gap-1 flex-wrap mt-1">
                              {spot.difficulty && (
                                <Badge
                                  variant="outline"
                                  className={`text-xs ${
                                    difficultyColors[spot.difficulty as keyof typeof difficultyColors]
                                  }`}
                                >
                                  {spot.difficulty}
                                </Badge>
                              )}
                              {spot.bestSeason && (
                                <Badge variant="outline" className="text-xs">
                                  {spot.bestSeason}
                                </Badge>
                              )}
                            </div>
                            {spot.description && (
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                {spot.description}
                              </p>
                            )}
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleRemoveSpot(spot.id!)}
                            className="ml-2 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null
              )}
            </div>
          )}

          {/* Search & Filter Section */}
          <div className="space-y-3 pt-4 border-t">
            <Label className="text-sm font-semibold">Add More Activity Spots</Label>

            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Type Filter */}
            <div className="flex gap-2 flex-wrap">
              <Button
                size="sm"
                variant={selectedType === 'all' ? 'default' : 'outline'}
                onClick={() => setSelectedType('all')}
                className="text-xs"
              >
                <Filter className="w-3 h-3 mr-1" />
                All Types
              </Button>
              {Object.entries(spotTypeLabels).map(([type, label]) => (
                <Button
                  key={type}
                  size="sm"
                  variant={selectedType === type ? 'default' : 'outline'}
                  onClick={() => setSelectedType(type as any)}
                  className="text-xs"
                >
                  {label}
                </Button>
              ))}
            </div>

            {/* Available Spots List */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                </div>
              ) : filteredSpots.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  {availableSpots.length === 0 ? (
                    <p className="text-sm">
                      No activity spots found for this island. Create some in the Activity Spots CMS first.
                    </p>
                  ) : (
                    <p className="text-sm">No spots match your search criteria.</p>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredSpots.map((spot: any) => (
                    <div
                      key={spot.id}
                      className="flex items-start justify-between p-3 bg-background border border-border rounded-lg hover:bg-muted transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm">{spot.name}</p>
                          <Badge variant="outline" className="text-xs">
                            {spotTypeLabels[spot.spotType as keyof typeof spotTypeLabels]}
                          </Badge>
                        </div>
                        {spot.difficulty && (
                          <div className="flex gap-1 mt-1">
                            <Badge
                              variant="outline"
                              className={`text-xs ${
                                difficultyColors[spot.difficulty as keyof typeof difficultyColors]
                              }`}
                            >
                              {spot.difficulty}
                            </Badge>
                            {spot.bestSeason && (
                              <Badge variant="outline" className="text-xs">
                                Best: {spot.bestSeason}
                              </Badge>
                            )}
                          </div>
                        )}
                        {spot.description && (
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {spot.description}
                          </p>
                        )}
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleAddSpot(spot)}
                        className="ml-2"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
