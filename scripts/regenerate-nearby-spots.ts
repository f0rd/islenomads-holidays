import { getDb } from '../server/db';
import { eq } from 'drizzle-orm';
import { islandGuides } from '../drizzle/schema';
import { invokeLLM } from '../server/_core/llm';

/**
 * Regenerate nearby dive sites and surf spots for all guides
 * Uses LLM to generate realistic nearby spots based on island location
 */
async function regenerateNearbySpots() {
  const db = await getDb();
  if (!db) {
    console.error('Failed to connect to database');
    return;
  }

  // Get all guides
  const allGuides = await db.select().from(islandGuides);
  
  // Find guides with empty nearby spots
  const emptyGuides = allGuides.filter(g => 
    (!g.nearbyDiveSites || g.nearbyDiveSites.length === 0) ||
    (!g.nearbySurfSpots || g.nearbySurfSpots.length === 0)
  );

  console.log(`Found ${emptyGuides.length} guides with empty nearby spots\n`);

  let regeneratedCount = 0;
  let failedCount = 0;

  for (const guide of emptyGuides) {
    try {
      console.log(`Regenerating nearby spots for: ${guide.name}...`);

      const prompt = `Generate nearby dive sites and surf spots for ${guide.name} island in the Maldives. Return ONLY valid JSON with this exact structure:
{
  "nearbyDiveSites": [
    {"name": "Dive Site Name", "distance": "X km", "difficulty": "Beginner/Intermediate/Advanced", "description": "Brief description"}
  ],
  "nearbySurfSpots": [
    {"name": "Surf Spot Name", "distance": "X km", "difficulty": "Beginner/Intermediate/Advanced", "description": "Brief description"}
  ]
}

Include 3-5 nearby dive sites and 2-3 nearby surf spots. Use realistic Maldivian dive site and surf spot names.`;

      const response = await invokeLLM({
        messages: [
          { role: 'system', content: 'You are a Maldives travel expert. Generate realistic nearby dive sites and surf spots in valid JSON format.' },
          { role: 'user', content: prompt }
        ]
      });

      const content = response.choices[0].message.content;
      
      // Parse JSON from response
      let spotsData;
      try {
        // Try to extract JSON from the response
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          spotsData = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('No JSON found in response');
        }
      } catch (parseError) {
        console.error(`  ✗ Failed to parse response for ${guide.name}`);
        failedCount++;
        continue;
      }

      // Update guide with generated data
      const updateData: any = {};
      
      if (spotsData.nearbyDiveSites && (!guide.nearbyDiveSites || guide.nearbyDiveSites.length === 0)) {
        updateData.nearbyDiveSites = JSON.stringify(spotsData.nearbyDiveSites);
      }
      
      if (spotsData.nearbySurfSpots && (!guide.nearbySurfSpots || guide.nearbySurfSpots.length === 0)) {
        updateData.nearbySurfSpots = JSON.stringify(spotsData.nearbySurfSpots);
      }

      if (Object.keys(updateData).length > 0) {
        await db.update(islandGuides)
          .set(updateData)
          .where(eq(islandGuides.id, guide.id));

        console.log(`  ✓ Regenerated nearby spots for ${guide.name}`);
        regeneratedCount++;
      }
    } catch (error) {
      console.error(`  ✗ Error regenerating nearby spots for ${guide.name}:`, error);
      failedCount++;
    }
  }

  console.log(`\n📊 SUMMARY:`);
  console.log(`Successfully regenerated: ${regeneratedCount} guides`);
  console.log(`Failed: ${failedCount} guides`);
}

regenerateNearbySpots().catch(console.error);
