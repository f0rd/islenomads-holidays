import { drizzle } from "drizzle-orm/mysql2";
import { islandGuides } from "./drizzle/schema.ts";
import { eq } from "drizzle-orm";
import * as dotenv from "dotenv";

dotenv.config();

const db = drizzle(process.env.DATABASE_URL);

async function fixIslandData() {
  try {
    console.log("Fetching all island guides...");
    const islands = await db.select().from(islandGuides);
    
    console.log(`Found ${islands.length} island guides`);
    
    let fixedCount = 0;
    
    for (const island of islands) {
      if (!island.topThingsToDo) {
        console.log(`⏭️  Skipping ${island.slug} - no topThingsToDo data`);
        continue;
      }
      
      try {
        const parsed = JSON.parse(island.topThingsToDo);
        
        // Check if it's an array of strings (incorrect format)
        if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === 'string') {
          console.log(`🔧 Fixing ${island.slug} - converting array of strings to array of objects`);
          
          // Convert array of strings to array of objects with title and description
          const fixed = parsed.map((title, index) => ({
            title: title,
            description: `Activity ${index + 1}`
          }));
          
          await db.update(islandGuides)
            .set({ topThingsToDo: JSON.stringify(fixed) })
            .where(eq(islandGuides.id, island.id));
          
          fixedCount++;
          console.log(`✅ Fixed ${island.slug}`);
        } else if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === 'object') {
          // Check if objects have the correct structure
          if (!parsed[0].title || !parsed[0].description) {
            console.log(`🔧 Fixing ${island.slug} - objects missing title or description`);
            
            const fixed = parsed.map(item => ({
              title: item.title || item.name || 'Activity',
              description: item.description || item.details || ''
            }));
            
            await db.update(islandGuides)
              .set({ topThingsToDo: JSON.stringify(fixed) })
              .where(eq(islandGuides.id, island.id));
            
            fixedCount++;
            console.log(`✅ Fixed ${island.slug}`);
          } else {
            console.log(`✓ ${island.slug} - already has correct format`);
          }
        }
      } catch (error) {
        console.error(`❌ Error processing ${island.slug}:`, error.message);
      }
    }
    
    console.log(`\n✅ Fixed ${fixedCount} island guides`);
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

fixIslandData();
