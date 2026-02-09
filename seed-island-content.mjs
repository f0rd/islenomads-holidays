#!/usr/bin/env node

/**
 * Seed script to populate island guides and atolls with comprehensive content
 * Run with: node seed-island-content.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('ERROR: DATABASE_URL environment variable not set');
  process.exit(1);
}

// Parse DATABASE_URL
function parseDatabaseUrl(url) {
  const match = url.match(/mysql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/([^?]+)/);
  if (!match) {
    throw new Error('Invalid DATABASE_URL format');
  }
  return {
    user: match[1],
    password: match[2],
    host: match[3],
    port: parseInt(match[4]),
    database: match[5],
  };
}

const dbConfig = parseDatabaseUrl(DATABASE_URL);

async function seedDatabase() {
  let connection;
  try {
    // Load content from JSON file
    const contentPath = path.join(__dirname, 'island-content.json');
    const content = JSON.parse(fs.readFileSync(contentPath, 'utf-8'));

    // Create database connection with SSL
    connection = await mysql.createConnection({
      ...dbConfig,
      ssl: {},
      waitForConnections: true,
      connectionLimit: 1,
      queueLimit: 0,
    });
    console.log('✓ Connected to database');

    // Seed atolls first
    console.log('\n📍 Seeding atolls...');
    for (const atoll of content.atolls) {
      const query = `
        INSERT INTO atolls (name, slug, region, description, overview, bestFor, highlights, activities, accommodation, transportation, bestSeason, published)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
        description = VALUES(description),
        overview = VALUES(overview),
        bestFor = VALUES(bestFor),
        highlights = VALUES(highlights),
        activities = VALUES(activities),
        accommodation = VALUES(accommodation),
        transportation = VALUES(transportation),
        bestSeason = VALUES(bestSeason),
        published = VALUES(published)
      `;

      const values = [
        atoll.name,
        atoll.slug,
        atoll.region,
        atoll.description,
        atoll.overview,
        atoll.bestFor,
        JSON.stringify(atoll.highlights),
        JSON.stringify(atoll.activities),
        JSON.stringify(atoll.accommodation),
        atoll.transportation,
        atoll.bestSeason,
        atoll.published,
      ];

      await connection.execute(query, values);
      console.log(`  ✓ Seeded atoll: ${atoll.name}`);
    }

    // Seed islands
    console.log('\n🏝️  Seeding islands...');
    for (const island of content.islands) {
      const query = `
        INSERT INTO island_guides (
          name, slug, atoll, overview, quickFacts, flightInfo, speedboatInfo, ferryInfo,
          topThingsToDo, snorkelingGuide, divingGuide, surfWatersports, beachesLocalRules,
          foodCafes, currency, language, bestTimeToVisit, whatToPack, healthTips,
          emergencyContacts, threeDayItinerary, fiveDayItinerary, faq,
          latitude, longitude, metaTitle, metaDescription, metaKeywords,
          published, featured, displayOrder
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
        overview = VALUES(overview),
        quickFacts = VALUES(quickFacts),
        flightInfo = VALUES(flightInfo),
        speedboatInfo = VALUES(speedboatInfo),
        ferryInfo = VALUES(ferryInfo),
        topThingsToDo = VALUES(topThingsToDo),
        snorkelingGuide = VALUES(snorkelingGuide),
        divingGuide = VALUES(divingGuide),
        surfWatersports = VALUES(surfWatersports),
        beachesLocalRules = VALUES(beachesLocalRules),
        foodCafes = VALUES(foodCafes),
        currency = VALUES(currency),
        language = VALUES(language),
        bestTimeToVisit = VALUES(bestTimeToVisit),
        whatToPack = VALUES(whatToPack),
        healthTips = VALUES(healthTips),
        emergencyContacts = VALUES(emergencyContacts),
        threeDayItinerary = VALUES(threeDayItinerary),
        fiveDayItinerary = VALUES(fiveDayItinerary),
        faq = VALUES(faq),
        latitude = VALUES(latitude),
        longitude = VALUES(longitude),
        metaTitle = VALUES(metaTitle),
        metaDescription = VALUES(metaDescription),
        metaKeywords = VALUES(metaKeywords),
        published = VALUES(published),
        featured = VALUES(featured),
        displayOrder = VALUES(displayOrder)
      `;

      const values = [
        island.name || null,
        island.slug || null,
        island.atoll || null,
        island.overview || null,
        JSON.stringify(island.quickFacts || []),
        island.flightInfo || null,
        island.speedboatInfo || null,
        island.ferryInfo || null,
        JSON.stringify(island.topThingsToDo || []),
        JSON.stringify(island.snorkelingGuide || {}),
        JSON.stringify(island.divingGuide || {}),
        JSON.stringify(island.surfWatersports || {}),
        JSON.stringify(island.beachesLocalRules || {}),
        JSON.stringify(island.foodCafes || []),
        island.currency || null,
        island.language || null,
        island.bestTimeToVisit || null,
        JSON.stringify(island.whatToPack || []),
        JSON.stringify(island.healthTips || []),
        JSON.stringify(island.emergencyContacts || []),
        JSON.stringify(island.threeDayItinerary || []),
        JSON.stringify(island.fiveDayItinerary || []),
        JSON.stringify(island.faq || []),
        island.latitude || null,
        island.longitude || null,
        island.metaTitle || null,
        island.metaDescription || null,
        island.metaKeywords || null,
        island.published || 0,
        island.featured || 0,
        island.displayOrder || 0,
      ];

      await connection.execute(query, values);
      console.log(`  ✓ Seeded island: ${island.name}`);
    }

    console.log('\n✅ Database seeding completed successfully!');
    console.log(`   - ${content.atolls.length} atolls seeded`);
    console.log(`   - ${content.islands.length} islands seeded`);

  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run the seed function
seedDatabase();
