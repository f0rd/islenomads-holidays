import { describe, it, expect } from "vitest";
import { getIslandGuideByIslandId } from "./db";

describe("Island Guide Error Handling", () => {
  describe("getIslandGuideByIslandId", () => {
    it("should return undefined for non-existent island ID", async () => {
      const result = await getIslandGuideByIslandId(180002);
      expect(result).toBeUndefined();
    });

    it("should return undefined for invalid island ID (out of range)", async () => {
      const result = await getIslandGuideByIslandId(999999);
      expect(result).toBeUndefined();
    });

    it("should return undefined for zero island ID", async () => {
      const result = await getIslandGuideByIslandId(0);
      expect(result).toBeUndefined();
    });

    it("should return undefined for negative island ID", async () => {
      const result = await getIslandGuideByIslandId(-1);
      expect(result).toBeUndefined();
    });

    it("should return a valid guide for existing island ID", async () => {
      // Island ID 1 should exist (Male)
      const result = await getIslandGuideByIslandId(1);
      if (result) {
        expect(result.name).toBeDefined();
        expect(result.id).toBeDefined();
      }
    });
  });
});
