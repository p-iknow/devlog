import { describe, it, expect, vi } from "vitest";

vi.mock("astro:content", () => ({
  getCollection: vi.fn(),
}));

import { getPostLang } from "./query";

describe("getPostLang", () => {
  it("returns lang from post data", () => {
    expect(getPostLang({ data: { lang: "ko" } })).toBe("ko");
    expect(getPostLang({ data: { lang: "en" } })).toBe("en");
  });

  it("returns default locale when lang is missing", () => {
    expect(getPostLang({ data: {} })).toBe("en");
  });

  it("returns default locale for invalid lang", () => {
    expect(getPostLang({ data: { lang: "invalid" } })).toBe("en");
  });
});
