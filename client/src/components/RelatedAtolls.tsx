/**
 * RelatedAtolls Component
 * Displays related atolls based on region, characteristics, and activities
 * Improves internal linking strategy for SEO
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { MapPin, ArrowRight } from "lucide-react";

interface RelatedAtoll {
  id: number;
  name: string;
  slug: string;
  region: string;
  description: string;
  bestFor: string;
  heroImage?: string;
}

interface RelatedAtollsProps {
  currentAtollSlug: string;
  maxLinks?: number;
  region?: string;
}

// Atoll relationship mapping based on characteristics and region
const ATOLL_RELATIONSHIPS: Record<string, string[]> = {
  // North Region - Luxury & Diving Focus
  "kaafu": ["lhaviyani", "alif-alif", "alif-dhaal"],
  "lhaviyani": ["kaafu", "alif-alif", "alif-dhaal"],
  "alif-alif": ["lhaviyani", "kaafu", "baa"],
  "alif-dhaal": ["alif-alif", "baa", "kaafu"],
  "baa": ["alif-alif", "alif-dhaal", "raa"],
  "raa": ["baa", "noonu", "shaviyani"],
  "noonu": ["raa", "shaviyani", "haa-alif"],
  "shaviyani": ["raa", "noonu", "haa-dhaalu"],
  "haa-alif": ["noonu", "haa-dhaalu", "shaviyani"],
  "haa-dhaalu": ["haa-alif", "shaviyani", "noonu"],

  // Central Region - Authentic & Diverse
  "vaavu": ["meemu", "faafu", "dhaalu"],
  "meemu": ["vaavu", "faafu", "dhaalu"],
  "faafu": ["meemu", "dhaalu", "vaavu"],
  "dhaalu": ["faafu", "meemu", "thaa"],
  "thaa": ["dhaalu", "laamu", "gnaviyani"],

  // South Region - Exclusive & Pristine
  "laamu": ["thaa", "gnaviyani", "addu"],
  "gnaviyani": ["laamu", "addu", "thaa"],
  "addu": ["gnaviyani", "laamu", "gaaf-alif"],
  "gaaf-alif": ["addu", "gaaf-dhaal", "gnaviyani"],
  "gaaf-dhaal": ["gaaf-alif", "addu", "laamu"],
};

// All atolls data for reference
const ALL_ATOLLS: Record<string, RelatedAtoll> = {
  "kaafu": {
    id: 1,
    name: "Kaafu Atoll",
    slug: "kaafu",
    region: "North",
    description: "Most popular atoll with luxury resorts, excellent diving, and convenient access from Malé",
    bestFor: "Luxury vacations, diving, family vacations",
    heroImage: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
  },
  "lhaviyani": {
    id: 2,
    name: "Lhaviyani Atoll",
    slug: "lhaviyani",
    region: "North",
    description: "Premier destination with luxury resorts, excellent diving, and pristine beaches",
    bestFor: "Luxury vacations, diving, family trips",
    heroImage: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
  },
  "alif-alif": {
    id: 3,
    name: "Alif Alif Atoll",
    slug: "alif-alif",
    region: "North",
    description: "Luxury overwater bungalows, world-class diving, and exclusive island experiences",
    bestFor: "Luxury vacations, honeymoons, diving",
    heroImage: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
  },
  "alif-dhaal": {
    id: 4,
    name: "Alif Dhaal Atoll",
    slug: "alif-dhaal",
    region: "North",
    description: "Diverse diving sites, authentic local islands, excellent value for money",
    bestFor: "Diving, island hopping, cultural experiences",
    heroImage: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
  },
  "baa": {
    id: 5,
    name: "Baa Atoll",
    slug: "baa",
    region: "North",
    description: "UNESCO Biosphere Reserve, manta ray encounters at Hanifaru Bay",
    bestFor: "Manta ray watching, eco-tourism, diving",
    heroImage: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
  },
  "raa": {
    id: 6,
    name: "Raa Atoll",
    slug: "raa",
    region: "North",
    description: "Northern gem with excellent diving sites and authentic island experiences",
    bestFor: "Diving, cultural immersion, adventure travel",
    heroImage: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
  },
  "noonu": {
    id: 7,
    name: "Noonu Atoll",
    slug: "noonu",
    region: "North",
    description: "Pristine northern destination with exceptional diving and peaceful setting",
    bestFor: "Diving, peaceful vacations, photography",
    heroImage: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
  },
  "shaviyani": {
    id: 8,
    name: "Shaviyani Atoll",
    slug: "shaviyani",
    region: "North",
    description: "Pristine northern destination with excellent diving and authentic culture",
    bestFor: "Diving, authentic experiences, adventure travel",
    heroImage: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
  },
  "haa-alif": {
    id: 9,
    name: "Haa Alif Atoll",
    slug: "haa-alif",
    region: "North",
    description: "Northernmost destination with pristine reefs and authentic island culture",
    bestFor: "Diving, authentic experiences, eco-tourism",
    heroImage: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
  },
  "haa-dhaalu": {
    id: 10,
    name: "Haa Dhaalu Atoll",
    slug: "haa-dhaalu",
    region: "North",
    description: "Northernmost atoll with excellent diving and peaceful island experiences",
    bestFor: "Diving, peaceful vacations, photography",
    heroImage: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
  },
  "vaavu": {
    id: 11,
    name: "Vaavu Atoll",
    slug: "vaavu",
    region: "Central",
    description: "Hidden gem with exceptional diving, pristine coral reefs, exclusive experiences",
    bestFor: "Diving, adventure travel, photography",
    heroImage: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
  },
  "meemu": {
    id: 12,
    name: "Meemu Atoll",
    slug: "meemu",
    region: "Central",
    description: "Authentic Maldivian culture, excellent diving, peaceful island experiences",
    bestFor: "Cultural immersion, diving, peaceful vacations",
    heroImage: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
  },
  "faafu": {
    id: 13,
    name: "Faafu Atoll",
    slug: "faafu",
    region: "Central",
    description: "Emerging destination with pristine reefs, authentic culture, eco-tourism",
    bestFor: "Authentic experiences, diving, eco-tourism",
    heroImage: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
  },
  "dhaalu": {
    id: 14,
    name: "Dhaalu Atoll",
    slug: "dhaalu",
    region: "Central",
    description: "Charming destination with pristine beaches, excellent diving, local culture",
    bestFor: "Family vacations, diving, island hopping",
    heroImage: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
  },
  "thaa": {
    id: 15,
    name: "Thaa Atoll",
    slug: "thaa",
    region: "Central",
    description: "Pristine destination with exceptional diving, authentic culture, peaceful setting",
    bestFor: "Diving, authentic experiences, adventure travel",
    heroImage: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
  },
  "laamu": {
    id: 16,
    name: "Laamu Atoll",
    slug: "laamu",
    region: "South",
    description: "Southern destination with pristine reefs, authentic culture, exclusive experiences",
    bestFor: "Diving, cultural immersion, photography",
    heroImage: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
  },
  "gnaviyani": {
    id: 17,
    name: "Gnaviyani Atoll",
    slug: "gnaviyani",
    region: "South",
    description: "Unique freshwater lagoons, distinctive ecosystems, authentic island culture",
    bestFor: "Unique experiences, nature exploration, diving",
    heroImage: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
  },
  "addu": {
    id: 18,
    name: "Addu Atoll",
    slug: "addu",
    region: "South",
    description: "Southernmost atoll, world-class Equatorial Channel diving, authentic culture",
    bestFor: "Diving, adventure travel, exclusive vacations",
    heroImage: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
  },
  "gaaf-alif": {
    id: 19,
    name: "Gaaf Alif Atoll",
    slug: "gaaf-alif",
    region: "South",
    description: "Southern destination with pristine reefs and authentic island culture",
    bestFor: "Diving, cultural immersion, adventure travel",
    heroImage: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
  },
  "gaaf-dhaal": {
    id: 20,
    name: "Gaaf Dhaal Atoll",
    slug: "gaaf-dhaal",
    region: "South",
    description: "Southern atoll with excellent diving and exclusive island experiences",
    bestFor: "Diving, adventure travel, exclusive vacations",
    heroImage: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
  },
};

export default function RelatedAtolls({
  currentAtollSlug,
  maxLinks = 4,
  region,
}: RelatedAtollsProps) {
  // Get related atoll slugs
  const relatedSlugs = ATOLL_RELATIONSHIPS[currentAtollSlug] || [];

  // Filter by region if specified
  let filteredSlugs = relatedSlugs;
  if (region) {
    filteredSlugs = relatedSlugs.filter(
      (slug) => ALL_ATOLLS[slug]?.region === region
    );
  }

  // Limit to maxLinks
  const displaySlugs = filteredSlugs.slice(0, maxLinks);

  // Get full atoll data
  const relatedAtolls = displaySlugs
    .map((slug) => ALL_ATOLLS[slug])
    .filter(Boolean);

  if (relatedAtolls.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-bold flex items-center gap-2">
        <MapPin className="w-6 h-6 text-accent" />
        Explore Related Atolls
      </h3>

      <div className="grid md:grid-cols-2 gap-4">
        {relatedAtolls.map((atoll) => (
          <Link key={atoll.id} href={`/atoll/${atoll.slug}`}>
            <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer overflow-hidden">
              {atoll.heroImage && (
                <div className="h-40 overflow-hidden">
                  <img
                    src={atoll.heroImage}
                    alt={atoll.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                  />
                </div>
              )}
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{atoll.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3" />
                      {atoll.region} Region
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-600">{atoll.description}</p>
                <div className="flex flex-wrap gap-1">
                  {atoll.bestFor.split(",").slice(0, 2).map((item, idx) => (
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
