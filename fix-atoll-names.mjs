import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Read the JSON file to get the correct atoll names
const jsonPath = path.join(__dirname, 'all-islands-content.json');
const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

// Create a mapping of islands to their correct atolls from JSON
const correctAtolls = {};
jsonData.islands.forEach(island => {
  correctAtolls[island.name.toLowerCase()] = island.atoll;
});

// Print the mapping for verification
console.log('=== Correct Atoll Assignments from JSON ===\n');
Object.entries(correctAtolls).forEach(([name, atoll]) => {
  console.log(`${name} → ${atoll}`);
});

// SQL update statements to fix the database
console.log('\n\n=== SQL Update Statements ===\n');

// Fix atoll name inconsistencies (e.g., "Alifu Alif" → "Alif Alif")
const atollMappings = [
  { from: 'Alifu Alif Atoll', to: 'Alif Alif Atoll' },
  { from: 'Alifu Dhaal Atoll', to: 'Alif Dhaal Atoll' },
];

atollMappings.forEach(mapping => {
  console.log(`UPDATE island_guides SET atoll = '${mapping.to}' WHERE atoll = '${mapping.from}';`);
});

// Fix specific islands that are in the wrong atolls
console.log('\n-- Fix specific islands\n');

// For each island in the database, check if it should be in a different atoll
const islandsToFix = [
  { name: 'Feridhoo', currentAtoll: 'Alifu Alif Atoll' },
  { name: 'Mathiveri', currentAtoll: 'Alifu Alif Atoll' },
];

islandsToFix.forEach(island => {
  const correctAtoll = correctAtolls[island.name.toLowerCase()];
  if (correctAtoll && correctAtoll !== island.currentAtoll) {
    console.log(`UPDATE island_guides SET atoll = '${correctAtoll}' WHERE name = '${island.name}';`);
  } else if (!correctAtoll) {
    console.log(`-- ${island.name} not found in JSON file, keeping current assignment: ${island.currentAtoll}`);
  }
});
