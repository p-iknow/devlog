# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal developer blog built with Gatsby 5 and TypeScript, hosted on Netlify. The blog uses Markdown files for content with Prism.js for syntax highlighting and KaTeX for math equations.

## Commands

```bash
npm run develop    # Start development server at http://localhost:8000
npm run build      # Build for production
npm run serve      # Serve production build locally
npm run clean      # Clear Gatsby cache and public folder
npm run lint:fix   # Fix ESLint issues
```

## Architecture

### Content Structure
- Blog posts are Markdown files in `contents/posts/` organized by category subdirectories
- Posts require frontmatter with: `title`, `date`, `template: "post"`, `draft`, `description`, `category`, `tags`
- Optional frontmatter: `slug` (custom URL), `series` (group related posts), `img` (OG image)

### Key Files
- `blog-config.ts` - Site metadata, social links, utterances comments config, analytics
- `gatsby-config.ts` - Gatsby plugins configuration
- `gatsby-node.js` - Page creation logic for posts and series pages, slug generation

### Source Code (`src/`)
- `pages/` - Static pages (index, categories, tags, series, search, 404)
- `templates/` - `Post.tsx` and `Series.tsx` for dynamic page generation
- `components/` - React components using styled-components
- `styles/` - Global styles, theme, code highlighting, markdown styling
- `context/` - React context providers
- `hooks/` - Custom React hooks
- `gatsby/node/` - Gatsby Node API helpers (unused, main logic in root `gatsby-node.js`)

### Path Aliases
TypeScript configured with `baseUrl: "./src"` - imports resolve from `src/` directory.

### Styling
Uses styled-components v6 with a theme system defined in `src/styles/theme.ts`.
