/**
 * GTM Tracking Wrapper Components and Utilities
 * Provides higher-order components and utilities for tracking interactions
 */

import React from 'react';
import {
  trackClick,
  trackFormSubmission,
  trackPackageBooking,
  trackDestinationView,
  trackSearch,
} from './gtm';

/**
 * Higher-order component to wrap buttons with click tracking
 * @param Component - The button component to wrap
 * @param trackingLabel - Label for tracking this button click
 * @param trackingCategory - Category for this button (optional)
 */
export const withClickTracking = (
  Component: React.ComponentType<any>,
  trackingLabel: string,
  trackingCategory: string = 'engagement'
) => {
  return (props: any) => {
    const handleClick = (e: React.MouseEvent) => {
      trackClick(trackingLabel, 'button', trackingCategory);
      props.onClick?.(e);
    };

    return <Component {...props} onClick={handleClick} />;
  };
};

/**
 * Higher-order component to wrap forms with submission tracking
 * @param Component - The form component to wrap
 * @param formName - Name of the form for tracking
 */
export const withFormTracking = (
  Component: React.ComponentType<any>,
  formName: string
) => {
  return (props: any) => {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      const formData = new FormData(e.currentTarget);
      const formFields: Record<string, any> = {};
      
      formData.forEach((value, key) => {
        formFields[key] = value;
      });

      trackFormSubmission(formName, formFields);
      props.onSubmit?.(e);
    };

    return <Component {...props} onSubmit={handleSubmit} />;
  };
};

/**
 * Utility to track package booking CTAs
 * @param packageName - Name of the package
 * @param packagePrice - Price of the package
 * @param packageCategory - Category of the package
 */
export const trackPackageCTA = (
  packageName: string,
  packagePrice?: number,
  packageCategory?: string
) => {
  trackPackageBooking(packageName, packagePrice, packageCategory);
};

/**
 * Utility to track destination/island link clicks
 * @param destinationName - Name of the destination
 * @param destinationType - Type of destination (island, atoll, resort, etc.)
 */
export const trackDestinationClick = (
  destinationName: string,
  destinationType: string = 'island'
) => {
  trackDestinationView(destinationName, destinationType);
  trackClick(`View ${destinationName}`, 'link', 'destination');
};

/**
 * Utility to track search submissions
 * @param searchQuery - The search query
 * @param searchCategory - Category being searched
 * @param resultsCount - Number of results
 */
export const trackSearchSubmit = (
  searchQuery: string,
  searchCategory: string = 'general',
  resultsCount?: number
) => {
  trackSearch(searchQuery, searchCategory, resultsCount);
  trackFormSubmission('search', { query: searchQuery, category: searchCategory });
};

/**
 * Utility to track CTA button clicks
 * @param ctaName - Name of the CTA
 * @param ctaType - Type of CTA (booking, contact, newsletter, etc.)
 */
export const trackCTA = (ctaName: string, ctaType: string = 'engagement') => {
  trackClick(ctaName, 'button', `cta_${ctaType}`);
};

/**
 * Utility to track navigation menu clicks
 * @param menuItem - Name of the menu item clicked
 * @param menuSection - Section of the menu (main, footer, etc.)
 */
export const trackMenuClick = (menuItem: string, menuSection: string = 'main') => {
  trackClick(menuItem, 'link', `navigation_${menuSection}`);
};

/**
 * Utility to track external link clicks
 * @param linkName - Name/label of the link
 * @param linkUrl - URL of the external link
 */
export const trackExternalLink = (linkName: string, linkUrl: string) => {
  trackClick(linkName, 'external_link', 'external');
};

/**
 * Utility to track social media link clicks
 * @param platform - Social media platform (facebook, instagram, twitter, etc.)
 */
export const trackSocialClick = (platform: string) => {
  trackClick(`Share on ${platform}`, 'social_link', 'social_media');
};

/**
 * Utility to track download/file access
 * @param fileName - Name of the file
 * @param fileType - Type of file (pdf, image, etc.)
 */
export const trackFileDownload = (fileName: string, fileType: string = 'file') => {
  trackClick(`Download ${fileName}`, 'download', 'file_access');
};

/**
 * Utility to track modal/dialog opens
 * @param modalName - Name of the modal
 */
export const trackModalOpen = (modalName: string) => {
  trackClick(`Open ${modalName}`, 'modal', 'engagement');
};

/**
 * Utility to track video plays
 * @param videoName - Name of the video
 */
export const trackVideoPlay = (videoName: string) => {
  trackClick(`Play ${videoName}`, 'video', 'media');
};

/**
 * Utility to track accordion/collapsible opens
 * @param sectionName - Name of the section
 */
export const trackAccordionOpen = (sectionName: string) => {
  trackClick(`Expand ${sectionName}`, 'accordion', 'engagement');
};

/**
 * Utility to track filter/sort actions
 * @param filterName - Name of the filter
 * @param filterValue - Value of the filter
 */
export const trackFilter = (filterName: string, filterValue: string) => {
  trackClick(`Filter by ${filterName}: ${filterValue}`, 'filter', 'search');
};

/**
 * Utility to track pagination clicks
 * @param pageNumber - Page number clicked
 */
export const trackPagination = (pageNumber: number) => {
  trackClick(`Go to page ${pageNumber}`, 'pagination', 'navigation');
};
