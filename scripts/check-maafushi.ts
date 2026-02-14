import { getDb } from "../server/db";
import { places, islandGuides } from "../drizzle/schema";

async function checkMaafushi() {
  const db = await getDb();
  if (!db) {
    console.error("Failed to connect to database");
    return;
  }

  const allGuides = await db.select().from(islandGuides);
  const allPlaces = await db.select().from(places);

  const maafushiGuides = allGuides.filter(g => 
    g.name && g.name.toLowerCase().includes("maafushi")
  );

  const maafushiPlaces = allPlaces.filter(p => 
    p.name && p.name.toLowerCase().includes("maafushi")
  );

  console.log("=== Maafushi Guide ===");
  maafushiGuides.forEach(g => {
    console.log(`Guide: "${g.name}" (ID: ${g.id})`);
  });

  console.log("\n=== Maafushi Places ===");
  maafushiPlaces.forEach(p => {
    console.log(`Place: "${p.name}" (ID: ${p.id})`);
  });

  console.log("\n=== Mapping Status ===");
  if (maafushiGuides.length > 0 && maafushiPlaces.length > 0) {
    const guide = maafushiGuides[0];
    const place = maafushiPlaces[0];
    
    if (guide.name === place.name) {
      console.log("✓ Maafushi is properly mapped!");
    } else {
      console.log(`✗ Mismatch: Guide="${guide.name}" vs Place="${place.name}"`);
      console.log(`  Should update guide name to: "${place.name}"`);
    }
  } else if (maafushiGuides.length > 0 && maafushiPlaces.length === 0) {
    console.log(`✗ Guide exists but no matching place: "${maafushiGuides[0].name}"`);
  } else if (maafushiGuides.length === 0 && maafushiPlaces.length > 0) {
    console.log(`✗ Place exists but no matching guide: "${maafushiPlaces[0].name}"`);
  }
}

checkMaafushi().catch(console.error);
