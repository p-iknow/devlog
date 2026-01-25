import { describe, it, expect } from "vitest";
import { formatDate, formatDateShort, formatDateLocalized } from "./date";

describe("formatDateShort", () => {
  it("formats date as yyyy-MM-dd", () => {
    const date = new Date("2026-01-26");
    expect(formatDateShort(date)).toBe("2026-01-26");
  });
});

describe("formatDateLocalized", () => {
  const date = new Date("2026-01-26");

  it("formats date in English style", () => {
    expect(formatDateLocalized(date, "en")).toBe("Jan 26, 2026");
  });

  it("formats date in Korean style", () => {
    expect(formatDateLocalized(date, "ko")).toBe("2026년 1월 26일");
  });
});

describe("formatDate", () => {
  const date = new Date("2026-01-26");

  it("formats with custom pattern and English locale", () => {
    expect(formatDate(date, "MMMM d, yyyy", "en")).toBe("January 26, 2026");
  });

  it("formats with custom pattern and Korean locale", () => {
    expect(formatDate(date, "yyyy년 MMMM d일", "ko")).toBe("2026년 1월 26일");
  });
});
