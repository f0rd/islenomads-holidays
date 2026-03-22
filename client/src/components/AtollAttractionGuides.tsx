import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Fish, Wind, Zap, ArrowRight } from 'lucide-react';
import { Link } from 'wouter';
import { trpc } from '@/lib/trpc';
import { getAttractionGuideUrl } from '@/const';

interface AtollAttractionGuidesProps {
  atollId: number;
  atollName: string;
}

export function AtollAttractionGuides({ atollId, atollName }: AtollAttractionGuidesProps) {
  const [activeTab, setActiveTab] = useState<'dives' | 'surfs' | 'snorkeling'>('dives');

  // Fetch attraction guides grouped by type
  const { data: guides, isLoading } = trpc.attractionGuides.getByAtollGrouped.useQuery(
    { atollId },
    { enabled: !!atollId }
  );

  const diveGuides = useMemo(() => guides?.dives || [], [guides]);
  const surfGuides = useMemo(() => guides?.surfs || [], [guides]);
  const snorkelingGuides = useMemo(() => guides?.snorkeling || [], [guides]);

  const hasContent = diveGuides.length > 0 || surfGuides.length > 0 || snorkelingGuides.length > 0;

  if (isLoading) {
    return (
      <div className="py-12">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!hasContent) {
    return null;
  }

  const renderGuideCard = (guide: any) => {
    const attractionType = guide.attraction_guides?.attractionType || guide.attractionType;
    const name = guide.attraction_guides?.name || guide.name;
    const slug = guide.attraction_guides?.slug || guide.slug;
    const overview = guide.attraction_guides?.overview || guide.overview;
    const difficulty = guide.attraction_guides?.difficulty || guide.difficulty;
    const heroImage = guide.attraction_guides?.heroImage || guide.heroImage;

    return (
      <Link key={slug} href={getAttractionGuideUrl(slug)}>
        <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer h-full flex flex-col group">
          {/* Hero Image */}
          <div className="h-48 bg-gradient-to-br from-accent/40 to-primary/40 overflow-hidden relative flex items-center justify-center">
            {heroImage ? (
              <img
                src={heroImage}
                alt={name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            ) : (
              <div className="text-center">
                {attractionType === 'dive_site' && <Fish className="w-12 h-12 text-accent mx-auto mb-2 group-hover:scale-110 transition-transform" />}
                {attractionType === 'surf_spot' && <Wind className="w-12 h-12 text-accent mx-auto mb-2 group-hover:scale-110 transition-transform" />}
                {attractionType === 'snorkeling_spot' && <Zap className="w-12 h-12 text-accent mx-auto mb-2 group-hover:scale-110 transition-transform" />}
                <p className="text-sm text-primary-foreground/80 font-semibold capitalize">
                  {attractionType ? attractionType.replace(/_/g, ' ') : 'Attraction'}
                </p>
              </div>
            )}
            {difficulty && (
              <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground capitalize">
                {difficulty}
              </Badge>
            )}
          </div>

          {/* Content */}
          <CardContent className="flex-1 flex flex-col p-6">
            <h3 className="text-xl font-bold mb-2 group-hover:text-accent transition-colors">
              {name}
            </h3>
            <p className="text-sm text-muted-foreground mb-4 line-clamp-3 flex-1">
              {overview || `Discover this amazing ${attractionType?.replace(/_/g, ' ')}.`}
            </p>

            <Button variant="outline" className="w-full gap-2 group/btn">
              Learn More
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </Button>
          </CardContent>
        </Card>
      </Link>
    );
  };

  return (
    <div className="py-12">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Activities in {atollName}</h2>
        <p className="text-muted-foreground">
          Explore diving, surfing, and snorkeling opportunities in this atoll
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'dives' | 'surfs' | 'snorkeling')} className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-3 mb-8">
          <TabsTrigger value="dives" className="gap-2">
            <Fish className="w-4 h-4" />
            Dive Sites {diveGuides.length > 0 && `(${diveGuides.length})`}
          </TabsTrigger>
          <TabsTrigger value="surfs" className="gap-2">
            <Wind className="w-4 h-4" />
            Surf Spots {surfGuides.length > 0 && `(${surfGuides.length})`}
          </TabsTrigger>
          <TabsTrigger value="snorkeling" className="gap-2">
            <Zap className="w-4 h-4" />
            Snorkeling {snorkelingGuides.length > 0 && `(${snorkelingGuides.length})`}
          </TabsTrigger>
        </TabsList>

        {/* Dive Sites Tab */}
        <TabsContent value="dives">
          {diveGuides.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {diveGuides.map((guide) => renderGuideCard(guide))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Fish className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">No dive sites available in this atoll yet.</p>
            </div>
          )}
        </TabsContent>

        {/* Surf Spots Tab */}
        <TabsContent value="surfs">
          {surfGuides.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {surfGuides.map((guide) => renderGuideCard(guide))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Wind className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">No surf spots available in this atoll yet.</p>
            </div>
          )}
        </TabsContent>

        {/* Snorkeling Tab */}
        <TabsContent value="snorkeling">
          {snorkelingGuides.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {snorkelingGuides.map((guide) => renderGuideCard(guide))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Zap className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">No snorkeling spots available in this atoll yet.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
