import { getDb } from './server/db.js';

(async () => {
  const db = await getDb();
  if (!db) {
    console.log('Database connection failed');
    process.exit(1);
  }
  
  const islands = await db.query.islandGuides.findMany({
    limit: 15,
    columns: {
      id: true,
      name: true,
      latitude: true,
      longitude: true,
      slug: true,
      featured: true,
      published: true
    }
  });
  
  console.log('Island Coordinates:');
  console.log('==================');
  islands.forEach((island) => {
    console.log(`${island.name} (${island.slug})`);
    console.log(`  Lat: ${island.latitude}, Lng: ${island.longitude}`);
    console.log(`  Featured: ${island.featured}, Published: ${island.published}`);
    console.log('');
  });
})();
