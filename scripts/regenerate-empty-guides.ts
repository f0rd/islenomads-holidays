import { getDb } from '../server/db';
import { eq } from 'drizzle-orm';
import { islandGuides } from '../drizzle/schema';
import { invokeLLM } from '../server/_core/llm';

/**
 * Regenerate guides with empty content
 * Uses LLM to generate comprehensive guide data
 */
async function regenerateEmptyGuides() {
  const db = await getDb();
  if (!db) {
    console.error('Failed to connect to database');
    return;
  }

  // Get all guides
  const allGuides = await db.select().from(islandGuides);
  
  // Find guides with empty content
  const emptyGuides = allGuides.filter(g => 
    (!g.overview || g.overview.length === 0) ||
    (!g.topThingsToDo || g.topThingsToDo.length === 0) ||
    (!g.foodCafes || g.foodCafes.length === 0)
  );

  console.log(`Found ${emptyGuides.length} guides with empty content\n`);

  let regeneratedCount = 0;
  let failedCount = 0;

  for (const guide of emptyGuides) {
    try {
      console.log(`Regenerating: ${guide.name}...`);

      const prompt = `Generate comprehensive travel guide data for ${guide.name} island in the Maldives. Return ONLY valid JSON with this exact structure:
{
  "overview": "80-200 word description of the island",
  "topThingsToDo": [{"emoji": "🏄", "title": "Activity Name", "description": "Brief description"}],
  "foodCafes": [{"name": "Restaurant Name", "description": "Brief description"}],
  "attractions": [{"name": "Attraction Name", "description": "Brief description"}],
  "quickFacts": ["Fact 1", "Fact 2", "Fact 3", "Fact 4", "Fact 5", "Fact 6", "Fact 7", "Fact 8"]
}`;

      const response = await invokeLLM({
        messages: [
          { role: 'system', content: 'You are a travel guide expert. Generate comprehensive, accurate travel guide data in valid JSON format.' },
          { role: 'user', content: prompt }
        ]
      });

      const content = response.choices[0].message.content;
      
      // Parse JSON from response
      let guideData;
      try {
        // Try to extract JSON from the response
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          guideData = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('No JSON found in response');
        }
      } catch (parseError) {
        console.error(`  ✗ Failed to parse response for ${guide.name}`);
        failedCount++;
        continue;
      }

      // Update guide with generated data
      await db.update(islandGuides)
        .set({
          overview: guideData.overview || guide.overview,
          topThingsToDo: guideData.topThingsToDo ? JSON.stringify(guideData.topThingsToDo) : guide.topThingsToDo,
          foodCafes: guideData.foodCafes ? JSON.stringify(guideData.foodCafes) : guide.foodCafes,
          attractions: guideData.attractions ? JSON.stringify(guideData.attractions) : guide.attractions,
          quickFacts: guideData.quickFacts ? JSON.stringify(guideData.quickFacts) : guide.quickFacts,
        })
        .where(eq(islandGuides.id, guide.id));

      console.log(`  ✓ Regenerated ${guide.name}`);
      regeneratedCount++;
    } catch (error) {
      console.error(`  ✗ Error regenerating ${guide.name}:`, error);
      failedCount++;
    }
  }

  console.log(`\n📊 SUMMARY:`);
  console.log(`Successfully regenerated: ${regeneratedCount} guides`);
  console.log(`Failed: ${failedCount} guides`);
}

regenerateEmptyGuides().catch(console.error);
