import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const newAttractions = [
  {
    placeId: 7,
    name: "Hanifaru Bay",
    slug: "hanifaru-bay",
    attractionType: "snorkeling_spot",
    overview:
      "Hanifaru Bay is one of the most spectacular snorkeling destinations in the Maldives, famous for its seasonal gatherings of manta rays and whale sharks. This UNESCO biosphere reserve offers an unforgettable experience of swimming alongside these magnificent creatures in their natural habitat.",
    difficulty: "beginner",
    bestSeason: "June to November",
    depthRange: "2-12 meters",
    marineLife: JSON.stringify([
      "Manta Rays",
      "Whale Sharks",
      "Trevally",
      "Jacks",
      "Barracuda",
      "Groupers",
      "Snappers",
      "Turtles",
    ]),
    facilities: JSON.stringify([
      "Snorkel Equipment Rental",
      "Guides Available",
      "Boats Available",
      "Photography Services",
    ]),
    safetyTips: JSON.stringify([
      "Respect marine life - maintain distance",
      "Never touch manta rays or whale sharks",
      "Wear protective clothing",
      "Follow guide instructions strictly",
      "Check weather conditions",
    ]),
    localRules: JSON.stringify([
      "Protected marine area - respect boundaries",
      "No feeding of fish",
      "No collection of shells or corals",
      "Follow UNESCO biosphere reserve rules",
      "Report any environmental damage",
    ]),
    accessInfo:
      "Hanifaru Bay is accessible via speedboat from Baa Atoll resorts, approximately 30-45 minutes. Most resorts offer guided snorkeling trips to this site.",
    typicalCost: "$40-70 per person",
    heroImage:
      "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/DGxKUIGfYDbVsKQZ.jpg",
    nearestIsland: "Baa Atoll",
    distanceFromIsland: "~8 km",
    published: 1,
    featured: 1,
  },
  {
    placeId: 8,
    name: "Cokes",
    slug: "cokes",
    attractionType: "dive_site",
    overview:
      "Cokes is a world-renowned dive site known for its thrilling encounters with large pelagic species including sharks, tuna, and jacks. This deep dive site features dramatic drop-offs and strong currents, making it ideal for experienced divers seeking adrenaline-pumping underwater adventures.",
    difficulty: "advanced",
    bestSeason: "November to April",
    depthRange: "20-40 meters",
    marineLife: JSON.stringify([
      "Reef Sharks",
      "Tuna",
      "Jacks",
      "Barracuda",
      "Groupers",
      "Snappers",
      "Trevally",
      "Moray Eels",
    ]),
    facilities: JSON.stringify([
      "Dive Resorts",
      "Liveaboard Boats",
      "Equipment Rental",
      "Decompression Chamber",
    ]),
    safetyTips: JSON.stringify([
      "Advanced certification required",
      "Strong currents - check conditions",
      "Monitor air consumption closely",
      "Maintain group cohesion",
      "Plan decompression stops carefully",
    ]),
    localRules: JSON.stringify([
      "Respect shark sanctuaries",
      "No spearfishing",
      "Protected marine areas must be observed",
      "Report any environmental damage",
    ]),
    accessInfo:
      "Cokes is best accessed via liveaboard diving boats or by speedboat from nearby resorts. Most trips require 60-90 minutes travel time.",
    typicalCost: "$70-120 per dive",
    heroImage:
      "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/pZyLIXALLogUhjDx.jpg",
    nearestIsland: "Ari Atoll",
    distanceFromIsland: "~15 km",
    published: 1,
    featured: 1,
  },
];

async function addAttractions() {
  let connection;
  try {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error("DATABASE_URL environment variable is not set");
    }

    // Parse the DATABASE_URL
    const url = new URL(databaseUrl);
    const config = {
      host: url.hostname,
      user: url.username,
      password: url.password,
      database: url.pathname.slice(1),
      ssl: { rejectUnauthorized: false },
    };

    console.log(`Connecting to database at ${config.host}...\n`);
    connection = await mysql.createConnection(config);
    console.log("✓ Connected to database\n");

    // Insert new attractions
    for (const attraction of newAttractions) {
      const query = `
        INSERT INTO attraction_guides (
          placeId, name, slug, attractionType, overview, difficulty, bestSeason,
          depthRange, marineLife, facilities, safetyTips, localRules,
          accessInfo, typicalCost, heroImage, nearestIsland, distanceFromIsland,
          published, featured
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const values = [
        attraction.placeId || 0,
        attraction.name,
        attraction.slug,
        attraction.attractionType,
        attraction.overview,
        attraction.difficulty || null,
        attraction.bestSeason || null,
        attraction.depthRange || null,
        attraction.marineLife || null,
        attraction.facilities || null,
        attraction.safetyTips || null,
        attraction.localRules || null,
        attraction.accessInfo || null,
        attraction.typicalCost || null,
        attraction.heroImage || null,
        attraction.nearestIsland || null,
        attraction.distanceFromIsland || null,
        attraction.published,
        attraction.featured,
      ];

      await connection.execute(query, values);
      console.log(`✓ Created: ${attraction.name}`);
    }

    console.log("\n✅ Successfully added new attraction guides!\n");
  } catch (error) {
    console.error("Error adding attractions:", error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

addAttractions();
