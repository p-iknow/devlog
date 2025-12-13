import { defineConfig, passthroughImageService } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import react from "@astrojs/react";
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

  // 이미지 최적화 비활성화 (누락된 이미지 에러 방지)
  image: {
    service: passthroughImageService(),
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
      themes: ["github-light", "github-dark"],
      useDarkModeMediaQuery: true,
      themeCssRoot: "html",
      themeCssSelector: (theme) => `[data-theme='${theme.type}']`,
      plugins: [pluginLineNumbers()],
      defaultProps: {
        showLineNumbers: true,
      },
    }),
    mdx(),
    sitemap(),
    react(),
  ],
});
