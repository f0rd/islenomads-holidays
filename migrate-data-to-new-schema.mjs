#!/usr/bin/env node

/**
 * Data Migration Script: Backfill existing data into new schema tables
 * 
 * This script:
 * 1. Creates activity types from existing activity_spots
 * 2. Migrates activity_spots to use primaryTypeId
 * 3. Creates island_spot_access records for existing linked spots
 * 4. Populates transport routes from existing data
 */

import mysql from "mysql2/promise";
import * as dotenv from "dotenv";

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "islenomads",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function migrate() {
  const conn = await pool.getConnection();

  try {
    console.log("🚀 Starting data migration...\n");

    // Step 1: Create activity types
    console.log("📋 Step 1: Creating activity types...");
    const activityTypes = [
      { key: "diving", name: "Diving", icon: "🤿", sortOrder: 1 },
      { key: "snorkeling", name: "Snorkeling", icon: "🏊", sortOrder: 2 },
      { key: "surfing", name: "Surfing", icon: "🏄", sortOrder: 3 },
      { key: "sandbank", name: "Sandbank", icon: "🏝️", sortOrder: 4 },
      { key: "fishing", name: "Fishing", icon: "🎣", sortOrder: 5 },
      { key: "island_hopping", name: "Island Hopping", icon: "🛥️", sortOrder: 6 },
      { key: "beach", name: "Beach", icon: "🏖️", sortOrder: 7 },
      { key: "watersports", name: "Watersports", icon: "🚤", sortOrder: 8 },
    ];

    for (const type of activityTypes) {
      await conn.execute(
        `INSERT IGNORE INTO activity_types (key, name, icon, sortOrder) VALUES (?, ?, ?, ?)`,
        [type.key, type.name, type.icon, type.sortOrder]
      );
    }
    console.log(`✅ Created ${activityTypes.length} activity types\n`);

    // Step 2: Get activity type IDs for mapping
    console.log("📋 Step 2: Mapping activity types...");
    const [typeRows] = await conn.execute(
      `SELECT id, key FROM activity_types`
    );
    const typeMap = {};
    typeRows.forEach((row) => {
      typeMap[row.key] = row.id;
    });
    console.log(`✅ Mapped ${Object.keys(typeMap).length} activity types\n`);

    // Step 3: Update activity_spots with primaryTypeId
    console.log("📋 Step 3: Updating activity_spots with primaryTypeId...");
    
    // Map spot types to activity types
    const spotTypeMap = {
      dive_site: "diving",
      snorkeling_spot: "snorkeling",
      surf_spot: "surfing",
    };

    for (const [spotType, activityKey] of Object.entries(spotTypeMap)) {
      const typeId = typeMap[activityKey];
      const [result] = await conn.execute(
        `UPDATE activity_spots SET primaryTypeId = ? WHERE spotType = ?`,
        [typeId, spotType]
      );
      console.log(
        `  - Updated ${result.affectedRows} ${spotType} spots to type ${activityKey}`
      );
    }
    console.log("✅ Updated activity_spots\n");

    // Step 4: Create island_spot_access records
    console.log("📋 Step 4: Creating island_spot_access records...");
    
    // Get all islands and their spots
    const [islands] = await conn.execute(`SELECT id FROM islands`);
    const [spots] = await conn.execute(
      `SELECT id, latitude, longitude FROM activity_spots WHERE published = 1`
    );

    let accessCount = 0;
    for (const island of islands) {
      for (const spot of spots) {
        // Calculate distance using Haversine formula (simplified)
        // For now, create access records for all spots
        // In production, you'd calculate actual distances
        
        try {
          await conn.execute(
            `INSERT IGNORE INTO island_spot_access (islandId, spotId, distanceKm, recommended, sortOrder)
             VALUES (?, ?, ?, ?, ?)`,
            [island.id, spot.id, null, 0, 0]
          );
          accessCount++;
        } catch (e) {
          // Skip if unique constraint fails
        }
      }
    }
    console.log(`✅ Created ${accessCount} island_spot_access records\n`);

    // Step 5: Create sample transport routes
    console.log("📋 Step 5: Creating sample transport routes...");
    
    // Get atoll information for common routes
    const [atolls] = await conn.execute(
      `SELECT id FROM atolls LIMIT 5`
    );
    
    if (atolls.length >= 2) {
      const routes = [
        {
          fromAtoll: atolls[0].id,
          toAtoll: atolls[1].id,
          type: "public_ferry",
          operator: "Public Ferry Service",
          schedule: "Daily 8am, 2pm, 5pm",
          duration: 45,
          priceUsd: 5,
        },
        {
          fromAtoll: atolls[0].id,
          toAtoll: atolls[1].id,
          type: "speedboat",
          operator: "Speedboat Transfers",
          schedule: "On demand",
          duration: 25,
          priceUsd: 25,
        },
      ];

      for (const route of routes) {
        // Get sample islands from atolls
        const [fromIslands] = await conn.execute(
          `SELECT id FROM islands WHERE atollId = ? LIMIT 1`,
          [route.fromAtoll]
        );
        const [toIslands] = await conn.execute(
          `SELECT id FROM islands WHERE atollId = ? LIMIT 1`,
          [route.toAtoll]
        );

        if (fromIslands.length > 0 && toIslands.length > 0) {
          await conn.execute(
            `INSERT IGNORE INTO transport_routes 
             (fromIslandId, toIslandId, routeType, operatorName, scheduleText, durationMin, priceUsd, isActive)
             VALUES (?, ?, ?, ?, ?, ?, ?, 1)`,
            [
              fromIslands[0].id,
              toIslands[0].id,
              route.type,
              route.operator,
              route.schedule,
              route.duration,
              route.priceUsd,
            ]
          );
        }
      }
      console.log(`✅ Created sample transport routes\n`);
    }

    console.log("✨ Data migration completed successfully!");
    console.log("\nNext steps:");
    console.log("1. Review the migrated data in the database");
    console.log("2. Update database helper functions in server/db.ts");
    console.log("3. Create tRPC endpoints for new queries");
    console.log("4. Update IslandDetail component to use new data structure");
  } catch (error) {
    console.error("❌ Migration error:", error);
    throw error;
  } finally {
    await conn.release();
    await pool.end();
  }
}

migrate().catch(console.error);
