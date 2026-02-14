import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function addForeignKeyRelationships() {
  const connection = await pool.getConnection();

  try {
    console.log('Starting database restructuring...\n');

    // Step 1: Add atollId FK to island_guides if not exists
    console.log('Step 1: Checking island_guides table structure...');
    const [guides] = await connection.query(`
      SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'island_guides' AND COLUMN_NAME = 'atollId'
    `);
    
    if (guides.length === 0) {
      console.log('  Adding atollId column to island_guides...');
      await connection.query(`
        ALTER TABLE island_guides 
        ADD COLUMN atollId INT AFTER id
      `);
    }

    // Step 2: Populate atollId in island_guides from atoll string
    console.log('\nStep 2: Populating atollId in island_guides...');
    await connection.query(`
      UPDATE island_guides ig
      JOIN atolls a ON LOWER(REPLACE(ig.atoll, ' ', '')) = LOWER(REPLACE(a.name, ' ', ''))
      SET ig.atollId = a.id
      WHERE ig.atollId IS NULL
    `);
    console.log('  Populated atollId values');

    // Step 3: Add placeId FK to island_guides if not exists
    console.log('\nStep 3: Checking island_guides placeId references...');
    const [places] = await connection.query(`
      SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'island_guides' AND COLUMN_NAME = 'placeId'
    `);
    
    if (places.length === 0) {
      console.log('  Adding placeId column to island_guides...');
      await connection.query(`
        ALTER TABLE island_guides 
        ADD COLUMN placeId INT AFTER atollId
      `);
    }

    // Step 4: Link island_guides to places by name matching
    console.log('\nStep 4: Linking island_guides to places...');
    await connection.query(`
      UPDATE island_guides ig
      JOIN places p ON LOWER(REPLACE(ig.name, ' ', '')) = LOWER(REPLACE(p.name, ' ', ''))
      SET ig.placeId = p.id
      WHERE ig.placeId IS NULL AND p.type = 'island'
    `);
    console.log('  Linked island_guides to places');

    // Step 5: Update places.atollId based on island_guides
    console.log('\nStep 5: Updating places.atollId...');
    await connection.query(`
      UPDATE places p
      JOIN island_guides ig ON p.id = ig.placeId
      SET p.atollId = ig.atollId
      WHERE p.atollId IS NULL AND p.type = 'island'
    `);
    console.log('  Updated places.atollId');

    // Step 6: Report on mismatches
    console.log('\nStep 6: Checking for mismatches...');
    
    const [orphanedGuides] = await connection.query(`
      SELECT COUNT(*) as count FROM island_guides WHERE placeId IS NULL
    `);
    console.log(`  Orphaned guides (no matching place): ${orphanedGuides[0].count}`);

    const [orphanedPlaces] = await connection.query(`
      SELECT COUNT(*) as count FROM places p
      LEFT JOIN island_guides ig ON p.id = ig.placeId
      WHERE p.type = 'island' AND ig.id IS NULL
    `);
    console.log(`  Islands without guides: ${orphanedPlaces[0].count}`);

    const [linkedGuides] = await connection.query(`
      SELECT COUNT(*) as count FROM island_guides WHERE placeId IS NOT NULL
    `);
    console.log(`  Successfully linked guides: ${linkedGuides[0].count}`);

    // Step 7: Summary statistics
    console.log('\nStep 7: Summary Statistics');
    const [totalIslands] = await connection.query(`
      SELECT COUNT(*) as count FROM places WHERE type = 'island'
    `);
    const [totalGuides] = await connection.query(`
      SELECT COUNT(*) as count FROM island_guides
    `);
    
    console.log(`  Total islands in places: ${totalIslands[0].count}`);
    console.log(`  Total guides in island_guides: ${totalGuides[0].count}`);
    console.log(`  Linked guides: ${linkedGuides[0].count}`);
    console.log(`  Coverage: ${((linkedGuides[0].count / totalIslands[0].count) * 100).toFixed(1)}%`);

    console.log('\n✅ Database restructuring completed successfully!');

  } catch (error) {
    console.error('❌ Error during database restructuring:', error);
    throw error;
  } finally {
    await connection.release();
    await pool.end();
  }
}

// Run the migration
addForeignKeyRelationships().catch(console.error);
