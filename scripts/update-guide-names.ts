import { getDb } from "../server/db";
import { islandGuides } from "../drizzle/schema";
import { eq } from "drizzle-orm";

async function updateGuideNames() {
  const db = await getDb();
  if (!db) {
    console.error("Failed to connect to database");
    return;
  }

  // Mapping of guide names to correct place names
  const mappings = [
    { from: "Fuvahmulah", to: "Fuvamulah" },
    { from: "Goidhoo", to: "Godhdhoo" },
    // Dhangethi, Fehendhoo, Hanimadhoo, Omadhoo - need manual verification
  ];

  console.log("Updating guide names to match places table...\n");

  for (const mapping of mappings) {
    const guide = await db
      .select()
      .from(islandGuides)
      .where(eq(islandGuides.name, mapping.from))
      .limit(1);

    if (guide.length > 0) {
      await db
        .update(islandGuides)
        .set({ name: mapping.to })
        .where(eq(islandGuides.name, mapping.from));

      console.log(`✓ Updated: "${mapping.from}" → "${mapping.to}"`);
    } else {
      console.log(`✗ Guide not found: "${mapping.from}"`);
    }
  }

  console.log("\nVerifying mappings...");
  
  // Check if all guides are now mapped
  const allGuides = await db.select().from(islandGuides);
  const unmapped = allGuides.filter(g => {
    // These should exist in places table
    const expectedPlaces = [
      "Male",
      "Fuvamulah",
      "Godhdhoo",
      "Dhangethi",
      "Fehendhoo",
      "Hanimadhoo",
      "Omadhoo",
    ];
    return expectedPlaces.includes(g.name);
  });

  console.log(`\nGuides checked: ${unmapped.length}`);
  unmapped.forEach(g => console.log(`  - ${g.name}`));
}

updateGuideNames().catch(console.error);
