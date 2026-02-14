import { getDb } from '../server/db';
import { eq } from 'drizzle-orm';
import { places, islandGuides } from '../drizzle/schema';

/**
 * Fix POI categorization by updating dive sites and special locations
 * These should not appear in the Islands tab but in the Attractions tab
 */
async function fixPOICategorization() {
  const db = await getDb();
  if (!db) {
    console.error('Failed to connect to database');
    return;
  }

  // List of dive sites and POIs that should be marked as point_of_interest
  const poiNames = [
    'Maaya Thila',      // Dive site
    'Kandooma Thila',   // Dive site
    'HP Reef',          // Dive site/reef
  ];

  console.log(`Updating ${poiNames.length} items to point_of_interest type...`);

  for (const name of poiNames) {
    try {
      // Update places table
      await db.update(places)
        .set({ type: 'dive_site' as any })
        .where(eq(places.name, name));

      // Update island_guides table
      await db.update(islandGuides)
        .set({ contentType: 'point_of_interest' as any })
        .where(eq(islandGuides.name, name));

      console.log(`✓ Updated ${name}`);
    } catch (error) {
      console.error(`✗ Failed to update ${name}:`, error);
    }
  }

  console.log('POI categorization fix complete!');
}

fixPOICategorization().catch(console.error);
