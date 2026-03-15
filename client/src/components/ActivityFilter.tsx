import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export const ACTIVITIES = [
  "Diving",
  "Snorkeling",
  "Surfing",
  "Fishing",
  "Beach Relaxation",
  "Local Culture",
  "Water Sports",
  "Island Hopping",
  "Photography",
  "Local Cuisine",
  "Beach Activities",
  "Local Exploration",
] as const;

export type Activity = (typeof ACTIVITIES)[number];

interface ActivityFilterProps {
  selectedActivities: Activity[];
  onActivityChange: (activities: Activity[]) => void;
}

export function ActivityFilter({
  selectedActivities,
  onActivityChange,
}: ActivityFilterProps) {
  const toggleActivity = (activity: Activity) => {
    if (selectedActivities.includes(activity)) {
      onActivityChange(selectedActivities.filter((a) => a !== activity));
    } else {
      onActivityChange([...selectedActivities, activity]);
    }
  };

  const clearAll = () => {
    onActivityChange([]);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Filter by Activity</h3>
        {selectedActivities.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAll}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Clear All
          </Button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {ACTIVITIES.map((activity) => (
          <Badge
            key={activity}
            variant={
              selectedActivities.includes(activity) ? "default" : "outline"
            }
            className="cursor-pointer transition-all hover:opacity-80"
            onClick={() => toggleActivity(activity)}
          >
            {activity}
            {selectedActivities.includes(activity) && (
              <X className="ml-1 h-3 w-3" />
            )}
          </Badge>
        ))}
      </div>

      {selectedActivities.length > 0 && (
        <p className="text-xs text-muted-foreground">
          Showing islands with: {selectedActivities.join(", ")}
        </p>
      )}
    </div>
  );
}
