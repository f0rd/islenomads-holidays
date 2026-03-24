import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface Activity {
  title: string;
  description?: string;
  tips?: string[];
  duration?: string;
  difficulty?: "Easy" | "Moderate" | "Difficult";
  bestTime?: string;
  image?: string;
}

interface ThingsToDo {
  title: string;
  description: string;
  tips?: string[];
  duration?: string;
  difficulty?: "Easy" | "Moderate" | "Difficult";
  bestTime?: string;
  image?: string;
}

interface ThingsToDoSectionProps {
  activities: (Activity | string | ThingsToDo)[];
  islandName: string;
}

export default function ThingsToDoSection({ activities, islandName }: ThingsToDoSectionProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  // Normalize activities to consistent format
  const normalizedActivities = activities.map((activity, index) => {
    if (typeof activity === "string") {
      return {
        title: activity,
        description: "",
        tips: [],
        duration: undefined,
        difficulty: undefined,
        bestTime: undefined,
        image: undefined,
      };
    }
    if ("title" in activity) {
      return activity as ThingsToDo;
    }
    return activity as Activity;
  });

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800";
      case "Moderate":
        return "bg-yellow-100 text-yellow-800";
      case "Difficult":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="w-full bg-gradient-to-b from-background to-background/50 py-12">
      <div className="container">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Things to Do
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Discover the best activities and experiences {islandName} has to offer
          </p>
        </div>

        {/* Activities List */}
        <div className="space-y-6 max-w-4xl mx-auto">
          {normalizedActivities.map((activity, index) => (
            <div
              key={index}
              className="bg-card rounded-lg border border-border overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Activity Header - Always Visible */}
              <button
                onClick={() =>
                  setExpandedIndex(expandedIndex === index ? null : index)
                }
                className="w-full p-6 flex items-start justify-between gap-4 hover:bg-accent/5 transition-colors"
              >
                <div className="flex items-start gap-4 flex-1 text-left">
                  {/* Number Badge */}
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold text-lg">
                    {index + 1}
                  </div>

                  {/* Title and Meta */}
                  <div className="flex-1">
                    <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2">
                      {activity.title}
                    </h3>

                    {/* Meta Information - Visible in collapsed state */}
                    <div className="flex flex-wrap gap-3 items-center">
                      {activity.duration && (
                        <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                          ⏱️ {activity.duration}
                        </span>
                      )}
                      {activity.difficulty && (
                        <span
                          className={`text-sm px-3 py-1 rounded-full ${getDifficultyColor(
                            activity.difficulty
                          )}`}
                        >
                          📊 {activity.difficulty}
                        </span>
                      )}
                      {activity.bestTime && (
                        <span className="text-sm bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
                          🗓️ {activity.bestTime}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Expand/Collapse Icon */}
                <div className="flex-shrink-0 text-accent">
                  {expandedIndex === index ? (
                    <ChevronUp size={24} />
                  ) : (
                    <ChevronDown size={24} />
                  )}
                </div>
              </button>

              {/* Expanded Content */}
              {expandedIndex === index && (
                <div className="border-t border-border px-6 py-6 bg-background/50">
                  {/* Hero Image */}
                  {activity.image && (
                    <div className="mb-6 rounded-lg overflow-hidden">
                      <img
                        src={activity.image}
                        alt={activity.title}
                        className="w-full h-64 object-cover"
                      />
                    </div>
                  )}

                  {/* Description */}
                  {activity.description && (
                    <div className="mb-6">
                      <p className="text-foreground/80 leading-relaxed whitespace-pre-wrap">
                        {activity.description}
                      </p>
                    </div>
                  )}

                  {/* Tips Section */}
                  {activity.tips && activity.tips.length > 0 && (
                    <div className="mb-6 bg-accent/10 border-l-4 border-accent p-4 rounded">
                      <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                        💡 Practical Tips
                      </h4>
                      <ul className="space-y-2">
                        {activity.tips.map((tip, tipIndex) => (
                          <li
                            key={tipIndex}
                            className="text-foreground/80 flex gap-2"
                          >
                            <span className="text-accent font-bold">•</span>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Empty State */}
        {normalizedActivities.length === 0 && (
          <div className="text-center py-12">
            <p className="text-foreground/60 text-lg">
              No activities available for this island yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
