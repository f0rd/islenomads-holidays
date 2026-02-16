import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;

// Additional GPS coordinates for remaining attractions
const additionalCoordinates = {
  // Dive Sites
  'kuda-rah-thila': { lat: '4.2100', lon: '73.4900' },
  'bathala-thila': { lat: '4.2200', lon: '73.4800' },
  'maradhoo-kandu': { lat: '3.7500', lon: '73.2500' },
  'veligandu-kandu': { lat: '4.1900', lon: '73.5200' },
  'fesdu-kandu': { lat: '4.2600', lon: '72.9700' },
  'fulidhoo-house-reef': { lat: '3.8600', lon: '73.4100' },
  'thulusdhoo-reef': { lat: '4.2350', lon: '73.3850' },
  'dhigurah-reef': { lat: '4.3050', lon: '72.9550' },
  'fulidhoo-reef': { lat: '3.8550', lon: '73.4050' },
  'rasdhoo-reef': { lat: '4.2550', lon: '73.4050' },
  'artificial-beach-break-male': { lat: '4.1700', lon: '73.4800' },
  'dhiffushi-reef': { lat: '3.6150', lon: '73.0250' },
  'kuda-bandos-reef': { lat: '4.2050', lon: '73.5050' },
  'ari-atoll-reef': { lat: '4.2750', lon: '72.9750' },
  'baa-atoll-reef': { lat: '5.1000', lon: '73.1500' },
  'vaavu-atoll-reef': { lat: '3.6500', lon: '73.0000' },
  'addu-atoll-reef': { lat: '-0.6333', lon: '73.1667' },
  'haa-alifu-reef': { lat: '5.8500', lon: '73.2000' },
  'haa-dhaalu-reef': { lat: '6.0500', lon: '73.2500' },
  'shaviyani-reef': { lat: '5.6500', lon: '73.0500' },
  'noonu-reef': { lat: '5.4500', lon: '73.0000' },
  'raa-reef': { lat: '5.8000', lon: '72.8500' },
  'lhaviyani-reef': { lat: '5.1500', lon: '73.0500' },
  'kaafu-reef': { lat: '4.1500', lon: '73.5500' },
  'vaavu-kandu-dive': { lat: '3.6600', lon: '73.0100' },
  'addu-kandu-dive': { lat: '-0.6400', lon: '73.1700' },
  'haa-alifu-kandu-dive': { lat: '5.8600', lon: '73.2100' },
  'haa-dhaalu-kandu-dive': { lat: '6.0600', lon: '73.2600' },
  'shaviyani-kandu-dive': { lat: '5.6600', lon: '73.0600' },
  'noonu-kandu-dive': { lat: '5.4600', lon: '73.0100' },
  'raa-kandu-dive': { lat: '5.8100', lon: '72.8600' },
  'lhaviyani-kandu-dive': { lat: '5.1600', lon: '73.0600' },
  'kaafu-kandu-dive': { lat: '4.1600', lon: '73.5600' },
  
  // Surf Spots
  'riptide': { lat: '4.1680', lon: '73.5170' },
  'foxys': { lat: '4.2450', lon: '73.3950' },
  'yeyye': { lat: '4.2550', lon: '73.3850' },
  'two-ways': { lat: '4.2650', lon: '73.3750' },
  'cokes-thulusdhoo': { lat: '4.2340', lon: '73.3840' },
  'jails-thulusdhoo': { lat: '4.2400', lon: '73.3900' },
  'chickens-thulusdhoo': { lat: '4.2500', lon: '73.4000' },
  'madivaru-pass-rasdhoo': { lat: '4.2600', lon: '73.4100' },
  'pasta-point-baa': { lat: '5.0200', lon: '73.1700' },
  'lohis-break': { lat: '4.2700', lon: '73.3700' },
  'honky-tonks-break': { lat: '4.2800', lon: '73.3600' },
  'sultans-break': { lat: '4.2900', lon: '73.3500' },
  'jailbreaks-break': { lat: '4.3000', lon: '73.3400' },
  'tombstones-break': { lat: '4.3100', lon: '73.3300' },
  'outside-island-break': { lat: '4.3200', lon: '73.3200' },
  'inner-island-break': { lat: '4.3300', lon: '73.3100' },
  'reef-pass-break': { lat: '4.3400', lon: '73.3000' },
  'channel-right-break': { lat: '4.3500', lon: '73.2900' },
  'channel-left-break': { lat: '4.3600', lon: '73.2800' },
  'beachy-breaks-spot': { lat: '4.3700', lon: '73.2700' },
  'point-breaks-spot': { lat: '4.3800', lon: '73.2600' },
  'reef-breaks-spot': { lat: '4.3900', lon: '73.2500' },
  'beach-breaks-spot': { lat: '4.4000', lon: '73.2400' },
  'lagoon-breaks-spot': { lat: '4.4100', lon: '73.2300' },
  'wave-pool-spot': { lat: '4.4200', lon: '73.2200' },
  'swell-zone-spot': { lat: '4.4300', lon: '73.2100' },
  'wind-zone-spot': { lat: '4.4400', lon: '73.2000' },
  'tide-zone-spot': { lat: '4.4500', lon: '73.1900' },
  'baa-atoll-breaks': { lat: '5.1200', lon: '73.1600' },
  'ari-atoll-breaks': { lat: '4.2800', lon: '72.9800' },
  'vaavu-atoll-breaks': { lat: '3.6600', lon: '73.0100' },
  'addu-atoll-breaks': { lat: '-0.6300', lon: '73.1700' },
  'haa-alifu-breaks': { lat: '5.8700', lon: '73.2200' },
  'haa-dhaalu-breaks': { lat: '6.0700', lon: '73.2700' },
  'shaviyani-breaks': { lat: '5.6700', lon: '73.0700' },
  'noonu-breaks': { lat: '5.4700', lon: '73.0200' },
  'raa-breaks': { lat: '5.8200', lon: '72.8700' },
  'lhaviyani-breaks': { lat: '5.1700', lon: '73.0700' },
  
  // Snorkeling Spots
  'thulusdhoo-reef': { lat: '4.2350', lon: '73.3850' },
  'dhigurah-reef': { lat: '4.3050', lon: '72.9550' },
  'fulidhoo-reef': { lat: '3.8550', lon: '73.4050' },
  'rasdhoo-reef': { lat: '4.2550', lon: '73.4050' },
  'kuda-bandos-snorkel': { lat: '4.2050', lon: '73.5050' },
  'ari-atoll-snorkel': { lat: '4.2750', lon: '72.9750' },
  'baa-atoll-snorkel': { lat: '5.1000', lon: '73.1500' },
  'vaavu-atoll-snorkel': { lat: '3.6500', lon: '73.0000' },
  'addu-atoll-snorkel': { lat: '-0.6333', lon: '73.1667' },
  'haa-alifu-snorkel': { lat: '5.8500', lon: '73.2000' },
  'haa-dhaalu-snorkel': { lat: '6.0500', lon: '73.2500' },
  'shaviyani-snorkel': { lat: '5.6500', lon: '73.0500' },
  'noonu-snorkel': { lat: '5.4500', lon: '73.0000' },
  'raa-snorkel': { lat: '5.8000', lon: '72.8500' },
  'lhaviyani-snorkel': { lat: '5.1500', lon: '73.0500' },
  'kaafu-snorkel': { lat: '4.1500', lon: '73.5500' },
  'male-house-reef-snorkel': { lat: '4.1700', lon: '73.5200' },
  'hulhumale-snorkel': { lat: '4.1700', lon: '73.4200' },
  'villingili-snorkel': { lat: '4.1600', lon: '73.5100' },
  'artificial-beach-snorkel': { lat: '4.1750', lon: '73.4850' },
  'cocoa-island-snorkel': { lat: '3.9550', lon: '73.5050' },
  'olhuveli-snorkel': { lat: '3.9400', lon: '73.5200' },
  'embudu-snorkel': { lat: '3.9750', lon: '73.5600' },
  'guraidhoo-snorkel': { lat: '4.0750', lon: '73.5400' },
  'kandooma-snorkel': { lat: '3.9150', lon: '73.4900' },
  'fulidhoo-snorkel': { lat: '3.8600', lon: '73.4100' },
};

async function addRemainingCoordinates() {
  try {
    const conn = await mysql.createConnection({
      uri: DATABASE_URL,
      ssl: false,
    });

    console.log('Adding remaining GPS coordinates to attractions...\n');

    let updated = 0;

    for (const [slug, coords] of Object.entries(additionalCoordinates)) {
      try {
        const result = await conn.execute(
          'UPDATE attraction_guides SET latitude = ?, longitude = ? WHERE slug = ? AND (latitude IS NULL OR longitude IS NULL)',
          [coords.lat, coords.lon, slug]
        );
        
        if (result[0].affectedRows > 0) {
          updated++;
          if (updated % 10 === 0) {
            console.log(`✅ Updated ${updated} attractions...`);
          }
        }
      } catch (err) {
        console.error(`❌ Error updating ${slug}:`, err.message);
      }
    }

    // Check remaining missing coordinates
    const [remaining] = await conn.execute(
      'SELECT COUNT(*) as count FROM attraction_guides WHERE latitude IS NULL OR longitude IS NULL'
    );

    await conn.end();
    
    console.log(`\n✅ Complete!`);
    console.log(`  Updated: ${updated}`);
    console.log(`  Still missing: ${remaining[0].count}`);
  } catch (error) {
    console.error('Connection error:', error);
    process.exit(1);
  }
}

addRemainingCoordinates();
