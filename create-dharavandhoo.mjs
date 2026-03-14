import { getDb } from "./server/db.ts";
import { islandGuides } from "./drizzle/schema.ts";

const db = await getDb();
if (!db) {
  console.error("Database connection failed");
  process.exit(1);
}

// Create Dharavandhoo island
const dharavandhooData = {
  name: "Dharavandhoo",
  slug: "dharavandhoo",
  atoll: "Baa Atoll",
  region: "North",
  description: "Dharavandhoo is the gateway to Hanifaru Bay's massive manta gatherings. This island serves as the main access point for visitors exploring the UNESCO Biosphere Reserve of Baa Atoll. Known for its international airport and excellent diving opportunities.",
  overview: "Welcome to Dharavandhoo, a charming island in Baa Atoll known as the gateway to Hanifaru Bay. This island is famous for hosting the Dharavandhoo Airport (DRV), which serves as the primary international entry point for tourists visiting the northern atolls. Dharavandhoo offers pristine beaches, crystal-clear waters, and exceptional marine biodiversity.",
  activities: "Manta ray watching at Hanifaru Bay, diving, snorkeling, island hopping, local island exploration, beach walks, water sports",
  bestTimeToVisit: "June to November for manta ray season; December to May for general tourism",
  accommodation: "Mix of local guesthouses and mid-range resorts",
  food: "Fresh seafood, traditional Maldivian curry, coconut-based dishes, tropical fruits",
  practicalInfo: "International airport (DRV) with connections to Malé. Local island with authentic Maldivian culture.",
  howToGetThere: "Fly internationally to Dharavandhoo Airport (DRV) from Malé or other countries. Speedboat transfers available to nearby islands.",
  attractions: "Hanifaru Bay, local markets, island beaches, nearby dive sites",
  itinerary: "Day 1: Arrive at DRV airport, settle in. Day 2-3: Manta ray watching at Hanifaru Bay. Day 4: Explore local island culture. Day 5: Depart.",
  faqs: "When is manta season? June-November. What's the airport code? DRV. How far to Hanifaru Bay? About 30-45 minutes by boat.",
  featured: 1,
  displayOrder: 23,
  published: 1,
  flightInfo: "International flights available to Dharavandhoo Airport (DRV). Direct connections from various countries, with some routing through Malé.",
  nearbyAirports: JSON.stringify([
    {
      code: "DRV",
      name: "Dharavandhoo Airport",
      description: "International airport serving Baa Atoll and northern atolls",
      distance: "0 km",
      duration: "Direct",
      transferType: "Direct Flight"
    },
    {
      code: "MLE",
      name: "Malé International Airport",
      description: "Main international hub with connections to Dharavandhoo",
      distance: "150 km",
      duration: "45 minutes",
      transferType: "Domestic Flight"
    }
  ])
};

try {
  const result = await db.insert(islandGuides).values(dharavandhooData);
  console.log("✅ Dharavandhoo created successfully!");
  console.log(`   Island ID: ${result.insertId}`);
  console.log(`   Name: ${dharavandhooData.name}`);
  console.log(`   Atoll: ${dharavandhooData.atoll}`);
  console.log(`   Airport: DRV`);
  console.log(`   Featured: Yes (displayOrder: ${dharavandhooData.displayOrder})`);
  
  // Verify it was created
  const created = await db
    .select()
    .from(islandGuides)
    .where((col) => col.name === 'Dharavandhoo');
  
  if (created.length > 0) {
    console.log("\n✅ Verification: Dharavandhoo found in database!");
  }
} catch (error) {
  console.error("❌ Error creating Dharavandhoo:", error.message);
  process.exit(1);
}

process.exit(0);
