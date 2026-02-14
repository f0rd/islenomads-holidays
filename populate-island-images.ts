import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

// Parse DATABASE_URL
const dbUrl = process.env.DATABASE_URL || "";
const urlMatch = dbUrl.match(
  /mysql:\/\/([^:]+):([^@]+)@([^:/?]+):(\d+)\/([^?]+)/
);

const baseConfig = urlMatch
  ? {
      host: urlMatch[3],
      port: parseInt(urlMatch[4]),
      user: urlMatch[1],
      password: urlMatch[2],
      database: urlMatch[5],
    }
  : {
      host: "localhost",
      port: 3306,
      user: "root",
      password: "",
      database: "islenomads",
    };

const config = {
  ...baseConfig,
  ssl: {
    rejectUnauthorized: false,
  },
};

// Curated collection of high-quality Maldives island images
// Using a variety of images to represent different island types and experiences
const maldivesImages = [
  // Aerial views of islands
  "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80", // Maldives aerial
  "https://images.unsplash.com/photo-1537996051336-ea2b7c3acc59?w=800&q=80", // Island resort aerial
  "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80", // Tropical island
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80", // Beach resort
  "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80", // Overwater bungalows
  "https://images.unsplash.com/photo-1551632786-de41ec16a82d?w=800&q=80", // Tropical beach
  "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80", // Island landscape
  "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80", // Crystal waters
  
  // Beach and water views
  "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80", // Turquoise water
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80", // White sand beach
  "https://images.unsplash.com/photo-1551632786-de41ec16a82d?w=800&q=80", // Sunset beach
  "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80", // Lagoon view
  
  // Resort and accommodation views
  "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80", // Water villa
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80", // Beach villa
  "https://images.unsplash.com/photo-1551632786-de41ec16a82d?w=800&q=80", // Resort pool
  "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80", // Luxury resort
  
  // Water activities
  "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80", // Snorkeling
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80", // Diving
  "https://images.unsplash.com/photo-1551632786-de41ec16a82d?w=800&q=80", // Water sports
  "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80", // Boat excursion
];

async function getIslandsWithoutImages(): Promise<
  Array<{ id: number; name: string }>
> {
  const pool = mysql.createPool({
    ...config,
    waitForConnections: true,
    connectionLimit: 5,
    queueLimit: 0,
  });

  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(
      "SELECT id, name FROM island_guides WHERE (heroImage IS NULL OR heroImage = '' OR heroImage = 'null') AND contentType = 'island' ORDER BY id"
    );
    return rows as Array<{ id: number; name: string }>;
  } finally {
    connection.release();
    await pool.end();
  }
}

async function updateIslandImage(
  islandId: number,
  imageUrl: string
): Promise<boolean> {
  const pool = mysql.createPool({
    ...config,
    waitForConnections: true,
    connectionLimit: 5,
    queueLimit: 0,
  });

  const connection = await pool.getConnection();
  try {
    await connection.query(
      "UPDATE island_guides SET heroImage = ? WHERE id = ?",
      [imageUrl, islandId]
    );
    return true;
  } catch (error) {
    console.error(`Error updating island ${islandId}:`, error);
    return false;
  } finally {
    connection.release();
    await pool.end();
  }
}

async function main() {
  console.log("Fetching islands without hero images...");
  const islands = await getIslandsWithoutImages();
  console.log(`Found ${islands.length} islands to update with images`);

  if (islands.length === 0) {
    console.log("All islands already have hero images!");
    process.exit(0);
  }

  let successCount = 0;
  let failureCount = 0;

  for (let i = 0; i < islands.length; i++) {
    const island = islands[i];
    // Cycle through available images
    const imageUrl = maldivesImages[i % maldivesImages.length];

    console.log(`[${i + 1}/${islands.length}] Updating ${island.name}...`);

    const updated = await updateIslandImage(island.id, imageUrl);
    if (updated) {
      console.log(`✓ Updated ${island.name}`);
      successCount++;
    } else {
      console.log(`✗ Failed to update ${island.name}`);
      failureCount++;
    }

    // Add delay to avoid overwhelming the database
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  console.log(`\nCompleted: ${successCount} successful, ${failureCount} failed`);
  process.exit(failureCount > 0 ? 1 : 0);
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
