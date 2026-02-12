import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Waves, MapPin, Zap, Droplet, Wind } from 'lucide-react';
import { useState } from 'react';

interface ActivitySpot {
  id: number;
  name: string;
  spotType: 'dive_site' | 'surf_spot' | 'snorkeling_spot';
  difficulty?: string;
  description?: string;
  bestSeason?: string;
  bestTime?: string;
  maxDepth?: number;
  minDepth?: number;
  waveHeight?: string;
  coralCoverage?: string;
  fishSpecies?: string;
  marineLife?: string;
  latitude?: string | number;
  longitude?: string | number;
  distance?: number;
  isNearby?: boolean;
}

interface WaterActivitiesSectionProps {
  linkedSpots: ActivitySpot[];
  nearbySpots: ActivitySpot[];
  islandLatitude?: string;
  islandLongitude?: string;
}

export default function WaterActivitiesSection({
  linkedSpots,
  nearbySpots,
  islandLatitude,
  islandLongitude,
}: WaterActivitiesSectionProps) {
  const [selectedActivityType, setSelectedActivityType] = useState<string | null>(null);

  // Calculate distance between two coordinates (Haversine formula)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c * 10) / 10;
  };

  // Enrich spots with distance if coordinates available
  const enrichedLinkedSpots = linkedSpots.map(spot => ({
    ...spot,
    isNearby: false,
  }));

  const enrichedNearbySpots = nearbySpots.map(spot => {
    let distance = undefined;
    if (islandLatitude && islandLongitude && spot.latitude && spot.longitude) {
      try {
        distance = calculateDistance(
          parseFloat(islandLatitude),
          parseFloat(islandLongitude),
          parseFloat(String(spot.latitude)),
          parseFloat(String(spot.longitude))
        );
      } catch (e) {
        // Silently fail if coordinates can't be parsed
      }
    }
    return {
      ...spot,
      distance,
      isNearby: true,
    };
  });

  // Combine and sort by type then distance
  const allSpots = [...enrichedLinkedSpots, ...enrichedNearbySpots];
  
  // Group by activity type
  const diveSpots = allSpots.filter(s => s.spotType === 'dive_site');
  const snorkelSpots = allSpots.filter(s => s.spotType === 'snorkeling_spot');
  const surfSpots = allSpots.filter(s => s.spotType === 'surf_spot');

  // Filter based on selected activity type
  const filteredDiveSpots = !selectedActivityType || selectedActivityType === 'dive' ? diveSpots : [];
  const filteredSnorkelSpots = !selectedActivityType || selectedActivityType === 'snorkel' ? snorkelSpots : [];
  const filteredSurfSpots = !selectedActivityType || selectedActivityType === 'surf' ? surfSpots : [];

  const hasAnySpots = allSpots.length > 0;

  if (!hasAnySpots) {
    return null;
  }

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty?.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const ActivityCard = ({ spot }: { spot: ActivitySpot }) => (
    <div
      className={`rounded-lg border-2 p-4 transition-all ${
        spot.isNearby
          ? 'border-green-300 bg-green-50 hover:shadow-md'
          : 'border-blue-300 bg-blue-50 hover:shadow-md'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h5 className="font-semibold text-gray-900 text-base">{spot.name}</h5>
          {spot.distance !== undefined && (
            <p className="text-xs text-gray-600 flex items-center gap-1 mt-1">
              <MapPin className="w-3 h-3" />
              {spot.distance} km away
            </p>
          )}
        </div>
        <div className="flex gap-2 flex-wrap justify-end">
          <Badge className="text-xs font-medium">
            {spot.spotType === 'dive_site' ? '🤿 Dive' : spot.spotType === 'surf_spot' ? '🏄 Surf' : '🤽 Snorkel'}
          </Badge>
          {spot.difficulty && (
            <Badge className={`text-xs font-medium ${getDifficultyColor(spot.difficulty)}`}>
              {spot.difficulty.charAt(0).toUpperCase() + spot.difficulty.slice(1)}
            </Badge>
          )}
          {spot.isNearby && (
            <Badge className="text-xs bg-green-600 text-white">Nearby</Badge>
          )}
        </div>
      </div>

      {spot.description && (
        <p className="text-sm text-gray-700 mb-3">{spot.description}</p>
      )}

      {/* Activity-specific details */}
      <div className="space-y-2 text-xs text-gray-600">
        {spot.spotType === 'dive_site' && (
          <>
            {spot.maxDepth && spot.minDepth && (
              <div className="flex items-center gap-2">
                <Droplet className="w-3 h-3" />
                <span>Depth: {spot.minDepth}m - {spot.maxDepth}m</span>
              </div>
            )}
            {spot.marineLife && (
              <div className="flex items-start gap-2">
                <Zap className="w-3 h-3 mt-0.5 flex-shrink-0" />
                <span>Marine Life: {typeof spot.marineLife === 'string' ? spot.marineLife : JSON.stringify(spot.marineLife)}</span>
              </div>
            )}
          </>
        )}

        {spot.spotType === 'snorkeling_spot' && (
          <>
            {spot.coralCoverage && (
              <div className="flex items-center gap-2">
                <Zap className="w-3 h-3" />
                <span>Coral Coverage: {spot.coralCoverage}</span>
              </div>
            )}
            {spot.fishSpecies && (
              <div className="flex items-start gap-2">
                <Droplet className="w-3 h-3 mt-0.5 flex-shrink-0" />
                <span>Fish Species: {typeof spot.fishSpecies === 'string' ? spot.fishSpecies : JSON.stringify(spot.fishSpecies)}</span>
              </div>
            )}
          </>
        )}

        {spot.spotType === 'surf_spot' && (
          <>
            {spot.waveHeight && (
              <div className="flex items-center gap-2">
                <Wind className="w-3 h-3" />
                <span>Wave Height: {spot.waveHeight}</span>
              </div>
            )}
          </>
        )}

        {spot.bestSeason && (
          <div className="flex items-center gap-2">
            <Zap className="w-3 h-3" />
            <span>Best Season: {spot.bestSeason}</span>
          </div>
        )}

        {spot.bestTime && (
          <div className="flex items-center gap-2">
            <Zap className="w-3 h-3" />
            <span>Best Time: {spot.bestTime}</span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Waves className="w-5 h-5" />
          Water Activities
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Activity Type Filters */}
        {allSpots.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setSelectedActivityType(null)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                selectedActivityType === null
                  ? 'bg-primary text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All ({allSpots.length})
            </button>
            {diveSpots.length > 0 && (
              <button
                onClick={() => setSelectedActivityType('dive')}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                  selectedActivityType === 'dive'
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                }`}
              >
                🤿 Diving ({diveSpots.length})
              </button>
            )}
            {snorkelSpots.length > 0 && (
              <button
                onClick={() => setSelectedActivityType('snorkel')}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                  selectedActivityType === 'snorkel'
                    ? 'bg-cyan-600 text-white'
                    : 'bg-cyan-100 text-cyan-700 hover:bg-cyan-200'
                }`}
              >
                🤽 Snorkeling ({snorkelSpots.length})
              </button>
            )}
            {surfSpots.length > 0 && (
              <button
                onClick={() => setSelectedActivityType('surf')}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                  selectedActivityType === 'surf'
                    ? 'bg-orange-600 text-white'
                    : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                }`}
              >
                🏄 Surfing ({surfSpots.length})
              </button>
            )}
          </div>
        )}

        {/* Diving Activities */}
        {filteredDiveSpots.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              🤿 Diving Opportunities
              {filteredDiveSpots.filter(s => !s.isNearby).length > 0 && (
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                  {filteredDiveSpots.filter(s => !s.isNearby).length} nearby
                </span>
              )}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredDiveSpots.map(spot => (
                <ActivityCard key={`${spot.isNearby ? 'nearby' : 'linked'}-${spot.id}`} spot={spot} />
              ))}
            </div>
          </div>
        )}

        {/* Snorkeling Activities */}
        {filteredSnorkelSpots.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              🤽 Snorkeling Opportunities
              {filteredSnorkelSpots.filter(s => !s.isNearby).length > 0 && (
                <span className="text-xs bg-cyan-100 text-cyan-700 px-2 py-1 rounded-full">
                  {filteredSnorkelSpots.filter(s => !s.isNearby).length} nearby
                </span>
              )}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredSnorkelSpots.map(spot => (
                <ActivityCard key={`${spot.isNearby ? 'nearby' : 'linked'}-${spot.id}`} spot={spot} />
              ))}
            </div>
          </div>
        )}

        {/* Surfing Activities */}
        {filteredSurfSpots.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              🏄 Surfing Opportunities
              {filteredSurfSpots.filter(s => !s.isNearby).length > 0 && (
                <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                  {filteredSurfSpots.filter(s => !s.isNearby).length} nearby
                </span>
              )}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredSurfSpots.map(spot => (
                <ActivityCard key={`${spot.isNearby ? 'nearby' : 'linked'}-${spot.id}`} spot={spot} />
              ))}
            </div>
          </div>
        )}

        {/* Info about nearby vs linked */}
        <div className="mt-6 pt-4 border-t space-y-2 text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-blue-300 bg-blue-50 rounded"></div>
            <span><strong>Blue cards:</strong> Directly linked to this island</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-green-300 bg-green-50 rounded"></div>
            <span><strong>Green cards:</strong> Nearby activities within 10 km</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
