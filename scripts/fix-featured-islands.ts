import { getDb } from "../server/db";
import { places } from "../drizzle/schema";
import fs from "fs";
import path from "path";

async function fixFeaturedIslands() {
  const db = await getDb();
  if (!db) {
    console.error("Failed to connect to database");
    return;
  }

  // Get all places from database
  const allPlaces = await db.select().from(places);

  // Filter to only islands and remove duplicates by name
  const seenNames = new Set<string>();
  const islands = allPlaces
    .filter(p => p.type === 'island')
    .filter(p => {
      if (seenNames.has(p.name)) {
        return false;
      }
      seenNames.add(p.name);
      return true;
    });

  console.log(`Found ${islands.length} islands in database`);

  // Find the correct IDs for featured islands
  const featuredNames = ["Male", "Maafushi", "Thoddoo", "Guraidhoo", "Thulusdhoo", "Kandooma", "Fuvamulah"];
  const featuredIslands = [];

  for (const name of featuredNames) {
    const island = islands.find(i => i.name === name);
    if (island) {
      featuredIslands.push({ id: island.id, name: island.name });
      console.log(`✓ ${name} → ID ${island.id}`);
    } else {
      console.log(`❌ ${name} → NOT FOUND`);
    }
  }

  // Build the islands array content
  const islandLines: string[] = [];
  
  islandLines.push("  ...FEATURED_ISLANDS,");

  // Featured islands to skip
  const featuredNamesSet = new Set(featuredNames);
  const featuredIds = new Set(featuredIslands.map(f => f.id));

  // Add remaining islands, skipping duplicates of featured island names
  for (const island of islands) {
    if (!featuredIds.has(island.id) && !featuredNamesSet.has(island.name)) {
      const slug = island.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      const escapedName = island.name.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
      islandLines.push(`  { id: ${island.id}, name: '${escapedName}', slug: '${slug}', type: 'island' },`);
    }
  }

  const islandsArrayContent = islandLines.join("\n");

  // Build featured islands array
  const featuredArrayLines = featuredIslands.map(f => {
    const slug = f.name.toLowerCase().replace(/\s+/g, "-");
    return `  { id: ${f.id}, name: '${f.name}', slug: '${slug}-island', atoll: '', type: 'island' },`;
  });

  const locationsContent = `/**
 * Unified Island Locations Configuration
 * 
 * This file serves as the single source of truth for all island IDs and metadata.
 * All navigation links, routes, and references to islands should use these IDs.
 * 
 * IMPORTANT: These IDs are synchronized with the database places table.
 * Do NOT manually edit the island IDs - they must match the database.
 * 
 * Benefits:
 * - Consistent ID usage across the entire application
 * - Easy to maintain and update island information
 * - Prevents slug mismatch errors
 * - Enables easy island lookup by ID or name
 */

export interface IslandLocation {
  id: number;
  name: string;
  slug: string; // For backward compatibility during transition
  atoll?: string;
  type: 'island' | 'poi';
}

/**
 * Featured islands - these are the most popular islands
 * Update this array to change which islands appear in navigation
 */
export const FEATURED_ISLANDS: IslandLocation[] = [
${featuredArrayLines.join("\n")}
];

/**
 * All islands - comprehensive list for searching and filtering
 * Generated from database places table
 */
export const ALL_ISLANDS: IslandLocation[] = [
${islandsArrayContent}
];

/**
 * Helper function to get island by ID
 */
export function getIslandById(id: number): IslandLocation | undefined {
  return ALL_ISLANDS.find(island => island.id === id);
}

/**
 * Helper function to get island by name
 */
export function getIslandByName(name: string): IslandLocation | undefined {
  return ALL_ISLANDS.find(island => island.name.toLowerCase() === name.toLowerCase());
}

/**
 * Helper function to get island by slug (backward compatibility)
 */
export function getIslandBySlug(slug: string): IslandLocation | undefined {
  return ALL_ISLANDS.find(island => island.slug === slug);
}

/**
 * Helper function to build island guide URL
 */
export function getIslandGuideUrl(islandId: number): string {
  return \`/island/\${islandId}\`;
}

/**
 * Helper function to build island guide URL by slug (deprecated)
 */
export function getIslandGuideUrlBySlug(slug: string): string {
  const island = getIslandBySlug(slug);
  return island ? getIslandGuideUrl(island.id) : '/explore-maldives';
}

/**
 * Get navigation links for island carousel or menu
 */
export function getIslandNavigationLinks(): IslandLocation[] {
  return FEATURED_ISLANDS;
}

/**
 * Get adjacent islands for navigation (previous/next)
 */
export function getAdjacentIslands(currentIslandId: number): {
  previous: IslandLocation | null;
  next: IslandLocation | null;
} {
  const currentIndex = ALL_ISLANDS.findIndex(i => i.id === currentIslandId);
  
  return {
    previous: currentIndex > 0 ? ALL_ISLANDS[currentIndex - 1] : null,
    next: currentIndex < ALL_ISLANDS.length - 1 ? ALL_ISLANDS[currentIndex + 1] : null,
  };
}
`;

  // Write the file
  const locationsPath = path.join(
    process.cwd(),
    "shared",
    "locations.ts"
  );

  fs.writeFileSync(locationsPath, locationsContent);

  console.log(`\n✓ Regenerated ${locationsPath}`);
  console.log(`  Total islands: ${islands.length}`);
  console.log(`  Featured islands: ${featuredIslands.length}`);
  console.log(`  Non-featured islands: ${islands.length - featuredIslands.length}`);
}

fixFeaturedIslands().catch(console.error);
