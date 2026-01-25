---
description: Create or improve unit tests using test-master guidelines
allowed-tools: Read, Write, Glob, Grep, Bash(pnpm:test)
argument-hint: "<file-path> [--improve]"
---

# Create Test Command

Create or improve unit tests following test-master skill guidelines.

## Arguments

$ARGUMENTS

- **file-path** (required): Source file to test (e.g., `src/utils/format.ts`)
- **--improve** (optional): Improve existing test file instead of creating new

## Instructions

### Phase 1: Load Skill

Read @.claude/skills/test-master/SKILL.md for guidelines.

### Phase 2: Analyze Target

1. Read the target source file
2. Identify:
   - Function signatures (inputs, outputs)
   - Dependencies (time, API, browser)
   - Business logic and edge cases
   - Existing test file (if `--improve`)

### Phase 3: Route Workflow

| Mode                  | Workflow                                              |
| --------------------- | ----------------------------------------------------- |
| Create (default)      | @.claude/skills/test-master/workflows/create-test.md  |
| Improve (`--improve`) | @.claude/skills/test-master/workflows/improve-test.md |

### Phase 4: Execute

Follow the selected workflow:

**For Create:**

1. Create test file at `{source-dir}/{filename}.test.ts`
2. Set up imports and describe block
3. Write tests for each function:
   - Happy path
   - Boundary values (0, 1, 2 for lists)
   - Error cases
4. Use factory pattern for complex mock data
5. Apply Given-When-Then structure

**For Improve:**

1. Analyze existing tests for issues
2. Fix convention violations
3. Add missing test cases
4. Refactor to use factories

### Phase 5: Verify

```bash
pnpm test <test-file-path>
```

## Test Structure Template

```typescript
import { targetFunction } from "./target-file";
import { mockFactory } from "./mock.factory";

describe(targetFunction.name, () => {
  test("describes the expected behavior clearly", () => {
    // given
    const input = mockFactory.build({ key: "value" });

    // when
    const result = targetFunction(input);

    // then
    expect(result).toBe(expected);
  });
});
```

## Output

### Success (Create)

```
TEST CREATED
============
File: src/utils/format.test.ts

Tests written:
- formatDate: 3 tests (happy path, boundary, error)
- parseAmount: 2 tests (valid, invalid)

Run: pnpm test src/utils/format.test.ts
```

### Success (Improve)

```
TEST IMPROVED
=============
File: src/utils/format.test.ts

Changes:
- Renamed 3 vague test names
- Added 2 boundary value tests
- Converted inline data to factory
- Added Given-When-Then comments

Run: pnpm test src/utils/format.test.ts
```

### Failure

```
ERROR: Cannot create test
==========================
Reason: [specific issue]

Suggestions:
- [How to resolve]
```

## Safety

| Check                | Action                                     |
| -------------------- | ------------------------------------------ |
| Existing test file   | Warn before overwriting (unless --improve) |
| Non-testable code    | Suggest refactoring first                  |
| Missing dependencies | List required packages                     |

## Key Principles

1. **Testable code first** - If target isn't testable, suggest refactoring
2. **Boundary values** - Focus on 0, 1, 2 for lists; min/max for numbers
3. **Factory pattern** - Always use factories for complex mock data
4. **No type hacks** - Never use `as any` or `@ts-ignore`

## Related

- @.claude/skills/test-master/SKILL.md
- @.claude/skills/test-master/workflows/create-test.md
- @.claude/skills/test-master/workflows/improve-test.md
