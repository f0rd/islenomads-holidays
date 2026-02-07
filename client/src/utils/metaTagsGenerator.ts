/**
 * Meta Tags & Structured Data Generator
 * Generates SEO-optimized meta tags and JSON-LD structured data
 */

export interface MetaTagsData {
  title: string;
  description: string;
  keywords?: string;
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  author?: string;
  publishedDate?: string;
  modifiedDate?: string;
  robotsIndex?: string;
  robotsFollow?: string;
}

export interface StructuredData {
  "@context": string;
  "@type": string;
  [key: string]: any;
}

/**
 * Generate HTML meta tags
 */
export function generateMetaTags(data: MetaTagsData): string {
  const tags: string[] = [];

  // Basic meta tags
  tags.push(`<meta charset="UTF-8">`);
  tags.push(`<meta name="viewport" content="width=device-width, initial-scale=1.0">`);
  tags.push(`<meta name="description" content="${escapeHtml(data.description)}">`);

  if (data.keywords) {
    tags.push(`<meta name="keywords" content="${escapeHtml(data.keywords)}">`);
  }

  if (data.author) {
    tags.push(`<meta name="author" content="${escapeHtml(data.author)}">`);
  }

  // Robots meta
  const robotsMeta = `${data.robotsIndex || "index"},${data.robotsFollow || "follow"}`;
  tags.push(`<meta name="robots" content="${robotsMeta}">`);

  // Canonical URL
  if (data.canonicalUrl) {
    tags.push(`<link rel="canonical" href="${escapeHtml(data.canonicalUrl)}">`);
  }

  // Open Graph tags
  tags.push(`<meta property="og:title" content="${escapeHtml(data.ogTitle || data.title)}">`);
  tags.push(
    `<meta property="og:description" content="${escapeHtml(data.ogDescription || data.description)}">`
  );
  tags.push(`<meta property="og:type" content="${data.ogType || "website"}">`);

  if (data.ogImage) {
    tags.push(`<meta property="og:image" content="${escapeHtml(data.ogImage)}">`);
    tags.push(`<meta property="og:image:alt" content="${escapeHtml(data.ogTitle || data.title)}">`);
  }

  // Twitter Card tags
  tags.push(`<meta name="twitter:card" content="${data.twitterCard || "summary_large_image"}">`);
  tags.push(
    `<meta name="twitter:title" content="${escapeHtml(data.twitterTitle || data.ogTitle || data.title)}">`
  );
  tags.push(
    `<meta name="twitter:description" content="${escapeHtml(data.twitterDescription || data.ogDescription || data.description)}">`
  );

  if (data.twitterImage) {
    tags.push(`<meta name="twitter:image" content="${escapeHtml(data.twitterImage)}">`);
  }

  // Article meta tags
  if (data.publishedDate) {
    tags.push(`<meta property="article:published_time" content="${data.publishedDate}">`);
  }

  if (data.modifiedDate) {
    tags.push(`<meta property="article:modified_time" content="${data.modifiedDate}">`);
  }

  return tags.join("\n");
}

/**
 * Generate JSON-LD structured data for blog post
 */
export function generateBlogPostSchema(data: {
  title: string;
  description: string;
  content: string;
  author: string;
  publishedDate: string;
  modifiedDate?: string;
  image?: string;
  url: string;
  siteUrl: string;
  siteName: string;
}): StructuredData {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: data.title,
    description: data.description,
    articleBody: data.content,
    image: data.image || `${data.siteUrl}/og-image.jpg`,
    datePublished: data.publishedDate,
    dateModified: data.modifiedDate || data.publishedDate,
    author: {
      "@type": "Person",
      name: data.author,
    },
    publisher: {
      "@type": "Organization",
      name: data.siteName,
      logo: {
        "@type": "ImageObject",
        url: `${data.siteUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": data.url,
    },
  };
}

/**
 * Generate JSON-LD structured data for product (packages)
 */
export function generateProductSchema(data: {
  name: string;
  description: string;
  price: number;
  currency: string;
  image?: string;
  url: string;
  siteUrl: string;
  siteName: string;
  rating?: number;
  reviewCount?: number;
  availability?: string;
}): StructuredData {
  return {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: data.name,
    description: data.description,
    image: data.image || `${data.siteUrl}/og-image.jpg`,
    url: data.url,
    offers: {
      "@type": "Offer",
      url: data.url,
      priceCurrency: data.currency,
      price: (data.price / 100).toFixed(2),
      availability: data.availability || "https://schema.org/InStock",
    },
    ...(data.rating && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: data.rating,
        reviewCount: data.reviewCount || 1,
      },
    }),
  };
}

/**
 * Generate JSON-LD structured data for organization
 */
export function generateOrganizationSchema(data: {
  name: string;
  description: string;
  url: string;
  logo?: string;
  email?: string;
  phone?: string;
  address?: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  socialProfiles?: string[];
}): StructuredData {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: data.name,
    description: data.description,
    url: data.url,
    ...(data.logo && { logo: data.logo }),
    ...(data.email && { email: data.email }),
    ...(data.phone && { telephone: data.phone }),
    ...(data.address && { address: data.address }),
    ...(data.socialProfiles && { sameAs: data.socialProfiles }),
  };
}

/**
 * Generate JSON-LD structured data for breadcrumb navigation
 */
export function generateBreadcrumbSchema(breadcrumbs: Array<{
  name: string;
  url: string;
}>): StructuredData {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Generate JSON-LD structured data for FAQ
 */
export function generateFAQSchema(faqs: Array<{
  question: string;
  answer: string;
}>): StructuredData {
  return {
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
}

/**
 * Generate sitemap entry
 */
export interface SitemapEntry {
  loc: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: number;
}

export function generateSitemapXML(entries: SitemapEntry[]): string {
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ];

  entries.forEach((entry) => {
    xml.push("  <url>");
    xml.push(`    <loc>${escapeHtml(entry.loc)}</loc>`);
    if (entry.lastmod) {
      xml.push(`    <lastmod>${entry.lastmod}</lastmod>`);
    }
    if (entry.changefreq) {
      xml.push(`    <changefreq>${entry.changefreq}</changefreq>`);
    }
    if (entry.priority !== undefined) {
      xml.push(`    <priority>${entry.priority}</priority>`);
    }
    xml.push("  </url>");
  });

  xml.push("</urlset>");
  return xml.join("\n");
}

/**
 * Generate robots.txt content
 */
export function generateRobotsTxt(config: {
  disallowPaths?: string[];
  allowPaths?: string[];
  sitemapUrl?: string;
  crawlDelay?: number;
}): string {
  const lines: string[] = ["User-agent: *"];

  if (config.allowPaths) {
    config.allowPaths.forEach((path) => {
      lines.push(`Allow: ${path}`);
    });
  }

  if (config.disallowPaths) {
    config.disallowPaths.forEach((path) => {
      lines.push(`Disallow: ${path}`);
    });
  }

  if (config.crawlDelay) {
    lines.push(`Crawl-delay: ${config.crawlDelay}`);
  }

  if (config.sitemapUrl) {
    lines.push(`\nSitemap: ${config.sitemapUrl}`);
  }

  return lines.join("\n");
}

/**
 * Escape HTML special characters
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (char) => map[char]);
}

/**
 * Generate complete SEO head section
 */
export function generateSEOHead(data: {
  metaTags: MetaTagsData;
  blogPostSchema?: Parameters<typeof generateBlogPostSchema>[0];
  productSchema?: Parameters<typeof generateProductSchema>[0];
  organizationSchema?: Parameters<typeof generateOrganizationSchema>[0];
  breadcrumbSchema?: Parameters<typeof generateBreadcrumbSchema>[0];
  faqSchema?: Parameters<typeof generateFAQSchema>[0];
}): string {
  const head: string[] = [];

  // Meta tags
  head.push(generateMetaTags(data.metaTags));

  // Structured data
  const schemas: StructuredData[] = [];

  if (data.blogPostSchema) {
    schemas.push(generateBlogPostSchema(data.blogPostSchema));
  }

  if (data.productSchema) {
    schemas.push(generateProductSchema(data.productSchema));
  }

  if (data.organizationSchema) {
    schemas.push(generateOrganizationSchema(data.organizationSchema));
  }

  if (data.breadcrumbSchema) {
    schemas.push(generateBreadcrumbSchema(data.breadcrumbSchema));
  }

  if (data.faqSchema) {
    schemas.push(generateFAQSchema(data.faqSchema));
  }

  if (schemas.length > 0) {
    head.push(
      `<script type="application/ld+json">\n${JSON.stringify(schemas.length === 1 ? schemas[0] : schemas, null, 2)}\n</script>`
    );
  }

  return head.join("\n");
}
