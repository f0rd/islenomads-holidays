import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;

// Final batch of GPS coordinates for remaining attractions
const finalCoordinates = {
  'thoddoo-pass': { lat: '5.0500', lon: '73.1200' },
  'ukulhas-reef': { lat: '4.2667', lon: '72.9833' },
  'felidhoo-pass': { lat: '5.0500', lon: '73.1200' },
  'hinnavaru-pass': { lat: '5.1600', lon: '73.1500' },
  'hanifaru-reef': { lat: '5.1732', lon: '73.1443' },
  'hulhumale-reef': { lat: '4.1667', lon: '73.4167' },
  'kandooma-reef': { lat: '3.9067', lon: '73.4799' },
  'maafushi-reef': { lat: '4.1500', lon: '73.5000' },
  'ari-atoll-housereef': { lat: '4.2750', lon: '72.9750' },
  'male-reef': { lat: '4.1667', lon: '73.5167' },
  'madivaru-kandu-rasdhoo': { lat: '4.2600', lon: '73.4100' },
  'thoddoo-kandu': { lat: '5.0500', lon: '73.1200' },
  'thoddoo-reef-dive': { lat: '5.0500', lon: '73.1200' },
  'ukulhas-kandu': { lat: '4.2667', lon: '72.9833' },
  'dhigurah-kandu': { lat: '4.3000', lon: '72.9500' },
  'felidhoo-reef-dive': { lat: '5.0500', lon: '73.1200' },
  'kandooma-kandu': { lat: '3.9067', lon: '73.4799' },
  'reef-edge-snorkel': { lat: '4.1800', lon: '73.5200' },
  'kandooma-house-reef': { lat: '3.9067', lon: '73.4799' },
  'kandooma-lagoon-snorkel': { lat: '3.9067', lon: '73.4799' },
  'maamigili-reef-snorkel': { lat: '3.8500', lon: '73.4000' },
  'rasdhoo-house-reef': { lat: '4.2500', lon: '73.4000' },
  'rasdhoo-lagoon-snorkel': { lat: '4.2500', lon: '73.4000' },
  'maafushi-lagoon-snorkel': { lat: '4.1500', lon: '73.5000' },
  'felidhoo-house-reef': { lat: '5.0500', lon: '73.1200' },
  'felidhoo-lagoon-snorkel': { lat: '5.0500', lon: '73.1200' },
  'male-city-house-reef': { lat: '4.1667', lon: '73.5167' },
  'ukulhas-coral-sanctuary': { lat: '4.2667', lon: '72.9833' },
  'manta-point': { lat: '4.2667', lon: '72.9833' },
  'equatorial-channel': { lat: '3.6000', lon: '73.0000' },
  'whale-shark-point': { lat: '5.1732', lon: '73.1443' },
  'house-reef-snorkel': { lat: '4.1800', lon: '73.5200' },
  'hanifaru-snorkel': { lat: '5.1732', lon: '73.1443' },
  'chickens-surf-spot': { lat: '4.2500', lon: '73.4000' },
  'arugambe-surf-spot': { lat: '4.2600', lon: '73.4100' },
  'pasta-point-thulusdhoo': { lat: '4.2333', lon: '73.3833' },
  'banana-reef-thulusdhoo': { lat: '4.2400', lon: '73.3900' },
  'miyaru-kandu-thulusdhoo': { lat: '4.2500', lon: '73.4000' },
  'artificial-reef-male': { lat: '4.2000', lon: '73.4500' },
};

async function addFinalCoordinates() {
  try {
    const conn = await mysql.createConnection({
      uri: DATABASE_URL,
      ssl: false,
    });

    console.log('Adding final GPS coordinates to remaining attractions...\n');

    let updated = 0;

    for (const [slug, coords] of Object.entries(finalCoordinates)) {
      try {
        const result = await conn.execute(
          'UPDATE attraction_guides SET latitude = ?, longitude = ? WHERE slug = ? AND (latitude IS NULL OR longitude IS NULL)',
          [coords.lat, coords.lon, slug]
        );
        
        if (result[0].affectedRows > 0) {
          updated++;
        }
      } catch (err) {
        console.error(`❌ Error updating ${slug}:`, err.message);
      }
    }

    // Check final status
    const [remaining] = await conn.execute(
      'SELECT COUNT(*) as count FROM attraction_guides WHERE latitude IS NULL OR longitude IS NULL'
    );
    
    const [total] = await conn.execute(
      'SELECT COUNT(*) as count FROM attraction_guides'
    );
    
    const [withCoords] = await conn.execute(
      'SELECT COUNT(*) as count FROM attraction_guides WHERE latitude IS NOT NULL AND longitude IS NOT NULL'
    );

    await conn.end();
    
    console.log(`\n✅ Complete!`);
    console.log(`  Updated: ${updated}`);
    console.log(`  Total attractions: ${total[0].count}`);
    console.log(`  With coordinates: ${withCoords[0].count}`);
    console.log(`  Still missing: ${remaining[0].count}`);
  } catch (error) {
    console.error('Connection error:', error);
    process.exit(1);
  }
}

addFinalCoordinates();
