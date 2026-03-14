import { getDb } from "./server/db.ts";
import { islandGuides } from "./drizzle/schema.ts";
import { like, eq } from "drizzle-orm";

try {
  const db = await getDb();
  if (!db) throw new Error("Database connection failed");

  // Mark Dharavandhoo (island with DRV airport) as featured
  const dharavandhooResult = await db
    .update(islandGuides)
    .set({ featured: 1, displayOrder: 21 })
    .where(like(islandGuides.nearbyAirports, "%DRV%"));

  console.log("✅ Dharavandhoo marked as featured (displayOrder: 21)");
  console.log("   Rows affected:", dharavandhooResult.rowsAffected);

  // Mark Eydhafushi as featured
  const eydhafushiResult = await db
    .update(islandGuides)
    .set({ featured: 1, displayOrder: 22 })
    .where(like(islandGuides.name, "%Eydh%"));

  console.log("✅ Eydhafushi marked as featured (displayOrder: 22)");
  console.log("   Rows affected:", eydhafushiResult.rowsAffected);

  // Verify the updates
  const featured = await db
    .select({ id: islandGuides.id, name: islandGuides.name, displayOrder: islandGuides.displayOrder })
    .from(islandGuides)
    .where(eq(islandGuides.featured, 1))
    .orderBy(islandGuides.displayOrder);

  console.log("\n✅ Total featured islands now:", featured.length);
  console.log("\nFeatured islands (last 5):");
  featured.slice(-5).forEach(island => {
    console.log(`   ${island.displayOrder}. ${island.name}`);
  });

  process.exit(0);
} catch (error) {
  console.error("❌ Error:", error.message);
  process.exit(1);
}
