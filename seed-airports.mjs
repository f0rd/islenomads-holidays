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

// Airport data based on flightRoutes.ts
const airportsData = [
  {
    name: "Malé International Airport",
    code: "MLE",
    slug: "male-international-airport",
    latitude: 4.1924,
    longitude: 73.5373,
    atoll: "Kaafu Atoll",
  },
  {
    name: "Dharavandhoo Airport",
    code: "DRV",
    slug: "dharavandhoo-airport",
    latitude: 5.2667,
    longitude: 73.4167,
    atoll: "Baa Atoll",
  },
  {
    name: "Maamigili Airport",
    code: "VAM",
    slug: "maamigili-airport",
    latitude: 3.8333,
    longitude: 72.8333,
    atoll: "Alifu Dhaalu Atoll",
  },
  {
    name: "Ifuru Airport",
    code: "IFU",
    slug: "ifuru-airport",
    latitude: 6.0,
    longitude: 73.0,
    atoll: "Raa Atoll",
  },
  {
    name: "Kudahuvadhoo Airport",
    code: "DDD",
    slug: "kudahuvadhoo-airport",
    latitude: 2.6667,
    longitude: 72.8333,
    atoll: "Dhaalu Atoll",
  },
  {
    name: "Madivaru Airport",
    code: "LMV",
    slug: "madivaru-airport",
    latitude: 5.5,
    longitude: 72.5,
    atoll: "Lhaviyani Atoll",
  },
  {
    name: "Maafaru Airport",
    code: "NMF",
    slug: "maafaru-airport",
    latitude: 6.5833,
    longitude: 73.4167,
    atoll: "Noonu Atoll",
  },
  {
    name: "Funadhoo Airport",
    code: "FND",
    slug: "funadhoo-airport",
    latitude: 6.9167,
    longitude: 72.8333,
    atoll: "Shaviyani Atoll",
  },
  {
    name: "Thimarafushi Airport",
    code: "TMF",
    slug: "thimarafushi-airport",
    latitude: 4.0,
    longitude: 72.5,
    atoll: "Thaa Atoll",
  },
  {
    name: "Kulhuduffushi Airport",
    code: "HDK",
    slug: "kulhuduffushi-airport",
    latitude: 6.9333,
    longitude: 73.0,
    atoll: "Haa Dhaal Atoll",
  },
  {
    name: "Hanimadhoo Airport",
    code: "HAQ",
    slug: "hanimadhoo-airport",
    latitude: 6.7667,
    longitude: 73.1833,
    atoll: "Haa Alif Atoll",
  },
  {
    name: "Maavarulu Airport",
    code: "RUL",
    slug: "maavarulu-airport",
    latitude: 0.5,
    longitude: 72.5,
    atoll: "Gaaf Dhaal Atoll",
  },
  {
    name: "Koodoo Airport",
    code: "GKK",
    slug: "koodoo-airport",
    latitude: 1.0,
    longitude: 73.0,
    atoll: "Gaafu Alif Atoll",
  },
  {
    name: "Kaadedhoo Airport",
    code: "KDM",
    slug: "kaadedhoo-airport",
    latitude: 0.6667,
    longitude: 72.8333,
    atoll: "Gaafu Dhaal Atoll",
  },
  {
    name: "Kadhdhoo Airport",
    code: "KDO",
    slug: "kadhdhoo-airport",
    latitude: -0.6667,
    longitude: 73.5,
    atoll: "Laamu Atoll",
  },
  {
    name: "Fuvahmulah Airport",
    code: "FVM",
    slug: "fuvahmulah-airport",
    latitude: -0.3,
    longitude: 73.4,
    atoll: "Gnaviyani Atoll",
  },
  {
    name: "Gan International Airport",
    code: "GAN",
    slug: "gan-airport",
    latitude: -0.6942,
    longitude: 73.1589,
    atoll: "Addu Atoll",
  },
  {
    name: "Hoarafushi Airport",
    code: "HRF",
    slug: "hoarafushi-airport",
    latitude: 6.6,
    longitude: 73.0,
    atoll: "Haa Alif Atoll",
  },
];

async function seedAirports() {
  const connection = await mysql.createConnection(config);

  try {
    console.log('Starting airport seeding...');

    // Check existing airports
    const [existing] = await connection.query('SELECT COUNT(*) as count FROM places WHERE type = "airport"');
    console.log(`Existing airports in places table: ${existing[0].count}`);

    // Insert airports
    let inserted = 0;
    for (const airport of airportsData) {
      try {
        await connection.query(
          `INSERT INTO places (name, slug, code, type, latitude, longitude, createdAt, updatedAt) 
           VALUES (?, ?, ?, 'airport', ?, ?, NOW(), NOW())
           ON DUPLICATE KEY UPDATE updatedAt = NOW()`,
          [airport.name, airport.slug, airport.code, airport.latitude, airport.longitude]
        );
        inserted++;
        console.log(`✓ Added: ${airport.name} (${airport.code})`);
      } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
          console.log(`⊘ Already exists: ${airport.name} (${airport.code})`);
        } else {
          console.error(`✗ Error adding ${airport.name}:`, error.message);
        }
      }
    }

    console.log(`\n✓ Seeding complete! Inserted/updated ${inserted} airports.`);

    // Verify
    const [final] = await connection.query('SELECT COUNT(*) as count FROM places WHERE type = "airport"');
    console.log(`Total airports in places table: ${final[0].count}`);

  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

seedAirports();
