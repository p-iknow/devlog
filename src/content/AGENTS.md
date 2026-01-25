# CONTENT COLLECTIONS

## OVERVIEW

Three Zod-validated collections using Astro 5 glob loader.

## COLLECTIONS

| Collection    | Pattern        | Base                   | Purpose              |
| ------------- | -------------- | ---------------------- | -------------------- |
| `posts`       | `**/*.md`      | `./src/content/posts`  | Regular blog posts   |
| `series`      | `*/_index*.md` | `./src/content/series` | Series metadata only |
| `seriesPosts` | `**/[!_]*.md`  | `./src/content/series` | Posts within series  |

## FRONTMATTER

### posts (required: title, description, date, slug)

```yaml
title: "Post Title"
description: "..."
date: 2025-01-01
slug: kebab-case-english # Required, used in URL
lang: ko # Optional, from filename (.ko.md)
draft: false # Hidden everywhere
dev-only: false # Hidden in prod only
category: javascript
tags: [tag1, tag2]
```

### seriesPosts (required: title, description, date, series)

```yaml
title: "Series Post"
description: "..."
date: 2025-01-01
series: markdown-guide # Must match series slug
part: 1 # Order (or use 01- filename prefix)
lang: ko
# NO slug field - uses file ID
```

### series metadata (\_index\*.md)

```yaml
title: "Series Title"
description: "..."
slug: series-slug # Optional
lang: ko
```

## URL GENERATION (src/utils/posts.ts)

| Collection  | URL Pattern                        | Source                  |
| ----------- | ---------------------------------- | ----------------------- |
| posts       | `/{lang}/posts/{folder}/{slug}`    | frontmatter `slug`      |
| seriesPosts | `/{lang}/posts/{series}/{file-id}` | file ID (lang stripped) |

## FILE NAMING

```
posts/
├── {category}/
│   └── {date}_{title}.md           # e.g., 190524_comma-operator.md
│   └── {title}.ko.md               # lang-specific

series/
└── {series-slug}/
    ├── _index.ko.md                # Metadata (Korean)
    ├── _index.en.md                # Metadata (English)
    ├── 01-first-post.ko.md         # Ordering by filename
    └── 02-second-post.ko.md
```

## ANTI-PATTERNS

- **No `slug` in seriesPosts**: URL uses file ID, not frontmatter
- **Missing `series` field**: seriesPosts won't link to parent series
- **Wrong `_index` naming**: Must be `_index*.md` for series collection
