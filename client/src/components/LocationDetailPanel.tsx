import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Share2, Heart, MapPin, Star, Clock, DollarSign, Users, Zap } from "lucide-react";
import { Link } from "wouter";

interface LocationDetailPanelProps {
  location: any;
  type: "island" | "resort" | "dive" | "surf" | "airport" | "atoll";
  onClose: () => void;
}

export default function LocationDetailPanel({
  location,
  type,
  onClose,
}: LocationDetailPanelProps) {
  if (!location) return null;

  const getHeaderColor = () => {
    switch (type) {
      case "island":
        return "bg-green-50 border-green-600";
      case "resort":
        return "bg-purple-50 border-purple-600";
      case "dive":
        return "bg-cyan-50 border-cyan-600";
      case "surf":
        return "bg-amber-50 border-amber-600";
      case "airport":
        return "bg-indigo-50 border-indigo-600";
      case "atoll":
        return "bg-teal-50 border-teal-600";
      default:
        return "bg-gray-50 border-gray-600";
    }
  };

  const getHeaderTextColor = () => {
    switch (type) {
      case "island":
        return "text-green-900";
      case "resort":
        return "text-purple-900";
      case "dive":
        return "text-cyan-900";
      case "surf":
        return "text-amber-900";
      case "airport":
        return "text-indigo-900";
      case "atoll":
        return "text-teal-900";
      default:
        return "text-gray-900";
    }
  };

  const getIcon = () => {
    switch (type) {
      case "island":
        return "🏝️";
      case "resort":
        return "🏨";
      case "dive":
        return "🤿";
      case "surf":
        return "🏄";
      case "airport":
        return "✈️";
      case "atoll":
        return "🌊";
      default:
        return "📍";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-40 flex items-end md:items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-t-2xl md:rounded-2xl shadow-2xl">
        {/* Header with Close Button */}
        <CardHeader className={`${getHeaderColor()} border-b-2 relative`}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1">
              <div className="text-4xl">{getIcon()}</div>
              <div>
                <CardTitle className={`${getHeaderTextColor()} text-2xl`}>
                  {location.name}
                </CardTitle>
                {location.category && (
                  <p className={`text-sm ${getHeaderTextColor()} opacity-75 mt-1`}>
                    {location.category}
                  </p>
                )}
                {location.type && (
                  <p className={`text-sm ${getHeaderTextColor()} opacity-75 mt-1`}>
                    {location.type}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/50 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <div className="space-y-6">
            {/* Image Section */}
            {location.image && (
              <div className="w-full h-64 rounded-lg overflow-hidden">
                <img
                  src={location.image}
                  alt={location.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Description */}
            {location.description && (
              <div>
                <h3 className="font-semibold text-foreground mb-2">About</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {location.description}
                </p>
              </div>
            )}

            {/* Highlights/Amenities */}
            {(location.highlights || location.amenities) && (
              <div>
                <h3 className="font-semibold text-foreground mb-3">
                  {location.highlights ? "Highlights" : "Amenities"}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(location.highlights || location.amenities)?.map(
                    (item: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm font-medium"
                      >
                        {item}
                      </span>
                    )
                  )}
                </div>
              </div>
            )}

            {/* Key Information Grid */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
              {location.rating && (
                <div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    Rating
                  </div>
                  <div className="font-semibold text-foreground">
                    {location.rating}/5
                  </div>
                </div>
              )}

              {location.pricePerNight && (
                <div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                    <DollarSign className="w-4 h-4" />
                    Price/Night
                  </div>
                  <div className="font-semibold text-foreground">
                    {location.pricePerNight}
                  </div>
                </div>
              )}

              {location.capacity && (
                <div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                    <Users className="w-4 h-4" />
                    Capacity
                  </div>
                  <div className="font-semibold text-foreground">
                    {location.capacity}
                  </div>
                </div>
              )}

              {location.depth && (
                <div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                    <MapPin className="w-4 h-4" />
                    Depth
                  </div>
                  <div className="font-semibold text-foreground">
                    {location.depth}m
                  </div>
                </div>
              )}

              {location.difficulty && (
                <div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                    <Zap className="w-4 h-4" />
                    Difficulty
                  </div>
                  <div className="font-semibold text-foreground">
                    {location.difficulty}
                  </div>
                </div>
              )}

              {location.lat && location.lng && (
                <>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Latitude</div>
                    <div className="font-semibold text-foreground">
                      {location.lat.toFixed(4)}°N
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Longitude</div>
                    <div className="font-semibold text-foreground">
                      {location.lng.toFixed(4)}°E
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-border space-y-3">
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    navigator.share?.({
                      title: location.name,
                      text: location.description,
                    });
                  }}
                  variant="outline"
                  className="flex-1 gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </Button>
                <Button variant="outline" className="flex-1 gap-2">
                  <Heart className="w-4 h-4" />
                  Save
                </Button>
              </div>

              {type === "resort" && (
                <Link href="/packages">
                  <Button className="w-full gap-2 bg-purple-600 hover:bg-purple-700">
                    Book Now
                  </Button>
                </Link>
              )}

              {type === "island" && (
                <Link href="/trip-planner">
                  <Button className="w-full gap-2 bg-green-600 hover:bg-green-700">
                    Plan Trip
                  </Button>
                </Link>
              )}

              {type === "dive" && (
                <Link href="/packages">
                  <Button className="w-full gap-2 bg-cyan-600 hover:bg-cyan-700">
                    Book Dive
                  </Button>
                </Link>
              )}

              {type === "surf" && (
                <Link href="/packages">
                  <Button className="w-full gap-2 bg-amber-600 hover:bg-amber-700">
                    Book Lesson
                  </Button>
                </Link>
              )}

              <Button
                onClick={onClose}
                variant="outline"
                className="w-full"
              >
                Close
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
