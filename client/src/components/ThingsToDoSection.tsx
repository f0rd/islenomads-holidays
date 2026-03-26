import { useState } from "react";
import { ChevronDown } from "lucide-react";

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
  const normalizedActivities = activities.map((activity) => {
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
        return "bg-emerald-500/20 text-emerald-600 border border-emerald-200";
      case "Moderate":
        return "bg-amber-500/20 text-amber-600 border border-amber-200";
      case "Difficult":
        return "bg-rose-500/20 text-rose-600 border border-rose-200";
      default:
        return "bg-slate-500/20 text-slate-600 border border-slate-200";
    }
  };

  // Get preview text (first 1-2 lines of description)
  const getPreviewText = (description?: string, maxLength: number = 120) => {
    if (!description) return "";
    return description.length > maxLength 
      ? description.substring(0, maxLength) + "..." 
      : description;
  };

  return (
    <div className="w-full space-y-6">
      {/* Section Header */}
      <div className="space-y-2">
        <h3 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
          🎯 Things to Do
        </h3>
        <p className="text-sm md:text-base text-foreground/60">
          Discover the best activities and experiences {islandName} has to offer
        </p>
      </div>

      {/* Accordion List */}
      <div className="space-y-3">
        {normalizedActivities.map((activity, index) => (
          <div key={index} className="group">
            {/* Accordion Header - Preview */}
            <button
              onClick={() =>
                setExpandedIndex(expandedIndex === index ? null : index)
              }
              className="w-full text-left"
            >
              <div className="relative overflow-hidden rounded-lg border border-border/40 bg-gradient-to-br from-card/60 via-card/40 to-card/20 backdrop-blur-sm transition-all duration-300 hover:border-accent/40 hover:shadow-lg hover:shadow-accent/10 group-hover:bg-card/50">
                {/* Animated gradient background on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Content */}
                <div className="relative p-4 md:p-5 flex items-start gap-4">
                  {/* Number Badge */}
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-accent to-accent/80 text-white flex items-center justify-center font-bold text-sm shadow-lg shadow-accent/30 group-hover:scale-105 transition-transform duration-300">
                    {index + 1}
                  </div>

                  {/* Title and Preview */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-base md:text-lg font-bold text-foreground group-hover:text-accent transition-colors duration-300 mb-1">
                      {activity.title}
                    </h4>
                    
                    {/* Preview Text */}
                    {activity.description && (
                      <p className="text-xs md:text-sm text-foreground/60 line-clamp-2">
                        {getPreviewText(activity.description)}
                      </p>
                    )}

                    {/* Meta Badges - Compact */}
                    {(activity.duration || activity.difficulty || activity.bestTime) && (
                      <div className="flex flex-wrap gap-1 items-center mt-2">
                        {activity.duration && (
                          <span className="text-xs bg-blue-500/15 text-blue-600 px-2 py-0.5 rounded-full border border-blue-200/50 font-medium">
                            ⏱️ {activity.duration}
                          </span>
                        )}
                        {activity.difficulty && (
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full font-medium ${getDifficultyColor(
                              activity.difficulty
                            )}`}
                          >
                            {activity.difficulty}
                          </span>
                        )}
                        {activity.bestTime && (
                          <span className="text-xs bg-purple-500/15 text-purple-600 px-2 py-0.5 rounded-full border border-purple-200/50 font-medium">
                            🗓️ {activity.bestTime}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Chevron Icon */}
                  <div className="flex-shrink-0 text-accent transition-transform duration-300"
                    style={{
                      transform: expandedIndex === index ? 'rotate(180deg)' : 'rotate(0deg)'
                    }}
                  >
                    <ChevronDown size={20} />
                  </div>
                </div>
              </div>
            </button>

            {/* Accordion Content - Full Details */}
            {expandedIndex === index && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="mt-2 rounded-lg border border-accent/20 bg-gradient-to-br from-accent/8 via-accent/5 to-transparent backdrop-blur-sm p-5 md:p-6 space-y-5">
                  {/* Hero Image */}
                  {activity.image && (
                    <div className="rounded-lg overflow-hidden shadow-md">
                      <img
                        src={activity.image}
                        alt={activity.title}
                        className="w-full h-40 md:h-56 object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}

                  {/* Full Description */}
                  {activity.description && (
                    <div>
                      <p className="text-foreground/80 leading-relaxed text-sm md:text-base whitespace-pre-wrap">
                        {activity.description}
                      </p>
                    </div>
                  )}

                  {/* Tips Section */}
                  {activity.tips && activity.tips.length > 0 && (
                    <div className="bg-gradient-to-r from-accent/10 to-accent/5 border-l-4 border-accent p-4 rounded-lg space-y-3">
                      <h5 className="font-semibold text-foreground flex items-center gap-2 text-sm md:text-base">
                        💡 Practical Tips
                      </h5>
                      <ul className="space-y-2">
                        {activity.tips.map((tip, tipIndex) => (
                          <li
                            key={tipIndex}
                            className="text-foreground/70 flex gap-3 text-xs md:text-sm"
                          >
                            <span className="text-accent font-bold flex-shrink-0">✓</span>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Empty State */}
      {normalizedActivities.length === 0 && (
        <div className="text-center py-8">
          <p className="text-foreground/60 text-sm">
            No activities available for this island yet.
          </p>
        </div>
      )}
    </div>
  );
}
