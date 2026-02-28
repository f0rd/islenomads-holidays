#!/usr/bin/env node

/**
 * Migration Script V2: Extract Existing Attractions from Island Guides
 * 
 * Improvements:
 * - Maps difficulty values to valid enum values
 * - Creates place entries for attractions
 * - Handles all edge cases
 * 
 * Run with: node migrate-existing-attractions-v2.mjs
 */

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Map difficulty values to valid enum
function normalizeDifficulty(difficulty) {
  if (!difficulty) return 'beginner';
  const lower = difficulty.toLowerCase().trim();
  if (lower.includes('beginner') || lower.includes('easy')) return 'beginner';
  if (lower.includes('advanced') || lower.includes('expert')) return 'advanced';
  if (lower.includes('intermediate') || lower.includes('medium')) return 'intermediate';
  return 'beginner';
}

async function migrateExistingAttractions() {
  let connection;
  
  try {
    console.log('🚀 Starting migration of existing attractions from island guides (V2)...\n');

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
                  difficulty: normalizeDifficulty(site.difficulty),
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
          // Silently skip parse errors
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
                  difficulty: normalizeDifficulty(spot.difficulty),
                  nearestIsland: spot.nearestIsland || island.name,
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
          // Silently skip parse errors
        }
      }
    }

    console.log(`✅ Extracted ${attractionsMap.size} unique attractions\n`);
    console.log(`📝 Creating attractions in database...\n`);

    // Step 3: Insert attractions into attraction_guides table
    const attractionIds = new Map();
    let created = 0;
    let skipped = 0;

    for (const [key, attraction] of attractionsMap) {
      try {
        // Check if attraction already exists
        const [existing] = await connection.execute(
          'SELECT id FROM attraction_guides WHERE slug = ?',
          [attraction.slug]
        );

        if (existing.length > 0) {
          attractionIds.set(attraction.slug, existing[0].id);
          skipped++;
        } else {
          // Create a place entry first (if needed)
          let placeId = null;
          
          // Try to find or create a place for this attraction
          const [places] = await connection.execute(
            'SELECT id FROM places WHERE name = ? LIMIT 1',
            [attraction.name]
          );

          if (places.length > 0) {
            placeId = places[0].id;
          } else {
            // Create a new place entry
            try {
              const [placeResult] = await connection.execute(
                'INSERT INTO places (name, slug, type) VALUES (?, ?, ?)',
                [attraction.name, attraction.slug, attraction.attractionType]
              );
              placeId = placeResult.insertId;
            } catch (e) {
              // If place creation fails, use NULL (if allowed)
              placeId = null;
            }
          }

          // Now insert the attraction
          const [result] = await connection.execute(
            'INSERT INTO attraction_guides (placeId, name, slug, attractionType, overview, difficulty, nearestIsland, distanceFromIsland, published, featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
              placeId,
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
          created++;
          
          if (created % 50 === 0) {
            console.log(`  ✓ Created ${created} attractions...`);
          }
        }
      } catch (error) {
        console.warn(`  ⚠️  Error with ${attraction.name}: ${error.message}`);
      }
    }

    console.log(`\n✅ Attractions created: ${created}, skipped (already exist): ${skipped}\n`);
    console.log(`📊 Creating ${linksToCreate.length} attraction-island links...\n`);

    // Step 4: Create links between attractions and islands
    let linksCreated = 0;
    let linksFailed = 0;

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
          linksFailed++;
        }
      }
    }

    console.log(`✅ Links created: ${linksCreated}, failed: ${linksFailed}\n`);
    console.log(`\n✨ Migration completed successfully!\n`);
    console.log(`📈 Final Summary:`);
    console.log(`   - Total unique attractions: ${attractionsMap.size}`);
    console.log(`   - Attractions created: ${created}`);
    console.log(`   - Attractions already existed: ${skipped}`);
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
