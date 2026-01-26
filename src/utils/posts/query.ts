import type { CollectionEntry } from "astro:content";
import { getCollection } from "astro:content";
import { type Locale, defaultLocale, LOCALES } from "@/config/locale";
import { isPublished } from "@/utils/filter";
import type { PostWithLang, SeriesPostWithLang } from "./types";

export function getPostLang(
  post:
    | CollectionEntry<"posts">
    | CollectionEntry<"seriesPosts">
    | CollectionEntry<"series">
    | { data: { lang?: string } }
): Locale {
  const lang = post.data.lang;
  if (lang && LOCALES.includes(lang as Locale)) {
    return lang as Locale;
  }
  return defaultLocale;
}

export function filterPosts(post: CollectionEntry<"posts">): boolean {
  return isPublished(post);
}

export function filterSeriesPosts(
  post: CollectionEntry<"seriesPosts">
): boolean {
  return isPublished(post);
}

export async function getPostsByLang({
  lang,
  filter = filterPosts,
}: {
  lang: Locale;
  filter?: (post: CollectionEntry<"posts">) => boolean;
}): Promise<PostWithLang[]> {
  const allPosts = await getCollection("posts", filter);

  return allPosts
    .map((post) => ({
      ...post,
      lang: getPostLang(post),
    }))
    .filter((post) => post.lang === lang)
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export async function getSeriesPostsByLang({
  lang,
  filter = filterSeriesPosts,
}: {
  lang: Locale;
  filter?: (post: CollectionEntry<"seriesPosts">) => boolean;
}): Promise<SeriesPostWithLang[]> {
  const allPosts = await getCollection("seriesPosts", filter);

  return allPosts
    .map((post) => ({
      ...post,
      lang: getPostLang(post),
    }))
    .filter((post) => post.lang === lang)
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export async function getAllPostsWithLang(
  filter?: (post: CollectionEntry<"posts">) => boolean
): Promise<PostWithLang[]> {
  const allPosts = await getCollection("posts", filter ?? filterPosts);

  return allPosts
    .map((post) => ({
      ...post,
      lang: getPostLang(post),
    }))
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export async function getAllSeriesPostsWithLang(
  filter?: (post: CollectionEntry<"seriesPosts">) => boolean
): Promise<SeriesPostWithLang[]> {
  const allPosts = await getCollection(
    "seriesPosts",
    filter ?? filterSeriesPosts
  );

  return allPosts
    .map((post) => ({
      ...post,
      lang: getPostLang(post),
    }))
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export async function getAllCombinedPostsByLang({
  lang,
}: {
  lang: Locale;
}): Promise<(PostWithLang | SeriesPostWithLang)[]> {
  const posts = await getPostsByLang({ lang });
  const seriesPosts = await getSeriesPostsByLang({ lang });

  return [...posts, ...seriesPosts].sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf()
  );
}
