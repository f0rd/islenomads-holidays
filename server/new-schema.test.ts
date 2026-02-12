import { describe, it, expect, beforeAll, afterAll } from "vitest";
import {
  getAllActivityTypes,
  getActivityTypeByKey,
  getSpotsByIsland,
  getIslandsBySpot,
  getSpotsByActivityType,
  getTransportRoutesBetweenIslands,
  getExperiencesByIsland,
  getExperiencesByActivityType,
  getIslandWithSpots,
} from "./db";

describe("New Schema Database Functions", () => {
  describe("Activity Types", () => {
    it("should retrieve all activity types", async () => {
      const types = await getAllActivityTypes();
      expect(Array.isArray(types)).toBe(true);
      expect(types.length).toBeGreaterThan(0);
      expect(types[0]).toHaveProperty("id");
      expect(types[0]).toHaveProperty("key");
      expect(types[0]).toHaveProperty("name");
    });

    it("should retrieve activity type by key", async () => {
      const type = await getActivityTypeByKey("diving");
      expect(type).toBeDefined();
      if (type) {
        expect(type.key).toBe("diving");
        expect(type).toHaveProperty("name");
      }
    });

    it("should return undefined for non-existent activity type", async () => {
      const type = await getActivityTypeByKey("non_existent_activity");
      expect(type).toBeUndefined();
    });
  });

  describe("Island-Spot Access", () => {
    it("should retrieve spots accessible from an island", async () => {
      // Thulusdhoo (id: 2) should have accessible spots
      const spots = await getSpotsByIsland(2);
      expect(Array.isArray(spots)).toBe(true);
      if (spots.length > 0) {
        expect(spots[0]).toHaveProperty("spot");
        expect(spots[0]).toHaveProperty("distance");
        expect(spots[0]).toHaveProperty("travelTime");
      }
    });

    it("should retrieve islands that can access a spot", async () => {
      // Cokes (id: 1) should be accessible from multiple islands
      const islands = await getIslandsBySpot(1);
      expect(Array.isArray(islands)).toBe(true);
      if (islands.length > 0) {
        expect(islands[0]).toHaveProperty("island");
        // Distance might be optional/null
      }
    });

    it("should retrieve spots by activity type", async () => {
      // Get diving spots
      const divingType = await getActivityTypeByKey("diving");
      if (divingType) {
        const spots = await getSpotsByActivityType(divingType.id);
        expect(Array.isArray(spots)).toBe(true);
        if (spots.length > 0) {
          expect(spots[0]).toHaveProperty("id");
          expect(spots[0]).toHaveProperty("name");
        }
      }
    });
  });

  describe("Transport Routes", () => {
    it("should retrieve transport routes between islands", async () => {
      // Get routes from Malé (id: 1) to Thulusdhoo (id: 2)
      const routes = await getTransportRoutesBetweenIslands(1, 2);
      expect(Array.isArray(routes)).toBe(true);
      if (routes.length > 0) {
        expect(routes[0]).toHaveProperty("type");
        expect(routes[0]).toHaveProperty("duration");
        expect(routes[0]).toHaveProperty("price");
      }
    });
  });

  describe("Experiences", () => {
    it("should retrieve experiences for an island", async () => {
      // Thulusdhoo (id: 2) should have experiences
      const experiences = await getExperiencesByIsland(2);
      expect(Array.isArray(experiences)).toBe(true);
      // Experiences might be empty if not yet populated
    });

    it("should retrieve experiences by activity type", async () => {
      const divingType = await getActivityTypeByKey("diving");
      if (divingType) {
        const experiences = await getExperiencesByActivityType(divingType.id);
        expect(Array.isArray(experiences)).toBe(true);
      }
    });
  });

  describe("Island Data with Spots", () => {
    it("should retrieve island with all its spots and related data", async () => {
      // Thulusdhoo (id: 2)
      const islandData = await getIslandWithSpots(2);
      expect(islandData).toBeDefined();
      if (islandData) {
        expect(islandData).toHaveProperty("island");
        expect(islandData).toHaveProperty("spots");
        expect(islandData).toHaveProperty("experiences");
        expect(islandData).toHaveProperty("transportRoutes");
        expect(Array.isArray(islandData.spots)).toBe(true);
        expect(Array.isArray(islandData.experiences)).toBe(true);
        expect(Array.isArray(islandData.transportRoutes)).toBe(true);
      }
    });

    it("should include spot details in island data", async () => {
      const islandData = await getIslandWithSpots(2);
      if (islandData && islandData.spots.length > 0) {
        const firstSpot = islandData.spots[0];
        expect(firstSpot).toHaveProperty("spot");
        expect(firstSpot.spot).toHaveProperty("id");
        expect(firstSpot.spot).toHaveProperty("name");
        expect(firstSpot).toHaveProperty("distance");
        expect(firstSpot).toHaveProperty("travelTime");
      }
    });
  });

  describe("Data Consistency", () => {
    it("should maintain referential integrity between islands and spots", async () => {
      const spots = await getSpotsByIsland(2);
      if (spots.length > 0) {
        const firstSpot = spots[0];
        const islands = await getIslandsBySpot(firstSpot.spot.id);
        expect(islands.length).toBeGreaterThan(0);
        // Should find at least one island that can access this spot
        const foundIsland = islands.find((i) => i.island.id === 2);
        expect(foundIsland).toBeDefined();
      }
    });

    it("should return consistent data from different query methods", async () => {
      const islandData = await getIslandWithSpots(2);
      const directSpots = await getSpotsByIsland(2);

      if (islandData && directSpots.length > 0) {
        expect(islandData.spots.length).toBe(directSpots.length);
        // Verify spot IDs match
        const dataSpotIds = islandData.spots.map((s) => s.spot.id).sort();
        const directSpotIds = directSpots.map((s) => s.spot.id).sort();
        expect(dataSpotIds).toEqual(directSpotIds);
      }
    });
  });
});
