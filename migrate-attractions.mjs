#!/usr/bin/env node

/**
 * Migration Script: Extract Attractions from Island Guides
 * 
 * This script:
 * 1. Reads all island guides from the database
 * 2. Extracts dive sites, surf spots, and snorkeling spots from nearbyDiveSites, nearbySurfSpots, nearbySnorkelingSpots
 * 3. Creates attraction guide entries for each unique attraction
 * 4. Links attractions to their respective islands via attraction_island_links table
 */

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'islenomads',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function migrateAttractions() {
  const connection = await pool.getConnection();
  
  try {
    console.log('🚀 Starting attraction migration...\n');

    // Step 1: Fetch all island guides
    const [islandGuides] = await connection.query(
      'SELECT id, name, slug, nearbyDiveSites, nearbySurfSpots, nearbySnorkelingSpots FROM island_guides WHERE published = 1'
    );

    console.log(`📍 Found ${islandGuides.length} published island guides\n`);

    const attractionsMap = new Map(); // To track unique attractions
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

      // Parse snorkeling spots
      if (island.nearbySnorkelingSpots) {
        try {
          const snorkelingSpots = JSON.parse(island.nearbySnorkelingSpots);
          for (const spot of snorkelingSpots) {
            const key = `snorkeling_spot_${spot.name.toLowerCase().replace(/\s+/g, '_')}`;
            if (!attractionsMap.has(key)) {
              attractionsMap.set(key, {
                name: spot.name,
                slug: spot.name.toLowerCase().replace(/\s+/g, '-'),
                attractionType: 'snorkeling_spot',
                overview: `A beautiful snorkeling spot near ${island.name}. Perfect for ${spot.difficulty || 'all levels'}`,
                difficulty: spot.difficulty || 'beginner',
                nearestIsland: island.name,
                distanceFromIsland: spot.distance || 'Nearby',
              });
            }
            linksToCreate.push({
              attractionName: spot.name,
              islandId: island.id,
              distance: spot.distance || 'Nearby',
              travelTime: '10-20 minutes',
              transportMethod: 'dhoni',
            });
          }
        } catch (e) {
          console.warn(`  ⚠️  Failed to parse snorkeling spots for ${island.name}`);
        }
      }
    }

    console.log(`\n✅ Extracted ${attractionsMap.size} unique attractions\n`);

    // Step 3: Insert attractions into attraction_guides table
    const attractionIds = new Map();
    for (const [key, attraction] of attractionsMap) {
      const [result] = await connection.query(
        'INSERT INTO attraction_guides (name, slug, attractionType, overview, difficulty, nearestIsland, distanceFromIsland, published, featured) VALUES (?, ?, ?, ?, ?, ?, ?, 1, 0)',
        [
          attraction.name,
          attraction.slug,
          attraction.attractionType,
          attraction.overview,
          attraction.difficulty,
          attraction.nearestIsland,
          attraction.distanceFromIsland,
        ]
      );
      attractionIds.set(attraction.name, result.insertId);
      console.log(`  ✓ Created attraction: ${attraction.name} (ID: ${result.insertId})`);
    }

    console.log(`\n📊 Creating ${linksToCreate.length} attraction-island links...\n`);

    // Step 4: Create links between attractions and islands
    for (const link of linksToCreate) {
      const attractionId = attractionIds.get(link.attractionName);
      if (attractionId) {
        await connection.query(
          'INSERT INTO attraction_island_links (attractionGuideId, islandGuideId, distance, travelTime, transportMethod) VALUES (?, ?, ?, ?, ?)',
          [
            attractionId,
            link.islandId,
            link.distance,
            link.travelTime,
            link.transportMethod,
          ]
        );
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
    await connection.release();
    await pool.end();
  }
}

migrateAttractions();
