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
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

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
        return "bg-emerald-500/20 text-emerald-600 border border-emerald-200";
      case "Moderate":
        return "bg-amber-500/20 text-amber-600 border border-amber-200";
      case "Difficult":
        return "bg-rose-500/20 text-rose-600 border border-rose-200";
      default:
        return "bg-slate-500/20 text-slate-600 border border-slate-200";
    }
  };

  return (
    <div className="w-full bg-gradient-to-b from-background via-background to-background/80 py-16 md:py-20">
      <div className="container">
        {/* Section Header - Modern */}
        <div className="mb-16 text-center space-y-4">
          <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-accent via-accent to-accent/70 bg-clip-text text-transparent">
            Things to Do
          </h2>
          <p className="text-lg md:text-xl text-foreground/60 max-w-2xl mx-auto font-light">
            Discover the best activities and experiences {islandName} has to offer
          </p>
          <div className="h-1 w-20 bg-gradient-to-r from-accent to-accent/50 mx-auto rounded-full" />
        </div>

        {/* Activities List - Modern Grid */}
        <div className="space-y-4 max-w-4xl mx-auto">
          {normalizedActivities.map((activity, index) => (
            <div
              key={index}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="group"
            >
              {/* Activity Card - Modern Design */}
              <button
                onClick={() =>
                  setExpandedIndex(expandedIndex === index ? null : index)
                }
                className="w-full text-left"
              >
                <div className="relative overflow-hidden rounded-xl border border-border/40 bg-gradient-to-br from-card/60 via-card/40 to-card/20 backdrop-blur-sm transition-all duration-300 hover:border-accent/40 hover:shadow-xl hover:shadow-accent/10">
                  {/* Animated gradient background on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-b from-accent/2 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Content */}
                  <div className="relative p-6 md:p-8 flex items-center justify-between gap-6">
                    {/* Left Side - Number and Title */}
                    <div className="flex items-center gap-5 flex-1 min-w-0">
                      {/* Modern Number Badge */}
                      <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-accent to-accent/80 text-white flex items-center justify-center font-bold text-xl shadow-lg shadow-accent/30 group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-accent/40 transition-all duration-300">
                        {index + 1}
                      </div>

                      {/* Title and Meta */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl md:text-2xl font-bold text-foreground group-hover:text-accent transition-colors duration-300 truncate">
                          {activity.title}
                        </h3>

                        {/* Meta Information - Modern Badges */}
                        <div className="flex flex-wrap gap-2 items-center mt-3">
                          {activity.duration && (
                            <span className="text-xs md:text-sm bg-blue-500/15 text-blue-600 px-3 py-1 rounded-full border border-blue-200/50 font-medium">
                              ⏱️ {activity.duration}
                            </span>
                          )}
                          {activity.difficulty && (
                            <span
                              className={`text-xs md:text-sm px-3 py-1 rounded-full font-medium ${getDifficultyColor(
                                activity.difficulty
                              )}`}
                            >
                              📊 {activity.difficulty}
                            </span>
                          )}
                          {activity.bestTime && (
                            <span className="text-xs md:text-sm bg-purple-500/15 text-purple-600 px-3 py-1 rounded-full border border-purple-200/50 font-medium">
                              🗓️ {activity.bestTime}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Expand/Collapse Icon - Modern */}
                    <div className="flex-shrink-0 text-accent transition-all duration-300 group-hover:scale-125">
                      {expandedIndex === index ? (
                        <ChevronUp size={24} className="animate-in fade-in" />
                      ) : (
                        <ChevronDown size={24} className="group-hover:translate-y-1 transition-transform" />
                      )}
                    </div>
                  </div>
                </div>
              </button>

              {/* Expanded Content - Modern */}
              {expandedIndex === index && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="mt-2 rounded-xl border border-accent/20 bg-gradient-to-br from-accent/8 via-accent/5 to-transparent backdrop-blur-sm p-6 md:p-8 space-y-6">
                    {/* Hero Image */}
                    {activity.image && (
                      <div className="rounded-lg overflow-hidden shadow-lg">
                        <img
                          src={activity.image}
                          alt={activity.title}
                          className="w-full h-64 md:h-80 object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}

                    {/* Description */}
                    {activity.description && (
                      <div>
                        <p className="text-foreground/80 leading-relaxed text-base md:text-lg whitespace-pre-wrap">
                          {activity.description}
                        </p>
                      </div>
                    )}

                    {/* Tips Section - Modern */}
                    {activity.tips && activity.tips.length > 0 && (
                      <div className="bg-gradient-to-r from-accent/10 to-accent/5 border-l-4 border-accent p-5 rounded-lg space-y-3">
                        <h4 className="font-semibold text-foreground flex items-center gap-2 text-lg">
                          💡 Practical Tips
                        </h4>
                        <ul className="space-y-2">
                          {activity.tips.map((tip, tipIndex) => (
                            <li
                              key={tipIndex}
                              className="text-foreground/70 flex gap-3 text-sm md:text-base"
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
          <div className="text-center py-16">
            <p className="text-foreground/60 text-lg">
              No activities available for this island yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
