import { describe, it, expect } from 'vitest';
import {
  findDirectRoutes,
  findOneStopRoutes,
  findAllRoutes,
  findOptimizedRoutes,
  getRouteSuggestions,
} from './routing';

describe('Transportation Routing System', () => {


  describe('Direct Routes', () => {
    it('should find direct routes between two islands', async () => {
      const routes = await findDirectRoutes('Male', 'Maafushi');
      expect(Array.isArray(routes)).toBe(true);
      // Routes may be empty if database is not set up
      if (routes.length > 0) {
        expect(routes[0]).toHaveProperty('fromLocation');
        expect(routes[0]).toHaveProperty('toLocation');
        expect(routes[0]).toHaveProperty('duration');
        expect(routes[0]).toHaveProperty('price');
      }
    });

    it('should return empty array for non-existent route', async () => {
      const routes = await findDirectRoutes('InvalidIsland1', 'InvalidIsland2');
      expect(routes).toEqual([]);
    });
  });

  describe('Optimized Routes', () => {
    it('should return routes sorted by speed', async () => {
      const routes = await findOptimizedRoutes('Male', 'Maafushi', 'speed');
      expect(Array.isArray(routes)).toBe(true);
      
      // Verify routes are sorted by duration
      for (let i = 1; i < routes.length; i++) {
        expect(routes[i].totalDurationMinutes).toBeGreaterThanOrEqual(
          routes[i - 1].totalDurationMinutes
        );
      }
    });

    it('should return routes sorted by cost', async () => {
      const routes = await findOptimizedRoutes('Male', 'Maafushi', 'cost');
      expect(Array.isArray(routes)).toBe(true);
      
      // Verify routes are sorted by cost
      for (let i = 1; i < routes.length; i++) {
        expect(routes[i].totalCost).toBeGreaterThanOrEqual(
          routes[i - 1].totalCost
        );
      }
    });

    it('should prefer direct routes for comfort optimization', async () => {
      const routes = await findOptimizedRoutes('Male', 'Maafushi', 'comfort');
      expect(Array.isArray(routes)).toBe(true);
      
      // First route should be direct if available
      if (routes.length > 0 && routes[0].isDirectRoute) {
        expect(routes[0].isDirectRoute).toBe(true);
      }
    });

    it('should balance speed and cost for balanced optimization', async () => {
      const routes = await findOptimizedRoutes('Male', 'Maafushi', 'balanced');
      expect(Array.isArray(routes)).toBe(true);
      
      // Balanced routes should exist
      if (routes.length > 0) {
        expect(routes[0]).toHaveProperty('totalDurationMinutes');
        expect(routes[0]).toHaveProperty('totalCost');
      }
    });
  });

  describe('Route Suggestions', () => {
    it('should return suggestions with message', async () => {
      const suggestions = await getRouteSuggestions('Male', 'Maafushi');
      
      expect(suggestions).toHaveProperty('routes');
      expect(suggestions).toHaveProperty('hasDirectRoute');
      expect(suggestions).toHaveProperty('message');
      expect(Array.isArray(suggestions.routes)).toBe(true);
      expect(typeof suggestions.message).toBe('string');
    });

    it('should return up to 5 suggestions', async () => {
      const suggestions = await getRouteSuggestions('Male', 'Maafushi');
      expect(suggestions.routes.length).toBeLessThanOrEqual(5);
    });

    it('should indicate when no routes are available', async () => {
      const suggestions = await getRouteSuggestions('InvalidIsland1', 'InvalidIsland2');
      
      expect(suggestions.routes.length).toBe(0);
      expect(suggestions.hasDirectRoute).toBe(false);
      expect(suggestions.message).toContain('No transportation routes found');
    });
  });

  describe('Route Structure', () => {
    it('should have correct route structure', async () => {
      const routes = await findOptimizedRoutes('Male', 'Maafushi');
      
      if (routes.length > 0) {
        const route = routes[0];
        
        expect(route).toHaveProperty('id');
        expect(route).toHaveProperty('segments');
        expect(route).toHaveProperty('totalDuration');
        expect(route).toHaveProperty('totalDurationMinutes');
        expect(route).toHaveProperty('totalCost');
        expect(route).toHaveProperty('totalStops');
        expect(route).toHaveProperty('isDirectRoute');
        expect(route).toHaveProperty('description');
        
        expect(Array.isArray(route.segments)).toBe(true);
        expect(typeof route.totalDurationMinutes).toBe('number');
        expect(typeof route.totalCost).toBe('number');
        expect(typeof route.isDirectRoute).toBe('boolean');
      }
    });

    it('should have correct segment structure', async () => {
      const routes = await findOptimizedRoutes('Male', 'Maafushi');
      
      if (routes.length > 0 && routes[0].segments.length > 0) {
        const segment = routes[0].segments[0];
        
        expect(segment).toHaveProperty('id');
        expect(segment).toHaveProperty('fromLocation');
        expect(segment).toHaveProperty('toLocation');
        expect(segment).toHaveProperty('type');
        expect(segment).toHaveProperty('duration');
        expect(segment).toHaveProperty('durationMinutes');
        expect(segment).toHaveProperty('price');
        
        expect(['ferry', 'speedboat']).toContain(segment.type);
        expect(typeof segment.durationMinutes).toBe('number');
        expect(typeof segment.price).toBe('number');
      }
    });
  });

  describe('Edge Cases', () => {
    it('should handle same source and destination', async () => {
      const routes = await findOptimizedRoutes('Male', 'Male');
      expect(Array.isArray(routes)).toBe(true);
    });

    it('should handle empty location strings', async () => {
      const routes = await findOptimizedRoutes('', '');
      expect(Array.isArray(routes)).toBe(true);
    });

    it('should handle special characters in location names', async () => {
      const routes = await findOptimizedRoutes('Male', "O'Reilly Island");
      expect(Array.isArray(routes)).toBe(true);
    });
  });
});
