import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, DollarSign, Users, Zap, AlertCircle } from 'lucide-react';

interface Experience {
  id: number;
  title: string;
  slug: string;
  shortIntro: string;
  description: string;
  durationMin: number;
  priceFromUsd: number;
  includes: string;
  excludes: string;
  requirements: string;
  published: number;
  featured: number;
}

interface ExcursionsInfoProps {
  excursions: Experience[];
  islandName: string;
}

export default function ExcursionsInfo({ excursions, islandName }: ExcursionsInfoProps) {
  if (!excursions || excursions.length === 0) {
    return (
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-accent" />
            Available Excursions
          </CardTitle>
          <CardDescription>
            Exciting activities and tours available from {islandName}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No excursions available at this time.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatDuration = (minutes: number): string => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const parseIncludes = (includes: string): string[] => {
    if (!includes) return [];
    return includes.split(',').map(item => item.trim());
  };

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-accent" />
          Available Excursions
        </CardTitle>
        <CardDescription>
          {excursions.length} exciting activities and tours available from {islandName}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {excursions.map((excursion) => (
            <div
              key={excursion.id}
              className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors"
            >
              {/* Header with title and featured badge */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{excursion.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{excursion.shortIntro}</p>
                </div>
                {excursion.featured ? (
                  <Badge className="ml-2 bg-accent text-accent-foreground">Featured</Badge>
                ) : null}
              </div>

              {/* Description */}
              <p className="text-sm text-foreground/80 mb-4">{excursion.description}</p>

              {/* Key details grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                {/* Duration */}
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-accent" />
                  <div>
                    <p className="text-xs text-muted-foreground">Duration</p>
                    <p className="text-sm font-medium">{formatDuration(excursion.durationMin)}</p>
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-accent" />
                  <div>
                    <p className="text-xs text-muted-foreground">From</p>
                    <p className="text-sm font-medium">${excursion.priceFromUsd.toFixed(2)}</p>
                  </div>
                </div>

                {/* Requirements if any */}
                {excursion.requirements && excursion.requirements !== 'None' ? (
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-accent" />
                    <div>
                      <p className="text-xs text-muted-foreground">Requirements</p>
                      <p className="text-sm font-medium truncate">{excursion.requirements}</p>
                    </div>
                  </div>
                ) : null}
              </div>

              {/* Includes */}
              {excursion.includes && (
                <div className="mb-4">
                  <p className="text-xs font-semibold text-foreground mb-2">Includes:</p>
                  <div className="flex flex-wrap gap-2">
                    {parseIncludes(excursion.includes).map((item, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Book button */}
              <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                Book Now
              </Button>
            </div>
          ))}
        </div>

        {/* Info note */}
        <div className="mt-6 p-4 bg-muted rounded-lg border border-border">
          <p className="text-xs text-muted-foreground">
            <strong>Note:</strong> Prices shown are starting rates per person. Actual pricing may vary based on group size, season, and specific requirements. Contact the tour operator for detailed pricing and availability.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
