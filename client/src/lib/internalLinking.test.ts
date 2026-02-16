/**
 * Tests for Internal Linking Utility Functions
 */

import { describe, it, expect } from "vitest";
import {
  getRelatedAtolls,
  getAtollsByActivity,
  generateActivityLinks,
  getBreadcrumbItems,
  generateAnchorText,
  areAtollsInSameRegion,
  getAtollRegion,
  generateBreadcrumbSchema,
  generateLinkRecommendations,
} from "./internalLinking";

describe("Internal Linking Utilities", () => {
  describe("getRelatedAtolls", () => {
    it("should return related atolls for a given atoll", () => {
      const related = getRelatedAtolls("kaafu");
      expect(related).toContain("lhaviyani");
      expect(related).toContain("alif-alif");
      expect(related.length).toBeLessThanOrEqual(4);
    });

    it("should return empty array for unknown atoll", () => {
      const related = getRelatedAtolls("unknown-atoll");
      expect(related).toEqual([]);
    });

    it("should respect the limit parameter", () => {
      const related = getRelatedAtolls("kaafu", { limit: 2 });
      expect(related.length).toBeLessThanOrEqual(2);
    });
  });

  describe("getAtollsByActivity", () => {
    it("should return atolls for diving activity", () => {
      const atolls = getAtollsByActivity("diving");
      expect(atolls.length).toBeGreaterThan(0);
      expect(atolls).toContain("kaafu");
      expect(atolls).toContain("alif-alif");
    });

    it("should return atolls for manta-rays activity", () => {
      const atolls = getAtollsByActivity("manta-rays");
      expect(atolls).toContain("baa");
      expect(atolls).toContain("alif-alif");
    });

    it("should handle case-insensitive activity names", () => {
      const atolls1 = getAtollsByActivity("diving");
      const atolls2 = getAtollsByActivity("DIVING");
      expect(atolls1).toEqual(atolls2);
    });

    it("should return empty array for unknown activity", () => {
      const atolls = getAtollsByActivity("unknown-activity");
      expect(atolls).toEqual([]);
    });

    it("should respect the limit parameter", () => {
      const atolls = getAtollsByActivity("diving", 3);
      expect(atolls.length).toBeLessThanOrEqual(3);
    });
  });

  describe("generateActivityLinks", () => {
    it("should generate activity links for diving", () => {
      const links = generateActivityLinks("diving");
      expect(links.length).toBeGreaterThan(0);
      expect(links[0]).toHaveProperty("name");
      expect(links[0]).toHaveProperty("url");
      expect(links[0]).toHaveProperty("description");
    });

    it("should generate proper URLs for activity links", () => {
      const links = generateActivityLinks("diving");
      links.forEach((link) => {
        expect(link.url).toMatch(/^\/atoll\//);
      });
    });

    it("should include activity name in description", () => {
      const links = generateActivityLinks("diving");
      links.forEach((link) => {
        expect(link.description.toLowerCase()).toContain("diving");
      });
    });
  });

  describe("getBreadcrumbItems", () => {
    it("should generate breadcrumb items for atoll page", () => {
      const items = getBreadcrumbItems("atoll", "Kaafu Atoll");
      expect(items[0].label).toBe("Home");
      expect(items[1].label).toBe("Atoll Guides");
      expect(items[2].label).toBe("Kaafu Atoll");
    });

    it("should generate breadcrumb items for island page", () => {
      const items = getBreadcrumbItems("island", "Dhigurah", {
        atoll: "Alif Dhaal",
        atollSlug: "alif-dhaal",
      });
      expect(items[0].label).toBe("Home");
      expect(items[1].label).toBe("Island Guides");
      expect(items[2].label).toBe("Alif Dhaal");
      expect(items[3].label).toBe("Dhigurah");
    });

    it("should generate breadcrumb items for activity page", () => {
      const items = getBreadcrumbItems("activity", "Diving Destinations");
      expect(items[0].label).toBe("Home");
      expect(items[1].label).toBe("Destinations");
      expect(items[2].label).toBe("Diving Destinations");
    });

    it("should have proper URLs for breadcrumb items", () => {
      const items = getBreadcrumbItems("atoll", "Kaafu Atoll");
      expect(items[0].url).toBe("/");
      expect(items[1].url).toBe("/atoll-guides");
      expect(items[2].url).toBe("#");
    });
  });

  describe("generateAnchorText", () => {
    it("should generate anchor text for atoll with activity", () => {
      const text = generateAnchorText("Kaafu Atoll", "diving", "atoll");
      expect(text).toBe("diving in Kaafu Atoll");
    });

    it("should generate anchor text for atoll without activity", () => {
      const text = generateAnchorText("Kaafu Atoll", undefined, "atoll");
      expect(text).toBe("Explore Kaafu Atoll");
    });

    it("should generate anchor text for island", () => {
      const text = generateAnchorText("Dhigurah", undefined, "island");
      expect(text).toBe("Visit Dhigurah");
    });

    it("should generate anchor text for island with activity", () => {
      const text = generateAnchorText("Dhigurah", "diving", "island");
      expect(text).toBe("diving in Dhigurah");
    });
  });

  describe("areAtollsInSameRegion", () => {
    it("should identify atolls in the same region", () => {
      const result = areAtollsInSameRegion("kaafu", "lhaviyani");
      expect(result).toBe(true);
    });

    it("should identify atolls in different regions", () => {
      const result = areAtollsInSameRegion("kaafu", "vaavu");
      expect(result).toBe(false);
    });

    it("should handle unknown atolls", () => {
      const result = areAtollsInSameRegion("unknown-1", "unknown-2");
      expect(result).toBe(false);
    });

    it("should work with atolls from central region", () => {
      const result = areAtollsInSameRegion("vaavu", "meemu");
      expect(result).toBe(true);
    });

    it("should work with atolls from south region", () => {
      const result = areAtollsInSameRegion("laamu", "addu");
      expect(result).toBe(true);
    });
  });

  describe("getAtollRegion", () => {
    it("should return North region for northern atolls", () => {
      expect(getAtollRegion("kaafu")).toBe("North");
      expect(getAtollRegion("baa")).toBe("North");
      expect(getAtollRegion("haa-alif")).toBe("North");
    });

    it("should return Central region for central atolls", () => {
      expect(getAtollRegion("vaavu")).toBe("Central");
      expect(getAtollRegion("meemu")).toBe("Central");
      expect(getAtollRegion("thaa")).toBe("Central");
    });

    it("should return South region for southern atolls", () => {
      expect(getAtollRegion("laamu")).toBe("South");
      expect(getAtollRegion("addu")).toBe("South");
      expect(getAtollRegion("gaaf-dhaal")).toBe("South");
    });

    it("should return null for unknown atoll", () => {
      expect(getAtollRegion("unknown-atoll")).toBe(null);
    });
  });

  describe("generateBreadcrumbSchema", () => {
    it("should generate valid schema.org BreadcrumbList", () => {
      const items = [
        { label: "Home", url: "/" },
        { label: "Atoll Guides", url: "/atoll-guides" },
      ];
      const schema = generateBreadcrumbSchema(items);
      const parsed = JSON.parse(schema);

      expect(parsed["@context"]).toBe("https://schema.org");
      expect(parsed["@type"]).toBe("BreadcrumbList");
      expect(parsed.itemListElement).toHaveLength(2);
    });

    it("should include position in breadcrumb items", () => {
      const items = [
        { label: "Home", url: "/" },
        { label: "Guides", url: "/guides" },
      ];
      const schema = generateBreadcrumbSchema(items);
      const parsed = JSON.parse(schema);

      expect(parsed.itemListElement[0].position).toBe(1);
      expect(parsed.itemListElement[1].position).toBe(2);
    });

    it("should convert relative URLs to absolute URLs", () => {
      const items = [{ label: "Home", url: "/" }];
      const schema = generateBreadcrumbSchema(items);
      const parsed = JSON.parse(schema);

      expect(parsed.itemListElement[0].item).toContain("https://islenomads.com");
    });
  });

  describe("generateLinkRecommendations", () => {
    it("should generate link recommendations for content", () => {
      const recommendations = generateLinkRecommendations("atoll", "kaafu", [
        "diving",
        "luxury",
      ]);
      expect(recommendations.length).toBeGreaterThan(0);
      expect(recommendations[0]).toHaveProperty("name");
      expect(recommendations[0]).toHaveProperty("url");
    });

    it("should remove duplicate links", () => {
      const recommendations = generateLinkRecommendations("atoll", "kaafu", [
        "diving",
        "diving",
      ]);
      const urls = recommendations.map((r) => r.url);
      const uniqueUrls = new Set(urls);
      expect(urls.length).toBe(uniqueUrls.size);
    });

    it("should limit recommendations to 5 items", () => {
      const recommendations = generateLinkRecommendations("atoll", "kaafu", [
        "diving",
        "luxury",
        "snorkeling",
        "family-vacations",
        "adventure",
      ]);
      expect(recommendations.length).toBeLessThanOrEqual(5);
    });
  });
});
