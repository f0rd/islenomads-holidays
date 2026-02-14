import { describe, it, expect } from "vitest";
import { getDb } from "./db";
import { places } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import { ALL_ISLANDS, FEATURED_ISLANDS } from "../shared/locations";

describe("Island Locations Sync", () => {
  it("should have Maafushi with correct ID 87", () => {
    const maafushi = ALL_ISLANDS.find(i => i.name === "Maafushi");
    expect(maafushi).toBeDefined();
    if (maafushi) {
      expect(maafushi.id).toBe(87);
    }
  });

  it("should have all featured islands in ALL_ISLANDS", () => {
    FEATURED_ISLANDS.forEach(featured => {
      const found = ALL_ISLANDS.find(i => i.id === featured.id);
      expect(found).toBeDefined();
      if (found) {
        expect(found.name).toBe(featured.name);
      }
    });
  });

  it("should have 129 unique islands total", () => {
    expect(ALL_ISLANDS.length).toBe(129);
  });

  it("should have all island IDs match database", async () => {
    const db = await getDb();
    if (!db) throw new Error("Failed to connect to database");

    const dbPlaces = await db.select().from(places);
    const dbIslands = dbPlaces.filter(p => p.type === 'island');

    // Check that all locations have matching database entries
    for (const location of ALL_ISLANDS) {
      const dbPlace = dbIslands.find(p => p.id === location.id);
      expect(dbPlace).toBeDefined();
      if (dbPlace) {
        expect(dbPlace.name).toBe(location.name);
      }
    }
  });

  it("should have Maafushi guide accessible via ID 87", async () => {
    const db = await getDb();
    if (!db) throw new Error("Failed to connect to database");

    const maafushiPlace = await db
      .select()
      .from(places)
      .where(eq(places.id, 87))
      .limit(1);

    expect(maafushiPlace.length).toBeGreaterThan(0);
    if (maafushiPlace.length > 0) {
      expect(maafushiPlace[0].name).toBe("Maafushi");
    }
  });

  it("should have no duplicate island IDs", () => {
    const ids = ALL_ISLANDS.map(i => i.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
    expect(uniqueIds.size).toBe(129);
  });

  it("should have no duplicate island names", () => {
    const names = ALL_ISLANDS.map(i => i.name);
    const uniqueNames = new Set(names);
    expect(uniqueNames.size).toBe(names.length);
    expect(uniqueNames.size).toBe(129);
  });
});
