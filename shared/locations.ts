/**
 * Unified Island Locations Configuration
 * 
 * This file serves as the single source of truth for all island IDs and metadata.
 * All navigation links, routes, and references to islands should use these IDs.
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
 * Main islands navigation - these are the featured islands in the navigation
 * Update this array as you add or remove featured islands
 */
export const FEATURED_ISLANDS: IslandLocation[] = [
  { id: 1, name: 'Male', slug: 'male-guide', atoll: 'Male City', type: 'island' },
  { id: 2, name: 'Maafushi', slug: 'maafushi-island', atoll: 'Vaavu Atoll', type: 'island' },
  { id: 3, name: 'Thoddoo', slug: 'thoddoo-island', atoll: 'Baa Atoll', type: 'island' },
  { id: 4, name: 'Guraidhoo', slug: 'guraidhoo-island', atoll: 'South Male Atoll', type: 'island' },
  { id: 5, name: 'Thulusdhoo', slug: 'thulusdhoo-island', atoll: 'Male Atoll', type: 'island' },
  { id: 6, name: 'Kandooma', slug: 'kandooma-island', atoll: 'South Male Atoll', type: 'island' },
  { id: 7, name: 'Fuvahmulah', slug: 'fuvamulah-island', atoll: 'Gnaviyani Atoll', type: 'island' },
];

/**
 * All islands - comprehensive list for searching and filtering
 * This should be populated from the database dynamically in production
 * For now, we include the featured islands and can expand as needed
 */
export const ALL_ISLANDS: IslandLocation[] = [
  ...FEATURED_ISLANDS,
  // Add more islands as they are added to the database
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
 * Helper function to get island by slug (for backward compatibility)
 */
export function getIslandBySlug(slug: string): IslandLocation | undefined {
  return ALL_ISLANDS.find(island => island.slug === slug);
}

/**
 * Helper function to build island guide URL using ID
 * Usage: getIslandGuideUrl(1) => '/island/1'
 */
export function getIslandGuideUrl(islandId: number): string {
  return `/island/${islandId}`;
}

/**
 * Helper function to build island guide URL using slug (deprecated)
 * Usage: getIslandGuideUrlBySlug('male-guide') => '/island/male-guide'
 * @deprecated Use getIslandGuideUrl with island ID instead
 */
export function getIslandGuideUrlBySlug(slug: string): string {
  return `/island/${slug}`;
}

/**
 * Get navigation links for island carousel/navigation
 * Returns array of islands with their IDs and names for building navigation UI
 */
export function getIslandNavigationLinks(): Array<{ id: number; name: string; url: string }> {
  return FEATURED_ISLANDS.map(island => ({
    id: island.id,
    name: island.name,
    url: getIslandGuideUrl(island.id),
  }));
}

/**
 * Get previous and next island for navigation
 */
export function getAdjacentIslands(currentIslandId: number): {
  previous: IslandLocation | null;
  next: IslandLocation | null;
} {
  const currentIndex = FEATURED_ISLANDS.findIndex(i => i.id === currentIslandId);
  
  return {
    previous: currentIndex > 0 ? FEATURED_ISLANDS[currentIndex - 1] : null,
    next: currentIndex < FEATURED_ISLANDS.length - 1 ? FEATURED_ISLANDS[currentIndex + 1] : null,
  };
}
