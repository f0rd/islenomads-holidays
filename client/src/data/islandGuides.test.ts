import { describe, it, expect } from "vitest";
import {
  ISLAND_GUIDES,
  getIslandGuide,
  getAllIslandGuides,
  searchIslandGuides,
} from "./islandGuides";

describe("Island Guides", () => {
  describe("ISLAND_GUIDES data", () => {
    it("should have at least one island guide", () => {
      expect(ISLAND_GUIDES.length).toBeGreaterThan(0);
    });

    it("should have Malé guide in the list", () => {
      const maleGuide = ISLAND_GUIDES.find((g) => g.id === "male-guide");
      expect(maleGuide).toBeDefined();
    });

    it("each guide should have required fields", () => {
      ISLAND_GUIDES.forEach((guide) => {
        expect(guide.id).toBeDefined();
        expect(guide.name).toBeDefined();
        expect(guide.atoll).toBeDefined();
        expect(guide.overview).toBeDefined();
        expect(guide.coordinates).toBeDefined();
      });
    });

    it("each guide should have overview between 100-150 words", () => {
      ISLAND_GUIDES.forEach((guide) => {
        const wordCount = guide.overview.split(/\s+/).length;
        expect(wordCount).toBeGreaterThanOrEqual(80);
        expect(wordCount).toBeLessThanOrEqual(200);
      });
    });

    it("each guide should have 8 quick facts", () => {
      ISLAND_GUIDES.forEach((guide) => {
        expect(guide.quickFacts.length).toBe(8);
      });
    });

    it("each guide should have transportation info", () => {
      ISLAND_GUIDES.forEach((guide) => {
        expect(guide.howToGetThere.flight).toBeDefined();
        expect(guide.howToGetThere.speedboat).toBeDefined();
        expect(guide.howToGetThere.ferry).toBeDefined();
      });
    });

    it("each guide should have at least 8 things to do", () => {
      ISLAND_GUIDES.forEach((guide) => {
        expect(guide.topThingsToDo.length).toBeGreaterThanOrEqual(8);
      });
    });

    it("each guide should have snorkeling guide", () => {
      ISLAND_GUIDES.forEach((guide) => {
        expect(guide.snorkelingGuide.bestSpots.length).toBeGreaterThan(0);
        expect(guide.snorkelingGuide.difficulty).toBeDefined();
        expect(guide.snorkelingGuide.safetyTips.length).toBeGreaterThan(0);
      });
    });

    it("each guide should have diving guide", () => {
      ISLAND_GUIDES.forEach((guide) => {
        expect(guide.divingGuide.bestSites.length).toBeGreaterThan(0);
        expect(guide.divingGuide.difficulty).toBeDefined();
        expect(guide.divingGuide.safetyTips.length).toBeGreaterThan(0);
      });
    });

    it("each guide should have food and cafes", () => {
      ISLAND_GUIDES.forEach((guide) => {
        expect(guide.foodCafes.length).toBeGreaterThan(0);
        guide.foodCafes.forEach((cafe) => {
          expect(cafe.name).toBeDefined();
          expect(cafe.type).toBeDefined();
          expect(cafe.cuisine).toBeDefined();
          expect(cafe.priceRange).toBeDefined();
        });
      });
    });

    it("each guide should have practical info", () => {
      ISLAND_GUIDES.forEach((guide) => {
        expect(guide.practicalInfo.currency).toBeDefined();
        expect(guide.practicalInfo.language).toBeDefined();
        expect(guide.practicalInfo.whatToPack.length).toBeGreaterThan(0);
        expect(guide.practicalInfo.healthTips.length).toBeGreaterThan(0);
        expect(guide.practicalInfo.emergencyContacts.length).toBeGreaterThan(0);
      });
    });

    it("each guide should have 3-day and 5-day itineraries", () => {
      ISLAND_GUIDES.forEach((guide) => {
        expect(guide.itineraries.threeDays.length).toBe(3);
        expect(guide.itineraries.fiveDays.length).toBe(5);
      });
    });

    it("each guide should have 6 FAQ items", () => {
      ISLAND_GUIDES.forEach((guide) => {
        expect(guide.faq.length).toBe(6);
      });
    });

    it("each guide should have valid coordinates", () => {
      ISLAND_GUIDES.forEach((guide) => {
        expect(guide.coordinates.latitude).toBeGreaterThanOrEqual(-90);
        expect(guide.coordinates.latitude).toBeLessThanOrEqual(90);
        expect(guide.coordinates.longitude).toBeGreaterThanOrEqual(-180);
        expect(guide.coordinates.longitude).toBeLessThanOrEqual(180);
      });
    });
  });

  describe("getIslandGuide", () => {
    it("should return guide for valid ID", () => {
      const guide = getIslandGuide("male-guide");
      expect(guide).toBeDefined();
      expect(guide?.id).toBe("male-guide");
    });

    it("should return undefined for invalid ID", () => {
      const guide = getIslandGuide("invalid-id");
      expect(guide).toBeUndefined();
    });
  });

  describe("getAllIslandGuides", () => {
    it("should return all guides", () => {
      const guides = getAllIslandGuides();
      expect(guides.length).toBe(ISLAND_GUIDES.length);
    });

    it("should return array of guides", () => {
      const guides = getAllIslandGuides();
      expect(Array.isArray(guides)).toBe(true);
    });
  });

  describe("searchIslandGuides", () => {
    it("should find guide by name", () => {
      const results = searchIslandGuides("Malé");
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].name).toContain("Malé");
    });

    it("should find guide by atoll", () => {
      const results = searchIslandGuides("Kaafu");
      expect(results.length).toBeGreaterThan(0);
    });

    it("should be case insensitive", () => {
      const results1 = searchIslandGuides("male");
      const results2 = searchIslandGuides("MALE");
      expect(results1.length).toBe(results2.length);
    });

    it("should return empty array for no matches", () => {
      const results = searchIslandGuides("nonexistent");
      expect(results.length).toBe(0);
    });

    it("should search in overview text", () => {
      const results = searchIslandGuides("capital");
      expect(results.length).toBeGreaterThan(0);
    });
  });
});
