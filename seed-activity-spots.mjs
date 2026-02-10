import mysql from 'mysql2/promise';

// Parse DATABASE_URL
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error('DATABASE_URL environment variable is not set');
  process.exit(1);
}

const url = new URL(databaseUrl);
const config = {
  host: url.hostname,
  port: url.port || 3306,
  user: url.username,
  password: url.password,
  database: url.pathname.slice(1),
  ssl: url.hostname.includes('tidbcloud') || url.hostname.includes('rds') ? { rejectUnauthorized: false } : undefined,
};

const activitySpots = [
  // Surf Spots
  {
    name: "Cokes",
    slug: "cokes",
    spotType: "surf_spot",
    islandSlug: "thulusdhoo",
    latitude: 4.330,
    longitude: 73.560,
    bestSeason: "Mar-Oct",
    difficulty: "Advanced",
    description: "Fast right-hand reef break",
  },
  {
    name: "Chickens",
    slug: "chickens",
    type: "surf",
    islandSlug: "kuda-villingili",
    latitude: 4.310,
    longitude: 73.570,
    bestSeason: "Mar-Oct",
    difficulty: "Advanced",
    description: "Long playful right",
  },
  {
    name: "Honkys",
    slug: "honkys",
    type: "surf",
    islandSlug: "north-male-atoll",
    latitude: 4.310,
    longitude: 73.580,
    bestSeason: "Mar-Oct",
    difficulty: "Expert",
    description: "Powerful hollow left",
  },
  {
    name: "Sultans",
    slug: "sultans",
    type: "surf",
    islandSlug: "north-male-atoll",
    latitude: 4.300,
    longitude: 73.580,
    bestSeason: "Mar-Oct",
    difficulty: "Intermediate",
    description: "User-friendly reef break",
  },
  {
    name: "Jailbreaks",
    slug: "jailbreaks",
    type: "surf",
    islandSlug: "himmafushi",
    latitude: 4.310,
    longitude: 73.580,
    bestSeason: "Mar-Oct",
    difficulty: "Intermediate",
    description: "Consistent right",
  },
  {
    name: "Foxys",
    slug: "foxys",
    type: "surf",
    islandSlug: "lhaviyani-atoll",
    latitude: 5.380,
    longitude: 73.480,
    bestSeason: "Mar-Oct",
    difficulty: "Intermediate",
    description: "Fun and forgiving wave",
  },
  {
    name: "Yeyye",
    slug: "yeyye",
    type: "surf",
    islandSlug: "laamu-atoll",
    latitude: 1.825,
    longitude: 73.450,
    bestSeason: "Mar-Oct",
    difficulty: "Advanced",
    description: "Heavy southern reef break",
  },
  {
    name: "Two Ways",
    slug: "two-ways",
    type: "surf",
    islandSlug: "laamu-atoll",
    latitude: 1.840,
    longitude: 73.440,
    bestSeason: "Mar-Oct",
    difficulty: "Advanced",
    description: "Left and right options",
  },
  // Dive Sites
  {
    name: "Hanifaru Bay",
    slug: "hanifaru-bay",
    spotType: "dive_site",
    islandSlug: "dharavandhoo",
    latitude: 5.188,
    longitude: 73.110,
    bestSeason: "Jun-Nov",
    difficulty: "All Levels",
    description: "Manta ray aggregation site",
    depthRange: "5-30m",
  },
  {
    name: "Fish Head",
    slug: "fish-head",
    spotType: "dive_site",
    islandSlug: "rasdhoo",
    latitude: 4.261,
    longitude: 72.995,
    bestSeason: "All Year",
    difficulty: "Intermediate",
    description: "Sharks and large pelagics",
    depthRange: "10-30m",
  },
  {
    name: "Maaya Thila",
    slug: "maaya-thila",
    spotType: "dive_site",
    islandSlug: "rasdhoo",
    latitude: 4.282,
    longitude: 72.969,
    bestSeason: "All Year",
    difficulty: "All Levels",
    description: "Night dive hotspot",
    depthRange: "8-30m",
  },
  {
    name: "Kuda Rah Thila",
    slug: "kuda-rah-thila",
    spotType: "dive_site",
    islandSlug: "dhigurah",
    latitude: 3.650,
    longitude: 72.950,
    bestSeason: "All Year",
    difficulty: "Intermediate",
    description: "Turtles and eagle rays",
    depthRange: "10-35m",
  },
  {
    name: "Fotteyo Kandu",
    slug: "fotteyo-kandu",
    spotType: "dive_site",
    islandSlug: "felidhoo",
    latitude: 3.560,
    longitude: 73.520,
    bestSeason: "All Year",
    difficulty: "Advanced",
    description: "Channel with strong currents",
    depthRange: "15-40m",
  },
  {
    name: "Bathala Thila",
    slug: "bathala-thila",
    spotType: "dive_site",
    islandSlug: "rasdhoo",
    latitude: 4.250,
    longitude: 72.950,
    bestSeason: "All Year",
    difficulty: "All Levels",
    description: "Colorful reef life",
    depthRange: "10-30m",
  },
  {
    name: "Maradhoo Kandu",
    slug: "maradhoo-kandu",
    spotType: "dive_site",
    islandSlug: "hithadhoo",
    latitude: -0.610,
    longitude: 73.140,
    bestSeason: "All Year",
    difficulty: "Advanced",
    description: "Deep channel dive",
    depthRange: "12-40m",
  },
];

async function seedActivitySpots() {
  let connection;
  try {
    connection = await mysql.createConnection(config);
    console.log('Connected to database');

    let insertedCount = 0;
    let skippedCount = 0;

    for (const spot of activitySpots) {
      try {
        // First, get the island guide ID from the island slug
        const [islandGuide] = await connection.query(
          'SELECT id FROM island_guides WHERE slug = ?',
          [spot.islandSlug]
        );

        if (islandGuide.length === 0) {
          console.log(`⚠️  Island not found for: ${spot.name} (${spot.islandSlug})`);
          skippedCount++;
          continue;
        }

        const islandGuideId = islandGuide[0].id;

        // Check if activity spot already exists
        const [existing] = await connection.query(
          'SELECT id FROM activity_spots WHERE slug = ?',
          [spot.slug]
        );

        if (existing.length > 0) {
          console.log(`ℹ️  Activity spot already exists: ${spot.name}`);
          skippedCount++;
          continue;
        }

        // Map difficulty names to enum values
        const difficultyMap = {
          'Beginner': 'beginner',
          'Intermediate': 'intermediate',
          'Advanced': 'advanced',
          'Expert': 'advanced',
          'All Levels': 'beginner',
        };
        const mappedDifficulty = difficultyMap[spot.difficulty] || 'intermediate';

        // Insert activity spot
        const query = `
          INSERT INTO activity_spots (
            islandGuideId, name, slug, spotType, latitude, longitude, bestSeason, difficulty, description, minDepth, maxDepth, published, createdAt, updatedAt
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, NOW(), NOW())
        `;

        // Parse depth range for dive sites
        let minDepth = null;
        let maxDepth = null;
        if (spot.depthRange) {
          const depthMatch = spot.depthRange.match(/(\d+)-(\d+)/);
          if (depthMatch) {
            minDepth = parseInt(depthMatch[1]);
            maxDepth = parseInt(depthMatch[2]);
          }
        }

        const values = [
          islandGuideId,
          spot.name,
          spot.slug,
          spot.spotType,
          spot.latitude,
          spot.longitude,
          spot.bestSeason,
          mappedDifficulty,
          spot.description,
          minDepth,
          maxDepth,
        ];

        await connection.query(query, values);
        console.log(`✅ Inserted: ${spot.name} (${spot.spotType})`);
        insertedCount++;
      } catch (error) {
        console.error(`❌ Error inserting activity spot ${spot.name}:`, error.message);
      }
    }

    console.log(`\n📊 Seeding Summary:`);
    console.log(`✅ Inserted: ${insertedCount} activity spots`);
    console.log(`⏭️  Skipped: ${skippedCount} activity spots`);
    console.log(`📈 Total: ${insertedCount + skippedCount} activity spots processed`);

  } catch (error) {
    console.error('Database error:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

seedActivitySpots();
