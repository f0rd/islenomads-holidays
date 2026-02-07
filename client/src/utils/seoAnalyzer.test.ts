import { describe, it, expect } from "vitest";
import {
  analyzeSEO,
  generateSlug,
  generateMetaDescription,
  getSEOScoreColor,
  getSEOScoreBgColor,
  validateSEOFields,
} from "./seoAnalyzer";

describe("SEO Analyzer", () => {
  describe("analyzeSEO", () => {
    it("should analyze basic SEO data", () => {
      const result = analyzeSEO({
        title: "Best Maldives Travel Guide",
        metaTitle: "Best Maldives Travel Guide 2024",
        metaDescription: "Discover the ultimate guide to traveling in the Maldives with tips, destinations, and travel advice for your perfect vacation.",
        focusKeyword: "Maldives travel",
        content: "The Maldives is a beautiful tropical destination. It offers pristine beaches and crystal clear waters. Visitors can enjoy water sports, diving, and snorkeling. The islands are perfect for a romantic getaway or family vacation. Many resorts offer all-inclusive packages.",
        slug: "best-maldives-travel-guide",
      });

      expect(result.score).toBeGreaterThan(0);
      expect(result.score).toBeLessThanOrEqual(100);
      expect(result.metrics).toBeDefined();
      expect(result.metrics.wordCount).toBeGreaterThan(0);
    });

    it("should detect missing meta title", () => {
      const result = analyzeSEO({
        title: "Test",
        content: "This is test content with enough words to pass the word count check.",
        slug: "test",
      });

      // Missing meta title creates an issue
      const hasMetaTitleIssue = result.issues.some((i) => i.field === "metaTitle") || 
                                result.warnings.some((w) => w.field === "metaTitle");
      expect(hasMetaTitleIssue).toBe(true);
    });

    it("should detect missing meta description", () => {
      const result = analyzeSEO({
        title: "Test",
        metaTitle: "Test Title",
        content: "This is test content with enough words to pass the word count check.",
        slug: "test",
      });

      expect(result.issues.some((i) => i.field === "metaDescription")).toBe(true);
    });

    it("should warn about short meta title", () => {
      const result = analyzeSEO({
        title: "Test",
        metaTitle: "Short",
        metaDescription: "This is a proper meta description with enough characters to pass validation.",
        content: "This is test content with enough words to pass the word count check.",
        slug: "test",
      });

      expect(result.warnings.some((w) => w.field === "metaTitle")).toBe(true);
    });

    it("should warn about long meta title", () => {
      const result = analyzeSEO({
        title: "Test",
        metaTitle: "This is a very long meta title that exceeds the recommended 60 character limit",
        metaDescription: "This is a proper meta description with enough characters to pass validation.",
        content: "This is test content with enough words to pass the word count check.",
        slug: "test",
      });

      expect(result.warnings.some((w) => w.field === "metaTitle")).toBe(true);
    });

    it("should calculate keyword density", () => {
      const result = analyzeSEO({
        title: "Maldives",
        metaTitle: "Maldives Travel Guide",
        metaDescription: "Learn about traveling to the Maldives with our comprehensive guide.",
        focusKeyword: "Maldives",
        content: "Maldives is beautiful. The Maldives offers great beaches. Visit Maldives for vacation.",
        slug: "maldives-guide",
      });

      expect(result.metrics.keywordDensity).toBeGreaterThan(0);
    });

    it("should detect missing focus keyword", () => {
      const result = analyzeSEO({
        title: "Test",
        metaTitle: "Test Title",
        metaDescription: "This is a proper meta description with enough characters to pass validation.",
        content: "This is test content with enough words to pass the word count check.",
        slug: "test",
      });

      expect(result.suggestions.some((s) => s.message.includes("focus keyword"))).toBe(true);
    });

    it("should warn about short content", () => {
      const result = analyzeSEO({
        title: "Test",
        metaTitle: "Test Title",
        metaDescription: "This is a proper meta description with enough characters to pass validation.",
        content: "Short content",
        slug: "test",
      });

      expect(result.warnings.some((w) => w.field === "content")).toBe(true);
    });

    it("should detect missing headings", () => {
      const result = analyzeSEO({
        title: "Test",
        metaTitle: "Test Title",
        metaDescription: "This is a proper meta description with enough characters to pass validation.",
        content: "This is test content with enough words to pass the word count check. No headings here.",
        slug: "test",
      });

      expect(result.warnings.some((w) => w.message.includes("heading"))).toBe(true);
    });

    it("should detect headings in content", () => {
      const result = analyzeSEO({
        title: "Test",
        metaTitle: "Test Title",
        metaDescription: "This is a proper meta description with enough characters to pass validation.",
        content: "<h1>Main Heading</h1><h2>Subheading</h2>This is test content with enough words to pass the word count check.",
        slug: "test",
      });

      expect(result.metrics.headingStructure.length).toBeGreaterThan(0);
    });

    it("should validate slug format", () => {
      const result = analyzeSEO({
        title: "Test",
        metaTitle: "Test Title",
        metaDescription: "This is a proper meta description with enough characters to pass validation.",
        content: "This is test content with enough words to pass the word count check.",
        slug: "invalid_slug-with-CAPS",
      });

      expect(result.warnings.some((w) => w.field === "slug")).toBe(true);
    });

    it("should calculate readability score", () => {
      const result = analyzeSEO({
        title: "Test",
        metaTitle: "Test Title",
        metaDescription: "This is a proper meta description with enough characters to pass validation.",
        content: "The quick brown fox jumps over the lazy dog. This is a test sentence. It has multiple words.",
        slug: "test",
      });

      expect(result.metrics.readabilityScore).toBeGreaterThanOrEqual(0);
      expect(result.metrics.readabilityScore).toBeLessThanOrEqual(100);
    });
  });

  describe("generateSlug", () => {
    it("should generate valid slug from title", () => {
      const slug = generateSlug("Best Maldives Travel Guide");
      expect(slug).toBe("best-maldives-travel-guide");
    });

    it("should handle special characters", () => {
      const slug = generateSlug("Best & Amazing Maldives Travel Guide!");
      expect(slug).toBe("best-amazing-maldives-travel-guide");
    });

    it("should limit slug length", () => {
      const longTitle = "This is a very long title that should be truncated to fit within the maximum slug length";
      const slug = generateSlug(longTitle);
      expect(slug.length).toBeLessThanOrEqual(75);
    });

    it("should handle multiple spaces", () => {
      const slug = generateSlug("Best   Maldives   Travel");
      expect(slug).toBe("best-maldives-travel");
    });
  });

  describe("generateMetaDescription", () => {
    it("should generate meta description from content", () => {
      const content = "This is a test content for meta description generation.";
      const description = generateMetaDescription(content);
      expect(description).toBe(content);
    });

    it("should truncate long content", () => {
      const longContent = "A".repeat(200);
      const description = generateMetaDescription(longContent);
      expect(description.length).toBeLessThanOrEqual(160);
      expect(description.endsWith("...")).toBe(true);
    });

    it("should respect custom max length", () => {
      const content = "A".repeat(200);
      const description = generateMetaDescription(content, 100);
      expect(description.length).toBeLessThanOrEqual(100);
    });
  });

  describe("getSEOScoreColor", () => {
    it("should return green for high score", () => {
      expect(getSEOScoreColor(85)).toBe("text-green-600");
    });

    it("should return yellow for medium-high score", () => {
      expect(getSEOScoreColor(70)).toBe("text-yellow-600");
    });

    it("should return orange for medium score", () => {
      expect(getSEOScoreColor(50)).toBe("text-orange-600");
    });

    it("should return red for low score", () => {
      expect(getSEOScoreColor(20)).toBe("text-red-600");
    });
  });

  describe("getSEOScoreBgColor", () => {
    it("should return green background for high score", () => {
      expect(getSEOScoreBgColor(85)).toBe("bg-green-50 border-green-200");
    });

    it("should return yellow background for medium-high score", () => {
      expect(getSEOScoreBgColor(70)).toBe("bg-yellow-50 border-yellow-200");
    });

    it("should return orange background for medium score", () => {
      expect(getSEOScoreBgColor(50)).toBe("bg-orange-50 border-orange-200");
    });

    it("should return red background for low score", () => {
      expect(getSEOScoreBgColor(20)).toBe("bg-red-50 border-red-200");
    });
  });

  describe("validateSEOFields", () => {
    it("should validate correct SEO fields", () => {
      const result = validateSEOFields({
        metaTitle: "This is a proper meta title with good length",
        metaDescription: "This is a proper meta description with enough characters to pass validation and meet the minimum requirements for SEO success.",
        slug: "valid-slug",
      });

      expect(result.isValid).toBe(true);
      expect(result.errors.length).toBe(0);
    });

    it("should detect missing meta title", () => {
      const result = validateSEOFields({
        metaDescription: "This is a proper meta description with enough characters to pass validation and meet the minimum requirements for SEO.",
        slug: "valid-slug",
      });

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes("Meta title"))).toBe(true);
    });

    it("should detect short meta title", () => {
      const result = validateSEOFields({
        metaTitle: "Short",
        metaDescription: "This is a proper meta description with enough characters to pass validation and meet the minimum requirements for SEO.",
        slug: "valid-slug",
      });

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes("at least 30"))).toBe(true);
    });

    it("should detect long meta title", () => {
      const result = validateSEOFields({
        metaTitle: "This is a very long meta title that exceeds the recommended maximum length",
        metaDescription: "This is a proper meta description with enough characters to pass validation and meet the minimum requirements for SEO.",
        slug: "valid-slug",
      });

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes("not exceed 60"))).toBe(true);
    });

    it("should detect invalid slug", () => {
      const result = validateSEOFields({
        metaTitle: "This is a proper meta title with good length for SEO",
        metaDescription: "This is a proper meta description with enough characters to pass validation and meet the minimum requirements for SEO.",
        slug: "Invalid_Slug-With-CAPS",
      });

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes("lowercase"))).toBe(true);
    });
  });
});
