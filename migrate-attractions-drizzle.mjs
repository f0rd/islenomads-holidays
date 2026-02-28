#!/usr/bin/env node

/**
 * Migration Script: Extract Attractions from Island Guides (using Drizzle ORM)
 * 
 * Run with: node migrate-attractions-drizzle.mjs
 */

import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './drizzle/schema.ts';
import { eq } from 'drizzle-orm';
import dotenv from 'dotenv';

dotenv.config();

const connection = await mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'islenomads',
});

const db = drizzle(connection, { schema });

async function migrateAttractions() {
  try {
    console.log('🚀 Starting attraction migration...\n');

    // Step 1: Fetch all published island guides
    const islandGuides = await db.select().from(schema.islandGuides).where(eq(schema.islandGuides.published, 1));

    console.log(`📍 Found ${islandGuides.length} published island guides\n`);

    const attractionsMap = new Map();
    const linksToCreate = [];

    // Step 2: Extract attractions from each island guide
    for (const island of islandGuides) {
      console.log(`Processing: ${island.name}`);

      // Parse dive sites
      if (island.nearbyDiveSites) {
        try {
          const diveSites = JSON.parse(island.nearbyDiveSites);
          for (const site of diveSites) {
            const key = `dive_site_${site.name.toLowerCase().replace(/\s+/g, '_')}`;
            if (!attractionsMap.has(key)) {
              attractionsMap.set(key, {
                name: site.name,
                slug: site.name.toLowerCase().replace(/\s+/g, '-'),
                attractionType: 'dive_site',
                overview: `A popular dive site near ${island.name}. Difficulty: ${site.difficulty || 'Intermediate'}`,
                difficulty: site.difficulty || 'intermediate',
                nearestIsland: island.name,
                distanceFromIsland: site.distance || 'Nearby',
              });
            }
            linksToCreate.push({
              attractionName: site.name,
              islandId: island.id,
              distance: site.distance || 'Nearby',
              travelTime: '15-30 minutes',
              transportMethod: 'speedboat',
            });
          }
        } catch (e) {
          console.warn(`  ⚠️  Failed to parse dive sites for ${island.name}`);
        }
      }

      // Parse surf spots
      if (island.nearbySurfSpots) {
        try {
          const surfSpots = JSON.parse(island.nearbySurfSpots);
          for (const spot of surfSpots) {
            const key = `surf_spot_${spot.name.toLowerCase().replace(/\s+/g, '_')}`;
            if (!attractionsMap.has(key)) {
              attractionsMap.set(key, {
                name: spot.name,
                slug: spot.name.toLowerCase().replace(/\s+/g, '-'),
                attractionType: 'surf_spot',
                overview: `A renowned surf spot near ${island.name}. Difficulty: ${spot.difficulty || 'Intermediate'}`,
                difficulty: spot.difficulty || 'intermediate',
                nearestIsland: island.name,
                distanceFromIsland: spot.distance || 'Nearby',
              });
            }
            linksToCreate.push({
              attractionName: spot.name,
              islandId: island.id,
              distance: spot.distance || 'Nearby',
              travelTime: '20-40 minutes',
              transportMethod: 'speedboat',
            });
          }
        } catch (e) {
          console.warn(`  ⚠️  Failed to parse surf spots for ${island.name}`);
        }
      }
    }

    console.log(`\n✅ Extracted ${attractionsMap.size} unique attractions\n`);

    // Step 3: Insert attractions into attraction_guides table
    const attractionIds = new Map();
    for (const [key, attraction] of attractionsMap) {
      const result = await db.insert(schema.attractionGuides).values({
        name: attraction.name,
        slug: attraction.slug,
        attractionType: attraction.attractionType,
        overview: attraction.overview,
        difficulty: attraction.difficulty,
        nearestIsland: attraction.nearestIsland,
        distanceFromIsland: attraction.distanceFromIsland,
        published: 1,
        featured: 0,
      });
      
      const insertedId = result[0].insertId;
      attractionIds.set(attraction.name, insertedId);
      console.log(`  ✓ Created attraction: ${attraction.name} (ID: ${insertedId})`);
    }

    console.log(`\n📊 Creating ${linksToCreate.length} attraction-island links...\n`);

    // Step 4: Create links between attractions and islands
    for (const link of linksToCreate) {
      const attractionId = attractionIds.get(link.attractionName);
      if (attractionId) {
        await db.insert(schema.attractionIslandLinks).values({
          attractionGuideId: attractionId,
          islandGuideId: link.islandId,
          distance: link.distance,
          travelTime: link.travelTime,
          transportMethod: link.transportMethod,
        });
        console.log(`  ✓ Linked ${link.attractionName} to island ID ${link.islandId}`);
      }
    }

    console.log(`\n✨ Migration completed successfully!\n`);
    console.log(`📈 Summary:`);
    console.log(`   - Attractions created: ${attractionIds.size}`);
    console.log(`   - Links created: ${linksToCreate.length}`);
    console.log(`   - Islands processed: ${islandGuides.length}\n`);

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

migrateAttractions();
