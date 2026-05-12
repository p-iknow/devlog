---
name: blog-post-translate
description: |
  Translate a Korean technical blog post in this devlog repo to English, producing a
  bilingual pair (.ko.md plus .en.md). Use for src/content/posts/**/*.ko.md or
  src/content/series/**/*.ko.md when asked to translate, create an English
  version, or produce an .en.md counterpart. Also use on explicit invocation with
  $blog-post-translate. Scope is KO to EN blog posts only.
---

# Blog Post Translate (KO → EN)

Produce an English counterpart for a Korean blog post draft. Goal: a post that an English-speaking senior engineer would recognize as well-written original prose, not as a translation.

## Principle

Translate the *idea*, not the sentence. Korean and English have different rhythms, different tolerances for hedging, different conventions for emphasis and structure. A faithful translation rewrites at the paragraph level so the English cadence fits the English ear — while the technical content stays exact.

If a sentence reads as "translated" (stiff, over-qualified, subject-heavy, or awkwardly literal), rewrite it. If in doubt, ask: *would an engineer writing this from scratch in English phrase it this way?*

## Voice

Calibrate to the voice of the repo's existing English posts. Before drafting, read at least one sibling `.en.md` in the same category folder — that's the house style. Match its tone, sentence length, and frontmatter conventions.

In general, aim for:
- Concrete subjects and active verbs
- Short clauses over nested ones
- Claims stated directly, with qualifiers only where they carry information
- Technical terms used precisely (verify against the spec/docs if unsure)

## What to preserve

Some elements are load-bearing and must survive translation unchanged:

- **Code blocks** — code content, identifiers, line-highlight annotations, diff markers, frame labels. Translate in-code comments only when they are explanatory prose, not part of the real code.
- **Callouts** — type (`[!info]`, `[!note]`, etc.) and position stay; body gets translated.
- **Structure** — heading hierarchy, list nesting, and section ordering stay. Paragraph splits may shift slightly; section boundaries should not.
- **Diagrams** — the shape of ASCII diagrams (arrows, boxes, flow direction) is preserved. Labels inside them get translated; re-align if English words shift widths.
- **Frontmatter** — keep all fields. Translate only what reads as prose (`title`, `description`). Flip `lang: ko` → `lang: en`. Everything else (`slug`, `date`, `category`, `tags`, `img`, `update`, `series`, `part`, `draft`, `dev-only`) is copied verbatim. Validate against the current Zod schema in `src/content.config.ts` on each use — it can change.

## What to transform

Some elements need adaptation rather than literal transfer:

- **Links to docs with locales** (MDN, some framework sites) — swap to the English locale if the English page exists. Locale-neutral links (GitHub issues/PRs/repos) are copied unchanged.
- **Bilingual parentheticals** — Korean often annotates English terms in parens as a reader's bridge (`리팩터링(refactoring)`). In English, drop the parenthetical. Keep it only if the gloss defines a genuinely non-obvious term, not when it's just a vocabulary bridge.
- **Sentence length** — long Korean sentences often read better as two English sentences. Conversely, don't artificially merge.
- **Hedges and fillers** — Korean rhetorical connectors and softeners often don't translate. Cut them unless they carry meaning.
- **Rhetorical devices** — question-form headings, emphatic bolding, numbered enumerations: preserve the *device*, translate the *content*.

## Scope boundary

This skill translates. It does not:
- Polish the Korean source (use `blog-post-polish` first if needed)
- Reorganize sections, rename headings, or add new examples
- Fix technical errors silently — if the Korean makes a claim, the English makes the same claim. Flag issues to the user rather than "correcting" in translation.
- Go EN → KO

## Workflow

1. **Read the Korean source** and at least one sibling English post in the same folder for voice calibration.
2. **Check the frontmatter schema** in `src/content.config.ts` to confirm current field requirements.
3. **Draft paragraph-by-paragraph**, not sentence-by-sentence. Let English cadence reshape the prose while preservation rules protect code, structure, and callouts.
4. **Write** the output as `<slug>.en.md` next to the Korean source.
5. **Self-check** before handing back: does the file read like an original English post? Are all preservation-required elements byte-identical? Are any Hangul characters left by accident (excluding intentional quotes)? Does the frontmatter validate?

## Filename

- Source: `<slug>.ko.md`
- Target: `<slug>.en.md` (same slug, same folder)
- Legacy date-prefixed posts (`190630_*.md`) are typically single-language; don't translate unless asked.

## References

- `src/content.config.ts` — frontmatter schema (source of truth)
- `src/config/locale.ts` — valid `lang` values
- `src/content/posts/*/` — sibling `.en.md` files for voice calibration (read before drafting)
- `.agents/skills/blog-post-polish/SKILL.md` — companion skill; run on the Korean source first if it needs cleanup
- `src/content/series/markdown-guide/` — markdown conventions (code blocks, callouts, highlights) that must round-trip through translation
