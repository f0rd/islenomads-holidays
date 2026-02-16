import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;

const coordinatesData = [
  { slug: 'hanifaru-bay', latitude: '5.1732', longitude: '73.1443' },
  { slug: 'vaavu-atoll-dive-sites', latitude: '3.6500', longitude: '73.0000' }, // Vaavu Atoll center
  { slug: 'artificial-reef-dive-site', latitude: '4.2000', longitude: '73.4500' },
  { slug: 'coral-garden-snorkeling', latitude: '4.1800', longitude: '73.5200' },
  { slug: 'pasta-point-surf-spot', latitude: '5.0167', longitude: '73.1667' },
  { slug: 'addu-city-lagoon', latitude: '-0.6333', longitude: '73.1667' }, // Addu Atoll
  { slug: 'banana-reef-lagoon', latitude: '4.1700', longitude: '73.5100' },
  { slug: 'bikini-beach-reef', latitude: '4.1650', longitude: '73.5150' },
  { slug: 'thalapathi', latitude: '4.2400', longitude: '73.3900' },
  { slug: 'male-city', latitude: '4.1748', longitude: '73.5088' },
  { slug: 'artificial-beach', latitude: '4.1800', longitude: '73.5000' },
  { slug: 'male-friday-mosque', latitude: '4.1755', longitude: '73.5100' },
  { slug: 'hulhumale-beach', latitude: '4.2000', longitude: '73.5500' },
];

async function addMissingCoordinates() {
  try {
    const conn = await mysql.createConnection({
      uri: DATABASE_URL,
      ssl: false,
    });

    console.log('Adding missing coordinates...\n');

    for (const data of coordinatesData) {
      try {
        await conn.execute(
          'UPDATE attraction_guides SET latitude = ?, longitude = ? WHERE slug = ?',
          [data.latitude, data.longitude, data.slug]
        );
        console.log(`✅ Updated: ${data.slug} (${data.latitude}, ${data.longitude})`);
      } catch (err) {
        console.error(`❌ Error updating ${data.slug}:`, err.message);
      }
    }

    await conn.end();
    console.log('\n✅ Coordinates added successfully!');
  } catch (error) {
    console.error('Connection error:', error);
    process.exit(1);
  }
}

addMissingCoordinates();
