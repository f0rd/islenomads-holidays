import { getDb } from "../server/db";
import { transports, places } from "../drizzle/schema";
import { eq, isNull } from "drizzle-orm";

// Helper function to clean location names
function cleanLocationName(loc: string): string {
  return loc
    .replace(/\s*-\s*.*$/, "") // Remove " - description" part
    .replace(/\s+island$/, "") // Remove " island" suffix
    .replace(/\s+atoll$/, "") // Remove " atoll" suffix
    .replace(/\s+reef$/, "") // Remove " reef" suffix
    .trim();
}

async function mapTransportsToPlaces() {
  const db = await getDb();
  if (!db) {
    console.log("❌ Database connection failed");
    return;
  }

  try {
    console.log("🚢 Starting transports to places mapping...\n");

    // Get all transports with NULL place IDs
    const transportsWithoutPlaceIds = await db
      .select()
      .from(transports)
      .where(isNull(transports.fromPlaceId));

    console.log(
      `Found ${transportsWithoutPlaceIds.length} transports without place IDs\n`
    );

    // Get all places for matching
    const allPlaces = await db.select().from(places);
    console.log(`Available places: ${allPlaces.length}\n`);

    let updated = 0;
    let failed = 0;

    for (const transport of transportsWithoutPlaceIds) {
      const fromLocation = transport.fromLocation?.toLowerCase().trim();
      const toLocation = transport.toLocation?.toLowerCase().trim();

      // Clean location names
      const cleanFromLocation = cleanLocationName(fromLocation || "");
      const cleanToLocation = cleanLocationName(toLocation || "");

      // Find matching places by name with fuzzy matching
      const fromPlace = allPlaces.find(
        (p) =>
          p.name?.toLowerCase().trim() === cleanFromLocation ||
          p.name?.toLowerCase().includes(cleanFromLocation) ||
          cleanFromLocation.includes(p.name?.toLowerCase().trim() || "")
      );
      const toPlace = allPlaces.find(
        (p) =>
          p.name?.toLowerCase().trim() === cleanToLocation ||
          p.name?.toLowerCase().includes(cleanToLocation) ||
          cleanToLocation.includes(p.name?.toLowerCase().trim() || "")
      );

      if (fromPlace && toPlace) {
        // Update the transport with place IDs
        await db
          .update(transports)
          .set({
            fromPlaceId: fromPlace.id,
            toPlaceId: toPlace.id,
          })
          .where(eq(transports.id, transport.id));

        console.log(
          `✅ Transport ${transport.id}: ${transport.name} (${fromPlace.id} → ${toPlace.id})`
        );
        updated++;
      } else {
        console.log(
          `❌ Transport ${transport.id}: ${transport.name} - Could not find places for "${fromLocation}" (${cleanFromLocation}) → "${toLocation}" (${cleanToLocation})`
        );
        failed++;
      }
    }

    console.log(
      `\n📊 Summary: ${updated} updated, ${failed} failed out of ${transportsWithoutPlaceIds.length} transports`
    );
  } catch (error) {
    console.error("Error mapping transports:", error);
  }
}

mapTransportsToPlaces();
