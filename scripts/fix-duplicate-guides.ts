import { getDb } from '../server/db';
import { eq } from 'drizzle-orm';
import { islandGuides } from '../drizzle/schema';

/**
 * Fix duplicate guides and empty content
 * 1. Find duplicates by name
 * 2. Keep the one with most content
 * 3. Delete the empty one
 * 4. Report on all empty guides
 */
async function fixDuplicateGuides() {
  const db = await getDb();
  if (!db) {
    console.error('Failed to connect to database');
    return;
  }

  console.log('Finding duplicate guides...\n');

  // Get all guides
  const allGuides = await db.select().from(islandGuides);
  
  // Group by name
  const guidesByName: Record<string, typeof allGuides> = {};
  allGuides.forEach(guide => {
    if (!guidesByName[guide.name]) {
      guidesByName[guide.name] = [];
    }
    guidesByName[guide.name].push(guide);
  });

  // Find duplicates
  const duplicates = Object.entries(guidesByName).filter(([_, guides]) => guides.length > 1);
  
  console.log(`Found ${duplicates.length} islands with duplicate guides:\n`);

  let deletedCount = 0;
  
  for (const [name, guides] of duplicates) {
    console.log(`\n📍 ${name}:`);
    guides.forEach((guide, idx) => {
      const hasOverview = guide.overview && guide.overview.length > 0;
      const hasActivities = guide.topThingsToDo && guide.topThingsToDo.length > 0;
      const hasFood = guide.foodCafes && guide.foodCafes.length > 0;
      const contentScore = (hasOverview ? 1 : 0) + (hasActivities ? 1 : 0) + (hasFood ? 1 : 0);
      console.log(`  [${idx + 1}] ID: ${guide.id}, Content Score: ${contentScore}/3`);
    });

    // Keep the one with most content, delete the others
    const sorted = [...guides].sort((a, b) => {
      const scoreA = (a.overview ? 1 : 0) + (a.topThingsToDo ? 1 : 0) + (a.foodCafes ? 1 : 0);
      const scoreB = (b.overview ? 1 : 0) + (b.topThingsToDo ? 1 : 0) + (b.foodCafes ? 1 : 0);
      return scoreB - scoreA;
    });

    // Delete all but the best one
    for (let i = 1; i < sorted.length; i++) {
      try {
        await db.delete(islandGuides).where(eq(islandGuides.id, sorted[i].id));
        console.log(`  ✓ Deleted ID ${sorted[i].id} (keeping ID ${sorted[0].id})`);
        deletedCount++;
      } catch (error) {
        console.error(`  ✗ Failed to delete ID ${sorted[i].id}:`, error);
      }
    }
  }

  console.log(`\n\n📊 SUMMARY:`);
  console.log(`Deleted ${deletedCount} duplicate guides\n`);

  // Now check for guides with empty content
  console.log('Checking for guides with empty content...\n');
  
  const emptyGuides = allGuides.filter(g => 
    (!g.overview || g.overview.length === 0) ||
    (!g.topThingsToDo || g.topThingsToDo.length === 0) ||
    (!g.foodCafes || g.foodCafes.length === 0)
  );

  console.log(`Found ${emptyGuides.length} guides with empty content:\n`);
  emptyGuides.slice(0, 10).forEach(guide => {
    console.log(`  - ${guide.name} (ID: ${guide.id})`);
  });

  if (emptyGuides.length > 10) {
    console.log(`  ... and ${emptyGuides.length - 10} more`);
  }
}

fixDuplicateGuides().catch(console.error);
