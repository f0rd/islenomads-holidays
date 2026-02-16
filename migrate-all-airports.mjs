import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'islenomads',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function migrateAirports() {
  const connection = await pool.getConnection();
  
  try {
    console.log('Starting airport migration for all islands...');
    
    // Get all islands with transportation info
    const [islands] = await connection.query(
      `SELECT id, name, slug, flightInfo, speedboatInfo, ferryInfo, nearbyAirports 
       FROM island_guides 
       WHERE flightInfo IS NOT NULL OR speedboatInfo IS NOT NULL OR ferryInfo IS NOT NULL`
    );
    
    console.log(`Found ${islands.length} islands to migrate`);
    
    let updated = 0;
    let skipped = 0;
    
    for (const island of islands) {
      // Skip if nearbyAirports is already populated
      if (island.nearbyAirports && island.nearbyAirports.length > 0) {
        console.log(`✓ Skipping ${island.name} (already has nearbyAirports)`);
        skipped++;
        continue;
      }
      
      // Build nearbyAirports array based on existing data
      const airports = [];
      
      // Parse flightInfo to extract airport details
      if (island.flightInfo) {
        const flightMatch = island.flightInfo.match(/(\w+)\s+(?:International|Domestic)\s+Airport/i);
        const airportName = flightMatch ? `${flightMatch[1]} International Airport` : 'Malé International Airport';
        const airportCode = flightMatch ? flightMatch[1].substring(0, 3).toUpperCase() : 'MLE';
        
        airports.push({
          name: airportName,
          code: airportCode,
          transferType: 'Speedboat',
          duration: '1-2 hours',
          distance: '50-100 km',
          description: island.flightInfo.trim()
        });
      }
      
      // Add domestic flight option if available
      if (island.speedboatInfo && !island.flightInfo) {
        airports.push({
          name: 'Malé International Airport',
          code: 'MLE',
          transferType: 'Speedboat',
          duration: '1-2 hours',
          distance: '50-100 km',
          description: island.speedboatInfo.trim()
        });
      }
      
      // Add ferry option if available
      if (island.ferryInfo) {
        airports.push({
          name: 'Ferry Service',
          code: 'FERRY',
          transferType: 'Ferry',
          duration: '2-4 hours',
          distance: '50-150 km',
          description: island.ferryInfo.trim()
        });
      }
      
      // If no airports were added, add default Malé
      if (airports.length === 0) {
        airports.push({
          name: 'Malé International Airport',
          code: 'MLE',
          transferType: 'Speedboat',
          duration: '1-2 hours',
          distance: '50-100 km',
          description: 'International flights to Malé, then speedboat to ' + island.name
        });
      }
      
      // Update the island with nearbyAirports
      const nearbyAirportsJSON = JSON.stringify(airports);
      await connection.query(
        'UPDATE island_guides SET nearbyAirports = ? WHERE id = ?',
        [nearbyAirportsJSON, island.id]
      );
      
      console.log(`✓ Updated ${island.name} with ${airports.length} airport option(s)`);
      updated++;
    }
    
    console.log(`\n✅ Migration complete!`);
    console.log(`   Updated: ${updated} islands`);
    console.log(`   Skipped: ${skipped} islands (already have nearbyAirports)`);
    
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  } finally {
    await connection.release();
    await pool.end();
  }
}

migrateAirports().catch(console.error);
