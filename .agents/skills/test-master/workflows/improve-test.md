# Workflow: Improve Test

Step-by-step workflow for improving existing test files.

## Prerequisites

- Existing test file to improve
- Understanding of current test coverage

## Steps

### Step 1: Analyze Current Tests

Read the test file and identify issues:

| Check      | Issue Signal                        |
| ---------- | ----------------------------------- |
| Test names | Vague like "works correctly"        |
| Structure  | Missing Given-When-Then comments    |
| Coverage   | Only happy path tested              |
| Mock data  | Inline objects instead of factories |
| Assertions | Using `toEqual` for primitives      |

### Step 2: Check Convention Violations

| Convention     | Violation      | Fix                     |
| -------------- | -------------- | ----------------------- |
| File extension | `.spec.ts`     | Rename to `.test.ts`    |
| Test function  | `it()`         | Change to `test()`      |
| Describe name  | String literal | Use `functionName.name` |
| Inline data    | Large objects  | Extract to factory      |

See [references/unit-test-convention.md](../references/unit-test-convention.md)
for full conventions.

### Step 3: Identify Missing Test Cases

Check for missing:

| Category        | Common Gaps                      |
| --------------- | -------------------------------- |
| Boundary values | Min/max edges not tested         |
| Error cases     | Invalid input not tested         |
| Edge cases      | Empty arrays, null, undefined    |
| List handling   | Only tested N items, not 0, 1, 2 |

### Step 4: Improve Test Names

Transform vague names to clear use cases:

```typescript
// ❌ Before
it('should work', () => { ... });
it('handles edge case', () => { ... });

// ✅ After
test('applies 20% discount for VIP customers', () => { ... });
test('returns empty array when no items match filter', () => { ... });
```

### Step 5: Add Given-When-Then Structure

```typescript
// ❌ Before
it("calculates total", () => {
  const items = [{ price: 100 }, { price: 200 }];
  expect(calculateTotal(items)).toBe(300);
});

// ✅ After
test("calculates total price of multiple items", () => {
  // given
  const items = [{ price: 100 }, { price: 200 }];

  // when
  const result = calculateTotal(items);

  // then
  expect(result).toBe(300);
});
```

### Step 6: Extract to Factory

```typescript
// ❌ Before - inline large objects
test("processes order", () => {
  const order = {
    id: "123",
    customer: {
      id: "c1",
      name: "Test",
      email: "test@example.com",
      grade: "VIP",
    },
    items: [{ id: "i1", name: "Product", price: 1000, quantity: 2 }],
    createdAt: "2024-01-01",
    status: "pending",
  };
  // ...
});

// ✅ After - use factory
test("processes order for VIP customer", () => {
  // given - only specify what matters for this test
  const order = orderFactory.build({
    customer: customerFactory.build({ grade: "VIP" }),
  });
  // ...
});
```

### Step 7: Fix Assertion Style

```typescript
// ❌ Overly broad
expect(result).toEqual({ rate: 0.1, amount: 1000 });

// ✅ Focused assertions
expect(result.rate).toBe(0.1);
expect(result.amount).toBe(1000);
// Metadata fields not critical - don't assert
```

### Step 8: Reduce Redundant Tests

```typescript
// ❌ Redundant - testing same logic
test('25세는 성인이다', ...);
test('30세는 성인이다', ...);
test('35세는 성인이다', ...);

// ✅ Efficient - boundary values only
test('경계값 20세는 성인이다', ...);  // boundary
test('경계값 19세는 미성년자이다', ...);  // boundary
test('일반 성인 케이스 25세', ...);  // one representative
```

### Step 9: Convert to Parameterized (if applicable)

When multiple tests follow same pattern:

```typescript
// ❌ Before - repetitive
test('validates user@example.com', () => { ... });
test('invalidates invalid-email', () => { ... });
test('invalidates empty string', () => { ... });

// ✅ After - parameterized
test.each`
  email                    | expected
  ${'user@example.com'}    | ${true}
  ${'invalid-email'}       | ${false}
  ${''}                    | ${false}
`('validates $email as $expected', ({ email, expected }) => {
  expect(validateEmail(email).isValid).toBe(expected);
});
```

### Step 10: Fix Time Dependencies

```typescript
// ❌ Flaky - depends on execution time
test("formats time", () => {
  const result = formatTime(data);
  expect(result.createdAt).toContain("2024"); // May fail next year
});

// ✅ Stable - fixed time
beforeEach(() => {
  jest.useFakeTimers();
  jest.setSystemTime(new Date("2024-01-01T00:00:00.000Z"));
});

afterEach(() => {
  jest.useRealTimers();
});

test("formats time with fixed date", () => {
  const result = formatTime(data);
  expect(result.createdAt).toBe("2024-01-01T00:00:00.000Z");
});
```

### Step 11: Remove Anti-Patterns

| Anti-Pattern               | Action                       |
| -------------------------- | ---------------------------- |
| `as any`                   | Fix types properly           |
| `@ts-ignore`               | Address the type issue       |
| `@ts-expect-error`         | Find correct typing          |
| Empty `catch {}`           | Handle or rethrow error      |
| `toHaveBeenCalled()` alone | Add `toHaveBeenCalledWith()` |

### Step 12: Run and Verify

```bash
# Run tests
pnpm test <test-file>

# Check coverage
pnpm test --coverage
```

## Improvement Checklist

- [ ] Test names describe use cases clearly
- [ ] Given-When-Then structure applied
- [ ] Factory pattern used for complex data
- [ ] Boundary values covered
- [ ] Error cases tested
- [ ] No type suppressions (`as any`, `@ts-ignore`)
- [ ] No redundant tests
- [ ] Time dependencies properly mocked
- [ ] All tests pass

## Success Criteria

The improved test file should:

1. Be readable as documentation
2. Cover boundary values
3. Use factories for mock data
4. Follow naming conventions
5. Have no type suppressions
