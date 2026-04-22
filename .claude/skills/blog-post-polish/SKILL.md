---
name: blog-post-polish
description: |
  Polish Korean technical blog post drafts in this devlog repo to publishable quality.
  Applies consistent improvements across six axes: Korean prose, bilingual term
  annotation, naming consistency, markdown hygiene, code block quality, and content
  structure.

  AUTO-TRIGGER when the user is editing a file under `src/content/posts/**/*.md` or
  `src/content/series/**/*.md` AND asks to:
  - polish / refine / fix / clean up the post (다듬다, 교정, 퇴고, 매끄럽게)
  - fix awkward Korean phrasing (어색한 한국어, 자연스럽게, 문장 교정)
  - add English term annotations / bilingual notation (영어 병기, 영문 병기)
  - add or fix frontmatter for a post (프론트매터, frontmatter)
  - add a callout / admonition (callout, 콜아웃, `> [!info]`, `> [!note]` 등)
  - fix code block formatting, line highlighting, diff view (코드 하이라이트, 80자, diff 블록)
  - remove bold from headings / quotes, convert bold pseudo-headings to `####` (bold 제거)
  - rename a post file to `.ko.md` / `.en.md` suffix or create bilingual pair

  Also triggers on explicit invocation: /blog-post-polish

  SKIP when editing files outside the blog content (code, configs, other markdown like
  README/docs). This skill is scoped to blog post drafts only — do not trigger on
  general Korean writing tasks or technical documentation outside `src/content/`.
---

# Blog Post Polish

Review and polish a Korean technical blog post draft (`src/content/posts/**/*.md`, `src/content/series/**/*.md`) to publishable quality, applying a consistent six-axis checklist learned from prior reviews.

## When to invoke

**Auto-trigger conditions** (any combination):
- Target file lives under `src/content/posts/` or `src/content/series/`
- User's request matches any of the patterns in the frontmatter `AUTO-TRIGGER` list above
- User pastes or references blog prose and asks for review/polish

**Explicit invocation**: `/blog-post-polish`

**Do NOT trigger on**:
- Editing code, configs, `README.md`, or `.claude/` files
- General Korean writing unrelated to blog posts
- Translation tasks without a polish intent (use `english-learn` for KO→EN)
- Single-token rename / typo fix requests that don't need the full six-axis pass

## Six-axis checklist

Run the post through each axis. Propose fixes grouped by axis; apply iteratively with user confirmation on structural changes.

### 1. Korean prose quality

Replace colloquial, vague, or metaphorical verbs with the most natural Korean that accurately describes the operation. No fixed mapping — read each sentence in context and ask: "what is this actually doing?" Rewrite with a verb that answers that question plainly.

Guiding principles:
- Prefer plain verbs over figurative ones. If the figure doesn't add meaning, it's noise.
- When a verb describes a technical operation, name the operation explicitly (e.g., call out the function/API being invoked, the data structure being modified).
- Fix quantifier/list mismatches ("세 가지" requires exactly three enumerated items).
- When multiple phrasings fit, pick the one that a Korean-speaking senior developer would say aloud in a code review.

When in doubt, check that the sentence can be read back without ambiguity and without leaning on a metaphor to do the work.

### 2. Bilingual term handling

For developer vocabulary, choose one of two paths per term — don't force every term through a translation:

**Path A — natural Korean with English in parentheses on first use.** Use when a widely-accepted Korean rendering exists and the English origin still helps the reader map to docs/specs. Format: `한국어(english)`.

**Path B — English as-is.** Use when:
- the term is a code/API identifier (keep in backticks)
- the loanword is already the dominant form in Korean dev writing
- the Korean translation would feel forced, invented, or less precise than the English

Decision heuristic: Would a Korean senior engineer actually *say* this word in Korean when explaining the concept to a teammate? If yes → Path A. If they'd naturally switch to English mid-sentence → Path B.

What to avoid:
- Inventing unfamiliar Korean calques just to have a translation
- Duplicating annotations (don't repeat `(english)` on every occurrence — first use only)
- Translating identifiers (`resolve`, `subscribeEvent`, `Promise`) — these stay in backticks

### 3. Naming consistency

- Use **full explicit names**. E.g., always "Promise executor", never bare "executor" (easy to miss; reader loses context).
- One translation per term across the post. Pick one form and `replace_all`.
- Match conventions of sibling posts in the same category folder.

### 4. Markdown hygiene

**Before editing, consult the repo's own markdown guides** (they are the source of truth for this blog's conventions):

- [`01-markdown-style-guide.ko.md`](../../../src/content/series/markdown-guide/01-markdown-style-guide.ko.md) — heading hierarchy (body starts at H2, H1 is reserved for post title), paragraphs, images, blockquotes, lists, tables
- [`02-markdown-callout-guide.ko.md`](../../../src/content/series/markdown-guide/02-markdown-callout-guide.ko.md) — full list of callout types (`note`, `info`, `tip`, `warning`, `danger`, etc.) and aliases
- [`03-markdown-code-guide.ko.md`](../../../src/content/series/markdown-guide/03-markdown-code-guide.ko.md) — code block features (frames, line markers, labels, `diff lang="..."`, inline text highlighting)

**Frontmatter** — the authoritative schema lives in [`src/content.config.ts`](../../../src/content.config.ts). Always open that file first and validate against the relevant Zod schema (`posts` for regular posts, `seriesPosts` for series entries). Required/optional fields and their types come from there — not from this skill.

At the time of writing, the `posts` schema requires: `title`, `description`, `date`, `slug`. Optional: `update`, `draft` (default `false`), `dev-only` (default `false`), `category`, `tags` (default `[]`), `img`, `lang`. `lang` must match `LOCALES` in `src/config/locale.ts` (currently `'en' | 'ko'`). `seriesPosts` adds a required `series` field and optional `part` (ordering). Re-check the schema on every use — it can change.

After confirming the schema, still cross-reference a **sibling post in the same folder** for stylistic conventions the schema doesn't enforce:
- Value phrasing of `category` (e.g., `'javascript'` vs `'js'` — driven by existing posts, not the folder name)
- `tags` vocabulary (reuse existing tags before minting new ones)
- Whether `img` is populated (only if `public/<name>.webp` exists; otherwise omit)
- Filename convention: new bilingual posts use `.ko.md` / `.en.md` suffix; legacy single-language posts may just be `.md`

Once title moves to frontmatter, remove the H1 (`# title`) from the body.

**Callouts** — use `> [!info]` / `> [!note]` / `> [!warning]` (see `src/content/series/markdown-guide/02-markdown-callout-guide.ko.md` for full list). Use for library context boxes, PR references, side notes.

**No bold in headings or blockquotes**:
- `**1. 제목**` (pseudo-heading) → `#### 1. 제목` (proper H4)
- `> **강조 인용**` → `> 강조 인용` (backticks stay; bold dropped)
- Body-paragraph bold is fine (for thesis sentences).

### 5. Code block quality

**80-char width** — measure with `awk '/^```/{in=!in; next} in && length>80 {print NR":"$0}' file.md`. Break long lines by:
- Converting inline arrow callbacks to block form: `() => resolve(v)` → `() => { resolve(v); }`
- Breaking function calls across arguments (one per line)

**Line highlighting** — Expressive Code syntax:
- `\`\`\`ts {7, 30}` — specific lines
- `\`\`\`ts {7-10, 16, 30-37}` — ranges + specific
- Choose lines that illustrate **one point** (e.g., TDZ pair vs. full cycle)

**Before/after comparison** — use `diff lang="ts"` (see `src/content/series/markdown-guide/03-markdown-code-guide.ko.md`):
```diff lang="ts"
  function foo() {
-   oldImpl();
+   newImpl();
  }
```

**Source fidelity** — when showing real refactors, fetch the PR diff (`gh pr diff N --repo owner/name`) and match the actual original code, not a simplified version.

**ASCII diagrams** — for narrow screens (mobile), prefer vertical flow:
```
A
  ↓
B
  ↓
C
```
over horizontal `A → B → C`.

### 6. Content structure

- **Define terms on first use** — e.g., introduce "settle" as "Promise를 resolve 또는 reject 중 어느 쪽으로든 확정짓는 것" before reusing.
- **Library/PR context callouts** — when referencing a forked or upstream library, drop a `> [!info]` explaining what it is and why. Link the PR with full diff: `> [!note] 전체 수정과 diff는 [repo#N](url)에서 확인할 수 있다.`
- **Remove redundant summary sentences** — if a diagram already shows the cycle, don't restate the cycle in prose.
- **Question-form headings** — prefer "무엇이 X를 만드는가?" over "X의 원인" for subsections that answer a specific question.

## Workflow

1. **Read** the target `.md` file.
2. **Audit** — map each line/block to the 6-axis checklist. Create a concrete punch list.
3. **Propose** — show the user the list; confirm scope before big restructures (e.g., frontmatter migration, H1 removal, diff-block conversion).
4. **Apply iteratively** — one axis at a time, verify after each batch:
   - After code formatting: `awk` for >80 lines
   - After bold removal: `grep` for `\*\*` in heading/quote positions
   - After frontmatter: match structure of sibling post
5. **Final verification** — read the file end-to-end to catch interactions between axes.

## Non-goals

- **Not a translator** — Korean → English is `english-learn`.
- **Not a code reviewer** — logic/correctness is the `code-reviewer` agent.
- **Not an inventor** — polish what the author wrote; don't add new technical claims without asking.
- **Not a title/thumbnail generator** — leave marketing decisions to the author.

## Examples of changes this skill produced in practice

- Added `> [!info]` callout introducing `overlay-kit-async` as a fork, with PR #169 reference for the upstream issue
- Converted verbose `return new Promise((_resolve, _reject) => { ... })` block + clean refactored version to a single `diff lang="ts"` block
- Highlighted TDZ-critical pair `{7, 30}` → expanded to full-function view `{6-11, 13-18, 20-25, 30-41}` when user wanted "각 함수 전체"
- Converted horizontal flow `A → B → C → D` (98 chars) to vertical stacked arrows for mobile
- Replaced "바인딩을 잡는다" with "변수 바인딩을 참조한다 — 콜백이 정의될 땐 TDZ 상태여도, 실제로 실행될 때는 이미 할당이 끝나 있다"
- Added `(emit)` annotation to "이벤트가 발생" for readers tracing the ECMAScript spec

## References

**Markdown conventions** — the blog's own style guide series is the authoritative source for all markdown decisions. Read all three before applying Axis 4 (Markdown hygiene) and Axis 5 (Code block quality):

- `src/content/series/markdown-guide/01-markdown-style-guide.ko.md` — heading hierarchy (H2 is the highest body level, H1 reserved for title), paragraph/image/list/blockquote/table conventions
- `src/content/series/markdown-guide/02-markdown-callout-guide.ko.md` — all supported callout types (`note`, `info`, `tip`, `warning`, `danger`) and their aliases
- `src/content/series/markdown-guide/03-markdown-code-guide.ko.md` — code block frames, line markers (`{n}`, `ins={n}`, `del={n}`), labels, `diff lang="..."`, inline text highlighting

**Other precedents**

- **Frontmatter schema (source of truth)**: `src/content.config.ts` (Zod schemas for `posts`, `series`, `seriesPosts`)
- Locale enum: `src/config/locale.ts` (valid `lang` values)
- Frontmatter style precedent: `src/content/posts/typescript/baseurl-deprecation.{ko,en}.md` (category wording, tags, slug conventions beyond what the schema enforces)
