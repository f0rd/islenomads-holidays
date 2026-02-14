import { ALL_ISLANDS } from '../shared/locations';

const names = ALL_ISLANDS.map(i => i.name);
const nameMap = new Map<string, number[]>();

names.forEach((name, idx) => {
  if (!nameMap.has(name)) {
    nameMap.set(name, []);
  }
  nameMap.get(name)!.push(idx);
});

console.log("Duplicate island names:");
let count = 0;
nameMap.forEach((indices, name) => {
  if (indices.length > 1) {
    count++;
    console.log(`  "${name}": ${indices.map(i => ALL_ISLANDS[i].id).join(", ")}`);
  }
});

console.log(`\nTotal duplicates: ${count}`);
console.log(`Total islands: ${ALL_ISLANDS.length}`);
console.log(`Unique names: ${nameMap.size}`);
