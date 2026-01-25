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
  site: "https://p-stack.dev",

  i18n: {
    locales: ["en", "ko"],
    defaultLocale: "en",
    routing: {
      prefixDefaultLocale: true,
    },
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
      themes: ["dracula-soft", "night-owl"],
      themeCssSelector: (theme, { styleVariants }) => {
        // First theme (dracula-soft) for light mode
        // Second theme (night-owl) for dark mode
        if (styleVariants.length >= 2) {
          const isLightTheme = theme === styleVariants[0]?.theme;
          const isDarkTheme = theme === styleVariants[1]?.theme;

          if (isLightTheme) return '[data-theme="light"]';
          if (isDarkTheme) return '[data-theme="dark"]';
        }

        // Fallback based on theme type
        return `[data-theme="${theme.type}"]`;
      },
      plugins: [pluginLineNumbers()],
      defaultProps: {
        showLineNumbers: true,
      },
      styleOverrides: {
        borderRadius: "0.5rem",
        borderWidth: "1px",
      },
    }),
    mdx(),
    sitemap(),
  ],
});
