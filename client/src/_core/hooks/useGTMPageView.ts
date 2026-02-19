import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { trackPageView } from '@/lib/gtm';

/**
 * Custom hook to track page views in GTM whenever the route changes
 * Automatically sends page view events to GTM dataLayer
 */
export const useGTMPageView = () => {
  const [location] = useLocation();

  useEffect(() => {
    // Get page title from document or derive from path
    const pageTitle = document.title || getPageTitleFromPath(location);
    
    // Track the page view
    trackPageView(pageTitle, location);
  }, [location]);
};

/**
 * Helper function to derive page title from URL path
 * @param path - The current URL path
 * @returns A human-readable page title
 */
function getPageTitleFromPath(path: string): string {
  const pathSegments = path.split('/').filter(Boolean);
  
  if (pathSegments.length === 0) {
    return 'Home';
  }

  const lastSegment = pathSegments[pathSegments.length - 1];
  
  // Convert kebab-case to Title Case
  return lastSegment
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
