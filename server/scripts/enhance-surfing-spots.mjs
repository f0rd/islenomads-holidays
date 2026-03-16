import { invokeLLM } from '../_core/llm.js';
import mysql from 'mysql2/promise';

const connection = await mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'islenomads',
});

const surfingSpots = [
  { name: 'Pasta Point', difficulty: 'Advanced', waveHeight: '4-6ft', season: 'March to October', crowd: 'Moderate' },
  { name: 'Chickens', difficulty: 'Advanced', waveHeight: '3-5ft', season: 'March to October', crowd: 'Moderate' },
  { name: 'Cokes', difficulty: 'Advanced', waveHeight: '3-6ft', season: 'March to October', crowd: 'Moderate' },
  { name: 'Sultans', difficulty: 'Intermediate', waveHeight: '2-4ft', season: 'March to October', crowd: 'Low' },
  { name: 'Jailbreaks', difficulty: 'Advanced', waveHeight: '4-6ft', season: 'March to October', crowd: 'Moderate' },
  { name: 'Broken Rock Left', difficulty: 'Advanced', waveHeight: '3-5ft', season: 'March to October', crowd: 'Low' },
  { name: 'Maamigili Right', difficulty: 'Beginner', waveHeight: '2-3ft', season: 'March to October', crowd: 'Low' },
  { name: 'Dhiggiri Outreef', difficulty: 'Beginner', waveHeight: '2-4ft', season: 'March to October', crowd: 'Low' },
];

console.log('🏄 Starting surfing spot description enhancement...\n');

for (const spot of surfingSpots) {
  console.log(`Processing: ${spot.name}...`);
  
  const prompt = `Create a detailed and engaging description for a surfing spot in the Maldives:

Name: ${spot.name}
Difficulty Level: ${spot.difficulty}
Wave Height: ${spot.waveHeight}
Best Season: ${spot.season}
Crowd Level: ${spot.crowd}

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
      'UPDATE activity_spots SET description = ? WHERE name = ? AND spotType = ?',
      [description, spot.name, 'surf_spot']
    );
    
    console.log(`✅ Updated: ${spot.name}\n`);
  } catch (error) {
    console.error(`❌ Error processing ${spot.name}:`, error.message);
  }
}

console.log('✅ Surfing spot descriptions enhanced successfully!');
await connection.end();
