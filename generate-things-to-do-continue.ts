import { invokeLLM } from "./server/_core/llm";
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

// Parse DATABASE_URL: mysql://user:password@host:port/database?ssl=...
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

// Add SSL configuration for TiDB Cloud
const config = {
  ...baseConfig,
  ssl: {
    rejectUnauthorized: false,
  },
};

console.log(`Connecting to database: ${config.host}:${config.port}/${config.database}`);

interface Island {
  id: number;
  name: string;
  atoll: string;
  overview: string;
}

interface Activity {
  name: string;
  description: string;
  category:
    | "water-sports"
    | "diving"
    | "snorkeling"
    | "cultural"
    | "relaxation"
    | "food"
    | "nature"
    | "adventure";
  difficulty: "easy" | "moderate" | "challenging";
}

async function getIslands(): Promise<Island[]> {
  const pool = mysql.createPool({
    ...config,
    waitForConnections: true,
    connectionLimit: 5,
    queueLimit: 0,
  });

  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(
      "SELECT id, name, atoll, overview FROM island_guides WHERE contentType = 'island' AND topThingsToDo IS NULL OR topThingsToDo = '' ORDER BY name"
    );
    return rows as Island[];
  } finally {
    connection.release();
    await pool.end();
  }
}

async function generateThingsToDo(island: Island): Promise<Activity[] | null> {
  const prompt = `You are a travel guide expert for the Maldives. Generate a JSON array of 6-8 unique "things to do" activities for ${island.name} island in ${island.atoll} atoll.

Island Overview: ${island.overview || "A beautiful island in the Maldives"}

For each activity, provide:
- name: The activity name (e.g., "Snorkeling at House Reef")
- description: 1-2 sentences describing the activity
- category: One of: "water-sports", "diving", "snorkeling", "cultural", "relaxation", "food", "nature", "adventure"
- difficulty: One of: "easy", "moderate", "challenging"

Return ONLY a valid JSON array, no other text. Example format:
[
  {
    "name": "House Reef Snorkeling",
    "description": "Explore the vibrant coral gardens directly from the beach with abundant tropical fish.",
    "category": "snorkeling",
    "difficulty": "easy"
  }
]`;

  try {
    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content:
            "You are a travel guide expert. Return only valid JSON arrays, no markdown formatting or extra text.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const content = response.choices[0].message.content.trim();
    // Remove markdown code blocks if present
    const jsonStr = content
      .replace(/^```json\n?/, "")
      .replace(/\n?```$/, "")
      .trim();
    const activities = JSON.parse(jsonStr) as Activity[];
    return activities;
  } catch (error) {
    console.error(`Error generating content for ${island.name}:`, error);
    return null;
  }
}

async function updateIslandThingsToDo(
  islandId: number,
  activities: Activity[]
): Promise<boolean> {
  const pool = mysql.createPool({
    ...config,
    waitForConnections: true,
    connectionLimit: 5,
    queueLimit: 0,
  });

  const connection = await pool.getConnection();
  try {
    const activitiesJson = JSON.stringify(activities);
    await connection.query(
      "UPDATE island_guides SET topThingsToDo = ? WHERE id = ?",
      [activitiesJson, islandId]
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
  console.log("Fetching islands without things to do content...");
  const islands = await getIslands();
  console.log(`Found ${islands.length} islands to update`);

  if (islands.length === 0) {
    console.log("All islands already have things to do content!");
    process.exit(0);
  }

  let successCount = 0;
  let failureCount = 0;

  for (let i = 0; i < islands.length; i++) {
    const island = islands[i];
    console.log(
      `[${i + 1}/${islands.length}] Generating content for ${island.name}...`
    );

    const activities = await generateThingsToDo(island);

    if (activities && Array.isArray(activities)) {
      const updated = await updateIslandThingsToDo(island.id, activities);
      if (updated) {
        console.log(`✓ Updated ${island.name}`);
        successCount++;
      } else {
        console.log(`✗ Failed to update ${island.name}`);
        failureCount++;
      }
    } else {
      console.log(`✗ Failed to generate content for ${island.name}`);
      failureCount++;
    }

    // Add delay to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  console.log(`\nCompleted: ${successCount} successful, ${failureCount} failed`);
  process.exit(failureCount > 0 ? 1 : 0);
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
