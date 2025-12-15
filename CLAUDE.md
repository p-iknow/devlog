# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal developer blog built with **Astro 5** and TypeScript, hosted on Netlify. The blog uses Markdown files for content with astro-expressive-code (Shiki-based) for syntax highlighting and KaTeX for math equations.

## Commands

```bash
pnpm dev           # Start development server at http://localhost:3000
pnpm build         # Build for production (output: dist/)
pnpm preview       # Preview production build at http://localhost:5000
pnpm type-check    # Run astro check and tsc --noEmit
pnpm format        # Format code with Prettier
pnpm lint          # Lint and fix with ESLint
```

## Architecture

### Content Structure
- Blog posts are Markdown files in `src/content/posts/` organized by category subdirectories
- Posts use Astro Content Collections with schema validation
- Required frontmatter: `title`, `date`, `description`
- Optional frontmatter:
  - `draft` (default: `false`) - `true`면 모든 환경에서 숨김
  - `dev-only` (default: `false`) - `true`면 dev 환경에서만 보임 (style guide 등 테스트용)
  - `category` (default: `undefined`)
  - `tags` (default: `[]`)
  - `series` (default: `undefined`)
  - `img` (default: `undefined`) - OG image 경로
  - `update` (default: `undefined`) - 수정일

### Key Files
- `astro.config.ts` - Astro configuration (integrations, markdown plugins, Vite settings)
- `src/content/config.ts` - Content Collections schema definition
- `src/styles/global.css` - Global styles with Tailwind CSS v4

### Source Code (`src/`)
- `pages/` - Astro pages and dynamic routes
  - `index.astro` - Main page with post list
  - `posts/[...slug].astro` - Dynamic post pages
  - `categories/`, `tags/`, `series/` - Category/tag/series listing and detail pages
  - `search.astro` - Search page
  - `rss.xml.ts` - RSS feed generation
- `layouts/` - Page layouts
  - `BaseLayout.astro` - Base HTML structure, head, analytics
  - `PostLayout.astro` - Blog post layout with prose styling
- `components/` - Astro components
  - `Header.astro`, `Footer.astro` - Site header and footer
  - `PostList.astro` - Post listing component
  - `Bio.astro` - Author bio
  - `Comments.astro` - Utterances comments
  - `ThemeToggle.astro` - Dark/light mode toggle
- `content/` - Content Collections
  - `config.ts` - Schema definition
  - `posts/` - Blog post Markdown files
- `styles/` - Global CSS

### Path Aliases
TypeScript configured with `@/*` → `src/*` path alias.

### Styling
Uses **Tailwind CSS v4** with `@tailwindcss/vite` plugin. Typography handled by Tailwind `prose` classes.

### Integrations
- `@astrojs/mdx` - MDX support (`.mdx` files work alongside `.md`)
- `@astrojs/sitemap` - Automatic sitemap generation
- `astro-expressive-code` - Code highlighting with line numbers, copy button
- `remark-math` + `rehype-katex` - Math equation rendering
- `@r4ai/remark-callout` - Callout/admonition support
- 개발서버가 켜져있다면 기존에 켜져있는 것을 끄고 새로 켜줘