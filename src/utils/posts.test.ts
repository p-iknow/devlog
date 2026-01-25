import { describe, it, expect, vi, afterEach } from "vitest";
import { isPublished } from "./filter";

describe("isPublished", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("returns true for published post (no flags)", () => {
    const post = { data: {} };
    expect(isPublished(post)).toBe(true);
  });

  it("returns false when draft is true", () => {
    const post = { data: { draft: true } };
    expect(isPublished(post)).toBe(false);
  });

  it("returns true when draft is false", () => {
    const post = { data: { draft: false } };
    expect(isPublished(post)).toBe(true);
  });

  it("returns false for dev-only post in production", () => {
    vi.stubEnv("DEV", false);
    const post = { data: { "dev-only": true } };
    expect(isPublished(post)).toBe(false);
  });

  it("returns true for dev-only post in development", () => {
    vi.stubEnv("DEV", true);
    const post = { data: { "dev-only": true } };
    expect(isPublished(post)).toBe(true);
  });

  it("draft takes precedence over dev-only", () => {
    vi.stubEnv("DEV", true);
    const post = { data: { draft: true, "dev-only": true } };
    expect(isPublished(post)).toBe(false);
  });
});
