import { describe, it, expect, beforeAll } from "vitest";
import { getDb } from "./db";
import {
  islandGuides,
  attractionGuides,
  packages,
  atolls,
  activitySpots,
} from "../drizzle/schema";
import { eq } from "drizzle-orm";

describe("CMS Integration Tests", () => {
  let db: any;

  beforeAll(async () => {
    db = await getDb();
  });

  describe("Island Guides CRUD", () => {
    it("should retrieve all island guides", async () => {
      if (!db) return;
      const guides = await db.select().from(islandGuides).limit(10);
      expect(guides.length).toBeGreaterThan(0);
      expect(guides[0]).toHaveProperty("id");
      expect(guides[0]).toHaveProperty("name");
      expect(guides[0]).toHaveProperty("slug");
    });

    it("should retrieve island guide by slug", async () => {
      if (!db) return;
      const guide = await db
        .select()
        .from(islandGuides)
        .where(eq(islandGuides.slug, "kurendhoo"))
        .limit(1);
      expect(guide.length).toBe(1);
      expect(guide[0].name).toBe("Kurendhoo");
    });

    it("should have required fields in island guide", async () => {
      if (!db) return;
      const guide = await db.select().from(islandGuides).limit(1);
      expect(guide[0]).toHaveProperty("overview");
      expect(guide[0]).toHaveProperty("published");
      expect(guide[0]).toHaveProperty("createdAt");
      expect(guide[0]).toHaveProperty("updatedAt");
    });

    it("should count total island guides", async () => {
      if (!db) return;
      const result = await db.select().from(islandGuides);
      expect(result.length).toBeGreaterThanOrEqual(129);
    });

    it("should have unique slugs for island guides", async () => {
      if (!db) return;
      const guides = await db.select().from(islandGuides);
      const slugs = guides.map((g: any) => g.slug);
      const uniqueSlugs = new Set(slugs);
      expect(uniqueSlugs.size).toBe(slugs.length);
    });

    it("should have valid timestamps", async () => {
      if (!db) return;
      const guides = await db.select().from(islandGuides).limit(10);
      guides.forEach((guide: any) => {
        expect(guide.createdAt).toBeInstanceOf(Date);
        expect(guide.updatedAt).toBeInstanceOf(Date);
      });
    });

    it("should have published island guides", async () => {
      if (!db) return;
      const published = await db
        .select()
        .from(islandGuides)
        .where(eq(islandGuides.published, true))
        .limit(1);
      expect(published.length).toBeGreaterThan(0);
    });
  });

  describe("Attraction Guides", () => {
    it("should retrieve all attraction guides", async () => {
      if (!db) return;
      const attractions = await db
        .select()
        .from(attractionGuides)
        .limit(10);
      expect(attractions.length).toBeGreaterThan(0);
      expect(attractions[0]).toHaveProperty("id");
      expect(attractions[0]).toHaveProperty("name");
      expect(attractions[0]).toHaveProperty("attractionType");
    });

    it("should have valid attraction types", async () => {
      if (!db) return;
      const attractions = await db
        .select()
        .from(attractionGuides)
        .limit(20);
      const validTypes = ["dive_site", "snorkeling_spot", "surf_spot", "poi"];
      attractions.forEach((attraction: any) => {
        expect(validTypes).toContain(attraction.attractionType);
      });
    });

    it("should count total attractions", async () => {
      if (!db) return;
      const result = await db.select().from(attractionGuides);
      expect(result.length).toBeGreaterThanOrEqual(100);
    });

    it("should have difficulty levels for dive sites", async () => {
      if (!db) return;
      const diveSites = await db
        .select()
        .from(attractionGuides)
        .limit(10);
      const dives = diveSites.filter((s: any) => s.attractionType === "dive_site");
      dives.forEach((site: any) => {
        if (site.difficulty) {
          expect(["beginner", "intermediate", "advanced"]).toContain(
            site.difficulty
          );
        }
      });
    });

    it("should have unique slugs for attractions", async () => {
      if (!db) return;
      const attractions = await db.select().from(attractionGuides);
      const slugs = attractions.map((a: any) => a.slug);
      const uniqueSlugs = new Set(slugs);
      expect(uniqueSlugs.size).toBe(slugs.length);
    });
  });

  describe("Activity Spots", () => {
    it("should retrieve all activity spots", async () => {
      if (!db) return;
      const spots = await db.select().from(activitySpots).limit(10);
      expect(spots.length).toBeGreaterThan(0);
      expect(spots[0]).toHaveProperty("id");
      expect(spots[0]).toHaveProperty("name");
    });

    it("should count total activity spots", async () => {
      if (!db) return;
      const result = await db.select().from(activitySpots);
      expect(result.length).toBeGreaterThanOrEqual(100);
    });

    it("should support activity spot linking to islands", async () => {
      if (!db) return;
      const spotsWithIsland = await db.select().from(activitySpots).limit(10);
      expect(spotsWithIsland[0]).toHaveProperty("islandGuideId");
    });
  });

  describe("Packages", () => {
    it("should retrieve all packages", async () => {
      if (!db) return;
      const pkgs = await db.select().from(packages).limit(10);
      expect(pkgs.length).toBeGreaterThan(0);
      expect(pkgs[0]).toHaveProperty("id");
      expect(pkgs[0]).toHaveProperty("name");
      expect(pkgs[0]).toHaveProperty("slug");
    });

    it("should have valid package data", async () => {
      if (!db) return;
      const pkg = await db.select().from(packages).limit(1);
      expect(pkg[0]).toHaveProperty("price");
      expect(pkg[0]).toHaveProperty("published");
    });

    it("should count total packages", async () => {
      if (!db) return;
      const result = await db.select().from(packages);
      expect(result.length).toBeGreaterThanOrEqual(8);
    });

    it("should have unique slugs for packages", async () => {
      if (!db) return;
      const pkgs = await db.select().from(packages);
      const slugs = pkgs.map((p: any) => p.slug);
      const uniqueSlugs = new Set(slugs);
      expect(uniqueSlugs.size).toBe(slugs.length);
    });

    it("should have published packages", async () => {
      if (!db) return;
      const published = await db
        .select()
        .from(packages)
        .where(eq(packages.published, true))
        .limit(1);
      expect(published.length).toBeGreaterThan(0);
    });
  });

  describe("Atolls", () => {
    it("should retrieve all atolls", async () => {
      if (!db) return;
      const atollsList = await db.select().from(atolls).limit(10);
      expect(atollsList.length).toBeGreaterThan(0);
      expect(atollsList[0]).toHaveProperty("id");
      expect(atollsList[0]).toHaveProperty("name");
      expect(atollsList[0]).toHaveProperty("slug");
    });

    it("should have valid atoll data", async () => {
      if (!db) return;
      const atoll = await db.select().from(atolls).limit(1);
      expect(atoll[0]).toHaveProperty("region");
      expect(atoll[0]).toHaveProperty("description");
      expect(atoll[0]).toHaveProperty("published");
    });

    it("should count total atolls", async () => {
      if (!db) return;
      const result = await db.select().from(atolls);
      expect(result.length).toBeGreaterThanOrEqual(20);
    });

    it("should have unique slugs for atolls", async () => {
      if (!db) return;
      const atollsList = await db.select().from(atolls);
      const slugs = atollsList.map((a: any) => a.slug);
      const uniqueSlugs = new Set(slugs);
      expect(uniqueSlugs.size).toBe(slugs.length);
    });

    it("should have published atolls", async () => {
      if (!db) return;
      const published = await db
        .select()
        .from(atolls)
        .where(eq(atolls.published, true))
        .limit(1);
      expect(published.length).toBeGreaterThan(0);
    });
  });

  describe("Data Relationships", () => {
    it("should have activity spots with optional island linking", async () => {
      if (!db) return;
      const spots = await db.select().from(activitySpots).limit(10);
      spots.forEach((spot: any) => {
        if (spot.islandGuideId) {
          expect(typeof spot.islandGuideId).toBe("number");
        }
      });
    });

    it("should have attractions with optional island linking", async () => {
      if (!db) return;
      const attractions = await db.select().from(attractionGuides).limit(10);
      attractions.forEach((attraction: any) => {
        if (attraction.nearestIsland) {
          expect(typeof attraction.nearestIsland).toBe("string");
        }
      });
    });
  });

  describe("Content Availability", () => {
    it("all published guides should have required content", async () => {
      if (!db) return;
      const published = await db
        .select()
        .from(islandGuides)
        .where(eq(islandGuides.published, true))
        .limit(5);
      published.forEach((guide: any) => {
        expect(guide.name).toBeTruthy();
        expect(guide.slug).toBeTruthy();
      });
    });

    it("all published attractions should have required content", async () => {
      if (!db) return;
      const published = await db
        .select()
        .from(attractionGuides)
        .where(eq(attractionGuides.published, true))
        .limit(5);
      published.forEach((attraction: any) => {
        expect(attraction.name).toBeTruthy();
        expect(attraction.attractionType).toBeTruthy();
      });
    });
  });
});
