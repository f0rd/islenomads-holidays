import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function fixIslandSlugs() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'islenomads',
    port: process.env.DB_PORT || 3306,
  });

  try {
    // Get all island guides with -island suffix
    const [rows] = await connection.execute(
      "SELECT id, name, slug FROM island_guides WHERE slug LIKE '%-island' ORDER BY name"
    );

    console.log(`Found ${rows.length} islands with -island suffix:`);
    rows.forEach(row => {
      console.log(`  - ${row.name}: ${row.slug}`);
    });

    // Update each one to remove the -island suffix
    for (const row of rows) {
      const newSlug = row.slug.replace(/-island$/, '');
      console.log(`\nUpdating ${row.name}: ${row.slug} → ${newSlug}`);
      
      await connection.execute(
        'UPDATE island_guides SET slug = ? WHERE id = ?',
        [newSlug, row.id]
      );
    }

    console.log(`\n✓ Successfully fixed ${rows.length} island slugs!`);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

fixIslandSlugs();
