import { describe, it, expect } from "vitest";
import { stripLangFromId } from "./lang";

describe("stripLangFromId", () => {
  it("removes .en suffix", () => {
    expect(stripLangFromId("markdown-guide/01-intro.en")).toBe(
      "markdown-guide/01-intro"
    );
  });

  it("removes .ko suffix", () => {
    expect(stripLangFromId("markdown-guide/01-intro.ko")).toBe(
      "markdown-guide/01-intro"
    );
  });

  it("preserves id without lang suffix", () => {
    expect(stripLangFromId("markdown-guide/01-intro")).toBe(
      "markdown-guide/01-intro"
    );
  });

  it("only removes suffix at end of string", () => {
    expect(stripLangFromId("en.ko/post.en")).toBe("en.ko/post");
  });

  it("handles simple ids", () => {
    expect(stripLangFromId("post.ko")).toBe("post");
  });
});
