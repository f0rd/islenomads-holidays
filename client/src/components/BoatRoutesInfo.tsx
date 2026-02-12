import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Ship, DollarSign, Users, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';

interface BoatRoute {
  id: number;
  name: string;
  type: 'speedboat' | 'ferry';
  fromLocation: string;
  toLocation: string;
  duration: string;
  distance: string;
  price: number;
  capacity: number;
}

interface BoatRoutesInfoProps {
  islandGuideId: number;
  islandName: string;
}

export default function BoatRoutesInfo({ islandGuideId, islandName }: BoatRoutesInfoProps) {
  const [boatRoutes, setBoatRoutes] = useState<BoatRoute[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBoatRoutes = async () => {
      try {
        const response = await fetch(`/api/boat-routes?islandGuideId=${islandGuideId}`);
        if (response.ok) {
          const data = await response.json();
          setBoatRoutes(data);
        }
      } catch (error) {
        console.error('Failed to fetch boat routes:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (islandGuideId) {
      fetchBoatRoutes();
    }
  }, [islandGuideId]);

  if (isLoading || boatRoutes.length === 0) {
    return null;
  }

  // Group routes by type
  const speedboatRoutes = boatRoutes.filter(r => r.type === 'speedboat');
  const ferryRoutes = boatRoutes.filter(r => r.type === 'ferry');

  const formatPrice = (priceInCents: number) => {
    return (priceInCents / 100).toFixed(2);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Ship className="w-5 h-5" />
          Boat Transportation to {islandName}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Speedboat Routes */}
        {speedboatRoutes.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-orange-600 flex items-center gap-2">
              <Ship className="w-5 h-5" />
              Speedboat
            </h3>
            {speedboatRoutes.map((route) => (
              <div key={route.id} className="border-l-4 border-orange-500 pl-4 bg-orange-50 p-4 rounded">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold text-gray-900">{route.fromLocation} → {route.toLocation}</p>
                    <p className="text-sm text-gray-600 mt-1">{route.distance}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-orange-600" />
                    <div>
                      <p className="text-xs text-gray-600">Duration</p>
                      <p className="font-semibold text-sm">{route.duration}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <div>
                      <p className="text-xs text-gray-600">Price</p>
                      <p className="font-semibold text-sm">${formatPrice(route.price)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-600" />
                    <div>
                      <p className="text-xs text-gray-600">Capacity</p>
                      <p className="font-semibold text-sm">{route.capacity} pax</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Ferry Routes */}
        {ferryRoutes.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-teal-600 flex items-center gap-2">
              <Ship className="w-5 h-5" />
              Ferry
            </h3>
            {ferryRoutes.map((route) => (
              <div key={route.id} className="border-l-4 border-teal-500 pl-4 bg-teal-50 p-4 rounded">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold text-gray-900">{route.fromLocation} → {route.toLocation}</p>
                    <p className="text-sm text-gray-600 mt-1">{route.distance}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-teal-600" />
                    <div>
                      <p className="text-xs text-gray-600">Duration</p>
                      <p className="font-semibold text-sm">{route.duration}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <div>
                      <p className="text-xs text-gray-600">Price</p>
                      <p className="font-semibold text-sm">${formatPrice(route.price)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-600" />
                    <div>
                      <p className="text-xs text-gray-600">Capacity</p>
                      <p className="font-semibold text-sm">{route.capacity} pax</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
