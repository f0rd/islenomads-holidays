import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;

// Comprehensive attraction data - just the fields we need to update
const attractionData = {
  'hp-reef': {
    overview: 'HP Reef is a spectacular house reef dive site featuring stunning coral formations and abundant marine life. Named after the HP dive center, this site is known for its vibrant coral gardens and frequent sightings of reef sharks, rays, and schools of trevally.',
    quickFacts: 'Depth: 5-30m | Difficulty: Intermediate | Visibility: 20-40m | Best: Nov-April',
    marineLife: 'Reef sharks, eagle rays, manta rays, groupers, snappers, trevally, barracuda, fusiliers, parrotfish, moray eels',
    difficulty: 'intermediate',
    depthRange: '5-30m',
    bestSeason: 'Year-round, best Nov-April',
    waterConditions: 'Water temperature 28-30°C, visibility 20-40m, moderate to strong currents',
    safetyTips: 'Watch for strong currents, stay close to guide, monitor air consumption',
    facilities: 'Dive center nearby, equipment rental available',
    accessInfo: 'Shore dive or short boat ride from Male',
    latitude: '4.1500',
    longitude: '73.5000'
  },
  'banana-reef': {
    overview: 'Banana Reef is one of the most popular dive sites in the Maldives, named for its distinctive banana-shaped coral formation. The site features a stunning coral wall, abundant fish life, and excellent visibility.',
    quickFacts: 'Depth: 5-40m | Difficulty: Beginner-Intermediate | Visibility: 20-40m | Best: Year-round',
    marineLife: 'Reef sharks, groupers, snappers, jacks, trevally, barracuda, fusiliers, angelfish, butterflyfish, moray eels, octopus',
    difficulty: 'beginner',
    depthRange: '5-40m',
    bestSeason: 'Year-round, best Nov-April',
    waterConditions: 'Water temperature 28-30°C, visibility 20-40m, moderate currents',
    safetyTips: 'Stay with group, watch for currents at depth, check air regularly',
    facilities: 'Multiple dive centers, full equipment rental',
    accessInfo: 'Boat dive from Male or nearby resorts',
    latitude: '4.1667',
    longitude: '73.5167'
  },
  'maaya-thila': {
    overview: 'Maaya Thila is a renowned pinnacle dive site in South Ari Atoll, featuring dramatic underwater topography with a coral-covered pinnacle rising from deep water.',
    quickFacts: 'Depth: 10-40m | Difficulty: Advanced | Visibility: 20-40m | Best: Nov-April, manta rays June-Nov',
    marineLife: 'Reef sharks, eagle rays, manta rays, groupers, snappers, fusiliers, jacks, barracuda, lionfish, nudibranchs, seahorses',
    difficulty: 'advanced',
    depthRange: '10-40m',
    bestSeason: 'Best Nov-April, manta rays June-Nov',
    waterConditions: 'Water temperature 28-30°C, visibility 20-40m, strong currents',
    safetyTips: 'Advanced divers only, strong currents, deep water, nitrogen narcosis risk',
    facilities: 'Liveaboard and resort dive centers',
    accessInfo: 'Boat dive from South Ari Atoll resorts',
    latitude: '4.2667',
    longitude: '72.9833'
  },
  'kandooma-thila': {
    overview: 'Kandooma Thila is a pristine pinnacle dive site in South Male Atoll featuring a coral-covered underwater mountain with abundant fish life and excellent visibility.',
    quickFacts: 'Depth: 10-40m | Difficulty: Intermediate-Advanced | Visibility: 20-40m | Best: Year-round',
    marineLife: 'Reef sharks, eagle rays, manta rays, groupers, snappers, trevally, fusiliers, jacks, angelfish, butterflyfish',
    difficulty: 'intermediate',
    depthRange: '10-40m',
    bestSeason: 'Year-round, best Nov-April',
    waterConditions: 'Water temperature 28-30°C, visibility 20-40m, moderate to strong currents',
    safetyTips: 'Monitor depth and air, watch for currents, nitrogen narcosis at depth',
    facilities: 'Resort dive centers, equipment rental',
    accessInfo: 'Boat dive from South Male Atoll',
    latitude: '3.9067',
    longitude: '73.4799'
  },
  'fesdu-wreck': {
    overview: 'Fesdu Wreck is the remains of a cargo ship that sank in deep water, creating an artificial reef teeming with marine life and offering unique exploration opportunities.',
    quickFacts: 'Depth: 20-45m | Difficulty: Advanced | Visibility: 15-35m | Best: Year-round',
    marineLife: 'Groupers, snappers, jacks, trevally, barracuda, fusiliers, moray eels, lionfish, nudibranchs',
    difficulty: 'advanced',
    depthRange: '20-45m',
    bestSeason: 'Year-round, best Nov-April',
    waterConditions: 'Water temperature 28-30°C, visibility 15-35m, moderate to strong currents',
    safetyTips: 'Deep dive, advanced certification required, nitrogen narcosis risk',
    facilities: 'Liveaboard dive centers',
    accessInfo: 'Liveaboard boat dive',
    latitude: '4.2500',
    longitude: '72.9500'
  },
  'veligandu-reef': {
    overview: 'Veligandu Reef is a spectacular coral reef dive site featuring pristine coral gardens and abundant marine life with excellent visibility.',
    quickFacts: 'Depth: 5-30m | Difficulty: Beginner-Intermediate | Visibility: 20-40m | Best: Year-round',
    marineLife: 'Reef sharks, eagle rays, manta rays, groupers, snappers, trevally, fusiliers, angelfish, butterflyfish, parrotfish',
    difficulty: 'beginner',
    depthRange: '5-30m',
    bestSeason: 'Year-round, best Nov-April',
    waterConditions: 'Water temperature 28-30°C, visibility 20-40m, moderate currents',
    safetyTips: 'Suitable for beginners, stay with guide, monitor air consumption',
    facilities: 'Multiple dive centers, equipment rental',
    accessInfo: 'Boat dive from North Male Atoll',
    latitude: '4.1800',
    longitude: '73.5100'
  },
  'vaavu-atoll-dive-sites': {
    overview: 'Vaavu Atoll offers multiple pristine dive sites with excellent coral formations and abundant marine life in a less crowded environment.',
    quickFacts: 'Depth: 10-40m | Difficulty: Intermediate | Visibility: 20-40m | Best: Year-round',
    marineLife: 'Reef sharks, eagle rays, manta rays, groupers, snappers, trevally, fusiliers, jacks, angelfish, butterflyfish',
    difficulty: 'intermediate',
    depthRange: '10-40m',
    bestSeason: 'Year-round, best Nov-April',
    waterConditions: 'Water temperature 28-30°C, visibility 20-40m, moderate currents',
    safetyTips: 'Monitor depth and air, watch for currents, stay with guide',
    facilities: 'Resort dive centers in Vaavu',
    accessInfo: 'Boat dive from Vaavu Atoll resorts',
    latitude: '3.6500',
    longitude: '73.0000'
  },
  'artificial-reef-dive-site': {
    overview: 'This artificial reef was created to promote marine conservation and provide diving opportunities with sunken structures colonized by corals.',
    quickFacts: 'Depth: 10-35m | Difficulty: Intermediate | Visibility: 15-35m | Best: Year-round',
    marineLife: 'Groupers, snappers, jacks, trevally, barracuda, fusiliers, moray eels, lionfish, nudibranchs',
    difficulty: 'intermediate',
    depthRange: '10-35m',
    bestSeason: 'Year-round, best Nov-April',
    waterConditions: 'Water temperature 28-30°C, visibility 15-35m, moderate currents',
    safetyTips: 'Watch for sharp edges on structures, stay with guide',
    facilities: 'Nearby dive centers',
    accessInfo: 'Boat dive from Male area',
    latitude: '4.2000',
    longitude: '73.4500'
  },
  'coral-garden-snorkeling': {
    overview: 'Coral Garden is a pristine snorkeling destination featuring vibrant coral formations and abundant tropical fish in shallow, protected waters.',
    quickFacts: 'Depth: 2-8m | Difficulty: Beginner | Visibility: 15-30m | Best: Year-round',
    marineLife: 'Parrotfish, butterflyfish, angelfish, damselfish, fusiliers, groupers, snappers, rays, sea turtles',
    difficulty: 'beginner',
    depthRange: '2-8m',
    bestSeason: 'Year-round, best Nov-April',
    waterConditions: 'Water temperature 28-30°C, visibility 15-30m, minimal to light currents',
    safetyTips: 'Wear reef-safe sunscreen, do not touch corals, watch for sea urchins',
    facilities: 'Nearby resorts with equipment rental',
    accessInfo: 'Short boat ride or shore access from resorts',
    latitude: '4.1800',
    longitude: '73.5200'
  },
  'banana-reef-lagoon': {
    overview: 'Banana Reef Lagoon offers excellent snorkeling in shallow, protected waters with beautiful coral formations and abundant fish life.',
    quickFacts: 'Depth: 1-6m | Difficulty: Beginner | Visibility: 15-30m | Best: Year-round',
    marineLife: 'Parrotfish, butterflyfish, angelfish, damselfish, fusiliers, groupers, snappers, rays',
    difficulty: 'beginner',
    depthRange: '1-6m',
    bestSeason: 'Year-round, best Nov-April',
    waterConditions: 'Water temperature 28-30°C, visibility 15-30m, minimal currents',
    safetyTips: 'Suitable for all ages, wear reef-safe sunscreen, stay in designated areas',
    facilities: 'Resort facilities, equipment rental',
    accessInfo: 'Boat or shore access from resorts',
    latitude: '4.1700',
    longitude: '73.5100'
  },
  'bikini-beach-reef': {
    overview: 'Bikini Beach Reef is a popular snorkeling destination with excellent coral formations and diverse marine life, offering both snorkeling and relaxation.',
    quickFacts: 'Depth: 2-8m | Difficulty: Beginner | Visibility: 15-30m | Best: Year-round',
    marineLife: 'Parrotfish, butterflyfish, angelfish, damselfish, fusiliers, groupers, snappers, rays, sea turtles',
    difficulty: 'beginner',
    depthRange: '2-8m',
    bestSeason: 'Year-round, best Nov-April',
    waterConditions: 'Water temperature 28-30°C, visibility 15-30m, light currents',
    safetyTips: 'Watch for currents, wear reef-safe sunscreen, do not touch marine life',
    facilities: 'Beach facilities, equipment rental',
    accessInfo: 'Beach access or short boat ride',
    latitude: '4.1650',
    longitude: '73.5150'
  },
  'addu-city-lagoon': {
    overview: 'Addu City Lagoon offers pristine snorkeling in a protected lagoon environment with calm waters and abundant marine life, known for sea turtle sightings.',
    quickFacts: 'Depth: 2-10m | Difficulty: Beginner | Visibility: 15-30m | Best: Year-round',
    marineLife: 'Parrotfish, butterflyfish, angelfish, damselfish, fusiliers, groupers, snappers, rays, sea turtles',
    difficulty: 'beginner',
    depthRange: '2-10m',
    bestSeason: 'Year-round, best Nov-April',
    waterConditions: 'Water temperature 27-29°C, visibility 15-30m, minimal currents',
    safetyTips: 'Protected lagoon, suitable for families, watch for sea turtles',
    facilities: 'Addu City resort facilities',
    accessInfo: 'Boat access from Addu City',
    latitude: '-0.6333',
    longitude: '73.1667'
  },
  'hanifaru-bay': {
    overview: 'Hanifaru Bay is a UNESCO Biosphere Reserve famous for seasonal aggregations of manta rays and whale sharks, offering spectacular snorkeling experiences.',
    quickFacts: 'Depth: 2-15m | Difficulty: Beginner-Intermediate | Visibility: 15-30m | Best: Manta rays May-Nov, whale sharks June-Nov',
    marineLife: 'Manta rays, whale sharks, reef sharks, groupers, snappers, fusiliers, jacks, barracuda',
    difficulty: 'beginner',
    depthRange: '2-15m',
    bestSeason: 'Manta rays May-Nov, whale sharks June-Nov',
    waterConditions: 'Water temperature 28-30°C, visibility 15-30m, moderate currents',
    safetyTips: 'Do not touch marine life, maintain distance from manta rays and whale sharks, follow guide instructions',
    facilities: 'Nearby resorts and dive centers',
    accessInfo: 'Boat access from Baa Atoll resorts',
    latitude: '5.1732',
    longitude: '73.1443'
  },
  'cokes': {
    overview: 'Cokes is a world-class right-hand reef break located near Thulusdhoo, known for consistent waves and perfect barrels.',
    quickFacts: 'Wave Height: 1.5-4m | Difficulty: Advanced | Best: March-October | Type: Right-hand reef break',
    waveHeight: '1.5-4m',
    difficulty: 'advanced',
    bestSeason: 'March-October (dry season)',
    waterConditions: 'Water temperature 28-30°C, best with light offshore winds',
    safetyTips: 'Reef break - wear booties, watch for sharp coral, experienced surfers only',
    facilities: 'Nearby surf camps and resorts',
    accessInfo: 'Boat access from Thulusdhoo',
    latitude: '4.2333',
    longitude: '73.3833'
  },
  'riptides': {
    overview: 'Riptides is a powerful left-hand reef break near Guraidhoo, known for fast, hollow waves and challenging conditions.',
    quickFacts: 'Wave Height: 1-3m | Difficulty: Advanced | Best: March-October | Type: Left-hand reef break',
    waveHeight: '1-3m',
    difficulty: 'advanced',
    bestSeason: 'March-October',
    waterConditions: 'Water temperature 28-30°C, best with offshore winds',
    safetyTips: 'Powerful reef break, strong currents, experienced surfers only, wear reef booties',
    facilities: 'Nearby resorts and surf camps',
    accessInfo: 'Boat access from Guraidhoo',
    latitude: '4.1667',
    longitude: '73.5167'
  },
  'chickens': {
    overview: 'Chickens is a fun, forgiving right-hand reef break near Rasdhoo, perfect for intermediate surfers with consistent waves.',
    quickFacts: 'Wave Height: 0.5-2m | Difficulty: Intermediate | Best: March-October | Type: Right-hand reef break',
    waveHeight: '0.5-2m',
    difficulty: 'intermediate',
    bestSeason: 'March-October',
    waterConditions: 'Water temperature 28-30°C, best with light winds',
    safetyTips: 'Reef break, wear reef booties, watch for other surfers, moderate difficulty',
    facilities: 'Nearby surf camps and resorts',
    accessInfo: 'Boat access from Rasdhoo',
    latitude: '4.2500',
    longitude: '73.4000'
  },
  'pasta-point': {
    overview: 'Pasta Point is a consistent right-hand reef break near Eydhafushi in Baa Atoll, known for long rides and beautiful barrels.',
    quickFacts: 'Wave Height: 1-3m | Difficulty: Intermediate-Advanced | Best: March-October | Type: Right-hand reef break',
    waveHeight: '1-3m',
    difficulty: 'intermediate',
    bestSeason: 'March-October',
    waterConditions: 'Water temperature 28-30°C, best with light offshore winds',
    safetyTips: 'Reef break, wear reef booties, watch for currents, intermediate to advanced',
    facilities: 'Nearby resorts and surf camps',
    accessInfo: 'Boat access from Eydhafushi',
    latitude: '5.0167',
    longitude: '73.1667'
  },
  'thalapathi': {
    overview: 'Thalapathi is a fun left-hand reef break offering consistent waves and good shape, suitable for intermediate surfers.',
    quickFacts: 'Wave Height: 0.5-2m | Difficulty: Intermediate | Best: March-October | Type: Left-hand reef break',
    waveHeight: '0.5-2m',
    difficulty: 'intermediate',
    bestSeason: 'March-October',
    waterConditions: 'Water temperature 28-30°C, best with offshore winds',
    safetyTips: 'Reef break, wear reef booties, watch for sea urchins, intermediate level',
    facilities: 'Nearby resorts',
    accessInfo: 'Boat access',
    latitude: '4.2400',
    longitude: '73.3900'
  }
};

async function generateAllAttractionGuides() {
  try {
    const conn = await mysql.createConnection({
      uri: DATABASE_URL,
      ssl: false,
    });

    console.log('Generating comprehensive attraction guides for all 116 attractions...\n');

    let created = 0;
    let updated = 0;
    let failed = 0;

    // Get all activity spots from places table with their IDs
    const [spots] = await conn.execute('SELECT id, name, slug, type FROM places WHERE type IN ("dive_site", "surf_spot", "snorkeling_spot")');

    for (const spot of spots) {
      try {
        // Check if guide already exists
        const [existing] = await conn.execute('SELECT id FROM attraction_guides WHERE slug = ?', [spot.slug]);

        // Get data from our comprehensive dataset or generate default
        const data = attractionData[spot.slug] || {
          overview: `Discover ${spot.name}, a pristine ${spot.type.replace('_', ' ')} in the Maldives. This location offers excellent opportunities for marine exploration and adventure.`,
          quickFacts: spot.type === 'snorkeling_spot' ? 'Depth: 2-10m | Difficulty: Beginner | Best: Year-round' : 'Depth: 10-40m | Difficulty: Intermediate | Best: Year-round',
          marineLife: 'Tropical fish, corals, rays, sharks',
          difficulty: spot.type === 'snorkeling_spot' ? 'beginner' : 'intermediate',
          depthRange: spot.type === 'snorkeling_spot' ? '2-10m' : '10-40m',
          bestSeason: 'Year-round, best Nov-April',
          waterConditions: 'Water temperature 28-30°C, excellent visibility',
          safetyTips: 'Follow guide instructions, monitor air/energy levels, wear reef-safe sunscreen',
          facilities: 'Nearby resorts and dive centers',
          accessInfo: 'Boat access available',
          latitude: null,
          longitude: null,
          waveHeight: null
        };

        if (existing.length > 0) {
          // Update existing guide
          await conn.execute(
            `UPDATE attraction_guides SET 
              overview = ?, quickFacts = ?, marineLife = ?, 
              difficulty = ?, depthRange = ?, bestSeason = ?, waterConditions = ?,
              safetyTips = ?, facilities = ?, accessInfo = ?, waveHeight = ?, latitude = ?, longitude = ?
            WHERE slug = ?`,
            [
              data.overview,
              data.quickFacts,
              data.marineLife,
              data.difficulty,
              data.depthRange,
              data.bestSeason,
              data.waterConditions,
              data.safetyTips,
              data.facilities,
              data.accessInfo,
              data.waveHeight || null,
              data.latitude,
              data.longitude,
              spot.slug
            ]
          );
          updated++;
        } else {
          // Create new guide
          await conn.execute(
            `INSERT INTO attraction_guides 
              (placeId, name, slug, attractionType, overview, quickFacts, marineLife, difficulty, depthRange, 
               bestSeason, waterConditions, safetyTips, facilities, accessInfo, waveHeight, published, featured, latitude, longitude)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              spot.id,
              spot.name,
              spot.slug,
              spot.type,
              data.overview,
              data.quickFacts,
              data.marineLife,
              data.difficulty,
              data.depthRange,
              data.bestSeason,
              data.waterConditions,
              data.safetyTips,
              data.facilities,
              data.accessInfo,
              data.waveHeight || null,
              1, // published
              0, // featured
              data.latitude,
              data.longitude
            ]
          );
          created++;
        }

        if ((created + updated) % 20 === 0) {
          console.log(`✅ Processed ${created + updated} guides...`);
        }
      } catch (err) {
        console.error(`❌ Error processing ${spot.slug}:`, err.message);
        failed++;
      }
    }

    await conn.end();
    console.log(`\n✅ Complete!`);
    console.log(`  Created: ${created}`);
    console.log(`  Updated: ${updated}`);
    console.log(`  Failed: ${failed}`);
    console.log(`  Total processed: ${created + updated + failed}`);
  } catch (error) {
    console.error('Connection error:', error);
    process.exit(1);
  }
}

generateAllAttractionGuides();
