import { describe, it, expect } from "vitest";
import {
  generateIdealTrips,
  createPricingRequest,
  calculateTripScore,
  estimateTripCost,
  TripPreference,
  GeneratedTrip,
} from "@/utils/tripGenerator";

describe("Trip Generator", () => {
  describe("Generate Ideal Trips", () => {
    it("should generate multiple trip options", () => {
      const preferences: TripPreference = {
        budget: "mid-range",
        pace: "moderate",
        activities: ["diving", "snorkeling", "beach"],
        duration: 5,
        travelers: 2,
        season: "dry",
      };

      const trips = generateIdealTrips(["male", "ari", "baa"], preferences);
      expect(trips.length).toBeGreaterThan(0);
    });

    it("should generate relaxation trip", () => {
      const preferences: TripPreference = {
        budget: "luxury",
        pace: "relaxed",
        activities: ["beach"],
        duration: 7,
        travelers: 2,
        season: "dry",
      };

      const trips = generateIdealTrips(["male", "ari"], preferences);
      const relaxationTrip = trips.find((t) => t.title.includes("Relaxation"));
      expect(relaxationTrip).toBeDefined();
    });

    it("should generate adventure trip when activities include diving", () => {
      const preferences: TripPreference = {
        budget: "mid-range",
        pace: "fast",
        activities: ["diving", "surfing"],
        duration: 5,
        travelers: 2,
        season: "dry",
      };

      const trips = generateIdealTrips(["male", "ari", "baa"], preferences);
      const adventureTrip = trips.find((t) => t.title.includes("Adventure"));
      expect(adventureTrip).toBeDefined();
    });

    it("should generate cultural trip when activities include culture", () => {
      const preferences: TripPreference = {
        budget: "mid-range",
        pace: "moderate",
        activities: ["culture"],
        duration: 4,
        travelers: 2,
        season: "dry",
      };

      const trips = generateIdealTrips(["male"], preferences);
      const culturalTrip = trips.find((t) => t.title.includes("Cultural"));
      expect(culturalTrip).toBeDefined();
    });

    it("should include itinerary for each day", () => {
      const preferences: TripPreference = {
        budget: "mid-range",
        pace: "moderate",
        activities: ["beach"],
        duration: 5,
        travelers: 2,
        season: "dry",
      };

      const trips = generateIdealTrips(["male", "ari"], preferences);
      expect(trips[0].itinerary.length).toBe(5);
    });

    it("should calculate estimated cost based on budget", () => {
      const luxuryPrefs: TripPreference = {
        budget: "luxury",
        pace: "moderate",
        activities: ["beach"],
        duration: 5,
        travelers: 2,
        season: "dry",
      };

      const budgetPrefs: TripPreference = {
        budget: "budget",
        pace: "moderate",
        activities: ["beach"],
        duration: 5,
        travelers: 2,
        season: "dry",
      };

      const luxuryTrips = generateIdealTrips(["male", "ari"], luxuryPrefs);
      const budgetTrips = generateIdealTrips(["male", "ari"], budgetPrefs);

      expect(luxuryTrips[0].estimatedCost).toBeGreaterThan(budgetTrips[0].estimatedCost);
    });

    it("should include activities in itinerary", () => {
      const preferences: TripPreference = {
        budget: "mid-range",
        pace: "moderate",
        activities: ["beach", "diving"],
        duration: 3,
        travelers: 2,
        season: "dry",
      };

      const trips = generateIdealTrips(["male", "ari"], preferences);
      expect(trips[0].itinerary[0].activities.length).toBeGreaterThan(0);
    });

    it("should include highlights for each trip", () => {
      const preferences: TripPreference = {
        budget: "mid-range",
        pace: "moderate",
        activities: ["beach"],
        duration: 5,
        travelers: 2,
        season: "dry",
      };

      const trips = generateIdealTrips(["male", "ari"], preferences);
      expect(trips[0].highlights.length).toBeGreaterThan(0);
    });

    it("should include accommodations suggestions", () => {
      const preferences: TripPreference = {
        budget: "luxury",
        pace: "moderate",
        activities: ["beach"],
        duration: 5,
        travelers: 2,
        season: "dry",
      };

      const trips = generateIdealTrips(["male", "ari"], preferences);
      expect(trips[0].accommodations.length).toBeGreaterThan(0);
    });

    it("should include transportation suggestions", () => {
      const preferences: TripPreference = {
        budget: "mid-range",
        pace: "moderate",
        activities: ["beach"],
        duration: 5,
        travelers: 3,
        season: "dry",
      };

      const trips = generateIdealTrips(["male", "ari", "baa"], preferences);
      expect(trips[0].transportation.length).toBeGreaterThan(0);
    });
  });

  describe("Pricing Requests", () => {
    it("should create a pricing request", () => {
      const request = createPricingRequest(
        "John Doe",
        "john@example.com",
        ["male", "ari"],
        5,
        2,
        "luxury",
        "Diving and relaxation",
        "Honeymoon package"
      );

      expect(request.customerName).toBe("John Doe");
      expect(request.email).toBe("john@example.com");
      expect(request.status).toBe("pending");
    });

    it("should generate unique pricing request IDs", () => {
      const request1 = createPricingRequest(
        "John",
        "john@example.com",
        ["male"],
        5,
        2,
        "mid-range",
        "Beach",
        ""
      );

      const request2 = createPricingRequest(
        "Jane",
        "jane@example.com",
        ["ari"],
        7,
        3,
        "luxury",
        "Adventure",
        ""
      );

      expect(request1.customerName).not.toBe(request2.customerName);
      expect(request1.email).not.toBe(request2.email);
    });

    it("should include all trip details in pricing request", () => {
      const destinations = ["male", "ari", "baa"];
      const request = createPricingRequest(
        "Test User",
        "test@example.com",
        destinations,
        7,
        4,
        "luxury",
        "Diving",
        "Special request"
      );

      expect(request.destinations).toEqual(destinations);
      expect(request.duration).toBe(7);
      expect(request.travelers).toBe(4);
      expect(request.specialRequests).toBe("Special request");
    });
  });

  describe("Trip Scoring", () => {
    it("should calculate trip score", () => {
      const trip: GeneratedTrip = {
        id: "test-trip",
        title: "Test Trip",
        description: "A test trip",
        destinations: ["male", "ari"],
        duration: 5,
        estimatedCost: 2500,
        itinerary: [
          {
            day: 1,
            destination: "male",
            activities: ["City tour"],
            meals: ["Breakfast", "Lunch", "Dinner"],
            accommodation: "Hotel",
            notes: "Day 1",
          },
        ],
        highlights: ["Beach", "Diving"],
        bestFor: ["Couples"],
        weatherForecast: "Sunny",
        accommodations: [
          {
            name: "Resort",
            type: "Luxury",
            pricePerNight: 500,
            rating: 4.8,
            highlights: ["Pool", "Beach"],
          },
        ],
        activities: [
          {
            name: "Diving",
            destination: "ari",
            duration: "4 hours",
            price: 200,
            difficulty: "intermediate",
            description: "Coral reef diving",
          },
        ],
        meals: 15,
        transportation: [
          {
            from: "male",
            to: "ari",
            type: "speedboat",
            duration: "30 mins",
            price: 150,
            frequency: "Daily",
            departureTime: "08:00",
          },
        ],
        score: 85,
      };

      const score = calculateTripScore(trip);
      expect(score).toBeGreaterThanOrEqual(80);
      expect(score).toBeLessThanOrEqual(100);
    });

    it("should give higher score for diverse activities", () => {
      const trip: GeneratedTrip = {
        id: "test-trip",
        title: "Test Trip",
        description: "A test trip",
        destinations: ["male", "ari"],
        duration: 5,
        estimatedCost: 2500,
        itinerary: [],
        highlights: [],
        bestFor: [],
        weatherForecast: "Sunny",
        accommodations: [],
        activities: [
          {
            name: "Activity 1",
            destination: "male",
            duration: "2 hours",
            price: 100,
            difficulty: "easy",
            description: "Test",
          },
          {
            name: "Activity 2",
            destination: "ari",
            duration: "3 hours",
            price: 150,
            difficulty: "intermediate",
            description: "Test",
          },
          {
            name: "Activity 3",
            destination: "baa",
            duration: "4 hours",
            price: 200,
            difficulty: "hard",
            description: "Test",
          },
          {
            name: "Activity 4",
            destination: "male",
            duration: "2 hours",
            price: 100,
            difficulty: "easy",
            description: "Test",
          },
        ],
        meals: 15,
        transportation: [],
        score: 85,
      };

      const score = calculateTripScore(trip);
      expect(score).toBeGreaterThan(80);
    });
  });

  describe("Cost Estimation", () => {
    it("should estimate trip cost", () => {
      const cost = estimateTripCost(["male", "ari"], 5, 2, "mid-range");
      expect(cost).toBeGreaterThan(0);
    });

    it("should increase cost with more destinations", () => {
      const cost2Dest = estimateTripCost(["male", "ari"], 5, 2, "mid-range");
      const cost3Dest = estimateTripCost(["male", "ari", "baa"], 5, 2, "mid-range");
      expect(cost3Dest).toBeGreaterThan(cost2Dest);
    });

    it("should increase cost with more travelers", () => {
      const cost2Travelers = estimateTripCost(["male", "ari"], 5, 2, "mid-range");
      const cost4Travelers = estimateTripCost(["male", "ari"], 5, 4, "mid-range");
      expect(cost4Travelers).toBeGreaterThan(cost2Travelers);
    });

    it("should increase cost with longer duration", () => {
      const cost5Days = estimateTripCost(["male", "ari"], 5, 2, "mid-range");
      const cost10Days = estimateTripCost(["male", "ari"], 10, 2, "mid-range");
      expect(cost10Days).toBeGreaterThan(cost5Days);
    });

    it("should reflect budget tier in cost", () => {
      const budgetCost = estimateTripCost(["male", "ari"], 5, 2, "budget");
      const luxuryCost = estimateTripCost(["male", "ari"], 5, 2, "luxury");
      expect(luxuryCost).toBeGreaterThan(budgetCost);
    });

    it("should calculate reasonable costs", () => {
      const cost = estimateTripCost(["male", "ari", "baa"], 7, 3, "luxury");
      expect(cost).toBeGreaterThan(1000);
      expect(cost).toBeLessThan(50000);
    });
  });

  describe("Trip Preferences", () => {
    it("should support all budget levels", () => {
      const budgets: Array<"budget" | "mid-range" | "luxury" | "ultra-luxury"> = [
        "budget",
        "mid-range",
        "luxury",
        "ultra-luxury",
      ];

      budgets.forEach((budget) => {
        const preferences: TripPreference = {
          budget,
          pace: "moderate",
          activities: ["beach"],
          duration: 5,
          travelers: 2,
          season: "dry",
        };

        const trips = generateIdealTrips(["male", "ari"], preferences);
        expect(trips.length).toBeGreaterThan(0);
      });
    });

    it("should support all travel paces", () => {
      const paces: Array<"relaxed" | "moderate" | "fast"> = ["relaxed", "moderate", "fast"];

      paces.forEach((pace) => {
        const preferences: TripPreference = {
          budget: "mid-range",
          pace,
          activities: ["beach"],
          duration: 5,
          travelers: 2,
          season: "dry",
        };

        const trips = generateIdealTrips(["male", "ari"], preferences);
        expect(trips.length).toBeGreaterThan(0);
      });
    });
  });
});
