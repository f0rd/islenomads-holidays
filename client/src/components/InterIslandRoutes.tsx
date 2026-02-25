import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Waves, DollarSign, Users, AlertCircle } from 'lucide-react';

interface BoatRoute {
  id: number;
  name: string;
  type: 'ferry' | 'speedboat';
  fromLocation: string;
  toLocation: string;
  duration: string;
  price: number;
  capacity: number;
  description?: string | null;
  amenities?: string | null;
  boatInfo?: string | null;
  schedule?: string | null;
}

interface InterIslandRoutesProps {
  islandName: string;
  outgoingRoutes: BoatRoute[];
  incomingRoutes: BoatRoute[];
}

export default function InterIslandRoutes({
  islandName,
  outgoingRoutes = [],
  incomingRoutes = [],
}: InterIslandRoutesProps) {
  const allRoutes = [...outgoingRoutes, ...incomingRoutes];

  if (!allRoutes || allRoutes.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 text-muted-foreground">
            <AlertCircle className="h-5 w-5" />
            <p>No inter-island routes available from {islandName}.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const ferryRoutes = allRoutes.filter((route) => route.type === 'ferry');
  const speedboatRoutes = allRoutes.filter((route) => route.type === 'speedboat');

  const RouteCard = ({ route }: { route: BoatRoute }) => {
    const isOutgoing = route.fromLocation === islandName;
    const destination = isOutgoing ? route.toLocation : route.fromLocation;
    
    return (
      <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h4 className="font-semibold text-sm">
              {islandName} → {destination}
            </h4>
            <p className="text-xs text-muted-foreground mt-1">{route.name}</p>
          </div>
          <Badge variant={route.type === 'ferry' ? 'default' : 'secondary'}>
            {route.type === 'ferry' ? 'Ferry' : 'Speedboat'}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{route.duration}</span>
          </div>

          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>{route.capacity} passengers</span>
          </div>
          <div className="flex items-center gap-2">
            <Waves className="h-4 w-4 text-muted-foreground" />
            <span>{route.type}</span>
          </div>
        </div>

        {route.description && (
          <p className="text-xs text-muted-foreground mt-3">{route.description}</p>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold mb-4">Inter-Island Routes from {islandName}</h3>
        <p className="text-muted-foreground mb-4">
          Explore ferry and speedboat options to reach nearby islands for island hopping adventures.
        </p>
      </div>

      {ferryRoutes.length > 0 && (
        <div>
          <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Waves className="h-5 w-5" />
            Public Ferries
          </h4>
          <div className="grid md:grid-cols-2 gap-4">
            {ferryRoutes.map((route) => (
              <RouteCard key={route.id} route={route} />
            ))}
          </div>
        </div>
      )}

      {speedboatRoutes.length > 0 && (
        <div>
          <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Waves className="h-5 w-5 text-accent" />
            Speedboat Services
          </h4>
          <div className="grid md:grid-cols-2 gap-4">
            {speedboatRoutes.map((route) => (
              <RouteCard key={route.id} route={route} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
