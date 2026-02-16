/**
 * Luxury Resorts Landing Page
 * Curated guide to the finest luxury resort experiences in the Maldives
 * Optimized for SEO with high-intent keywords and internal links
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
  Crown,
  Waves,
  ArrowRight,
  Star,
  Sparkles,
  Heart,
  Utensils,
  Wifi,
  Palmtree,
} from "lucide-react";
import { updateMetaTags } from "@/lib/seo";
import { SEO_CONFIG } from "@shared/seo-config";

interface LuxuryResort {
  id: number;
  name: string;
  atoll: string;
  atollSlug: string;
  category: "ultra-luxury" | "luxury" | "premium";
  highlights: string[];
  priceRange: string;
  rating: number;
  reviews: number;
  description: string;
  amenities: string[];
  bestFor: string[];
  image?: string;
}

const LUXURY_RESORTS: LuxuryResort[] = [
  {
    id: 1,
    name: "Soneva Jani",
    atoll: "Kaafu",
    atollSlug: "kaafu",
    category: "ultra-luxury",
    highlights: ["Overwater villas", "Retractable roof", "Private pools", "Michelin-starred dining"],
    priceRange: "$$$$$",
    rating: 4.9,
    reviews: 412,
    description:
      "Ultra-luxury overwater villas with retractable glass roofs, private pools, and world-class dining. The epitome of Maldives luxury.",
    amenities: [
      "Overwater villas",
      "Private pools",
      "Michelin-starred restaurant",
      "Spa",
      "Water sports",
      "Diving center",
    ],
    bestFor: ["Honeymoons", "Luxury vacations", "Special occasions"],
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
  },
  {
    id: 2,
    name: "The Muraka",
    atoll: "Alif Alif",
    atollSlug: "alif-alif",
    category: "ultra-luxury",
    highlights: ["Underwater villa", "Private chef", "Infinity pool", "Exclusive experience"],
    priceRange: "$$$$$",
    rating: 5.0,
    reviews: 287,
    description:
      "Exclusive underwater villa with private chef, infinity pool, and unparalleled privacy. The ultimate luxury Maldives experience.",
    amenities: [
      "Underwater villa",
      "Private chef",
      "Infinity pool",
      "Spa",
      "Personal butler",
      "Water sports",
    ],
    bestFor: ["Honeymoons", "Romantic getaways", "Luxury travelers"],
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
  },
  {
    id: 3,
    name: "Gili Lankanfushi",
    atoll: "Kaafu",
    atollSlug: "kaafu",
    category: "ultra-luxury",
    highlights: ["Overwater villas", "No shoes policy", "Spa", "Organic cuisine"],
    priceRange: "$$$$$",
    rating: 4.8,
    reviews: 356,
    description:
      "Exclusive barefoot luxury resort with overwater villas, world-class spa, and organic cuisine. Perfect for a peaceful escape.",
    amenities: [
      "Overwater villas",
      "Spa",
      "Organic restaurant",
      "Yoga",
      "Diving",
      "Water sports",
    ],
    bestFor: ["Wellness retreats", "Romantic vacations", "Luxury travelers"],
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
  },
  {
    id: 4,
    name: "Angsana Laguna",
    atoll: "Alif Dhaal",
    atollSlug: "alif-dhaal",
    category: "luxury",
    highlights: ["Beachfront villas", "Diving center", "Multiple restaurants", "Water sports"],
    priceRange: "$$$$",
    rating: 4.7,
    reviews: 298,
    description:
      "Luxury beachfront resort with excellent diving facilities, multiple dining options, and comprehensive water sports.",
    amenities: [
      "Beachfront villas",
      "Diving center",
      "Multiple restaurants",
      "Spa",
      "Water sports",
      "Snorkeling",
    ],
    bestFor: ["Diving vacations", "Family trips", "Adventure travel"],
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
  },
  {
    id: 5,
    name: "Lhaviyani Island",
    atoll: "Lhaviyani",
    atollSlug: "lhaviyani",
    category: "luxury",
    highlights: ["Overwater villas", "House reef", "Spa", "Fine dining"],
    priceRange: "$$$$",
    rating: 4.6,
    reviews: 267,
    description:
      "Luxury overwater resort with pristine house reef, world-class spa, and exceptional fine dining experiences.",
    amenities: [
      "Overwater villas",
      "House reef",
      "Spa",
      "Fine dining",
      "Diving",
      "Water sports",
    ],
    bestFor: ["Luxury vacations", "Honeymoons", "Diving trips"],
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
  },
  {
    id: 6,
    name: "Baros Maldives",
    atoll: "Kaafu",
    atollSlug: "kaafu",
    category: "premium",
    highlights: ["Beachfront villas", "Excellent diving", "Spa", "Multiple restaurants"],
    priceRange: "$$$",
    rating: 4.5,
    reviews: 234,
    description:
      "Premium beachfront resort with excellent diving, world-class spa, and diverse dining options. Great value for luxury.",
    amenities: [
      "Beachfront villas",
      "Diving center",
      "Spa",
      "Multiple restaurants",
      "Water sports",
      "Snorkeling",
    ],
    bestFor: ["Luxury vacations", "Diving trips", "Romantic getaways"],
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  "ultra-luxury": "bg-purple-100 text-purple-800",
  luxury: "bg-blue-100 text-blue-800",
  premium: "bg-cyan-100 text-cyan-800",
};

export default function LuxuryResorts() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [filteredResorts, setFilteredResorts] = useState(LUXURY_RESORTS);

  useEffect(() => {
    // Update meta tags for SEO
    updateMetaTags({
      title: "Luxury Resorts in the Maldives | Isle Nomads",
      description:
        "Discover the finest luxury resorts in the Maldives. From ultra-luxury overwater villas to premium beachfront properties. Plan your luxury getaway.",
      keywords:
        "luxury resorts maldives, best resorts, overwater bungalows, maldives hotels, luxury vacation",
      ogTitle: "Experience Luxury in the Maldives",
      ogDescription:
        "Explore our curated selection of the finest luxury resorts in the Maldives with world-class amenities and unforgettable experiences.",
    });

    // Filter resorts
    let filtered = LUXURY_RESORTS;

    if (searchTerm) {
      filtered = filtered.filter(
        (resort) =>
          resort.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          resort.atoll.toLowerCase().includes(searchTerm.toLowerCase()) ||
          resort.amenities.some((a) => a.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter((resort) => resort.category === selectedCategory);
    }

    setFilteredResorts(filtered);
  }, [searchTerm, selectedCategory]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      {/* Hero Section */}
      <section className="relative py-16 md:py-24 bg-gradient-to-b from-primary/10 to-transparent">
        <div className="container max-w-4xl">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Crown className="w-8 h-8 text-accent" />
              <span className="text-accent font-semibold">Luxury Experiences</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Luxury Resorts in the Maldives
            </h1>
            <p className="text-lg text-gray-700 leading-relaxed">
              Experience the pinnacle of luxury with our curated selection of the finest resorts
              in the Maldives. From ultra-luxury overwater villas to premium beachfront properties,
              discover unforgettable experiences in paradise.
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
                placeholder="Search resorts, atolls, or amenities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-12"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              onClick={() => setSelectedCategory(null)}
              size="sm"
            >
              All Categories
            </Button>
            {["ultra-luxury", "luxury", "premium"].map((cat) => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? "default" : "outline"}
                onClick={() => setSelectedCategory(cat)}
                size="sm"
              >
                {cat === "ultra-luxury" ? "Ultra-Luxury" : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </Button>
            ))}
          </div>

          <p className="text-sm text-gray-600">
            Showing {filteredResorts.length} of {LUXURY_RESORTS.length} luxury resorts
          </p>
        </div>
      </section>

      {/* Resorts Grid */}
      <section className="py-12 md:py-16">
        <div className="container max-w-4xl">
          <div className="grid md:grid-cols-2 gap-6">
            {filteredResorts.map((resort) => (
              <Link key={resort.id} href={`/atoll/${resort.atollSlug}`}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer overflow-hidden">
                  {resort.image && (
                    <div className="h-48 overflow-hidden">
                      <img
                        src={resort.image}
                        alt={resort.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <CardTitle className="text-xl">{resort.name}</CardTitle>
                        <CardDescription className="flex items-center gap-1 mt-1">
                          <MapPin className="w-4 h-4" />
                          {resort.atoll}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold text-sm">{resort.rating}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600">{resort.description}</p>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Sparkles className="w-4 h-4 text-accent" />
                        <span className="font-semibold">Price Range:</span>
                        <span>{resort.priceRange}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-gray-700">Key Amenities</p>
                      <div className="flex flex-wrap gap-1">
                        {resort.amenities.slice(0, 3).map((amenity, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {amenity}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-gray-700">Best For</p>
                      <div className="flex flex-wrap gap-1">
                        {resort.bestFor.map((use, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {use}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-sm text-gray-600">{resort.reviews} reviews</span>
                      <Badge className={CATEGORY_COLORS[resort.category]}>
                        {resort.category === "ultra-luxury"
                          ? "Ultra-Luxury"
                          : resort.category.charAt(0).toUpperCase() + resort.category.slice(1)}
                      </Badge>
                    </div>

                    <Button variant="ghost" className="w-full group mt-2" asChild>
                      <div>
                        Explore Resort
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {filteredResorts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">
                No resorts match your search. Try adjusting your filters.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Luxury Section */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container max-w-4xl">
          <h2 className="text-3xl font-bold mb-8">Why Choose Luxury in the Maldives?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Heart,
                title: "Unparalleled Romance",
                description:
                  "Create unforgettable memories with your loved one in the world's most romantic destination.",
              },
              {
                icon: Utensils,
                title: "World-Class Dining",
                description:
                  "Experience Michelin-starred cuisine and innovative culinary creations by renowned chefs.",
              },
              {
                icon: Palmtree,
                title: "Ultimate Privacy",
                description:
                  "Enjoy complete seclusion with private villas, personal butlers, and exclusive island experiences.",
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

      {/* Resort Categories Section */}
      <section className="py-12 md:py-16">
        <div className="container max-w-4xl">
          <h2 className="text-3xl font-bold mb-8">Resort Categories</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Ultra-Luxury",
                description: "The pinnacle of luxury with exclusive amenities, private villas, and personalized service.",
                price: "$$$$$",
              },
              {
                title: "Luxury",
                description: "Premium experiences with excellent amenities, fine dining, and world-class service.",
                price: "$$$$",
              },
              {
                title: "Premium",
                description: "High-quality accommodations with great amenities and excellent value for money.",
                price: "$$$",
              },
            ].map((cat, idx) => (
              <div key={idx} className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg p-6 border">
                <h3 className="text-lg font-semibold mb-2">{cat.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{cat.description}</p>
                <p className="text-lg font-bold text-accent">{cat.price}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-gradient-to-r from-primary to-primary/80 text-white">
        <div className="container max-w-4xl text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">Ready for Luxury?</h2>
          <p className="text-lg text-primary-foreground/90">
            Let us help you plan your perfect luxury escape to the Maldives.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/packages">View Packages</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
