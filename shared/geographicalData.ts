/**
 * Geographical Reference Data for Maldives
 * This file contains authoritative mappings of islands to atolls
 * Used for validation and data consistency checks
 */

export interface AtollData {
  name: string;
  alternateNames: string[];
  islands: string[];
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

export interface IslandData {
  name: string;
  slug: string;
  atoll: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  distanceFromMale: number; // in kilometers
  travelMethod: 'speedboat' | 'domestic_flight' | 'both';
}

/**
 * Authoritative mapping of islands to atolls
 * Source: Official Maldives geographical data
 */
export const VALID_ISLAND_ATOLL_MAPPINGS: Record<string, string> = {
  'malé': 'Kaafu Atoll',
  'male': 'Kaafu Atoll',
  'maafushi': 'Kaafu Atoll',
  'maafushi-island': 'Kaafu Atoll',
  'thoddoo': 'North Ari Atoll',
  'thoddoo-island': 'North Ari Atoll',
  'thoddoo-house-reef': 'North Ari Atoll',
  'guraidhoo': 'Kaafu Atoll',
  'guraidhoo-island': 'Kaafu Atoll',
  'thulusdhoo': 'Kaafu Atoll',
  'thulusdhoo-island': 'Kaafu Atoll',
  'kandooma': 'South Male Atoll',
  'kandooma-island': 'South Male Atoll',
  'fuvamulah': 'Gnaviyani Atoll',
  'fuvamulah-island': 'Gnaviyani Atoll',
};

/**
 * Atoll reference data
 */
export const ATOLL_REFERENCE_DATA: Record<string, AtollData> = {
  'Kaafu Atoll': {
    name: 'Kaafu Atoll',
    alternateNames: ['South Male Atoll', 'Male Atoll'],
    islands: ['Malé', 'Maafushi', 'Guraidhoo', 'Thulusdhoo'],
    coordinates: {
      latitude: 4.1755,
      longitude: 73.5093,
    },
  },
  'North Ari Atoll': {
    name: 'North Ari Atoll',
    alternateNames: ['Alif Alif Atoll', 'Ari Atoll North'],
    islands: ['Thoddoo', 'Rasdhoo', 'Mathiveri'],
    coordinates: {
      latitude: 5.3,
      longitude: 73.4,
    },
  },
  'South Male Atoll': {
    name: 'South Male Atoll',
    alternateNames: ['Kaafu Atoll South'],
    islands: ['Kandooma', 'Vadhoo', 'Fihalhohi'],
    coordinates: {
      latitude: 3.9,
      longitude: 73.5,
    },
  },
  'Gnaviyani Atoll': {
    name: 'Gnaviyani Atoll',
    alternateNames: ['Fuvamulah Atoll'],
    islands: ['Fuvamulah'],
    coordinates: {
      latitude: -0.5,
      longitude: 73.4,
    },
  },
  'Baa Atoll': {
    name: 'Baa Atoll',
    alternateNames: ['Baa Atoll'],
    islands: ['Eydhafushi', 'Hanimaadhoo', 'Fulhadhoo'],
    coordinates: {
      latitude: 5.8,
      longitude: 72.9,
    },
  },
};

/**
 * Island reference data
 */
export const ISLAND_REFERENCE_DATA: IslandData[] = [
  {
    name: 'Malé',
    slug: 'male',
    atoll: 'Kaafu Atoll',
    coordinates: { latitude: 4.1755, longitude: 73.5093 },
    distanceFromMale: 0,
    travelMethod: 'both',
  },
  {
    name: 'Maafushi Island',
    slug: 'maafushi-island',
    atoll: 'Kaafu Atoll',
    coordinates: { latitude: 4.4, longitude: 73.4 },
    distanceFromMale: 30,
    travelMethod: 'speedboat',
  },
  {
    name: 'Thoddoo Island',
    slug: 'thoddoo-island',
    atoll: 'North Ari Atoll',
    coordinates: { latitude: 5.3, longitude: 73.4 },
    distanceFromMale: 67,
    travelMethod: 'speedboat',
  },
  {
    name: 'Guraidhoo Island',
    slug: 'guraidhoo-island',
    atoll: 'Kaafu Atoll',
    coordinates: { latitude: 4.2, longitude: 73.6 },
    distanceFromMale: 35,
    travelMethod: 'speedboat',
  },
  {
    name: 'Thulusdhoo Island',
    slug: 'thulusdhoo-island',
    atoll: 'Kaafu Atoll',
    coordinates: { latitude: 4.5, longitude: 73.3 },
    distanceFromMale: 40,
    travelMethod: 'speedboat',
  },
  {
    name: 'Kandooma Island',
    slug: 'kandooma-island',
    atoll: 'South Male Atoll',
    coordinates: { latitude: 3.9, longitude: 73.5 },
    distanceFromMale: 25,
    travelMethod: 'speedboat',
  },
  {
    name: 'Fuvamulah Island',
    slug: 'fuvamulah-island',
    atoll: 'Gnaviyani Atoll',
    coordinates: { latitude: -0.5, longitude: 73.4 },
    distanceFromMale: 250,
    travelMethod: 'domestic_flight',
  },
];

/**
 * Validate if an island belongs to the specified atoll
 */
export function isValidIslandAtollPair(islandSlug: string, atoll: string): boolean {
  const validAtoll = VALID_ISLAND_ATOLL_MAPPINGS[islandSlug.toLowerCase()];
  return validAtoll === atoll;
}

/**
 * Get the correct atoll for an island
 */
export function getCorrectAtollForIsland(islandSlug: string): string | null {
  return VALID_ISLAND_ATOLL_MAPPINGS[islandSlug.toLowerCase()] || null;
}

/**
 * Get all islands in an atoll
 */
export function getIslandsInAtoll(atoll: string): string[] {
  const atollData = ATOLL_REFERENCE_DATA[atoll];
  return atollData ? atollData.islands : [];
}

/**
 * Validate island coordinates are within reasonable bounds
 */
export function isValidIslandCoordinates(
  latitude: number,
  longitude: number
): boolean {
  // Maldives coordinates bounds
  const minLat = -0.7;
  const maxLat = 6.5;
  const minLon = 72.6;
  const maxLon = 73.8;

  return (
    latitude >= minLat &&
    latitude <= maxLat &&
    longitude >= minLon &&
    longitude <= maxLon
  );
}

/**
 * Validate island distance from Male
 */
export function isValidDistanceFromMale(distance: number): boolean {
  // Distance should be between 0 and 400 km
  return distance >= 0 && distance <= 400;
}

/**
 * Comprehensive island data validation
 */
export function validateIslandData(data: {
  slug: string;
  atoll: string;
  coordinates?: { latitude: number; longitude: number };
  distanceFromMale?: number;
}): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check atoll-island mapping
  if (!isValidIslandAtollPair(data.slug, data.atoll)) {
    const correctAtoll = getCorrectAtollForIsland(data.slug);
    errors.push(
      `Island "${data.slug}" should belong to "${correctAtoll}", not "${data.atoll}"`
    );
  }

  // Check coordinates if provided
  if (data.coordinates) {
    if (!isValidIslandCoordinates(data.coordinates.latitude, data.coordinates.longitude)) {
      errors.push(
        `Coordinates (${data.coordinates.latitude}, ${data.coordinates.longitude}) are outside Maldives bounds`
      );
    }
  }

  // Check distance if provided
  if (data.distanceFromMale !== undefined) {
    if (!isValidDistanceFromMale(data.distanceFromMale)) {
      errors.push(
        `Distance from Male (${data.distanceFromMale} km) is outside valid range (0-400 km)`
      );
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
