import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Read the JSON file
const jsonPath = path.join(__dirname, 'all-islands-content.json');
const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

// Get the featured islands from each atoll
const atolls = {};
jsonData.islands.forEach(island => {
  if (!atolls[island.atoll]) {
    atolls[island.atoll] = [];
  }
  atolls[island.atoll].push({
    name: island.name,
    atoll: island.atoll
  });
});

// Print the mapping
console.log('=== Island to Atoll Mapping ===\n');
Object.entries(atolls).forEach(([atoll, islands]) => {
  console.log(`${atoll}:`);
  islands.forEach(island => {
    console.log(`  - ${island.name}`);
  });
  console.log();
});

// Check for islands that should be in Alif Alif Atoll
console.log('\n=== Alif Alif Atoll Islands ===');
const alifalifIslands = atolls['Alif Alif Atoll'] || [];
alifalifIslands.forEach(island => {
  console.log(`- ${island.name}`);
});
