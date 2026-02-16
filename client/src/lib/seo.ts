/**
 * SEO Meta Tags Helper
 * Utilities for managing meta tags and structured data across the website
 */

export interface SeoMetaTags {
  title: string;
  description: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  canonicalUrl?: string;
}

export interface StructuredData {
  "@context": string;
  "@type": string;
  [key: string]: any;
}

/**
 * Update document meta tags
 */
export function updateMetaTags(seo: SeoMetaTags) {
  // Update title
  document.title = seo.title;

  // Update or create meta tags
  updateMetaTag("description", seo.description);
  if (seo.keywords) {
    updateMetaTag("keywords", seo.keywords);
  }

  // Open Graph tags
  if (seo.ogTitle) {
    updateMetaTag("og:title", seo.ogTitle, "property");
  }
  if (seo.ogDescription) {
    updateMetaTag("og:description", seo.ogDescription, "property");
  }
  if (seo.ogImage) {
    updateMetaTag("og:image", seo.ogImage, "property");
  }
  if (seo.ogUrl) {
    updateMetaTag("og:url", seo.ogUrl, "property");
  }

  // Twitter Card tags
  if (seo.twitterCard) {
    updateMetaTag("twitter:card", seo.twitterCard);
  }
  if (seo.twitterTitle) {
    updateMetaTag("twitter:title", seo.twitterTitle);
  }
  if (seo.twitterDescription) {
    updateMetaTag("twitter:description", seo.twitterDescription);
  }
  if (seo.twitterImage) {
    updateMetaTag("twitter:image", seo.twitterImage);
  }

  // Canonical URL
  if (seo.canonicalUrl) {
    updateCanonicalTag(seo.canonicalUrl);
  }
}

/**
 * Update or create a meta tag
 */
function updateMetaTag(
  name: string,
  content: string,
  attribute: "name" | "property" = "name"
) {
  let tag = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;

  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attribute, name);
    document.head.appendChild(tag);
  }

  tag.content = content;
}

/**
 * Update or create canonical tag
 */
function updateCanonicalTag(url: string) {
  let link = document.querySelector("link[rel='canonical']") as HTMLLinkElement;

  if (!link) {
    link = document.createElement("link");
    link.rel = "canonical";
    document.head.appendChild(link);
  }

  link.href = url;
}

/**
 * Add structured data (JSON-LD) to the page
 */
export function addStructuredData(data: StructuredData) {
  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
}

/**
 * Generate breadcrumb structured data
 */
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  const breadcrumbList: StructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return breadcrumbList;
}

/**
 * Generate product/package structured data
 */
export function generateProductSchema(product: {
  name: string;
  description: string;
  image: string;
  price: number;
  currency: string;
  rating?: number;
  reviewCount?: number;
  availability?: string;
}) {
  const schema: StructuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.image,
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: product.currency,
      availability: product.availability || "https://schema.org/InStock",
    },
  };

  if (product.rating && product.reviewCount) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
    };
  }

  return schema;
}

/**
 * Generate article structured data
 */
export function generateArticleSchema(article: {
  headline: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified?: string;
  author: string;
  url: string;
}) {
  const schema: StructuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.headline,
    description: article.description,
    image: article.image,
    datePublished: article.datePublished,
    dateModified: article.dateModified || article.datePublished,
    author: {
      "@type": "Person",
      name: article.author,
    },
    url: article.url,
  };

  return schema;
}

/**
 * Generate FAQ structured data
 */
export function generateFaqSchema(faqs: Array<{ question: string; answer: string }>) {
  const schema: StructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return schema;
}

/**
 * Generate local business structured data
 */
export function generateLocalBusinessSchema(business: {
  name: string;
  description: string;
  image: string;
  address: {
    streetAddress: string;
    addressLocality: string;
    postalCode: string;
    addressCountry: string;
  };
  telephone: string;
  email: string;
  url: string;
  rating?: number;
  reviewCount?: number;
}) {
  const schema: StructuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: business.name,
    description: business.description,
    image: business.image,
    address: {
      "@type": "PostalAddress",
      streetAddress: business.address.streetAddress,
      addressLocality: business.address.addressLocality,
      postalCode: business.address.postalCode,
      addressCountry: business.address.addressCountry,
    },
    telephone: business.telephone,
    email: business.email,
    url: business.url,
  };

  if (business.rating && business.reviewCount) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: business.rating,
      reviewCount: business.reviewCount,
    };
  }

  return schema;
}
