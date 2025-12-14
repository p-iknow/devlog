# p-iknow's devlog

개인 개발 블로그입니다.

**Live Site:** https://p-iknow.netlify.app

## Tech Stack

- **Framework**: [Astro 5](https://astro.build/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Content**: Astro Content Collections (Markdown)
- **Code Highlighting**: [astro-expressive-code](https://expressive-code.com/) (Shiki 기반)
- **Math**: KaTeX (remark-math + rehype-katex)
- **Comments**: [Utterances](https://utteranc.es/)
- **Hosting**: [Netlify](https://www.netlify.com/)

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/p-iknow/devlog.git
cd devlog

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

### Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start dev server at `http://localhost:3000` |
| `pnpm build` | Build for production |
| `pnpm preview` | Preview production build at `http://localhost:5000` |
| `pnpm type-check` | Run type checking |
| `pnpm format` | Format code with Prettier |
| `pnpm lint` | Lint code with ESLint |

## Project Structure

```
devlog/
├── src/
│   ├── content/
│   │   ├── config.ts        # Content Collections schema
│   │   └── posts/           # Blog posts (Markdown)
│   ├── components/          # Astro components
│   ├── layouts/             # Page layouts
│   ├── pages/               # Routes
│   └── styles/              # Global CSS
├── public/                  # Static assets
├── astro.config.ts          # Astro configuration
└── package.json
```

## Writing Posts

Blog posts are written in Markdown and stored in `src/content/posts/`.

### Frontmatter

```yaml
---
title: "Post Title"
description: "Post description"
date: 2024-01-01
category: "category-name"
tags: ["tag1", "tag2"]
draft: false
---
```

| Field | Required | Default | Description |
|-------|----------|---------|-------------|
| `title` | Yes | - | Post title |
| `description` | Yes | - | Post description |
| `date` | Yes | - | Publication date |
| `draft` | No | `false` | Set `true` to hide from all environments |
| `dev-only` | No | `false` | Set `true` to show only in dev (hidden in production) |
| `category` | No | - | Category name |
| `tags` | No | `[]` | Array of tags |
| `series` | No | - | Series name for grouping posts |
| `img` | No | - | OG image path |
| `update` | No | - | Last updated date |

## License

MIT
