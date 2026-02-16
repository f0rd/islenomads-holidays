/**
 * Internal Linking Utility Functions
 * Provides helper functions for generating contextual links and managing relationships
 */

interface AtollLink {
  id: number;
  name: string;
  slug: string;
  region: string;
}

interface IslandLink {
  id: number;
  name: string;
  slug: string;
  atoll: string;
}

interface ActivityLink {
  name: string;
  url: string;
  description: string;
}

// Atoll relationship mapping
const ATOLL_RELATIONSHIPS: Record<string, string[]> = {
  "kaafu": ["lhaviyani", "alif-alif", "alif-dhaal"],
  "lhaviyani": ["kaafu", "alif-alif", "alif-dhaal"],
  "alif-alif": ["lhaviyani", "kaafu", "baa"],
  "alif-dhaal": ["alif-alif", "baa", "kaafu"],
  "baa": ["alif-alif", "alif-dhaal", "raa"],
  "raa": ["baa", "noonu", "shaviyani"],
  "noonu": ["raa", "shaviyani", "haa-alif"],
  "shaviyani": ["raa", "noonu", "haa-dhaalu"],
  "haa-alif": ["noonu", "haa-dhaalu", "shaviyani"],
  "haa-dhaalu": ["haa-alif", "shaviyani", "noonu"],
  "vaavu": ["meemu", "faafu", "dhaalu"],
  "meemu": ["vaavu", "faafu", "dhaalu"],
  "faafu": ["meemu", "dhaalu", "vaavu"],
  "dhaalu": ["faafu", "meemu", "thaa"],
  "thaa": ["dhaalu", "laamu", "gnaviyani"],
  "laamu": ["thaa", "gnaviyani", "addu"],
  "gnaviyani": ["laamu", "addu", "thaa"],
  "addu": ["gnaviyani", "laamu", "gaaf-alif"],
  "gaaf-alif": ["addu", "gaaf-dhaal", "gnaviyani"],
  "gaaf-dhaal": ["gaaf-alif", "addu", "laamu"],
};

// Activity-based linking
const ACTIVITY_DESTINATIONS: Record<string, string[]> = {
  "diving": [
    "kaafu",
    "lhaviyani",
    "alif-alif",
    "alif-dhaal",
    "baa",
    "vaavu",
    "addu",
    "raa",
  ],
  "manta-rays": ["baa", "alif-alif", "vaavu", "meemu"],
  "luxury": ["kaafu", "lhaviyani", "alif-alif"],
  "cultural-experiences": ["alif-dhaal", "meemu", "faafu", "dhaalu"],
  "snorkeling": ["baa", "alif-alif", "kaafu", "lhaviyani"],
  "island-hopping": ["alif-dhaal", "dhaalu", "meemu"],
  "family-vacations": ["kaafu", "lhaviyani", "dhaalu"],
  "adventure": ["raa", "noonu", "shaviyani", "addu"],
  "eco-tourism": ["baa", "faafu", "gnaviyani"],
};

/**
 * Get related atolls based on current atoll
 */
export function getRelatedAtolls(
  atollSlug: string,
  options?: {
    limit?: number;
    region?: string;
  }
): string[] {
  const limit = options?.limit || 4;
  const relatedSlugs = ATOLL_RELATIONSHIPS[atollSlug] || [];

  if (options?.region) {
    // Filter by region if specified
    return relatedSlugs.slice(0, limit);
  }

  return relatedSlugs.slice(0, limit);
}

/**
 * Get all atolls for a specific activity
 */
export function getAtollsByActivity(activity: string, limit = 8): string[] {
  const normalizedActivity = activity.toLowerCase().replace(/\s+/g, "-");
  return (ACTIVITY_DESTINATIONS[normalizedActivity] || []).slice(0, limit);
}

/**
 * Generate contextual links for content
 */
export function generateActivityLinks(activity: string): ActivityLink[] {
  const atolls = getAtollsByActivity(activity);

  return atolls.map((slug) => ({
    name: slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ") + " Atoll",
    url: `/atoll/${slug}`,
    description: `Explore ${activity} in ${slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")} Atoll`,
  }));
}

/**
 * Get breadcrumb navigation items
 */
export interface BreadcrumbItem {
  label: string;
  url: string;
}

export function getBreadcrumbItems(
  pageType: "atoll" | "island" | "activity",
  currentPage: string,
  additionalData?: Record<string, string>
): BreadcrumbItem[] {
  const items: BreadcrumbItem[] = [
    { label: "Home", url: "/" },
  ];

  switch (pageType) {
    case "atoll":
      items.push(
        { label: "Atoll Guides", url: "/atoll-guides" },
        { label: currentPage, url: "#" }
      );
      break;

    case "island":
      items.push(
        { label: "Island Guides", url: "/island-guides" },
        { label: currentPage, url: "#" }
      );
      if (additionalData?.atoll) {
        items.splice(2, 0, {
          label: additionalData.atoll,
          url: `/atoll/${additionalData.atollSlug || "#"}`,
        });
      }
      break;

    case "activity":
      items.push(
        { label: "Destinations", url: "/atoll-guides" },
        { label: currentPage, url: "#" }
      );
      break;
  }

  return items;
}

/**
 * Generate internal link anchor text with SEO optimization
 */
export function generateAnchorText(
  destination: string,
  activity?: string,
  type: "atoll" | "island" = "atoll"
): string {
  if (activity) {
    return `${activity} in ${destination}`;
  }

  if (type === "atoll") {
    return `Explore ${destination}`;
  }

  return `Visit ${destination}`;
}

/**
 * Get related islands for an island (would come from database in production)
 */
export function getRelatedIslands(
  islandSlug: string,
  options?: {
    limit?: number;
    atollOnly?: boolean;
  }
): string[] {
  // This would be populated from the database in production
  // For now, returning empty array
  return [];
}

/**
 * Check if two atolls are in the same region
 */
export function areAtollsInSameRegion(atoll1: string, atoll2: string): boolean {
  const northAtolls = [
    "kaafu",
    "lhaviyani",
    "alif-alif",
    "alif-dhaal",
    "baa",
    "raa",
    "noonu",
    "shaviyani",
    "haa-alif",
    "haa-dhaalu",
  ];
  const centralAtolls = ["vaavu", "meemu", "faafu", "dhaalu", "thaa"];
  const southAtolls = ["laamu", "gnaviyani", "addu", "gaaf-alif", "gaaf-dhaal"];

  const regions = [northAtolls, centralAtolls, southAtolls];

  for (const region of regions) {
    if (region.includes(atoll1) && region.includes(atoll2)) {
      return true;
    }
  }

  return false;
}

/**
 * Get atoll region
 */
export function getAtollRegion(atollSlug: string): "North" | "Central" | "South" | null {
  const northAtolls = [
    "kaafu",
    "lhaviyani",
    "alif-alif",
    "alif-dhaal",
    "baa",
    "raa",
    "noonu",
    "shaviyani",
    "haa-alif",
    "haa-dhaalu",
  ];
  const centralAtolls = ["vaavu", "meemu", "faafu", "dhaalu", "thaa"];
  const southAtolls = ["laamu", "gnaviyani", "addu", "gaaf-alif", "gaaf-dhaal"];

  if (northAtolls.includes(atollSlug)) return "North";
  if (centralAtolls.includes(atollSlug)) return "Central";
  if (southAtolls.includes(atollSlug)) return "South";

  return null;
}

/**
 * Generate schema.org BreadcrumbList JSON-LD
 */
export function generateBreadcrumbSchema(items: BreadcrumbItem[]): string {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: item.url.startsWith("http") ? item.url : `https://islenomads.com${item.url}`,
    })),
  };

  return JSON.stringify(schema);
}

/**
 * Generate internal link recommendations for content
 */
export function generateLinkRecommendations(
  contentType: "atoll" | "island" | "blog",
  contentSlug: string,
  keywords: string[]
): ActivityLink[] {
  const recommendations: ActivityLink[] = [];

  // Generate links based on keywords
  keywords.forEach((keyword) => {
    const activityLinks = generateActivityLinks(keyword);
    recommendations.push(...activityLinks);
  });

  // Remove duplicates
  const uniqueLinks = Array.from(
    new Map(recommendations.map((item) => [item.url, item])).values()
  );

  return uniqueLinks.slice(0, 5);
}

export default {
  getRelatedAtolls,
  getAtollsByActivity,
  generateActivityLinks,
  getBreadcrumbItems,
  generateAnchorText,
  getRelatedIslands,
  areAtollsInSameRegion,
  getAtollRegion,
  generateBreadcrumbSchema,
  generateLinkRecommendations,
};
