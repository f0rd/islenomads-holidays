import { useEffect } from 'react';

export interface SeoMetaConfig {
  title: string;
  description: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  canonicalUrl?: string;
  twitterCard?: string;
}

/**
 * Hook to set SEO meta tags dynamically on pages
 * Usage: useSeoMeta({ title: "Page Title", description: "..." })
 */
export function useSeoMeta(config: SeoMetaConfig) {
  useEffect(() => {
    // Set page title
    document.title = config.title;

    // Set or update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', config.description);

    // Set or update meta keywords
    if (config.keywords) {
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.setAttribute('name', 'keywords');
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.setAttribute('content', config.keywords);
    }

    // Set Open Graph tags
    const ogTitle = config.ogTitle || config.title;
    const ogDescription = config.ogDescription || config.description;

    updateOrCreateMetaTag('og:title', ogTitle, 'property');
    updateOrCreateMetaTag('og:description', ogDescription, 'property');
    updateOrCreateMetaTag('og:type', 'website', 'property');

    if (config.ogImage) {
      updateOrCreateMetaTag('og:image', config.ogImage, 'property');
      updateOrCreateMetaTag('og:image:alt', ogTitle, 'property');
    }

    // Set Twitter Card tags
    updateOrCreateMetaTag('twitter:card', config.twitterCard || 'summary_large_image', 'name');
    updateOrCreateMetaTag('twitter:title', ogTitle, 'name');
    updateOrCreateMetaTag('twitter:description', ogDescription, 'name');

    if (config.ogImage) {
      updateOrCreateMetaTag('twitter:image', config.ogImage, 'name');
    }

    // Set canonical URL
    if (config.canonicalUrl) {
      let canonical = document.querySelector('link[rel="canonical"]');
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
      }
      canonical.setAttribute('href', config.canonicalUrl);
    }
  }, [config]);
}

/**
 * Helper function to update or create meta tags
 */
function updateOrCreateMetaTag(
  name: string,
  content: string,
  attribute: 'name' | 'property' = 'name'
) {
  let tag = document.querySelector(`meta[${attribute}="${name}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attribute, name);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

/**
 * Helper function to add structured data (JSON-LD) to page
 */
export function addStructuredData(data: any, id: string = 'structured-data') {
  let script = document.getElementById(id) as HTMLScriptElement | null;
  if (!script) {
    script = document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data);
}
