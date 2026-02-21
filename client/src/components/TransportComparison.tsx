import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, Waves, DollarSign, Users, AlertCircle, Zap } from 'lucide-react';

interface TransportOption {
  id: number;
  name: string;
  type: 'ferry' | 'speedboat';
  operator: string;
  vesselType: string;
  duration: string;
  price: number;
  capacity: number;
  description?: string;
  amenities?: string[];
  schedule?: string;
}

interface TransportComparisonProps {
  fromLocation: string;
  toLocation: string;
  options: TransportOption[];
}

export default function TransportComparison({
  fromLocation,
  toLocation,
  options,
}: TransportComparisonProps) {
  if (!options || options.length === 0) {
    return (
      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 text-amber-800">
            <AlertCircle className="h-5 w-5" />
            <p>No transport options available for this route.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const ferryOptions = options.filter((opt) => opt.type === 'ferry');
  const speedboatOptions = options.filter((opt) => opt.type === 'speedboat');

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-2xl font-bold">Transport Options</h3>
        <p className="text-muted-foreground">
          {fromLocation} → {toLocation}
        </p>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All Options</TabsTrigger>
          <TabsTrigger value="ferry">Public Ferry</TabsTrigger>
          <TabsTrigger value="speedboat">Speedboat</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {options.map((option) => (
            <TransportOptionCard key={option.id} option={option} />
          ))}
        </TabsContent>

        <TabsContent value="ferry" className="space-y-4">
          {ferryOptions.length > 0 ? (
            ferryOptions.map((option) => (
              <TransportOptionCard key={option.id} option={option} />
            ))
          ) : (
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground">No ferry options available.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="speedboat" className="space-y-4">
          {speedboatOptions.length > 0 ? (
            speedboatOptions.map((option) => (
              <TransportOptionCard key={option.id} option={option} />
            ))
          ) : (
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground">No speedboat options available.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function TransportOptionCard({ option }: { option: TransportOption }) {
  const isFerry = option.type === 'ferry';
  const isMTCC = option.operator?.toUpperCase() === 'MTCC';

  return (
    <Card className={isFerry ? 'border-blue-200 bg-blue-50' : 'border-cyan-200 bg-cyan-50'}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg">{option.name}</CardTitle>
              <Badge variant={isFerry ? 'secondary' : 'default'}>
                {isFerry ? '🚢 Ferry' : '⚡ Speedboat'}
              </Badge>
              {isMTCC && (
                <Badge variant="outline" className="bg-blue-100 text-blue-800">
                  MTCC Operated
                </Badge>
              )}
            </div>
            <CardDescription>{option.vesselType}</CardDescription>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">
              MVR {(option.price / 100).toFixed(0)}
            </div>
            <p className="text-sm text-muted-foreground">per person</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Key Details Grid */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Clock className="h-4 w-4 text-primary" />
              Duration
            </div>
            <p className="text-sm text-muted-foreground">{option.duration}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Users className="h-4 w-4 text-primary" />
              Capacity
            </div>
            <p className="text-sm text-muted-foreground">{option.capacity} passengers</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Waves className="h-4 w-4 text-primary" />
              Type
            </div>
            <p className="text-sm text-muted-foreground capitalize">{option.type}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm font-medium">
              <DollarSign className="h-4 w-4 text-primary" />
              Operator
            </div>
            <p className="text-sm text-muted-foreground">{option.operator || 'Private'}</p>
          </div>
        </div>

        {/* Description */}
        {option.description && (
          <div className="rounded-lg bg-white/50 p-3">
            <p className="text-sm text-muted-foreground">{option.description}</p>
          </div>
        )}

        {/* Special Notes for MTCC Ferry */}
        {isMTCC && isFerry && (
          <div className="space-y-2 rounded-lg border border-blue-300 bg-blue-100/50 p-3">
            <div className="flex items-start gap-2">
              <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-700" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-blue-900">Public Ferry (MTCC)</p>
                <p className="text-xs text-blue-800">
                  Operated by Maldives Transport and Contracting Company. Traditional wooden boats with
                  a slower but economical option. Great for experiencing local travel culture.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Amenities */}
        {option.amenities && option.amenities.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Amenities</p>
            <div className="flex flex-wrap gap-2">
              {option.amenities.map((amenity, idx) => (
                <Badge key={idx} variant="outline">
                  {amenity}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Schedule */}
        {option.schedule && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Schedule</p>
            <p className="text-sm text-muted-foreground">{option.schedule}</p>
          </div>
        )}

        {/* Comparison Highlight */}
        {isFerry ? (
          <div className="flex items-center gap-2 rounded-lg bg-blue-100 p-2">
            <Waves className="h-4 w-4 text-blue-700" />
            <p className="text-xs text-blue-900">
              <strong>Best for:</strong> Budget-conscious travelers & local experience
            </p>
          </div>
        ) : (
          <div className="flex items-center gap-2 rounded-lg bg-cyan-100 p-2">
            <Zap className="h-4 w-4 text-cyan-700" />
            <p className="text-xs text-cyan-900">
              <strong>Best for:</strong> Time-sensitive travelers & comfort
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
