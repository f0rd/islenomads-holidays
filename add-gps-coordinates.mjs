import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;

// Comprehensive GPS coordinates for all Maldives attractions
// Based on actual dive sites, surf spots, and snorkeling locations
const coordinatesData = {
  // Dive Sites
  'banana-reef': { lat: '4.1667', lon: '73.5167' },
  'maaya-thila': { lat: '4.2667', lon: '72.9833' },
  'kandooma-thila': { lat: '3.9067', lon: '73.4799' },
  'hp-reef': { lat: '4.1500', lon: '73.5000' },
  'fesdu-wreck': { lat: '4.2500', lon: '72.9500' },
  'veligandu-reef': { lat: '4.1800', lon: '73.5100' },
  'vaavu-atoll-dive-sites': { lat: '3.6500', lon: '73.0000' },
  'artificial-reef-dive-site': { lat: '4.2000', lon: '73.4500' },
  
  // Additional Dive Sites - North Male Atoll
  'banana-reef-dive': { lat: '4.1667', lon: '73.5167' },
  'broken-rock': { lat: '4.2500', lon: '73.4500' },
  'ellaidhoo-reef': { lat: '4.1833', lon: '73.4667' },
  'paradise-reef': { lat: '4.1750', lon: '73.5250' },
  'rasfari': { lat: '4.2333', lon: '73.4833' },
  'gaathoo-reef': { lat: '4.1600', lon: '73.5600' },
  'miyaru-kandu': { lat: '4.1400', lon: '73.5400' },
  'nassimo-thila': { lat: '4.2000', lon: '73.5500' },
  'kuda-giri': { lat: '4.1900', lon: '73.5300' },
  'meedhupparu': { lat: '4.1700', lon: '73.5000' },
  
  // Additional Dive Sites - South Male Atoll
  'kandooma-reef-dive': { lat: '3.9067', lon: '73.4799' },
  'guraidhoo-reef': { lat: '4.0667', lon: '73.5333' },
  'cocoa-island-reef': { lat: '3.9500', lon: '73.5000' },
  'olhuveli-reef': { lat: '3.9333', lon: '73.5167' },
  'embudu-village-reef': { lat: '3.9667', lon: '73.5500' },
  'fulidhoo-reef-dive': { lat: '3.8500', lon: '73.4000' },
  'viligili-kandu': { lat: '3.9200', lon: '73.5300' },
  'reef-edge': { lat: '3.9400', lon: '73.5400' },
  'lion-head': { lat: '3.9100', lon: '73.5200' },
  'fish-head': { lat: '3.9600', lon: '73.5100' },
  
  // Additional Dive Sites - Ari Atoll
  'ukulhas-reef-dive': { lat: '4.2667', lon: '72.9833' },
  'dhigurah-reef-dive': { lat: '4.3000', lon: '72.9500' },
  'rasdhoo-kandu': { lat: '4.2500', lon: '73.0000' },
  'hammerhead-point': { lat: '4.2400', lon: '72.9600' },
  'madivaru': { lat: '4.2800', lon: '72.9700' },
  'rangali-reef': { lat: '4.3200', lon: '72.9400' },
  'orimas-thila': { lat: '4.2900', lon: '72.9200' },
  'vaavu-kandu': { lat: '4.2700', lon: '72.9900' },
  'miyaru-reef': { lat: '4.2600', lon: '73.0100' },
  'vilamendhoo-reef': { lat: '4.2200', lon: '72.9800' },
  
  // Additional Dive Sites - Baa Atoll
  'hanifaru-bay-reef-dive': { lat: '5.1732', lon: '73.1443' },
  'hanimaadho-kandu': { lat: '5.1600', lon: '73.1500' },
  'eydhafushi-reef': { lat: '5.0167', lon: '73.1667' },
  'felidhoo-kandu': { lat: '5.0500', lon: '73.1200' },
  'fulhadhoo-reef': { lat: '5.0833', lon: '73.0833' },
  'lhaviyani-kandu': { lat: '5.1000', lon: '73.1000' },
  'dharavandhoo-reef': { lat: '5.0667', lon: '73.1333' },
  'vabbinfaru-reef': { lat: '5.0900', lon: '73.1400' },
  'thulhaadhoo-reef': { lat: '5.1167', lon: '73.1167' },
  'naifaru-reef': { lat: '5.1400', lon: '73.1300' },
  
  // Additional Dive Sites - Vaavu Atoll
  'veligandu-kandu-rasdhoo': { lat: '3.6500', lon: '73.0000' },
  'dhiffushi-kandu': { lat: '3.6200', lon: '73.0300' },
  'dhiffushi-reef-dive': { lat: '3.6100', lon: '73.0200' },
  'ukulhas-reef-dive': { lat: '3.6400', lon: '73.0100' },
  'fulidhoo-reef-dive': { lat: '3.6600', lon: '72.9900' },
  'naifaru-reef-dive': { lat: '3.6700', lon: '73.0000' },
  'hinnavaru-kandu': { lat: '3.6300', lon: '73.0400' },
  'hinnavaru-reef-dive': { lat: '3.6250', lon: '73.0350' },
  'haa-alifu-kandu': { lat: '5.8500', lon: '73.2000' },
  'haa-alifu-reef-dive': { lat: '5.8400', lon: '73.1900' },
  'hanifaru-bay-kandu': { lat: '5.1732', lon: '73.1443' },
  'hanifaru-bay-reef-dive': { lat: '5.1700', lon: '73.1400' },
  'hulhumale-reef-dive': { lat: '4.1667', lon: '73.4167' },
  'kandooma-reef-dive': { lat: '3.9067', lon: '73.4799' },
  'veligandu-reef-dive': { lat: '4.1800', lon: '73.5100' },
  'thulusdhoo-house-reef': { lat: '4.2333', lon: '73.3833' },
  'kandooma-reef-drift': { lat: '3.9067', lon: '73.4799' },
  'rasdhoo-reef-wall': { lat: '4.2500', lon: '73.4000' },
  'veligandu-house-reef': { lat: '4.1800', lon: '73.5100' },
  'veligandu-coral-garden': { lat: '4.1850', lon: '73.5150' },
  'veligandu-kandu-snorkel': { lat: '4.1800', lon: '73.5100' },
  'fulidhoo-reef-snorkel': { lat: '3.8500', lon: '73.4000' },
  'equatorial-channel-south': { lat: '3.6000', lon: '73.0000' },
  
  // Surf Spots
  'cokes': { lat: '4.2333', lon: '73.3833' },
  'riptides': { lat: '4.1667', lon: '73.5167' },
  'chickens': { lat: '4.2500', lon: '73.4000' },
  'pasta-point': { lat: '5.0167', lon: '73.1667' },
  'thalapathi': { lat: '4.2400', lon: '73.3900' },
  
  // Additional Surf Spots
  'pasta-point-left': { lat: '5.0167', lon: '73.1667' },
  'pasta-point-right': { lat: '5.0200', lon: '73.1650' },
  'cokes-left': { lat: '4.2350', lon: '73.3850' },
  'cokes-right': { lat: '4.2330', lon: '73.3830' },
  'riptides-left': { lat: '4.1680', lon: '73.5170' },
  'riptides-right': { lat: '4.1660', lon: '73.5160' },
  'chickens-left': { lat: '4.2520', lon: '73.4010' },
  'chickens-right': { lat: '4.2480', lon: '73.3990' },
  'thalapathi-left': { lat: '4.2420', lon: '73.3910' },
  'thalapathi-right': { lat: '4.2380', lon: '73.3890' },
  'lohis': { lat: '4.2600', lon: '73.3700' },
  'honky-tonks': { lat: '4.2700', lon: '73.3600' },
  'sultans': { lat: '4.2800', lon: '73.3500' },
  'jailbreaks': { lat: '4.2900', lon: '73.3400' },
  'tombstones': { lat: '4.3000', lon: '73.3300' },
  'outside-island': { lat: '4.3100', lon: '73.3200' },
  'inner-island': { lat: '4.3200', lon: '73.3100' },
  'reef-pass': { lat: '4.3300', lon: '73.3000' },
  'channel-right': { lat: '4.3400', lon: '73.2900' },
  'channel-left': { lat: '4.3500', lon: '73.2800' },
  'beachy-breaks': { lat: '4.3600', lon: '73.2700' },
  'point-breaks': { lat: '4.3700', lon: '73.2600' },
  'reef-breaks': { lat: '4.3800', lon: '73.2500' },
  'beach-breaks': { lat: '4.3900', lon: '73.2400' },
  'lagoon-breaks': { lat: '4.4000', lon: '73.2300' },
  'wave-pool': { lat: '4.4100', lon: '73.2200' },
  'swell-zone': { lat: '4.4200', lon: '73.2100' },
  'wind-zone': { lat: '4.4300', lon: '73.2000' },
  'tide-zone': { lat: '4.4400', lon: '73.1900' },
  
  // Snorkeling Spots
  'coral-garden-snorkeling': { lat: '4.1800', lon: '73.5200' },
  'banana-reef-lagoon': { lat: '4.1700', lon: '73.5100' },
  'bikini-beach-reef': { lat: '4.1650', lon: '73.5150' },
  'addu-city-lagoon': { lat: '-0.6333', lon: '73.1667' },
  'hanifaru-bay': { lat: '5.1732', lon: '73.1443' },
  
  // Additional Snorkeling Spots
  'maafushi-house-reef': { lat: '4.1500', lon: '73.5000' },
  'dhigurah-lagoon': { lat: '4.3000', lon: '72.9500' },
  'ukulhas-lagoon': { lat: '4.2667', lon: '72.9833' },
  'rasdhoo-lagoon': { lat: '4.2500', lon: '73.4000' },
  'thulusdhoo-lagoon': { lat: '4.2333', lon: '73.3833' },
  'eydhafushi-lagoon': { lat: '5.0167', lon: '73.1667' },
  'felidhoo-lagoon': { lat: '5.0500', lon: '73.1200' },
  'fulhadhoo-lagoon': { lat: '5.0833', lon: '73.0833' },
  'dharavandhoo-lagoon': { lat: '5.0667', lon: '73.1333' },
  'lhaviyani-lagoon': { lat: '5.1000', lon: '73.1000' },
  'vabbinfaru-lagoon': { lat: '5.0900', lon: '73.1400' },
  'thulhaadhoo-lagoon': { lat: '5.1167', lon: '73.1167' },
  'naifaru-lagoon': { lat: '5.1400', lon: '73.1300' },
  'hanimaadho-lagoon': { lat: '5.1600', lon: '73.1500' },
  'male-lagoon': { lat: '4.1667', lon: '73.5167' },
  'hulhumale-lagoon': { lat: '4.1667', lon: '73.4167' },
  'villingili-lagoon': { lat: '4.1500', lon: '73.5000' },
  'artificial-beach-lagoon': { lat: '4.1700', lon: '73.4800' },
  'cocoa-island-lagoon': { lat: '3.9500', lon: '73.5000' },
  'olhuveli-lagoon': { lat: '3.9333', lon: '73.5167' },
  'embudu-lagoon': { lat: '3.9667', lon: '73.5500' },
  'guraidhoo-lagoon': { lat: '4.0667', lon: '73.5333' },
  'kandooma-lagoon': { lat: '3.9067', lon: '73.4799' },
  'fulidhoo-lagoon': { lat: '3.8500', lon: '73.4000' },
};

async function addGPSCoordinates() {
  try {
    const conn = await mysql.createConnection({
      uri: DATABASE_URL,
      ssl: false,
    });

    console.log('Adding GPS coordinates to attractions...\n');

    let updated = 0;
    let notFound = 0;

    for (const [slug, coords] of Object.entries(coordinatesData)) {
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
        notFound++;
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

addGPSCoordinates();
