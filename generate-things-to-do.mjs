import { invokeLLM } from "./server/_core/llm.js";
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "islenomads",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function getIslands() {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(
      "SELECT id, name, atoll, overview FROM island_guides WHERE contentType = 'island' ORDER BY name"
    );
    return rows;
  } finally {
    connection.release();
  }
}

async function generateThingsToDo(island) {
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
    const activities = JSON.parse(jsonStr);
    return activities;
  } catch (error) {
    console.error(`Error generating content for ${island.name}:`, error);
    return null;
  }
}

async function updateIslandThingsToDo(islandId, activities) {
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
  }
}

async function main() {
  console.log("Fetching islands...");
  const islands = await getIslands();
  console.log(`Found ${islands.length} islands to update`);

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
