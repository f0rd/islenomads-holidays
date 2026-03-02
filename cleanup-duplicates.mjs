import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'islenomads',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function findDuplicates() {
  const connection = await pool.getConnection();
  try {
    console.log('🔍 Scanning for duplicate attractions...\n');

    // Find duplicates by name and type
    const [duplicates] = await connection.query(`
      SELECT 
        name, 
        attractionType, 
        COUNT(*) as count,
        GROUP_CONCAT(id) as ids
      FROM attraction_guides
      GROUP BY name, attractionType
      HAVING count > 1
      ORDER BY count DESC
    `);

    if (duplicates.length === 0) {
      console.log('✅ No duplicates found!');
      return;
    }

    console.log(`Found ${duplicates.length} duplicate groups:\n`);

    for (const dup of duplicates) {
      console.log(`📌 "${dup.name}" (${dup.attractionType})`);
      console.log(`   Count: ${dup.count}`);
      console.log(`   IDs: ${dup.ids}\n`);
    }

    // Get detailed info about specific duplicate IDs mentioned in errors
    console.log('🔎 Detailed info for IDs 210066 and 210044:\n');
    
    const [detailedDups] = await connection.query(`
      SELECT id, name, attractionType, overview, published, featured, createdAt
      FROM attraction_guides
      WHERE id IN (210066, 210044)
      ORDER BY id
    `);

    for (const guide of detailedDups) {
      console.log(`ID: ${guide.id}`);
      console.log(`Name: ${guide.name}`);
      console.log(`Type: ${guide.attractionType}`);
      console.log(`Published: ${guide.published}`);
      console.log(`Featured: ${guide.featured}`);
      console.log(`Created: ${guide.createdAt}\n`);
    }

    // Check for island links
    console.log('🔗 Island links for duplicate IDs:\n');
    
    const [links] = await connection.query(`
      SELECT 
        ail.attractionId,
        COUNT(*) as island_count,
        GROUP_CONCAT(ail.islandGuideId) as island_ids
      FROM attraction_island_links ail
      WHERE ail.attractionId IN (210066, 210044)
      GROUP BY ail.attractionId
    `);

    for (const link of links) {
      console.log(`Attraction ID ${link.attractionId}: linked to ${link.island_count} islands`);
      console.log(`Island IDs: ${link.island_ids}\n`);
    }

  } finally {
    await connection.release();
    await pool.end();
  }
}

findDuplicates().catch(console.error);
