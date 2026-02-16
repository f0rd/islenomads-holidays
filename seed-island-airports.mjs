import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DATABASE_URL?.split('@')[1]?.split('/')[0] || 'localhost',
  user: process.env.DATABASE_URL?.split('://')[1]?.split(':')[0] || 'root',
  password: process.env.DATABASE_URL?.split(':')[2]?.split('@')[0] || '',
  database: process.env.DATABASE_URL?.split('/').pop() || 'test',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const islandAirportMappings = [
  {
    islandSlug: 'maafushi',
    airports: [
      {
        name: 'Malé International Airport',
        code: 'MLE',
        transferType: 'speedboat',
        duration: '45 minutes',
        distance: '45 km',
        description: 'International flights arrive here. Take a speedboat to Maafushi.'
      }
    ]
  },
  {
    islandSlug: 'dharavandhoo',
    airports: [
      {
        name: 'Dharavandhoo Airport',
        code: 'DRV',
        transferType: 'domestic flight',
        duration: '30 minutes flight',
        distance: 'Direct flight',
        description: 'Domestic flights from Malé. Direct airport access.'
      },
      {
        name: 'Malé International Airport',
        code: 'MLE',
        transferType: 'speedboat',
        duration: '2 hours',
        distance: '90 km',
        description: 'Alternative: International flights to Malé, then speedboat or domestic flight.'
      }
    ]
  },
  {
    islandSlug: 'dhigurah',
    airports: [
      {
        name: 'Maamigili Airport',
        code: 'VAM',
        transferType: 'speedboat',
        duration: '30 minutes',
        distance: '25 km',
        description: 'Domestic flights to Maamigili, then speedboat to Dhigurah.'
      },
      {
        name: 'Malé International Airport',
        code: 'MLE',
        transferType: 'speedboat',
        duration: '1.5 hours',
        distance: '75 km',
        description: 'International flights to Malé, then speedboat to Dhigurah.'
      }
    ]
  },
  {
    islandSlug: 'thulusdhoo',
    airports: [
      {
        name: 'Malé International Airport',
        code: 'MLE',
        transferType: 'speedboat',
        duration: '30 minutes',
        distance: '30 km',
        description: 'International flights to Malé, then speedboat to Thulusdhoo.'
      }
    ]
  },
  {
    islandSlug: 'maamigili',
    airports: [
      {
        name: 'Maamigili Airport',
        code: 'VAM',
        transferType: 'domestic flight',
        duration: 'Direct flight',
        distance: 'Direct',
        description: 'Domestic flights from Malé arrive directly at Maamigili.'
      },
      {
        name: 'Malé International Airport',
        code: 'MLE',
        transferType: 'speedboat',
        duration: '1 hour',
        distance: '50 km',
        description: 'International flights to Malé, then speedboat to Maamigili.'
      }
    ]
  },
  {
    islandSlug: 'fulidhoo',
    airports: [
      {
        name: 'Malé International Airport',
        code: 'MLE',
        transferType: 'speedboat',
        duration: '1 hour',
        distance: '60 km',
        description: 'International flights to Malé, then speedboat to Fulidhoo.'
      }
    ]
  },
  {
    islandSlug: 'kandooma',
    airports: [
      {
        name: 'Malé International Airport',
        code: 'MLE',
        transferType: 'speedboat',
        duration: '30 minutes',
        distance: '35 km',
        description: 'International flights to Malé, then speedboat to Kandooma.'
      }
    ]
  },
  {
    islandSlug: 'vilamendhoo',
    airports: [
      {
        name: 'Gan International Airport',
        code: 'GAN',
        transferType: 'speedboat',
        duration: '45 minutes',
        distance: '40 km',
        description: 'Flights to Gan, then speedboat to Vilamendhoo.'
      },
      {
        name: 'Malé International Airport',
        code: 'MLE',
        transferType: 'speedboat',
        duration: '2 hours',
        distance: '120 km',
        description: 'International flights to Malé, then speedboat to Vilamendhoo.'
      }
    ]
  },
  {
    islandSlug: 'adaaran-prestige-water-villas',
    airports: [
      {
        name: 'Malé International Airport',
        code: 'MLE',
        transferType: 'speedboat',
        duration: '45 minutes',
        distance: '50 km',
        description: 'International flights to Malé, then speedboat to resort.'
      }
    ]
  },
  {
    islandSlug: 'banyan-tree-vabbinfaru',
    airports: [
      {
        name: 'Malé International Airport',
        code: 'MLE',
        transferType: 'speedboat',
        duration: '20 minutes',
        distance: '15 km',
        description: 'International flights to Malé, then speedboat to resort.'
      }
    ]
  }
];

async function seedIslandAirports() {
  const connection = await pool.getConnection();
  
  try {
    console.log('Starting island airport mapping...');
    
    for (const mapping of islandAirportMappings) {
      const nearbyAirportsJson = JSON.stringify(mapping.airports);
      
      const query = `
        UPDATE island_guides 
        SET nearbyAirports = ? 
        WHERE slug = ?
      `;
      
      const [result] = await connection.execute(query, [nearbyAirportsJson, mapping.islandSlug]);
      
      if (result.affectedRows > 0) {
        console.log(`✓ Updated ${mapping.islandSlug} with ${mapping.airports.length} airport(s)`);
      } else {
        console.log(`✗ Island not found: ${mapping.islandSlug}`);
      }
    }
    
    console.log('\n✓ Island airport mapping completed!');
  } catch (error) {
    console.error('Error seeding island airports:', error);
    throw error;
  } finally {
    await connection.release();
    await pool.end();
  }
}

seedIslandAirports();
