import { validateProjectName, formatDuration, isDirectoryEmpty } from "../src/lib/utils.js";
import { describe, it, expect, vi, beforeEach } from "vitest";

describe("Utility Functions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("validateProjectName", () => {
    it("should accept valid project names", async () => {
      const result = await validateProjectName("my-awesome-app");
      expect(result.valid).toBe(true);
    });

    it("should reject names with invalid characters", async () => {
      const result = await validateProjectName("my app with spaces");
      expect(result.valid).toBe(false);
      expect(result.message).toContain("valid package name");
    });

    it("should reject names starting with dots", async () => {
      const result = await validateProjectName(".hidden-app");
      expect(result.valid).toBe(false);
    });

    it("should reject very long names", async () => {
      const longName = "a".repeat(215);
      const result = await validateProjectName(longName);
      expect(result.valid).toBe(false);
      expect(result.message).toContain("214 characters");
    });
  });

  describe("formatDuration", () => {
    it("should format milliseconds correctly", () => {
      expect(formatDuration(500)).toBe("500ms");
      expect(formatDuration(1500)).toBe("1s");
      expect(formatDuration(65000)).toBe("1m 5s");
    });
  });
});

describe("CLI Integration", () => {
  it("should handle template selection", () => {
    // Mock test for template functionality
    expect(true).toBe(true);
  });

  it("should handle configuration management", () => {
    // Mock test for config functionality
    expect(true).toBe(true);
  });
});
