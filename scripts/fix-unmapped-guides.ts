import { getDb } from "../server/db";
import { places, islandGuides } from "../drizzle/schema";

async function fixUnmappedGuides() {
  const db = await getDb();
  if (!db) {
    console.error("Failed to connect to database");
    return;
  }

  // Get all guides and places
  const allGuides = await db.select().from(islandGuides);
  const allPlaces = await db.select().from(places);
  
  // Find unmapped guides
  const unmappedGuides = allGuides.filter(guide => {
    return !allPlaces.some(place => place.name === guide.name);
  });

  console.log("Unmapped guides found:", unmappedGuides.length);
  unmappedGuides.forEach(g => console.log(`  - ${g.name}`));
  
  console.log("\nAttempting to match unmapped guides with places...\n");

  for (const guide of unmappedGuides) {
    const guideName = guide.name;
    
    // Try to find a matching place using fuzzy matching
    const possibleMatches = allPlaces.filter(place => {
      const placeName = place.name.toLowerCase();
      const gName = guideName.toLowerCase();
      
      // Exact match
      if (placeName === gName) return true;
      
      // Partial match
      if (placeName.includes(gName) || gName.includes(placeName)) return true;
      
      // Levenshtein distance
      const similarity = calculateSimilarity(placeName, gName);
      return similarity > 0.7;
    });

    if (possibleMatches.length > 0) {
      console.log(`Guide: "${guideName}"`);
      console.log("Possible matches:");
      possibleMatches.forEach((match, idx) => {
        console.log(`  ${idx + 1}. ${match.name} (ID: ${match.id})`);
      });
      console.log("");
    } else {
      console.log(`Guide: "${guideName}" - NO MATCHES FOUND`);
      console.log("");
    }
  }
}

function calculateSimilarity(str1: string, str2: string): number {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;

  if (longer.length === 0) return 1.0;

  const editDistance = getEditDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
}

function getEditDistance(s1: string, s2: string): number {
  const costs = [];
  for (let i = 0; i <= s1.length; i++) {
    let lastValue = i;
    for (let j = 0; j <= s2.length; j++) {
      if (i === 0) {
        costs[j] = j;
      } else if (j > 0) {
        let newValue = costs[j - 1];
        if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
          newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
        }
        costs[j - 1] = lastValue;
        lastValue = newValue;
      }
    }
    if (i > 0) costs[s2.length] = lastValue;
  }
  return costs[s2.length];
}

fixUnmappedGuides().catch(console.error);
