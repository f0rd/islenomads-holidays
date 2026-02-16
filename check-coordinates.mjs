import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;

async function checkCoordinates() {
  try {
    const conn = await mysql.createConnection({
      uri: DATABASE_URL,
      ssl: false,
    });

    const [rows] = await conn.execute('SELECT id, slug, name, latitude, longitude FROM attraction_guides');
    
    console.log('Attractions with missing coordinates:\n');
    const missing = [];
    
    rows.forEach(r => {
      if (!r.latitude || !r.longitude) {
        console.log(`❌ ${r.slug}: lat=${r.latitude}, lon=${r.longitude}`);
        missing.push(r.slug);
      } else {
        console.log(`✅ ${r.slug}: ${r.latitude}, ${r.longitude}`);
      }
    });

    console.log(`\nTotal missing: ${missing.length}`);
    if (missing.length > 0) {
      console.log('Missing slugs:', missing.join(', '));
    }

    await conn.end();
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

checkCoordinates();
