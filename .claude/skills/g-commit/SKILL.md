---
name: g-commit
description: |
  Analyze git status and create purpose-based atomic commits. Groups changes by
  logical purpose (not by file or directory), detects the repo's existing commit
  style (language, semantic/plain/short), and stages + commits in dependency
  order. Supports a `--dry-run` preview mode.

  AUTO-TRIGGER when the user asks to:
  - commit current changes (커밋해줘, 커밋 만들어줘, commit the changes)
  - split changes into atomic commits (여러 커밋으로 나눠서, atomic commits, split commits)
  - preview a commit plan without executing (커밋 계획만 보여줘, dry-run, 미리보기)

  Also triggers on explicit invocation: /g-commit

  SKIP when:
  - User only wants a branch name (use `g-branch`)
  - User wants a PR (use `g-pr`)
  - User wants to amend a pushed commit or rewrite history (ask explicitly)
---

# Git Commit

Create atomic, purpose-based commits from the current working tree.

## When to invoke

**Auto-trigger**: user asks for a commit or a commit plan and there are staged / unstaged / untracked changes to act on.

**Explicit invocation**: `/g-commit [scope] [--dry-run]`

**Arguments**:
- `scope` (optional): limit to specific path(s)
- `--dry-run` (optional): show the plan, don't execute

## Workflow

### Step 1 — Context gathering (in parallel)

- `git status` — all changed files
- `git diff --staged --stat` + `git diff --stat` — change overview
- `git log -30 --oneline` — style detection sample
- `git branch --show-current` — branch context

### Step 2 — Style detection

Analyze the last 30 commits for:
- **Language**: Korean or English
- **Style**: SEMANTIC (`feat:`/`fix:`/...), PLAIN (sentence), or SHORT (few words)

Report the detected style before proceeding.

### Step 3 — Purpose-based grouping

Group by **logical purpose**, not file count or directory:

- Same feature / fix / refactor → same commit (even if 10+ files)
- Different purposes → different commits (even if in the same directory)
- Tests pair with their implementation → same commit

Emit the plan with justifications before running anything.

### Step 4 — Execute (unless `--dry-run`)

- Stage and commit each group in dependency order
- Add the repo's standard attribution footer
- Verify a clean working tree when finished

## Commit rules (non-negotiable)

| Rule | Enforcement |
|------|-------------|
| Same purpose = same commit | Even if 10+ files across directories |
| Different purposes = different commits | Even if in the same directory |
| Test + implementation = same commit | Always |
| Match the detected style | Never default to semantic |

### Anti-pattern: over-splitting

- **Wrong**: 3 files → 3 commits (split by file)
- **Wrong**: 2 directories → 2 commits (split by directory)
- **Correct**: 1 feature → 1 commit (grouped by purpose)

## Safety

| Action | Requirement |
|--------|-------------|
| Never skip hooks | No `--no-verify` |
| Never amend pushed commits | Unless explicitly requested |
| Never commit sensitive files | Warn on `.env`, credentials, keys |

## Output

### Success

```
COMMIT SUMMARY
==============
Created N commits:

1. abc1234 feat: add OAuth2 login
   - src/auth/oauth.ts
   - src/auth/oauth.test.ts

2. def5678 fix: correct button alignment
   - src/components/Button.tsx
```

### Dry run

```
COMMIT PLAN (dry-run)
=====================
Would create N commits:

COMMIT 1: feat: add OAuth2 login
  - src/auth/oauth.ts
  - src/auth/oauth.test.ts
  Justification: implementation + test

COMMIT 2: fix: correct button alignment
  - src/components/Button.tsx
  Justification: independent UI fix
```

## Related skills

- `g-branch` — generate a branch name
- `g-pr` — draft or update a pull request
