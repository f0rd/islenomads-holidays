import { getDb } from "../server/db";
import { places, islandGuides } from "../drizzle/schema";

async function findMissingIslands() {
  const db = await getDb();
  if (!db) {
    console.error("Failed to connect to database");
    return;
  }

  // Get all places
  const allPlaces = await db.select().from(places);
  
  // Get unmapped guides
  const allGuides = await db.select().from(islandGuides);
  const unmappedGuides = allGuides.filter(guide => {
    return !allPlaces.some(place => place.name === guide.name);
  });

  console.log("Unmapped guides and potential matches:\n");

  const unmappedNames = ["Omadhoo", "Dhangethi", "Fehendhoo", "Hanimadhoo"];

  for (const guideName of unmappedNames) {
    const similarPlaces = allPlaces.filter(place => {
      const pName = place.name.toLowerCase();
      const gName = guideName.toLowerCase();
      
      // Check if they share common substrings
      return pName.includes(gName.substring(0, 3)) || 
             gName.includes(pName.substring(0, 3));
    });

    console.log(`Guide: "${guideName}"`);
    if (similarPlaces.length > 0) {
      console.log("  Similar places:");
      similarPlaces.slice(0, 5).forEach(p => {
        console.log(`    - ${p.name} (ID: ${p.id})`);
      });
    } else {
      console.log("  No similar places found - may need to be added to places table");
    }
    console.log("");
  }

  // List all places with "dhoo" to see the pattern
  console.log("\nAll places ending with 'dhoo':");
  const dhooPlaces = allPlaces.filter(p => p.name.toLowerCase().includes("dhoo"));
  dhooPlaces.forEach(p => console.log(`  - ${p.name} (ID: ${p.id})`));
}

findMissingIslands().catch(console.error);
