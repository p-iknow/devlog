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
│   │   ├── posts/           # Blog posts (Markdown)
│   │   └── series/          # Series posts (Markdown)
│   ├── components/          # Astro components
│   ├── layouts/             # Page layouts
│   ├── pages/               # Routes
│   ├── utils/               # Utility functions (slug generation, etc.)
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
| `slug` | Yes | - | URL slug (kebab-case, English) |
| `lang` | No | - | Language code (`ko`, `en`) |
| `draft` | No | `false` | Set `true` to hide from all environments |
| `dev-only` | No | `false` | Set `true` to show only in dev (hidden in production) |
| `category` | No | - | Category name |
| `tags` | No | `[]` | Array of tags |
| `series` | No | - | Series name for grouping posts |
| `img` | No | - | OG image path |
| `update` | No | - | Last updated date |

## Content Structure & Slug Generation

This blog supports two types of content collections: **posts** and **series**.

### Posts Collection

Regular blog posts stored in `src/content/posts/`.

#### File Structure
```
src/content/posts/
├── {category}/
│   └── {filename}.md
└── {category}/
    └── {subcategory}/
        └── {filename}.md
```

**Examples:**
- `src/content/posts/javascript/190524_comma-operator.md`
- `src/content/posts/algorithm/programmers/lv3/word-change.md`

#### Slug Generation Process

1. **File ID**: Generated from file path without extension
   - Example: `javascript/190524_comma-operator` or `algorithm/programmers/lv3/word-change`

2. **Frontmatter slug**: URL-friendly slug defined in frontmatter
   ```yaml
   slug: comma-operator
   ```

3. **Final slug**: Combines folder path + frontmatter slug
   ```typescript
   // src/utils/posts.ts:88-99
   const folderPath = idParts.slice(0, -1).join("/");  // "javascript"
   const slug = post.data.slug;                        // "comma-operator"
   return `${folderPath}/${slug}`;                     // "javascript/comma-operator"
   ```

4. **Final URL**: `/posts/{category}/{slug}`
   - 1-level: `/posts/javascript/comma-operator`
   - 2-level: `/posts/algorithm/programmers/word-change`
   - 3-level: `/posts/algorithm/programmers/lv3/word-change`

**Note:** The folder path depth is preserved in the URL, allowing for flexible categorization.

### Series Collection

Series are grouped content stored in `src/content/series/` with two sub-collections:

#### 1. Series Metadata (`series` collection)

Files: `*/_index*.md`

```yaml
---
title: 마크다운 가이드
slug: 'markdown-guide'
description: 블로그 포스트 작성에 필요한 기본 설정과 마크다운 활용법
lang: ko
---
```

#### 2. Series Posts (`seriesPosts` collection)

Files: `**/[!_]*.md` (files not starting with `_`)

```yaml
---
title: '마크다운 한글 스타일 가이드'
slug: 'markdown-style-guide'  # optional for series posts
date: '2025-05-25'
part: 1                        # order in series
series: 'markdown-guide'       # which series this belongs to
lang: ko
---
```

#### Series File Structure
```
src/content/series/
└── markdown-guide/
    ├── _index.ko.md                    # Series metadata (Korean)
    ├── _index.en.md                    # Series metadata (English)
    ├── 01-markdown-style-guide.ko.md   # Series post
    ├── 01-markdown-style-guide.en.md
    └── ...
```

#### Series URL Generation

Series posts use **file ID** instead of frontmatter slug:

```typescript
// src/utils/posts.ts:48-54
export function getSeriesPostUrl(postId: string, lang: Locale): string {
  const langPath = getLangPath(lang);
  return `${langPath}/series/${stripLangFromId(postId)}`;
}
```

**Example:**
- File ID: `markdown-guide/01-markdown-style-guide.ko`
- After removing lang suffix: `markdown-guide/01-markdown-style-guide`
- Final URL: `/series/markdown-guide/01-markdown-style-guide`

### Comparison: Posts vs Series

| Aspect | Posts | Series Posts |
|--------|-------|--------------|
| **Location** | `src/content/posts/` | `src/content/series/` |
| **Total Files** | 81 files | 8 posts + 2 metadata |
| **slug field** | Required | Optional |
| **URL Source** | Frontmatter `slug` | File `id` (lang suffix removed) |
| **URL Pattern** | `/posts/{path}/{slug}` | `/series/{series-slug}/{post-id}` |
| **Ordering** | By `date` | By `part` or filename number |

## License

MIT
