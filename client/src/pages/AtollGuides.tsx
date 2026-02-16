/**
 * Atoll Guides Page
 * Comprehensive destination guides for all 20 Maldives atolls
 * Optimized for SEO with location-specific keywords
 */

import { useEffect, useState } from "react";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Search, ArrowRight, Filter } from "lucide-react";
import { updateMetaTags } from "@/lib/seo";
import { SEO_CONFIG } from "@shared/seo-config";
import RelatedAtolls from "@/components/RelatedAtolls";

interface AtollData {
  id: number;
  name: string;
  slug: string;
  region: string;
  description: string;
  bestFor: string;
  heroImage?: string;
}

const ATOLLS: AtollData[] = [
  {
    id: 1,
    name: "Alif Alif Atoll",
    slug: "alif-alif",
    region: "North",
    description: "Luxury overwater bungalows, world-class diving, and exclusive island experiences",
    bestFor: "Luxury vacations, honeymoons, diving",
    heroImage: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
  },
  {
    id: 2,
    name: "Alif Dhaal Atoll",
    slug: "alif-dhaal",
    region: "North",
    description: "Diverse diving sites, authentic local islands, excellent value for money",
    bestFor: "Diving, island hopping, cultural experiences",
    heroImage: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
  },
  {
    id: 3,
    name: "Baa Atoll",
    slug: "baa",
    region: "North",
    description: "UNESCO Biosphere Reserve, manta ray encounters at Hanifaru Bay",
    bestFor: "Manta ray watching, eco-tourism, diving",
    heroImage: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
  },
  {
    id: 4,
    name: "Vaavu Atoll",
    slug: "vaavu",
    region: "Central",
    description: "Hidden gem with exceptional diving, pristine coral reefs, exclusive experiences",
    bestFor: "Diving, adventure travel, photography",
    heroImage: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
  },
  {
    id: 5,
    name: "Meemu Atoll",
    slug: "meemu",
    region: "Central",
    description: "Authentic Maldivian culture, excellent diving, peaceful island experiences",
    bestFor: "Cultural immersion, diving, peaceful vacations",
    heroImage: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
  },
  {
    id: 6,
    name: "Faafu Atoll",
    slug: "faafu",
    region: "Central",
    description: "Emerging destination with pristine reefs, authentic culture, eco-tourism",
    bestFor: "Authentic experiences, diving, eco-tourism",
    heroImage: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
  },
  {
    id: 7,
    name: "Dhaalu Atoll",
    slug: "dhaalu",
    region: "Central",
    description: "Charming destination with pristine beaches, excellent diving, local culture",
    bestFor: "Family vacations, diving, island hopping",
    heroImage: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
  },
  {
    id: 8,
    name: "Thaa Atoll",
    slug: "thaa",
    region: "Central",
    description: "Pristine destination with exceptional diving, authentic culture, peaceful setting",
    bestFor: "Diving, authentic experiences, adventure travel",
    heroImage: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
  },
  {
    id: 9,
    name: "Laamu Atoll",
    slug: "laamu",
    region: "South",
    description: "Southern destination with pristine reefs, authentic culture, exclusive experiences",
    bestFor: "Diving, cultural immersion, photography",
    heroImage: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
  },
  {
    id: 10,
    name: "Gnaviyani Atoll",
    slug: "gnaviyani",
    region: "South",
    description: "Unique freshwater lagoons, distinctive ecosystems, authentic island culture",
    bestFor: "Unique experiences, nature exploration, diving",
    heroImage: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
  },
  {
    id: 11,
    name: "Addu Atoll",
    slug: "addu",
    region: "South",
    description: "Southernmost atoll, world-class Equatorial Channel diving, authentic culture",
    bestFor: "Diving, adventure travel, exclusive vacations",
    heroImage: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
  },
  {
    id: 12,
    name: "Shaviyani Atoll",
    slug: "shaviyani",
    region: "North",
    description: "Pristine northern destination with excellent diving and authentic culture",
    bestFor: "Diving, authentic experiences, adventure travel",
    heroImage: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
  },
  {
    id: 13,
    name: "Noonu Atoll",
    slug: "noonu",
    region: "North",
    description: "Pristine northern destination with exceptional diving and peaceful setting",
    bestFor: "Diving, peaceful vacations, photography",
    heroImage: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
  },
  {
    id: 14,
    name: "Raa Atoll",
    slug: "raa",
    region: "North",
    description: "Northern gem with excellent diving sites and authentic island experiences",
    bestFor: "Diving, cultural immersion, adventure travel",
    heroImage: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
  },
  {
    id: 15,
    name: "Lhaviyani Atoll",
    slug: "lhaviyani",
    region: "North",
    description: "Premier destination with luxury resorts, excellent diving, pristine beaches",
    bestFor: "Luxury vacations, diving, family trips",
    heroImage: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
  },
  {
    id: 16,
    name: "Kaafu Atoll",
    slug: "kaafu",
    region: "North",
    description: "Most popular atoll with luxury resorts, excellent diving, convenient access",
    bestFor: "Luxury vacations, diving, family vacations",
    heroImage: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
  },
  {
    id: 17,
    name: "Haa Alif Atoll",
    slug: "haa-alif",
    region: "North",
    description: "Northernmost destination with pristine reefs and authentic island culture",
    bestFor: "Diving, authentic experiences, eco-tourism",
    heroImage: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
  },
  {
    id: 18,
    name: "Haa Dhaalu Atoll",
    slug: "haa-dhaalu",
    region: "North",
    description: "Northernmost atoll with excellent diving and peaceful island experiences",
    bestFor: "Diving, peaceful vacations, photography",
    heroImage: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
  },
  {
    id: 19,
    name: "Gaaf Alif Atoll",
    slug: "gaaf-alif",
    region: "South",
    description: "Southern destination with pristine reefs and authentic island culture",
    bestFor: "Diving, cultural immersion, adventure travel",
    heroImage: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
  },
  {
    id: 20,
    name: "Gaaf Dhaal Atoll",
    slug: "gaaf-dhaal",
    region: "South",
    description: "Southern atoll with excellent diving and exclusive island experiences",
    bestFor: "Diving, adventure travel, exclusive vacations",
    heroImage: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
  },
];

export default function AtollGuides() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [filteredAtolls, setFilteredAtolls] = useState(ATOLLS);

  // Update meta tags for SEO
  useEffect(() => {
    const config = SEO_CONFIG.atolls;
    updateMetaTags({
      title: config.title,
      description: config.description,
      keywords: config.keywords,
      ogTitle: config.ogTitle,
      ogDescription: config.ogDescription,
      canonicalUrl: "https://islenomads.com/island-guides",
    });
  }, []);

  // Filter atolls based on search and region
  useEffect(() => {
    let filtered = ATOLLS;

    if (searchTerm) {
      filtered = filtered.filter(
        (atoll) =>
          atoll.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          atoll.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          atoll.bestFor.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedRegion) {
      filtered = filtered.filter((atoll) => atoll.region === selectedRegion);
    }

    setFilteredAtolls(filtered);
  }, [searchTerm, selectedRegion]);

  const regions = ["North", "Central", "South"];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary to-primary/80 text-white py-12 md:py-16">
          <div className="container">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Maldives Atoll Guides</h1>
            <p className="text-lg text-primary-foreground/90 max-w-2xl">
              Explore detailed destination guides for all 20 Maldives atolls. Discover unique
              experiences, activities, accommodations, and travel tips for each atoll.
            </p>
          </div>
        </section>

        {/* Search and Filter Section */}
        <section className="bg-white border-b border-gray-200 py-8">
          <div className="container space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search atolls by name or activity..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedRegion(null)}
                className={`px-4 py-2 rounded-full font-medium transition-all ${
                  selectedRegion === null
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Filter className="w-4 h-4 inline mr-2" />
                All Regions
              </button>
              {regions.map((region) => (
                <button
                  key={region}
                  onClick={() => setSelectedRegion(region)}
                  className={`px-4 py-2 rounded-full font-medium transition-all ${
                    selectedRegion === region
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {region}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Atolls Grid */}
        <section className="py-12 md:py-16">
          <div className="container">
            {filteredAtolls.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAtolls.map((atoll) => (
                  <Link key={atoll.id} href={`/atoll/${atoll.slug}`}>
                    <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer overflow-hidden">
                      {atoll.heroImage && (
                        <div className="h-48 overflow-hidden">
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
                            <CardTitle className="text-xl">{atoll.name}</CardTitle>
                            <CardDescription className="flex items-center gap-1 mt-1">
                              <MapPin className="w-4 h-4" />
                              {atoll.region} Region
                            </CardDescription>
                          </div>
                          <Badge variant="secondary">{atoll.region}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
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
                          className="w-full group"
                          asChild
                        >
                          <div>
                            Explore Guide
                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </Button>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No atolls found</h3>
                <p className="text-gray-600">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            )}
          </div>
        </section>

        {/* SEO Content Section */}
        <section className="bg-gray-50 py-12 md:py-16">
          <div className="container max-w-3xl">
            <h2 className="text-3xl font-bold mb-6">Discover the Maldives Atolls</h2>
            <div className="prose prose-sm max-w-none space-y-4 text-gray-700">
              <p>
                The Maldives is an archipelago consisting of 20 atolls, each with its own unique
                character, attractions, and experiences. From the luxury resorts of Kaafu Atoll to
                the pristine diving sites of Vaavu Atoll, there's something for every type of
                traveler.
              </p>
              <p>
                Our comprehensive atoll guides provide detailed information about each destination,
                including the best activities, accommodation options, transportation details, and
                the ideal time to visit. Whether you're seeking a romantic honeymoon, an adventurous
                diving expedition, or a peaceful family vacation, our guides will help you plan the
                perfect Maldives experience.
              </p>
              <p>
                Explore the northern atolls for luxury resorts and world-class diving, venture to
                the central atolls for authentic cultural experiences, or discover the southern
                atolls for exclusive and pristine island adventures. Each atoll offers something
                special, and our detailed guides will help you make the most of your Maldives
                vacation.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
