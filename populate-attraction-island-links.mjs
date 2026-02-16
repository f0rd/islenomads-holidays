import mysql from "mysql2/promise";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("DATABASE_URL environment variable is not set");
  process.exit(1);
}

const links = [
  // Banana Reef - near North Male resorts
  {
    attractionSlug: "banana-reef",
    islandName: "Dhigurah",
    distance: "15 km",
    travelTime: "25 minutes",
    transportMethod: "speedboat",
    notes: "Popular day trip from South Male resorts",
  },
  {
    attractionSlug: "banana-reef",
    islandName: "Maafushi",
    distance: "20 km",
    travelTime: "35 minutes",
    transportMethod: "speedboat",
    notes: "Accessible from budget resorts",
  },

  // Vaavu Atoll - near Vaavu islands
  {
    attractionSlug: "vaavu-atoll",
    islandName: "Felidhoo",
    distance: "5 km",
    travelTime: "10 minutes",
    transportMethod: "speedboat",
    notes: "Local island with dive shops",
  },

  // Artificial Reef - near North Male
  {
    attractionSlug: "artificial-reef",
    islandName: "Malé",
    distance: "8 km",
    travelTime: "15 minutes",
    transportMethod: "speedboat",
    notes: "Easy access from capital city",
  },

  // Coral Garden - near South Male
  {
    attractionSlug: "coral-garden",
    islandName: "Maafushi",
    distance: "10 km",
    travelTime: "20 minutes",
    transportMethod: "speedboat",
    notes: "Perfect for beginners",
  },

  // Addu City Lagoon - near Addu
  {
    attractionSlug: "addu-city-lagoon",
    islandName: "Gan",
    distance: "5 km",
    travelTime: "15 minutes",
    transportMethod: "speedboat",
    notes: "Gateway to Addu Atoll",
  },

  // Pasta Point - near Ari Atoll
  {
    attractionSlug: "pasta-point",
    islandName: "Rasdhoo",
    distance: "8 km",
    travelTime: "20 minutes",
    transportMethod: "speedboat",
    notes: "Popular with experienced surfers",
  },

  // Maaya Thila - near North Male
  {
    attractionSlug: "maaya-thila",
    islandName: "Malé",
    distance: "25 km",
    travelTime: "40 minutes",
    transportMethod: "speedboat",
    notes: "Excellent for night diving",
  },

  // Kandooma Thila - near South Male
  {
    attractionSlug: "kandooma-thila",
    islandName: "Dhigurah",
    distance: "18 km",
    travelTime: "30 minutes",
    transportMethod: "speedboat",
    notes: "Great for macro photography",
  },

  // HP Reef - near North Male
  {
    attractionSlug: "hp-reef",
    islandName: "Malé",
    distance: "12 km",
    travelTime: "20 minutes",
    transportMethod: "speedboat",
    notes: "Suitable for all levels",
  },

  // Veligandu Reef - near North Male
  {
    attractionSlug: "veligandu-reef",
    islandName: "Malé",
    distance: "10 km",
    travelTime: "18 minutes",
    transportMethod: "speedboat",
    notes: "Vibrant coral and fish",
  },

  // Banana Reef Lagoon - near South Male
  {
    attractionSlug: "banana-reef-lagoon",
    islandName: "Maafushi",
    distance: "12 km",
    travelTime: "22 minutes",
    transportMethod: "speedboat",
    notes: "Calm waters for families",
  },

  // Bikini Beach Reef - near Ari Atoll
  {
    attractionSlug: "bikini-beach-reef",
    islandName: "Rasdhoo",
    distance: "6 km",
    travelTime: "15 minutes",
    transportMethod: "speedboat",
    notes: "Excellent visibility",
  },

  // Chickens - near Ari Atoll
  {
    attractionSlug: "chickens",
    islandName: "Rasdhoo",
    distance: "10 km",
    travelTime: "25 minutes",
    transportMethod: "speedboat",
    notes: "Consistent waves year-round",
  },

  // Riptides - near Ari Atoll
  {
    attractionSlug: "riptides",
    islandName: "Rasdhoo",
    distance: "12 km",
    travelTime: "30 minutes",
    transportMethod: "speedboat",
    notes: "Intermediate to advanced",
  },

  // Thalapathi - near Baa Atoll
  {
    attractionSlug: "thalapathi",
    islandName: "Eydhafushi",
    distance: "8 km",
    travelTime: "20 minutes",
    transportMethod: "speedboat",
    notes: "Protected lagoon access",
  },

  // Cokes - near Ari Atoll
  {
    attractionSlug: "cokes",
    islandName: "Rasdhoo",
    distance: "15 km",
    travelTime: "35 minutes",
    transportMethod: "speedboat",
    notes: "Famous right-hand barrel",
  },

  // Hanifaru Bay - near Baa Atoll
  {
    attractionSlug: "hanifaru-bay",
    islandName: "Eydhafushi",
    distance: "10 km",
    travelTime: "25 minutes",
    transportMethod: "speedboat",
    notes: "Manta ray and whale shark season: June-November",
  },

  // Male City - capital
  {
    attractionSlug: "male-city",
    islandName: "Malé",
    distance: "0 km",
    travelTime: "0 minutes",
    transportMethod: "walk",
    notes: "Located in the capital",
  },

  // Artificial Beach - near Male
  {
    attractionSlug: "artificial-beach",
    islandName: "Malé",
    distance: "2 km",
    travelTime: "5 minutes",
    transportMethod: "taxi",
    notes: "Public beach near capital",
  },

  // Male Friday Mosque - capital
  {
    attractionSlug: "male-friday-mosque",
    islandName: "Malé",
    distance: "0 km",
    travelTime: "0 minutes",
    transportMethod: "walk",
    notes: "Located in the capital",
  },

  // Hulhumale Beach - near Male
  {
    attractionSlug: "hulhumale-beach",
    islandName: "Hulhumalé",
    distance: "0 km",
    travelTime: "0 minutes",
    transportMethod: "walk",
    notes: "Located on Hulhumalé island",
  },

  // Fesdu Wreck - near North Male
  {
    attractionSlug: "fesdu-wreck",
    islandName: "Malé",
    distance: "20 km",
    travelTime: "35 minutes",
    transportMethod: "speedboat",
    notes: "Historic wreck dive site",
  },
];

async function populateLinks() {
  let connection;
  try {
    connection = await mysql.createConnection({
      uri: DATABASE_URL,
      ssl: false,
    });

    console.log("Connected to database");

    // Get all attraction guides and island guides
    const [attractions] = await connection.execute("SELECT id, slug FROM attraction_guides");
    const [islands] = await connection.execute("SELECT id, name FROM island_guides");

    const attractionMap = Object.fromEntries(attractions.map((a) => [a.slug, a.id]));
    const islandMap = Object.fromEntries(islands.map((i) => [i.name, i.id]));

    console.log(`Found ${attractions.length} attractions and ${islands.length} islands`);

    let inserted = 0;
    let skipped = 0;

    for (const link of links) {
      const attractionId = attractionMap[link.attractionSlug];
      const islandId = islandMap[link.islandName];

      if (!attractionId) {
        console.warn(`⚠️  Attraction not found: ${link.attractionSlug}`);
        skipped++;
        continue;
      }

      if (!islandId) {
        console.warn(`⚠️  Island not found: ${link.islandName}`);
        skipped++;
        continue;
      }

      // Check if link already exists
      const [existing] = await connection.execute(
        "SELECT id FROM attraction_island_links WHERE attractionGuideId = ? AND islandGuideId = ?",
        [attractionId, islandId]
      );

      if (existing.length > 0) {
        console.log(`⏭️  Link already exists: ${link.attractionSlug} → ${link.islandName}`);
        skipped++;
        continue;
      }

      // Insert the link
      await connection.execute(
        "INSERT INTO attraction_island_links (attractionGuideId, islandGuideId, distance, travelTime, transportMethod, notes) VALUES (?, ?, ?, ?, ?, ?)",
        [attractionId, islandId, link.distance, link.travelTime, link.transportMethod, link.notes]
      );

      console.log(`✅ Linked: ${link.attractionSlug} → ${link.islandName}`);
      inserted++;
    }

    console.log(`\n📊 Summary: ${inserted} links inserted, ${skipped} skipped`);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

populateLinks();
