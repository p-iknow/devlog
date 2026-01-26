import type { CollectionEntry } from "astro:content";
import type { SeriesPostWithLang } from "./types";

export function sortPostsByDate(
  posts: CollectionEntry<"posts">[]
): CollectionEntry<"posts">[] {
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export function extractOrderFromFilename(id: string): number {
  const filename = id.split("/").pop() || "";
  const match = filename.match(/^(\d+)-/);
  return match ? parseInt(match[1], 10) : 999;
}

export function sortSeriesPosts<
  T extends CollectionEntry<"seriesPosts"> | SeriesPostWithLang,
>(posts: T[]): T[] {
  return posts.sort((a, b) => {
    const orderA = a.data.part ?? extractOrderFromFilename(a.id);
    const orderB = b.data.part ?? extractOrderFromFilename(b.id);
    return orderA - orderB;
  });
}
