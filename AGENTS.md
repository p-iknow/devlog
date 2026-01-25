# PROJECT KNOWLEDGE BASE

**Generated:** 2026-01-25 | **Commit:** 021b17a | **Branch:** main

## OVERVIEW

Bilingual (en/ko) Astro 5 blog. Markdown content, Tailwind v4,
astro-expressive-code.

## STRUCTURE

```
devlog/
├── src/
│   ├── content/          # Content Collections (posts, series, seriesPosts)
│   │   ├── config.ts     # Zod schemas + glob loaders
│   │   ├── posts/        # Category subdirs → {category}/{file}.md
│   │   └── series/       # _index*.md (metadata) + *.md (posts)
│   ├── pages/[lang]/     # All routes prefixed: /en/*, /ko/*
│   ├── components/       # .astro components
│   ├── layouts/          # BaseLayout, PostLayout
│   ├── config/           # locale.ts, site.ts
│   ├── utils/            # posts.ts (URL generation, filtering)
│   └── styles/           # global.css → modules/*.css
├── contents/             # Legacy mirror (NOT used in build)
├── astro.config.ts       # i18n, integrations, Vite aliases
└── CLAUDE.md             # Detailed architecture docs
```

## WHERE TO LOOK

| Task                     | Location                                   | Notes                               |
| ------------------------ | ------------------------------------------ | ----------------------------------- |
| Add blog post            | `src/content/posts/{category}/`            | See frontmatter in CLAUDE.md        |
| Add series post          | `src/content/series/{series}/`             | Needs `series` field in frontmatter |
| Modify URL generation    | `src/utils/posts.ts`                       | getPostUrl, getPostSlug             |
| Add page route           | `src/pages/[lang]/`                        | Must have `[lang]` param            |
| Edit global styles       | `src/styles/modules/`                      | theme, base, prose, callouts        |
| Change code highlighting | `astro.config.ts`                          | astro-expressive-code section       |
| Modify i18n              | `src/config/locale.ts` + `astro.config.ts` | Sync both                           |

## CONVENTIONS

### File Naming

- Posts: `{date}_{title}.md` or `{title}.ko.md` for lang-specific
- Series index: `_index.ko.md`, `_index.en.md`
- Series posts: `{NN}-{title}.{lang}.md` (01-, 02-)

### URL Generation

- **posts**: `/{lang}/posts/{folder-path}/{frontmatter-slug}`
- **series**: `/{lang}/series/{series-slug}/{file-id}` (lang suffix stripped)

### Content Collections

- `posts`: Regular blog, `slug` in frontmatter required
- `series`: Metadata files only (`_index*.md`)
- `seriesPosts`: Posts in series, `series` field required

## ANTI-PATTERNS

| Forbidden                          | Why                     |
| ---------------------------------- | ----------------------- |
| Routes without `[lang]/`           | i18n breaks, 404s       |
| Using `contents/` dir              | Legacy, not in build    |
| Frontmatter `slug` in series posts | Uses file ID instead    |
| Hardcoded `/en/` or `/ko/` paths   | Use `getLangPath(lang)` |

## COMMANDS

```bash
pnpm dev           # localhost:3000
pnpm build         # Production build
pnpm type-check    # astro check + tsc
pnpm lint          # ESLint
pnpm format        # Prettier
```

## NOTES

- **Theme toggle**: `[data-theme="light|dark"]` attribute on html
- **Code blocks**: dual themes (dracula-soft/night-owl), line numbers on
- **Draft filtering**: `draft: true` always hidden, `dev-only: true` prod-only
  hidden
- **Prefetch**: All links prefetched (`prefetchAll: true`)
- **Path alias**: `@/*` → `src/*`
