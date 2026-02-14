import { getDb } from "../server/db";
import { places } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import { ALL_ISLANDS } from "../shared/locations";

async function populatePlacesTable() {
  try {
    const db = await getDb();
    if (!db) {
      console.error("✗ Failed to connect to database");
      process.exit(1);
    }

    console.log("📍 Starting places table population from locations.ts...\n");

    let created = 0;
    let skipped = 0;

    for (const island of ALL_ISLANDS) {
      // Check if place already exists
      const existing = await db
        .select()
        .from(places)
        .where(eq(places.id, island.id))
        .limit(1);

      if (existing.length > 0) {
        console.log(`⏭️  Skipped ${island.name} (ID: ${island.id}) - already exists`);
        skipped++;
        continue;
      }

      // Create new place
      await db.insert(places).values({
        id: island.id,
        name: island.name,
        code: island.slug,
        type: island.type,
      });

      console.log(`✓ Created ${island.name} (ID: ${island.id})`);
      created++;
    }

    console.log(`\n✓ Population complete!`);
    console.log(`  Created: ${created}`);
    console.log(`  Skipped: ${skipped}`);
    console.log(`  Total: ${created + skipped}`);
  } catch (error) {
    console.error("✗ Error populating places table:", error);
    throw error;
  }
}

populatePlacesTable().then(() => {
  process.exit(0);
});
