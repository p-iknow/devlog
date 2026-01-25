import { describe, it, expect } from "vitest";
import { parseTextWithNumbers } from "./i18n";

describe("parseTextWithNumbers", () => {
  it("parses text with single number", () => {
    expect(parseTextWithNumbers("5개의 글")).toEqual([
      { type: "number", value: "5" },
      { type: "text", value: "개의 글" },
    ]);
  });

  it("parses text with multiple numbers", () => {
    expect(parseTextWithNumbers("3개의 태그, 10개의 글")).toEqual([
      { type: "number", value: "3" },
      { type: "text", value: "개의 태그, " },
      { type: "number", value: "10" },
      { type: "text", value: "개의 글" },
    ]);
  });

  it("parses English text", () => {
    expect(parseTextWithNumbers("5 posts")).toEqual([
      { type: "number", value: "5" },
      { type: "text", value: " posts" },
    ]);
  });

  it("parses text without numbers", () => {
    expect(parseTextWithNumbers("No posts")).toEqual([
      { type: "text", value: "No posts" },
    ]);
  });

  it("handles empty string", () => {
    expect(parseTextWithNumbers("")).toEqual([]);
  });

  it("handles number only", () => {
    expect(parseTextWithNumbers("42")).toEqual([
      { type: "number", value: "42" },
    ]);
  });
});
