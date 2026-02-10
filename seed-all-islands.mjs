import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Parse DATABASE_URL
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error('DATABASE_URL environment variable is not set');
  process.exit(1);
}

const url = new URL(databaseUrl);
const config = {
  host: url.hostname,
  port: url.port || 3306,
  user: url.username,
  password: url.password,
  database: url.pathname.slice(1),
  ssl: url.hostname.includes('tidbcloud') || url.hostname.includes('rds') ? { rejectUnauthorized: false } : undefined,
};

async function seedIslands() {
  let connection;
  try {
    connection = await mysql.createConnection(config);
    console.log('Connected to database');

    // Read the islands content
    const islandsPath = path.join(__dirname, 'all-islands-content.json');
    const islandsData = JSON.parse(fs.readFileSync(islandsPath, 'utf-8'));

    // Get all atolls first to map atoll names to IDs
    const [atolls] = await connection.query('SELECT id, name, slug FROM atolls');
    const atollMap = {};
    atolls.forEach(atoll => {
      atollMap[atoll.name] = atoll.id;
      // Also map by slug for better matching
      const slugName = atoll.name.toLowerCase().replace(/\s+/g, '-');
      atollMap[slugName] = atoll.id;
    });
    
    console.log('Atoll mapping:', atollMap);

    console.log(`Found ${atolls.length} atolls in database`);

    let insertedCount = 0;
    let skippedCount = 0;

    for (const island of islandsData.islands) {
      try {
        // Get atoll ID
        const atollId = atollMap[island.atoll];
        if (!atollId) {
          console.warn(`⚠️  Atoll not found for island: ${island.name} (${island.atoll})`);
          skippedCount++;
          continue;
        }

        // Check if island already exists
        const [existing] = await connection.query(
          'SELECT id FROM island_guides WHERE slug = ?',
          [island.slug]
        );

        if (existing.length > 0) {
          console.log(`ℹ️  Island already exists: ${island.name}`);
          skippedCount++;
          continue;
        }

        // Insert island guide
        const query = `
          INSERT INTO island_guides (
            name, slug, atoll, contentType, overview, topThingsToDo, bestTimeToVisit,
            featured, published, createdAt, updatedAt
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
        `;

        const values = [
          island.name,
          island.slug,
          island.atoll,
          island.contentType || 'island',
          island.overview || '',
          JSON.stringify(island.activities ? island.activities.split(', ') : []),
          island.bestSeason || '',
          island.featured || 0,
          island.published || 1,
        ];

        await connection.query(query, values);
        console.log(`✅ Inserted: ${island.name}`);
        insertedCount++;
      } catch (error) {
        console.error(`❌ Error inserting island ${island.name}:`, error.message);
      }
    }

    console.log(`\n📊 Seeding Summary:`);
    console.log(`✅ Inserted: ${insertedCount} islands`);
    console.log(`⏭️  Skipped: ${skippedCount} islands`);
    console.log(`📈 Total: ${insertedCount + skippedCount} islands processed`);

  } catch (error) {
    console.error('Database error:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

seedIslands();
