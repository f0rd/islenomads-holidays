import { getDb } from '../server/db';
import { eq } from 'drizzle-orm';
import { islandGuides, activitySpots } from '../drizzle/schema';

/**
 * Migrate existing activity spots data to island_guides nearbyDiveSites and nearbySurfSpots fields
 * This uses the existing data in activity_spots table instead of generating new data
 */
async function migrateActivitySpots() {
  const db = await getDb();
  if (!db) {
    console.error('Failed to connect to database');
    return;
  }

  console.log('Migrating activity spots to island guides...\n');

  // Get all island guides
  const allGuides = await db.select().from(islandGuides);
  
  let updatedCount = 0;
  let skippedCount = 0;

  for (const guide of allGuides) {
    try {
      // Get activity spots for this guide
      const spots = await db
        .select()
        .from(activitySpots)
        .where(eq(activitySpots.islandGuideId, guide.id));

      if (spots.length === 0) {
        skippedCount++;
        continue;
      }

      // Separate dive sites and surf spots
      const diveSites = spots
        .filter(s => s.spotType === 'dive_site')
        .map(s => ({
          name: s.name,
          distance: s.description ? 'Nearby' : 'N/A',
          difficulty: s.difficulty || 'intermediate',
          description: s.description || ''
        }));

      const surfSpots = spots
        .filter(s => s.spotType === 'surf_spot')
        .map(s => ({
          name: s.name,
          distance: s.description ? 'Nearby' : 'N/A',
          difficulty: s.difficulty || 'intermediate',
          description: s.description || ''
        }));

      // Update guide with activity spots data
      const updateData: any = {};
      
      if (diveSites.length > 0) {
        updateData.nearbyDiveSites = JSON.stringify(diveSites);
      }
      
      if (surfSpots.length > 0) {
        updateData.nearbySurfSpots = JSON.stringify(surfSpots);
      }

      if (Object.keys(updateData).length > 0) {
        await db.update(islandGuides)
          .set(updateData)
          .where(eq(islandGuides.id, guide.id));

        console.log(`✓ ${guide.name}: ${diveSites.length} dive sites, ${surfSpots.length} surf spots`);
        updatedCount++;
      }
    } catch (error) {
      console.error(`✗ Error processing ${guide.name}:`, error);
    }
  }

  console.log(`\n📊 SUMMARY:`);
  console.log(`Updated: ${updatedCount} guides`);
  console.log(`Skipped (no activity spots): ${skippedCount} guides`);
}

migrateActivitySpots().catch(console.error);
