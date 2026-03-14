import { getDb } from "./server/db.ts";

const db = await getDb();

// Get all atolls with their island counts and data completeness
const result = await db.query.island_guides.findMany({
  columns: {
    atoll: true,
    overview: true,
    heroImage: true,
    quickFacts: true,
    topThingsToDo: true,
    faq: true,
  },
});

// Group by atoll and count
const byAtoll = {};
result.forEach((guide) => {
  if (!byAtoll[guide.atoll]) {
    byAtoll[guide.atoll] = {
      total: 0,
      with_overview: 0,
      with_hero: 0,
      with_facts: 0,
      with_activities: 0,
      with_faq: 0,
    };
  }
  byAtoll[guide.atoll].total++;
  if (guide.overview) byAtoll[guide.atoll].with_overview++;
  if (guide.heroImage) byAtoll[guide.atoll].with_hero++;
  if (guide.quickFacts) byAtoll[guide.atoll].with_facts++;
  if (guide.topThingsToDo) byAtoll[guide.atoll].with_activities++;
  if (guide.faq) byAtoll[guide.atoll].with_faq++;
});

console.log("Island Data Completeness by Atoll:");
console.log("==================================");
Object.entries(byAtoll).forEach(([atoll, data]) => {
  const completeness = Math.round((data.with_overview / data.total) * 100);
  console.log(`\n${atoll}:`);
  console.log(`  Total Islands: ${data.total}`);
  console.log(`  With Overview: ${data.with_overview}/${data.total}`);
  console.log(`  With Hero Image: ${data.with_hero}/${data.total}`);
  console.log(`  With Quick Facts: ${data.with_facts}/${data.total}`);
  console.log(`  With Activities: ${data.with_activities}/${data.total}`);
  console.log(`  With FAQ: ${data.with_faq}/${data.total}`);
  console.log(`  Overall Completeness: ${completeness}%`);
});
