import { describe, it, expect } from "vitest";
import { getPostSlug } from "./url";

describe("getPostSlug", () => {
  it("returns folder path + frontmatter slug", () => {
    const post = {
      id: "js/190524_comma-operator",
      collection: "posts" as const,
      data: { slug: "comma-operator" },
    };
    expect(getPostSlug(post as any)).toBe("js/comma-operator");
  });

  it("handles nested folder paths", () => {
    const post = {
      id: "algorithm/programmers/lv3/word-change",
      collection: "posts" as const,
      data: { slug: "word-change" },
    };
    expect(getPostSlug(post as any)).toBe(
      "algorithm/programmers/lv3/word-change"
    );
  });

  it("returns just slug when no folder path", () => {
    const post = {
      id: "single-post",
      collection: "posts" as const,
      data: { slug: "my-post" },
    };
    expect(getPostSlug(post as any)).toBe("my-post");
  });
});
