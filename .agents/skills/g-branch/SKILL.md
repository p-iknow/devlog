---
name: g-branch
description: |
  Generate a conventional git branch name from a task description. Detects branch
  type from Korean or English keywords and emits type/kebab-case with a
  ready-to-run git checkout -b command. Use when asked to create, suggest, or
  infer a branch name. Also use on explicit invocation with $g-branch.
---

# Git Branch Name Generator

Analyze the current task or description and generate a conventional git branch name.

## When to invoke

**Auto-trigger**: user describes a task and asks for a branch name, in Korean or English.

**Explicit invocation**: `$g-branch <description>`

**Do NOT trigger on**:
- Requests to commit or PR (→ `g-commit`, `g-pr`)
- Requests about branching strategy, rebases, or merges

## Workflow

### Step 1 — Parse the description

Extract:
- **Action**: what's being done (add, fix, update, remove, etc.)
- **Target**: what's affected (login, button, API, etc.)
- **Context**: additional qualifiers

If the description says "현재 작업" / "current work":
1. Check `git diff --stat` for changed files
2. Check any active task list for context
3. Infer branch purpose from those signals

### Step 2 — Detect branch type

| Type | Korean triggers | English triggers |
|------|-----------------|------------------|
| `feat` | 추가, 구현, 기능, 새로운, 만들기 | add, implement, feature, create, new |
| `fix` | 수정, 버그, 오류, 에러, 해결, 고치기 | fix, bug, error, resolve, correct |
| `chore` | 설정, 환경, 의존성, 빌드, 배포 | config, setup, build, deploy, dependency |
| `docs` | 문서, README, 주석, 설명 | doc, readme, comment, documentation |
| `refactor` | 리팩토링, 개선, 정리, 구조 | refactor, improve, cleanup, restructure |
| `test` | 테스트, 검증, 스펙 | test, spec, verify |
| `style` | 스타일, 포맷, 린트 | style, format, lint, css |

Default: `feat` when type is ambiguous.

### Step 3 — Generate the name

Rules:
1. **Format**: `{type}/{kebab-case-description}`
2. **Korean → English**: translate keywords to English
3. **Kebab-case**: lowercase, hyphen-separated
4. **Max length**: 50 characters total
5. **No special chars**: lowercase letters, digits, hyphens only
6. **Concise**: keep 2–4 essential keywords

### Step 4 — Output

```
**Branch Name:** `{generated-branch-name}`

```bash
git checkout -b {generated-branch-name}
```

**Analysis**
- Type: {detected-type}
- Keywords: {extracted-keywords}
```

When the type is ambiguous, note that `feat` was used as the default.

## Examples

| Input | Output |
|-------|--------|
| 사용자 로그인 기능 추가 | `feat/user-login` |
| fix: 버튼 클릭 안됨 | `fix/button-click` |
| OAuth2 인증 구현 | `feat/oauth2-auth` |
| README 업데이트 | `docs/update-readme` |
| 코드 정리 및 리팩토링 | `refactor/code-cleanup` |
| API 응답 에러 수정 | `fix/api-response-error` |
| 테스트 케이스 추가 | `test/add-test-cases` |
| CI/CD 파이프라인 설정 | `chore/cicd-pipeline` |

## Safety

| Rule | Enforcement |
|------|-------------|
| Never run git | Only emit the command; do not execute `git checkout -b` |
| No assumptions | Ask if description is empty |
| Sanitize output | Strip all special characters |

## Related skills

- `g-commit` — create atomic commits from current changes
- `g-pr` — draft or update a pull request
