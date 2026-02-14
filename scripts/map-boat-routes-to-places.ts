import { getDb } from "../server/db";
import { boatRoutes, places } from "../drizzle/schema";
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

async function mapBoatRoutesToPlaces() {
  const db = await getDb();
  if (!db) {
    console.log("❌ Database connection failed");
    return;
  }

  try {
    console.log("🚤 Starting boat routes to places mapping...\n");

    // Get all boat routes with NULL place IDs
    const routesWithoutPlaceIds = await db
      .select()
      .from(boatRoutes)
      .where(isNull(boatRoutes.fromPlaceId));

    console.log(
      `Found ${routesWithoutPlaceIds.length} boat routes without place IDs\n`
    );

    // Get all places for matching
    const allPlaces = await db.select().from(places);
    console.log(`Available places: ${allPlaces.length}\n`);

    let updated = 0;
    let failed = 0;

    for (const route of routesWithoutPlaceIds) {
      const fromLocation = route.fromLocation?.toLowerCase().trim();
      const toLocation = route.toLocation?.toLowerCase().trim();

      // Find matching places by name with fuzzy matching
      // Extract island name from location (e.g., "maafushi island" -> "maafushi")
      const cleanLocationName = (loc: string) => {
        return loc
          .replace(/\s*-\s*.*$/, "") // Remove " - description" part
          .replace(/\s+island$/, "") // Remove " island" suffix
          .replace(/\s+atoll$/, "") // Remove " atoll" suffix
          .replace(/\s+reef$/, "") // Remove " reef" suffix
          .trim();
      };

      const cleanFromLocation = cleanLocationName(fromLocation || "");
      const cleanToLocation = cleanLocationName(toLocation || "");

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
        // Update the boat route with place IDs
        await db
          .update(boatRoutes)
          .set({
            fromPlaceId: fromPlace.id,
            toPlaceId: toPlace.id,
          })
          .where(eq(boatRoutes.id, route.id));

        console.log(
          `✅ Route ${route.id}: ${route.name} (${fromPlace.id} → ${toPlace.id})`
        );
        updated++;
      } else {
        console.log(
          `❌ Route ${route.id}: ${route.name} - Could not find places for "${fromLocation}" (${cleanFromLocation}) → "${toLocation}" (${cleanToLocation})`
        );
        failed++;
      }
    }

    console.log(
      `\n📊 Summary: ${updated} updated, ${failed} failed out of ${routesWithoutPlaceIds.length} routes`
    );
  } catch (error) {
    console.error("Error mapping boat routes:", error);
  }
}

mapBoatRoutesToPlaces();
