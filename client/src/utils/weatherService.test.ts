import { describe, it, expect } from "vitest";
import {
  calculateTravelScore,
  compareDestinationWeather,
  getWeatherEmoji,
  formatWeatherDisplay,
  getActivityRecommendations,
  isActivitySuitable,
  WeatherForecast,
  WeatherCondition,
} from "@/utils/weatherService";

describe("Weather Service - Travel Score Calculation", () => {
  const createMockForecast = (
    avgTemp: number = 25,
    precipitation: number = 2,
    windSpeed: number = 10,
    humidity: number = 70
  ): WeatherForecast[] => [
    {
      date: "2026-02-10",
      maxTemp: avgTemp + 5,
      minTemp: avgTemp - 5,
      avgTemp,
      precipitation,
      windSpeed,
      humidity,
      condition: "sunny" as WeatherCondition,
      uvIndex: 6,
      seaLevel: 0,
    },
    {
      date: "2026-02-11",
      maxTemp: avgTemp + 5,
      minTemp: avgTemp - 5,
      avgTemp,
      precipitation,
      windSpeed,
      humidity,
      condition: "sunny" as WeatherCondition,
      uvIndex: 6,
      seaLevel: 0,
    },
  ];

  it("should calculate high score for ideal weather", () => {
    const forecast = createMockForecast(26, 1, 8, 65);
    const recommendation = calculateTravelScore(forecast);
    expect(recommendation.score).toBeGreaterThan(70);
  });

  it("should calculate lower score for hot weather", () => {
    const forecast = createMockForecast(35, 1, 8, 65);
    const recommendation = calculateTravelScore(forecast);
    expect(recommendation.score).toBeLessThanOrEqual(90);
  });

  it("should calculate lower score for high precipitation", () => {
    const forecast = createMockForecast(25, 15, 10, 70);
    const recommendation = calculateTravelScore(forecast);
    expect(recommendation.score).toBeLessThanOrEqual(80);
  });

  it("should calculate lower score for strong winds", () => {
    const forecast = createMockForecast(25, 2, 35, 70);
    const recommendation = calculateTravelScore(forecast);
    expect(recommendation.score).toBeLessThanOrEqual(85);
  });

  it("should include alerts for extreme conditions", () => {
    const forecast = createMockForecast(35, 20, 40, 85);
    const recommendation = calculateTravelScore(forecast);
    expect(recommendation.alerts.length).toBeGreaterThan(0);
  });

  it("should return valid recommendation text", () => {
    const forecast = createMockForecast(25, 2, 10, 70);
    const recommendation = calculateTravelScore(forecast);
    expect(recommendation.recommendation).toBeTruthy();
    expect(recommendation.recommendation.length).toBeGreaterThan(0);
  });

  it("should include best activities", () => {
    const forecast = createMockForecast(26, 1, 8, 65);
    const recommendation = calculateTravelScore(forecast);
    expect(recommendation.bestActivities.length).toBeGreaterThan(0);
  });

  it("should keep score within 0-100 range", () => {
    const forecast = createMockForecast(45, 30, 50, 95);
    const recommendation = calculateTravelScore(forecast);
    expect(recommendation.score).toBeGreaterThanOrEqual(0);
    expect(recommendation.score).toBeLessThanOrEqual(100);
  });

  it("should return empty recommendation for empty forecast", () => {
    const recommendation = calculateTravelScore([]);
    expect(recommendation.score).toBe(50);
    expect(recommendation.bestActivities.length).toBe(0);
  });
});

describe("Weather Service - Weather Emoji", () => {
  it("should return sun emoji for sunny weather", () => {
    const emoji = getWeatherEmoji("sunny");
    expect(emoji).toBe("☀️");
  });

  it("should return cloud emoji for cloudy weather", () => {
    const emoji = getWeatherEmoji("cloudy");
    expect(emoji).toBe("☁️");
  });

  it("should return rain emoji for rainy weather", () => {
    const emoji = getWeatherEmoji("rainy");
    expect(emoji).toBe("🌧️");
  });

  it("should return storm emoji for stormy weather", () => {
    const emoji = getWeatherEmoji("stormy");
    expect(emoji).toBe("⛈️");
  });

  it("should return wind emoji for windy weather", () => {
    const emoji = getWeatherEmoji("windy");
    expect(emoji).toBe("💨");
  });

  it("should return partly-cloudy emoji for partly-cloudy weather", () => {
    const emoji = getWeatherEmoji("partly-cloudy");
    expect(emoji).toBe("⛅");
  });

  it("should return fog emoji for foggy weather", () => {
    const emoji = getWeatherEmoji("foggy");
    expect(emoji).toBe("🌫️");
  });
});

describe("Weather Service - Format Weather Display", () => {
  it("should format weather display correctly", () => {
    const forecast: WeatherForecast = {
      date: "2026-02-10",
      maxTemp: 30,
      minTemp: 20,
      avgTemp: 25,
      precipitation: 2,
      windSpeed: 10,
      humidity: 70,
      condition: "sunny",
      uvIndex: 6,
      seaLevel: 0,
    };
    const display = formatWeatherDisplay(forecast);
    expect(display).toContain("☀️");
    expect(display).toContain("25°C");
    expect(display).toContain("sunny");
  });

  it("should include emoji in display", () => {
    const forecast: WeatherForecast = {
      date: "2026-02-10",
      maxTemp: 30,
      minTemp: 20,
      avgTemp: 25,
      precipitation: 5,
      windSpeed: 15,
      humidity: 75,
      condition: "rainy",
      uvIndex: 3,
      seaLevel: 0,
    };
    const display = formatWeatherDisplay(forecast);
    expect(display).toContain("🌧️");
  });
});

describe("Weather Service - Activity Recommendations", () => {
  const createMockForecast = (
    precipitation: number = 2,
    windSpeed: number = 10,
    avgTemp: number = 25
  ): WeatherForecast[] => [
    {
      date: "2026-02-10",
      maxTemp: avgTemp + 5,
      minTemp: avgTemp - 5,
      avgTemp,
      precipitation,
      windSpeed,
      humidity: 70,
      condition: "sunny",
      uvIndex: 6,
      seaLevel: 0,
    },
  ];

  it("should recommend water activities for good conditions", () => {
    const forecast = createMockForecast(1, 8, 26);
    const activities = getActivityRecommendations(forecast);
    expect(activities.some((a) => a.includes("Snorkeling"))).toBe(true);
  });

  it("should recommend beach activities for warm weather", () => {
    const forecast = createMockForecast(1, 10, 28);
    const activities = getActivityRecommendations(forecast);
    expect(activities.some((a) => a.includes("Beach"))).toBe(true);
  });

  it("should recommend water sports for moderate wind", () => {
    const forecast = createMockForecast(2, 18, 25);
    const activities = getActivityRecommendations(forecast);
    expect(activities.some((a) => a.includes("Windsurfing"))).toBe(true);
  });

  it("should recommend indoor activities for rain", () => {
    const forecast = createMockForecast(10, 15, 25);
    const activities = getActivityRecommendations(forecast);
    expect(activities.some((a) => a.includes("Spa"))).toBe(true);
  });

  it("should return empty array for empty forecast", () => {
    const activities = getActivityRecommendations([]);
    expect(activities).toEqual([]);
  });
});

describe("Weather Service - Activity Suitability", () => {
  const createMockForecast = (
    precipitation: number = 2,
    windSpeed: number = 10,
    avgTemp: number = 25
  ): WeatherForecast[] => [
    {
      date: "2026-02-10",
      maxTemp: avgTemp + 5,
      minTemp: avgTemp - 5,
      avgTemp,
      precipitation,
      windSpeed,
      humidity: 70,
      condition: "sunny",
      uvIndex: 6,
      seaLevel: 0,
    },
  ];

  it("should confirm snorkeling suitable for good conditions", () => {
    const forecast = createMockForecast(2, 10, 24);
    const suitable = isActivitySuitable(forecast, "Snorkeling");
    expect(suitable).toBe(true);
  });

  it("should reject snorkeling for high precipitation", () => {
    const forecast = createMockForecast(10, 10, 24);
    const suitable = isActivitySuitable(forecast, "Snorkeling");
    expect(suitable).toBe(false);
  });

  it("should reject snorkeling for high wind", () => {
    const forecast = createMockForecast(2, 25, 24);
    const suitable = isActivitySuitable(forecast, "Snorkeling");
    expect(suitable).toBe(false);
  });

  it("should confirm beach relaxation for good conditions", () => {
    const forecast = createMockForecast(1, 15, 26);
    const suitable = isActivitySuitable(forecast, "Beach Relaxation");
    expect(suitable).toBe(true);
  });

  it("should confirm spa treatments for any weather", () => {
    const forecast = createMockForecast(20, 40, 15);
    const suitable = isActivitySuitable(forecast, "Spa Treatments");
    expect(suitable).toBe(true);
  });

  it("should return true for unknown activities", () => {
    const forecast = createMockForecast(2, 10, 25);
    const suitable = isActivitySuitable(forecast, "Unknown Activity");
    expect(suitable).toBe(true);
  });

  it("should return false for empty forecast", () => {
    const suitable = isActivitySuitable([], "Snorkeling");
    expect(suitable).toBe(false);
  });
});

describe("Weather Service - Destination Comparison", () => {
  const createMockForecast = (
    avgTemp: number = 25,
    precipitation: number = 2,
    windSpeed: number = 10
  ): WeatherForecast[] => [
    {
      date: "2026-02-10",
      maxTemp: avgTemp + 5,
      minTemp: avgTemp - 5,
      avgTemp,
      precipitation,
      windSpeed,
      humidity: 70,
      condition: "sunny",
      uvIndex: 6,
      seaLevel: 0,
    },
  ];

  it("should identify best destination by weather score", () => {
    const destinations = [
      {
        destination: "Destination A",
        lat: 4.17,
        lng: 73.51,
        forecast: createMockForecast(35, 15, 20),
        lastUpdated: new Date().toISOString(),
      },
      {
        destination: "Destination B",
        lat: 3.86,
        lng: 72.83,
        forecast: createMockForecast(26, 2, 8),
        lastUpdated: new Date().toISOString(),
      },
    ];

    const { best, scores } = compareDestinationWeather(destinations);
    expect(best.destination).toBe("Destination B");
    expect(scores["Destination B"]).toBeGreaterThan(scores["Destination A"]);
  });

  it("should return scores for all destinations", () => {
    const destinations = [
      {
        destination: "Dest 1",
        lat: 4.17,
        lng: 73.51,
        forecast: createMockForecast(25, 2, 10),
        lastUpdated: new Date().toISOString(),
      },
      {
        destination: "Dest 2",
        lat: 3.86,
        lng: 72.83,
        forecast: createMockForecast(26, 1, 8),
        lastUpdated: new Date().toISOString(),
      },
      {
        destination: "Dest 3",
        lat: 5.55,
        lng: 73.0,
        forecast: createMockForecast(27, 3, 12),
        lastUpdated: new Date().toISOString(),
      },
    ];

    const { scores } = compareDestinationWeather(destinations);
    expect(Object.keys(scores).length).toBe(3);
    expect(scores["Dest 1"]).toBeDefined();
    expect(scores["Dest 2"]).toBeDefined();
    expect(scores["Dest 3"]).toBeDefined();
  });
});
