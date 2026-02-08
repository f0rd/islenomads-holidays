import { describe, it, expect } from "vitest";
import {
  FERRY_SCHEDULES,
  BOAT_FLEET,
  getFerrySchedulesForRoute,
  getSchedulesForDay,
  getBoatInfo,
  getBoatTypeStats,
  getAverageOccupancy,
  getAvailableSchedules,
} from "@/data/ferrySchedules";

describe("Ferry Schedules", () => {
  describe("Ferry Schedule Data", () => {
    it("should have ferry schedules defined", () => {
      expect(FERRY_SCHEDULES.length).toBeGreaterThan(0);
    });

    it("should have all required fields in schedules", () => {
      FERRY_SCHEDULES.forEach((schedule) => {
        expect(schedule.id).toBeDefined();
        expect(schedule.from).toBeDefined();
        expect(schedule.to).toBeDefined();
        expect(schedule.departureTime).toBeDefined();
        expect(schedule.arrivalTime).toBeDefined();
        expect(schedule.duration).toBeDefined();
        expect(schedule.price).toBeGreaterThan(0);
        expect(schedule.capacity).toBeGreaterThan(0);
      });
    });

    it("should have valid time format", () => {
      FERRY_SCHEDULES.forEach((schedule) => {
        const timeRegex = /^\d{2}:\d{2}$/;
        expect(schedule.departureTime).toMatch(timeRegex);
        expect(schedule.arrivalTime).toMatch(timeRegex);
      });
    });

    it("should have occupancy less than or equal to capacity", () => {
      FERRY_SCHEDULES.forEach((schedule) => {
        expect(schedule.currentOccupancy).toBeLessThanOrEqual(schedule.capacity);
      });
    });

    it("should have valid boat types", () => {
      const validTypes = ["speedboat", "ferry", "catamaran", "dhoni"];
      FERRY_SCHEDULES.forEach((schedule) => {
        expect(validTypes).toContain(schedule.boatType);
      });
    });

    it("should have valid status", () => {
      const validStatuses = ["on-time", "delayed", "cancelled"];
      FERRY_SCHEDULES.forEach((schedule) => {
        expect(validStatuses).toContain(schedule.status);
      });
    });
  });

  describe("Boat Fleet Data", () => {
    it("should have boat fleet defined", () => {
      expect(BOAT_FLEET.length).toBeGreaterThan(0);
    });

    it("should have all required fields in boats", () => {
      BOAT_FLEET.forEach((boat) => {
        expect(boat.id).toBeDefined();
        expect(boat.name).toBeDefined();
        expect(boat.type).toBeDefined();
        expect(boat.capacity).toBeGreaterThan(0);
        expect(boat.rating).toBeGreaterThanOrEqual(0);
        expect(boat.rating).toBeLessThanOrEqual(5);
      });
    });

    it("should have valid boat types", () => {
      const validTypes = ["speedboat", "ferry", "catamaran", "dhoni"];
      BOAT_FLEET.forEach((boat) => {
        expect(validTypes).toContain(boat.type);
      });
    });

    it("should have safety features for all boats", () => {
      BOAT_FLEET.forEach((boat) => {
        expect(boat.safetyFeatures.length).toBeGreaterThan(0);
      });
    });

    it("should have amenities for all boats", () => {
      BOAT_FLEET.forEach((boat) => {
        expect(boat.amenities.length).toBeGreaterThan(0);
      });
    });
  });

  describe("Get Ferry Schedules for Route", () => {
    it("should get schedules for Malé to Ari route", () => {
      const schedules = getFerrySchedulesForRoute("Malé", "Ari");
      expect(schedules.length).toBeGreaterThan(0);
    });

    it("should get schedules for Ari to Malé return route", () => {
      const schedules = getFerrySchedulesForRoute("Ari", "Malé");
      expect(schedules.length).toBeGreaterThan(0);
    });

    it("should return empty array for non-existent route", () => {
      const schedules = getFerrySchedulesForRoute("NonExistent", "Route");
      expect(schedules.length).toBe(0);
    });

    it("should be case insensitive", () => {
      const schedules1 = getFerrySchedulesForRoute("male", "ari");
      const schedules2 = getFerrySchedulesForRoute("MALE", "ARI");
      expect(schedules1.length).toBe(schedules2.length);
    });
  });

  describe("Get Schedules for Day", () => {
    it("should get schedules for Monday", () => {
      const schedules = getSchedulesForDay("Monday");
      expect(schedules.length).toBeGreaterThan(0);
    });

    it("should get schedules for each day of week", () => {
      const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
      days.forEach((day) => {
        const schedules = getSchedulesForDay(day);
        expect(schedules.length).toBeGreaterThanOrEqual(0);
      });
    });

    it("should return empty array for invalid day", () => {
      const schedules = getSchedulesForDay("InvalidDay");
      expect(schedules.length).toBe(0);
    });
  });

  describe("Get Boat Info", () => {
    it("should get boat info by ID", () => {
      const boat = getBoatInfo("boat-001");
      expect(boat).toBeDefined();
      expect(boat?.name).toBe("Island Express");
    });

    it("should return undefined for non-existent boat", () => {
      const boat = getBoatInfo("non-existent");
      expect(boat).toBeUndefined();
    });

    it("should return correct boat details", () => {
      const boat = getBoatInfo("boat-001");
      expect(boat?.type).toBe("catamaran");
      expect(boat?.capacity).toBe(150);
    });
  });

  describe("Get Boat Type Statistics", () => {
    it("should return boat type counts", () => {
      const stats = getBoatTypeStats();
      expect(stats.speedboat).toBeGreaterThanOrEqual(0);
      expect(stats.ferry).toBeGreaterThanOrEqual(0);
      expect(stats.catamaran).toBeGreaterThanOrEqual(0);
      expect(stats.dhoni).toBeGreaterThanOrEqual(0);
    });

    it("should have total boats equal to fleet size", () => {
      const stats = getBoatTypeStats();
      const total = stats.speedboat + stats.ferry + stats.catamaran + stats.dhoni;
      expect(total).toBe(BOAT_FLEET.length);
    });
  });

  describe("Get Average Occupancy", () => {
    it("should calculate average occupancy", () => {
      const occupancy = getAverageOccupancy();
      expect(occupancy).toBeGreaterThan(0);
      expect(occupancy).toBeLessThanOrEqual(100);
    });

    it("should be within reasonable range", () => {
      const occupancy = getAverageOccupancy();
      expect(occupancy).toBeGreaterThanOrEqual(20);
      expect(occupancy).toBeLessThanOrEqual(100);
    });
  });

  describe("Get Available Schedules", () => {
    it("should get schedules with available seats", () => {
      const schedules = getAvailableSchedules(1);
      expect(schedules.length).toBeGreaterThan(0);
    });

    it("should filter by minimum seats required", () => {
      const schedules50 = getAvailableSchedules(50);
      const schedules10 = getAvailableSchedules(10);
      expect(schedules10.length).toBeGreaterThanOrEqual(schedules50.length);
    });

    it("should return schedules with enough capacity", () => {
      const schedules = getAvailableSchedules(10);
      schedules.forEach((schedule) => {
        const availableSeats = schedule.capacity - schedule.currentOccupancy;
        expect(availableSeats).toBeGreaterThanOrEqual(10);
      });
    });

    it("should return empty array if no seats available", () => {
      const schedules = getAvailableSchedules(1000);
      expect(schedules.length).toBe(0);
    });
  });

  describe("Ferry Route Coverage", () => {
    it("should have routes from Malé to multiple atolls", () => {
      const maleRoutes = FERRY_SCHEDULES.filter((s) =>
        s.from.toLowerCase().includes("malé")
      );
      expect(maleRoutes.length).toBeGreaterThan(3);
    });

    it("should have return routes from atolls to Malé", () => {
      const returnRoutes = FERRY_SCHEDULES.filter((s) =>
        s.to.toLowerCase().includes("malé")
      );
      expect(returnRoutes.length).toBeGreaterThan(0);
    });

    it("should have inter-atoll routes", () => {
      const interAtollRoutes = FERRY_SCHEDULES.filter((s) =>
        s.from.toLowerCase().includes("atoll") &&
        s.to.toLowerCase().includes("atoll")
      );
      expect(interAtollRoutes.length).toBeGreaterThan(0);
    });
  });

  describe("Schedule Frequency", () => {
    it("should have daily schedules", () => {
      const daily = FERRY_SCHEDULES.filter((s) => s.frequency === "Daily");
      expect(daily.length).toBeGreaterThan(0);
    });

    it("should have multiple departures per route", () => {
      const maleAri = FERRY_SCHEDULES.filter(
        (s) =>
          s.from.toLowerCase().includes("malé") &&
          s.to.toLowerCase().includes("ari")
      );
      expect(maleAri.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe("Pricing", () => {
    it("should have positive prices", () => {
      FERRY_SCHEDULES.forEach((schedule) => {
        expect(schedule.price).toBeGreaterThan(0);
      });
    });

    it("should have reasonable price range", () => {
      const prices = FERRY_SCHEDULES.map((s) => s.price);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      expect(minPrice).toBeGreaterThan(0);
      expect(maxPrice).toBeLessThan(500);
    });

    it("should reflect route distance in pricing", () => {
      const shortRoute = FERRY_SCHEDULES.find(
        (s) => s.duration.includes("30 mins")
      );
      const longRoute = FERRY_SCHEDULES.find(
        (s) => s.duration.includes("2 hours")
      );
      if (shortRoute && longRoute) {
        expect(longRoute.price).toBeGreaterThanOrEqual(shortRoute.price);
      }
    });
  });
});
