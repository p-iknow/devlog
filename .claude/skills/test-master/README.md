# Test Master Skill

Unit test writing guidelines and patterns for creating testable, maintainable,
and effective tests.

## Structure

```
test-master/
├── SKILL.md                           # Main skill (auto-loaded on triggers)
├── workflows/
│   ├── create-test.md                 # New test creation workflow
│   └── improve-test.md                # Test improvement workflow
├── references/
│   ├── unit-test-standard.md          # Testable code design principles
│   ├── unit-test-convention.md        # Test code conventions
│   ├── time-test.md                   # Time-dependent test patterns
│   └── parameterized-test.md          # Parameterized test patterns
└── README.md                          # This file
```

## Triggers

This skill auto-loads when these keywords appear:

- `test`, `테스트`, `spec`
- `unit test`, `단위 테스트`
- Time/mock related testing
- Factory patterns for test data

## Workflows

| Workflow                                     | Use When                 |
| -------------------------------------------- | ------------------------ |
| [create-test.md](workflows/create-test.md)   | Creating new test files  |
| [improve-test.md](workflows/improve-test.md) | Improving existing tests |

## References

| Document                                                      | Content                                     |
| ------------------------------------------------------------- | ------------------------------------------- |
| [unit-test-standard.md](references/unit-test-standard.md)     | Testable code design, dependency separation |
| [unit-test-convention.md](references/unit-test-convention.md) | Naming, structure, factory patterns         |
| [time-test.md](references/time-test.md)                       | Jest time mocks, date-fns patterns          |
| [parameterized-test.md](references/parameterized-test.md)     | test.each patterns, table vs array          |

## Quick Reference

### Core Principles

1. **Make code testable first** - Separate dependencies
2. **Tests as documentation** - Clear, descriptive names
3. **Efficient coverage** - Boundary values over redundant cases
4. **Maintainability** - Tests shouldn't break on unrelated changes

### List Testing Pattern

For arrays, test **0, 1, 2** items:

- **0**: Empty array handling
- **1**: Basic logic works
- **2**: Loop/iteration works

### Test Structure

```typescript
describe(functionName.name, () => {
  test("describes the use case clearly", () => {
    // given
    const input = createTestData();

    // when
    const result = functionName(input);

    // then
    expect(result).toBe(expected);
  });
});
```
