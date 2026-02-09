import mysql from "mysql2/promise";
import { createPool } from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("DATABASE_URL environment variable is not set");
  process.exit(1);
}

// Parse the database URL
const url = new URL(DATABASE_URL);
const config = {
  host: url.hostname,
  user: url.username,
  password: url.password,
  database: url.pathname.slice(1),
  port: url.port || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
    rejectUnauthorized: false,
  },
};

const transports = [
  // Hub routes (Male City connections)
  {
    name: "Thoddoo to Male Ferry",
    fromLocation: "thoddoo-island",
    toLocation: "male",
    transportType: "ferry",
    durationMinutes: 120,
    priceUSD: 8,
    operator: "Public Ferry",
    capacity: 80,
    published: 1,
  },
  {
    name: "Mahibadhoo to Male Ferry",
    fromLocation: "mahibadhoo-island",
    toLocation: "male",
    transportType: "ferry",
    durationMinutes: 180,
    priceUSD: 12,
    operator: "Public Ferry",
    capacity: 80,
    published: 1,
  },
  {
    name: "Rasdhoo to Male Ferry",
    fromLocation: "rasdhoo-island",
    toLocation: "male",
    transportType: "ferry",
    durationMinutes: 300,
    priceUSD: 15,
    operator: "Public Ferry",
    capacity: 80,
    published: 1,
  },
  {
    name: "Kaashidhoo to Male Ferry",
    fromLocation: "kaashidhoo-island",
    toLocation: "male",
    transportType: "ferry",
    durationMinutes: 240,
    priceUSD: 14,
    operator: "Public Ferry",
    capacity: 80,
    published: 1,
  },
  {
    name: "Dhiffushi to Male Ferry",
    fromLocation: "dhiffushi-island",
    toLocation: "male",
    transportType: "ferry",
    durationMinutes: 90,
    priceUSD: 5,
    operator: "Public Ferry",
    capacity: 100,
    published: 1,
  },
  {
    name: "Guraidhoo to Male Ferry",
    fromLocation: "guraidhoo-island",
    toLocation: "male",
    transportType: "ferry",
    durationMinutes: 60,
    priceUSD: 4,
    operator: "Public Ferry",
    capacity: 100,
    published: 1,
  },
  {
    name: "Maafushi to Male Ferry",
    fromLocation: "maafushi-island",
    toLocation: "male",
    transportType: "ferry",
    durationMinutes: 75,
    priceUSD: 5,
    operator: "Public Ferry",
    capacity: 100,
    published: 1,
  },
  {
    name: "Ukulhas to Male Ferry",
    fromLocation: "ukulhas-island",
    toLocation: "male",
    transportType: "ferry",
    durationMinutes: 120,
    priceUSD: 8,
    operator: "Public Ferry",
    capacity: 80,
    published: 1,
  },
  {
    name: "Dhigurah to Male Ferry",
    fromLocation: "dhigurah-island",
    toLocation: "male",
    transportType: "ferry",
    durationMinutes: 150,
    priceUSD: 10,
    operator: "Public Ferry",
    capacity: 80,
    published: 1,
  },
  {
    name: "Dharavandhoo to Male Ferry",
    fromLocation: "dharavandhoo-island",
    toLocation: "male",
    transportType: "ferry",
    durationMinutes: 180,
    priceUSD: 12,
    operator: "Public Ferry",
    capacity: 80,
    published: 1,
  },
  {
    name: "Eydhafushi to Male Ferry",
    fromLocation: "eydhafushi-island",
    toLocation: "male",
    transportType: "ferry",
    durationMinutes: 240,
    priceUSD: 14,
    operator: "Public Ferry",
    capacity: 80,
    published: 1,
  },
  {
    name: "Hangnaameedhoo to Male Ferry",
    fromLocation: "hangnaameedhoo-island",
    toLocation: "male",
    transportType: "ferry",
    durationMinutes: 300,
    priceUSD: 18,
    operator: "Public Ferry",
    capacity: 80,
    published: 1,
  },
  {
    name: "Gan to Male Ferry",
    fromLocation: "gan-island",
    toLocation: "male",
    transportType: "ferry",
    durationMinutes: 480,
    priceUSD: 25,
    operator: "Public Ferry",
    capacity: 80,
    published: 1,
  },
  {
    name: "Funadhoo to Male Ferry",
    fromLocation: "funadhoo-island",
    toLocation: "male",
    transportType: "ferry",
    durationMinutes: 360,
    priceUSD: 20,
    operator: "Public Ferry",
    capacity: 80,
    published: 1,
  },
  {
    name: "Felidhoo to Male Ferry",
    fromLocation: "felidhoo-island",
    toLocation: "male",
    transportType: "ferry",
    durationMinutes: 330,
    priceUSD: 19,
    operator: "Public Ferry",
    capacity: 80,
    published: 1,
  },
  {
    name: "Naifaru to Male Ferry",
    fromLocation: "naifaru-island",
    toLocation: "male",
    transportType: "ferry",
    durationMinutes: 300,
    priceUSD: 18,
    operator: "Public Ferry",
    capacity: 80,
    published: 1,
  },
  {
    name: "Meedhoo to Male Ferry",
    fromLocation: "meedhoo-island",
    toLocation: "male",
    transportType: "ferry",
    durationMinutes: 360,
    priceUSD: 20,
    operator: "Public Ferry",
    capacity: 80,
    published: 1,
  },
  {
    name: "Velidhoo to Male Ferry",
    fromLocation: "velidhoo-island",
    toLocation: "male",
    transportType: "ferry",
    durationMinutes: 300,
    priceUSD: 18,
    operator: "Public Ferry",
    capacity: 80,
    published: 1,
  },
  {
    name: "Isdhoo to Male Ferry",
    fromLocation: "isdhoo-island",
    toLocation: "male",
    transportType: "ferry",
    durationMinutes: 330,
    priceUSD: 19,
    operator: "Public Ferry",
    capacity: 80,
    published: 1,
  },
  {
    name: "Kudahuvadhoo to Male Ferry",
    fromLocation: "dhaalu-kudahuvadhoo",
    toLocation: "male",
    transportType: "ferry",
    durationMinutes: 360,
    priceUSD: 20,
    operator: "Public Ferry",
    capacity: 80,
    published: 1,
  },
  {
    name: "Hanimadhoo to Male Ferry",
    fromLocation: "haa-alif-hanimadhoo",
    toLocation: "male",
    transportType: "ferry",
    durationMinutes: 360,
    priceUSD: 20,
    operator: "Public Ferry",
    capacity: 80,
    published: 1,
  },
  {
    name: "Kulhudhuffushi to Male Ferry",
    fromLocation: "haa-dhaalu-kulhudhuffushi",
    toLocation: "male",
    transportType: "ferry",
    durationMinutes: 420,
    priceUSD: 22,
    operator: "Public Ferry",
    capacity: 80,
    published: 1,
  },
  // Speedboat routes
  {
    name: "Male to Maafushi Speedboat",
    fromLocation: "male",
    toLocation: "maafushi-island",
    transportType: "speedboat",
    durationMinutes: 45,
    priceUSD: 12,
    operator: "Speedboat Express",
    capacity: 30,
    published: 1,
  },
  {
    name: "Male to Dhigurah Speedboat",
    fromLocation: "male",
    toLocation: "dhigurah-island",
    transportType: "speedboat",
    durationMinutes: 60,
    priceUSD: 15,
    operator: "Speedboat Express",
    capacity: 30,
    published: 1,
  },
  {
    name: "Male to Ukulhas Speedboat",
    fromLocation: "male",
    toLocation: "ukulhas-island",
    transportType: "speedboat",
    durationMinutes: 50,
    priceUSD: 14,
    operator: "Speedboat Express",
    capacity: 30,
    published: 1,
  },
  {
    name: "Dharavandhoo to Eydhafushi Ferry",
    fromLocation: "dharavandhoo-island",
    toLocation: "eydhafushi-island",
    transportType: "ferry",
    durationMinutes: 60,
    priceUSD: 4,
    operator: "Public Ferry",
    capacity: 80,
    published: 1,
  },
  {
    name: "Maafushi to Dhigurah Ferry",
    fromLocation: "maafushi-island",
    toLocation: "dhigurah-island",
    transportType: "ferry",
    durationMinutes: 90,
    priceUSD: 6,
    operator: "Public Ferry",
    capacity: 80,
    published: 1,
  },
  {
    name: "Ukulhas to Rasdhoo Ferry",
    fromLocation: "ukulhas-island",
    toLocation: "rasdhoo-island",
    transportType: "ferry",
    durationMinutes: 60,
    priceUSD: 4,
    operator: "Public Ferry",
    capacity: 80,
    published: 1,
  },
];

async function seedDatabase() {
  let connection;
  try {
    // Use createPool for better connection handling
    const pool = createPool(config);
    connection = await pool.getConnection();
    console.log("✅ Connected to database");

    // Clear existing transports
    await connection.execute("DELETE FROM transports");
    console.log("✅ Cleared existing transports");

    // Insert new transports
    for (const transport of transports) {
      const query = `
        INSERT INTO transports (
          name, fromLocation, toLocation, transportType, durationMinutes,
          priceUSD, capacity, operator, published, createdAt, updatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      `;
      await connection.execute(query, [
        transport.name,
        transport.fromLocation,
        transport.toLocation,
        transport.transportType,
        transport.durationMinutes,
        transport.priceUSD,
        transport.capacity,
        transport.operator,
        transport.published,
      ]);
    }

    console.log(`✅ Seeded ${transports.length} transports`);
    console.log("✅ Database seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.release();
    }
  }
}

seedDatabase().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
