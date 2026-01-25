---
name: test-master
description: |
  Unit test writing guidelines, conventions, and patterns for creating maintainable tests.

  USE WHEN:
  - Writing new test files
  - Improving existing tests
  - "test", "테스트", "spec", "unit test", "단위 테스트"
  - Time-dependent code testing
  - Parameterized test patterns
  - Mock data and factory patterns

  DO NOT USE WHEN:
  - E2E or integration tests (this skill focuses on unit tests)
  - Non-test related code
---

# Test Master

Unit test writing guidelines and patterns for creating testable, maintainable,
and effective tests.

## Quick Reference

| Principle              | Core Idea                                    |
| ---------------------- | -------------------------------------------- |
| **Testable Code**      | Make functions testable before writing tests |
| **Clear Use Cases**    | Tests should document function behavior      |
| **Efficient Coverage** | Boundary values > redundant middle values    |
| **Maintainability**    | Tests shouldn't break on unrelated changes   |

## Workflow Routing

| Intent                | Workflow                                               |
| --------------------- | ------------------------------------------------------ |
| Create new test file  | [workflows/create-test.md](workflows/create-test.md)   |
| Improve existing test | [workflows/improve-test.md](workflows/improve-test.md) |

## Core Principles

### 1. Testable Code First

Before writing tests, ensure the function is testable:

- **Separate time dependencies** → Pass time as parameter
- **Separate API calls** → Extract business logic to pure functions
- **Separate runtime dependencies** → Isolate browser APIs

```typescript
// ❌ Hard to test
const formatTime = (data) => {
  return { ...data, createdAt: new Date().toISOString() };
};

// ✅ Testable
const formatTime = (data, currentTime: Date) => {
  return { ...data, createdAt: currentTime.toISOString() };
};
```

### 2. Tests as Documentation

Test names should clearly document use cases:

```typescript
// ❌ Vague
it('calculates rate', () => { ... });

// ✅ Clear use case
it('applies 20% discount for VIP customers', () => { ... });
```

### 3. Efficient Coverage

Focus on boundary values, not redundant cases:

```typescript
// ❌ Redundant (25, 30, 35, 40 all test same logic)
it('25세는 성인이다', ...);
it('30세는 성인이다', ...);

// ✅ Efficient (boundary values: 19, 20)
it('경계값 20세는 성인이다', ...);
it('경계값 19세는 미성년자이다', ...);
```

### 4. List Testing Pattern

For arrays: test **0, 1, 2** items only:

- **0**: Empty array handling
- **1**: Basic logic works
- **2**: Loop/iteration works

## Key Conventions

### File Structure

```
src/utils/format-date.ts → src/utils/format-date.test.ts
```

Use `.test.ts` not `.spec.ts` for consistency.

### Test Structure (Given-When-Then)

```typescript
describe(calculateTax.name, () => {
  test("applies 10% tax rate for regular income", () => {
    // given
    const income = 50000;
    const taxRate = 0.1;

    // when
    const result = calculateTax(income, taxRate);

    // then
    expect(result.taxAmount).toBe(5000);
  });
});
```

### Factory Pattern for Mock Data

```typescript
// Use factory for test data
const vipUser = userFactory.build({
  membershipLevel: "VIP", // Explicit test point
  discountRate: 0.2,
});
```

## References

| Topic                | Reference                                                                |
| -------------------- | ------------------------------------------------------------------------ |
| Testable code design | [references/unit-test-standard.md](references/unit-test-standard.md)     |
| Test conventions     | [references/unit-test-convention.md](references/unit-test-convention.md) |
| Time-dependent tests | [references/time-test.md](references/time-test.md)                       |
| Parameterized tests  | [references/parameterized-test.md](references/parameterized-test.md)     |

## Anti-Patterns

| Anti-Pattern              | Problem            | Solution             |
| ------------------------- | ------------------ | -------------------- |
| `as any`, `@ts-ignore`    | Hides type errors  | Fix types properly   |
| Empty catch `catch(e) {}` | Silences errors    | Handle or rethrow    |
| Inline large snapshots    | Poor readability   | Use helper functions |
| DOM tests in unit tests   | Slow, fragile      | Test pure logic only |
| Testing implementation    | Breaks on refactor | Test behavior        |
