import { describe, it, expect } from "vitest";
import {
  generateBasicMetaTags,
  validateGeneratedTags,
  calculateMetaTagScore,
  formatKeywords,
  type ContentForGeneration,
  type GeneratedMetaTags,
} from "./aiMetaTagGenerator";

describe("AI Meta Tag Generator", () => {
  const mockContent: ContentForGeneration = {
    id: 1,
    title: "Explore the Beautiful Maldives Islands",
    content:
      "Discover the stunning beauty of the Maldives with pristine beaches, crystal-clear waters, and world-class diving opportunities. Our comprehensive guides will help you plan the perfect tropical vacation.",
    type: "blog",
  };

  describe("generateBasicMetaTags", () => {
    it("should generate meta tags with proper structure", () => {
      const tags = generateBasicMetaTags(mockContent);

      expect(tags).toHaveProperty("title");
      expect(tags).toHaveProperty("description");
      expect(tags).toHaveProperty("keywords");
      expect(tags).toHaveProperty("confidence");
    });

    it("should generate title with appropriate length", () => {
      const tags = generateBasicMetaTags(mockContent);

      expect(tags.title.length).toBeGreaterThanOrEqual(30);
      expect(tags.title.length).toBeLessThanOrEqual(70);
    });

    it("should generate description with appropriate length", () => {
      const tags = generateBasicMetaTags(mockContent);

      expect(tags.description.length).toBeGreaterThanOrEqual(100);
      expect(tags.description.length).toBeLessThanOrEqual(180);
    });

    it("should generate keywords array", () => {
      const tags = generateBasicMetaTags(mockContent);

      expect(Array.isArray(tags.keywords)).toBe(true);
      expect(tags.keywords.length).toBeGreaterThan(0);
    });

    it("should include content type in title", () => {
      const tags = generateBasicMetaTags(mockContent);

      expect(tags.title).toContain("Blog");
    });

    it("should set lower confidence for basic generation", () => {
      const tags = generateBasicMetaTags(mockContent);

      expect(tags.confidence).toBeLessThanOrEqual(0.7);
    });

    it("should handle different content types", () => {
      const packageContent: ContentForGeneration = {
        ...mockContent,
        type: "package",
      };

      const tags = generateBasicMetaTags(packageContent);
      expect(tags.title).toContain("Package");
    });
  });

  describe("validateGeneratedTags", () => {
    it("should validate correct tags", () => {
      const tags: GeneratedMetaTags = {
        title: "Explore Maldives Islands | Isle Nomads Blog",
        description:
          "Discover the stunning beauty of the Maldives with pristine beaches, crystal-clear waters, and world-class diving opportunities. Learn more about travel.",
        keywords: ["maldives", "islands", "travel", "vacation"],
        confidence: 0.8,
      };

      const validation = validateGeneratedTags(tags);
      expect(validation.valid).toBe(true);
      expect(validation.issues.length).toBe(0);
    });

    it("should detect title too short", () => {
      const tags: GeneratedMetaTags = {
        title: "Short",
        description:
          "This is a proper meta description with enough characters to meet the minimum requirement for SEO optimization.",
        keywords: ["test"],
        confidence: 0.8,
      };

      const validation = validateGeneratedTags(tags);
      expect(validation.issues.some((i) => i.includes("too short"))).toBe(true);
    });

    it("should detect title too long", () => {
      const tags: GeneratedMetaTags = {
        title: "This is a very long title that exceeds the maximum character limit for proper SEO optimization",
        description:
          "This is a proper meta description with enough characters to meet the minimum requirement for SEO optimization.",
        keywords: ["test"],
        confidence: 0.8,
      };

      const validation = validateGeneratedTags(tags);
      expect(validation.issues.some((i) => i.includes("too long"))).toBe(true);
    });

    it("should detect description too short", () => {
      const tags: GeneratedMetaTags = {
        title: "Proper Title for SEO",
        description: "Short desc",
        keywords: ["test"],
        confidence: 0.8,
      };

      const validation = validateGeneratedTags(tags);
      expect(validation.issues.some((i) => i.includes("too short"))).toBe(true);
    });

    it("should detect no keywords", () => {
      const tags: GeneratedMetaTags = {
        title: "Proper Title for SEO",
        description:
          "This is a proper meta description with enough characters to meet the minimum requirement for SEO optimization.",
        keywords: [],
        confidence: 0.8,
      };

      const validation = validateGeneratedTags(tags);
      expect(validation.issues.some((i) => i.includes("No keywords"))).toBe(true);
    });

    it("should detect low confidence", () => {
      const tags: GeneratedMetaTags = {
        title: "Proper Title for SEO",
        description:
          "This is a proper meta description with enough characters to meet the minimum requirement for SEO optimization.",
        keywords: ["test"],
        confidence: 0.3,
      };

      const validation = validateGeneratedTags(tags);
      expect(validation.issues.some((i) => i.includes("Low confidence"))).toBe(true);
    });
  });

  describe("calculateMetaTagScore", () => {
    it("should calculate score for well-formed tags", () => {
      const tags: GeneratedMetaTags = {
        title: "Explore Maldives Islands | Isle Nomads Blog",
        description:
          "Discover the stunning beauty of the Maldives with pristine beaches, crystal-clear waters, and world-class diving opportunities. Learn more about travel.",
        keywords: ["maldives", "islands", "travel", "vacation"],
        confidence: 0.9,
      };

      const score = calculateMetaTagScore(tags);
      expect(score).toBeGreaterThan(70);
      expect(score).toBeLessThanOrEqual(100);
    });

    it("should return score between 0 and 100", () => {
      const tags: GeneratedMetaTags = {
        title: "Title",
        description: "Short",
        keywords: [],
        confidence: 0.1,
      };

      const score = calculateMetaTagScore(tags);
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
    });

    it("should reward high confidence", () => {
      const lowConfidence: GeneratedMetaTags = {
        title: "Title",
        description: "Short description text",
        keywords: ["test"],
        confidence: 0.2,
      };

      const highConfidence: GeneratedMetaTags = {
        ...lowConfidence,
        confidence: 0.8,
      };

      const lowScore = calculateMetaTagScore(lowConfidence);
      const highScore = calculateMetaTagScore(highConfidence);

      expect(highScore).toBeGreaterThanOrEqual(lowScore);
    });
  });

  describe("formatKeywords", () => {
    it("should format keywords as comma-separated string", () => {
      const keywords = ["maldives", "travel", "vacation"];
      const formatted = formatKeywords(keywords);

      expect(formatted).toBe("maldives, travel, vacation");
    });

    it("should handle empty array", () => {
      const formatted = formatKeywords([]);
      expect(formatted).toBe("");
    });

    it("should handle single keyword", () => {
      const formatted = formatKeywords(["maldives"]);
      expect(formatted).toBe("maldives");
    });
  });
});
