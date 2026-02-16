import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;

async function addActivitySpotsToPlaces() {
  try {
    const conn = await mysql.createConnection({
      uri: DATABASE_URL,
      ssl: false,
    });

    console.log('Adding activity spots to places table...\n');

    // Get all activity spots
    const [activitySpots] = await conn.execute('SELECT id, name, slug, spotType FROM activity_spots');

    // Get existing codes to avoid duplicates
    const [existingCodes] = await conn.execute('SELECT code FROM places WHERE code IS NOT NULL');
    const usedCodes = new Set(existingCodes.map(r => r.code));

    let added = 0;
    let skipped = 0;

    for (const spot of activitySpots) {
      try {
        // Check if already exists in places
        const [existing] = await conn.execute('SELECT id FROM places WHERE slug = ?', [spot.slug]);
        
        if (existing.length > 0) {
          skipped++;
          continue;
        }

        // Generate a unique code from the slug
        let code = spot.slug.substring(0, 10).toUpperCase();
        let counter = 1;
        while (usedCodes.has(code)) {
          code = spot.slug.substring(0, 8).toUpperCase() + counter.toString().padStart(2, '0');
          counter++;
        }
        usedCodes.add(code);

        // Add to places table with all required columns
        await conn.execute(
          'INSERT INTO places (name, slug, type, code) VALUES (?, ?, ?, ?)',
          [spot.name, spot.slug, spot.spotType, code]
        );
        added++;

        if (added % 20 === 0) {
          console.log(`✅ Added ${added} activity spots...`);
        }
      } catch (err) {
        console.error(`❌ Error adding ${spot.slug}:`, err.message);
      }
    }

    await conn.end();
    console.log(`\n✅ Complete!`);
    console.log(`  Added: ${added}`);
    console.log(`  Skipped (already exist): ${skipped}`);
    console.log(`  Total processed: ${added + skipped}`);
  } catch (error) {
    console.error('Connection error:', error);
    process.exit(1);
  }
}

addActivitySpotsToPlaces();
