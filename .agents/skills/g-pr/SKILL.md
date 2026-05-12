---
name: g-pr
description: |
  Create a new draft pull request or update an existing PR's description. Gathers
  a Summary and a Before/After Test table, then pushes the branch and opens or
  edits the PR via gh. Use when asked to create, open, draft, or update a pull
  request. Also use on explicit invocation with $g-pr.
---

# Git Draft PR

Create a new draft PR or update an existing PR's body.

## When to invoke

**Auto-trigger**: user asks to open or update a PR on the current branch.

**Explicit invocation**: `$g-pr [--update | -u] [#PR_NUMBER]`

**Arguments**:
- `--update` / `-u` (optional): update mode — modify an existing PR
- `#PR_NUMBER` (optional): target a specific PR (with `-u`)

## Mode selection

| Invocation | Mode | Action |
|------------|------|--------|
| `$g-pr` | CREATE | Create a new draft PR |
| `$g-pr -u` | UPDATE | Update the current branch's PR |
| `$g-pr -u #123` | UPDATE | Update PR #123 |

## CREATE mode

### Step 1 — Validate git state

```bash
git status --porcelain
git branch --show-current
```

Fail fast when:
- Uncommitted changes exist → "Commit changes first"
- On `main` / `master` → "Create a feature branch first"

### Step 2 — Gather summary

Ask the user, in order:
1. **요구사항 / 목적** — "이 PR의 목적이나 해결하려는 문제는 무엇인가요?"
2. **구현 / 수단** — "구체적으로 어떻게 구현했나요? 주요 변경사항은?"

### Step 3 — Compose body

```markdown
## Summary
[filled from user input]

## Test
| Before / Requirements | After / Implementation |
| --------------------- | ---------------------- |
|                       |                        |
```

Note to the user: "UI 테스트 이미지는 PR 생성 후 직접 추가하세요."

### Step 4 — Generate title and create

```bash
# Push if no upstream is set
git push -u origin "$(git branch --show-current)"

# Create as draft
gh pr create --draft --title "$TITLE" --body "$BODY"
```

## UPDATE mode

### Step 1 — Find the PR

```bash
# With a PR number
gh pr view "$PR_NUMBER" --json number,title,url

# Otherwise, find the current branch's PR
gh pr view --json number,title,url
```

### Step 2 — Gather summary

Same two questions as CREATE.

### Step 3 — Update

```bash
gh pr edit "$PR_NUMBER" --body "$BODY"
```

Preview the new body before running `gh pr edit`.

## Output

### CREATE success

```
✅ Draft PR created: https://github.com/owner/repo/pull/123

Next steps:
1. Add test screenshots if needed
2. Mark as "Ready for review" when complete
```

### UPDATE success

```
✅ PR #123 updated: https://github.com/owner/repo/pull/123
```

### Failure

```
❌ Cannot create/update PR: {reason}
   {suggested action}
```

## Safety

| Check | Action |
|-------|--------|
| CREATE always uses `--draft` | Never open a ready-for-review PR automatically |
| UPDATE confirms first | Show a preview of the new body before editing |

## Related skills

- `g-branch` — generate a branch name
- `g-commit` — create atomic commits
