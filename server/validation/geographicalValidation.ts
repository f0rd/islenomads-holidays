/**
 * Server-side validation for geographical data
 * Ensures data consistency for island-atoll relationships
 */

import {
  isValidIslandAtollPair,
  getCorrectAtollForIsland,
  isValidIslandCoordinates,
  isValidDistanceFromMale,
  validateIslandData as validateIslandDataHelper,
} from '@shared/geographicalData';
import { TRPCError } from '@trpc/server';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validate island data before saving to database
 */
export function validateIslandData(data: {
  slug: string;
  name: string;
  atoll: string;
  coordinates?: { latitude: number; longitude: number };
  distanceFromMale?: number;
}): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Use the shared validation function
  const validation = validateIslandDataHelper({
    slug: data.slug,
    atoll: data.atoll,
    coordinates: data.coordinates,
    distanceFromMale: data.distanceFromMale,
  });

  errors.push(...validation.errors);

  // Additional warnings
  if (!data.name || data.name.trim().length === 0) {
    errors.push('Island name is required');
  }

  if (!data.slug || data.slug.trim().length === 0) {
    errors.push('Island slug is required');
  }

  // Check for common naming issues
  if (data.name.toLowerCase().includes('island') && data.slug.includes('island')) {
    warnings.push(
      'Both name and slug contain "island" - consider removing from slug for consistency'
    );
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Throw TRPC error if validation fails
 */
export function validateIslandDataOrThrow(data: {
  slug: string;
  name: string;
  atoll: string;
  coordinates?: { latitude: number; longitude: number };
  distanceFromMale?: number;
}): void {
  const validation = validateIslandData(data);

  if (!validation.valid) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: `Invalid island data: ${validation.errors.join('; ')}`,
    });
  }
}

/**
 * Validate atoll-island pair and suggest correction if needed
 */
export function validateAtollIslandPair(
  islandSlug: string,
  atoll: string
): { valid: boolean; message?: string; suggestedAtoll?: string } {
  if (isValidIslandAtollPair(islandSlug, atoll)) {
    return { valid: true };
  }

  const suggestedAtoll = getCorrectAtollForIsland(islandSlug);
  return {
    valid: false,
    message: `Island "${islandSlug}" does not belong to "${atoll}"`,
    suggestedAtoll: suggestedAtoll || undefined,
  };
}

/**
 * Validate coordinates are within Maldives bounds
 */
export function validateCoordinates(
  latitude: number,
  longitude: number
): { valid: boolean; message?: string } {
  if (isValidIslandCoordinates(latitude, longitude)) {
    return { valid: true };
  }

  return {
    valid: false,
    message: `Coordinates (${latitude}, ${longitude}) are outside Maldives geographical bounds`,
  };
}

/**
 * Validate distance from Male
 */
export function validateDistance(distance: number): { valid: boolean; message?: string } {
  if (isValidDistanceFromMale(distance)) {
    return { valid: true };
  }

  return {
    valid: false,
    message: `Distance from Male (${distance} km) must be between 0 and 400 km`,
  };
}

/**
 * Batch validate multiple islands
 */
export function validateMultipleIslands(
  islands: Array<{
    slug: string;
    name: string;
    atoll: string;
    coordinates?: { latitude: number; longitude: number };
    distanceFromMale?: number;
  }>
): Array<{ island: string; validation: ValidationResult }> {
  return islands.map((island) => ({
    island: island.slug,
    validation: validateIslandData(island),
  }));
}

/**
 * Get validation summary for reporting
 */
export function getValidationSummary(
  validations: Array<{ island: string; validation: ValidationResult }>
): {
  totalIslands: number;
  validIslands: number;
  invalidIslands: number;
  totalErrors: number;
  totalWarnings: number;
  invalidIslandsList: string[];
} {
  const invalidIslands = validations.filter((v) => !v.validation.valid);

  return {
    totalIslands: validations.length,
    validIslands: validations.length - invalidIslands.length,
    invalidIslands: invalidIslands.length,
    totalErrors: validations.reduce((sum, v) => sum + v.validation.errors.length, 0),
    totalWarnings: validations.reduce((sum, v) => sum + v.validation.warnings.length, 0),
    invalidIslandsList: invalidIslands.map((v) => v.island),
  };
}
