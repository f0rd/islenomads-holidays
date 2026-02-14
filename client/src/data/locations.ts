/**
 * Unified Locations Data
 * 
 * This file defines all locations (islands, diving spots, surf spots, resorts, etc.)
 * with consistent IDs that are used across the entire application.
 * 
 * ID Naming Convention:
 * - Islands: island-{slug} (e.g., island-male, island-maafushi, island-thoddoo)
 * - Diving Spots: dive-{slug} (e.g., dive-kuda-giri, dive-keyodhoo)
 * - Surf Spots: surf-{slug} (e.g., surf-pasta-point, surf-chickens)
 * - Resorts: resort-{slug} (e.g., resort-soneva-jani)
 * - Atolls: atoll-{slug} (e.g., atoll-north-male, atoll-south-male)
 * - Cities: city-{slug} (e.g., city-male)
 */

// ============================================================================
// ISLANDS
// ============================================================================

export const ISLANDS = {
  MALE: {
    id: "island-male",
    name: "Malé",
    slug: "male",
    guideId: "male-guide",
    type: "island" as const,
    atoll: "Kaafu",
    lat: 4.1748,
    lng: 73.5082,
    description: "The capital city of Maldives, gateway to the islands",
    category: "Capital",
  },
  MAAFUSHI: {
    id: "island-maafushi",
    name: "Maafushi Island",
    slug: "maafushi",
    guideId: "maafushi-island",
    type: "island" as const,
    atoll: "Kaafu",
    lat: 4.38,
    lng: 73.4,
    description: "Popular local island with budget-friendly guesthouses and vibrant culture",
    category: "Local Island",
  },
  THODDOO: {
    id: "island-thoddoo",
    name: "Thoddoo Island",
    slug: "thoddoo",
    guideId: "thoddoo-island",
    type: "island" as const,
    atoll: "Baa",
    lat: 5.3,
    lng: 73.4,
    description: "Authentic local island known for agriculture and traditional culture",
    category: "Local Island",
  },
  GURAIDHOO: {
    id: "island-guraidhoo",
    name: "Guraidhoo Island",
    slug: "guraidhoo",
    guideId: "guraidhoo-island",
    type: "island" as const,
    atoll: "Kaafu",
    lat: 3.95,
    lng: 73.52,
    description: "Charming local island with excellent house reefs and friendly locals",
    category: "Local Island",
  },
  THULUSDHOO: {
    id: "island-thulusdhoo",
    name: "Thulusdhoo Island",
    slug: "thulusdhoo",
    guideId: "thulusdhoo-island",
    type: "island" as const,
    atoll: "Kaafu",
    lat: 4.35,
    lng: 73.55,
    description: "Laid-back island famous for surfing and relaxed beach culture",
    category: "Local Island",
  },
  KANDOOMA: {
    id: "island-kandooma",
    name: "Kandooma Island",
    slug: "kandooma",
    guideId: "kandooma-island",
    type: "island" as const,
    atoll: "Kaafu",
    lat: 3.88,
    lng: 73.52,
    description: "Scenic island with beautiful beaches and excellent diving spots",
    category: "Local Island",
  },
  MAAMIGILI: {
    id: "island-maamigili",
    name: "Maamigili Island",
    slug: "maamigili",
    guideId: "maamigili-guide",
    type: "island" as const,
    atoll: "Alif Dhaalu",
    lat: 3.475,
    lng: 72.8375,
    description: "Largest island of Alif Dhaalu Atoll, premier whale shark destination",
    category: "Local Island",
  },
} as const;

// ============================================================================
// DIVING SPOTS
// ============================================================================

export const DIVING_SPOTS = {
  KUDA_GIRI: {
    id: "dive-kuda-giri",
    name: "Kuda Giri Shipwreck",
    slug: "kuda-giri",
    islandId: "island-maafushi",
    type: "dive_site" as const,
    lat: 4.38,
    lng: 73.4,
    difficulty: "intermediate",
    maxDepth: 35,
    minDepth: 8,
    description: "Popular wreck dive with diverse marine life",
  },
  KEYODHOO: {
    id: "dive-keyodhoo",
    name: "Keyodhoo Shipwreck",
    slug: "keyodhoo",
    islandId: "island-maafushi",
    type: "dive_site" as const,
    lat: 4.38,
    lng: 73.4,
    difficulty: "intermediate",
    maxDepth: 30,
    minDepth: 10,
    description: "Famous for nurse sharks and excellent visibility",
  },
  KUDA_RAH_THILA: {
    id: "dive-kuda-rah-thila",
    name: "Kuda Rah Thila",
    slug: "kuda-rah-thila",
    islandId: "island-maamigili",
    type: "dive_site" as const,
    lat: 3.475,
    lng: 72.8375,
    difficulty: "advanced",
    maxDepth: 40,
    minDepth: 8,
    description: "Premier dive site featuring underwater pinnacle with diverse marine life",
  },
  BROKEN_ROCK: {
    id: "dive-broken-rock",
    name: "Broken Rock",
    slug: "broken-rock",
    islandId: "island-maamigili",
    type: "dive_site" as const,
    lat: 3.475,
    lng: 72.8375,
    difficulty: "advanced",
    maxDepth: 35,
    minDepth: 12,
    description: "Famous for swim-through caverns and excellent visibility",
  },
} as const;

// ============================================================================
// SURF SPOTS
// ============================================================================

export const SURF_SPOTS = {
  PASTA_POINT: {
    id: "surf-pasta-point",
    name: "Pasta Point",
    slug: "pasta-point",
    islandId: "island-thulusdhoo",
    type: "surf_spot" as const,
    lat: 4.35,
    lng: 73.55,
    difficulty: "beginner",
    waveHeight: "2-4 feet",
    description: "Beginner-friendly reef break with consistent waves",
  },
  CHICKENS: {
    id: "surf-chickens",
    name: "Chickens",
    slug: "chickens",
    islandId: "island-thulusdhoo",
    type: "surf_spot" as const,
    lat: 4.35,
    lng: 73.55,
    difficulty: "intermediate",
    waveHeight: "3-6 feet",
    description: "Popular reef break with fun waves for intermediate surfers",
  },
  HONKY_TONKS: {
    id: "surf-honky-tonks",
    name: "Honky Tonks",
    slug: "honky-tonks",
    islandId: "island-thulusdhoo",
    type: "surf_spot" as const,
    lat: 4.35,
    lng: 73.55,
    difficulty: "advanced",
    waveHeight: "4-8 feet",
    description: "Powerful reef break for experienced surfers",
  },
} as const;

// ============================================================================
// RESORTS
// ============================================================================

export const RESORTS = {
  SONEVA_JANI: {
    id: "resort-soneva-jani",
    name: "Soneva Jani",
    slug: "soneva-jani",
    type: "resort" as const,
    lat: 4.25,
    lng: 73.45,
    description: "Ultra-luxury resort with villas featuring retractable roofs",
    priceRange: "$$$$$",
  },
  ADAARAN_CLUB_RANNALHI: {
    id: "resort-adaaran-club-rannalhi",
    name: "Adaaran Club Rannalhi",
    slug: "adaaran-club-rannalhi",
    type: "resort" as const,
    lat: 3.95,
    lng: 73.52,
    description: "All-inclusive resort with excellent diving and water sports",
    priceRange: "$$$",
  },
} as const;

// ============================================================================
// ATOLLS
// ============================================================================

export const ATOLLS = {
  NORTH_MALE: {
    id: "atoll-north-male",
    name: "North Male Atoll",
    slug: "north-male",
    type: "atoll" as const,
    lat: 4.25,
    lng: 73.45,
    description: "Popular atoll with luxury resorts and pristine beaches",
  },
  SOUTH_MALE: {
    id: "atoll-south-male",
    name: "South Male Atoll",
    slug: "south-male",
    type: "atoll" as const,
    lat: 3.95,
    lng: 73.5,
    description: "Serene atoll with exclusive resorts and calm lagoons",
  },
  ARI: {
    id: "atoll-ari",
    name: "Ari Atoll",
    slug: "ari",
    type: "atoll" as const,
    lat: 4.2,
    lng: 72.8,
    description: "Famous for manta rays and whale sharks",
  },
  BAA: {
    id: "atoll-baa",
    name: "Baa Atoll",
    slug: "baa",
    type: "atoll" as const,
    lat: 5.2,
    lng: 73.3,
    description: "UNESCO Biosphere Reserve with exceptional marine life",
  },
  ALIF_DHAALU: {
    id: "atoll-alif-dhaalu",
    name: "Alif Dhaalu Atoll",
    slug: "alif-dhaalu",
    type: "atoll" as const,
    lat: 3.475,
    lng: 72.8375,
    description: "South Ari Atoll region with whale shark encounters",
  },
} as const;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get all islands as an array
 */
export function getAllIslands() {
  return Object.values(ISLANDS);
}

/**
 * Get island by ID
 */
export function getIslandById(id: string) {
  return Object.values(ISLANDS).find((island) => island.id === id);
}

/**
 * Get island by slug
 */
export function getIslandBySlug(slug: string) {
  return Object.values(ISLANDS).find((island) => island.slug === slug);
}

/**
 * Get island by guide ID
 */
export function getIslandByGuideId(guideId: string) {
  return Object.values(ISLANDS).find((island) => island.guideId === guideId);
}

/**
 * Get all diving spots
 */
export function getAllDivingSpots() {
  return Object.values(DIVING_SPOTS);
}

/**
 * Get diving spots by island ID
 */
export function getDivingSpotsByIslandId(islandId: string) {
  return Object.values(DIVING_SPOTS).filter((spot) => spot.islandId === islandId);
}

/**
 * Get all surf spots
 */
export function getAllSurfSpots() {
  return Object.values(SURF_SPOTS);
}

/**
 * Get surf spots by island ID
 */
export function getSurfSpotsByIslandId(islandId: string) {
  return Object.values(SURF_SPOTS).filter((spot) => spot.islandId === islandId);
}

/**
 * Get all resorts
 */
export function getAllResorts() {
  return Object.values(RESORTS);
}

/**
 * Get all atolls
 */
export function getAllAtolls() {
  return Object.values(ATOLLS);
}

/**
 * Get atoll by ID
 */
export function getAtollById(id: string) {
  return Object.values(ATOLLS).find((atoll) => atoll.id === id);
}

/**
 * Get all locations (islands, resorts, diving spots, surf spots, atolls)
 */
export function getAllLocations() {
  return [
    ...getAllIslands(),
    ...getAllResorts(),
    ...getAllDivingSpots(),
    ...getAllSurfSpots(),
    ...getAllAtolls(),
  ];
}

/**
 * Get location by ID (works for any location type)
 */
export function getLocationById(id: string) {
  return getAllLocations().find((location) => location.id === id);
}
