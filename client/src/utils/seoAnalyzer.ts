/**
 * SEO Analyzer Utility
 * Provides comprehensive SEO analysis and recommendations for blog posts and pages
 */

export interface SEOAnalysis {
  score: number; // 0-100
  issues: SEOIssue[];
  warnings: SEOWarning[];
  suggestions: SEOSuggestion[];
  metrics: SEOMetrics;
}

export interface SEOIssue {
  type: "critical" | "error" | "warning";
  message: string;
  field: string;
  impact: "high" | "medium" | "low";
}

export interface SEOWarning {
  message: string;
  field: string;
}

export interface SEOSuggestion {
  message: string;
  priority: "high" | "medium" | "low";
}

export interface SEOMetrics {
  titleLength: number;
  descriptionLength: number;
  headingStructure: string[];
  wordCount: number;
  readabilityScore: number;
  keywordDensity: number;
  internalLinks: number;
  externalLinks: number;
  imageCount: number;
  imageAltTextCount: number;
}

/**
 * Analyze SEO for a blog post
 */
export function analyzeSEO(data: {
  title: string;
  metaTitle?: string;
  metaDescription?: string;
  focusKeyword?: string;
  content: string;
  slug: string;
  excerpt?: string;
}): SEOAnalysis {
  const issues: SEOIssue[] = [];
  const warnings: SEOWarning[] = [];
  const suggestions: SEOSuggestion[] = [];
  let score = 100;

  // Analyze title
  const titleLength = data.metaTitle?.length || data.title.length || 0;
  if (titleLength === 0) {
    issues.push({
      type: "critical",
      message: "Meta title is missing",
      field: "metaTitle",
      impact: "high",
    });
    score -= 15;
  } else if (titleLength < 30) {
    warnings.push({
      message: "Meta title is too short (minimum 30 characters recommended)",
      field: "metaTitle",
    });
    score -= 5;
  } else if (titleLength > 60) {
    warnings.push({
      message: "Meta title is too long (maximum 60 characters recommended)",
      field: "metaTitle",
    });
    score -= 5;
  }

  // Analyze meta description
  const descLength = data.metaDescription?.length || 0;
  if (descLength === 0) {
    issues.push({
      type: "error",
      message: "Meta description is missing",
      field: "metaDescription",
      impact: "high",
    });
    score -= 15;
  } else if (descLength < 120) {
    warnings.push({
      message: "Meta description is too short (minimum 120 characters recommended)",
      field: "metaDescription",
    });
    score -= 5;
  } else if (descLength > 160) {
    warnings.push({
      message: "Meta description is too long (maximum 160 characters recommended)",
      field: "metaDescription",
    });
    score -= 5;
  }

  // Analyze focus keyword
  if (!data.focusKeyword) {
    suggestions.push({
      message: "Define a focus keyword to optimize content around it",
      priority: "high",
    });
    score -= 10;
  } else {
    const keywordDensity = calculateKeywordDensity(data.content, data.focusKeyword);
    if (keywordDensity < 0.5) {
      suggestions.push({
        message: `Focus keyword "${data.focusKeyword}" appears too infrequently (${keywordDensity.toFixed(2)}%)`,
        priority: "medium",
      });
      score -= 5;
    } else if (keywordDensity > 3) {
      warnings.push({
        message: `Focus keyword "${data.focusKeyword}" appears too frequently (${keywordDensity.toFixed(2)}%) - may be keyword stuffing`,
        field: "focusKeyword",
      });
      score -= 5;
    }
  }

  // Analyze content
  const wordCount = data.content.split(/\s+/).length;
  if (wordCount < 300) {
    warnings.push({
      message: "Content is too short (minimum 300 words recommended for SEO)",
      field: "content",
    });
    score -= 10;
  } else if (wordCount < 600) {
    suggestions.push({
      message: "Consider expanding content to 600+ words for better SEO",
      priority: "medium",
    });
    score -= 5;
  }

  // Analyze headings
  const headings = extractHeadings(data.content);
  if (headings.length === 0) {
    warnings.push({
      message: "No headings found in content - add H2/H3 headings for better structure",
      field: "content",
    });
    score -= 10;
  } else if (!headings.some((h) => h.startsWith("h1"))) {
    warnings.push({
      message: "No H1 heading found - add a main heading",
      field: "content",
    });
    score -= 5;
  }

  // Analyze slug
  if (!data.slug) {
    issues.push({
      type: "error",
      message: "URL slug is missing",
      field: "slug",
      impact: "high",
    });
    score -= 10;
  } else if (data.slug.length > 75) {
    warnings.push({
      message: "URL slug is too long (maximum 75 characters recommended)",
      field: "slug",
    });
    score -= 5;
  } else if (!/^[a-z0-9-]+$/.test(data.slug)) {
    warnings.push({
      message: "URL slug contains invalid characters - use only lowercase letters, numbers, and hyphens",
      field: "slug",
    });
    score -= 5;
  }

  // Analyze images
  const imageCount = (data.content.match(/<img/gi) || []).length;
  const imageAltCount = (data.content.match(/alt="[^"]+"/gi) || []).length;
  if (imageCount === 0) {
    suggestions.push({
      message: "Add images to make content more engaging and improve SEO",
      priority: "medium",
    });
    score -= 5;
  } else if (imageAltCount < imageCount) {
    warnings.push({
      message: `${imageCount - imageAltCount} image(s) missing alt text - add alt text to all images`,
      field: "content",
    });
    score -= 5;
  }

  // Analyze links
  const internalLinks = (data.content.match(/href="\/[^"]*"/gi) || []).length;
  const externalLinks = (data.content.match(/href="https?:\/\/[^"]*"/gi) || []).length;
  if (internalLinks === 0 && externalLinks === 0) {
    suggestions.push({
      message: "Add internal and external links to improve SEO and user experience",
      priority: "medium",
    });
    score -= 5;
  }

  // Calculate readability score
  const readabilityScore = calculateReadabilityScore(data.content);

  // Ensure score stays within bounds
  score = Math.max(0, Math.min(100, score));

  const metrics: SEOMetrics = {
    titleLength,
    descriptionLength: descLength,
    headingStructure: headings,
    wordCount,
    readabilityScore,
    keywordDensity: data.focusKeyword
      ? calculateKeywordDensity(data.content, data.focusKeyword)
      : 0,
    internalLinks,
    externalLinks,
    imageCount,
    imageAltTextCount: imageAltCount,
  };

  return {
    score,
    issues,
    warnings,
    suggestions,
    metrics,
  };
}

/**
 * Calculate keyword density
 */
function calculateKeywordDensity(content: string, keyword: string): number {
  const cleanContent = content.toLowerCase().replace(/<[^>]*>/g, "");
  const words = cleanContent.split(/\s+/);
  const keywordCount = words.filter((w) => w.includes(keyword.toLowerCase())).length;
  return (keywordCount / words.length) * 100;
}

/**
 * Extract headings from HTML content
 */
function extractHeadings(content: string): string[] {
  const headingRegex = /<h([1-6])[^>]*>([^<]+)<\/h\1>/gi;
  const headings: string[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    headings.push(`h${match[1]}`);
  }

  return headings;
}

/**
 * Calculate readability score (simplified Flesch-Kincaid)
 */
function calculateReadabilityScore(content: string): number {
  const cleanContent = content.replace(/<[^>]*>/g, "");
  const sentences = cleanContent.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const words = cleanContent.split(/\s+/).filter((w) => w.length > 0);
  const syllables = countSyllables(cleanContent);

  if (sentences.length === 0 || words.length === 0) return 0;

  const score =
    206.835 -
    1.015 * (words.length / sentences.length) -
    84.6 * (syllables / words.length);

  return Math.max(0, Math.min(100, score));
}

/**
 * Count syllables in text (simplified)
 */
function countSyllables(text: string): number {
  const words = text.toLowerCase().split(/\s+/);
  let count = 0;

  words.forEach((word) => {
    word = word.replace(/[^a-z]/g, "");
    if (word.length <= 3) {
      count += 1;
    } else {
      count += (word.match(/[aeiouy]/g) || []).length;
    }
  });

  return count;
}

/**
 * Generate SEO-friendly slug from title
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .substring(0, 75);
}

/**
 * Generate meta description from content
 */
export function generateMetaDescription(
  content: string,
  maxLength: number = 160
): string {
  const cleanContent = content
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();

  if (cleanContent.length <= maxLength) {
    return cleanContent;
  }

  return cleanContent.substring(0, maxLength - 3) + "...";
}

/**
 * Get SEO score color
 */
export function getSEOScoreColor(score: number): string {
  if (score >= 80) return "text-green-600";
  if (score >= 60) return "text-yellow-600";
  if (score >= 40) return "text-orange-600";
  return "text-red-600";
}

/**
 * Get SEO score background color
 */
export function getSEOScoreBgColor(score: number): string {
  if (score >= 80) return "bg-green-50 border-green-200";
  if (score >= 60) return "bg-yellow-50 border-yellow-200";
  if (score >= 40) return "bg-orange-50 border-orange-200";
  return "bg-red-50 border-red-200";
}

/**
 * Validate SEO fields
 */
export function validateSEOFields(data: {
  metaTitle?: string;
  metaDescription?: string;
  slug?: string;
}): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data.metaTitle || data.metaTitle.length === 0) {
    errors.push("Meta title is required");
  } else if (data.metaTitle.length < 30) {
    errors.push("Meta title should be at least 30 characters");
  } else if (data.metaTitle.length > 60) {
    errors.push("Meta title should not exceed 60 characters");
  }

  if (!data.metaDescription || data.metaDescription.length === 0) {
    errors.push("Meta description is required");
  } else if (data.metaDescription.length < 120) {
    errors.push("Meta description should be at least 120 characters");
  } else if (data.metaDescription.length > 160) {
    errors.push("Meta description should not exceed 160 characters");
  }

  if (!data.slug || data.slug.length === 0) {
    errors.push("URL slug is required");
  } else if (!/^[a-z0-9-]+$/.test(data.slug)) {
    errors.push("URL slug can only contain lowercase letters, numbers, and hyphens");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
