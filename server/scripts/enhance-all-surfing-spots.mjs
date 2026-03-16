import { invokeLLM } from '../_core/llm.js';
import mysql from 'mysql2/promise';

const connection = await mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'islenomads',
});

// Get all surfing spots from database
const [spots] = await connection.execute(
  'SELECT id, name, difficulty, waveHeight, bestSeason FROM activity_spots WHERE spotType = "surf_spot" ORDER BY name'
);

console.log(`🏄 Starting enhancement of ${spots.length} surfing spots...\n`);

let updated = 0;
let failed = 0;

for (const spot of spots) {
  console.log(`Processing: ${spot.name} (${spot.difficulty})...`);
  
  const prompt = `Create a detailed and engaging description for a surfing spot in the Maldives:

Name: ${spot.name}
Difficulty Level: ${spot.difficulty}
Wave Height: ${spot.waveHeight || 'Variable'}
Best Season: ${spot.bestSeason || 'Year-round'}

Write a comprehensive description (150-200 words) that includes:
1. Wave characteristics and conditions
2. Crowd level and atmosphere
3. Facilities and amenities nearby
4. Best time to visit
5. Tips for surfers
6. Marine life and safety considerations

Make it engaging and informative for both beginner and experienced surfers.`;

  try {
    const response = await invokeLLM({
      messages: [
        { role: 'system', content: 'You are an expert surfing guide for the Maldives. Provide detailed, accurate, and engaging descriptions of surfing spots.' },
        { role: 'user', content: prompt }
      ]
    });

    const description = response.choices[0].message.content;
    
    // Update database
    await connection.execute(
      'UPDATE activity_spots SET description = ? WHERE id = ?',
      [description, spot.id]
    );
    
    updated++;
    console.log(`✅ Updated: ${spot.name}\n`);
  } catch (error) {
    failed++;
    console.error(`❌ Error processing ${spot.name}:`, error.message, '\n');
  }
}

console.log(`\n✅ Surfing spot descriptions enhanced successfully!`);
console.log(`📊 Updated: ${updated}/${spots.length} spots`);
console.log(`❌ Failed: ${failed}/${spots.length} spots`);
await connection.end();
