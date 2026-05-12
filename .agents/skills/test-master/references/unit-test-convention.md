---
title: "1. Unit Test Convention"
description: "테스트 파일 구조와 네이밍, Given-When-Then 패턴, matcher 사용 규칙을 정리합니다."
type: reference
tags: [Testing, BestPractice]
order: 1
---

# 1. Unit Test Convention

## 테스트 파일 구조

### 파일 명명 규칙

테스트 파일은 `.spec`이 아닌 `.test` 확장자로 통일합니다.

```
src/utils/format-date.ts → src/utils/format-date.test.ts
src/components/button.tsx → src/components/button.test.tsx
```

#### `.test` vs `.spec` 사용 이유

`.spec` 대신 `.test`를 사용하는 이유는 `test` vs `it` 사용 이유와 동일합니다:

1. **보편성**: `spec`은 특정 맥락(specification)을 가진 용어이지만, `test`는 언어와 도메인에 관계없이 보편적
2. **명확성**: `test`는 직관적이고 누구나 이해할 수 있는 명확한 의미
3. **일관성**: 함수명도 `test()`, 파일명도 `.test`로 통일하여 일관된 네이밍 컨벤션 유지

## Test Structure

### Describe와 Test 구조

```typescript
describe(함수명.name, () => {
  test('구체적인 상황에서 예상되는 결과를 설명한다', () => {
    // given - 테스트 준비
    const input = 'test input';

    // when - 실행
    const result = 함수명(input);

    // then - 검증
    expect(result).toBe(expectedValue);
  });
});
```

#### `test` vs `it` 사용 이유

`it` 대신 `test`를 사용하는 이유:

1. **표준 레퍼런스**: [Jest 공식 문서](https://jestjs.io/docs/getting-started), [Node.js Test Runner](https://nodejs.org/api/test.html#describe-and-it-aliases), [Vitest](https://vitest.dev/guide/) 모두 `test`를 기본으로 사용
2. **LLM 학습 데이터**: 더 많은 레퍼런스와 예제에서 `test`가 사용되어 AI 도구들이 더 정확한 코드를 생성
3. **가독성**: `it`은 맥락 의존적이고 영어권이 아닌 개발자나 타 직군에게 이해하기 어려움
4. **명확성**: `test`는 직관적이고 언어에 관계없이 테스트임을 명확히 표현

### Given-When-Then 패턴

- **Given**: 테스트에 필요한 데이터와 상태를 준비
- **When**: 테스트할 함수나 메서드를 실행
- **Then**: 결과를 검증

```typescript
describe('calculateTax', () => {
  test('일반 소득에 대해 세율 10%를 적용한다', () => {
    // given - 테스트 데이터 준비
    const income = 50000;
    const taxRate = 0.1;

    // when - 함수 실행
    const result = calculateTax(income, taxRate);

    // then - 결과 검증
    expect(result.taxAmount).toBe(5000);
    expect(result.netIncome).toBe(45000);
  });

  test('소득이 0일 때 세금을 0으로 계산한다', () => {
    // given
    const income = 0;
    const taxRate = 0.1;

    // when
    const result = calculateTax(income, taxRate);

    // then
    expect(result.taxAmount).toBe(0);
    expect(result.netIncome).toBe(0);
  });
});
```

#### 중첩 구조나 별도 라이브러리 대신 주석을 사용하는 이유

1. **가독성**: 실제로 보는 것은 터미널 출력이 아닌 테스트 코드 자체이므로, 중첩 구조는 오히려 가독성을 떨어뜨림
2. **작성 편의성**: nested 문법의 열고 닫는 괄호 실수를 방지하고 코드 작성이 더 간단함
3. **의존성 최소화**: 별도 유틸 라이브러리는 불필요한 오버헤드이며, 테스트에서 의존성 문제로 예기치 않게 깨질 위험이 있음
4. **충분한 표현력**: Given-When-Then 주석만으로도 테스트 구조를 명확히 표현 가능
5. **LLM 친화적**: 최근 LLM이 테스트 코드를 작성하는 경우가 많아졌는데, 주석 기반 구조가 더 일관되고 이해하기 쉬움

## 테스트 코드에 사용되는 변수명

### 기본 변수명 규칙

테스트 코드에서는 일관된 변수명을 사용하여 가독성을 높입니다.

```typescript
describe('calculateDiscount', () => {
  test('VIP 고객에게 20% 할인을 적용한다', () => {
    // given
    const input = {
      customerId: 'vip123',
      orderAmount: 10000,
      customerType: 'VIP'
    };

    // when
    const actual = calculateDiscount(input);

    // then
    expect(actual).toEqual({
      discountRate: 0.2,
      finalAmount: 8000
    });
  });
});
```


## Jest Matcher 사용 가이드

### 테스트 유지보수 편의성을 위한 Inline Snapshot 활용

String, Object, Array, JSON 구조 등의 데이터는 `toMatchInlineSnapshot()`으로 처리합니다.

```typescript
describe('generateEmailTemplate', () => {
  test('환영 이메일 템플릿을 생성한다', () => {
    // given
    const user = { name: '홍길동', email: 'hong@example.com' };

    // when
    const result = generateEmailTemplate('welcome', user);

    // then - 문자열도 inline snapshot으로 처리
    expect(result).toMatchInlineSnapshot(`
      "안녕하세요, 홍길동님!

      회원가입을 환영합니다.
      귀하의 이메일 주소: hong@example.com

      서비스 이용에 궁금한 점이 있으시면 언제든 문의해 주세요.

      감사합니다."
    `);
  });
});

describe('formatUserProfile', () => {
  test('사용자 프로필을 올바른 형식으로 변환한다', () => {
    // given
    const rawUser = {
      id: 123,
      name: '홍길동',
      email: 'hong@example.com',
      preferences: { theme: 'dark', language: 'ko' }
    };

    // when
    const result = formatUserProfile(rawUser);

    // then - 복잡한 객체도 inline snapshot으로 처리
    expect(result).toMatchInlineSnapshot(`
      {
        "displayName": "홍길동",
        "email": "hong@example.com",
        "id": 123,
        "settings": {
          "language": "ko",
          "theme": "dark",
        },
      }
    `);
  });

  test('사용자 활동 목록을 생성한다', () => {
    // given
    const activities = generateUserActivities('user123');

    // when & then - 배열도 inline snapshot으로 처리
    expect(activities).toMatchInlineSnapshot(`
      [
        {
          "action": "login",
          "timestamp": "2024-01-01T09:00:00Z",
          "userId": "user123",
        },
        {
          "action": "profile_update",
          "timestamp": "2024-01-01T10:30:00Z",
          "userId": "user123",
        },
      ]
    `);
  });
});
```

#### Inline Snapshot을 사용하는 이유

1. **리팩토링 편의성**: 코드 변경 시 테스트 러너의 `u`(update) 기능으로 테스트를 쉽게 업데이트 가능
2. **자동화된 업데이트**: 함수 리턴값이 변경되었을 때 수동으로 기댓값을 수정할 필요 없음
3. **정확성**: 복잡한 객체 구조를 수동으로 작성할 때 발생할 수 있는 실수 방지

#### 아무 생각 없이 update를 눌러서 잘못된 테스트가 통과되지 않을까?

1. **코드 리뷰 과정**: 모든 테스트 변경사항은 코드 리뷰를 거치며, 리뷰어가 snapshot 변경사항을 검토
2. **명시적인 Diff**: Git diff에서 snapshot 변경사항이 명확히 드러나므로 의도하지 않은 업데이트를 쉽게 발견
3. **실제 경험**: 지금까지 이런 방식으로 인한 큰 문제가 발생하지 않았음
4. **트레이드오프 선택**: 실수 가능성 vs 편의성의 트레이드오프에서, 경험상 편의성을 선택하는 것이 더 효율적

### 기본 Matcher (원시 타입용)

```typescript
// 원시 타입 비교 (===)
expect(result).toBe(expectedValue);

// truthy/falsy 검증
expect(result).toBeTruthy();
expect(result).toBeFalsy();

// 정의 여부 검증
expect(result).toBeDefined();
expect(result).toBeUndefined();
expect(result).toBeNull();

// 에러 발생 검증
expect(() => functionCall()).toThrow();
expect(() => functionCall()).toThrow('특정 에러 메시지');
```

### 함수 Mock Matcher

```typescript
// 호출 여부 검증
expect(mockFunction).toHaveBeenCalled();
expect(mockFunction).not.toHaveBeenCalled();

// 호출 횟수 검증
expect(mockFunction).toHaveBeenCalledTimes(2);

// 호출 인자 검증
expect(mockFunction).toHaveBeenCalledWith(expectedArg1, expectedArg2);
expect(mockFunction).toHaveBeenLastCalledWith(expectedArg);
```

## 테스트 데이터 관리

### Factory 패턴 사용

테스트에서 사용하는 모든 Mock Data는 `factory.ts` 파일을 통해 생성해야 합니다.

```typescript
// src/utils/user.factory.ts
import { Sync } from 'factory.ts';

export const userFactory = Sync.makeFactory<User>(() => ({
  id: 'user123',
  name: '홍길동',
  email: 'hong@example.com',
  status: 'active',
  createdAt: '1704067200000', // 2024-01-01
}));

// 특정 상태별 Mock 데이터 배열
export const mockUserData: User[] = [
  userFactory.build(), // 기본 사용자
  userFactory.build({
    status: 'inactive' // 비활성 사용자
  }),
  userFactory.build({
    membershipLevel: 'VIP',
    discountRate: 0.2 // VIP 사용자
  }),
];
```

### 변경 의도 명시적 표현

데이터에 따라 결과가 달라지는 테스트의 경우, factory 함수 사용 시 변경되는 값을 명시적으로 표기합니다.

```typescript
describe('calculateMembershipBenefit', () => {
  test('VIP 회원은 20% 할인을 받는다', () => {
    // given - VIP 등급과 할인율을 명시적으로 설정
    const vipUser = userFactory.build({
      membershipLevel: 'VIP', // 테스트 포인트: VIP 등급
      discountRate: 0.2       // 테스트 포인트: 20% 할인율
    });
    const orderAmount = 10000;

    // when
    const result = calculateMembershipBenefit(vipUser, orderAmount);

    // then
    expect(result.discount).toBe(2000); // 20% 할인 적용
    expect(result.finalAmount).toBe(8000);
  });

  test('일반 회원은 할인을 받지 않는다', () => {
    // given - 일반 회원 등급을 명시적으로 설정
    const normalUser = userFactory.build({
      membershipLevel: 'NORMAL', // 테스트 포인트: 일반 등급
      discountRate: 0            // 테스트 포인트: 할인 없음
    });
    const orderAmount = 10000;

    // when
    const result = calculateMembershipBenefit(normalUser, orderAmount);

    // then
    expect(result.discount).toBe(0);
    expect(result.finalAmount).toBe(10000);
  });

  test('비활성 사용자는 혜택을 받을 수 없다', () => {
    // given - 비활성 상태를 명시적으로 설정
    const inactiveUser = userFactory.build({
      status: 'inactive',        // 테스트 포인트: 비활성 상태
      membershipLevel: 'VIP'     // VIP지만 비활성 상태
    });
    const orderAmount = 10000;

    // when & then
    expect(() => calculateMembershipBenefit(inactiveUser, orderAmount))
      .toThrow('비활성 사용자는 혜택을 받을 수 없습니다');
  });
});
```

### API Mock 데이터 관리

API 관련 mock 데이터는 `data-access` 레이어에서 선언하고 import하여 사용합니다.

```typescript
// libs/data-access/loancompare/v1/src/apis/get-alimi-predicted-credit-interest-rate-decrease/get-alimi-predicted-credit-interest-rate-decrease.mock.ts
import { Sync } from 'factory.ts';
import { GetAlimiPredictedCreditInterestRateDecreaseResponse } from '@banksalad/idl/web/apis/v1/loancompare/alimi';

export const getAlimiPredictedCreditInterestRateDecreaseResponseFactory =
  Sync.makeFactory<GetAlimiPredictedCreditInterestRateDecreaseResponse>(() => ({
    predictedInterestRate2f: '3.2',
    predictedDateMs: '1704067200000', // 2024-01-01
  }));

export const mockGetAlimiPredictedCreditInterestRateDecreaseData: GetAlimiPredictedCreditInterestRateDecreaseResponse[] =
  [
    getAlimiPredictedCreditInterestRateDecreaseResponseFactory.build(),
    getAlimiPredictedCreditInterestRateDecreaseResponseFactory.build({
      predictedInterestRate2f: undefined, // 금리 하락이 예상되지 않는 경우
      predictedDateMs: undefined,
    }),
  ];

```

### 테스트 코드에서 Factory 사용 예시

데이터에 따라 결과가 달라지는 테스트에서 Factory를 사용할 때, 변경되는 값을 명시적으로 표기합니다.

```typescript
describe(determineLoanAlimiRateResultType.name, () => {
  test('최근 결과가 없는 경우 empty를 반환한다', () => {
    // given
    const predictedResponse = getAlimiPredictedCreditInterestRateDecreaseResponseFactory.build({
      predictedInterestRate2f: undefined, // 테스트 포인트: 예측 금리 없음
      predictedDateMs: undefined,         // 테스트 포인트: 예측 날짜 없음
    });
    const recentResponse = listAlimiRecentPrequalificationApplicationResultsResponseFactory.build({
      alimiPrequalificationApplicationResults: [], // 테스트 포인트: 빈 결과 배열
    });

    // when
    const result = determineLoanAlimiRateResultType(predictedResponse, recentResponse);

    // then
    expect(result).toBe('empty');
  });

  test('최근 결과가 있는 경우 recent를 반환한다', () => {
    // given
    const predictedResponse = getAlimiPredictedCreditInterestRateDecreaseResponseFactory.build({
      predictedInterestRate2f: '3.5',
      predictedDateMs: '1704067200000',
    });
    const recentResponse = listAlimiRecentPrequalificationApplicationResultsResponseFactory.build({
      alimiPrequalificationApplicationResults: [
        {
          prequalificationApplicationId: '123', // 테스트 포인트: 최근 결과 존재
          lowestInterestRate2f: '3.2',
          resultDateMs: '1704067200000',
        },
      ],
    });

    // when
    const result = determineLoanAlimiRateResultType(predictedResponse, recentResponse);

    // then
    expect(result).toBe('recent');
  });
});
```

### Factory 사용 시 주의사항

1. **기본값 정의**: Factory는 항상 유효한 기본값을 제공해야 함
2. **Override 활용**: 테스트별로 필요한 값만 override하여 의도를 명확히 표현
3. **재사용성**: 여러 테스트에서 공통으로 사용할 수 있도록 설계
4. **타입 안전성**: TypeScript 타입을 활용하여 컴파일 타임에 오류 방지
