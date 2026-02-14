import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const surfSpots = [
  // Thulusdhoo Island Spots
  {
    name: 'Cokes',
    islandGuideId: null, // Will be set to Thulusdhoo
    spotType: 'surf_spot',
    latitude: 4.2333,
    longitude: 73.2667,
    difficulty: 'Beginner',
    description: 'Fast right-hand reef break with consistent waves. Perfect for beginners and intermediate surfers. Mellow and forgiving.',
    waveHeight: '2-4 feet',
    bestSeason: 'March to October',
    bestTime: 'Morning (6am-10am)',
    coralCoverage: 'Heavy coral - reef break',
    marineLife: 'Reef fish, occasional turtles',
    maxDepth: 15,
    minDepth: 2,
  },
  {
    name: 'Pasta Point',
    islandGuideId: null, // Will be set to Thulusdhoo
    spotType: 'surf_spot',
    latitude: 4.2350,
    longitude: 73.2680,
    difficulty: 'Intermediate',
    description: 'Excellent left-hand reef break with long, peeling waves. Named after the Italian restaurant nearby. Great for intermediate surfers.',
    waveHeight: '3-5 feet',
    bestSeason: 'March to October',
    bestTime: 'Early morning (5am-9am)',
    coralCoverage: 'Moderate coral',
    marineLife: 'Reef sharks, trevally, grouper',
    maxDepth: 20,
    minDepth: 3,
  },
  {
    name: 'Jails',
    islandGuideId: null, // Will be set to Thulusdhoo
    spotType: 'surf_spot',
    latitude: 4.2300,
    longitude: 73.2650,
    difficulty: 'Advanced',
    description: 'Powerful right-hand reef break with hollow sections. Requires experience and good paddling fitness. Heavy water movement.',
    waveHeight: '4-6 feet',
    bestSeason: 'March to October',
    bestTime: 'Morning (6am-11am)',
    coralCoverage: 'Heavy coral - sharp reef',
    marineLife: 'Reef sharks, barracuda',
    maxDepth: 25,
    minDepth: 4,
  },
  {
    name: 'Chickens',
    islandGuideId: null, // Will be set to Thulusdhoo
    spotType: 'surf_spot',
    latitude: 4.2320,
    longitude: 73.2700,
    difficulty: 'Beginner',
    description: 'Mellow right-hand reef break. Forgiving waves with plenty of shoulder. Ideal for learning and progression.',
    waveHeight: '2-4 feet',
    bestSeason: 'March to October',
    bestTime: 'Morning (7am-12pm)',
    coralCoverage: 'Light coral',
    marineLife: 'Small reef fish',
    maxDepth: 12,
    minDepth: 2,
  },
  // Male City Area Spots
  {
    name: 'Artificial Beach Break',
    islandGuideId: null, // Will be set to Male
    spotType: 'surf_spot',
    latitude: 4.1667,
    longitude: 73.5167,
    difficulty: 'Beginner',
    description: 'Sandy beach break near Male city. Inconsistent but fun when it fires. Good for learning basics.',
    waveHeight: '2-3 feet',
    bestSeason: 'March to October',
    bestTime: 'Afternoon (2pm-6pm)',
    coralCoverage: 'Sandy bottom',
    marineLife: 'Various reef fish',
    maxDepth: 8,
    minDepth: 1,
  },
  // Rasdhoo Atoll Spots
  {
    name: 'Madivaru Pass',
    islandGuideId: null, // Will be set to Rasdhoo
    spotType: 'surf_spot',
    latitude: 4.2667,
    longitude: 73.1333,
    difficulty: 'Advanced',
    description: 'Powerful pass break with strong currents. Consistent waves but requires experience and caution. Best for advanced surfers.',
    waveHeight: '4-7 feet',
    bestSeason: 'March to October',
    bestTime: 'Early morning (5am-9am)',
    coralCoverage: 'Heavy coral',
    marineLife: 'Sharks, trevally, grouper',
    maxDepth: 30,
    minDepth: 5,
  },
  {
    name: 'Rasdhoo Reef',
    islandGuideId: null, // Will be set to Rasdhoo
    spotType: 'surf_spot',
    latitude: 4.2680,
    longitude: 73.1350,
    difficulty: 'Intermediate',
    description: 'Consistent right-hand reef break. Good quality waves with fun sections. Suitable for intermediate to advanced surfers.',
    waveHeight: '3-5 feet',
    bestSeason: 'March to October',
    bestTime: 'Morning (6am-10am)',
    coralCoverage: 'Moderate coral',
    marineLife: 'Reef fish, occasional sharks',
    maxDepth: 18,
    minDepth: 3,
  },
  // Ari Atoll Spots
  {
    name: 'Dhiffushi Reef',
    islandGuideId: null, // Will be set to Dhiffushi
    spotType: 'surf_spot',
    latitude: 4.2500,
    longitude: 73.0500,
    difficulty: 'Intermediate',
    description: 'Left-hand reef break with consistent shape. Good walls and fun sections. Popular spot with reliable waves.',
    waveHeight: '3-5 feet',
    bestSeason: 'March to October',
    bestTime: 'Morning (6am-11am)',
    coralCoverage: 'Moderate coral',
    marineLife: 'Reef sharks, trevally',
    maxDepth: 20,
    minDepth: 3,
  },
  {
    name: 'Thoddoo Pass',
    islandGuideId: null, // Will be set to Thoddoo
    spotType: 'surf_spot',
    latitude: 4.2333,
    longitude: 73.0667,
    difficulty: 'Advanced',
    description: 'Powerful pass break with strong currents. Hollow sections and fast walls. For experienced surfers only.',
    waveHeight: '4-7 feet',
    bestSeason: 'March to October',
    bestTime: 'Early morning (5am-8am)',
    coralCoverage: 'Heavy coral',
    marineLife: 'Sharks, large trevally',
    maxDepth: 35,
    minDepth: 6,
  },
  {
    name: 'Ukulhas Reef',
    islandGuideId: null, // Will be set to Ukulhas
    spotType: 'surf_spot',
    latitude: 4.2667,
    longitude: 72.9833,
    difficulty: 'Intermediate',
    description: 'Right-hand reef break with long rides. Consistent waves and good shape. Fun for intermediate surfers.',
    waveHeight: '3-5 feet',
    bestSeason: 'March to October',
    bestTime: 'Morning (6am-10am)',
    coralCoverage: 'Moderate coral',
    marineLife: 'Reef fish, turtles',
    maxDepth: 16,
    minDepth: 2,
  },
  {
    name: 'Dhigurah Reef',
    islandGuideId: null, // Will be set to Dhigurah
    spotType: 'surf_spot',
    latitude: 4.2500,
    longitude: 72.9500,
    difficulty: 'Beginner',
    description: 'Mellow right-hand reef break. Forgiving waves perfect for beginners and intermediate surfers. Consistent and fun.',
    waveHeight: '2-4 feet',
    bestSeason: 'March to October',
    bestTime: 'Morning (7am-12pm)',
    coralCoverage: 'Light to moderate coral',
    marineLife: 'Small reef fish',
    maxDepth: 12,
    minDepth: 2,
  },
  // Vaavu Atoll Spots
  {
    name: 'Fulidhoo Reef',
    islandGuideId: null, // Will be set to Fulidhoo
    spotType: 'surf_spot',
    latitude: 3.9167,
    longitude: 72.8333,
    difficulty: 'Intermediate',
    description: 'Left-hand reef break with consistent waves. Good quality shape and fun sections. Popular with intermediate surfers.',
    waveHeight: '3-5 feet',
    bestSeason: 'March to October',
    bestTime: 'Morning (6am-10am)',
    coralCoverage: 'Moderate coral',
    marineLife: 'Reef fish, sharks',
    maxDepth: 18,
    minDepth: 3,
  },
  {
    name: 'Felidhoo Pass',
    islandGuideId: null, // Will be set to Felidhoo
    spotType: 'surf_spot',
    latitude: 3.8500,
    longitude: 72.8000,
    difficulty: 'Advanced',
    description: 'Powerful pass break with strong currents. Hollow waves and fast sections. For advanced surfers with experience.',
    waveHeight: '4-7 feet',
    bestSeason: 'March to October',
    bestTime: 'Early morning (5am-9am)',
    coralCoverage: 'Heavy coral',
    marineLife: 'Sharks, large trevally',
    maxDepth: 32,
    minDepth: 5,
  },
  // Meemu Atoll Spots
  {
    name: 'Naifaru Reef',
    islandGuideId: null, // Will be set to Naifaru
    spotType: 'surf_spot',
    latitude: 3.8000,
    longitude: 72.7333,
    difficulty: 'Intermediate',
    description: 'Right-hand reef break with consistent waves. Good shape and fun sections. Suitable for intermediate surfers.',
    waveHeight: '3-5 feet',
    bestSeason: 'March to October',
    bestTime: 'Morning (6am-11am)',
    coralCoverage: 'Moderate coral',
    marineLife: 'Reef fish, occasional sharks',
    maxDepth: 17,
    minDepth: 3,
  },
  {
    name: 'Hinnavaru Pass',
    islandGuideId: null, // Will be set to Hinnavaru
    spotType: 'surf_spot',
    latitude: 3.7667,
    longitude: 72.7000,
    difficulty: 'Advanced',
    description: 'Powerful pass break with strong currents and hollow sections. Fast walls and challenging conditions. For experienced surfers.',
    waveHeight: '4-7 feet',
    bestSeason: 'March to October',
    bestTime: 'Early morning (5am-8am)',
    coralCoverage: 'Heavy coral',
    marineLife: 'Sharks, large trevally',
    maxDepth: 30,
    minDepth: 5,
  },
  // Haa Alifu Atoll Spots
  {
    name: 'Haa Alifu Reef',
    islandGuideId: null, // Will be set to Haa Alifu Atoll
    spotType: 'surf_spot',
    latitude: 6.0000,
    longitude: 73.0000,
    difficulty: 'Intermediate',
    description: 'Consistent reef break with good shape. Fun waves for intermediate surfers. Less crowded than southern atolls.',
    waveHeight: '3-5 feet',
    bestSeason: 'March to October',
    bestTime: 'Morning (6am-10am)',
    coralCoverage: 'Moderate coral',
    marineLife: 'Reef fish, turtles',
    maxDepth: 16,
    minDepth: 2,
  },
  // Hanifaru Bay
  {
    name: 'Hanifaru Reef',
    islandGuideId: null, // Will be set to Hanifaru Bay
    spotType: 'surf_spot',
    latitude: 5.6500,
    longitude: 73.3833,
    difficulty: 'Beginner',
    description: 'Mellow reef break with forgiving waves. Perfect for beginners and progression. Less crowded spot with consistent shape.',
    waveHeight: '2-4 feet',
    bestSeason: 'March to October',
    bestTime: 'Morning (7am-12pm)',
    coralCoverage: 'Light coral',
    marineLife: 'Reef fish, manta rays (seasonal)',
    maxDepth: 14,
    minDepth: 2,
  },
  // Hulhumale
  {
    name: 'Hulhumale Reef',
    islandGuideId: null, // Will be set to Hulhumale
    spotType: 'surf_spot',
    latitude: 4.2000,
    longitude: 73.5500,
    difficulty: 'Beginner',
    description: 'Sandy beach break near Hulhumale. Inconsistent but fun when waves are good. Convenient for tourists near airport.',
    waveHeight: '2-3 feet',
    bestSeason: 'March to October',
    bestTime: 'Afternoon (2pm-6pm)',
    coralCoverage: 'Sandy bottom',
    marineLife: 'Various reef fish',
    maxDepth: 10,
    minDepth: 1,
  },
  // Kandooma Island
  {
    name: 'Kandooma Reef',
    islandGuideId: null, // Will be set to Kandooma
    spotType: 'surf_spot',
    latitude: 4.3500,
    longitude: 73.4000,
    difficulty: 'Intermediate',
    description: 'Right-hand reef break with consistent waves. Good quality shape and fun sections. Popular with intermediate surfers.',
    waveHeight: '3-5 feet',
    bestSeason: 'March to October',
    bestTime: 'Morning (6am-10am)',
    coralCoverage: 'Moderate coral',
    marineLife: 'Reef fish, sharks',
    maxDepth: 19,
    minDepth: 3,
  },
  // Veligandu Island
  {
    name: 'Veligandu Reef',
    islandGuideId: null, // Will be set to Veligandu
    spotType: 'surf_spot',
    latitude: 5.0500,
    longitude: 73.2800,
    difficulty: 'Intermediate',
    description: 'Left-hand reef break with consistent waves. Good shape and fun sections. Less crowded than northern breaks.',
    waveHeight: '3-5 feet',
    bestSeason: 'March to October',
    bestTime: 'Morning (6am-10am)',
    coralCoverage: 'Moderate coral',
    marineLife: 'Reef fish, occasional sharks',
    maxDepth: 18,
    minDepth: 3,
  },
  // Maafushi Island
  {
    name: 'Maafushi Reef',
    islandGuideId: null, // Will be set to Maafushi
    spotType: 'surf_spot',
    latitude: 4.4167,
    longitude: 73.4333,
    difficulty: 'Beginner',
    description: 'Mellow reef break with forgiving waves. Perfect for beginners and intermediate surfers. Consistent and fun.',
    waveHeight: '2-4 feet',
    bestSeason: 'March to October',
    bestTime: 'Morning (7am-12pm)',
    coralCoverage: 'Light to moderate coral',
    marineLife: 'Small reef fish',
    maxDepth: 13,
    minDepth: 2,
  },
];

async function populateSurfSpots() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'islenomads',
  });

  try {
    // Get island guide IDs for mapping
    const [islands] = await connection.query(
      'SELECT id, name FROM island_guides WHERE name IN (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        'Thulusdhoo Island',
        'Male',
        'Rasdhoo Island',
        'Dhiffushi Island',
        'Thoddoo Island',
        'Ukulhas Island',
        'Dhigurah Island',
        'Fulidhoo Island',
        'Felidhoo Island',
        'Naifaru Island',
        'Hinnavaru Island',
        'Haa Alifu Atoll',
        'Hanifaru Bay',
        'Hulhumale',
        'Kandooma Island',
        'Veligandu Island',
        'Maafushi Island',
        'Male City',
        'Banana Reef',
        'Guraidhoo Island',
      ]
    );

    const islandMap = {};
    islands.forEach(island => {
      islandMap[island.name] = island.id;
    });

    console.log('Island mapping:', islandMap);

    // Map surf spots to island IDs
    const mappedSpots = surfSpots.map(spot => {
      let islandId = null;
      
      if (spot.name === 'Cokes' || spot.name === 'Pasta Point' || spot.name === 'Jails' || spot.name === 'Chickens') {
        islandId = islandMap['Thulusdhoo Island'];
      } else if (spot.name === 'Artificial Beach Break') {
        islandId = islandMap['Male'];
      } else if (spot.name === 'Madivaru Pass' || spot.name === 'Rasdhoo Reef') {
        islandId = islandMap['Rasdhoo Island'];
      } else if (spot.name === 'Dhiffushi Reef') {
        islandId = islandMap['Dhiffushi Island'];
      } else if (spot.name === 'Thoddoo Pass') {
        islandId = islandMap['Thoddoo Island'];
      } else if (spot.name === 'Ukulhas Reef') {
        islandId = islandMap['Ukulhas Island'];
      } else if (spot.name === 'Dhigurah Reef') {
        islandId = islandMap['Dhigurah Island'];
      } else if (spot.name === 'Fulidhoo Reef') {
        islandId = islandMap['Fulidhoo Island'];
      } else if (spot.name === 'Felidhoo Pass') {
        islandId = islandMap['Felidhoo Island'];
      } else if (spot.name === 'Naifaru Reef') {
        islandId = islandMap['Naifaru Island'];
      } else if (spot.name === 'Hinnavaru Pass') {
        islandId = islandMap['Hinnavaru Island'];
      } else if (spot.name === 'Haa Alifu Reef') {
        islandId = islandMap['Haa Alifu Atoll'];
      } else if (spot.name === 'Hanifaru Reef') {
        islandId = islandMap['Hanifaru Bay'];
      } else if (spot.name === 'Hulhumale Reef') {
        islandId = islandMap['Hulhumale'];
      } else if (spot.name === 'Kandooma Reef') {
        islandId = islandMap['Kandooma Island'];
      } else if (spot.name === 'Veligandu Reef') {
        islandId = islandMap['Veligandu Island'];
      } else if (spot.name === 'Maafushi Reef') {
        islandId = islandMap['Maafushi Island'];
      }

      return {
        ...spot,
        islandGuideId: islandId,
      };
    });

    // Insert surf spots
    let insertedCount = 0;
    for (const spot of mappedSpots) {
      if (!spot.islandGuideId) {
        console.log(`⚠️  Skipping ${spot.name} - island not found`);
        continue;
      }

      try {
        await connection.query(
          `INSERT INTO activity_spots 
           (name, islandGuideId, spotType, latitude, longitude, difficulty, description, waveHeight, bestSeason, bestTime, coralCoverage, marineLife, maxDepth, minDepth, published)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
          [
            spot.name,
            spot.islandGuideId,
            spot.spotType,
            spot.latitude,
            spot.longitude,
            spot.difficulty,
            spot.description,
            spot.waveHeight,
            spot.bestSeason,
            spot.bestTime,
            spot.coralCoverage,
            spot.marineLife,
            spot.maxDepth,
            spot.minDepth,
          ]
        );
        insertedCount++;
        console.log(`✅ Inserted: ${spot.name} (Island ID: ${spot.islandGuideId})`);
      } catch (error) {
        console.error(`❌ Error inserting ${spot.name}:`, error.message);
      }
    }

    console.log(`\n✅ Successfully inserted ${insertedCount} surf spots!`);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await connection.end();
  }
}

populateSurfSpots();
