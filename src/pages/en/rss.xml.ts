import rss from "@astrojs/rss";
import { siteConfig } from "@/config/site";
import type { APIContext } from "astro";
import { getPostsByLang, getSeriesPostsByLang, getPostUrl } from "@/utils/posts";
import { EnLocale } from "@/config/locale";

export async function GET(context: APIContext) {
  const lang = EnLocale;
  const posts = await getPostsByLang({ lang });
  const seriesPosts = await getSeriesPostsByLang({ lang });
  const allPosts = [...posts, ...seriesPosts].sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf()
  );

  return rss({
    title: siteConfig.title,
    description: siteConfig.description,
    site: context.site ?? siteConfig.siteUrl,
    items: allPosts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description,
      link: getPostUrl(post, lang),
      categories: post.data.tags,
    })),
  });
}
