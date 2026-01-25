import { describe, it, expect } from "vitest";
import {
  getLangPath,
  isDefaultLocale,
  defaultLocale,
  LOCALES,
  EnLocale,
  KoLocale,
} from "./locale";

describe("getLangPath", () => {
  it("returns /en for English locale", () => {
    expect(getLangPath("en")).toBe("/en");
  });

  it("returns /ko for Korean locale", () => {
    expect(getLangPath("ko")).toBe("/ko");
  });

  it("returns correct path for all supported locales", () => {
    for (const locale of LOCALES) {
      expect(getLangPath(locale)).toBe(`/${locale}`);
    }
  });
});

describe("isDefaultLocale", () => {
  it("returns true for default locale (en)", () => {
    expect(isDefaultLocale("en")).toBe(true);
  });

  it("returns false for non-default locale (ko)", () => {
    expect(isDefaultLocale("ko")).toBe(false);
  });
});

describe("locale constants", () => {
  it("has correct default locale", () => {
    expect(defaultLocale).toBe("en");
  });

  it("EnLocale is 'en'", () => {
    expect(EnLocale).toBe("en");
  });

  it("KoLocale is 'ko'", () => {
    expect(KoLocale).toBe("ko");
  });

  it("LOCALES contains both en and ko", () => {
    expect(LOCALES).toContain("en");
    expect(LOCALES).toContain("ko");
    expect(LOCALES).toHaveLength(2);
  });
});
