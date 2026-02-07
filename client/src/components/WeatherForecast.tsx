import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertCircle,
  Cloud,
  CloudRain,
  Droplets,
  Sun,
  Wind,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import {
  WeatherForecast as WeatherType,
  getWeatherForecast,
  calculateTravelScore,
  getWeatherEmoji,
  getActivityRecommendations,
  isActivitySuitable,
  TravelRecommendation,
} from "@/utils/weatherService";

interface WeatherForecastProps {
  lat: number;
  lng: number;
  destination: string;
  startDate?: string;
  endDate?: string;
}

export default function WeatherForecast({
  lat,
  lng,
  destination,
  startDate,
  endDate,
}: WeatherForecastProps) {
  const [forecast, setForecast] = useState<WeatherType[]>([]);
  const [recommendation, setRecommendation] = useState<TravelRecommendation | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState(0);
  const [activities, setActivities] = useState<string[]>([]);

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      try {
        const data = await getWeatherForecast(lat, lng, 14);
        setForecast(data);

        if (data.length > 0) {
          const rec = calculateTravelScore(data);
          setRecommendation(rec);
          const acts = getActivityRecommendations(data);
          setActivities(acts);
        }
      } catch (error) {
        console.error("Failed to fetch weather:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [lat, lng]);

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center h-48">
            <div className="text-center">
              <Cloud className="w-12 h-12 text-muted-foreground mx-auto mb-2 animate-pulse" />
              <p className="text-muted-foreground">Loading weather forecast...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (forecast.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            <AlertCircle className="w-8 h-8 mx-auto mb-2" />
            <p>Unable to load weather data</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const selectedForecast = forecast[selectedDay];
  const suitableActivities = activities.filter((activity) =>
    isActivitySuitable(forecast, activity)
  );

  return (
    <div className="space-y-4">
      {/* Travel Score Card */}
      {recommendation && (
        <Card className={`border-2 ${recommendation.score >= 70 ? "border-green-500" : recommendation.score >= 50 ? "border-yellow-500" : "border-red-500"}`}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Travel Recommendation</span>
              <div className="flex items-center gap-2">
                <div className="relative w-16 h-16">
                  <svg className="w-16 h-16 transform -rotate-90">
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="4"
                    />
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      fill="none"
                      stroke={
                        recommendation.score >= 70
                          ? "#10b981"
                          : recommendation.score >= 50
                            ? "#f59e0b"
                            : "#ef4444"
                      }
                      strokeWidth="4"
                      strokeDasharray={`${(recommendation.score / 100) * 176} 176`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-bold">
                      {recommendation.score}
                    </span>
                  </div>
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-lg font-semibold text-foreground">
              {recommendation.recommendation}
            </p>

            {/* Alerts */}
            {recommendation.alerts.length > 0 && (
              <div className="space-y-2">
                {recommendation.alerts.map((alert, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg flex gap-3 ${
                      alert.severity === "high"
                        ? "bg-red-50 border border-red-200"
                        : alert.severity === "medium"
                          ? "bg-yellow-50 border border-yellow-200"
                          : "bg-blue-50 border border-blue-200"
                    }`}
                  >
                    <AlertTriangle
                      className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                        alert.severity === "high"
                          ? "text-red-600"
                          : alert.severity === "medium"
                            ? "text-yellow-600"
                            : "text-blue-600"
                      }`}
                    />
                    <p
                      className={`text-sm ${
                        alert.severity === "high"
                          ? "text-red-800"
                          : alert.severity === "medium"
                            ? "text-yellow-800"
                            : "text-blue-800"
                      }`}
                    >
                      {alert.message}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Best Activities */}
            <div>
              <p className="font-semibold text-foreground mb-2 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                Recommended Activities
              </p>
              <div className="flex flex-wrap gap-2">
                {suitableActivities.map((activity, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium"
                  >
                    {activity}
                  </span>
                ))}
              </div>
            </div>

            {/* Caution Areas */}
            {recommendation.cautionAreas.length > 0 && (
              <div>
                <p className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-yellow-600" />
                  Areas of Caution
                </p>
                <div className="flex flex-wrap gap-2">
                  {recommendation.cautionAreas.map((area, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Daily Forecast */}
      <Card>
        <CardHeader>
          <CardTitle>14-Day Forecast for {destination}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Forecast Timeline */}
          <div className="overflow-x-auto pb-2">
            <div className="flex gap-2 min-w-max">
              {forecast.slice(0, 14).map((day, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedDay(idx)}
                  className={`flex flex-col items-center p-3 rounded-lg transition-all min-w-20 ${
                    selectedDay === idx
                      ? "bg-cyan-600 text-white shadow-lg"
                      : "bg-secondary text-foreground hover:bg-secondary/80"
                  }`}
                >
                  <p className="text-xs font-semibold">
                    {new Date(day.date).toLocaleDateString("en-US", {
                      weekday: "short",
                    })}
                  </p>
                  <p className="text-2xl my-1">{getWeatherEmoji(day.condition)}</p>
                  <p className="text-sm font-bold">{day.avgTemp}°C</p>
                </button>
              ))}
            </div>
          </div>

          {/* Selected Day Details */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-border">
            <div className="text-center">
              <Sun className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Temperature</p>
              <p className="text-lg font-bold text-foreground">
                {selectedForecast.minTemp}°C - {selectedForecast.maxTemp}°C
              </p>
            </div>

            <div className="text-center">
              <Droplets className="w-6 h-6 text-blue-500 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Precipitation</p>
              <p className="text-lg font-bold text-foreground">
                {selectedForecast.precipitation}mm
              </p>
            </div>

            <div className="text-center">
              <Wind className="w-6 h-6 text-cyan-500 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Wind Speed</p>
              <p className="text-lg font-bold text-foreground">
                {selectedForecast.windSpeed} km/h
              </p>
            </div>

            <div className="text-center">
              <CloudRain className="w-6 h-6 text-slate-500 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Humidity</p>
              <p className="text-lg font-bold text-foreground">
                {selectedForecast.humidity}%
              </p>
            </div>
          </div>

          {/* UV Index */}
          <div className="mt-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
            <p className="text-sm font-semibold text-orange-900 mb-2">
              UV Index: {selectedForecast.uvIndex}
            </p>
            <div className="w-full bg-orange-200 rounded-full h-2">
              <div
                className="bg-orange-600 h-2 rounded-full"
                style={{
                  width: `${Math.min((selectedForecast.uvIndex / 11) * 100, 100)}%`,
                }}
              />
            </div>
            <p className="text-xs text-orange-700 mt-2">
              {selectedForecast.uvIndex > 8
                ? "Very High - Use SPF 50+ sunscreen"
                : selectedForecast.uvIndex > 6
                  ? "High - Use SPF 30+ sunscreen"
                  : selectedForecast.uvIndex > 3
                    ? "Moderate - Use SPF 15+ sunscreen"
                    : "Low - Minimal sun protection needed"}
            </p>
          </div>

          {/* Condition Description */}
          <div className="mt-4 p-4 bg-secondary rounded-lg">
            <p className="text-sm text-muted-foreground mb-2">Weather Condition</p>
            <p className="text-lg font-semibold text-foreground capitalize">
              {getWeatherEmoji(selectedForecast.condition)}{" "}
              {selectedForecast.condition.replace("-", " ")}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
