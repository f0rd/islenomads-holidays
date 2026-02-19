/**
 * Google Tag Manager (GTM) Event Tracking Utility
 * Provides functions to track user interactions and events in GTM
 */

declare global {
  interface Window {
    dataLayer: any[];
  }
}

/**
 * Initialize GTM dataLayer if not already initialized
 */
export const initializeGTM = () => {
  if (!window.dataLayer) {
    window.dataLayer = [];
  }
};

/**
 * Track a page view event
 * @param pageTitle - Title of the page
 * @param pagePath - Path of the page (e.g., /packages, /island-guides)
 */
export const trackPageView = (pageTitle: string, pagePath: string) => {
  initializeGTM();
  window.dataLayer.push({
    event: 'page_view',
    page_title: pageTitle,
    page_path: pagePath,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Track a click event
 * @param elementName - Name/label of the clicked element
 * @param elementType - Type of element (button, link, etc.)
 * @param elementCategory - Category of the element (navigation, CTA, etc.)
 */
export const trackClick = (
  elementName: string,
  elementType: string = 'button',
  elementCategory: string = 'engagement'
) => {
  initializeGTM();
  window.dataLayer.push({
    event: 'click',
    element_name: elementName,
    element_type: elementType,
    element_category: elementCategory,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Track a form submission
 * @param formName - Name of the form
 * @param formFields - Object containing form field names and values (optional)
 */
export const trackFormSubmission = (
  formName: string,
  formFields?: Record<string, any>
) => {
  initializeGTM();
  window.dataLayer.push({
    event: 'form_submit',
    form_name: formName,
    form_fields: formFields || {},
    timestamp: new Date().toISOString(),
  });
};

/**
 * Track a package booking/CTA
 * @param packageName - Name of the package
 * @param packagePrice - Price of the package
 * @param packageCategory - Category of the package
 */
export const trackPackageBooking = (
  packageName: string,
  packagePrice?: number,
  packageCategory?: string
) => {
  initializeGTM();
  window.dataLayer.push({
    event: 'package_booking',
    package_name: packageName,
    package_price: packagePrice,
    package_category: packageCategory,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Track a destination/island view
 * @param destinationName - Name of the destination
 * @param destinationType - Type (island, atoll, resort, etc.)
 */
export const trackDestinationView = (
  destinationName: string,
  destinationType: string = 'island'
) => {
  initializeGTM();
  window.dataLayer.push({
    event: 'destination_view',
    destination_name: destinationName,
    destination_type: destinationType,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Track a search action
 * @param searchQuery - The search query
 * @param searchCategory - Category being searched (islands, packages, etc.)
 * @param resultsCount - Number of results returned
 */
export const trackSearch = (
  searchQuery: string,
  searchCategory: string = 'general',
  resultsCount?: number
) => {
  initializeGTM();
  window.dataLayer.push({
    event: 'search',
    search_query: searchQuery,
    search_category: searchCategory,
    results_count: resultsCount,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Track a navigation action
 * @param navigationFrom - Where the user navigated from
 * @param navigationTo - Where the user navigated to
 */
export const trackNavigation = (navigationFrom: string, navigationTo: string) => {
  initializeGTM();
  window.dataLayer.push({
    event: 'navigation',
    navigation_from: navigationFrom,
    navigation_to: navigationTo,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Track a scroll event (for engagement tracking)
 * @param scrollDepth - Percentage of page scrolled (0-100)
 * @param pagePath - Path of the page
 */
export const trackScroll = (scrollDepth: number, pagePath: string) => {
  initializeGTM();
  window.dataLayer.push({
    event: 'scroll',
    scroll_depth: scrollDepth,
    page_path: pagePath,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Track a video/media play event
 * @param mediaName - Name of the media
 * @param mediaType - Type of media (video, audio, etc.)
 */
export const trackMediaPlay = (mediaName: string, mediaType: string = 'video') => {
  initializeGTM();
  window.dataLayer.push({
    event: 'media_play',
    media_name: mediaName,
    media_type: mediaType,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Track a custom event
 * @param eventName - Name of the event
 * @param eventData - Additional event data
 */
export const trackCustomEvent = (
  eventName: string,
  eventData?: Record<string, any>
) => {
  initializeGTM();
  window.dataLayer.push({
    event: eventName,
    ...eventData,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Track user engagement (time on page, interactions, etc.)
 * @param engagementType - Type of engagement (view, scroll, click, etc.)
 * @param engagementValue - Value associated with engagement
 */
export const trackEngagement = (
  engagementType: string,
  engagementValue?: any
) => {
  initializeGTM();
  window.dataLayer.push({
    event: 'engagement',
    engagement_type: engagementType,
    engagement_value: engagementValue,
    timestamp: new Date().toISOString(),
  });
};
