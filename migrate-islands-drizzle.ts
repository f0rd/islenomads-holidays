import { drizzle } from "drizzle-orm/mysql2/driver";
import mysql from "mysql2/promise";
import { islands, islandGuides, atolls } from "./drizzle/schema";
import { eq, and } from "drizzle-orm";

async function migrateIslands() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "test",
    ssl: process.env.DB_SSL === "true" ? "Amazon RDS" : undefined,
  });

  const db = drizzle(connection);

  try {
    console.log("Starting island migration using Drizzle ORM...");

    // Get all unique islands from island_guides (contentType = 'island')
    // Group by name and atoll to handle duplicates
    const uniqueIslands = await db
      .selectDistinct({
        name: islandGuides.name,
        slug: islandGuides.slug,
        atoll: islandGuides.atoll,
      })
      .from(islandGuides)
      .where(eq(islandGuides.contentType, "island"));

    console.log(`Found ${uniqueIslands.length} unique islands to migrate`);

    let insertedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    for (const island of uniqueIslands) {
      try {
        // Generate unique code from slug
        const code = island.slug.toLowerCase().replace(/[^a-z0-9-]/g, "");

        // Get atoll ID
        let atollId = null;
        if (island.atoll) {
          const atollRecord = await db
            .select({ id: atolls.id })
            .from(atolls)
            .where(eq(atolls.name, island.atoll))
            .limit(1);

          if (atollRecord.length > 0) {
            atollId = atollRecord[0].id;
          }
        }

        // Check if island already exists
        const existing = await db
          .select({ id: islands.id })
          .from(islands)
          .where(eq(islands.code, code))
          .limit(1);

        if (existing.length > 0) {
          console.log(`⊘ Skipped: ${island.name} (already exists)`);
          skippedCount++;
          continue;
        }

        // Insert into islands table
        await db.insert(islands).values({
          atollId: atollId || 0, // Default to 0 if atoll not found
          name: island.name,
          code: code,
        });

        console.log(`✓ Inserted: ${island.name} (code: ${code}, atoll: ${island.atoll || "N/A"})`);
        insertedCount++;
      } catch (error) {
        console.error(`✗ Error inserting ${island.name}:`, error.message);
        errorCount++;
      }
    }

    console.log(`\n✓ Migration complete!`);
    console.log(`  - Inserted: ${insertedCount}`);
    console.log(`  - Skipped: ${skippedCount}`);
    console.log(`  - Errors: ${errorCount}`);
    console.log(`  - Total processed: ${insertedCount + skippedCount + errorCount}`);

    await connection.end();
  } catch (error) {
    console.error("Migration failed:", error);
    await connection.end();
    process.exit(1);
  }
}

migrateIslands();
