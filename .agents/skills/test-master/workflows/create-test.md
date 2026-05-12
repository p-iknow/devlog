# Workflow: Create Test

Step-by-step workflow for creating new test files.

## Prerequisites

- Target source file exists
- Understanding of function's purpose

## Steps

### Step 1: Analyze Target Code

Read the source file and identify:

| Aspect              | Extract                           |
| ------------------- | --------------------------------- |
| Function signatures | Input types, return types         |
| Dependencies        | External APIs, time, browser APIs |
| Business logic      | Core transformation rules         |
| Edge cases          | Null handling, boundaries         |

```typescript
// Example: Analyzing this function
const calculateDiscount = (
  customer: Customer,
  amount: number
): DiscountResult => {
  // Extract: Customer type affects discount rate
  // Extract: Amount must be positive
  // Edge case: What if customer.grade is undefined?
};
```

### Step 2: Check Testability

Verify function is testable. If not, refactor first:

| Issue                        | Solution                                |
| ---------------------------- | --------------------------------------- |
| Uses `new Date()` internally | Pass time as parameter                  |
| Calls API directly           | Extract business logic to pure function |
| Uses `localStorage`          | Separate storage logic                  |

See [references/unit-test-standard.md](../references/unit-test-standard.md) for
detailed patterns.

### Step 3: Create Test File

Create file with `.test.ts` extension:

```bash
# Source: src/utils/calculate-discount.ts
# Test:   src/utils/calculate-discount.test.ts
```

### Step 4: Set Up Test Structure

```typescript
import { calculateDiscount } from "./calculate-discount";
import { customerFactory } from "./customer.factory";

describe(calculateDiscount.name, () => {
  // Tests will go here
});
```

### Step 5: Identify Test Cases

Use boundary value analysis:

| Category        | Cases to Test                  |
| --------------- | ------------------------------ |
| Happy path      | Normal valid input             |
| Boundary values | Min, max, edge values          |
| Error cases     | Invalid input, null, undefined |
| Special cases   | Empty arrays, zero values      |

For lists: Test **0, 1, 2** items only.

### Step 6: Write Tests (Given-When-Then)

```typescript
describe(calculateDiscount.name, () => {
  test("applies 20% discount for VIP customers", () => {
    // given - set up test data
    const customer = customerFactory.build({ grade: "VIP" });
    const amount = 100000;

    // when - execute function
    const result = calculateDiscount(customer, amount);

    // then - verify result
    expect(result.discountRate).toBe(0.2);
    expect(result.finalAmount).toBe(80000);
  });

  test("applies no discount for regular customers", () => {
    // given
    const customer = customerFactory.build({ grade: "REGULAR" });
    const amount = 100000;

    // when
    const result = calculateDiscount(customer, amount);

    // then
    expect(result.discountRate).toBe(0);
    expect(result.finalAmount).toBe(100000);
  });

  test("throws error for negative amount", () => {
    // given
    const customer = customerFactory.build();
    const negativeAmount = -1000;

    // when & then
    expect(() => calculateDiscount(customer, negativeAmount)).toThrow(
      "Amount must be positive"
    );
  });
});
```

### Step 7: Create Factory (if needed)

```typescript
// src/utils/customer.factory.ts
import { Sync } from "factory.ts";

export const customerFactory = Sync.makeFactory<Customer>(() => ({
  id: "customer-1",
  name: "Test User",
  grade: "REGULAR",
  createdAt: "2024-01-01T00:00:00.000Z",
}));
```

### Step 8: Handle Time Dependencies

If function uses current time:

```typescript
describe(formatOrderTime.name, () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2024-01-01T00:00:00.000Z"));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test("formats order time correctly", () => {
    // Now new Date() returns fixed time
    const result = formatOrderTime(orderData);
    expect(result.createdAt).toBe("2024-01-01T00:00:00.000Z");
  });
});
```

See [references/time-test.md](../references/time-test.md) for more patterns.

### Step 9: Use Parameterized Tests (if applicable)

For multiple similar test cases:

```typescript
describe(validateEmail.name, () => {
  test.each`
    email                 | expected
    ${"user@example.com"} | ${true}
    ${"invalid-email"}    | ${false}
    ${""}                 | ${false}
  `("validates $email as $expected", ({ email, expected }) => {
    const result = validateEmail(email);
    expect(result.isValid).toBe(expected);
  });
});
```

See [references/parameterized-test.md](../references/parameterized-test.md) for
patterns.

### Step 10: Run and Verify

```bash
# Run specific test file
pnpm test src/utils/calculate-discount.test.ts

# Run with coverage
pnpm test --coverage
```

## Success Criteria

- [ ] All test cases pass
- [ ] Boundary values covered
- [ ] Error cases tested
- [ ] No `as any` or `@ts-ignore`
- [ ] Factory used for complex mock data
- [ ] Time dependencies properly mocked

## Output

A complete test file following conventions in
[references/unit-test-convention.md](../references/unit-test-convention.md).
