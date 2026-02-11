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
    name: "Pasta Point",
    slug: "pasta-point",
    spotType: "surf_spot",
    islandSlug: "thulusdhoo",
    latitude: 4.335,
    longitude: 73.555,
    bestSeason: "Mar-Oct",
    difficulty: "Intermediate",
    description: "Fun and playful wave",
  },
  {
    name: "Riptide",
    slug: "riptide",
    spotType: "surf_spot",
    islandSlug: "dhiffushi",
    latitude: 4.320,
    longitude: 73.590,
    bestSeason: "Mar-Oct",
    difficulty: "Advanced",
    description: "Powerful barrel section",
  },
  {
    name: "Sultans",
    slug: "sultans",
    spotType: "surf_spot",
    islandSlug: "guraidhoo",
    latitude: 4.300,
    longitude: 73.580,
    bestSeason: "Mar-Oct",
    difficulty: "Intermediate",
    description: "User-friendly reef break",
  },
  {
    name: "Jailbreaks",
    slug: "jailbreaks",
    spotType: "surf_spot",
    islandSlug: "dhigurah",
    latitude: 3.650,
    longitude: 72.950,
    bestSeason: "Mar-Oct",
    difficulty: "Intermediate",
    description: "Consistent right",
  },
  {
    name: "Foxys",
    slug: "foxys",
    spotType: "surf_spot",
    islandSlug: "felidhoo",
    latitude: 3.560,
    longitude: 73.520,
    bestSeason: "Mar-Oct",
    difficulty: "Intermediate",
    description: "Fun and forgiving wave",
  },
  {
    name: "Yeyye",
    slug: "yeyye",
    spotType: "surf_spot",
    islandSlug: "gan",
    latitude: -0.690,
    longitude: 73.150,
    bestSeason: "Mar-Oct",
    difficulty: "Advanced",
    description: "Heavy southern reef break",
  },
  {
    name: "Two Ways",
    slug: "two-ways",
    spotType: "surf_spot",
    islandSlug: "maradhoo",
    latitude: -0.610,
    longitude: 73.140,
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
    difficulty: "Beginner",
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
    difficulty: "Beginner",
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
    difficulty: "Beginner",
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
  {
    name: "Banana Reef",
    slug: "banana-reef-dive",
    spotType: "dive_site",
    islandSlug: "banana-reef",
    latitude: 4.290,
    longitude: 73.280,
    bestSeason: "All Year",
    difficulty: "Intermediate",
    description: "Reef with abundant marine life",
    depthRange: "5-25m",
  },
  // Snorkeling Spots
  {
    name: "Maafushi House Reef",
    slug: "maafushi-house-reef",
    spotType: "snorkeling_spot",
    islandSlug: "maafushi",
    latitude: 4.400,
    longitude: 73.410,
    bestSeason: "All Year",
    difficulty: "Beginner",
    description: "Easy access house reef with colorful fish",
  },
  {
    name: "Thulusdhoo Reef",
    slug: "thulusdhoo-reef",
    spotType: "snorkeling_spot",
    islandSlug: "thulusdhoo",
    latitude: 4.330,
    longitude: 73.560,
    bestSeason: "All Year",
    difficulty: "Beginner",
    description: "Shallow reef perfect for beginners",
  },
  {
    name: "Dhigurah Reef",
    slug: "dhigurah-reef",
    spotType: "snorkeling_spot",
    islandSlug: "dhigurah",
    latitude: 3.650,
    longitude: 72.950,
    bestSeason: "All Year",
    difficulty: "Beginner",
    description: "Pristine reef with sea turtles",
  },
  {
    name: "Fulidhoo Reef",
    slug: "fulidhoo-reef",
    spotType: "snorkeling_spot",
    islandSlug: "fulidhoo",
    latitude: 3.850,
    longitude: 72.820,
    bestSeason: "All Year",
    difficulty: "Beginner",
    description: "Protected reef with calm waters",
  },
  {
    name: "Veligandu Reef",
    slug: "veligandu-reef",
    spotType: "snorkeling_spot",
    islandSlug: "veligandu",
    latitude: 5.050,
    longitude: 73.050,
    bestSeason: "All Year",
    difficulty: "Beginner",
    description: "Luxury resort reef with excellent visibility",
  },
  {
    name: "Rasdhoo Reef",
    slug: "rasdhoo-reef",
    spotType: "snorkeling_spot",
    islandSlug: "rasdhoo",
    latitude: 4.261,
    longitude: 72.995,
    bestSeason: "All Year",
    difficulty: "Intermediate",
    description: "Deeper reef with pelagic fish",
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
