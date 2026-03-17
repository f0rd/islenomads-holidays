import { getDb } from "./server/db";
import { islandGuides } from "./drizzle/schema";
import { sql } from "drizzle-orm";

async function checkCoordinates() {
  const db = await getDb();
  if (!db) {
    console.log("Database connection failed");
    process.exit(1);
  }

  try {
    // Use raw SQL to fetch coordinates
    const result = await db.execute(
      sql`SELECT name, slug, latitude, longitude, featured FROM island_guides WHERE published = 1 AND latitude IS NOT NULL AND longitude IS NOT NULL ORDER BY featured DESC, id ASC LIMIT 30`
    );

    console.log("Island Coordinates from Database:");
    console.log("================================\n");

    const rows = result as any[];
    rows.forEach((island, idx) => {
      const lat = typeof island.latitude === "number" 
        ? island.latitude 
        : parseFloat(String(island.latitude || 0));
      const lng = typeof island.longitude === "number" 
        ? island.longitude 
        : parseFloat(String(island.longitude || 0));

      console.log(`${idx + 1}. ${island.name} (${island.slug})`);
      console.log(`   Lat: ${lat}, Lng: ${lng}`);
      console.log(`   Featured: ${island.featured}\n`);
    });
  } catch (error) {
    console.error("Error fetching coordinates:", error);
  }

  process.exit(0);
}

checkCoordinates().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
