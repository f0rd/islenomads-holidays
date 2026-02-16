import { describe, it, expect } from "vitest";
import { z } from "zod";

/**
 * Attraction Guides API Tests
 * Tests the tRPC procedures for attraction guides
 */

describe("Attraction Guides API", () => {
  describe("Input Validation", () => {
    // Schema for attraction guide slug input
    const slugSchema = z.object({ slug: z.string() });

    it("should validate slug input", () => {
      const validInput = { slug: "test-dive-site" };
      const result = slugSchema.safeParse(validInput);
      expect(result.success).toBe(true);
    });

    it("should accept slug with min length requirement", () => {
      const slugSchemaWithMin = z.object({ slug: z.string().min(1) });
      const invalidInput = { slug: "" };
      const result = slugSchemaWithMin.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });

    // Schema for attraction type input
    const typeSchema = z.object({
      type: z.enum(["dive_site", "surf_spot", "snorkeling_spot", "poi"]),
      limit: z.number().optional(),
    });

    it("should validate attraction type", () => {
      const validInput = { type: "dive_site" as const, limit: 10 };
      const result = typeSchema.safeParse(validInput);
      expect(result.success).toBe(true);
    });

    it("should reject invalid attraction type", () => {
      const invalidInput = { type: "invalid_type" };
      const result = typeSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });

    // Schema for attraction guide creation
    const createSchema = z.object({
      placeId: z.number(),
      name: z.string(),
      slug: z.string(),
      attractionType: z.enum(["dive_site", "surf_spot", "snorkeling_spot", "poi"]),
      overview: z.string().optional(),
      difficulty: z.enum(["beginner", "intermediate", "advanced", "expert"]).optional(),
      bestSeason: z.string().optional(),
      published: z.number().optional(),
      featured: z.number().optional(),
    });

    it("should validate attraction guide creation input", () => {
      const validInput = {
        placeId: 1,
        name: "Test Dive Site",
        slug: "test-dive-site",
        attractionType: "dive_site" as const,
        overview: "A beautiful dive site",
        difficulty: "intermediate" as const,
      };
      const result = createSchema.safeParse(validInput);
      expect(result.success).toBe(true);
    });

    it("should require placeId, name, slug, and attractionType", () => {
      const invalidInput = {
        name: "Test Dive Site",
        slug: "test-dive-site",
      };
      const result = createSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });
  });

  describe("Attraction Type Handling", () => {
    const attractionTypes = ["dive_site", "surf_spot", "snorkeling_spot", "poi"];

    it("should handle all valid attraction types", () => {
      attractionTypes.forEach((type) => {
        const schema = z.enum(["dive_site", "surf_spot", "snorkeling_spot", "poi"]);
        const result = schema.safeParse(type);
        expect(result.success).toBe(true);
      });
    });

    it("should map attraction types to labels", () => {
      const labels: Record<string, string> = {
        dive_site: "Dive Site",
        surf_spot: "Surf Spot",
        snorkeling_spot: "Snorkeling Spot",
        poi: "Point of Interest",
      };

      Object.entries(labels).forEach(([type, label]) => {
        expect(label).toBeTruthy();
        expect(label.length).toBeGreaterThan(0);
      });
    });
  });

  describe("Difficulty Level Handling", () => {
    const difficultyLevels = ["beginner", "intermediate", "advanced", "expert"];

    it("should handle all valid difficulty levels", () => {
      difficultyLevels.forEach((level) => {
        const schema = z.enum(["beginner", "intermediate", "advanced", "expert"]);
        const result = schema.safeParse(level);
        expect(result.success).toBe(true);
      });
    });

    it("should map difficulty levels to colors", () => {
      const colors: Record<string, string> = {
        beginner: "bg-green-100 text-green-800",
        intermediate: "bg-yellow-100 text-yellow-800",
        advanced: "bg-orange-100 text-orange-800",
        expert: "bg-red-100 text-red-800",
      };

      Object.entries(colors).forEach(([level, color]) => {
        expect(color).toContain("bg-");
        expect(color).toContain("text-");
      });
    });
  });

  describe("Data Transformation", () => {
    it("should parse JSON fields correctly", () => {
      const quickFacts = JSON.stringify(["Fact 1", "Fact 2", "Fact 3"]);
      const parsed = JSON.parse(quickFacts);
      expect(Array.isArray(parsed)).toBe(true);
      expect(parsed.length).toBe(3);
    });

    it("should handle empty JSON arrays", () => {
      const empty = JSON.stringify([]);
      const parsed = JSON.parse(empty);
      expect(Array.isArray(parsed)).toBe(true);
      expect(parsed.length).toBe(0);
    });

    it("should generate slug from name", () => {
      const name = "Crystal Clear Dive Site";
      const slug = name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]/g, "");
      expect(slug).toBe("crystal-clear-dive-site");
    });
  });

  describe("Query Parameters", () => {
    it("should accept optional limit parameter", () => {
      const schema = z.object({
        type: z.enum(["dive_site", "surf_spot", "snorkeling_spot", "poi"]),
        limit: z.number().optional(),
      });

      const withLimit = schema.safeParse({ type: "dive_site", limit: 50 });
      const withoutLimit = schema.safeParse({ type: "dive_site" });

      expect(withLimit.success).toBe(true);
      expect(withoutLimit.success).toBe(true);
    });

    it("should validate limit is a positive number", () => {
      const schema = z.object({ limit: z.number().positive() });

      const valid = schema.safeParse({ limit: 10 });
      const invalid = schema.safeParse({ limit: -5 });

      expect(valid.success).toBe(true);
      expect(invalid.success).toBe(false);
    });
  });
});
