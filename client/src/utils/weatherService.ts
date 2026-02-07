/**
 * Weather Service
 * Integrates with Open-Meteo API for free weather forecasting
 * No API key required, perfect for travel planning
 */

export interface WeatherForecast {
  date: string;
  maxTemp: number;
  minTemp: number;
  avgTemp: number;
  precipitation: number;
  windSpeed: number;
  humidity: number;
  condition: WeatherCondition;
  uvIndex: number;
  seaLevel: number;
  waterTemp?: number;
}

export type WeatherCondition =
  | "sunny"
  | "cloudy"
  | "rainy"
  | "stormy"
  | "windy"
  | "foggy"
  | "partly-cloudy";

export interface DestinationWeather {
  destination: string;
  lat: number;
  lng: number;
  forecast: WeatherForecast[];
  lastUpdated: string;
}

export interface WeatherAlert {
  type: "warning" | "caution" | "info";
  message: string;
  severity: "low" | "medium" | "high";
}

export interface TravelRecommendation {
  score: number; // 0-100
  recommendation: string;
  bestActivities: string[];
  cautionAreas: string[];
  alerts: WeatherAlert[];
}

/**
 * Fetch weather forecast for a destination
 * Uses Open-Meteo API (free, no authentication required)
 */
export async function getWeatherForecast(
  lat: number,
  lng: number,
  days: number = 14
): Promise<WeatherForecast[]> {
  try {
    const today = new Date();
    const startDate = today.toISOString().split("T")[0];
    const endDate = new Date(today.getTime() + days * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];

    const params = new URLSearchParams({
      latitude: lat.toString(),
      longitude: lng.toString(),
      start_date: startDate,
      end_date: endDate,
      daily:
        "temperature_2m_max,temperature_2m_min,temperature_2m_mean,precipitation_sum,windspeed_10m_max,relative_humidity_2m_mean,uv_index_max",
      timezone: "auto",
      temperature_unit: "celsius",
    });

    const response = await fetch(
      `https://archive-api.open-meteo.com/v1/archive?${params}`
    );

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.daily) {
      return [];
    }

    return data.daily.time.map((date: string, idx: number) => ({
      date,
      maxTemp: Math.round(data.daily.temperature_2m_max[idx]),
      minTemp: Math.round(data.daily.temperature_2m_min[idx]),
      avgTemp: Math.round(data.daily.temperature_2m_mean[idx]),
      precipitation: Math.round(data.daily.precipitation_sum[idx] * 10) / 10,
      windSpeed: Math.round(data.daily.windspeed_10m_max[idx]),
      humidity: Math.round(data.daily.relative_humidity_2m_mean[idx]),
      condition: getWeatherCondition(
        data.daily.precipitation_sum[idx],
        data.daily.windspeed_10m_max[idx]
      ),
      uvIndex: Math.round(data.daily.uv_index_max[idx] * 10) / 10,
      seaLevel: 0,
    }));
  } catch (error) {
    console.error("Failed to fetch weather forecast:", error);
    return [];
  }
}

/**
 * Determine weather condition based on precipitation and wind
 */
function getWeatherCondition(
  precipitation: number,
  windSpeed: number
): WeatherCondition {
  if (windSpeed > 40) return "stormy";
  if (windSpeed > 25) return "windy";
  if (precipitation > 10) return "rainy";
  if (precipitation > 2) return "cloudy";
  return "sunny";
}

/**
 * Calculate travel recommendation score based on weather
 */
export function calculateTravelScore(
  forecast: WeatherForecast[]
): TravelRecommendation {
  if (forecast.length === 0) {
    return {
      score: 50,
      recommendation: "Unable to fetch weather data",
      bestActivities: [],
      cautionAreas: [],
      alerts: [],
    };
  }

  const avgTemp = forecast.reduce((sum, f) => sum + f.avgTemp, 0) / forecast.length;
  const avgPrecipitation = forecast.reduce((sum, f) => sum + f.precipitation, 0) / forecast.length;
  const avgWindSpeed = forecast.reduce((sum, f) => sum + f.windSpeed, 0) / forecast.length;
  const avgHumidity = forecast.reduce((sum, f) => sum + f.humidity, 0) / forecast.length;

  let score = 100;
  const alerts: WeatherAlert[] = [];
  const cautionAreas: string[] = [];
  const bestActivities: string[] = [];

  // Temperature assessment
  if (avgTemp > 32) {
    score -= 10;
    alerts.push({
      type: "caution",
      message: "High temperatures - stay hydrated and use sun protection",
      severity: "medium",
    });
  } else if (avgTemp > 28) {
    bestActivities.push("Swimming", "Snorkeling", "Water Sports");
  }

  if (avgTemp < 20) {
    score -= 5;
    cautionAreas.push("Water activities may be uncomfortable");
  }

  // Precipitation assessment
  if (avgPrecipitation > 10) {
    score -= 20;
    alerts.push({
      type: "warning",
      message: "High rainfall expected - plan indoor activities",
      severity: "high",
    });
    cautionAreas.push("Outdoor activities");
  } else if (avgPrecipitation > 5) {
    score -= 10;
    alerts.push({
      type: "caution",
      message: "Moderate rain expected",
      severity: "medium",
    });
  } else if (avgPrecipitation < 2) {
    bestActivities.push("Beach Activities", "Island Hopping", "Diving");
  }

  // Wind assessment
  if (avgWindSpeed > 30) {
    score -= 15;
    alerts.push({
      type: "warning",
      message: "Strong winds - water activities may be restricted",
      severity: "high",
    });
    cautionAreas.push("Boat transfers", "Water sports");
  } else if (avgWindSpeed > 20) {
    score -= 5;
    alerts.push({
      type: "caution",
      message: "Moderate winds expected",
      severity: "medium",
    });
  } else if (avgWindSpeed < 10) {
    bestActivities.push("Sailing", "Windsurfing");
  }

  // Humidity assessment
  if (avgHumidity > 85) {
    score -= 5;
    alerts.push({
      type: "info",
      message: "High humidity - expect tropical conditions",
      severity: "low",
    });
  }

  // UV Index assessment
  const avgUV = forecast.reduce((sum, f) => sum + f.uvIndex, 0) / forecast.length;
  if (avgUV > 8) {
    alerts.push({
      type: "warning",
      message: "Very high UV index - use strong sunscreen (SPF 50+)",
      severity: "high",
    });
  }

  // Ensure score stays within bounds
  score = Math.max(0, Math.min(100, score));

  // Generate recommendation text
  let recommendation = "";
  if (score >= 80) {
    recommendation = "Excellent conditions for your trip!";
  } else if (score >= 60) {
    recommendation = "Good conditions with some considerations";
  } else if (score >= 40) {
    recommendation = "Fair conditions - plan accordingly";
  } else {
    recommendation = "Challenging weather - consider rescheduling";
  }

  // Add default activities if none were added
  if (bestActivities.length === 0) {
    bestActivities.push("Sightseeing", "Relaxation", "Cultural Tours");
  }

  return {
    score,
    recommendation,
    bestActivities,
    cautionAreas,
    alerts,
  };
}

/**
 * Compare weather across multiple destinations
 */
export function compareDestinationWeather(
  destinations: DestinationWeather[]
): {
  best: DestinationWeather;
  scores: Record<string, number>;
} {
  const scores: Record<string, number> = {};
  let bestDest = destinations[0];
  let bestScore = 0;

  destinations.forEach((dest) => {
    const recommendation = calculateTravelScore(dest.forecast);
    scores[dest.destination] = recommendation.score;

    if (recommendation.score > bestScore) {
      bestScore = recommendation.score;
      bestDest = dest;
    }
  });

  return { best: bestDest, scores };
}

/**
 * Get weather emoji based on condition
 */
export function getWeatherEmoji(condition: WeatherCondition): string {
  const emojiMap: Record<WeatherCondition, string> = {
    sunny: "☀️",
    "partly-cloudy": "⛅",
    cloudy: "☁️",
    rainy: "🌧️",
    stormy: "⛈️",
    windy: "💨",
    foggy: "🌫️",
  };
  return emojiMap[condition] || "🌤️";
}

/**
 * Format weather data for display
 */
export function formatWeatherDisplay(forecast: WeatherForecast): string {
  const emoji = getWeatherEmoji(forecast.condition);
  return `${emoji} ${forecast.avgTemp}°C, ${forecast.condition}`;
}

/**
 * Get activity recommendations based on weather
 */
export function getActivityRecommendations(
  forecast: WeatherForecast[]
): string[] {
  const recommendations: string[] = [];

  if (forecast.length === 0) return recommendations;

  const avgPrecipitation = forecast.reduce((sum, f) => sum + f.precipitation, 0) / forecast.length;
  const avgWindSpeed = forecast.reduce((sum, f) => sum + f.windSpeed, 0) / forecast.length;
  const avgTemp = forecast.reduce((sum, f) => sum + f.avgTemp, 0) / forecast.length;

  // Water activities
  if (avgPrecipitation < 5 && avgWindSpeed < 20) {
    recommendations.push("Snorkeling", "Diving", "Swimming");
  }

  // Beach activities
  if (avgTemp > 25 && avgPrecipitation < 3) {
    recommendations.push("Beach Relaxation", "Sunbathing", "Beach Volleyball");
  }

  // Water sports
  if (avgWindSpeed > 15 && avgWindSpeed < 30) {
    recommendations.push("Windsurfing", "Kitesurfing", "Sailing");
  }

  // Boat tours
  if (avgPrecipitation < 5 && avgWindSpeed < 25) {
    recommendations.push("Island Hopping", "Boat Tours", "Fishing");
  }

  // Indoor activities
  if (avgPrecipitation > 5) {
    recommendations.push("Spa Treatments", "Fine Dining", "Cultural Tours");
  }

  return recommendations;
}

/**
 * Check if weather is suitable for specific activity
 */
export function isActivitySuitable(
  forecast: WeatherForecast[],
  activity: string
): boolean {
  if (forecast.length === 0) return false;

  const avgPrecipitation = forecast.reduce((sum, f) => sum + f.precipitation, 0) / forecast.length;
  const avgWindSpeed = forecast.reduce((sum, f) => sum + f.windSpeed, 0) / forecast.length;
  const avgTemp = forecast.reduce((sum, f) => sum + f.avgTemp, 0) / forecast.length;

  const activityRequirements: Record<string, { minTemp: number; maxWind: number; maxRain: number }> = {
    Snorkeling: { minTemp: 20, maxWind: 20, maxRain: 5 },
    Diving: { minTemp: 18, maxWind: 20, maxRain: 5 },
    Swimming: { minTemp: 22, maxWind: 25, maxRain: 10 },
    "Beach Relaxation": { minTemp: 20, maxWind: 30, maxRain: 2 },
    Sailing: { minTemp: 15, maxWind: 35, maxRain: 5 },
    Windsurfing: { minTemp: 18, maxWind: 40, maxRain: 5 },
    "Island Hopping": { minTemp: 15, maxWind: 25, maxRain: 5 },
    "Spa Treatments": { minTemp: 10, maxWind: 50, maxRain: 50 },
    "Fine Dining": { minTemp: 10, maxWind: 50, maxRain: 50 },
  };

  const requirements = activityRequirements[activity];
  if (!requirements) return true;

  return (
    avgTemp >= requirements.minTemp &&
    avgWindSpeed <= requirements.maxWind &&
    avgPrecipitation <= requirements.maxRain
  );
}
