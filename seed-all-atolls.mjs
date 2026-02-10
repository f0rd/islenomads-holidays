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

const atollsData = [
  {
    name: "Alif Alif Atoll",
    slug: "alif-alif-atoll",
    region: "North",
    description: "North Ari gateway with resorts and local islands",
    latitude: 4.175,
    longitude: 72.975,
    featured: 1,
  },
  {
    name: "Alif Dhaal Atoll",
    slug: "alif-dhaal-atoll",
    region: "North",
    description: "Famous for long islands and diving",
    latitude: 3.654,
    longitude: 72.955,
    featured: 1,
  },
  {
    name: "Baa Atoll",
    slug: "baa-atoll",
    region: "North",
    description: "UNESCO Biosphere Reserve with rich marine life",
    latitude: 5.223,
    longitude: 73.113,
    featured: 1,
  },
  {
    name: "Dhaalu Atoll",
    slug: "dhaalu-atoll",
    region: "Central",
    description: "Quiet atoll with growing local tourism",
    latitude: 2.835,
    longitude: 72.985,
    featured: 0,
  },
  {
    name: "Faafu Atoll",
    slug: "faafu-atoll",
    region: "Central",
    description: "Less visited atoll with pristine reefs",
    latitude: 3.073,
    longitude: 73.007,
    featured: 0,
  },
  {
    name: "Gaafu Alif Atoll",
    slug: "gaafu-alif-atoll",
    region: "South",
    description: "Southern atoll with deep channels",
    latitude: 0.705,
    longitude: 73.375,
    featured: 0,
  },
  {
    name: "Gaafu Dhaalu Atoll",
    slug: "gaafu-dhaalu-atoll",
    region: "South",
    description: "Remote southern atoll with strong culture",
    latitude: 0.290,
    longitude: 73.425,
    featured: 0,
  },
  {
    name: "Gnaviyani Atoll",
    slug: "gnaviyani-atoll",
    region: "South",
    description: "Smallest administrative atoll",
    latitude: -0.299,
    longitude: 73.423,
    featured: 0,
  },
  {
    name: "Haa Dhaalu Atoll",
    slug: "haa-dhaalu-atoll",
    region: "North",
    description: "Northern atoll with heritage islands",
    latitude: 6.578,
    longitude: 72.965,
    featured: 0,
  },
  {
    name: "Haa Alif Atoll",
    slug: "haa-alif-atoll",
    region: "North",
    description: "Northernmost atoll of the Maldives",
    latitude: 6.950,
    longitude: 73.200,
    featured: 0,
  },
  {
    name: "Kaafu Atoll",
    slug: "kaafu-atoll",
    region: "Central",
    description: "Home to Malé and major transport hub",
    latitude: 4.175,
    longitude: 73.500,
    featured: 1,
  },
  {
    name: "Laamu Atoll",
    slug: "laamu-atoll",
    region: "South",
    description: "Surf and eco-focused atoll",
    latitude: 1.825,
    longitude: 73.450,
    featured: 1,
  },
  {
    name: "Lhaviyani Atoll",
    slug: "lhaviyani-atoll",
    region: "North",
    description: "Known for dive sites and lagoons",
    latitude: 5.380,
    longitude: 73.490,
    featured: 1,
  },
  {
    name: "Meemu Atoll",
    slug: "meemu-atoll",
    region: "Central",
    description: "Quiet islands with local charm",
    latitude: 2.860,
    longitude: 73.580,
    featured: 0,
  },
  {
    name: "Noonu Atoll",
    slug: "noonu-atoll",
    region: "North",
    description: "Northern atoll with untouched reefs",
    latitude: 5.980,
    longitude: 73.330,
    featured: 0,
  },
  {
    name: "Raa Atoll",
    slug: "raa-atoll",
    region: "North",
    description: "Popular for diving and resorts",
    latitude: 5.620,
    longitude: 72.980,
    featured: 1,
  },
  {
    name: "Seenu Atoll",
    slug: "seenu-atoll",
    region: "South",
    description: "Addu City and WWII heritage",
    latitude: -0.640,
    longitude: 73.150,
    featured: 1,
  },
  {
    name: "Shaviyani Atoll",
    slug: "shaviyani-atoll",
    region: "North",
    description: "Developing local island tourism",
    latitude: 6.260,
    longitude: 73.000,
    featured: 0,
  },
  {
    name: "Thaa Atoll",
    slug: "thaa-atoll",
    region: "Central",
    description: "Remote and culturally rich atoll",
    latitude: 2.300,
    longitude: 73.050,
    featured: 0,
  },
  {
    name: "Vaavu Atoll",
    slug: "vaavu-atoll",
    region: "Central",
    description: "Closest diving atoll to Malé",
    latitude: 3.625,
    longitude: 73.433,
    featured: 1,
  },
];

async function seedAtolls() {
  let connection;
  try {
    connection = await mysql.createConnection(config);
    console.log('Connected to database');

    let insertedCount = 0;
    let skippedCount = 0;

    for (const atoll of atollsData) {
      try {
        // Check if atoll already exists
        const [existing] = await connection.query(
          'SELECT id FROM atolls WHERE slug = ?',
          [atoll.slug]
        );

        if (existing.length > 0) {
          console.log(`ℹ️  Atoll already exists: ${atoll.name}`);
          skippedCount++;
          continue;
        }

        // Insert atoll
        const query = `
          INSERT INTO atolls (
            name, slug, region, description, published, createdAt, updatedAt
          ) VALUES (?, ?, ?, ?, 1, NOW(), NOW())
        `;

        const values = [
          atoll.name,
          atoll.slug,
          atoll.region,
          atoll.description,
        ];

        await connection.query(query, values);
        console.log(`✅ Inserted: ${atoll.name} (${atoll.region})`);
        insertedCount++;
      } catch (error) {
        console.error(`❌ Error inserting atoll ${atoll.name}:`, error.message);
      }
    }

    console.log(`\n📊 Seeding Summary:`);
    console.log(`✅ Inserted: ${insertedCount} atolls`);
    console.log(`❗️  Skipped: ${skippedCount} atolls`);
    console.log(`📊 Total: ${insertedCount + skippedCount} atolls processed`);

  } catch (error) {
    console.error('Database error:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

seedAtolls();
