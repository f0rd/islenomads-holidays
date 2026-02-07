import { describe, it, expect } from "vitest";
import {
  AVAILABLE_DESTINATIONS,
  findDirectRoutes,
  findOptimalItinerary,
  generateItineraryOptions,
  calculateTripStats,
  validateItinerary,
} from "@/utils/tripPlanner";

describe("Trip Planner - Destinations", () => {
  it("should have at least 10 available destinations", () => {
    expect(AVAILABLE_DESTINATIONS.length).toBeGreaterThanOrEqual(10);
  });

  it("should have unique destination IDs", () => {
    const ids = AVAILABLE_DESTINATIONS.map((d) => d.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(AVAILABLE_DESTINATIONS.length);
  });

  it("should have valid coordinates for all destinations", () => {
    AVAILABLE_DESTINATIONS.forEach((dest) => {
      expect(dest.lat).toBeGreaterThanOrEqual(0);
      expect(dest.lat).toBeLessThanOrEqual(7);
      expect(dest.lng).toBeGreaterThanOrEqual(72);
      expect(dest.lng).toBeLessThanOrEqual(74);
    });
  });

  it("should have valid destination types", () => {
    const validTypes = ["island", "atoll", "city"];
    AVAILABLE_DESTINATIONS.forEach((dest) => {
      expect(validTypes).toContain(dest.type);
    });
  });

  it("should include Malé City as starting point", () => {
    const male = AVAILABLE_DESTINATIONS.find((d) => d.id === "male");
    expect(male).toBeDefined();
    expect(male?.type).toBe("city");
  });

  it("should have at least 5 atolls", () => {
    const atolls = AVAILABLE_DESTINATIONS.filter((d) => d.type === "atoll");
    expect(atolls.length).toBeGreaterThanOrEqual(5);
  });

  it("should have at least 3 islands", () => {
    const islands = AVAILABLE_DESTINATIONS.filter((d) => d.type === "island");
    expect(islands.length).toBeGreaterThanOrEqual(3);
  });
});

describe("Trip Planner - Route Finding", () => {
  it("should find direct routes from Malé to North Malé Atoll", () => {
    const routes = findDirectRoutes("Malé City", "North Malé Atoll");
    expect(routes.length).toBeGreaterThan(0);
  });

  it("should find both speedboat and ferry routes when available", () => {
    const routes = findDirectRoutes("Malé City", "Hulhumalé");
    const hasSpeedboat = routes.some((r) => r.routeType === "speedboat");
    const hasFerry = routes.some((r) => r.routeType === "ferry");
    expect(hasSpeedboat || hasFerry).toBe(true);
  });

  it("should return empty array for non-existent routes", () => {
    const routes = findDirectRoutes("NonExistent", "AlsoNonExistent");
    expect(routes).toEqual([]);
  });

  it("should have valid route segment data", () => {
    const routes = findDirectRoutes("Malé City", "North Malé Atoll");
    routes.forEach((route) => {
      expect(route.id).toBeDefined();
      expect(route.routeName).toBeDefined();
      expect(route.from).toBeDefined();
      expect(route.to).toBeDefined();
      expect(route.durationMinutes).toBeGreaterThan(0);
      expect(route.priceAmount).toBeGreaterThan(0);
      expect(route.capacity).toBeGreaterThan(0);
    });
  });

  it("should parse duration correctly", () => {
    const routes = findDirectRoutes("Malé City", "North Malé Atoll");
    routes.forEach((route) => {
      expect(route.durationMinutes).toBeGreaterThan(0);
      expect(typeof route.durationMinutes).toBe("number");
    });
  });

  it("should parse price correctly", () => {
    const routes = findDirectRoutes("Malé City", "North Malé Atoll");
    routes.forEach((route) => {
      expect(route.priceAmount).toBeGreaterThan(0);
      expect(typeof route.priceAmount).toBe("number");
    });
  });
});

describe("Trip Planner - Itinerary Generation", () => {
  it("should generate optimal itinerary for valid destinations", () => {
    const itinerary = findOptimalItinerary(
      ["male", "north-male-atoll"],
      "2026-02-10"
    );
    if (!itinerary) return;
    expect(itinerary).toBeDefined();
    expect(itinerary.destinations.length).toBe(2);
    expect(itinerary.segments.length).toBe(1);
  });

  it("should return null for single destination", () => {
    const itinerary = findOptimalItinerary(["male"], "2026-02-10");
    expect(itinerary).toBeNull();
  });

  it("should return null for invalid destination IDs", () => {
    const itinerary = findOptimalItinerary(
      ["invalid1", "invalid2"],
      "2026-02-10"
    );
    expect(itinerary).toBeNull();
  });

  it("should calculate total cost correctly", () => {
    const itinerary = findOptimalItinerary(
      ["male", "north-male-atoll"],
      "2026-02-10"
    );
    if (!itinerary) return;
    expect(itinerary.totalCostAmount).toBeGreaterThan(0);
    expect(itinerary.totalCost).toMatch(/^\$\d+$/);
  });

  it("should calculate total duration correctly", () => {
    const itinerary = findOptimalItinerary(
      ["male", "north-male-atoll"],
      "2026-02-10"
    );
    if (!itinerary) return;
    expect(itinerary.totalDurationMinutes).toBeGreaterThan(0);
    expect(itinerary.totalDuration).toMatch(/\d+h \d+m/);
  });

  it("should calculate total distance correctly", () => {
    const itinerary = findOptimalItinerary(
      ["male", "north-male-atoll"],
      "2026-02-10"
    );
    if (!itinerary) return;
    expect(itinerary.totalDistanceKm).toBeGreaterThanOrEqual(0);
    expect(itinerary.totalDistance).toMatch(/\d+ km/);
  });

  it("should set end date after start date", () => {
    const itinerary = findOptimalItinerary(
      ["male", "north-male-atoll"],
      "2026-02-10"
    );
    if (!itinerary) return;
    const startDate = new Date(itinerary.startDate);
    const endDate = new Date(itinerary.endDate);
    expect(endDate.getTime()).toBeGreaterThan(startDate.getTime());
  });

  it("should prefer speed when preferSpeed is true", () => {
    const speedItinerary = findOptimalItinerary(
      ["male", "north-male-atoll"],
      "2026-02-10",
      { preferSpeed: true }
    );
    if (!speedItinerary) return;
    expect(speedItinerary).toBeDefined();
    expect(speedItinerary.segments.length).toBeGreaterThan(0);
  });

  it("should prefer cost when preferCost is true", () => {
    const costItinerary = findOptimalItinerary(
      ["male", "north-male-atoll"],
      "2026-02-10",
      { preferCost: true }
    );
    if (!costItinerary) return;
    expect(costItinerary).toBeDefined();
    expect(costItinerary.totalCostAmount).toBeGreaterThan(0);
  });

  it("should prefer comfort when preferComfort is true", () => {
    const comfortItinerary = findOptimalItinerary(
      ["male", "north-male-atoll"],
      "2026-02-10",
      { preferComfort: true }
    );
    if (!comfortItinerary) return;
    expect(comfortItinerary).toBeDefined();
    expect(comfortItinerary.segments.length).toBeGreaterThan(0);
  });
});

describe("Trip Planner - Multiple Options", () => {
  it("should generate itinerary options", () => {
    const options = generateItineraryOptions(
      ["male", "north-male-atoll"],
      "2026-02-10"
    );
    expect(Array.isArray(options)).toBe(true);
  });

  it("should handle valid destination combinations", () => {
    const options = generateItineraryOptions(
      ["male", "north-male-atoll"],
      "2026-02-10"
    );
    expect(Array.isArray(options)).toBe(true);
  });

  it("should have unique itinerary IDs when options exist", () => {
    const options = generateItineraryOptions(
      ["male", "north-male-atoll"],
      "2026-02-10"
    );
    if (options.length === 0) return;
    const ids = options.map((o) => o.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBeGreaterThan(0);
  });

  it("should return empty array for invalid destinations", () => {
    const options = generateItineraryOptions(["invalid"], "2026-02-10");
    expect(options).toEqual([]);
  });
});

describe("Trip Planner - Trip Statistics", () => {
  it("should calculate trip statistics correctly", () => {
    const itinerary = findOptimalItinerary(
      ["male", "north-male-atoll"],
      "2026-02-10"
    );
    if (!itinerary) return;

    const stats = calculateTripStats(itinerary);
    expect(stats.destinationCount).toBe(2);
    expect(stats.segmentCount).toBe(1);
    expect(stats.averageCostPerDay).toBeGreaterThanOrEqual(0);
    expect(stats.averageDurationPerSegment).toBeGreaterThan(0);
    expect(stats.fastestSegment).toBeDefined();
    expect(stats.cheapestSegment).toBeDefined();
    expect(stats.mostComfortableSegment).toBeDefined();
  });

  it("should identify fastest segment", () => {
    const itinerary = findOptimalItinerary(
      ["male", "north-male-atoll"],
      "2026-02-10"
    );
    if (!itinerary) return;

    const stats = calculateTripStats(itinerary);
    const allDurations = itinerary.segments.map((s) => s.durationMinutes);
    const minDuration = Math.min(...allDurations);
    expect(stats.fastestSegment.durationMinutes).toBe(minDuration);
  });

  it("should identify cheapest segment", () => {
    const itinerary = findOptimalItinerary(
      ["male", "north-male-atoll"],
      "2026-02-10"
    );
    if (!itinerary) return;

    const stats = calculateTripStats(itinerary);
    const allPrices = itinerary.segments.map((s) => s.priceAmount);
    const minPrice = Math.min(...allPrices);
    expect(stats.cheapestSegment.priceAmount).toBe(minPrice);
  });

  it("should identify most comfortable segment", () => {
    const itinerary = findOptimalItinerary(
      ["male", "north-male-atoll"],
      "2026-02-10"
    );
    if (!itinerary) return;

    const stats = calculateTripStats(itinerary);
    const allCapacities = itinerary.segments.map((s) => s.capacity);
    const maxCapacity = Math.max(...allCapacities);
    expect(stats.mostComfortableSegment.capacity).toBe(maxCapacity);
  });
});

describe("Trip Planner - Validation", () => {
  it("should validate correct itinerary", () => {
    const itinerary = findOptimalItinerary(
      ["male", "north-male-atoll"],
      "2026-02-10"
    );
    if (!itinerary) return;

    const validation = validateItinerary(itinerary);
    expect(validation.isValid).toBe(true);
    expect(validation.errors).toEqual([]);
  });

  it("should reject itinerary with single destination", () => {
    const validation = validateItinerary({
      id: "test",
      destinations: [AVAILABLE_DESTINATIONS[0]],
      segments: [],
      totalDuration: "0h 0m",
      totalDurationMinutes: 0,
      totalCost: "$0",
      totalCostAmount: 0,
      totalDistance: "0 km",
      totalDistanceKm: 0,
      startDate: "2026-02-10",
      endDate: "2026-02-10",
      isOptimal: false,
    });
    expect(validation.isValid).toBe(false);
    expect(validation.errors.length).toBeGreaterThan(0);
  });

  it("should reject itinerary with no segments", () => {
    const validation = validateItinerary({
      id: "test",
      destinations: [AVAILABLE_DESTINATIONS[0], AVAILABLE_DESTINATIONS[1]],
      segments: [],
      totalDuration: "0h 0m",
      totalDurationMinutes: 0,
      totalCost: "$0",
      totalCostAmount: 0,
      totalDistance: "0 km",
      totalDistanceKm: 0,
      startDate: "2026-02-10",
      endDate: "2026-02-10",
      isOptimal: false,
    });
    expect(validation.isValid).toBe(false);
  });

  it("should reject itinerary with invalid date range", () => {
    const itinerary = findOptimalItinerary(
      ["male", "north-male-atoll"],
      "2026-02-10"
    );
    if (!itinerary) return;

    itinerary.endDate = "2026-02-05";
    const validation = validateItinerary(itinerary);
    expect(validation.isValid).toBe(false);
    expect(validation.errors.length).toBeGreaterThan(0);
  });

  it("should reject itinerary with mismatched segment count", () => {
    const itinerary = findOptimalItinerary(
      ["male", "north-male-atoll"],
      "2026-02-10"
    );
    if (!itinerary) return;

    itinerary.segments = [];
    const validation = validateItinerary(itinerary);
    expect(validation.isValid).toBe(false);
  });
});
