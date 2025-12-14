import type { CollectionEntry } from "astro:content";

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
 * 포스트를 날짜 기준 내림차순으로 정렬
 */
export function sortPostsByDate(
  posts: CollectionEntry<"posts">[]
): CollectionEntry<"posts">[] {
  return posts.sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf()
  );
}
