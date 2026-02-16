import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;

const corrections = [
  // Dive Sites
  { attractionSlug: 'banana-reef', islandId: 180001, distance: '8 km', travelTime: '20 minutes', transportMethod: 'speedboat' },
  { attractionSlug: 'maaya-thila', islandId: 180004, distance: '12 km', travelTime: '25 minutes', transportMethod: 'speedboat' },
  { attractionSlug: 'kandooma-thila', islandId: 150006, distance: '5 km', travelTime: '15 minutes', transportMethod: 'speedboat' },
  { attractionSlug: 'hp-reef', islandId: 180001, distance: '10 km', travelTime: '20 minutes', transportMethod: 'speedboat' },
  { attractionSlug: 'fesdu-wreck', islandId: 180004, distance: '15 km', travelTime: '30 minutes', transportMethod: 'speedboat' },
  { attractionSlug: 'veligandu-reef', islandId: 180001, distance: '6 km', travelTime: '15 minutes', transportMethod: 'speedboat' },
  
  // Surf Spots
  { attractionSlug: 'chickens', islandId: 180009, distance: '8 km', travelTime: '20 minutes', transportMethod: 'speedboat' },
  { attractionSlug: 'riptides', islandId: 180007, distance: '2 km', travelTime: '10 minutes', transportMethod: 'speedboat' },
];

async function fixAttractionLinks() {
  try {
    const conn = await mysql.createConnection({
      uri: DATABASE_URL,
      ssl: false,
    });

    console.log('Fixing attraction-island links...\n');

    for (const correction of corrections) {
      try {
        // Get attraction ID
        const [attractions] = await conn.execute(
          'SELECT id FROM attraction_guides WHERE slug = ?',
          [correction.attractionSlug]
        );

        if (attractions.length === 0) {
          console.log(`⚠️  Skipped: ${correction.attractionSlug} (not found)`);
          continue;
        }

        const attractionId = attractions[0].id;

        // Delete old links
        await conn.execute(
          'DELETE FROM attraction_island_links WHERE attractionGuideId = ?',
          [attractionId]
        );

        // Add new link
        await conn.execute(
          `INSERT INTO attraction_island_links (
            attractionGuideId, islandGuideId, distance, travelTime, transportMethod
          ) VALUES (?, ?, ?, ?, ?)`,
          [
            attractionId,
            correction.islandId,
            correction.distance,
            correction.travelTime,
            correction.transportMethod,
          ]
        );

        console.log(`✅ Fixed: ${correction.attractionSlug}`);
      } catch (err) {
        console.error(`❌ Error fixing ${correction.attractionSlug}:`, err.message);
      }
    }

    await conn.end();
    console.log('\n✅ Attraction links fixed successfully!');
  } catch (error) {
    console.error('Connection error:', error);
    process.exit(1);
  }
}

fixAttractionLinks();
