import type { CollectionEntry } from "astro:content";
import { getCollection } from "astro:content";
import { type Locale, defaultLocale, LOCALES } from "@/config/locale";

/**
 * id에서 언어 접미사(.en, .ko)를 제거하여 URL slug 생성
 * 예: "markdown-guide/04-markdown-katex-guide.ko" -> "markdown-guide/04-markdown-katex-guide"
 */
export function stripLangFromId(id: string): string {
  return id.replace(/\.(en|ko)$/, "");
}

type AnyPost =
  | CollectionEntry<"posts">
  | CollectionEntry<"seriesPosts">
  | (CollectionEntry<"posts"> & { lang: Locale })
  | (CollectionEntry<"seriesPosts"> & { lang: Locale });

/**
 * 언어에 따른 URL prefix 반환
 */
export function getLangPath(lang: Locale): string {
  return lang === defaultLocale ? "" : `/${lang}`;
}

/**
 * 포스트 URL 생성
 * - posts 컬렉션: /{lang}/posts/{slug}
 * - seriesPosts 컬렉션: /{lang}/posts/{id} (언어 접미사 제거)
 */
export function getPostUrl(post: AnyPost, lang: Locale): string {
  const langPath = getLangPath(lang);

  if (post.collection === "seriesPosts") {
    return `${langPath}/posts/${stripLangFromId(post.id)}`;
  }

  // posts 컬렉션
  const idParts = post.id.split("/");
  const folderPath = idParts.slice(0, -1).join("/");
  const slug = post.data.slug;
  const postSlug = folderPath ? `${folderPath}/${slug}` : slug;

  return `${langPath}/posts/${postSlug}`;
}

/**
 * 시리즈 포스트 URL 생성 (id 기반)
 * - /{lang}/posts/{id} (언어 접미사 제거)
 * @deprecated Use getPostUrl instead for unified URL handling
 */
export function getSeriesPostUrl(postId: string, lang: Locale): string {
  const langPath = getLangPath(lang);
  return `${langPath}/posts/${stripLangFromId(postId)}`;
}

/**
 * 시리즈 상세 페이지 URL 생성
 * - /{lang}/series/{seriesSlug}
 */
export function getSeriesUrl(seriesSlug: string, lang: Locale): string {
  const langPath = getLangPath(lang);
  return `${langPath}/series/${seriesSlug}`;
}

export type PostWithLang = CollectionEntry<"posts"> & {
  lang: Locale;
};

export type SeriesPostWithLang = CollectionEntry<"seriesPosts"> & {
  lang: Locale;
};

/**
 * 통합 포스트 타입 (posts 또는 seriesPosts, lang 포함 여부 무관)
 */
export type PostEntry =
  | CollectionEntry<"posts">
  | CollectionEntry<"seriesPosts">
  | PostWithLang
  | SeriesPostWithLang;

/**
 * 포스트의 최종 slug를 계산
 * post.id에서 폴더 경로를 추출하고, frontmatter의 slug와 조합
 * 예: post.id = "js/190524_comma-operator", data.slug = "comma-operator"
 *     결과: "js/comma-operator"
 */
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

/**
 * 포스트에서 lang을 추출 (frontmatter 우선, 없으면 기본 언어)
 */
export function getPostLang(post: CollectionEntry<"posts"> | CollectionEntry<"seriesPosts">): Locale {
  const lang = post.data.lang;
  if (lang && LOCALES.includes(lang as Locale)) {
    return lang as Locale;
  }
  return defaultLocale;
}

/**
 * 포스트 필터링 함수
 * - draft: true인 포스트는 항상 제외
 * - devOnly: true인 포스트는 production에서만 제외
 */
export function filterPosts(post: CollectionEntry<"posts">): boolean {
  const isDev = import.meta.env.DEV;

  // draft는 항상 제외
  if (post.data.draft) return false;

  // dev-only는 production에서만 제외
  if (post.data["dev-only"] && !isDev) return false;

  return true;
}

/**
 * 시리즈 포스트 필터링 함수
 * - draft: true인 포스트는 항상 제외
 * - devOnly: true인 포스트는 production에서만 제외
 */
export function filterSeriesPosts(
  post: CollectionEntry<"seriesPosts">
): boolean {
  const isDev = import.meta.env.DEV;

  // draft는 항상 제외
  if (post.data.draft) return false;

  // dev-only는 production에서만 제외
  if (post.data["dev-only"] && !isDev) return false;

  return true;
}

/**
 * 포스트를 날짜 기준 내림차순으로 정렬
 */
export function sortPostsByDate(
  posts: CollectionEntry<"posts">[]
): CollectionEntry<"posts">[] {
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

/**
 * 특정 언어의 포스트만 가져오기
 */
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

/**
 * 특정 언어의 시리즈 포스트만 가져오기
 */
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

/**
 * 모든 포스트를 언어별로 가져오기 (lang 포함)
 */
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

/**
 * 모든 시리즈 포스트를 언어별로 가져오기
 */
export async function getAllSeriesPostsWithLang(
  filter?: (post: CollectionEntry<"seriesPosts">) => boolean
): Promise<SeriesPostWithLang[]> {
  const allPosts = await getCollection("seriesPosts", filter ?? filterSeriesPosts);

  return allPosts
    .map((post) => ({
      ...post,
      lang: getPostLang(post),
    }))
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

/**
 * 특정 언어의 모든 포스트(posts + seriesPosts)를 날짜순으로 가져오기
 */
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

/**
 * 파일명에서 순서 번호 추출 (예: "01-title.md" -> 1)
 * 번호가 없으면 999 반환
 */
export function extractOrderFromFilename(id: string): number {
  // id 형식: "series-slug/01-post-title.ko" 또는 "series-slug/01-post-title"
  const filename = id.split("/").pop() || "";
  const match = filename.match(/^(\d+)-/);
  return match ? parseInt(match[1], 10) : 999;
}

/**
 * 시리즈 포스트 정렬 함수
 * - part 필드 우선 사용
 * - part가 없으면 파일명의 숫자 사용 (01-, 02- 등)
 * - 둘 다 없으면 맨 뒤로 (999)
 */
export function sortSeriesPosts<T extends CollectionEntry<"seriesPosts"> | SeriesPostWithLang>(
  posts: T[]
): T[] {
  return posts.sort((a, b) => {
    const orderA = a.data.part ?? extractOrderFromFilename(a.id);
    const orderB = b.data.part ?? extractOrderFromFilename(b.id);
    return orderA - orderB;
  });
}
