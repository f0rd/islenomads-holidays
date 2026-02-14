import { getDb } from "../server/db";
import { places } from "../drizzle/schema";
import { ALL_ISLANDS } from "../shared/locations";

async function findMismatch() {
  const db = await getDb();
  if (!db) throw new Error("Failed to connect to database");

  const dbPlaces = await db.select().from(places);
  const dbIslands = dbPlaces.filter(p => p.type === 'island');

  console.log("Checking for mismatches...\n");

  for (const location of ALL_ISLANDS) {
    const dbPlace = dbIslands.find(p => p.id === location.id);
    if (!dbPlace) {
      console.log(`❌ ID ${location.id} (${location.name}) - NOT FOUND IN DATABASE`);
    } else if (dbPlace.name !== location.name) {
      console.log(`❌ ID ${location.id} - NAME MISMATCH`);
      console.log(`   Location file: "${location.name}"`);
      console.log(`   Database: "${dbPlace.name}"`);
    }
  }

  console.log("\n✓ Check complete");
}

findMismatch().catch(console.error);
