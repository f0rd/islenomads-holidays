const mysql = require('mysql2/promise');

const atollData = [
  { name: 'Alif Alif Atoll', slug: 'alif-alif-atoll', region: 'Central' },
  { name: 'Alif Dhaal Atoll', slug: 'alif-dhaal-atoll', region: 'North' },
  { name: 'Baa Atoll', slug: 'baa-atoll', region: 'North' },
  { name: 'Dhaalu Atoll', slug: 'dhaalu-atoll', region: 'Central' },
  { name: 'Faafu Atoll', slug: 'faafu-atoll', region: 'Central' },
  { name: 'Gaafu Alif Atoll', slug: 'gaafu-alif-atoll', region: 'South' },
  { name: 'Gaafu Dhaalu Atoll', slug: 'gaafu-dhaalu-atoll', region: 'South' },
  { name: 'Gnaviyani Atoll', slug: 'gnaviyani-atoll', region: 'South' },
  { name: 'Haa Alif Atoll', slug: 'haa-alif-atoll', region: 'North' },
  { name: 'Haa Dhaalu Atoll', slug: 'haa-dhaalu-atoll', region: 'North' },
  { name: 'Kaafu Atoll', slug: 'kaafu-atoll', region: 'Central' },
  { name: 'Laamu Atoll', slug: 'laamu-atoll', region: 'South' },
  { name: 'Meemu Atoll', slug: 'meemu-atoll', region: 'Central' },
  { name: 'Noonu Atoll', slug: 'noonu-atoll', region: 'North' },
  { name: 'Raa Atoll', slug: 'raa-atoll', region: 'North' },
  { name: 'Seenu Atoll', slug: 'seenu-atoll', region: 'South' },
  { name: 'Shaviyani Atoll', slug: 'shaviyani-atoll', region: 'North' },
  { name: 'Thaa Atoll', slug: 'thaa-atoll', region: 'Central' },
  { name: 'Vaavu Atoll', slug: 'vaavu-atoll', region: 'North' },
];

(async () => {
  const pool = mysql.createPool(process.env.DATABASE_URL);
  const conn = await pool.getConnection();
  
  try {
    console.log('Starting atoll data fix...');
    
    // Delete all existing atolls
    await conn.execute('DELETE FROM atolls');
    console.log('Deleted all existing atolls');
    
    // Insert correct atoll data
    for (const atoll of atollData) {
      await conn.execute(
        'INSERT INTO atolls (name, slug, region, description, published) VALUES (?, ?, ?, ?, 1)',
        [atoll.name, atoll.slug, atoll.region, `${atoll.name} - A beautiful atoll in the Maldives`]
      );
    }
    console.log(`Inserted ${atollData.length} atolls`);
    
    // Verify
    const [rows] = await conn.execute('SELECT COUNT(*) as count FROM atolls');
    console.log(`Total atolls in database: ${rows[0].count}`);
    
    const [allAtolls] = await conn.execute('SELECT id, name, slug FROM atolls ORDER BY name');
    console.log('\nAtolls in database:');
    allAtolls.forEach(a => console.log(`  ${a.name} (${a.slug})`));
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    conn.release();
    pool.end();
  }
})();
