import { getDb } from "../server/db";
import { places } from "../drizzle/schema";
import fs from "fs";
import path from "path";

async function regenerateLocations() {
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

  // Featured islands array
  const FEATURED_IDS = [1, 87, 3, 4, 5, 6, 80];

  // Build the islands array content
  const islandLines: string[] = [];
  
  islandLines.push("  ...FEATURED_ISLANDS,");

  // Featured islands to skip
  const featuredNames = new Set(["Male", "Maafushi", "Thoddoo", "Guraidhoo", "Thulusdhoo", "Kandooma", "Fuvamulah"]);

  // Add remaining islands, skipping duplicates of featured island names
  for (const island of islands) {
    if (!FEATURED_IDS.includes(island.id) && !featuredNames.has(island.name)) {
      const slug = island.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      const escapedName = island.name.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
      islandLines.push(`  { id: ${island.id}, name: '${escapedName}', slug: '${slug}', type: 'island' },`);
    }
  }

  const islandsArrayContent = islandLines.join("\n");

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
  { id: 1, name: 'Male', slug: 'male-guide', atoll: 'Male City', type: 'island' },
  { id: 87, name: 'Maafushi', slug: 'maafushi-island', atoll: 'Vaavu Atoll', type: 'island' },
  { id: 3, name: 'Thoddoo', slug: 'thoddoo-island', atoll: 'Baa Atoll', type: 'island' },
  { id: 4, name: 'Guraidhoo', slug: 'guraidhoo-island', atoll: 'South Male Atoll', type: 'island' },
  { id: 5, name: 'Thulusdhoo', slug: 'thulusdhoo-island', atoll: 'Male Atoll', type: 'island' },
  { id: 6, name: 'Kandooma', slug: 'kandooma-island', atoll: 'South Male Atoll', type: 'island' },
  { id: 80, name: 'Fuvamulah', slug: 'fuvamulah-island', atoll: 'Gnaviyani Atoll', type: 'island' },
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

  console.log(`✓ Regenerated ${locationsPath}`);
  console.log(`  Total islands: ${islands.length}`);
  console.log(`  Featured islands: ${FEATURED_IDS.length}`);
  console.log(`  Non-featured islands: ${islands.length - FEATURED_IDS.length}`);
}

regenerateLocations().catch(console.error);
