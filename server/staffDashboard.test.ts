import { describe, it, expect } from 'vitest';
import { getAnalyticsDashboardData } from './db';

describe('StaffDashboard - Real Data Tests', () => {
  it('should fetch dashboard statistics with real data', async () => {
    const data = await getAnalyticsDashboardData();
    
    expect(data).toBeDefined();
    expect(data?.summary).toBeDefined();
    expect(typeof data?.summary?.totalBlogPosts).toBe('number');
    expect(typeof data?.summary?.totalPackages).toBe('number');
    expect(typeof data?.summary?.totalIslandGuides).toBe('number');
    expect(typeof data?.summary?.totalActivitySpots).toBe('number');
  });

  it('should return non-negative counts', async () => {
    const data = await getAnalyticsDashboardData();
    
    expect(data?.summary?.totalBlogPosts).toBeGreaterThanOrEqual(0);
    expect(data?.summary?.totalPackages).toBeGreaterThanOrEqual(0);
    expect(data?.summary?.totalIslandGuides).toBeGreaterThanOrEqual(0);
    expect(data?.summary?.totalActivitySpots).toBeGreaterThanOrEqual(0);
  });

  it('should include featured packages count', async () => {
    const data = await getAnalyticsDashboardData();
    
    expect(data?.summary?.featuredPackages).toBeDefined();
    expect(typeof data?.summary?.featuredPackages).toBe('number');
    expect(data?.summary?.featuredPackages).toBeGreaterThanOrEqual(0);
  });

  it('should include published content counts', async () => {
    const data = await getAnalyticsDashboardData();
    
    expect(data?.summary?.publishedBlogPosts).toBeDefined();
    expect(data?.summary?.publishedIslandGuides).toBeDefined();
    expect(typeof data?.summary?.publishedBlogPosts).toBe('number');
    expect(typeof data?.summary?.publishedIslandGuides).toBe('number');
  });

  it('should have published counts less than or equal to total counts', async () => {
    const data = await getAnalyticsDashboardData();
    
    expect(data?.summary?.publishedBlogPosts).toBeLessThanOrEqual(data?.summary?.totalBlogPosts || 0);
    expect(data?.summary?.publishedIslandGuides).toBeLessThanOrEqual(data?.summary?.totalIslandGuides || 0);
  });

  it('should include CRM query statistics', async () => {
    const data = await getAnalyticsDashboardData();
    
    expect(data?.summary?.totalCrmQueries).toBeDefined();
    expect(typeof data?.summary?.totalCrmQueries).toBe('number');
    expect(data?.summary?.totalCrmQueries).toBeGreaterThanOrEqual(0);
  });

  it('should include distribution data', async () => {
    const data = await getAnalyticsDashboardData();
    
    expect(data?.distribution).toBeDefined();
    expect(data?.distribution?.packageCategories).toBeDefined();
    expect(data?.distribution?.crmStatus).toBeDefined();
  });

  it('should include top data', async () => {
    const data = await getAnalyticsDashboardData();
    
    expect(data?.topData).toBeDefined();
    expect(data?.topData?.topDestinations).toBeDefined();
    expect(Array.isArray(data?.topData?.topDestinations)).toBe(true);
  });

  it('should include engagement metrics', async () => {
    const data = await getAnalyticsDashboardData();
    
    expect(data?.engagement).toBeDefined();
    expect(data?.engagement?.totalBlogViews).toBeDefined();
    expect(data?.engagement?.avgBlogViews).toBeDefined();
    expect(typeof data?.engagement?.totalBlogViews).toBe('number');
    expect(typeof data?.engagement?.avgBlogViews).toBe('number');
  });

  it('should have average blog views less than or equal to total blog views', async () => {
    const data = await getAnalyticsDashboardData();
    
    if ((data?.summary?.totalBlogPosts || 0) > 0) {
      expect(data?.engagement?.avgBlogViews).toBeLessThanOrEqual(data?.engagement?.totalBlogViews || 0);
    }
  });

  it('should have all required summary fields', async () => {
    const data = await getAnalyticsDashboardData();
    const summary = data?.summary;
    
    const requiredFields = [
      'totalPackages',
      'totalIslandGuides',
      'totalBlogPosts',
      'totalActivitySpots',
      'totalCrmQueries',
      'featuredPackages',
      'publishedBlogPosts',
      'publishedIslandGuides'
    ];
    
    requiredFields.forEach(field => {
      expect(summary).toHaveProperty(field);
    });
  });

  it('should have engagement and distribution data structures', async () => {
    const data = await getAnalyticsDashboardData();
    
    expect(data?.engagement).toBeDefined();
    expect(data?.distribution).toBeDefined();
    expect(data?.topData).toBeDefined();
    expect(data?.recentActivity).toBeDefined();
  });
});
