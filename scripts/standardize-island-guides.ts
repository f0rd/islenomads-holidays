#!/usr/bin/env node

/**
 * Script to standardize all island guides using Thoddoo as template
 * Applies emoji-enhanced formatting to activities, food, itineraries, and FAQ
 */

import { drizzle } from 'drizzle-orm/mysql2';
import { eq, sql } from 'drizzle-orm';
import * as schema from '../drizzle/schema';
import { invokeLLM } from '../server/_core/llm';

if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL environment variable not set');
  process.exit(1);
}

const db = drizzle(process.env.DATABASE_URL);

// Activity emojis for different types
const activityEmojis: Record<string, string> = {
  snorkel: '🤿',
  dive: '🏄',
  beach: '🏖️',
  relax: '😌',
  swim: '🏊',
  water: '💧',
  boat: '⛵',
  fish: '🐠',
  turtle: '🐢',
  coral: '🪸',
  sunset: '🌅',
  sunrise: '🌄',
  market: '🏪',
  food: '🍽️',
  fruit: '🍉',
  cycling: '🚴',
  hiking: '🥾',
  mosque: '🕌',
  museum: '🏛️',
  culture: '🎭',
  local: '👥',
  adventure: '🎯',
  nature: '🌿',
  island: '🏝️',
  resort: '🏨',
};

interface Activity {
  emoji?: string;
  title: string;
  description: string;
}

interface FoodItem {
  emoji?: string;
  name: string;
  description: string;
}

/**
 * Generate emoji-enhanced content using LLM
 */
async function generateEmojiEnhancedGuide(
  islandName: string,
  currentGuide: any
): Promise<{
  topThingsToDo: Activity[];
  foodCafes: FoodItem[];
  threeDayItinerary: any;
  faq: any;
}> {
  try {
    const prompt = `You are a travel guide expert. Standardize this island guide for "${islandName}" using emoji-enhanced formatting similar to Thoddoo island.

Current guide data:
${JSON.stringify(currentGuide, null, 2)}

Requirements:
1. For activities: Add relevant emoji at the start of each activity title
2. For food: Add food/drink emoji at the start of each item
3. Keep descriptions concise (1-2 sentences)
4. Ensure consistency in formatting
5. Activity count should be 5-8 based on what's available
6. Food items should be 4-6 items

Return ONLY valid JSON with this structure:
{
  "topThingsToDo": [
    {"emoji": "🤿", "title": "Activity Name", "description": "Brief description"},
    ...
  ],
  "foodCafes": [
    {"emoji": "🍜", "name": "Food Name", "description": "Brief description"},
    ...
  ],
  "threeDayItinerary": "Formatted itinerary text",
  "faq": [
    {"question": "Q?", "answer": "A"},
    ...
  ]
}`;

    const response = await invokeLLM({
      messages: [
        {
          role: 'system',
          content:
            'You are a travel guide expert. Return ONLY valid JSON, no markdown formatting or code blocks.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const content = response.choices[0]?.message?.content || '';
    
    // Extract JSON from response (handle markdown code blocks if present)
    let jsonStr = content;
    const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1];
    }

    const parsed = JSON.parse(jsonStr);
    return parsed;
  } catch (error) {
    console.error(`Error generating guide for ${islandName}:`, error);
    return {
      topThingsToDo: [],
      foodCafes: [],
      threeDayItinerary: '',
      faq: [],
    };
  }
}

/**
 * Format activities with emojis
 */
function formatActivities(activities: any): Activity[] {
  if (!activities) return [];

  if (typeof activities === 'string') {
    try {
      activities = JSON.parse(activities);
    } catch {
      return [];
    }
  }

  if (!Array.isArray(activities)) return [];

  return activities.map((activity: any) => {
    if (typeof activity === 'string') {
      return {
        emoji: '🎯',
        title: activity,
        description: '',
      };
    }

    // If already has emoji, keep it
    if (activity.emoji) {
      return activity;
    }

    // Try to find matching emoji
    const title = (activity.title || activity.name || activity).toLowerCase();
    let emoji = '🎯';

    for (const [keyword, emo] of Object.entries(activityEmojis)) {
      if (title.includes(keyword)) {
        emoji = emo;
        break;
      }
    }

    return {
      emoji,
      title: activity.title || activity.name || activity,
      description: activity.description || '',
    };
  });
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
    let failed = 0;

    for (let i = 0; i < guides.length; i++) {
      const guide = guides[i];

      try {
        console.log(`[${i + 1}/${guides.length}] Processing: ${guide.name}...`);

        // Generate emoji-enhanced content
        const standardized = await generateEmojiEnhancedGuide(guide.name, guide);

        // Format activities with emojis
        const formattedActivities = formatActivities(standardized.topThingsToDo);
        const formattedFood = formatActivities(standardized.foodCafes);

        // Update guide
        await db
          .update(schema.islandGuides)
          .set({
            topThingsToDo: JSON.stringify(formattedActivities),
            foodCafes: JSON.stringify(formattedFood),
            threeDayItinerary: standardized.threeDayItinerary,
            faq: JSON.stringify(standardized.faq),
          })
          .where(eq(schema.islandGuides.id, guide.id));

        updated++;
        console.log(`  ✓ Updated successfully\n`);
      } catch (error) {
        failed++;
        console.error(`  ✗ Failed: ${error}\n`);
      }

      // Add delay to avoid rate limiting
      if ((i + 1) % 5 === 0) {
        console.log('⏸️  Pausing to avoid rate limiting...\n');
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }

    console.log(`\n✅ Standardization complete!`);
    console.log(`   Updated: ${updated}/${guides.length}`);
    console.log(`   Failed: ${failed}/${guides.length}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error during standardization:', error);
    process.exit(1);
  }
}

standardizeIslandGuides();
