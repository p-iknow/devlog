import { describe, it, expect } from "vitest";
import { getLangPath, isDefaultLocale, getAlternatePath } from "./locale";
import { defaultLocale, LOCALES, EnLocale, KoLocale } from "@/config/locale";

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

describe("getAlternatePath", () => {
  it("switches /en path to /ko", () => {
    expect(getAlternatePath("/en/posts/hello", "ko")).toBe("/ko/posts/hello");
  });

  it("switches /ko path to /en", () => {
    expect(getAlternatePath("/ko/posts/hello", "en")).toBe("/en/posts/hello");
  });

  it("handles root path with lang prefix", () => {
    expect(getAlternatePath("/en", "ko")).toBe("/ko");
  });

  it("normalizes trailing slash to no trailing slash on lang-root", () => {
    expect(getAlternatePath("/en/", "ko")).toBe("/ko");
  });

  it("handles nested paths", () => {
    expect(getAlternatePath("/en/series/markdown-guide/01-intro", "ko")).toBe(
      "/ko/series/markdown-guide/01-intro"
    );
  });

  it("keeps same language if target matches current", () => {
    expect(getAlternatePath("/en/posts/hello", "en")).toBe("/en/posts/hello");
  });

  it("adds lang prefix to paths without one", () => {
    expect(getAlternatePath("/posts/hello", "ko")).toBe("/ko/posts/hello");
  });

  it("handles bare root path", () => {
    expect(getAlternatePath("/", "en")).toBe("/en");
    expect(getAlternatePath("/", "ko")).toBe("/ko");
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
