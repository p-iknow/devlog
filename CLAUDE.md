# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a bilingual (en/ko) personal developer blog built with **Astro 5** and TypeScript, hosted on Netlify. The blog uses Markdown files for content with astro-expressive-code (Shiki-based) for syntax highlighting and KaTeX for math equations.

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

### Internationalization (i18n)
- Supports two languages: **English (en)** and **Korean (ko)**
- Default locale: `en`
- All routes are prefixed with language code (`/en`, `/ko`)
- Locale configuration in `src/config/locale.ts`
- Language detection and routing handled via `[lang]` dynamic route parameter

### Content Structure
Blog content is organized into three Content Collections using Astro 5's glob loader:

#### 1. `posts` Collection (`src/content/posts/`)
Regular blog posts organized by category subdirectories.

**Required frontmatter:**
- `title` - Post title
- `date` - Publication date
- `description` - Post description
- `slug` - URL-friendly slug (folder-path/kebab-case)

**Optional frontmatter:**
- `draft` (default: `false`) - If `true`, hidden in all environments
- `dev-only` (default: `false`) - If `true`, visible only in dev environment (for style guides, testing)
- `category` (default: `undefined`) - Post category
- `tags` (default: `[]`) - Array of tags
- `img` (default: `undefined`) - OG image path
- `update` (default: `undefined`) - Last updated date
- `lang` (default: extracted from filename) - Language code (e.g., `post.ko.md` → `ko`)

#### 2. `series` Collection (`src/content/series/`)
Series metadata files (`_index*.md` in each series folder).

**Required frontmatter:**
- `title` - Series title
- `description` - Series description

**Optional frontmatter:**
- `slug` - URL-friendly slug
- `lang` - Language code

#### 3. `seriesPosts` Collection (`src/content/series/`)
Individual posts within a series (excludes `_index*.md` files).

**Required frontmatter:**
- `title` - Post title
- `description` - Post description
- `date` - Publication date
- `series` - Series slug (e.g., 'markdown-guide')

**Optional frontmatter:**
- `slug` - URL-friendly slug
- `draft` (default: `false`) - Draft status
- `dev-only` (default: `false`) - Dev-only visibility
- `category` - Post category
- `tags` (default: `[]`) - Array of tags
- `part` - Order within series (defaults to filename/date sorting)
- `img` - OG image path
- `update` - Last updated date
- `lang` - Language code

### Key Files
- `astro.config.ts` - Astro configuration (i18n, integrations, markdown plugins, Vite settings)
- `src/content/config.ts` - Content Collections schema definitions using glob loader
- `src/config/locale.ts` - i18n locale configuration and utilities
- `src/styles/global.css` - Global styles with Tailwind CSS v4

### Source Code (`src/`)

#### Pages (`src/pages/`)
- `index.astro` - Root redirect to default locale
- `404.astro` - 404 error page
- `[lang]/` - Language-specific routes:
  - `index.astro` - Main page with post list
  - `posts/[...slug].astro` - Dynamic post pages
  - `tags/index.astro` - All tags listing
  - `tags/[tag].astro` - Posts by tag
  - `series/index.astro` - All series listing
  - `series/[...slug].astro` - Series detail and series post pages
  - `search.astro` - Search page
  - `design-system.astro` - Design system style guide (dev-only)
  - `rss.xml.ts` - RSS feed generation

#### Layouts (`src/layouts/`)
- `BaseLayout.astro` - Base HTML structure, head, analytics
- `PostLayout.astro` - Blog post layout with prose styling

#### Components (`src/components/`)
- `Header.astro` - Site header with navigation and language switcher
- `Footer.astro` - Site footer
- `PostList.astro` - Reusable post listing component
- `PostNavigation.astro` - Previous/next post navigation
- `SeriesListView.astro` - Series listing component
- `Bio.astro` - Author bio
- `Comments.astro` - Utterances comments integration
- `ThemeToggle.astro` - Dark/light mode toggle

#### Content (`src/content/`)
- `config.ts` - Content Collections schema definitions
- `posts/` - Blog post Markdown files (organized by category)
- `series/` - Series folders with `_index*.md` and post files

#### Styles (`src/styles/`)
- `global.css` - Global CSS with Tailwind directives

### Path Aliases
TypeScript configured with `@/*` → `src/*` path alias (defined in `astro.config.ts`).

### Styling
Uses **Tailwind CSS v4** with `@tailwindcss/vite` plugin. Typography handled by Tailwind `prose` classes with custom styling.

### Code Highlighting
- `astro-expressive-code` with dual theme support:
  - Light mode: `dracula-soft`
  - Dark mode: `night-owl`
- Features: line numbers (via `pluginLineNumbers`), copy button, syntax transformers
- Theme selection via `[data-theme="light|dark"]` attribute
- Shiki transformers: diff notation, highlight notation, word highlight

### Integrations
- `@astrojs/mdx` - MDX support (`.mdx` files work alongside `.md`)
- `@astrojs/sitemap` - Automatic sitemap generation
- `@astrojs/rss` - RSS feed generation
- `astro-expressive-code` - Code highlighting with line numbers, copy button, dual themes
- `remark-math` + `rehype-katex` - Math equation rendering
- `@r4ai/remark-callout` - Callout/admonition support

### Development Notes
- **개발서버**: 켜져있다면 기존에 켜져있는 것을 끄고 새로 켜줘
- **Language routing**: All main routes require `[lang]` parameter
- **Content ID**: Generated from file path (not frontmatter slug)
- **Prefetch**: Enabled for all links (`prefetchAll: true`)
