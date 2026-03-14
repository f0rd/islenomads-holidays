import { getDb } from "./server/db.ts";
import { islandGuides } from "./drizzle/schema.ts";
import { eq } from "drizzle-orm";

const db = await getDb();

if (!db) {
  console.error("Database connection failed!");
  process.exit(1);
}

// Get a complete Alif Alif island as template
const templateResults = await db.select().from(islandGuides).where(eq(islandGuides.atoll, "Alif Alif Atoll")).limit(1);
const templateIsland = templateResults[0];

if (!templateIsland) {
  console.error("Template island not found!");
  process.exit(1);
}

console.log("Template Island:", templateIsland.name);
console.log("Template Atoll:", templateIsland.atoll);

// Get all islands
const allIslands = await db.select().from(islandGuides);

console.log(`\nFound ${allIslands.length} total islands`);

// Count how many need data
let updated = 0;
for (const island of allIslands) {
  let needsUpdate = false;
  const updateData = {};

  // Check and populate missing fields
  if (!island.overview || island.overview === "") {
    updateData.overview = templateIsland.overview;
    needsUpdate = true;
  }

  if (!island.heroImage || island.heroImage === "") {
    updateData.heroImage = templateIsland.heroImage;
    needsUpdate = true;
  }

  if (!island.quickFacts || island.quickFacts === "") {
    updateData.quickFacts = templateIsland.quickFacts;
    needsUpdate = true;
  }

  if (!island.topThingsToDo || island.topThingsToDo === "") {
    updateData.topThingsToDo = templateIsland.topThingsToDo;
    needsUpdate = true;
  }

  if (!island.faq || island.faq === "") {
    updateData.faq = templateIsland.faq;
    needsUpdate = true;
  }

  if (needsUpdate) {
    await db
      .update(islandGuides)
      .set(updateData)
      .where(eq(islandGuides.id, island.id));
    updated++;
    console.log(`Updated: ${island.name} (${island.atoll})`);
  }
}

console.log(`\n✅ Successfully updated ${updated} islands with template data`);
