import { useState } from "react";
import { useParams } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MapPin,
  Plane,
  Waves,
  Utensils,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  Users,
  HelpCircle,
  Share2,
  BookOpen,
} from "lucide-react";
import { getIslandGuide } from "@/data/islandGuides";

export default function IslandGuide() {
  const { islandId = "male-guide" } = useParams();
  const guide = getIslandGuide(islandId);
  const [activeTab, setActiveTab] = useState("overview");

  if (!guide) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Island Guide Not Found</h2>
            <p className="text-muted-foreground mb-4">
              The island guide you're looking for doesn't exist.
            </p>
            <Button variant="outline">Back to Maps</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-12">
        <div className="container">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-5 h-5" />
                <span className="text-sm opacity-90">{guide.atoll}</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">{guide.name}</h1>
              <p className="text-lg opacity-90">Complete Travel Guide & Itineraries</p>
            </div>
            <Button variant="outline" className="gap-2">
              <Share2 className="w-4 h-4" />
              Share
            </Button>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <div className="sticky top-0 z-40 bg-background border-b">
        <div className="container">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full justify-start overflow-x-auto rounded-none border-0 bg-transparent p-0">
              <TabsTrigger value="overview" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent">
                Overview
              </TabsTrigger>
              <TabsTrigger value="facts" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent">
                Quick Facts
              </TabsTrigger>
              <TabsTrigger value="getting-there" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent">
                Getting There
              </TabsTrigger>
              <TabsTrigger value="activities" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent">
                Activities
              </TabsTrigger>
              <TabsTrigger value="water-sports" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent">
                Water Sports
              </TabsTrigger>
              <TabsTrigger value="food" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent">
                Food & Cafés
              </TabsTrigger>
              <TabsTrigger value="practical" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent">
                Practical Info
              </TabsTrigger>
              <TabsTrigger value="itineraries" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent">
                Itineraries
              </TabsTrigger>
              <TabsTrigger value="faq" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent">
                FAQ
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Content */}
      <div className="container py-12">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          {/* Overview */}
          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-lg leading-relaxed">{guide.overview}</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <Card className="bg-accent/10 border-accent/20">
                    <CardContent className="pt-6">
                      <p className="text-sm text-muted-foreground mb-1">Atoll</p>
                      <p className="text-xl font-semibold">{guide.atoll}</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-accent/10 border-accent/20">
                    <CardContent className="pt-6">
                      <p className="text-sm text-muted-foreground mb-1">Coordinates</p>
                      <p className="text-sm font-mono">
                        {guide.coordinates.latitude.toFixed(4)}, {guide.coordinates.longitude.toFixed(4)}
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="bg-accent/10 border-accent/20">
                    <CardContent className="pt-6">
                      <p className="text-sm text-muted-foreground mb-1">Best Time</p>
                      <p className="text-sm font-semibold">Nov - Apr</p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Quick Facts */}
          <TabsContent value="facts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Facts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {guide.quickFacts.map((fact, idx) => (
                    <div key={idx} className="flex gap-3 p-3 bg-secondary/50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                      <p className="text-sm">{fact}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* How to Get There */}
          <TabsContent value="getting-there" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Plane className="w-5 h-5" />
                    By Flight
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {guide.howToGetThere.flight}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Waves className="w-5 h-5" />
                    Speedboat
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {guide.howToGetThere.speedboat}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Waves className="w-5 h-5" />
                    Ferry
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {guide.howToGetThere.ferry}
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Top Things to Do */}
          <TabsContent value="activities" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {guide.topThingsToDo.map((activity, idx) => (
                <Card key={idx}>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <span className="text-2xl">{activity.icon}</span>
                      {activity.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {activity.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Water Sports */}
          <TabsContent value="water-sports" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Snorkeling */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Snorkeling Guide</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="font-semibold text-sm mb-2">Best Spots</p>
                    <ul className="space-y-1">
                      {guide.snorkelingGuide.bestSpots.map((spot, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground flex gap-2">
                          <span className="text-accent">•</span> {spot}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold text-sm mb-1">Difficulty</p>
                    <p className="text-sm text-muted-foreground">
                      {guide.snorkelingGuide.difficulty}
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-sm mb-1">Seasonal Tips</p>
                    <p className="text-sm text-muted-foreground">
                      {guide.snorkelingGuide.seasonalTips}
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-sm mb-2">Safety Tips</p>
                    <ul className="space-y-1">
                      {guide.snorkelingGuide.safetyTips.map((tip, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground flex gap-2">
                          <AlertCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Diving */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Diving Guide</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="font-semibold text-sm mb-2">Best Sites</p>
                    <ul className="space-y-1">
                      {guide.divingGuide.bestSites.map((site, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground flex gap-2">
                          <span className="text-accent">•</span> {site}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="font-semibold text-sm mb-1">Difficulty</p>
                      <p className="text-sm text-muted-foreground">
                        {guide.divingGuide.difficulty}
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold text-sm mb-1">Depth Range</p>
                      <p className="text-sm text-muted-foreground">
                        {guide.divingGuide.depthRange}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-sm mb-2">Safety Tips</p>
                    <ul className="space-y-1">
                      {guide.divingGuide.safetyTips.map((tip, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground flex gap-2">
                          <AlertCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Sandbank & Dolphin Trips */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg">Sandbank & Dolphin Trips</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    {guide.sandbankDolphinTrips.description}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Best Time</p>
                      <p className="font-semibold text-sm">
                        {guide.sandbankDolphinTrips.bestTime}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Duration</p>
                      <p className="font-semibold text-sm">
                        {guide.sandbankDolphinTrips.duration}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Price</p>
                      <p className="font-semibold text-sm text-accent">
                        {guide.sandbankDolphinTrips.price}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Tips</p>
                      <ul className="space-y-1">
                        {guide.sandbankDolphinTrips.tips.slice(0, 2).map((tip, idx) => (
                          <li key={idx} className="text-xs text-muted-foreground">
                            • {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Food & Cafés */}
          <TabsContent value="food" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {guide.foodCafes.map((cafe, idx) => (
                <Card key={idx}>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Utensils className="w-5 h-5" />
                        {cafe.name}
                      </span>
                      <span className="text-xs font-normal text-muted-foreground bg-secondary px-2 py-1 rounded">
                        {cafe.type}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Cuisine</span>
                      <span className="text-sm font-semibold">{cafe.cuisine}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Price Range</span>
                      <span className="text-sm font-semibold text-accent">
                        {cafe.priceRange}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Highlights</p>
                      <div className="flex flex-wrap gap-2">
                        {cafe.highlights.map((highlight, hIdx) => (
                          <span
                            key={hIdx}
                            className="text-xs bg-accent/20 text-accent px-2 py-1 rounded"
                          >
                            {highlight}
                          </span>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Practical Info */}
          <TabsContent value="practical" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Essential Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Currency</p>
                    <p className="font-semibold">{guide.practicalInfo.currency}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Language</p>
                    <p className="font-semibold">{guide.practicalInfo.language}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Best Time to Visit</p>
                    <p className="font-semibold">{guide.practicalInfo.bestTimeToVisit}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Emergency Contacts</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {guide.practicalInfo.emergencyContacts.map((contact, idx) => (
                      <li key={idx} className="text-sm">
                        <p className="text-muted-foreground">{contact}</p>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg">What to Pack</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {guide.practicalInfo.whatToPack.map((item, idx) => (
                      <div key={idx} className="flex gap-2">
                        <CheckCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                        <p className="text-sm">{item}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg">Health Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {guide.practicalInfo.healthTips.map((tip, idx) => (
                      <li key={idx} className="flex gap-2">
                        <AlertCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                        <p className="text-sm">{tip}</p>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Itineraries */}
          <TabsContent value="itineraries" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 3-Day Itinerary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    3-Day Itinerary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {guide.itineraries.threeDays.map((day) => (
                    <div key={day.day} className="border-l-2 border-accent pl-4 pb-4">
                      <p className="font-semibold mb-2">Day {day.day}</p>
                      <ul className="space-y-1 mb-3">
                        {day.activities.map((activity, idx) => (
                          <li key={idx} className="text-sm text-muted-foreground flex gap-2">
                            <span className="text-accent">•</span> {activity}
                          </li>
                        ))}
                      </ul>
                      <p className="text-xs text-muted-foreground italic">
                        {day.notes}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* 5-Day Itinerary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    5-Day Itinerary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {guide.itineraries.fiveDays.map((day) => (
                    <div key={day.day} className="border-l-2 border-accent pl-4 pb-4">
                      <p className="font-semibold mb-2">Day {day.day}</p>
                      <ul className="space-y-1 mb-3">
                        {day.activities.slice(0, 2).map((activity, idx) => (
                          <li key={idx} className="text-sm text-muted-foreground flex gap-2">
                            <span className="text-accent">•</span> {activity}
                          </li>
                        ))}
                        {day.activities.length > 2 && (
                          <li className="text-sm text-muted-foreground flex gap-2">
                            <span className="text-accent">•</span> ...and more
                          </li>
                        )}
                      </ul>
                      <p className="text-xs text-muted-foreground italic">
                        {day.notes}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* FAQ */}
          <TabsContent value="faq" className="space-y-6">
            <div className="space-y-4">
              {guide.faq.map((item, idx) => (
                <Card key={idx}>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <HelpCircle className="w-5 h-5 text-accent" />
                      {item.question}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{item.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* CTA Section */}
      <section className="bg-accent/10 border-t py-12">
        <div className="container text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Explore?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Start planning your {guide.name} adventure today. Use our trip planner to create a customized itinerary.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="gap-2">
              <MapPin className="w-5 h-5" />
              Plan Your Trip
            </Button>
            <Button size="lg" variant="outline" className="gap-2">
              <Users className="w-5 h-5" />
              Request Custom Pricing
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
