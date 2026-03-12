import Database from 'better-sqlite3';

const db = new Database('.manus/db.sqlite3');
const islands = db.prepare('SELECT name, atoll FROM island_guides ORDER BY name').all();

console.log('=== ALL ISLANDS IN DATABASE ===\n');
islands.forEach(island => {
  console.log(`${island.name} (${island.atoll})`);
});

console.log(`\n\nTotal: ${islands.length} islands\n`);

// Check for missing ones
const targetIslands = [
  'Dharavandhoo', 'Fulhadhoo', 'Goidhoo', 'Maalhos', 'Kelaa', 
  'Utheemu', 'Hanimaadhoo', 'Fuvahmulah', 'Hithadhoo', 'Gan', 'Dhangethi'
];

const islandNames = islands.map(i => i.name);
const missing = targetIslands.filter(name => !islandNames.includes(name));

console.log('=== MISSING ISLANDS ===\n');
missing.forEach(name => console.log(`❌ ${name}`));
