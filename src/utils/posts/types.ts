import type { CollectionEntry } from "astro:content";
import type { Locale } from "@/config/locale";

export type AnyPost =
  | CollectionEntry<"posts">
  | CollectionEntry<"seriesPosts">
  | (CollectionEntry<"posts"> & { lang: Locale })
  | (CollectionEntry<"seriesPosts"> & { lang: Locale });

export type PostWithLang = CollectionEntry<"posts"> & {
  lang: Locale;
};

export type SeriesPostWithLang = CollectionEntry<"seriesPosts"> & {
  lang: Locale;
};

export type PostEntry =
  | CollectionEntry<"posts">
  | CollectionEntry<"seriesPosts">
  | PostWithLang
  | SeriesPostWithLang;
