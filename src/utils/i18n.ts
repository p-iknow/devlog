export type TextPart =
  | { type: "text"; value: string }
  | { type: "number"; value: string };

export function parseTextWithNumbers(text: string): TextPart[] {
  const parts = text.split(/(\d+)/);
  return parts
    .filter((part) => part !== "")
    .map((part) => ({
      type: /^\d+$/.test(part) ? "number" : "text",
      value: part,
    })) as TextPart[];
}
