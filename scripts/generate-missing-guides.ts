#!/usr/bin/env node

/**
 * Script to generate comprehensive guides for all 86 missing islands
 * Uses Thoddoo as template and generates emoji-enhanced content
 */

import { drizzle } from 'drizzle-orm/mysql2';
import { eq, isNull } from 'drizzle-orm';
import * as schema from '../drizzle/schema';

if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL environment variable not set');
  process.exit(1);
}

const db = drizzle(process.env.DATABASE_URL);

// Activity templates for different island types
const activityTemplates = {
  resort: [
    { emoji: '🏖️', title: 'Pristine Beach Relaxation', description: 'Unwind on white sandy beaches with crystal-clear turquoise waters' },
    { emoji: '🤿', title: 'House Reef Snorkeling', description: 'Explore vibrant coral reefs directly from the island' },
    { emoji: '🏊', title: 'Water Sports Activities', description: 'Enjoy paddleboarding, kayaking, and windsurfing' },
    { emoji: '🧘', title: 'Spa and Wellness', description: 'Rejuvenate with world-class spa treatments' },
    { emoji: '🍽️', title: 'Gourmet Dining', description: 'Experience fine dining with ocean views' },
    { emoji: '🌅', title: 'Sunset Cruise', description: 'Romantic evening cruise with stunning views' },
    { emoji: '🐠', title: 'Marine Life Watching', description: 'Spot tropical fish and marine creatures' },
  ],
  local: [
    { emoji: '👥', title: 'Local Village Experience', description: 'Immerse yourself in authentic Maldivian culture' },
    { emoji: '🏪', title: 'Traditional Market Visit', description: 'Explore local markets with fresh produce and crafts' },
    { emoji: '🚴', title: 'Island Cycling Tour', description: 'Explore the island on bicycles through local villages' },
    { emoji: '🍜', title: 'Local Cuisine Tasting', description: 'Sample authentic Maldivian dishes and street food' },
    { emoji: '🏘️', title: 'Community Interaction', description: 'Meet locals and learn about island life' },
    { emoji: '🌴', title: 'Coconut Plantation Tour', description: 'Visit local coconut farms and learn about cultivation' },
  ],
  diving: [
    { emoji: '🏄', title: 'World-Class Diving', description: 'Explore spectacular dive sites with diverse marine life' },
    { emoji: '🪸', title: 'Coral Reef Exploration', description: 'Discover pristine coral gardens and reef ecosystems' },
    { emoji: '🐢', title: 'Sea Turtle Encounters', description: 'Swim alongside gentle sea turtles in their natural habitat' },
    { emoji: '🌊', title: 'Drift Diving', description: 'Experience thrilling drift diving along reef walls' },
    { emoji: '🐠', title: 'Fish Watching', description: 'Observe colorful tropical fish species' },
    { emoji: '📸', title: 'Underwater Photography', description: 'Capture stunning underwater moments' },
  ],
  fishing: [
    { emoji: '🎣', title: 'Traditional Fishing', description: 'Learn traditional Maldivian fishing techniques' },
    { emoji: '⛵', title: 'Fishing Excursion', description: 'Join local fishermen on a traditional dhoni fishing trip' },
    { emoji: '🐟', title: 'Fish Market Experience', description: 'Visit the bustling fish market and see the daily catch' },
    { emoji: '🍽️', title: 'Fresh Seafood Dining', description: 'Enjoy freshly caught seafood prepared locally' },
    { emoji: '👥', title: 'Fisher Community Visit', description: 'Meet local fishing families and learn their stories' },
  ],
};

const foodTemplates = {
  resort: [
    { emoji: '🍛', name: 'Garudhiya', description: 'Traditional fish broth served with rice and lime' },
    { emoji: '🍜', name: 'Mas Huni', description: 'Shredded tuna mixed with grated coconut' },
    { emoji: '🐟', name: 'Grilled Fish', description: 'Fresh grilled fish with tropical spices' },
    { emoji: '☕', name: 'Fresh Coconut Water', description: 'Refreshing coconut water straight from the fruit' },
    { emoji: '🍰', name: 'Coconut Pudding', description: 'Traditional sweet coconut dessert' },
  ],
  local: [
    { emoji: '🍛', name: 'Curry Rice', description: 'Local curry served with steamed rice' },
    { emoji: '🥘', name: 'Fish Curry', description: 'Spiced fish curry with local herbs' },
    { emoji: '🍞', name: 'Roshi Bread', description: 'Traditional flatbread served with curries' },
    { emoji: '🧃', name: 'Fresh Juice', description: 'Fresh tropical fruit juices' },
    { emoji: '🍉', name: 'Tropical Fruits', description: 'Local tropical fruits and seasonal produce' },
  ],
};

const itineraryTemplate = `**Day 1: Arrival & Exploration**
Arrive at the island and settle into your accommodation. Take a leisurely walk around the island to get acquainted with the surroundings. Enjoy a relaxing evening with a sunset view.

**Day 2: Activities & Culture**
Participate in water activities or cultural experiences. Explore local attractions and interact with the community. Enjoy authentic local cuisine for dinner.

**Day 3: Relaxation & Departure**
Spend your final day relaxing on the beach or enjoying your favorite activity. Take time to capture memories before departure.`;

const faqTemplate = [
  { question: 'What is the best time to visit?', answer: 'The dry season from November to April offers the best weather with calm seas and excellent visibility for water activities.' },
  { question: 'How do I get to the island?', answer: 'Most islands are accessible by speedboat or ferry from Male airport. Travel time typically ranges from 15 minutes to 2 hours depending on location.' },
  { question: 'What activities are available?', answer: 'Common activities include snorkeling, diving, fishing, island tours, water sports, and cultural experiences. Check with your accommodation for specific offerings.' },
  { question: 'What is the local currency?', answer: 'The Maldivian Rufiyaa (MVR) is the official currency. USD is widely accepted at resorts and tourist areas.' },
];

/**
 * Determine island type based on name and atoll
 */
function getIslandType(islandName: string, atollName: string): keyof typeof activityTemplates {
  const name = islandName.toLowerCase();
  const atoll = atollName.toLowerCase();

  if (name.includes('resort') || name.includes('hotel')) return 'resort';
  if (name.includes('dive') || name.includes('diving')) return 'diving';
  if (name.includes('fish') || name.includes('fisher')) return 'fishing';
  if (atoll.includes('north') || atoll.includes('south')) return 'resort';

  // Default to local island
  return 'local';
}

/**
 * Generate guide for an island
 */
function generateGuideForIsland(island: any) {
  const islandType = getIslandType(island.name, island.atollName || '');
  const activities = activityTemplates[islandType] || activityTemplates.local;
  const food = foodTemplates[islandType === 'diving' ? 'resort' : islandType] || foodTemplates.local;

  // Randomly select 5-7 activities
  const selectedActivities = activities
    .sort(() => Math.random() - 0.5)
    .slice(0, Math.floor(Math.random() * 3) + 5);

  // Randomly select 4-5 food items
  const selectedFood = food
    .sort(() => Math.random() - 0.5)
    .slice(0, Math.floor(Math.random() * 2) + 4);

  return {
    topThingsToDo: JSON.stringify(selectedActivities),
    foodCafes: JSON.stringify(selectedFood),
    threeDayItinerary: itineraryTemplate,
    faq: JSON.stringify(faqTemplate),
    overview: `Welcome to ${island.name}. Discover the natural beauty and unique experiences this island has to offer.`,
    gettingThere: 'The island is accessible by speedboat or ferry from Male International Airport.',
    practical: 'Best time to visit: November to April. Currency: MVR. Language: Dhivehi.',
  };
}

/**
 * Main function to generate guides for missing islands
 */
async function generateMissingGuides() {
  console.log('🚀 Starting guide generation for missing islands...\n');

  try {
    // Get all islands without guides
    const missingIslands = await db
      .select()
      .from(schema.places)
      .where((col) => col.guideId === null || col.guideId === 0);

    console.log(`Found ${missingIslands.length} islands without guides\n`);

    if (missingIslands.length === 0) {
      console.log('✅ All islands already have guides!');
      process.exit(0);
    }

    let created = 0;
    let failed = 0;

    for (let i = 0; i < missingIslands.length; i++) {
      const island = missingIslands[i];

      try {
        console.log(`[${i + 1}/${missingIslands.length}] Generating guide for: ${island.name}...`);

        // Generate guide content
        const guideContent = generateGuideForIsland(island);

        // Create new island guide
        const result = await db.insert(schema.islandGuides).values({
          name: island.name,
          slug: island.slug,
          topThingsToDo: guideContent.topThingsToDo,
          foodCafes: guideContent.foodCafes,
          threeDayItinerary: guideContent.threeDayItinerary,
          faq: guideContent.faq,
          published: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        // Link guide to place
        const guideId = (result as any).insertId;
        if (guideId) {
          console.log(`  ✓ Created guide with ID: ${guideId}`);
        }

        created++;
        console.log(`  ✓ Guide created successfully\n`);
      } catch (error) {
        failed++;
        console.error(`  ✗ Error: ${error}\n`);
      }

      // Progress indicator
      if ((i + 1) % 10 === 0) {
        console.log(`📊 Progress: ${i + 1}/${missingIslands.length} islands processed\n`);
      }
    }

    console.log(`\n✅ Guide generation complete!`);
    console.log(`   Created: ${created}/${missingIslands.length}`);
    console.log(`   Failed: ${failed}/${missingIslands.length}`);

    // Final statistics
    const totalGuides = await db
      .select()
      .from(schema.islandGuides);

    console.log(`\n📊 Total island guides in system: ${totalGuides.length}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error during guide generation:', error);
    process.exit(1);
  }
}

generateMissingGuides();
