/**
 * Diving Destinations Landing Page
 * Comprehensive guide to the best diving destinations in the Maldives
 * Optimized for SEO with location-specific keywords and internal links
 */

import { useEffect, useState } from "react";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  MapPin,
  Waves,
  Fish,
  ArrowRight,
  Star,
  Users,
  Calendar,
  TrendingUp,
} from "lucide-react";
import { updateMetaTags } from "@/lib/seo";
import { SEO_CONFIG } from "@shared/seo-config";

interface DivingDestination {
  id: number;
  name: string;
  atoll: string;
  atollSlug: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  highlights: string[];
  bestSeason: string;
  rating: number;
  reviews: number;
  description: string;
  marineLife: string[];
  depth: string;
  image?: string;
}

const DIVING_DESTINATIONS: DivingDestination[] = [
  {
    id: 1,
    name: "Kaafu Atoll",
    atoll: "Kaafu",
    atollSlug: "kaafu",
    difficulty: "beginner",
    highlights: ["House reefs", "Wreck diving", "Reef sharks", "Manta rays"],
    bestSeason: "November to April",
    rating: 4.8,
    reviews: 324,
    description:
      "The most accessible diving destination in the Maldives with excellent house reefs and diverse marine life. Perfect for beginners and experienced divers alike.",
    marineLife: ["Reef sharks", "Groupers", "Snappers", "Trevally", "Barracuda"],
    depth: "5-30m",
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
  },
  {
    id: 2,
    name: "Alif Alif Atoll",
    atoll: "Alif Alif",
    atollSlug: "alif-alif",
    difficulty: "intermediate",
    highlights: ["Manta rays", "Pristine reefs", "Luxury resorts", "Drift diving"],
    bestSeason: "June to November",
    rating: 4.9,
    reviews: 287,
    description:
      "World-renowned for manta ray encounters and pristine coral gardens. Home to some of the Maldives' most exclusive resorts with exceptional diving.",
    marineLife: ["Manta rays", "Eagle rays", "Reef sharks", "Tuna", "Jacks"],
    depth: "10-35m",
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
  },
  {
    id: 3,
    name: "Baa Atoll",
    atoll: "Baa",
    atollSlug: "baa",
    difficulty: "intermediate",
    highlights: ["Manta rays", "UNESCO Biosphere", "Hanifaru Bay", "Eco-tourism"],
    bestSeason: "June to November",
    rating: 4.7,
    reviews: 256,
    description:
      "UNESCO Biosphere Reserve famous for seasonal manta ray aggregations at Hanifaru Bay. Pristine reefs and exceptional marine biodiversity.",
    marineLife: ["Manta rays", "Reef sharks", "Groupers", "Snappers", "Trevally"],
    depth: "5-30m",
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
  },
  {
    id: 4,
    name: "Vaavu Atoll",
    atoll: "Vaavu",
    atollSlug: "vaavu",
    difficulty: "advanced",
    highlights: ["Drift diving", "Pelagics", "Pristine reefs", "Exclusive resorts"],
    bestSeason: "March to May",
    rating: 4.9,
    reviews: 198,
    description:
      "Hidden gem for advanced divers seeking pristine reefs and thrilling drift dives. Known for encounters with large pelagics and exceptional visibility.",
    marineLife: ["Sharks", "Tuna", "Jacks", "Barracuda", "Eagle rays"],
    depth: "15-40m",
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
  },
  {
    id: 5,
    name: "Alif Dhaal Atoll",
    atoll: "Alif Dhaal",
    atollSlug: "alif-dhaal",
    difficulty: "intermediate",
    highlights: ["Whale sharks", "Diverse reefs", "Local islands", "Value for money"],
    bestSeason: "August to October",
    rating: 4.6,
    reviews: 215,
    description:
      "Excellent value for money with diverse diving sites. Famous for whale shark encounters and a mix of luxury resorts and local islands.",
    marineLife: ["Whale sharks", "Reef sharks", "Groupers", "Snappers", "Trevally"],
    depth: "5-35m",
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
  },
  {
    id: 6,
    name: "Addu Atoll",
    atoll: "Addu",
    atollSlug: "addu",
    difficulty: "advanced",
    highlights: ["Equatorial Channel", "Drift diving", "Pelagics", "Pristine reefs"],
    bestSeason: "September to November",
    rating: 4.8,
    reviews: 167,
    description:
      "Southernmost atoll with world-class Equatorial Channel diving. Advanced divers will appreciate the thrilling drift dives and pristine conditions.",
    marineLife: ["Sharks", "Tuna", "Jacks", "Barracuda", "Manta rays"],
    depth: "20-40m",
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
  },
];

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: "bg-green-100 text-green-800",
  intermediate: "bg-yellow-100 text-yellow-800",
  advanced: "bg-red-100 text-red-800",
};

export default function DivingDestinations() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [filteredDestinations, setFilteredDestinations] = useState(DIVING_DESTINATIONS);

  useEffect(() => {
    // Update meta tags for SEO
    updateMetaTags({
      title: "Best Diving Destinations in the Maldives | Isle Nomads",
      description:
        "Explore the best diving destinations in the Maldives. From beginner-friendly house reefs to advanced drift dives. Find your perfect diving experience.",
      keywords:
        "diving destinations maldives, best diving sites, maldives diving, diving resorts, dive sites",
      ogTitle: "Discover the Best Diving in the Maldives",
      ogDescription:
        "Explore pristine coral reefs, encounter manta rays, and experience world-class diving in the Maldives.",
    });

    // Filter destinations
    let filtered = DIVING_DESTINATIONS;

    if (searchTerm) {
      filtered = filtered.filter(
        (dest) =>
          dest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          dest.atoll.toLowerCase().includes(searchTerm.toLowerCase()) ||
          dest.highlights.some((h) => h.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedDifficulty) {
      filtered = filtered.filter((dest) => dest.difficulty === selectedDifficulty);
    }

    setFilteredDestinations(filtered);
  }, [searchTerm, selectedDifficulty]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      {/* Hero Section */}
      <section className="relative py-16 md:py-24 bg-gradient-to-b from-primary/10 to-transparent">
        <div className="container max-w-4xl">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Waves className="w-8 h-8 text-accent" />
              <span className="text-accent font-semibold">Explore Maldives</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Best Diving Destinations in the Maldives
            </h1>
            <p className="text-lg text-gray-700 leading-relaxed">
              Discover world-class diving experiences across the Maldives. From pristine coral
              reefs to thrilling drift dives, encounter manta rays, reef sharks, and vibrant
              marine ecosystems. Whether you're a beginner or advanced diver, find your perfect
              diving destination.
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 bg-gray-50 border-b">
        <div className="container max-w-4xl space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search diving destinations, atolls, or marine life..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-12"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedDifficulty === null ? "default" : "outline"}
              onClick={() => setSelectedDifficulty(null)}
              size="sm"
            >
              All Levels
            </Button>
            {["beginner", "intermediate", "advanced"].map((level) => (
              <Button
                key={level}
                variant={selectedDifficulty === level ? "default" : "outline"}
                onClick={() => setSelectedDifficulty(level)}
                size="sm"
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </Button>
            ))}
          </div>

          <p className="text-sm text-gray-600">
            Showing {filteredDestinations.length} of {DIVING_DESTINATIONS.length} diving
            destinations
          </p>
        </div>
      </section>

      {/* Destinations Grid */}
      <section className="py-12 md:py-16">
        <div className="container max-w-4xl">
          <div className="grid md:grid-cols-2 gap-6">
            {filteredDestinations.map((destination) => (
              <Link key={destination.id} href={`/atoll/${destination.atollSlug}`}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer overflow-hidden">
                  {destination.image && (
                    <div className="h-48 overflow-hidden">
                      <img
                        src={destination.image}
                        alt={destination.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <CardTitle className="text-xl">{destination.name}</CardTitle>
                        <CardDescription className="flex items-center gap-1 mt-1">
                          <MapPin className="w-4 h-4" />
                          {destination.atoll}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold text-sm">{destination.rating}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600">{destination.description}</p>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Fish className="w-4 h-4 text-accent" />
                        <span className="font-semibold">Depth:</span>
                        <span>{destination.depth}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-accent" />
                        <span className="font-semibold">Best Season:</span>
                        <span>{destination.bestSeason}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {destination.highlights.slice(0, 3).map((highlight, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {highlight}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Users className="w-4 h-4" />
                        <span>{destination.reviews} reviews</span>
                      </div>
                      <Badge className={DIFFICULTY_COLORS[destination.difficulty]}>
                        {destination.difficulty.charAt(0).toUpperCase() +
                          destination.difficulty.slice(1)}
                      </Badge>
                    </div>

                    <Button variant="ghost" className="w-full group mt-2" asChild>
                      <div>
                        Explore Destination
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {filteredDestinations.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">
                No diving destinations match your search. Try adjusting your filters.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Why Dive in the Maldives Section */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container max-w-4xl">
          <h2 className="text-3xl font-bold mb-8">Why Dive in the Maldives?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Fish,
                title: "Incredible Marine Life",
                description:
                  "Encounter manta rays, reef sharks, whale sharks, and thousands of colorful fish species in pristine coral ecosystems.",
              },
              {
                icon: TrendingUp,
                title: "Year-Round Diving",
                description:
                  "With different atolls offering optimal conditions in different seasons, you can dive in the Maldives any time of year.",
              },
              {
                icon: Waves,
                title: "World-Class Dive Sites",
                description:
                  "From beginner-friendly house reefs to advanced drift dives, the Maldives offers exceptional diving for all skill levels.",
              },
            ].map((item, idx) => (
              <div key={idx} className="bg-white rounded-lg p-6 border">
                <item.icon className="w-8 h-8 text-accent mb-3" />
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-gradient-to-r from-primary to-primary/80 text-white">
        <div className="container max-w-4xl text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">Ready to Dive?</h2>
          <p className="text-lg text-primary-foreground/90">
            Explore our complete destination guides and start planning your diving adventure in
            the Maldives.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/atoll-guides">Explore All Atolls</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 md:py-16">
        <div className="container max-w-4xl">
          <h2 className="text-3xl font-bold mb-8">Diving FAQs</h2>
          <div className="space-y-4">
            {[
              {
                q: "What is the best time to dive in the Maldives?",
                a: "The Maldives offers year-round diving, but the best conditions vary by atoll. November to April is generally excellent for most areas, while June to November is ideal for manta ray encounters.",
              },
              {
                q: "Do I need certification to dive?",
                a: "Yes, recreational diving requires at least an Open Water certification. Many resorts offer certification courses if you're a beginner.",
              },
              {
                q: "What marine life will I see?",
                a: "You'll encounter reef sharks, groupers, snappers, trevally, barracuda, manta rays, eagle rays, and thousands of colorful fish species.",
              },
              {
                q: "How deep do dives go?",
                a: "Most recreational dives range from 5-40 meters depending on the site and your certification level.",
              },
            ].map((item, idx) => (
              <div key={idx} className="bg-gray-50 rounded-lg p-6 border">
                <h3 className="font-semibold mb-2">{item.q}</h3>
                <p className="text-gray-700">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
