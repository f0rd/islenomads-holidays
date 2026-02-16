import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;

const newIslands = [
  {
    name: 'Rasdhoo',
    slug: 'rasdhoo',
    atoll: 'North Ari Atoll',
    overview: 'Rasdhoo is a small inhabited island in North Ari Atoll, located approximately 60 km west of Malé. Known as the gateway to some of the Maldives\' best dive sites including Fish Head and Maaya Thila. The island offers a local experience with guesthouses and dive centers catering to divers exploring the surrounding atolls.',
    description: 'A charming local island with excellent access to world-class dive sites. Rasdhoo serves as a base for exploring North Ari Atoll\'s famous pinnacles and reefs.',
    gettingThere: 'Speedboat from Malé (approximately 1.5-2 hours) or domestic flight to nearby islands.',
    bestTimeToVisit: 'November to April',
    language: 'Dhivehi, English',
    currency: 'Maldivian Rufiyaa (MVR)',
    timezone: 'Maldives Standard Time (MST)',
    latitude: '4.2167',
    longitude: '72.9833',
    published: 1,
  },
  {
    name: 'Guraidhoo',
    slug: 'guraidhoo',
    atoll: 'South Male Atoll',
    overview: 'Guraidhoo is a local island in South Male Atoll, famous for its proximity to world-class surf breaks including Riptides, Foxy\'s, and Kandooma Right. The island offers an authentic Maldivian experience with guesthouses, local restaurants, and easy boat access to diving and surfing spots.',
    description: 'A vibrant local island known as a surfing hub with excellent access to multiple reef breaks. Perfect for travelers seeking authentic island culture combined with water sports.',
    gettingThere: 'Speedboat from Malé (approximately 30-45 minutes) or domestic flight.',
    bestTimeToVisit: 'March to October (best swell), November to April (calmer conditions)',
    language: 'Dhivehi, English',
    currency: 'Maldivian Rufiyaa (MVR)',
    timezone: 'Maldives Standard Time (MST)',
    latitude: '4.1667',
    longitude: '73.5167',
    published: 1,
  },
  {
    name: 'Ukulhas',
    slug: 'ukulhas',
    atoll: 'North Ari Atoll',
    overview: 'Ukulhas is a local island in North Ari Atoll, serving as an excellent base for exploring some of the Maldives\' best dive sites including Fish Head and Maaya Thila. The island offers guesthouses, local restaurants, and a relaxed atmosphere perfect for divers.',
    description: 'A peaceful local island with direct access to premium dive sites. Known for its friendly locals and affordable guesthouses.',
    gettingThere: 'Speedboat from Malé (approximately 1.5-2 hours) or domestic flight to nearby islands.',
    bestTimeToVisit: 'November to April',
    language: 'Dhivehi, English',
    currency: 'Maldivian Rufiyaa (MVR)',
    timezone: 'Maldives Standard Time (MST)',
    latitude: '4.2667',
    longitude: '72.9833',
    published: 1,
  },
  {
    name: 'Kandooma',
    slug: 'kandooma',
    atoll: 'South Male Atoll',
    overview: 'Kandooma is a local island in South Male Atoll, known for its proximity to the famous Kandooma Thila dive site and Kandooma Right surf break. The island offers guesthouses and easy access to some of the best diving and surfing in South Male Atoll.',
    description: 'A local island perfectly positioned for exploring South Male Atoll\'s dive sites and surf breaks. Known for its vibrant marine life and consistent waves.',
    gettingThere: 'Speedboat from Malé (approximately 45 minutes to 1 hour) or domestic flight.',
    bestTimeToVisit: 'March to October (surfing), November to April (diving)',
    language: 'Dhivehi, English',
    currency: 'Maldivian Rufiyaa (MVR)',
    timezone: 'Maldives Standard Time (MST)',
    latitude: '4.1333',
    longitude: '73.5333',
    published: 1,
  },
];

async function addIslandGuides() {
  try {
    const conn = await mysql.createConnection({
      uri: DATABASE_URL,
      ssl: false,
    });

    console.log('Adding new island guides...\n');

    for (const island of newIslands) {
      try {
        const [result] = await conn.execute(
          `INSERT INTO island_guides (
            name, slug, atoll, overview, description, gettingThere, 
            bestTimeToVisit, language, currency, timezone, latitude, longitude, published
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            island.name,
            island.slug,
            island.atoll,
            island.overview,
            island.description,
            island.gettingThere,
            island.bestTimeToVisit,
            island.language,
            island.currency,
            island.timezone,
            island.latitude,
            island.longitude,
            island.published,
          ]
        );

        console.log(`✅ Added: ${island.name} (ID: ${result.insertId})`);
      } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          console.log(`⚠️  Skipped: ${island.name} (already exists)`);
        } else {
          console.error(`❌ Error adding ${island.name}:`, err.message);
        }
      }
    }

    await conn.end();
    console.log('\n✅ Island guides added successfully!');
    } catch (error) {
    console.error('Connection error:', error);
    process.exit(1);
  }
}

addIslandGuides();
