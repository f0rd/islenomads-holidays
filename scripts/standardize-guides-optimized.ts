#!/usr/bin/env node

/**
 * Optimized script to standardize all island guides using Thoddoo as template
 * Applies emoji-enhanced formatting intelligently without LLM calls
 */

import { drizzle } from 'drizzle-orm/mysql2';
import { eq } from 'drizzle-orm';
import * as schema from '../drizzle/schema';

if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL environment variable not set');
  process.exit(1);
}

const db = drizzle(process.env.DATABASE_URL);

// Comprehensive emoji mapping for activities
const activityEmojiMap: Record<string, string> = {
  // Water activities
  snorkel: '🤿',
  snorkeling: '🤿',
  dive: '🏄',
  diving: '🏄',
  swim: '🏊',
  swimming: '🏊',
  water: '💧',
  beach: '🏖️',
  lagoon: '🏖️',
  coral: '🪸',
  reef: '🪸',
  turtle: '🐢',
  fish: '🐠',
  marine: '🐠',
  boat: '⛵',
  dhoni: '⛵',
  speedboat: '⛵',
  fishing: '🎣',
  
  // Land activities
  cycling: '🚴',
  bike: '🚴',
  hiking: '🥾',
  trek: '🥾',
  walk: '🚶',
  relax: '😌',
  relax: '😌',
  spa: '🧖',
  yoga: '🧘',
  sunset: '🌅',
  sunrise: '🌄',
  
  // Cultural
  mosque: '🕌',
  temple: '🏛️',
  museum: '🏛️',
  market: '🏪',
  bazaar: '🏪',
  shopping: '🛍️',
  culture: '🎭',
  local: '👥',
  village: '🏘️',
  
  // Food
  food: '🍽️',
  cafe: '☕',
  restaurant: '🍴',
  fruit: '🍉',
  farm: '🌾',
  cooking: '👨‍🍳',
  
  // Adventure
  adventure: '🎯',
  excursion: '🎯',
  tour: '🎫',
  explore: '🔍',
  island: '🏝️',
  resort: '🏨',
  nature: '🌿',
  jungle: '🌴',
  waterfall: '💦',
};

interface Activity {
  emoji: string;
  title: string;
  description: string;
}

interface FoodItem {
  emoji: string;
  name: string;
  description: string;
}

/**
 * Find best emoji for activity based on keywords
 */
function findBestEmoji(text: string): string {
  const lowerText = text.toLowerCase();
  
  // Check for exact and partial matches
  for (const [keyword, emoji] of Object.entries(activityEmojiMap)) {
    if (lowerText.includes(keyword)) {
      return emoji;
    }
  }
  
  // Default emoji based on context
  if (lowerText.includes('water') || lowerText.includes('sea')) return '🌊';
  if (lowerText.includes('island')) return '🏝️';
  if (lowerText.includes('beach')) return '🏖️';
  
  return '🎯'; // Default activity emoji
}

/**
 * Format activities with emojis
 */
function formatActivities(activities: any): Activity[] {
  if (!activities) return [];

  let parsed = activities;
  if (typeof activities === 'string') {
    try {
      parsed = JSON.parse(activities);
    } catch {
      return [];
    }
  }

  if (!Array.isArray(parsed)) return [];

  return parsed
    .map((activity: any) => {
      let title = '';
      let description = '';

      if (typeof activity === 'string') {
        title = activity;
      } else if (activity.title) {
        title = activity.title;
        description = activity.description || '';
      } else if (activity.name) {
        title = activity.name;
        description = activity.description || '';
      }

      if (!title) return null;

      // Remove emoji if already present
      title = title.replace(/^[\p{Emoji}]\s*/u, '').trim();

      const emoji = findBestEmoji(title);

      return {
        emoji,
        title,
        description,
      };
    })
    .filter((item): item is Activity => item !== null);
}

/**
 * Format food items with emojis
 */
function formatFoodItems(foodItems: any): FoodItem[] {
  if (!foodItems) return [];

  let parsed = foodItems;
  if (typeof foodItems === 'string') {
    try {
      parsed = JSON.parse(foodItems);
    } catch {
      return [];
    }
  }

  if (!Array.isArray(parsed)) return [];

  return parsed
    .map((item: any) => {
      let name = '';
      let description = '';

      if (typeof item === 'string') {
        name = item;
      } else if (item.name) {
        name = item.name;
        description = item.description || '';
      } else if (item.title) {
        name = item.title;
        description = item.description || '';
      }

      if (!name) return null;

      // Remove emoji if already present
      name = name.replace(/^[\p{Emoji}]\s*/u, '').trim();

      // Food-specific emoji logic
      let emoji = '🍽️';
      const lowerName = name.toLowerCase();

      if (lowerName.includes('coffee') || lowerName.includes('cafe')) emoji = '☕';
      else if (lowerName.includes('fish') || lowerName.includes('seafood')) emoji = '🐟';
      else if (lowerName.includes('curry')) emoji = '🍛';
      else if (lowerName.includes('rice')) emoji = '🍚';
      else if (lowerName.includes('fruit')) emoji = '🍉';
      else if (lowerName.includes('juice')) emoji = '🧃';
      else if (lowerName.includes('bread')) emoji = '🍞';
      else if (lowerName.includes('soup')) emoji = '🍜';
      else if (lowerName.includes('dessert') || lowerName.includes('sweet')) emoji = '🍰';
      else emoji = findBestEmoji(name);

      return {
        emoji,
        name,
        description,
      };
    })
    .filter((item): item is FoodItem => item !== null);
}

/**
 * Main standardization function
 */
async function standardizeIslandGuides() {
  console.log('🚀 Starting island guides standardization...\n');

  try {
    // Get all island guides
    const guides = await db.select().from(schema.islandGuides);
    console.log(`Found ${guides.length} island guides to standardize\n`);

    let updated = 0;
    let skipped = 0;

    for (let i = 0; i < guides.length; i++) {
      const guide = guides[i];

      try {
        console.log(`[${i + 1}/${guides.length}] Processing: ${guide.name}...`);

        // Format activities and food
        const formattedActivities = formatActivities(guide.topThingsToDo);
        const formattedFood = formatFoodItems(guide.foodCafes);

        // Only update if we have content to format
        if (formattedActivities.length === 0 && formattedFood.length === 0) {
          console.log(`  ⊘ Skipped (no activities or food data)\n`);
          skipped++;
          continue;
        }

        // Update guide with formatted content
        await db
          .update(schema.islandGuides)
          .set({
            topThingsToDo: JSON.stringify(formattedActivities),
            foodCafes: JSON.stringify(formattedFood),
          })
          .where(eq(schema.islandGuides.id, guide.id));

        updated++;
        console.log(`  ✓ Updated (${formattedActivities.length} activities, ${formattedFood.length} food items)\n`);
      } catch (error) {
        console.error(`  ✗ Error: ${error}\n`);
      }
    }

    console.log(`\n✅ Standardization complete!`);
    console.log(`   Updated: ${updated}/${guides.length}`);
    console.log(`   Skipped: ${skipped}/${guides.length}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error during standardization:', error);
    process.exit(1);
  }
}

standardizeIslandGuides();
