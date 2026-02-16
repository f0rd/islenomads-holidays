import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const sampleAttractions = [
  {
    placeId: 1,
    name: "Banana Reef",
    slug: "banana-reef",
    attractionType: "dive_site",
    overview:
      "Banana Reef is one of the most iconic dive sites in the Maldives, famous for its unique banana-shaped coral formation. This vibrant reef system offers excellent visibility and abundant marine life, making it perfect for both beginners and experienced divers.",
    difficulty: "beginner",
    bestSeason: "November to April",
    depthRange: "5-30 meters",
    marineLife: JSON.stringify([
      "Manta Rays",
      "White Tip Sharks",
      "Groupers",
      "Snappers",
      "Trevally",
      "Barracuda",
      "Sea Turtles",
    ]),
    facilities: JSON.stringify([
      "Dive Shop",
      "Equipment Rental",
      "Restaurant",
      "Accommodation",
    ]),
    safetyTips: JSON.stringify([
      "Check weather conditions before diving",
      "Use proper diving equipment",
      "Maintain buoyancy control",
      "Never touch coral or marine life",
      "Dive with a certified guide",
    ]),
    localRules: JSON.stringify([
      "No collection of shells or corals",
      "No feeding of fish",
      "Respect marine protected areas",
      "Follow local diving regulations",
    ]),
    accessInfo:
      "Banana Reef is easily accessible from Male by speedboat (approximately 20 minutes). Most resorts offer daily diving trips to this site.",
    typicalCost: "$50-80 per dive",
    heroImage:
      "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/KduUuNxLlBaRYVvD.jpg",
    nearestIsland: "Male",
    distanceFromIsland: "~5 km",
    published: 1,
    featured: 1,
  },
  {
    placeId: 2,
    name: "Vaavu Atoll Dive Sites",
    slug: "vaavu-atoll-dive-sites",
    attractionType: "dive_site",
    overview:
      "Vaavu Atoll is renowned for its pristine dive sites featuring dramatic drop-offs, vibrant coral gardens, and encounters with large pelagic species. The atoll offers some of the most thrilling diving experiences in the Maldives with excellent visibility and diverse marine ecosystems.",
    difficulty: "intermediate",
    bestSeason: "November to April",
    depthRange: "15-40 meters",
    marineLife: JSON.stringify([
      "Manta Rays",
      "Reef Sharks",
      "Tuna",
      "Jacks",
      "Sweetlips",
      "Moray Eels",
      "Octopus",
      "Nudibranchs",
    ]),
    facilities: JSON.stringify([
      "Dive Resorts",
      "Liveaboard Boats",
      "Equipment Rental",
      "Decompression Chamber",
    ]),
    safetyTips: JSON.stringify([
      "Strong currents possible - check conditions",
      "Deep dives require advanced certification",
      "Maintain group cohesion",
      "Monitor air consumption closely",
      "Plan decompression stops carefully",
    ]),
    localRules: JSON.stringify([
      "Respect shark sanctuaries",
      "No spearfishing",
      "Protected marine areas must be observed",
      "Report any environmental damage",
    ]),
    accessInfo:
      "Vaavu Atoll is best accessed via liveaboard diving boats or by speedboat from nearby resorts. Most trips require 45-90 minutes travel time.",
    typicalCost: "$60-100 per dive",
    heroImage:
      "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/pZyLIXALLogUhjDx.jpg",
    nearestIsland: "Felidhoo",
    distanceFromIsland: "~20 km",
    published: 1,
    featured: 1,
  },
  {
    placeId: 3,
    name: "Artificial Reef Dive Site",
    slug: "artificial-reef-dive-site",
    attractionType: "dive_site",
    overview:
      "The Artificial Reef is a specially designed wreck dive site that has become a thriving artificial ecosystem. Sunken ships and structures have been colonized by coral and marine life, creating a unique underwater landscape perfect for photography and exploration.",
    difficulty: "intermediate",
    bestSeason: "Year-round",
    depthRange: "10-35 meters",
    marineLife: JSON.stringify([
      "Groupers",
      "Snappers",
      "Fusiliers",
      "Lionfish",
      "Pufferfish",
      "Angelfish",
      "Butterflyfish",
      "Damselfish",
    ]),
    facilities: JSON.stringify([
      "Dive Shop",
      "Photography Services",
      "Equipment Rental",
      "Guides Available",
    ]),
    safetyTips: JSON.stringify([
      "Be careful of sharp edges on wreck",
      "Use proper wreck diving techniques",
      "Carry a dive light",
      "Stay with your buddy",
      "Watch for entanglement hazards",
    ]),
    localRules: JSON.stringify([
      "No removing artifacts",
      "Respect the wreck structure",
      "Report any hazards",
      "Follow designated dive paths",
    ]),
    accessInfo:
      "The Artificial Reef is accessible via speedboat from most resorts in the Male area, approximately 15-25 minutes travel time.",
    typicalCost: "$45-70 per dive",
    heroImage:
      "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/VtbRCzMUqNIxdkdg.jpg",
    nearestIsland: "Male",
    distanceFromIsland: "~8 km",
    published: 1,
    featured: 0,
  },
  {
    placeId: 4,
    name: "Coral Garden Snorkeling",
    slug: "coral-garden-snorkeling",
    attractionType: "snorkeling_spot",
    overview:
      "Coral Garden is a shallow, pristine snorkeling destination featuring vibrant coral formations and abundant tropical fish. Perfect for families and beginners, this site offers spectacular underwater views without requiring diving certification.",
    difficulty: "beginner",
    bestSeason: "November to April",
    depthRange: "1-8 meters",
    marineLife: JSON.stringify([
      "Clownfish",
      "Parrotfish",
      "Surgeonfish",
      "Angelfish",
      "Butterflyfish",
      "Wrasses",
      "Damselfish",
      "Sea Turtles",
    ]),
    facilities: JSON.stringify([
      "Snorkel Equipment Rental",
      "Life Jackets",
      "Guides Available",
      "Nearby Restaurant",
    ]),
    safetyTips: JSON.stringify([
      "Apply sunscreen before snorkeling",
      "Wear a rash guard for protection",
      "Never stand on coral",
      "Keep a safe distance from marine life",
      "Snorkel with a buddy",
    ]),
    localRules: JSON.stringify([
      "No touching or collecting coral",
      "No feeding fish",
      "Respect marine life boundaries",
      "Follow guide instructions",
    ]),
    accessInfo:
      "Coral Garden is accessible via short boat ride from most resorts. Many resorts offer daily snorkeling trips to this site.",
    typicalCost: "$20-40 per person",
    heroImage:
      "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/DGxKUIGfYDbVsKQZ.jpg",
    nearestIsland: "Hulhumalé",
    distanceFromIsland: "~3 km",
    published: 1,
    featured: 1,
  },
  {
    placeId: 5,
    name: "Pasta Point Surf Spot",
    slug: "pasta-point-surf-spot",
    attractionType: "surf_spot",
    overview:
      "Pasta Point is a legendary surf break in the Maldives, known for its consistent waves and perfect barrel sections. This right-hand reef break offers world-class surfing conditions and attracts surfers from around the globe.",
    difficulty: "advanced",
    bestSeason: "March to October",
    waveHeight: "4-8 feet (1.2-2.4 meters)",
    marineLife: JSON.stringify([
      "Reef Fish",
      "Trevally",
      "Barracuda",
      "Groupers",
      "Snappers",
    ]),
    facilities: JSON.stringify([
      "Surf Camps",
      "Board Rental",
      "Lessons Available",
      "Accommodation",
    ]),
    safetyTips: JSON.stringify([
      "Wear a helmet for reef protection",
      "Know your skill level",
      "Check swell forecasts",
      "Respect local surfers",
      "Watch for sharp reef",
    ]),
    localRules: JSON.stringify([
      "Respect lineup etiquette",
      "No motorized vehicles",
      "Respect local culture",
      "Follow local guide rules",
    ]),
    accessInfo:
      "Pasta Point is accessed via speedboat from Male, approximately 30-45 minutes. Most surf camps provide daily boat trips.",
    typicalCost: "$30-50 per session",
    heroImage:
      "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/EFvAUbfmZaFotZsK.jpg",
    nearestIsland: "Thulusdhoo",
    distanceFromIsland: "~2 km",
    published: 1,
    featured: 1,
  },
  {
    placeId: 6,
    name: "Addu City Lagoon",
    slug: "addu-city-lagoon",
    attractionType: "snorkeling_spot",
    overview:
      "Addu City Lagoon is a stunning shallow lagoon with calm, crystal-clear waters perfect for snorkeling. The lagoon is home to diverse marine life and offers a more relaxed snorkeling experience compared to reef diving.",
    difficulty: "beginner",
    bestSeason: "Year-round",
    depthRange: "2-6 meters",
    marineLife: JSON.stringify([
      "Rays",
      "Sharks",
      "Groupers",
      "Snappers",
      "Fusiliers",
      "Angelfish",
      "Parrotfish",
    ]),
    facilities: JSON.stringify([
      "Snorkel Equipment",
      "Guides",
      "Boats Available",
      "Nearby Accommodation",
    ]),
    safetyTips: JSON.stringify([
      "Wear protective clothing",
      "Stay with your guide",
      "Respect marine life",
      "Don't touch bottom",
      "Keep group together",
    ]),
    localRules: JSON.stringify([
      "No collection of shells",
      "Respect protected species",
      "Follow guide instructions",
      "Report any issues",
    ]),
    accessInfo:
      "Addu City Lagoon is easily accessible from Addu City resorts. Most accommodations offer daily lagoon snorkeling trips.",
    typicalCost: "$15-30 per person",
    heroImage:
      "https://files.manuscdn.com/user_upload_by_module/session_file/310519663326824110/PQWMZbIMJKUbLLFY.jpg",
    nearestIsland: "Addu City",
    distanceFromIsland: "~1 km",
    published: 1,
    featured: 0,
  },
];

async function seedAttractions() {
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

    console.log(`Connecting to database at ${config.host}...
`);
    connection = await mysql.createConnection(config);
    console.log("✓ Connected to database\n");

    // Insert sample attractions
    for (const attraction of sampleAttractions) {
      const query = `
        INSERT INTO attraction_guides (
          placeId, name, slug, attractionType, overview, difficulty, bestSeason,
          depthRange, waveHeight, marineLife, facilities, safetyTips, localRules,
          accessInfo, typicalCost, heroImage, nearestIsland, distanceFromIsland,
          published, featured
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const values = [
        attraction.placeId,
        attraction.name,
        attraction.slug,
        attraction.attractionType,
        attraction.overview,
        attraction.difficulty || null,
        attraction.bestSeason || null,
        attraction.depthRange || null,
        attraction.waveHeight || null,
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

    console.log("\n✅ Successfully seeded all attraction guides!\n");
  } catch (error) {
    console.error("Error seeding attractions:", error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

seedAttractions();
