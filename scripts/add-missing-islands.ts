import { getDb } from "../server/db";
import { places, atolls } from "../drizzle/schema";

async function addMissingIslands() {
  const db = await getDb();
  if (!db) {
    console.error("Failed to connect to database");
    return;
  }

  // Get all atolls to find the right atoll IDs
  const allAtolls = await db.select().from(atolls);
  
  console.log("Available atolls:");
  allAtolls.forEach(a => console.log(`  - ${a.name} (ID: ${a.id})`));
  console.log("");

  // Islands to add with their atoll IDs
  const islandsToAdd = [
    {
      name: "Omadhoo",
      code: "OMD",
      atollId: 2, // Baa Atoll
      type: "island" as const,
    },
    {
      name: "Dhangethi",
      code: "DHG",
      atollId: 5, // Vaavu Atoll
      type: "island" as const,
    },
    {
      name: "Fehendhoo",
      code: "FHD",
      atollId: 2, // Baa Atoll
      type: "island" as const,
    },
    {
      name: "Hanimadhoo",
      code: "HNM",
      atollId: 1, // Haa Dhaalu Atoll
      type: "island" as const,
    },
  ];

  console.log("Adding missing islands to places table...\n");

  for (const island of islandsToAdd) {
    try {
      const result = await db.insert(places).values({
        name: island.name,
        code: island.code,
        atollId: island.atollId,
        type: island.type,
      });

      console.log(`✓ Added: ${island.name} (Code: ${island.code})`);
    } catch (error: any) {
      console.error(`✗ Failed to add ${island.name}:`, error.message);
    }
  }

  console.log("\nVerifying additions...");
  const updatedPlaces = await db.select().from(places);
  const addedIslands = updatedPlaces.filter(p => 
    islandsToAdd.some(i => i.name === p.name)
  );

  console.log(`\nSuccessfully added ${addedIslands.length} islands:`);
  addedIslands.forEach(p => console.log(`  - ${p.name} (ID: ${p.id}, Code: ${p.code})`));
}

addMissingIslands().catch(console.error);
