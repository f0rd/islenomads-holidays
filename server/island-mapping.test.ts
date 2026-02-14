import { describe, it, expect } from "vitest";
import { getDb } from "./db";
import { places, islandGuides } from "../drizzle/schema";
import { eq } from "drizzle-orm";

describe("Island Guide Mapping", () => {
  it("should have all island guides mapped to places", async () => {
    const db = await getDb();
    if (!db) throw new Error("Failed to connect to database");

    const allGuides = await db.select().from(islandGuides);
    const allPlaces = await db.select().from(places);

    const mappedGuides = allGuides.filter(guide => {
      return allPlaces.some(place => place.name === guide.name);
    });

    // Should have at least 6 guides properly mapped
    expect(mappedGuides.length).toBeGreaterThanOrEqual(6);
  });

  it("should have Omadhoo guide mapped to Omadhoo place", async () => {
    const db = await getDb();
    if (!db) throw new Error("Failed to connect to database");

    const guide = await db
      .select()
      .from(islandGuides)
      .where(eq(islandGuides.name, "Omadhoo"))
      .limit(1);

    const place = await db
      .select()
      .from(places)
      .where(eq(places.name, "Omadhoo"))
      .limit(1);

    expect(guide.length).toBe(1);
    expect(place.length).toBe(1);
    expect(guide[0].name).toBe(place[0].name);
  });

  it("should have Dhangethi guide mapped to Dhangethi place", async () => {
    const db = await getDb();
    if (!db) throw new Error("Failed to connect to database");

    const guide = await db
      .select()
      .from(islandGuides)
      .where(eq(islandGuides.name, "Dhangethi"))
      .limit(1);

    const place = await db
      .select()
      .from(places)
      .where(eq(places.name, "Dhangethi"))
      .limit(1);

    expect(guide.length).toBe(1);
    expect(place.length).toBe(1);
  });

  it("should have Fehendhoo guide mapped to Fehendhoo place", async () => {
    const db = await getDb();
    if (!db) throw new Error("Failed to connect to database");

    const guide = await db
      .select()
      .from(islandGuides)
      .where(eq(islandGuides.name, "Fehendhoo"))
      .limit(1);

    const place = await db
      .select()
      .from(places)
      .where(eq(places.name, "Fehendhoo"))
      .limit(1);

    expect(guide.length).toBe(1);
    expect(place.length).toBe(1);
  });

  it("should have Hanimadhoo guide mapped to Hanimadhoo place", async () => {
    const db = await getDb();
    if (!db) throw new Error("Failed to connect to database");

    const guide = await db
      .select()
      .from(islandGuides)
      .where(eq(islandGuides.name, "Hanimadhoo"))
      .limit(1);

    const place = await db
      .select()
      .from(places)
      .where(eq(places.name, "Hanimadhoo"))
      .limit(1);

    expect(guide.length).toBe(1);
    expect(place.length).toBe(1);
  });

  it("should have Fuvamulah guide mapped to Fuvamulah place", async () => {
    const db = await getDb();
    if (!db) throw new Error("Failed to connect to database");

    const guide = await db
      .select()
      .from(islandGuides)
      .where(eq(islandGuides.name, "Fuvamulah"))
      .limit(1);

    const place = await db
      .select()
      .from(places)
      .where(eq(places.name, "Fuvamulah"))
      .limit(1);

    expect(guide.length).toBe(1);
    expect(place.length).toBe(1);
  });

  it("should have Godhdhoo guide mapped to Godhdhoo place", async () => {
    const db = await getDb();
    if (!db) throw new Error("Failed to connect to database");

    const guide = await db
      .select()
      .from(islandGuides)
      .where(eq(islandGuides.name, "Godhdhoo"))
      .limit(1);

    const place = await db
      .select()
      .from(places)
      .where(eq(places.name, "Godhdhoo"))
      .limit(1);

    expect(guide.length).toBe(1);
    expect(place.length).toBe(1);
  });
});
