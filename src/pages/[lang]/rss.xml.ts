import rss from "@astrojs/rss";
import { siteConfig } from "@/config/site";
import type { APIContext } from "astro";
import { getPostsByLang, getSeriesPostsByLang } from "@/utils/posts/query";
import { getPostUrl } from "@/utils/posts/url";
import { LOCALES, type Locale } from "@/config/locale";

export async function getStaticPaths() {
  return LOCALES.map((lang) => ({
    params: { lang },
  }));
}

export async function GET(context: APIContext) {
  const lang = context.params.lang as Locale;
  const posts = await getPostsByLang({ lang });
  const seriesPosts = await getSeriesPostsByLang({ lang });
  const allPosts = [...posts, ...seriesPosts].sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf()
  );

  return rss({
    title: siteConfig.title,
    description: siteConfig.description[lang],
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
