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

async function fixIslandAtolls() {
  let connection;
  try {
    connection = await mysql.createConnection(config);
    console.log('Connected to database');

    // Read the islands content
    const islandsPath = path.join(__dirname, 'all-islands-content.json');
    const islandsData = JSON.parse(fs.readFileSync(islandsPath, 'utf-8'));

    console.log(`Found ${islandsData.islands.length} islands in JSON file`);

    let updatedCount = 0;
    let errorCount = 0;

    for (const island of islandsData.islands) {
      if (!island.atoll) continue;

      try {
        // Update island atoll
        const query = 'UPDATE island_guides SET atoll = ? WHERE name = ?';
        const [result] = await connection.execute(query, [island.atoll, island.name]);
        
        if (result.affectedRows > 0) {
          console.log(`✅ Updated: ${island.name} -> ${island.atoll}`);
          updatedCount++;
        } else {
          console.log(`ℹ️  Not found: ${island.name}`);
        }
      } catch (error) {
        console.error(`❌ Error updating island ${island.name}:`, error.message);
        errorCount++;
      }
    }

    console.log(`\n=== Summary ===`);
    console.log(`Updated: ${updatedCount}`);
    console.log(`Errors: ${errorCount}`);

    await connection.end();
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

fixIslandAtolls();
