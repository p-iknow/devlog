import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import astroExpressiveCode from "astro-expressive-code";
import { pluginLineNumbers } from "@expressive-code/plugin-line-numbers";
import {
  transformerNotationDiff,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
} from "@shikijs/transformers";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import remarkCallout from "@r4ai/remark-callout";

export default defineConfig({
  site: "https://p-iknow.netlify.app",

  i18n: {
    locales: ["en", "ko"],
    defaultLocale: "en",
  },

  vite: {
    resolve: { alias: { "@": "/src" } },
    plugins: [tailwindcss()],
  },

  markdown: {
    syntaxHighlight: false,
    remarkPlugins: [remarkMath, remarkCallout],
    rehypePlugins: [rehypeKatex],
    shikiConfig: {
      transformers: [
        transformerNotationDiff(),
        transformerNotationHighlight(),
        transformerNotationWordHighlight(),
      ],
    },
  },

  prefetch: { prefetchAll: true },

  integrations: [
    astroExpressiveCode({
      themes: ["dracula-soft"],
      plugins: [pluginLineNumbers()],
      defaultProps: {
        showLineNumbers: true,
      },
    }),
    mdx(),
    sitemap(),
  ],
});
