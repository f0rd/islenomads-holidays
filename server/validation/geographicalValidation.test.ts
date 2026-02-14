/**
 * Tests for geographical validation functions
 */

import { describe, it, expect } from 'vitest';
import {
  isValidIslandAtollPair,
  getCorrectAtollForIsland,
  isValidIslandCoordinates,
  isValidDistanceFromMale,
  validateIslandData,
} from '@shared/geographicalData';
import {
  validateIslandData as validateIslandDataServer,
  validateAtollIslandPair,
  validateCoordinates,
  validateDistance,
} from './geographicalValidation';

describe('Geographical Data Validation', () => {
  describe('isValidIslandAtollPair', () => {
    it('should validate correct island-atoll pairs', () => {
      expect(isValidIslandAtollPair('thoddoo-island', 'North Ari Atoll')).toBe(true);
      expect(isValidIslandAtollPair('maafushi-island', 'Kaafu Atoll')).toBe(true);
      expect(isValidIslandAtollPair('fuvamulah-island', 'Gnaviyani Atoll')).toBe(true);
    });

    it('should reject incorrect island-atoll pairs', () => {
      expect(isValidIslandAtollPair('thoddoo-island', 'Baa Atoll')).toBe(false);
      expect(isValidIslandAtollPair('maafushi-island', 'North Ari Atoll')).toBe(false);
      expect(isValidIslandAtollPair('fuvamulah-island', 'Kaafu Atoll')).toBe(false);
    });

    it('should be case-insensitive for island slug', () => {
      expect(isValidIslandAtollPair('THODDOO-ISLAND', 'North Ari Atoll')).toBe(true);
      expect(isValidIslandAtollPair('Thoddoo-Island', 'North Ari Atoll')).toBe(true);
    });
  });

  describe('getCorrectAtollForIsland', () => {
    it('should return correct atoll for known islands', () => {
      expect(getCorrectAtollForIsland('thoddoo-island')).toBe('North Ari Atoll');
      expect(getCorrectAtollForIsland('maafushi-island')).toBe('Kaafu Atoll');
      expect(getCorrectAtollForIsland('fuvamulah-island')).toBe('Gnaviyani Atoll');
    });

    it('should return null for unknown islands', () => {
      expect(getCorrectAtollForIsland('unknown-island')).toBeNull();
      expect(getCorrectAtollForIsland('nonexistent')).toBeNull();
    });
  });

  describe('isValidIslandCoordinates', () => {
    it('should validate coordinates within Maldives bounds', () => {
      expect(isValidIslandCoordinates(4.1755, 73.5093)).toBe(true); // Malé
      expect(isValidIslandCoordinates(5.3, 73.4)).toBe(true); // Thoddoo
      expect(isValidIslandCoordinates(-0.5, 73.4)).toBe(true); // Fuvamulah
    });

    it('should reject coordinates outside Maldives bounds', () => {
      expect(isValidIslandCoordinates(10, 73.5)).toBe(false); // Too north
      expect(isValidIslandCoordinates(-2, 73.5)).toBe(false); // Too south
      expect(isValidIslandCoordinates(4, 75)).toBe(false); // Too east
      expect(isValidIslandCoordinates(4, 70)).toBe(false); // Too west
    });
  });

  describe('isValidDistanceFromMale', () => {
    it('should validate distances within range', () => {
      expect(isValidDistanceFromMale(0)).toBe(true); // Malé itself
      expect(isValidDistanceFromMale(30)).toBe(true); // Maafushi
      expect(isValidDistanceFromMale(67)).toBe(true); // Thoddoo
      expect(isValidDistanceFromMale(250)).toBe(true); // Fuvamulah
      expect(isValidDistanceFromMale(400)).toBe(true); // Max range
    });

    it('should reject distances outside range', () => {
      expect(isValidDistanceFromMale(-1)).toBe(false); // Negative
      expect(isValidDistanceFromMale(401)).toBe(false); // Too far
      expect(isValidDistanceFromMale(500)).toBe(false); // Way too far
    });
  });

  describe('validateIslandData (shared)', () => {
    it('should validate correct island data', () => {
      const result = validateIslandData({
        slug: 'thoddoo-island',
        atoll: 'North Ari Atoll',
        coordinates: { latitude: 5.3, longitude: 73.4 },
        distanceFromMale: 67,
      });

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect atoll mismatch', () => {
      const result = validateIslandData({
        slug: 'thoddoo-island',
        atoll: 'Baa Atoll',
        coordinates: { latitude: 5.3, longitude: 73.4 },
        distanceFromMale: 67,
      });

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0]).toContain('North Ari Atoll');
    });

    it('should detect invalid coordinates', () => {
      const result = validateIslandData({
        slug: 'thoddoo-island',
        atoll: 'North Ari Atoll',
        coordinates: { latitude: 10, longitude: 73.4 },
        distanceFromMale: 67,
      });

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('outside'))).toBe(true);
    });

    it('should detect invalid distance', () => {
      const result = validateIslandData({
        slug: 'thoddoo-island',
        atoll: 'North Ari Atoll',
        coordinates: { latitude: 5.3, longitude: 73.4 },
        distanceFromMale: 500,
      });

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('distance'))).toBe(true);
    });
  });

  describe('validateIslandData (server)', () => {
    it('should validate correct island data', () => {
      const result = validateIslandDataServer({
        slug: 'thoddoo-island',
        name: 'Thoddoo Island',
        atoll: 'North Ari Atoll',
        coordinates: { latitude: 5.3, longitude: 73.4 },
        distanceFromMale: 67,
      });

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should require name and slug', () => {
      const result = validateIslandDataServer({
        slug: '',
        name: '',
        atoll: 'North Ari Atoll',
      });

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('name'))).toBe(true);
      expect(result.errors.some((e) => e.includes('slug'))).toBe(true);
    });
  });

  describe('validateAtollIslandPair', () => {
    it('should validate correct pairs', () => {
      const result = validateAtollIslandPair('thoddoo-island', 'North Ari Atoll');
      expect(result.valid).toBe(true);
      expect(result.message).toBeUndefined();
    });

    it('should suggest correction for incorrect pairs', () => {
      const result = validateAtollIslandPair('thoddoo-island', 'Baa Atoll');
      expect(result.valid).toBe(false);
      expect(result.suggestedAtoll).toBe('North Ari Atoll');
    });
  });

  describe('validateCoordinates', () => {
    it('should validate correct coordinates', () => {
      const result = validateCoordinates(5.3, 73.4);
      expect(result.valid).toBe(true);
    });

    it('should reject invalid coordinates', () => {
      const result = validateCoordinates(10, 73.4);
      expect(result.valid).toBe(false);
      expect(result.message).toBeDefined();
    });
  });

  describe('validateDistance', () => {
    it('should validate correct distances', () => {
      const result = validateDistance(67);
      expect(result.valid).toBe(true);
    });

    it('should reject invalid distances', () => {
      const result = validateDistance(500);
      expect(result.valid).toBe(false);
      expect(result.message).toBeDefined();
    });
  });
});
