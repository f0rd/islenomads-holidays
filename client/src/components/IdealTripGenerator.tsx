import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Sparkles, MapPin, Clock, DollarSign, Users } from "lucide-react";
import {
  generateIdealTrips,
  GeneratedTrip,
  TripPreference,
} from "@/utils/tripGenerator";

interface IdealTripGeneratorProps {
  destinations: string[];
  duration: number;
  travelers: number;
}

export default function IdealTripGenerator({
  destinations,
  duration,
  travelers,
}: IdealTripGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTrips, setGeneratedTrips] = useState<GeneratedTrip[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<GeneratedTrip | null>(null);
  const [preferences, setPreferences] = useState<TripPreference>({
    budget: "mid-range",
    pace: "moderate",
    activities: ["beach", "snorkeling"],
    duration,
    travelers,
    season: "dry",
  });

  const handleGenerateTrips = async () => {
    setIsGenerating(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const trips = generateIdealTrips(destinations, preferences);
    setGeneratedTrips(trips);
    setSelectedTrip(trips[0] || null);

    setIsGenerating(false);
  };

  const handleActivityToggle = (activity: string) => {
    setPreferences((prev) => {
      const activities = prev.activities.includes(activity as any)
        ? prev.activities.filter((a) => a !== activity)
        : [...prev.activities, activity as any];
      return { ...prev, activities };
    });
  };

  return (
    <div className="space-y-6">
      {/* Generator Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-accent" />
            Generate Your Ideal Trip
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Budget Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Budget Range</label>
            <Select
              value={preferences.budget}
              onValueChange={(value: any) =>
                setPreferences((prev) => ({ ...prev, budget: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="budget">Budget</SelectItem>
                <SelectItem value="mid-range">Mid-Range</SelectItem>
                <SelectItem value="luxury">Luxury</SelectItem>
                <SelectItem value="ultra-luxury">Ultra-Luxury</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Pace Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Travel Pace</label>
            <Select
              value={preferences.pace}
              onValueChange={(value: any) =>
                setPreferences((prev) => ({ ...prev, pace: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relaxed">Relaxed (Slow exploration)</SelectItem>
                <SelectItem value="moderate">Moderate (Balanced pace)</SelectItem>
                <SelectItem value="fast">Fast (Action-packed)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Activities Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Activities</label>
            <div className="grid grid-cols-2 gap-2">
              {["diving", "snorkeling", "surfing", "beach", "culture", "adventure"].map(
                (activity) => (
                  <button
                    key={activity}
                    onClick={() => handleActivityToggle(activity)}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      preferences.activities.includes(activity as any)
                        ? "bg-accent text-primary"
                        : "bg-secondary text-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {activity.charAt(0).toUpperCase() + activity.slice(1)}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Generate Button */}
          <Button
            onClick={handleGenerateTrips}
            disabled={isGenerating}
            className="w-full gap-2 bg-accent text-primary hover:bg-accent/90"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate Ideal Trips
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Generated Trips */}
      {generatedTrips.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold">Generated Trip Options</h3>

          <div className="grid gap-4 md:grid-cols-3">
            {generatedTrips.map((trip) => (
              <Card
                key={trip.id}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  selectedTrip?.id === trip.id
                    ? "ring-2 ring-accent"
                    : ""
                }`}
                onClick={() => setSelectedTrip(trip)}
              >
                <CardHeader>
                  <CardTitle className="text-base">{trip.title}</CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <span className="font-semibold text-accent">{trip.score}</span>
                      <span>/ 100</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {trip.description}
                  </p>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-accent" />
                      <span>{trip.duration} days</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-accent" />
                      <span>${trip.estimatedCost.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-accent" />
                      <span>{trip.bestFor.join(", ")}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t">
                    <p className="text-xs text-muted-foreground">
                      {trip.highlights.slice(0, 2).join(" • ")}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Selected Trip Details */}
          {selectedTrip && (
            <Card className="border-accent/50 bg-accent/5">
              <CardHeader>
                <CardTitle>{selectedTrip.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{selectedTrip.description}</p>

                {/* Key Highlights */}
                <div>
                  <h4 className="font-semibold mb-2">Highlights</h4>
                  <ul className="space-y-1">
                    {selectedTrip.highlights.map((highlight, idx) => (
                      <li key={idx} className="text-sm flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Itinerary Preview */}
                <div>
                  <h4 className="font-semibold mb-2">Itinerary Preview</h4>
                  <div className="space-y-2">
                    {selectedTrip.itinerary.slice(0, 3).map((day) => (
                      <div key={day.day} className="text-sm bg-background p-2 rounded">
                        <p className="font-medium">Day {day.day}: {day.destination}</p>
                        <p className="text-muted-foreground text-xs">{day.notes}</p>
                      </div>
                    ))}
                    {selectedTrip.itinerary.length > 3 && (
                      <p className="text-xs text-muted-foreground italic">
                        + {selectedTrip.itinerary.length - 3} more days
                      </p>
                    )}
                  </div>
                </div>

                {/* Cost Breakdown */}
                <div className="bg-background p-3 rounded border">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Estimated Total Cost</span>
                    <span className="text-lg font-bold text-accent">
                      ${selectedTrip.estimatedCost.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    For {travelers} traveler{travelers > 1 ? "s" : ""}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
