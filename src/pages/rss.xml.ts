import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { siteConfig } from "@/config/site";
import type { APIContext } from "astro";
import { filterPosts, sortPostsByDate } from "@/utils/posts";

export async function GET(context: APIContext) {
  const posts = await getCollection("posts", filterPosts);
  const sortedPosts = sortPostsByDate(posts);

  return rss({
    title: siteConfig.title,
    description: siteConfig.description,
    site: context.site ?? siteConfig.siteUrl,
    items: sortedPosts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description,
      link: `/posts/${post.id}/`,
      categories: post.data.tags,
    })),
  });
}
