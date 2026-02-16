import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DATABASE_HOST || 'localhost',
  user: process.env.DATABASE_USER || 'root',
  password: process.env.DATABASE_PASSWORD || '',
  database: process.env.DATABASE_NAME || 'islenomads',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Define airport options for each island
// MLE (Malé International) is always first as the international gateway
const islandAirports = {
  'maafushi': [
    {
      name: 'Malé International Airport',
      code: 'MLE',
      transferType: 'Speedboat',
      duration: '45 minutes',
      distance: '45 km',
      description: 'International flights to Malé, then speedboat to Maafushi.'
    }
  ],
  'dhigurah': [
    {
      name: 'Malé International Airport',
      code: 'MLE',
      transferType: 'Speedboat',
      duration: '1.5 hours',
      distance: '75 km',
      description: 'International flights to Malé, then speedboat to Dhigurah.'
    },
    {
      name: 'Maamigili Airport',
      code: 'VAM',
      transferType: 'Domestic Flight',
      duration: '30 minutes',
      distance: '25 km',
      description: 'Domestic flight to Maamigili, then speedboat to Dhigurah.'
    }
  ],
  'dharavandhoo': [
    {
      name: 'Malé International Airport',
      code: 'MLE',
      transferType: 'Speedboat',
      duration: '1 hour',
      distance: '60 km',
      description: 'International flights to Malé, then speedboat to Dharavandhoo.'
    },
    {
      name: 'Dharavandhoo Airport',
      code: 'DRV',
      transferType: 'Domestic Flight',
      duration: '25 minutes',
      distance: '50 km',
      description: 'Domestic flight directly to Dharavandhoo.'
    }
  ],
  'eydhafushi': [
    {
      name: 'Malé International Airport',
      code: 'MLE',
      transferType: 'Speedboat',
      duration: '2 hours',
      distance: '120 km',
      description: 'International flights to Malé, then speedboat to Eydhafushi.'
    },
    {
      name: 'Dharavandhoo Airport',
      code: 'DRV',
      transferType: 'Domestic Flight',
      duration: '20 minutes',
      distance: '45 km',
      description: 'Domestic flight to Dharavandhoo, then speedboat to Eydhafushi.'
    }
  ]
};

async function updateAirports() {
  const connection = await pool.getConnection();
  
  try {
    console.log('Starting airport updates...');
    
    for (const [slug, airports] of Object.entries(islandAirports)) {
      const airportsJSON = JSON.stringify(airports);
      
      const query = 'UPDATE island_guides SET nearbyAirports = ? WHERE slug = ?';
      const [result] = await connection.execute(query, [airportsJSON, slug]);
      
      console.log(`✓ Updated ${slug}: ${result.affectedRows} row(s) affected`);
    }
    
    console.log('\n✓ All airports updated successfully!');
  } catch (error) {
    console.error('Error updating airports:', error);
  } finally {
    await connection.release();
    await pool.end();
  }
}

updateAirports();
