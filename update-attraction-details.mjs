import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;

const attractionUpdates = [
  {
    slug: 'banana-reef',
    latitude: '4.1667',
    longitude: '73.5167',
    depthRange: '4-30m',
    difficulty: 'beginner',
    waterConditions: JSON.stringify({ visibility: '15-30m', current: 'Moderate to Strong' }),
    marineLife: JSON.stringify(['Sharks', 'Manta rays', 'Barracudas', 'Jacks', 'Groupers', 'Napoleon wrasses', 'Stingrays', 'Moray eels']),
    bestSeason: 'November-April',
    nearestIsland: 'Maafushi',
    distanceFromIsland: '8 km',
  },
  {
    slug: 'maaya-thila',
    latitude: '4.2667',
    longitude: '72.9833',
    depthRange: '6-40m',
    difficulty: 'intermediate',
    waterConditions: JSON.stringify({ visibility: '30-40m', current: 'Moderate' }),
    marineLife: JSON.stringify(['Whitetip reef sharks', 'Gray reef sharks', 'Triggerfish', 'Nudibranchs', 'Giant frogfish']),
    bestSeason: 'November-April',
    nearestIsland: 'Ukulhas',
    distanceFromIsland: '12 km',
  },
  {
    slug: 'kandooma-thila',
    latitude: '3.9067',
    longitude: '73.4799',
    depthRange: '13-30m',
    difficulty: 'intermediate',
    waterConditions: JSON.stringify({ visibility: '20-30m', current: 'Strong' }),
    marineLife: JSON.stringify(['Barracuda', 'Grey reef sharks', 'Jacks', 'Snapper', 'Turtles']),
    bestSeason: 'November-April',
    nearestIsland: 'Kandooma',
    distanceFromIsland: '5 km',
  },
  {
    slug: 'hp-reef',
    latitude: '4.1500',
    longitude: '73.5000',
    depthRange: '5-30m',
    difficulty: 'beginner',
    waterConditions: JSON.stringify({ visibility: '15-25m', current: 'Moderate' }),
    marineLife: JSON.stringify(['Reef fish', 'Sharks', 'Rays', 'Groupers']),
    bestSeason: 'November-April',
    nearestIsland: 'Maafushi',
    distanceFromIsland: '10 km',
  },
  {
    slug: 'fesdu-wreck',
    latitude: '4.2500',
    longitude: '72.9500',
    depthRange: '20-30m',
    difficulty: 'intermediate',
    waterConditions: JSON.stringify({ visibility: '20-30m', current: 'Moderate to Strong' }),
    marineLife: JSON.stringify(['Clownfish', 'Groupers', 'Lionfish', 'Anemones']),
    bestSeason: 'November-April',
    nearestIsland: 'Ukulhas',
    distanceFromIsland: '15 km',
  },
  {
    slug: 'veligandu-reef',
    latitude: '4.1800',
    longitude: '73.5100',
    depthRange: '3-25m',
    difficulty: 'beginner',
    waterConditions: JSON.stringify({ visibility: '15-25m', current: 'Moderate' }),
    marineLife: JSON.stringify(['Reef fish', 'Sharks', 'Rays', 'Turtles']),
    bestSeason: 'November-April',
    nearestIsland: 'Maafushi',
    distanceFromIsland: '6 km',
  },
  {
    slug: 'cokes',
    latitude: '4.2333',
    longitude: '73.3833',
    waveHeight: '1.5-4m',
    difficulty: 'advanced',
    waterConditions: JSON.stringify({ waveType: 'Right-hander point break', windPattern: 'Northwest offshore', swellDirection: 'South' }),
    marineLife: JSON.stringify(['N/A']),
    bestSeason: 'March-October',
    nearestIsland: 'Thulusdhoo',
    distanceFromIsland: '2 km',
  },
  {
    slug: 'riptides',
    latitude: '4.1667',
    longitude: '73.5167',
    waveHeight: '1-3m',
    difficulty: 'advanced',
    waterConditions: JSON.stringify({ waveType: 'Right-hander reef break', windPattern: 'Northwest offshore', swellDirection: 'South', warning: 'Strong currents' }),
    marineLife: JSON.stringify(['N/A']),
    bestSeason: 'March-October',
    nearestIsland: 'Guraidhoo',
    distanceFromIsland: '2 km',
  },
  {
    slug: 'chickens',
    latitude: '4.2500',
    longitude: '73.4000',
    waveHeight: '1-3m',
    difficulty: 'intermediate',
    waterConditions: JSON.stringify({ waveType: 'Left-hander reef break', windPattern: 'Northwest offshore', swellDirection: 'South' }),
    marineLife: JSON.stringify(['N/A']),
    bestSeason: 'February-November',
    nearestIsland: 'Rasdhoo',
    distanceFromIsland: '8 km',
  },
  {
    slug: 'pasta-point',
    latitude: '5.0167',
    longitude: '73.1667',
    waveHeight: '1-3m',
    difficulty: 'intermediate',
    waterConditions: JSON.stringify({ waveType: 'Right-hander reef break', windPattern: 'Northwest offshore', swellDirection: 'South' }),
    marineLife: JSON.stringify(['N/A']),
    bestSeason: 'March-October',
    nearestIsland: 'Eydhafushi',
    distanceFromIsland: '5 km',
  },
];

async function updateAttractionDetails() {
  try {
    const conn = await mysql.createConnection({
      uri: DATABASE_URL,
      ssl: false,
    });

    console.log('Updating attraction location details...\n');

    for (const update of attractionUpdates) {
      try {
        // Build dynamic update query based on available fields
        const fields = [];
        const values = [];

        if (update.latitude) {
          fields.push('latitude = ?');
          values.push(update.latitude);
        }
        if (update.longitude) {
          fields.push('longitude = ?');
          values.push(update.longitude);
        }
        if (update.depthRange) {
          fields.push('depthRange = ?');
          values.push(update.depthRange);
        }
        if (update.waveHeight) {
          fields.push('waveHeight = ?');
          values.push(update.waveHeight);
        }
        if (update.difficulty) {
          fields.push('difficulty = ?');
          values.push(update.difficulty);
        }
        if (update.waterConditions) {
          fields.push('waterConditions = ?');
          values.push(update.waterConditions);
        }
        if (update.marineLife) {
          fields.push('marineLife = ?');
          values.push(update.marineLife);
        }
        if (update.bestSeason) {
          fields.push('bestSeason = ?');
          values.push(update.bestSeason);
        }
        if (update.nearestIsland) {
          fields.push('nearestIsland = ?');
          values.push(update.nearestIsland);
        }
        if (update.distanceFromIsland) {
          fields.push('distanceFromIsland = ?');
          values.push(update.distanceFromIsland);
        }

        values.push(update.slug);

        const query = `UPDATE attraction_guides SET ${fields.join(', ')} WHERE slug = ?`;

        await conn.execute(query, values);

        console.log(`✅ Updated: ${update.slug}`);
      } catch (err) {
        console.error(`❌ Error updating ${update.slug}:`, err.message);
      }
    }

    await conn.end();
    console.log('\n✅ Attraction details updated successfully!');
  } catch (error) {
    console.error('Connection error:', error);
    process.exit(1);
  }
}

updateAttractionDetails();
