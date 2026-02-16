/**
 * AtollGuide Component
 * Displays comprehensive destination information for Maldives atolls
 * Includes SEO-optimized content, activities, accommodations, and travel tips
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Waves,
  Hotel,
  Utensils,
  Clock,
  Users,
  Star,
  ArrowRight,
} from "lucide-react";

interface AtollGuideProps {
  name: string;
  slug: string;
  description: string;
  overview: string;
  bestFor: string;
  highlights: string[];
  activities: string[];
  accommodation: string[];
  transportation: string;
  bestSeason: string;
  heroImage?: string;
  region?: string;
}

export default function AtollGuide({
  name,
  slug,
  description,
  overview,
  bestFor,
  highlights,
  activities,
  accommodation,
  transportation,
  bestSeason,
  heroImage,
  region,
}: AtollGuideProps) {
  return (
    <div className="w-full space-y-8">
      {/* Hero Section */}
      {heroImage && (
        <div className="relative h-96 rounded-lg overflow-hidden">
          <img
            src={heroImage}
            alt={`${name} - Maldives Atoll`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
            <div className="p-8 text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-2">{name}</h1>
              <p className="text-lg text-gray-200">{description}</p>
            </div>
          </div>
        </div>
      )}

      {/* Overview Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-accent" />
            Atoll Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-700 leading-relaxed">{overview}</p>
          {region && (
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{region} Region</Badge>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Best For Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-accent" />
            Perfect For
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700">{bestFor}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {bestFor.split(",").map((item, index) => (
              <Badge key={index} variant="outline">
                {item.trim()}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Highlights Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Waves className="w-5 h-5 text-accent" />
            Key Highlights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {highlights.map((highlight, index) => (
              <div key={index} className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center">
                  <span className="text-sm font-semibold text-accent">✓</span>
                </div>
                <p className="text-gray-700">{highlight}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Activities Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-accent" />
            Activities & Experiences
          </CardTitle>
          <CardDescription>
            Discover what you can do in {name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {activities.map((activity, index) => (
              <div
                key={index}
                className="p-4 rounded-lg border border-gray-200 hover:border-accent hover:bg-accent/5 transition-all"
              >
                <p className="text-gray-700">{activity}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Accommodation Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Hotel className="w-5 h-5 text-accent" />
            Accommodation Options
          </CardTitle>
          <CardDescription>
            Various lodging choices for every budget
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {accommodation.map((option, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 rounded-lg bg-gray-50"
              >
                <Hotel className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <p className="text-gray-700">{option}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Transportation Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Utensils className="w-5 h-5 text-accent" />
            Getting There
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 leading-relaxed">{transportation}</p>
        </CardContent>
      </Card>

      {/* Best Season Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-accent" />
            Best Time to Visit
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 leading-relaxed">{bestSeason}</p>
        </CardContent>
      </Card>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-primary to-primary/80 rounded-lg p-8 text-white text-center">
        <h3 className="text-2xl font-bold mb-4">Ready to Explore {name}?</h3>
        <p className="mb-6 text-primary-foreground/90">
          Start planning your dream vacation to {name} with Isle Nomads
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" variant="secondary">
            View Packages <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
          <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
            Contact Us
          </Button>
        </div>
      </div>
    </div>
  );
}
