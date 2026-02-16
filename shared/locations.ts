/**
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
  { id: 87, name: 'Maafushi', slug: 'maafushi', atoll: '', type: 'island' },
  { id: 65, name: 'Thoddoo', slug: 'thoddoo', atoll: '', type: 'island' },
  { id: 81, name: 'Guraidhoo', slug: 'guraidhoo', atoll: '', type: 'island' },
  { id: 67, name: 'Thulusdhoo', slug: 'thulusdhoo', atoll: '', type: 'island' },
  { id: 49, name: 'Kandooma', slug: 'kandooma', atoll: '', type: 'island' },
  { id: 80, name: 'Fuvamulah', slug: 'fuvamulah', atoll: '', type: 'island' },
];

/**
 * All islands - comprehensive list for searching and filtering
 * Generated from database places table
 */
export const ALL_ISLANDS: IslandLocation[] = [
  ...FEATURED_ISLANDS,
  { id: 1, name: 'Dhonfanu', slug: 'dhonfanu', type: 'island' },
  { id: 2, name: 'Eydhafushi', slug: 'eydhafushi', type: 'island' },
  { id: 3, name: 'Felidhoo', slug: 'felidhoo', type: 'island' },
  { id: 4, name: 'HP Reef', slug: 'hp-reef', type: 'island' },
  { id: 5, name: 'Himmafushi', slug: 'himmafushi', type: 'island' },
  { id: 6, name: 'Ihavandhoo', slug: 'ihavandhoo', type: 'island' },
  { id: 7, name: 'Kaashidhoo', slug: 'kaashidhoo', type: 'island' },
  { id: 8, name: 'Kolhufushi', slug: 'kolhufushi', type: 'island' },
  { id: 9, name: 'Maaya Thila', slug: 'maaya-thila', type: 'island' },
  { id: 10, name: 'Maduvvaree', slug: 'maduvvaree', type: 'island' },
  { id: 11, name: 'Makunudhoo', slug: 'makunudhoo', type: 'island' },
  { id: 12, name: 'Maradhoo', slug: 'maradhoo', type: 'island' },
  { id: 13, name: 'Mathiveri', slug: 'mathiveri', type: 'island' },
  { id: 14, name: 'Naivaadhoo', slug: 'naivaadhoo', type: 'island' },
  { id: 15, name: 'Olhuvelifushi', slug: 'olhuvelifushi', type: 'island' },
  { id: 16, name: 'Thinadhoo', slug: 'thinadhoo', type: 'island' },
  { id: 17, name: 'Bandidhoo', slug: 'bandidhoo', type: 'island' },
  { id: 18, name: 'Bodufolhudhoo', slug: 'bodufolhudhoo', type: 'island' },
  { id: 19, name: 'Dharanboodhoo', slug: 'dharanboodhoo', type: 'island' },
  { id: 20, name: 'Felidhoo Kandu', slug: 'felidhoo-kandu', type: 'island' },
  { id: 21, name: 'Finey', slug: 'finey', type: 'island' },
  { id: 22, name: 'Fodhdhoo', slug: 'fodhdhoo', type: 'island' },
  { id: 23, name: 'Gulhi', slug: 'gulhi', type: 'island' },
  { id: 24, name: 'Hinnavaru', slug: 'hinnavaru', type: 'island' },
  { id: 25, name: 'Hithadhoo', slug: 'hithadhoo', type: 'island' },
  { id: 26, name: 'Kandooma Thila', slug: 'kandooma-thila', type: 'island' },
  { id: 27, name: 'Kumundhoo', slug: 'kumundhoo', type: 'island' },
  { id: 28, name: 'Lhosfushi', slug: 'lhosfushi', type: 'island' },
  { id: 29, name: 'Maaenboodhoo', slug: 'maaenboodhoo', type: 'island' },
  { id: 30, name: 'Maavah', slug: 'maavah', type: 'island' },
  { id: 31, name: 'Madifushi', slug: 'madifushi', type: 'island' },
  { id: 32, name: 'Mulhadhoo', slug: 'mulhadhoo', type: 'island' },
  { id: 33, name: 'Naalaafushi', slug: 'naalaafushi', type: 'island' },
  { id: 34, name: 'Raimmandhoo', slug: 'raimmandhoo', type: 'island' },
  { id: 35, name: 'Rasdhoo', slug: 'rasdhoo', type: 'island' },
  { id: 36, name: 'Ungoofaaru', slug: 'ungoofaaru', type: 'island' },
  { id: 37, name: 'Vaikaradhoo', slug: 'vaikaradhoo', type: 'island' },
  { id: 38, name: 'Velidhoo', slug: 'velidhoo', type: 'island' },
  { id: 39, name: 'Alifushi', slug: 'alifushi', type: 'island' },
  { id: 40, name: 'Dharavandhoo', slug: 'dharavandhoo', type: 'island' },
  { id: 41, name: 'Feridhoo', slug: 'feridhoo', type: 'island' },
  { id: 42, name: 'Fulidhoo Kandu', slug: 'fulidhoo-kandu', type: 'island' },
  { id: 43, name: 'Gaafaru', slug: 'gaafaru', type: 'island' },
  { id: 44, name: 'Gan', slug: 'gan', type: 'island' },
  { id: 45, name: 'Gemendhoo', slug: 'gemendhoo', type: 'island' },
  { id: 46, name: 'Hirimaradhoo', slug: 'hirimaradhoo', type: 'island' },
  { id: 47, name: 'Inguraidhoo', slug: 'inguraidhoo', type: 'island' },
  { id: 48, name: 'Kalaidhoo', slug: 'kalaidhoo', type: 'island' },
  { id: 50, name: 'Keyodhoo', slug: 'keyodhoo', type: 'island' },
  { id: 51, name: 'Kudahuvadhoo', slug: 'kudahuvadhoo', type: 'island' },
  { id: 52, name: 'Lhaimagu', slug: 'lhaimagu', type: 'island' },
  { id: 53, name: 'Maalhos', slug: 'maalhos', type: 'island' },
  { id: 54, name: 'Maamigili', slug: 'maamigili', type: 'island' },
  { id: 55, name: 'Magoodhoo', slug: 'magoodhoo', type: 'island' },
  { id: 56, name: 'Malé', slug: 'mal', type: 'island' },
  { id: 57, name: 'Meedhoo', slug: 'meedhoo', type: 'island' },
  { id: 58, name: 'Naifaru', slug: 'naifaru', type: 'island' },
  { id: 59, name: 'Nellaidhoo', slug: 'nellaidhoo', type: 'island' },
  { id: 60, name: 'Neykurendhoo', slug: 'neykurendhoo', type: 'island' },
  { id: 61, name: 'Nilandhoo', slug: 'nilandhoo', type: 'island' },
  { id: 62, name: 'Noomaraa', slug: 'noomaraa', type: 'island' },
  { id: 63, name: 'Rakeedhoo', slug: 'rakeedhoo', type: 'island' },
  { id: 64, name: 'Rasdhoo Madivaru', slug: 'rasdhoo-madivaru', type: 'island' },
  { id: 66, name: 'Thoddoo House Reef', slug: 'thoddoo-house-reef', type: 'island' },
  { id: 68, name: 'Ukulhas', slug: 'ukulhas', type: 'island' },
  { id: 69, name: 'Ukulhas House Reef', slug: 'ukulhas-house-reef', type: 'island' },
  { id: 70, name: 'Veligandu Reef', slug: 'veligandu-reef', type: 'island' },
  { id: 71, name: 'Baarah', slug: 'baarah', type: 'island' },
  { id: 72, name: 'Bileddhoo', slug: 'bileddhoo', type: 'island' },
  { id: 73, name: 'Dhiffushi', slug: 'dhiffushi', type: 'island' },
  { id: 74, name: 'Dhigurah', slug: 'dhigurah', type: 'island' },
  { id: 75, name: 'Feeali', slug: 'feeali', type: 'island' },
  { id: 76, name: 'Feidhoo', slug: 'feidhoo', type: 'island' },
  { id: 77, name: 'Feydhoo', slug: 'feydhoo', type: 'island' },
  { id: 78, name: 'Filladhoo', slug: 'filladhoo', type: 'island' },
  { id: 79, name: 'Funadhoo', slug: 'funadhoo', type: 'island' },
  { id: 82, name: 'Himandhoo', slug: 'himandhoo', type: 'island' },
  { id: 83, name: 'Hoarafushi', slug: 'hoarafushi', type: 'island' },
  { id: 84, name: 'Hulhudheli', slug: 'hulhudheli', type: 'island' },
  { id: 85, name: 'Isdhoo', slug: 'isdhoo', type: 'island' },
  { id: 86, name: 'Kurendhoo', slug: 'kurendhoo', type: 'island' },
  { id: 89, name: 'Milandhoo', slug: 'milandhoo', type: 'island' },
  { id: 90, name: 'Mulah', slug: 'mulah', type: 'island' },
  { id: 91, name: 'Muraidhoo', slug: 'muraidhoo', type: 'island' },
  { id: 92, name: 'Naifaru Kandu', slug: 'naifaru-kandu', type: 'island' },
  { id: 93, name: 'Nolhivaramu', slug: 'nolhivaramu', type: 'island' },
  { id: 94, name: 'Rinbudhoo', slug: 'rinbudhoo', type: 'island' },
  { id: 95, name: 'Thuraakunu', slug: 'thuraakunu', type: 'island' },
  { id: 96, name: 'Utheemu', slug: 'utheemu', type: 'island' },
  { id: 97, name: 'Vashafaru', slug: 'vashafaru', type: 'island' },
  { id: 98, name: 'Veligandu', slug: 'veligandu', type: 'island' },
  { id: 99, name: 'Veyvah', slug: 'veyvah', type: 'island' },
  { id: 100, name: 'Banana Reef', slug: 'banana-reef', type: 'island' },
  { id: 101, name: 'Burunee', slug: 'burunee', type: 'island' },
  { id: 102, name: 'Dhiddhoo', slug: 'dhiddhoo', type: 'island' },
  { id: 103, name: 'Dhiggaru', slug: 'dhiggaru', type: 'island' },
  { id: 104, name: 'Dhigurah House Reef', slug: 'dhigurah-house-reef', type: 'island' },
  { id: 105, name: 'Dhiyamigili', slug: 'dhiyamigili', type: 'island' },
  { id: 106, name: 'Dhuvaafaru', slug: 'dhuvaafaru', type: 'island' },
  { id: 107, name: 'Fotteyo Kandu', slug: 'fotteyo-kandu', type: 'island' },
  { id: 108, name: 'Fulhadhoo', slug: 'fulhadhoo', type: 'island' },
  { id: 109, name: 'Fulidhoo', slug: 'fulidhoo', type: 'island' },
  { id: 110, name: 'Fuvahmulah Tiger Shark', slug: 'fuvahmulah-tiger-shark', type: 'island' },
  { id: 111, name: 'Godhdhoo', slug: 'godhdhoo', type: 'island' },
  { id: 112, name: 'Hulhumalé', slug: 'hulhumal', type: 'island' },
  { id: 113, name: 'Hulhumeedhoo', slug: 'hulhumeedhoo', type: 'island' },
  { id: 114, name: 'Huraa', slug: 'huraa', type: 'island' },
  { id: 115, name: 'Innamaa', slug: 'innamaa', type: 'island' },
  { id: 116, name: 'Kadhoo', slug: 'kadhoo', type: 'island' },
  { id: 117, name: 'Kelaa', slug: 'kelaa', type: 'island' },
  { id: 118, name: 'Kendhoo', slug: 'kendhoo', type: 'island' },
  { id: 120, name: 'Kurinbi', slug: 'kurinbi', type: 'island' },
  { id: 121, name: 'Maarandhoo', slug: 'maarandhoo', type: 'island' },
  { id: 122, name: 'Muli', slug: 'muli', type: 'island' },
  { id: 123, name: 'Nolhivaranfaru', slug: 'nolhivaranfaru', type: 'island' },
  { id: 124, name: 'Thakandhoo', slug: 'thakandhoo', type: 'island' },
  { id: 126, name: 'Uligamu', slug: 'uligamu', type: 'island' },
  { id: 127, name: 'Veymandoo', slug: 'veymandoo', type: 'island' },
  { id: 128, name: 'Villingili', slug: 'villingili', type: 'island' },
  { id: 30001, name: 'Omadhoo', slug: 'omadhoo', type: 'island' },
  { id: 30002, name: 'Dhangethi', slug: 'dhangethi', type: 'island' },
  { id: 30003, name: 'Fehendhoo', slug: 'fehendhoo', type: 'island' },
  { id: 30004, name: 'Hanimadhoo', slug: 'hanimadhoo', type: 'island' },
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
/**
 * Build island guide URL by slug (preferred method for SEO)
 */
export function getIslandGuideUrl(slugOrId: string | number): string {
  // If it's a string, treat it as a slug
  if (typeof slugOrId === 'string') {
    return `/island/${slugOrId}`;
  }
  // Fallback for ID-based URLs (deprecated)
  return `/island/${slugOrId}`;
}

/**
 * Helper function to build island guide URL by slug (alias for getIslandGuideUrl)
 */
export function getIslandGuideUrlBySlug(slug: string): string {
  return getIslandGuideUrl(slug);
}

/**
 * Get island guide URL by ID (for backward compatibility)
 * @deprecated Use getIslandGuideUrl(slug) instead
 */
export function getIslandGuideUrlById(islandId: number): string {
  return `/island/${islandId}`;
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
