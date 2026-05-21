import fs from "fs/promises";
import path from "path";
import { getDb } from "../server/db";
import { islandGuides, activitySpots } from "../drizzle/schema";
import { eq } from "drizzle-orm";

const EXPORT_DIR = path.resolve(".manus/exports");
const GUIDE_FILE = path.join(EXPORT_DIR, "island_guides_thulusdhoo_precise.json");
const SPOTS_FILE = path.join(EXPORT_DIR, "activity_spots_thulusdhoo_precise.json");

function sanitizeGuideRow(raw: Record<string, any>) {
  const allowedKeys = [
    "placeId",
    "name",
    "slug",
    "contentType",
    "atoll",
    "overview",
    "quickFacts",
    "flightInfo",
    "speedboatInfo",
    "ferryInfo",
    "topThingsToDo",
    "beachesLocalRules",
    "foodCafes",
    "currency",
    "language",
    "bestTimeToVisit",
    "whatToPack",
    "healthTips",
    "emergencyContacts",
    "threeDayItinerary",
    "fiveDayItinerary",
    "faq",
    "nearbyAirports",
    "nearbyDiveSites",
    "nearbySurfSpots",
    "heroImage",
    "images",
    "latitude",
    "longitude",
    "metaTitle",
    "metaDescription",
    "metaKeywords",
    "focusKeyword",
    "seoScore",
    "published",
    "featured",
    "displayOrder",
    "viewCount",
    "createdAt",
    "updatedAt",
  ]; 

  const row: Record<string, any> = {};
  for (const key of allowedKeys) {
    if (raw[key] !== undefined) {
      row[key] = raw[key];
    }
  }
  return row;
}

function sanitizeSpotRow(raw: Record<string, any>) {
  const allowedKeys = [
    "placeId",
    "islandGuideId",
    "atollId",
    "primaryTypeId",
    "name",
    "slug",
    "spotType",
    "category",
    "description",
    "difficulty",
    "latitude",
    "longitude",
    "accessInfo",
    "bestSeason",
    "bestTime",
    "waterConditions",
    "maxDepth",
    "minDepth",
    "marineLife",
    "waveHeight",
    "waveType",
    "coralCoverage",
    "fishSpecies",
    "tips",
    "facilities",
    "images",
    "rating",
    "reviewCount",
    "capacity",
    "operatorInfo",
    "metaTitle",
    "metaDescription",
    "published",
    "featured",
    "displayOrder",
    "viewCount",
    "createdAt",
    "updatedAt",
  ]; 

  const row: Record<string, any> = {};
  for (const key of allowedKeys) {
    if (raw[key] !== undefined) {
      row[key] = raw[key];
    }
  }
  return row;
}

async function readJsonFile(filePath: string) {
  const content = await fs.readFile(filePath, "utf8");
  return JSON.parse(content) as Record<string, any>[];
}

async function importThulusdhooGuide() {
  const db = await getDb();
  const guideRows = await readJsonFile(GUIDE_FILE);

  if (!guideRows.length) {
    console.warn(`No guide rows found in ${GUIDE_FILE}`);
    return;
  }

  const rawGuide = guideRows[0];
  const guideData = sanitizeGuideRow(rawGuide);

  const existing = await db
    .select()
    .from(islandGuides)
    .where(eq(islandGuides.slug, guideData.slug))
    .limit(1);

  if (existing.length > 0) {
    await db
      .update(islandGuides)
      .set(guideData)
      .where(eq(islandGuides.slug, guideData.slug));
    console.log(`Updated existing island guide '${guideData.slug}'.`);
  } else {
    await db.insert(islandGuides).values(guideData);
    console.log(`Inserted new island guide '${guideData.slug}'.`);
  }
}

async function importThulusdhooSpots() {
  const db = await getDb();
  const spotRows = await readJsonFile(SPOTS_FILE);

  if (!spotRows.length) {
    console.warn(`No activity spots found in ${SPOTS_FILE}`);
    return;
  }

  let inserted = 0;
  let updated = 0;

  for (const rawSpot of spotRows) {
    const spotData = sanitizeSpotRow(rawSpot);
    if (!spotData.slug || !spotData.islandGuideId) {
      console.warn("Skipping spot with missing slug or islandGuideId:", rawSpot);
      continue;
    }

    const existing = await db
      .select()
      .from(activitySpots)
      .where(eq(activitySpots.slug, spotData.slug))
      .limit(1);

    if (existing.length > 0) {
      await db
        .update(activitySpots)
        .set(spotData)
        .where(eq(activitySpots.slug, spotData.slug));
      updated += 1;
    } else {
      await db.insert(activitySpots).values(spotData);
      inserted += 1;
    }
  }

  console.log(`Activity spots imported: ${inserted} inserted, ${updated} updated.`);
}

async function main() {
  console.log("Starting Thulusdhoo previous data import...");
  try {
    await importThulusdhooGuide();
    await importThulusdhooSpots();
    console.log("Done.");
  } catch (error) {
    console.error("Import failed:", error);
    process.exit(1);
  }
}

main();
