/**
 * AI-powered meta tag generator using LLM
 * Generates optimized meta titles and descriptions for SEO
 */

export interface GeneratedMetaTags {
  title: string;
  description: string;
  keywords: string[];
  confidence: number;
}

export interface ContentForGeneration {
  id: number;
  title: string;
  content: string;
  type: "blog" | "package" | "island-guide" | "location";
  currentMetaTitle?: string;
  currentMetaDescription?: string;
}

/**
 * Generate meta tags using AI based on content
 * This would typically call a backend endpoint that uses the LLM
 */
export async function generateMetaTags(
  content: ContentForGeneration
): Promise<GeneratedMetaTags> {
  try {
    // In a real implementation, this would call a backend endpoint
    // that uses the LLM to generate meta tags
    const response = await fetch("/api/trpc/seo.generateMetaTags", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: content.title,
        content: content.content,
        type: content.type,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to generate meta tags");
    }

    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error("Error generating meta tags:", error);
    // Fallback to basic generation
    return generateBasicMetaTags(content);
  }
}

/**
 * Generate meta tags for multiple items in batch
 */
export async function generateMetaTagsBatch(
  items: ContentForGeneration[]
): Promise<Map<number, GeneratedMetaTags>> {
  const results = new Map<number, GeneratedMetaTags>();

  for (const item of items) {
    try {
      const tags = await generateMetaTags(item);
      results.set(item.id, tags);
      // Add small delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`Failed to generate tags for item ${item.id}:`, error);
      results.set(item.id, generateBasicMetaTags(item));
    }
  }

  return results;
}

/**
 * Fallback: Generate basic meta tags without AI
 */
export function generateBasicMetaTags(content: ContentForGeneration): GeneratedMetaTags {
  // Extract key words from title
  const titleWords = content.title.split(" ").filter((w) => w.length > 4);

  // Generate meta title (50-60 characters)
  let metaTitle = content.title;
  if (metaTitle.length > 60) {
    metaTitle = metaTitle.substring(0, 57) + "...";
  }

  // Add context based on type
  const typeContext = {
    blog: "| Isle Nomads Blog",
    package: "| Vacation Package",
    "island-guide": "| Island Guide",
    location: "| Maldives Travel",
  };

  metaTitle = `${metaTitle} ${typeContext[content.type]}`;
  if (metaTitle.length > 60) {
    metaTitle = metaTitle.substring(0, 57) + "...";
  }

  // Generate meta description (120-160 characters)
  let description = content.content.substring(0, 150);
  if (description.length < 120) {
    description += ` Learn more about ${content.title.toLowerCase()} at Isle Nomads.`;
  }
  if (description.length > 160) {
    description = description.substring(0, 157) + "...";
  }

  // Extract keywords
  const keywords = titleWords.slice(0, 5);

  return {
    title: metaTitle,
    description,
    keywords,
    confidence: 0.6, // Lower confidence for basic generation
  };
}

/**
 * Validate generated meta tags against SEO best practices
 */
export function validateGeneratedTags(tags: GeneratedMetaTags): {
  valid: boolean;
  issues: string[];
} {
  const issues: string[] = [];

  // Check title length
  if (tags.title.length < 30) {
    issues.push("Title is too short (minimum 30 characters)");
  }
  if (tags.title.length > 60) {
    issues.push("Title is too long (maximum 60 characters)");
  }

  // Check description length
  if (tags.description.length < 120) {
    issues.push("Description is too short (minimum 120 characters)");
  }
  if (tags.description.length > 160) {
    issues.push("Description is too long (maximum 160 characters)");
  }

  // Check keywords
  if (tags.keywords.length === 0) {
    issues.push("No keywords generated");
  }
  if (tags.keywords.length > 10) {
    issues.push("Too many keywords (maximum 10)");
  }

  // Check confidence
  if (tags.confidence < 0.5) {
    issues.push("Low confidence score - consider manual review");
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}

/**
 * Format keywords for display
 */
export function formatKeywords(keywords: string[]): string {
  return keywords.join(", ");
}

/**
 * Calculate SEO score for generated tags
 */
export function calculateMetaTagScore(tags: GeneratedMetaTags): number {
  let score = 50; // Base score

  // Title scoring
  if (tags.title.length >= 30 && tags.title.length <= 60) score += 20;
  else if (tags.title.length > 20 && tags.title.length < 70) score += 10;

  // Description scoring
  if (tags.description.length >= 120 && tags.description.length <= 160) score += 20;
  else if (tags.description.length > 100 && tags.description.length < 180) score += 10;

  // Keywords scoring
  if (tags.keywords.length >= 3 && tags.keywords.length <= 10) score += 10;

  // Confidence bonus
  score = Math.min(100, score + Math.round(tags.confidence * 10));

  return Math.max(0, Math.min(100, score));
}
