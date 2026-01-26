import type { CollectionEntry } from "astro:content";
import type { Locale } from "@/config/locale";
import { getLangPath } from "@/utils/locale";
import { stripLangFromId } from "@/utils/lang";
import type { AnyPost, PostWithLang } from "./types";

export function getPostUrl(post: AnyPost, lang: Locale): string {
  const langPath = getLangPath(lang);

  if (post.collection === "seriesPosts") {
    return `${langPath}/posts/${stripLangFromId(post.id)}`;
  }

  const idParts = post.id.split("/");
  const folderPath = idParts.slice(0, -1).join("/");
  const slug = post.data.slug;
  const postSlug = folderPath ? `${folderPath}/${slug}` : slug;

  return `${langPath}/posts/${postSlug}`;
}

/** @deprecated Use getPostUrl instead */
export function getSeriesPostUrl(postId: string, lang: Locale): string {
  const langPath = getLangPath(lang);
  return `${langPath}/posts/${stripLangFromId(postId)}`;
}

export function getSeriesUrl(seriesSlug: string, lang: Locale): string {
  const langPath = getLangPath(lang);
  return `${langPath}/series/${seriesSlug}`;
}

export function getPostSlug(
  post: CollectionEntry<"posts"> | PostWithLang
): string {
  const idParts = post.id.split("/");
  const folderPath = idParts.slice(0, -1).join("/");
  const slug = post.data.slug;

  if (folderPath) {
    return `${folderPath}/${slug}`;
  }
  return slug;
}
