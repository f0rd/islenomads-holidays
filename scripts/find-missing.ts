import { getDb } from "../server/db";
import { places } from "../drizzle/schema";
import { ALL_ISLANDS } from "../shared/locations";

async function findMissing() {
  const db = await getDb();
  if (!db) throw new Error("Failed to connect to database");

  const dbPlaces = await db.select().from(places);
  const dbIslands = dbPlaces.filter(p => p.type === 'island');

  const locationsIds = new Set(ALL_ISLANDS.map(i => i.id));

  console.log("Missing islands in locations file:");
  let count = 0;
  for (const dbIsland of dbIslands) {
    if (!locationsIds.has(dbIsland.id)) {
      count++;
      console.log(`  ID ${dbIsland.id}: ${dbIsland.name}`);
    }
  }

  console.log(`\nTotal missing: ${count}`);
  console.log(`Total in locations: ${ALL_ISLANDS.length}`);
  console.log(`Total in database: ${dbIslands.length}`);
}

findMissing().catch(console.error);
