export type Filterable = { data: { draft?: boolean; "dev-only"?: boolean } };

export function isPublished<T extends Filterable>(post: T): boolean {
  const isDev = import.meta.env.DEV;
  if (post.data.draft) return false;
  if (post.data["dev-only"] && !isDev) return false;
  return true;
}
