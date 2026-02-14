import { getDb } from "../server/db";
import { islandGuides, places } from "../drizzle/schema";
import { eq } from "drizzle-orm";

async function checkMissingGuides() {
  try {
    const db = await getDb();
    if (!db) {
      console.error("✗ Failed to connect to database");
      process.exit(1);
    }

    console.log("📊 Checking island guides status...\n");

    // Get all guides
    const guides = await db.select().from(islandGuides);
    
    // Get all island places
    const allPlaces = await db.select().from(places).where(eq(places.type, "island"));
    
    console.log(`Total island places: ${allPlaces.length}`);
    console.log(`Total island guides: ${guides.length}`);
    console.log(`Missing guides: ${allPlaces.length - guides.length}\n`);

    // Get guide names
    const guideNames = new Set(guides.map(g => g.name));

    // Find missing
    const missing = allPlaces.filter(p => !guideNames.has(p.name));
    
    if (missing.length > 0) {
      console.log("Missing guides:");
      missing.forEach(p => {
        console.log(`  - ${p.name} (ID: ${p.id})`);
      });
    } else {
      console.log("✓ All islands have guides!");
    }
  } catch (error) {
    console.error("✗ Error checking guides:", error);
    throw error;
  }
}

checkMissingGuides().then(() => {
  process.exit(0);
});
