#!/usr/bin/env node

/**
 * Migration Script: Extract Existing Attractions from Island Guides
 * 
 * This script:
 * 1. Reads all island guides from the database
 * 2. Extracts dive sites and surf spots from JSON fields
 * 3. Creates attraction guide entries for each unique attraction
 * 4. Links attractions to their respective islands
 * 
 * Run with: node migrate-existing-attractions.mjs
 */

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function migrateExistingAttractions() {
  let connection;
  
  try {
    console.log('🚀 Starting migration of existing attractions from island guides...\n');

    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error('DATABASE_URL environment variable is not set');
    }

    // Parse the DATABASE_URL
    const url = new URL(databaseUrl);
    const config = {
      host: url.hostname,
      user: url.username,
      password: url.password,
      database: url.pathname.slice(1),
      ssl: { rejectUnauthorized: false },
    };

    console.log(`Connecting to database at ${config.host}...\n`);
    connection = await mysql.createConnection(config);
    console.log('✓ Connected to database\n');

    // Step 1: Fetch all published island guides
    const [islandGuides] = await connection.execute(
      'SELECT id, name, slug, nearbyDiveSites, nearbySurfSpots FROM island_guides WHERE published = 1'
    );

    console.log(`📍 Found ${islandGuides.length} published island guides\n`);

    const attractionsMap = new Map(); // To track unique attractions by slug
    const linksToCreate = [];

    // Step 2: Extract attractions from each island guide
    for (const island of islandGuides) {
      console.log(`Processing: ${island.name}`);

      // Parse dive sites
      if (island.nearbyDiveSites) {
        try {
          const diveSites = JSON.parse(island.nearbyDiveSites);
          if (Array.isArray(diveSites)) {
            for (const site of diveSites) {
              const slug = site.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
              const key = `dive_site_${slug}`;
              
              if (!attractionsMap.has(key)) {
                attractionsMap.set(key, {
                  name: site.name,
                  slug: slug,
                  attractionType: 'dive_site',
                  overview: site.description || `A popular dive site near ${island.name}. Difficulty: ${site.difficulty || 'Intermediate'}`,
                  difficulty: (site.difficulty || 'intermediate').toLowerCase(),
                  nearestIsland: island.name,
                  distanceFromIsland: site.distance || 'Nearby',
                  published: 1,
                  featured: 0,
                });
              }
              
              linksToCreate.push({
                attractionName: site.name,
                attractionSlug: slug,
                islandId: island.id,
                distance: site.distance || 'Nearby',
                travelTime: '15-30 minutes',
                transportMethod: 'speedboat',
              });
            }
          }
        } catch (e) {
          console.warn(`  ⚠️  Failed to parse dive sites for ${island.name}`);
        }
      }

      // Parse surf spots
      if (island.nearbySurfSpots) {
        try {
          const surfSpots = JSON.parse(island.nearbySurfSpots);
          if (Array.isArray(surfSpots)) {
            for (const spot of surfSpots) {
              const slug = spot.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
              const key = `surf_spot_${slug}`;
              
              if (!attractionsMap.has(key)) {
                attractionsMap.set(key, {
                  name: spot.name,
                  slug: slug,
                  attractionType: 'surf_spot',
                  overview: spot.description || `A renowned surf spot near ${island.name}. Difficulty: ${spot.difficulty || 'Intermediate'}`,
                  difficulty: (spot.difficulty || 'intermediate').toLowerCase(),
                  nearestIsland: island.name,
                  distanceFromIsland: spot.distance || 'Nearby',
                  published: 1,
                  featured: 0,
                });
              }
              
              linksToCreate.push({
                attractionName: spot.name,
                attractionSlug: slug,
                islandId: island.id,
                distance: spot.distance || 'Nearby',
                travelTime: '20-40 minutes',
                transportMethod: 'speedboat',
              });
            }
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
      try {
        // Check if attraction already exists
        const [existing] = await connection.execute(
          'SELECT id FROM attraction_guides WHERE slug = ?',
          [attraction.slug]
        );

        if (existing.length > 0) {
          attractionIds.set(attraction.slug, existing[0].id);
          console.log(`  ⊘ Already exists: ${attraction.name} (ID: ${existing[0].id})`);
        } else {
          const [result] = await connection.execute(
            'INSERT INTO attraction_guides (name, slug, attractionType, overview, difficulty, nearestIsland, distanceFromIsland, published, featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
              attraction.name,
              attraction.slug,
              attraction.attractionType,
              attraction.overview,
              attraction.difficulty,
              attraction.nearestIsland,
              attraction.distanceFromIsland,
              attraction.published,
              attraction.featured,
            ]
          );
          attractionIds.set(attraction.slug, result.insertId);
          console.log(`  ✓ Created: ${attraction.name} (${attraction.attractionType}) - ID: ${result.insertId}`);
        }
      } catch (error) {
        console.error(`  ✗ Error creating ${attraction.name}:`, error.message);
      }
    }

    console.log(`\n📊 Creating ${linksToCreate.length} attraction-island links...\n`);

    // Step 4: Create links between attractions and islands
    let linksCreated = 0;
    for (const link of linksToCreate) {
      const attractionId = attractionIds.get(link.attractionSlug);
      if (attractionId) {
        try {
          // Check if link already exists
          const [existing] = await connection.execute(
            'SELECT id FROM attraction_island_links WHERE attractionGuideId = ? AND islandGuideId = ?',
            [attractionId, link.islandId]
          );

          if (existing.length === 0) {
            await connection.execute(
              'INSERT INTO attraction_island_links (attractionGuideId, islandGuideId, distance, travelTime, transportMethod) VALUES (?, ?, ?, ?, ?)',
              [
                attractionId,
                link.islandId,
                link.distance,
                link.travelTime,
                link.transportMethod,
              ]
            );
            linksCreated++;
          }
        } catch (error) {
          console.warn(`  ⚠️  Error linking ${link.attractionName}:`, error.message);
        }
      }
    }

    console.log(`\n✨ Migration completed successfully!\n`);
    console.log(`📈 Summary:`);
    console.log(`   - Attractions created/found: ${attractionIds.size}`);
    console.log(`   - Links created: ${linksCreated}`);
    console.log(`   - Islands processed: ${islandGuides.length}\n`);

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

migrateExistingAttractions();
