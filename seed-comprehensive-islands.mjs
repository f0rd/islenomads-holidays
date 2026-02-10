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
    name: "Maafushi",
    slug: "maafushi",
    atoll: "Kaafu Atoll",
    contentType: "island",
    overview: "Most popular budget island near Malé with easy access and excellent amenities",
  },
  {
    name: "Fulidhoo",
    slug: "fulidhoo",
    atoll: "Vaavu Atoll",
    contentType: "island",
    overview: "Easy ferry access and bikini beach, perfect for budget travelers",
  },
  {
    name: "Dhigurah",
    slug: "dhigurah",
    atoll: "Alif Dhaal Atoll",
    contentType: "island",
    overview: "Long sandy island with rich marine life and excellent diving",
  },
  {
    name: "Ukulhas",
    slug: "ukulhas",
    atoll: "Alif Alif Atoll",
    contentType: "island",
    overview: "Clean island with great beaches and authentic local culture",
  },
  {
    name: "Dharavandhoo",
    slug: "dharavandhoo",
    atoll: "Baa Atoll",
    contentType: "island",
    overview: "Gateway to Hanifaru Bay and UNESCO Biosphere Reserve",
  },
  {
    name: "Thoddoo",
    slug: "thoddoo",
    atoll: "Alif Alif Atoll",
    contentType: "island",
    overview: "Famous for agriculture and beautiful lagoons",
  },
  {
    name: "Guraidhoo",
    slug: "guraidhoo",
    atoll: "Kaafu Atoll",
    contentType: "island",
    overview: "Surf and local culture hub with excellent reef breaks",
  },
  {
    name: "Dhiffushi",
    slug: "dhiffushi",
    atoll: "Kaafu Atoll",
    contentType: "island",
    overview: "Budget surf island with consistent waves and local charm",
  },
  {
    name: "Rasdhoo",
    slug: "rasdhoo",
    atoll: "Alif Alif Atoll",
    contentType: "island",
    overview: "Diving hotspot with pristine coral reefs and marine life",
  },
  {
    name: "Hulhumalé",
    slug: "hulhumale",
    atoll: "Kaafu Atoll",
    contentType: "island",
    overview: "Urban island near airport with modern amenities and services",
  },
  {
    name: "Kudahuvadhoo",
    slug: "kudahuvadhoo",
    atoll: "Dhaalu Atoll",
    contentType: "island",
    overview: "Administrative island with rich local culture and heritage",
  },
  {
    name: "Naifaru",
    slug: "naifaru",
    atoll: "Lhaviyani Atoll",
    contentType: "island",
    overview: "Busy island with excellent services and local amenities",
  },
  {
    name: "Fodhdhoo",
    slug: "fodhdhoo",
    atoll: "Noonu Atoll",
    contentType: "island",
    overview: "Quiet eco island with pristine natural environment",
  },
  {
    name: "Felidhoo",
    slug: "felidhoo",
    atoll: "Vaavu Atoll",
    contentType: "island",
    overview: "Local life and diving opportunities with authentic experiences",
  },
  {
    name: "Muli",
    slug: "muli",
    atoll: "Meemu Atoll",
    contentType: "island",
    overview: "Peaceful local island with beautiful beaches and culture",
  },
  {
    name: "Kolhufushi",
    slug: "kolhufushi",
    atoll: "Thaa Atoll",
    contentType: "island",
    overview: "Traditional fishing island with authentic Maldivian heritage",
  },
  {
    name: "Gan",
    slug: "gan",
    atoll: "Seenu Atoll",
    contentType: "island",
    overview: "Addu city heritage island with WWII history and culture",
  },
  {
    name: "Feidhoo",
    slug: "feidhoo",
    atoll: "Seenu Atoll",
    contentType: "island",
    overview: "Connected to Addu city with local amenities and services",
  },
  {
    name: "Maradhoo",
    slug: "maradhoo",
    atoll: "Seenu Atoll",
    contentType: "island",
    overview: "Residential island with local community and culture",
  },
  {
    name: "Hithadhoo",
    slug: "hithadhoo",
    atoll: "Seenu Atoll",
    contentType: "island",
    overview: "Largest southern city island with heritage and modern services",
  },
  {
    name: "Veymandoo",
    slug: "veymandoo",
    atoll: "Thaa Atoll",
    contentType: "island",
    overview: "Quiet and scenic island with peaceful atmosphere",
  },
  {
    name: "Madifushi",
    slug: "madifushi",
    atoll: "Thaa Atoll",
    contentType: "island",
    overview: "Local island with beautiful beaches and authentic culture",
  },
  {
    name: "Inguraidhoo",
    slug: "inguraidhoo",
    atoll: "Raa Atoll",
    contentType: "island",
    overview: "Community island with local charm and hospitality",
  },
  {
    name: "Alifushi",
    slug: "alifushi",
    atoll: "Raa Atoll",
    contentType: "island",
    overview: "Famous boat-building island with maritime heritage",
  },
  {
    name: "Ungoofaaru",
    slug: "ungoofaaru",
    atoll: "Raa Atoll",
    contentType: "island",
    overview: "Administrative capital of Raa with excellent services",
  },
];

async function seedIslands() {
  let connection;
  try {
    connection = await mysql.createConnection(config);
    console.log('Connected to database');

    let insertedCount = 0;
    let skippedCount = 0;

    for (const island of islandsData) {
      try {
        // Check if island already exists
        const [existing] = await connection.query(
          'SELECT id FROM island_guides WHERE slug = ?',
          [island.slug]
        );

        if (existing.length > 0) {
          console.log(`ℹ️  Island already exists: ${island.name}`);
          skippedCount++;
          continue;
        }

        // Insert island guide
        const query = `
          INSERT INTO island_guides (
            name, slug, atoll, contentType, overview, published, createdAt, updatedAt
          ) VALUES (?, ?, ?, ?, ?, 1, NOW(), NOW())
        `;

        const values = [
          island.name,
          island.slug,
          island.atoll,
          island.contentType,
          island.overview,
        ];

        await connection.query(query, values);
        console.log(`✅ Inserted: ${island.name} (${island.atoll})`);
        insertedCount++;
      } catch (error) {
        console.error(`❌ Error inserting island ${island.name}:`, error.message);
      }
    }

    console.log(`\n📊 Seeding Summary:`);
    console.log(`✅ Inserted: ${insertedCount} islands`);
    console.log(`⏭️  Skipped: ${skippedCount} islands`);
    console.log(`📈 Total: ${insertedCount + skippedCount} islands processed`);

  } catch (error) {
    console.error('Database error:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

seedIslands();
