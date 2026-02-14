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

const islandsData = [
  {
    name: "Himmafushi",
    slug: "himmafushi",
    atoll: "Kaafu Atoll",
    overview: "Surfing hotspot with two daily speedboat services and excellent wave breaks for all levels",
  },
  {
    name: "Omadhoo",
    slug: "omadhoo",
    atoll: "Alif Dhaal Atoll",
    overview: "Underrated gem with excellent tourist beach, long house reef, and affordable accommodations",
  },
  {
    name: "Feridhoo",
    slug: "feridhoo",
    atoll: "Alif Alif Atoll",
    overview: "Remote island with beautiful reef featuring 80% live corals and pristine diving conditions",
  },
  {
    name: "Dhangethi",
    slug: "dhangethi",
    atoll: "Alif Dhaal Atoll",
    overview: "Water sports and diving paradise with multiple dive sites and excellent reef access",
  },
  {
    name: "Mathiveri",
    slug: "mathiveri",
    atoll: "Alif Alif Atoll",
    overview: "Small intimate island with one tourist beach and nearby uninhabited islands for exploration",
  },
  {
    name: "Maamigili",
    slug: "maamigili",
    atoll: "Alif Dhaal Atoll",
    overview: "Excellent location for whale shark encounters with high success rates year-round",
  },
  {
    name: "Gulhi",
    slug: "gulhi",
    atoll: "Kaafu Atoll",
    overview: "Local island with authentic Maldivian culture and excellent house reef for snorkeling",
  },
  {
    name: "Goidhoo",
    slug: "goidhoo",
    atoll: "Baa Atoll",
    overview: "Peaceful local island with access to Hanifaru Bay and excellent diving opportunities",
  },
  {
    name: "Fulhadhoo",
    slug: "fulhadhoo",
    atoll: "Baa Atoll",
    overview: "Remote island in Baa Atoll with pristine reefs and limited tourist infrastructure",
  },
  {
    name: "Fehendhoo",
    slug: "fehendhoo",
    atoll: "Lhaviyani Atoll",
    overview: "Local island in the Lhaviyani Atoll region with authentic island experience",
  },
  {
    name: "Hanimadhoo",
    slug: "hanimadhoo",
    atoll: "Haa Alif Atoll",
    overview: "Northernmost local island with unique geography and excellent diving conditions",
  },
  {
    name: "Fuvahmulah",
    slug: "fuvahmulah",
    atoll: "Seenu Atoll",
    overview: "Southernmost island famous for tiger shark diving and unique geological features",
  },
];

async function seedIslands() {
  let connection;
  try {
    connection = await mysql.createConnection(config);
    console.log('Connected to database');

    // Get all atolls first to map atoll names to IDs
    const [atolls] = await connection.query('SELECT id, name, slug FROM atolls');
    const atollMap = {};
    atolls.forEach(atoll => {
      atollMap[atoll.name] = atoll.id;
      const slugName = atoll.name.toLowerCase().replace(/\s+/g, '-');
      atollMap[slugName] = atoll.id;
    });

    console.log(`Found ${atolls.length} atolls in database`);
    let insertedCount = 0;
    let skippedCount = 0;

    for (const island of islandsData) {
      const atollId = atollMap[island.atoll];
      if (!atollId) {
        console.log(`⚠️  Skipped: ${island.name} (Atoll not found: ${island.atoll})`);
        skippedCount++;
        continue;
      }

      try {
        // Check if island already exists
        const [existing] = await connection.query(
          'SELECT id FROM island_guides WHERE name = ? AND atoll = ?',
          [island.name, island.atoll]
        );

        if (existing.length > 0) {
          console.log(`⏭️  Already exists: ${island.name} (${island.atoll})`);
          skippedCount++;
          continue;
        }

        // Insert the island
        await connection.query(
          `INSERT INTO island_guides (name, slug, atoll, overview, published)
           VALUES (?, ?, ?, ?, 1)`,
          [island.name, island.slug, island.atoll, island.overview]
        );
        console.log(`✅ Inserted: ${island.name} (${island.atoll})`);
        insertedCount++;
      } catch (error) {
        console.error(`❌ Error inserting ${island.name}:`, error.message);
        skippedCount++;
      }
    }

    console.log('\n📊 Seeding Summary:');
    console.log(`✅ Inserted: ${insertedCount} islands`);
    console.log(`⏭️  Skipped: ${skippedCount} islands`);
    console.log(`📈 Total: ${islandsData.length} islands processed`);

    await connection.end();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

seedIslands();
