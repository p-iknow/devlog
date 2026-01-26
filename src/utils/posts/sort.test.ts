import { describe, it, expect } from "vitest";
import { extractOrderFromFilename, sortSeriesPosts } from "./sort";

describe("extractOrderFromFilename", () => {
  it("extracts order from numbered filename", () => {
    expect(extractOrderFromFilename("markdown-guide/01-intro.ko")).toBe(1);
    expect(extractOrderFromFilename("markdown-guide/02-setup.en")).toBe(2);
    expect(extractOrderFromFilename("series/10-conclusion")).toBe(10);
  });

  it("returns 999 for non-numbered filename", () => {
    expect(extractOrderFromFilename("markdown-guide/intro.ko")).toBe(999);
    expect(extractOrderFromFilename("some-post")).toBe(999);
  });

  it("handles edge cases", () => {
    expect(extractOrderFromFilename("")).toBe(999);
    expect(extractOrderFromFilename("00-zero.md")).toBe(0);
  });
});

describe("sortSeriesPosts", () => {
  const createPost = (id: string, part?: number) => ({
    id,
    collection: "seriesPosts" as const,
    data: { part },
  });

  it("sorts by part field when available", () => {
    const posts = [
      createPost("series/c.ko", 3),
      createPost("series/a.ko", 1),
      createPost("series/b.ko", 2),
    ];
    const sorted = sortSeriesPosts(posts as any);
    expect(sorted.map((p) => p.data.part)).toEqual([1, 2, 3]);
  });

  it("falls back to filename order when no part", () => {
    const posts = [
      createPost("series/03-third.ko"),
      createPost("series/01-first.ko"),
      createPost("series/02-second.ko"),
    ];
    const sorted = sortSeriesPosts(posts as any);
    expect(sorted.map((p) => p.id)).toEqual([
      "series/01-first.ko",
      "series/02-second.ko",
      "series/03-third.ko",
    ]);
  });

  it("part field takes precedence over filename", () => {
    const posts = [
      createPost("series/03-third.ko", 1),
      createPost("series/01-first.ko", 3),
      createPost("series/02-second.ko", 2),
    ];
    const sorted = sortSeriesPosts(posts as any);
    expect(sorted.map((p) => p.id)).toEqual([
      "series/03-third.ko",
      "series/02-second.ko",
      "series/01-first.ko",
    ]);
  });
});
