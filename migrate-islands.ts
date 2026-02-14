import { createConnection } from "mysql2/promise";
import * as dotenv from "dotenv";

dotenv.config();

async function migrateIslands() {
  const connection = await createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: "Amazon RDS",
  });

  try {
    console.log("Starting island migration...");

    // Get all unique islands from island_guides (contentType = 'island')
    const [islands] = await connection.query(`
      SELECT DISTINCT 
        ig.name,
        ig.slug,
        ig.atoll,
        a.id as atollId
      FROM island_guides ig
      LEFT JOIN atolls a ON ig.atoll = a.name
      WHERE ig.contentType = 'island'
      ORDER BY ig.atoll, ig.name
    `);

    console.log(`Found ${islands.length} unique islands to migrate`);

    let insertedCount = 0;
    let skippedCount = 0;

    for (const island of islands) {
      try {
        // Generate unique code from slug
        const code = island.slug.toLowerCase().replace(/[^a-z0-9-]/g, "");

        // Check if island already exists
        const [existing] = await connection.query(
          "SELECT id FROM islands WHERE code = ?",
          [code]
        );

        if (existing.length > 0) {
          console.log(`⊘ Skipped: ${island.name} (already exists)`);
          skippedCount++;
          continue;
        }

        // Insert into islands table
        await connection.query(
          "INSERT INTO islands (atollId, name, code) VALUES (?, ?, ?)",
          [island.atollId || null, island.name, code]
        );

        console.log(`✓ Inserted: ${island.name} (code: ${code})`);
        insertedCount++;
      } catch (error) {
        console.error(`✗ Error inserting ${island.name}:`, error.message);
      }
    }

    console.log(`\n✓ Migration complete!`);
    console.log(`  - Inserted: ${insertedCount}`);
    console.log(`  - Skipped: ${skippedCount}`);
    console.log(`  - Total: ${insertedCount + skippedCount}`);

    await connection.end();
  } catch (error) {
    console.error("Migration failed:", error);
    await connection.end();
    process.exit(1);
  }
}

migrateIslands();
