import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle, Lightbulb, TrendingUp } from "lucide-react";
import {
  getWeatherForecast,
  calculateTravelScore,
  getActivityRecommendations,
  TravelRecommendation,
  WeatherForecast,
} from "@/utils/weatherService";

interface WeatherRecommendationsProps {
  destinations: Array<{
    id: string;
    name: string;
    lat: number;
    lng: number;
  }>;
  startDate: string;
  endDate: string;
}

export default function WeatherRecommendations({
  destinations,
  startDate,
  endDate,
}: WeatherRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<
    Record<string, TravelRecommendation>
  >({});
  const [forecasts, setForecasts] = useState<Record<string, WeatherForecast[]>>(
    {}
  );
  const [loading, setLoading] = useState(true);
  const [bestDestination, setBestDestination] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllForecasts = async () => {
      setLoading(true);
      const allRecs: Record<string, TravelRecommendation> = {};
      const allForecasts: Record<string, WeatherForecast[]> = {};
      let bestScore = -1;
      let bestDest = null;

      for (const dest of destinations) {
        try {
          const forecast = await getWeatherForecast(dest.lat, dest.lng, 14);
          allForecasts[dest.name] = forecast;

          if (forecast.length > 0) {
            const rec = calculateTravelScore(forecast);
            allRecs[dest.name] = rec;

            if (rec.score > bestScore) {
              bestScore = rec.score;
              bestDest = dest.name;
            }
          }
        } catch (error) {
          console.error(`Failed to fetch weather for ${dest.name}:`, error);
        }
      }

      setRecommendations(allRecs);
      setForecasts(allForecasts);
      setBestDestination(bestDest);
      setLoading(false);
    };

    if (destinations.length > 0) {
      fetchAllForecasts();
    }
  }, [destinations]);

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center h-32">
            <p className="text-muted-foreground">Loading weather recommendations...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const destRecommendations = Object.entries(recommendations);

  return (
    <div className="space-y-4">
      {/* Best Destination Highlight */}
      {bestDestination && recommendations[bestDestination] && (
        <Card className="border-2 border-green-500 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-900">
              <TrendingUp className="w-5 h-5" />
              Best Weather Destination
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-green-900 mb-2">
                  {bestDestination}
                </p>
                <p className="text-green-800">
                  {recommendations[bestDestination].recommendation}
                </p>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-green-600">
                  {recommendations[bestDestination].score}
                </div>
                <p className="text-sm text-green-700">Travel Score</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Destination Comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-600" />
            Weather Comparison
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {destRecommendations.map(([destName, rec]) => (
            <div
              key={destName}
              className={`p-4 rounded-lg border-2 ${
                rec.score >= 70
                  ? "border-green-200 bg-green-50"
                  : rec.score >= 50
                    ? "border-yellow-200 bg-yellow-50"
                    : "border-red-200 bg-red-50"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-bold text-foreground text-lg">{destName}</p>
                  <p
                    className={`text-sm font-medium ${
                      rec.score >= 70
                        ? "text-green-700"
                        : rec.score >= 50
                          ? "text-yellow-700"
                          : "text-red-700"
                    }`}
                  >
                    {rec.recommendation}
                  </p>
                </div>
                <div className="text-right">
                  <div
                    className={`text-3xl font-bold ${
                      rec.score >= 70
                        ? "text-green-600"
                        : rec.score >= 50
                          ? "text-yellow-600"
                          : "text-red-600"
                    }`}
                  >
                    {rec.score}
                  </div>
                  <p className="text-xs text-muted-foreground">Score</p>
                </div>
              </div>

              {/* Recommended Activities */}
              {rec.bestActivities.length > 0 && (
                <div className="mb-3">
                  <p className="text-sm font-semibold text-foreground mb-2 flex items-center gap-1">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Best Activities
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {rec.bestActivities.slice(0, 3).map((activity, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium"
                      >
                        {activity}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Alerts */}
              {rec.alerts.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-foreground mb-2 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4 text-yellow-600" />
                    Weather Alerts
                  </p>
                  <div className="space-y-1">
                    {rec.alerts.map((alert, idx) => (
                      <p
                        key={idx}
                        className={`text-xs ${
                          alert.severity === "high"
                            ? "text-red-700"
                            : alert.severity === "medium"
                              ? "text-yellow-700"
                              : "text-blue-700"
                        }`}
                      >
                        • {alert.message}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* General Weather Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Travel Tips Based on Weather</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex gap-2">
            <span className="text-yellow-600">☀️</span>
            <p>
              <strong>Sun Protection:</strong> Use SPF 50+ sunscreen and reapply every 2 hours,
              especially near water
            </p>
          </div>
          <div className="flex gap-2">
            <span className="text-blue-600">💧</span>
            <p>
              <strong>Hydration:</strong> Drink plenty of water in tropical climates to stay
              hydrated
            </p>
          </div>
          <div className="flex gap-2">
            <span className="text-cyan-600">🌊</span>
            <p>
              <strong>Water Safety:</strong> Check local conditions before water activities and
              follow guide instructions
            </p>
          </div>
          <div className="flex gap-2">
            <span className="text-gray-600">🌧️</span>
            <p>
              <strong>Rainy Season:</strong> Pack lightweight rain gear and plan indoor activities
              as backup
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
