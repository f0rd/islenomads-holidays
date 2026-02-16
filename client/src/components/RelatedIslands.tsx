/**
 * RelatedIslands Component
 * Displays related islands based on atoll, activities, and features
 * Improves internal linking strategy for SEO
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { MapPin, ArrowRight } from "lucide-react";

interface RelatedIsland {
  id: number;
  name: string;
  slug: string;
  atoll: string;
  description: string;
  bestFor: string;
  heroImage?: string;
}

interface RelatedIslandsProps {
  currentIslandId?: number;
  currentIslandSlug?: string;
  atollId?: number;
  atollSlug?: string;
  maxLinks?: number;
  activityType?: string;
}

// Sample islands data (in production, this would come from the database)
const SAMPLE_ISLANDS: Record<string, RelatedIsland> = {
  "dhigurah": {
    id: 1,
    name: "Dhigurah",
    slug: "dhigurah",
    atoll: "Alif Dhaal",
    description: "Popular diving destination known for whale shark encounters and pristine reefs",
    bestFor: "Diving, whale sharks, snorkeling",
    heroImage: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
  },
  "mahibadhoo": {
    id: 2,
    name: "Mahibadhoo",
    slug: "mahibadhoo",
    atoll: "Alif Dhaal",
    description: "Local island with authentic Maldivian culture and excellent diving sites",
    bestFor: "Cultural experiences, diving, local food",
    heroImage: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
  },
  "felidhoo": {
    id: 3,
    name: "Felidhoo",
    slug: "felidhoo",
    atoll: "Alif Dhaal",
    description: "Charming local island with pristine beaches and friendly communities",
    bestFor: "Island hopping, local culture, beaches",
    heroImage: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
  },
  "hanifaru": {
    id: 4,
    name: "Hanifaru",
    slug: "hanifaru",
    atoll: "Baa",
    description: "Famous for manta ray encounters and UNESCO Biosphere Reserve status",
    bestFor: "Manta rays, snorkeling, eco-tourism",
    heroImage: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
  },
  "eydhafushi": {
    id: 5,
    name: "Eydhafushi",
    slug: "eydhafushi",
    atoll: "Baa",
    description: "Local island with authentic culture and access to excellent diving sites",
    bestFor: "Diving, cultural immersion, local experiences",
    heroImage: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
  },
  "velassaru": {
    id: 6,
    name: "Velassaru",
    slug: "velassaru",
    atoll: "Kaafu",
    description: "Luxury resort island with pristine beaches and world-class diving",
    bestFor: "Luxury vacations, diving, honeymoons",
    heroImage: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
  },
  "hulhumalé": {
    id: 7,
    name: "Hulhumalé",
    slug: "hulhumalé",
    atoll: "Kaafu",
    description: "Modern local island close to Malé with good amenities and diving access",
    bestFor: "Budget travel, diving, convenience",
    heroImage: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
  },
  "male": {
    id: 8,
    name: "Malé",
    slug: "male",
    atoll: "Kaafu",
    description: "Capital city with cultural attractions, local markets, and island history",
    bestFor: "Cultural exploration, local food, shopping",
    heroImage: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
  },
};

// Island relationships based on atoll and activities
const ISLAND_RELATIONSHIPS: Record<string, string[]> = {
  "dhigurah": ["mahibadhoo", "felidhoo", "hanifaru"],
  "mahibadhoo": ["dhigurah", "felidhoo", "eydhafushi"],
  "felidhoo": ["dhigurah", "mahibadhoo", "hanifaru"],
  "hanifaru": ["eydhafushi", "dhigurah", "felidhoo"],
  "eydhafushi": ["hanifaru", "velassaru", "hulhumalé"],
  "velassaru": ["hulhumalé", "male", "eydhafushi"],
  "hulhumalé": ["velassaru", "male", "eydhafushi"],
  "male": ["hulhumalé", "velassaru", "dhigurah"],
};

export default function RelatedIslands({
  currentIslandId,
  currentIslandSlug,
  atollSlug,
  maxLinks = 5,
  activityType,
}: RelatedIslandsProps) {
  // Get related island slugs
  const relatedSlugs = currentIslandSlug ? ISLAND_RELATIONSHIPS[currentIslandSlug] || [] : [];

  // Filter by atoll if specified
  let filteredSlugs = relatedSlugs;
  if (atollSlug) {
    filteredSlugs = relatedSlugs.filter(
      (slug) => SAMPLE_ISLANDS[slug]?.atoll.toLowerCase().includes(atollSlug.toLowerCase())
    );
  }

  // Filter by activity if specified
  if (activityType) {
    filteredSlugs = filteredSlugs.filter(
      (slug) => SAMPLE_ISLANDS[slug]?.bestFor.toLowerCase().includes(activityType.toLowerCase())
    );
  }

  // Limit to maxLinks
  const displaySlugs = filteredSlugs.slice(0, maxLinks);

  // Get full island data
  const relatedIslands = displaySlugs
    .map((slug) => SAMPLE_ISLANDS[slug])
    .filter(Boolean);

  if (relatedIslands.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-bold flex items-center gap-2">
        <MapPin className="w-6 h-6 text-accent" />
        Explore Related Islands
      </h3>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {relatedIslands.map((island) => (
          <Link key={island.id} href={`/island-detail/${island.slug}`}>
            <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer overflow-hidden">
              {island.heroImage && (
                <div className="h-40 overflow-hidden">
                  <img
                    src={island.heroImage}
                    alt={island.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                  />
                </div>
              )}
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{island.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3" />
                      {island.atoll}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-600">{island.description}</p>
                <div className="flex flex-wrap gap-1">
                  {island.bestFor.split(",").slice(0, 2).map((item, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {item.trim()}
                    </Badge>
                  ))}
                </div>
                <Button
                  variant="ghost"
                  className="w-full group mt-2"
                  asChild
                >
                  <div>
                    Explore
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Button>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
