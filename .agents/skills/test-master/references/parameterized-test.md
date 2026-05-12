---
title: "3. Parameterized Test"
description: "중복 테스트를 줄이고 가독성을 높이는 parameterized 테스트 테이블 패턴을 예제로 안내합니다."
type: pattern
tags: [Testing]
order: 3
---

# 3. Parameterized Test

여러 입력값에 대해 동일한 로직을 테스트할 때 사용하는 parameterized 테스트 패턴을 다룹니다.

## 문제점과 해결책

### 1. 중복 코드 문제

**문제점**: 비슷한 테스트 코드가 반복되어 코드량이 증가하고 일관성 유지가 어려움

```typescript
// ❌ 중복된 테스트 코드
describe('validateEmail', () => {
  it('유효한 이메일을 검증한다', () => {
    const result = validateEmail('user@example.com');
    expect(result.isValid).toBe(true);
  });
  
  it('유효하지 않은 이메일을 검증한다', () => {
    const result = validateEmail('invalid-email');
    expect(result.isValid).toBe(false);
  });
  
  it('빈 문자열을 검증한다', () => {
    const result = validateEmail('');
    expect(result.isValid).toBe(false);
  });
  
  it('도메인이 없는 이메일을 검증한다', () => {
    const result = validateEmail('user@');
    expect(result.isValid).toBe(false);
  });
});
```

**해결책**: Parameterized 테스트로 중복 코드 제거

```typescript
// ✅ Parameterized 테스트로 중복 제거
describe('validateEmail', () => {
  it.each`
    email                    | expected
    ${'user@example.com'}    | ${true}
    ${'invalid-email'}       | ${false}
    ${''}                    | ${false}
    ${'user@'}               | ${false}
  `('$email 이메일이 $expected 결과를 반환한다', ({ email, expected }) => {
    const result = validateEmail(email);
    expect(result.isValid).toBe(expected);
  });
});
```

### 2. 유지보수 어려움 문제

**문제점**: 새로운 케이스 추가 시 모든 테스트를 수정해야 하고, 로직 변경 시 모든 테스트를 개별적으로 업데이트해야 함

```typescript
// ❌ 새로운 케이스 추가 시 또 다른 it 블록 생성 필요
describe('formatDateAtMs', () => {
  it('5월 20일을 올바르게 포맷팅한다', () => {
    const result = formatDateAtMs('1621500612000', 'M월 d일');
    expect(result).toEqual('5월 20일');
  });
  
  it('금요일을 올바르게 포맷팅한다', () => {
    const result = formatDateAtMs('1640952000000', 'eeee');
    expect(result).toEqual('금요일');
  });
  
  // 새로운 케이스 추가 시 또 다른 it 블록 생성 필요
  it('2024년 1월 1일을 올바르게 포맷팅한다', () => {
    const result = formatDateAtMs('1704067200000', 'yyyy년 M월 d일');
    expect(result).toEqual('2024년 1월 1일');
  });
});
```

**해결책**: 테이블에만 새로운 케이스 추가하여 유지보수성 향상

```typescript
// ✅ 새로운 케이스는 테이블에만 추가
describe('formatDateAtMs', () => {
  it.each`
    date                                       | ms                 | format           | expected
    ${'Thursday, May 20, 2021 8:50:12 AM'}     | ${'1621500612000'} | ${'M월 d일'}     | ${'5월 20일'}
    ${'Friday, December 31, 2021 12:00:00 PM'} | ${'1640952000000'} | ${'eeee'}        | ${'금요일'}
    ${'Monday, January 1, 2024 9:00:00 AM'}    | ${'1704067200000'} | ${'yyyy년 M월 d일'} | ${'2024년 1월 1일'}
  `('when $ms ($date), $format given, returns $expected', ({ ms, format, expected }) => {
    const result = formatDateAtMs(ms, format);
    expect(result).toEqual(expected);
  });
});
```

### 3. 가독성 저하 문제

**문제점**: 테스트 의도가 반복 코드에 묻혀서 무엇을 검증하려는지 파악하기 어려움

```typescript
// ❌ 테스트 의도가 불분명한 반복 코드
describe('calculateTax', () => {
  it('소득 100만원에 세율 10%를 적용한다', () => {
    const result = calculateTax(1000000, 0.1);
    expect(result.taxAmount).toBe(100000);
    expect(result.netIncome).toBe(900000);
  });
  
  it('소득 500만원에 세율 20%를 적용한다', () => {
    const result = calculateTax(5000000, 0.2);
    expect(result.taxAmount).toBe(1000000);
    expect(result.netIncome).toBe(4000000);
  });
  
  it('소득 1000만원에 세율 30%를 적용한다', () => {
    const result = calculateTax(10000000, 0.3);
    expect(result.taxAmount).toBe(3000000);
    expect(result.netIncome).toBe(7000000);
  });
});
```

**해결책**: 구조화된 테이블로 테스트 의도가 명확히 드러남

```typescript
// ✅ 테이블 구조로 테스트 의도가 명확
describe('calculateTax', () => {
  it.each`
    income      | taxRate | expectedTax | expectedNetIncome
    ${1000000}  | ${0.1}  | ${100000}   | ${900000}
    ${5000000}  | ${0.2}  | ${1000000}  | ${4000000}
    ${10000000} | ${0.3}  | ${3000000}  | ${7000000}
  `('소득 $income에 세율 $taxRate를 적용하면 세금 $expectedTax, 순소득 $expectedNetIncome이다', 
    ({ income, taxRate, expectedTax, expectedNetIncome }) => {
    const result = calculateTax(income, taxRate);
    expect(result.taxAmount).toBe(expectedTax);
    expect(result.netIncome).toBe(expectedNetIncome);
  });
});
```

### 4. 실수 가능성 문제

**문제점**: 복사-붙여넣기로 인한 실수와 일관성 없는 테스트 코드

```typescript
// ❌ 복사-붙여넣기로 인한 실수 가능성
describe('parseAmount', () => {
  it('유효한 숫자를 파싱한다', () => {
    expect(() => parseAmount('abc')).toThrow('Invalid number format');
  });
  
  it('음수를 파싱한다', () => {
    expect(() => parseAmount('-1000')).toThrow('Amount cannot be negative');
  });
  
  it('0을 파싱한다', () => {
    expect(() => parseAmount('0')).toThrow('Amount must be greater than 0');
  });
  
  // 복사-붙여넣기로 인한 실수: expect 함수명이 다름
  it('빈 문자열을 파싱한다', () => {
    expect(() => parseAmount('')).toThrow('Amount is required');
  });
});
```

**해결책**: 구조화된 테스트 데이터로 실수 최소화

```typescript
// ✅ 구조화된 데이터로 실수 방지
describe('parseAmount', () => {
  it.each`
    input        | expectedError
    ${'abc'}     | ${'Invalid number format'}
    ${'-1000'}   | ${'Amount cannot be negative'}
    ${'0'}       | ${'Amount must be greater than 0'}
    ${''}        | ${'Amount is required'}
  `('$input 입력 시 "$expectedError" 에러가 발생한다', ({ input, expectedError }) => {
    expect(() => parseAmount(input)).toThrow(expectedError);
  });
});
```

### 5. 비개발자와의 소통 어려움 문제

**문제점**: 기획자나 타 직군이 테스트 코드를 이해하기 어려워 비즈니스 로직 검증이 어려움

```typescript
// ❌ 비개발자가 이해하기 어려운 테스트 코드
describe('calculateDiscount', () => {
  it('VIP 고객에게 할인을 적용한다', () => {
    const customer = customerFactory.build({ type: 'VIP', totalSpent: 1000000 });
    const result = calculateDiscount(customer);
    expect(result.discountRate).toBe(0.2);
    expect(result.finalAmount).toBe(800000);
  });
  
  it('일반 고객에게 할인을 적용한다', () => {
    const customer = customerFactory.build({ type: 'NORMAL', totalSpent: 500000 });
    const result = calculateDiscount(customer);
    expect(result.discountRate).toBe(0.1);
    expect(result.finalAmount).toBe(450000);
  });
});
// 기획자: "어떤 조건에서 어떤 할인이 적용되는지 한눈에 파악하기 어려움"
```

**해결책**: Parameterized 테스트로 비즈니스 로직을 명확히 표현

```typescript
// ✅ 비개발자도 쉽게 이해할 수 있는 테스트 코드
describe('calculateDiscount', () => {
  it.each`
    customerType | totalSpent | expectedDiscount | expectedFinalAmount | description
    ${'VIP'}     | ${1000000} | ${0.2}           | ${800000}           | ${'VIP 고객 100만원 구매 시 20% 할인'}
    ${'NORMAL'}  | ${500000}  | ${0.1}           | ${450000}           | ${'일반 고객 50만원 구매 시 10% 할인'}
    ${'NEW'}     | ${200000}  | ${0}             | ${200000}           | ${'신규 고객 20만원 구매 시 할인 없음'}
  `('$description', ({ customerType, totalSpent, expectedDiscount, expectedFinalAmount }) => {
    const customer = customerFactory.build({ type: customerType, totalSpent });
    const result = calculateDiscount(customer);
    
    expect(result.discountRate).toBe(expectedDiscount);
    expect(result.finalAmount).toBe(expectedFinalAmount);
  });
});
// 기획자: "테이블만 봐도 어떤 고객이 어떤 조건에서 어떤 할인을 받는지 명확히 파악 가능"
```

## 테이블 vs 배열 선택 가이드

### 테이블 템플릿 문자열 사용 케이스

#### 1. 단순한 입력-출력 매핑

**적합한 경우**: 입력값과 기댓값이 단순하고 명확한 1:1 매핑

```typescript
// ✅ 테이블이 적합한 경우: 단순한 유효성 검사
describe('validateEmail', () => {
  it.each`
    email                    | expected
    ${'user@example.com'}    | ${true}
    ${'invalid-email'}       | ${false}
    ${''}                    | ${false}
    ${'user@'}               | ${false}
  `('$email 이메일이 $expected 결과를 반환한다', ({ email, expected }) => {
    const result = validateEmail(email);
    expect(result.isValid).toBe(expected);
  });
});
```

**장점**:
- 가독성이 좋음 (테이블 형태로 한눈에 파악 가능)
- 새로운 케이스 추가가 쉬움
- 테스트 의도가 명확함

#### 2. 날짜/시간 포맷팅 테스트

```typescript
// ✅ 테이블이 적합한 경우: 포맷팅 패턴 테스트
describe('formatDateAtMs', () => {
  it.each`
    date                                       | ms                 | format           | expected
    ${'Thursday, May 20, 2021 8:50:12 AM'}     | ${'1621500612000'} | ${'M월 d일'}     | ${'5월 20일'}
    ${'Friday, December 31, 2021 12:00:00 PM'} | ${'1640952000000'} | ${'eeee'}        | ${'금요일'}
    ${'Monday, January 1, 2024 9:00:00 AM'}    | ${'1704067200000'} | ${'yyyy년 M월 d일'} | ${'2024년 1월 1일'}
  `('when $ms ($date), $format given, returns $expected', ({ ms, format, expected }) => {
    const result = formatDateAtMs(ms, format);
    expect(result).toEqual(expected);
  });
});
```

### 배열 기반 사용 케이스

#### 1. 복잡한 객체 구조

**적합한 경우**: 복잡한 객체나 중첩된 데이터 구조

```typescript
// ✅ 배열이 적합한 경우: 복잡한 객체 구조
describe('calculateLoanEligibility', () => {
  it.each([
    {
      customer: { 
        creditScore: 800, 
        income: 50000000, 
        employmentYears: 5,
        hasDefaultHistory: false
      },
      expected: { 
        eligible: true, 
        maxAmount: 100000000, 
        reason: null,
        interestRate: 3.5
      }
    },
    {
      customer: { 
        creditScore: 400, 
        income: 20000000, 
        employmentYears: 1,
        hasDefaultHistory: true
      },
      expected: { 
        eligible: false, 
        maxAmount: 0, 
        reason: 'LOW_CREDIT_SCORE',
        interestRate: null
      }
    }
  ])('고객 정보로 대출 자격을 판단한다', ({ customer, expected }) => {
    const customerData = customerFactory.build(customer);
    const result = calculateLoanEligibility(customerData);
    
    expect(result.eligible).toBe(expected.eligible);
    expect(result.maxAmount).toBe(expected.maxAmount);
    expect(result.reason).toBe(expected.reason);
    expect(result.interestRate).toBe(expected.interestRate);
  });
});
```

**장점**:
- 복잡한 객체 구조 표현 가능
- TypeScript 타입 추론 지원
- 객체 구조 변경 시 컴파일 타임 에러 감지

#### 2. 조건부 로직이 필요한 경우

```typescript
// ✅ 배열이 적합한 경우: 조건부 검증 로직
describe('processUserOrder', () => {
  it.each([
    {
      userType: 'VIP',
      orderAmount: 100000,
      expectedDiscount: 0.2,
      expectedStatus: 'APPROVED',
      shouldValidateCredit: false // VIP는 신용검증 불필요
    },
    {
      userType: 'NEW',
      orderAmount: 100000,
      expectedDiscount: 0,
      expectedStatus: 'PENDING',
      shouldValidateCredit: true // 신규 사용자는 신용검증 필요
    }
  ])('$userType 고객의 주문을 처리한다', ({ userType, orderAmount, expectedDiscount, expectedStatus, shouldValidateCredit }) => {
    const user = userFactory.build({ type: userType });
    const order = orderFactory.build({ amount: orderAmount });
    
    const result = processUserOrder(user, order);
    
    expect(result.discountRate).toBe(expectedDiscount);
    expect(result.status).toBe(expectedStatus);
    
    // 조건부 검증
    if (shouldValidateCredit) {
      expect(result.creditCheckRequired).toBe(true);
    } else {
      expect(result.creditCheckRequired).toBe(false);
    }
  });
});
```

### 선택 기준

#### 테이블 템플릿 문자열 선택 시기
- **단순한 데이터**: 입력값과 기댓값이 단순한 타입
- **명확한 매핑**: 1:1 관계가 명확한 경우
- **가독성 우선**: 테스트 데이터를 한눈에 파악하고 싶은 경우
- **빠른 추가**: 새로운 케이스를 빠르게 추가하고 싶은 경우
- **영문 데이터**: 한글이 포함되지 않은 데이터 (한글은 정렬 문제로 가독성 저하)

#### 배열 기반 선택 시기
- **복잡한 객체**: 중첩된 객체나 복잡한 데이터 구조
- **타입 안전성**: TypeScript 타입 체킹이 중요한 경우
- **조건부 로직**: 테스트 케이스별로 다른 검증 로직이 필요한 경우
- **재사용성**: 테스트 데이터를 다른 곳에서도 재사용하고 싶은 경우
- **한글 데이터**: 한글이 포함된 데이터 (테이블 정렬 문제로 가독성 저하)

### 한글 데이터 처리 주의사항

#### 테이블에서 한글 정렬 문제

```typescript
// ❌ 한글이 포함된 테이블 - 정렬이 깨져서 가독성 저하
describe('validateKoreanName', () => {
  it.each`
    name        | expected
    ${'홍길동'} | ${true}
    ${'김철수'} | ${true}
    ${'123'}    | ${false}
    ${'abc'}    | ${false}
    ${'이영희'} | ${true}
  `('$name 이름이 $expected 결과를 반환한다', ({ name, expected }) => {
    const result = validateKoreanName(name);
    expect(result.isValid).toBe(expected);
  });
});
```

#### 배열로 해결

```typescript
// ✅ 한글 데이터는 배열로 처리하여 가독성 확보
describe('validateKoreanName', () => {
  it.each([
    { name: '홍길동', expected: true, description: '유효한 한글 이름' },
    { name: '김철수', expected: true, description: '유효한 한글 이름' },
    { name: '이영희', expected: true, description: '유효한 한글 이름' },
    { name: '123', expected: false, description: '숫자만 포함' },
    { name: 'abc', expected: false, description: '영문만 포함' }
  ])('$description: $name', ({ name, expected }) => {
    const result = validateKoreanName(name);
    expect(result.isValid).toBe(expected);
  });
});
```

### 하이브리드 접근법

#### 복잡한 케이스에서 테이블 활용

```typescript
// ✅ 하이브리드: 기본 데이터는 테이블, 복잡한 로직은 배열
describe('calculateTax', () => {
  // 기본 세율 계산은 테이블로
  it.each`
    income      | taxRate | expectedTax
    ${1000000}  | ${0.1}  | ${100000}
    ${5000000}  | ${0.2}  | ${1000000}
    ${10000000} | ${0.3}  | ${3000000}
  `('소득 $income에 세율 $taxRate를 적용하면 세금 $expectedTax이다', 
    ({ income, taxRate, expectedTax }) => {
    const result = calculateTax(income, taxRate);
    expect(result.taxAmount).toBe(expectedTax);
  });
  
  // 복잡한 공제 계산은 배열로
  it.each([
    {
      income: 5000000,
      deductions: [
        { type: 'INSURANCE', amount: 500000 },
        { type: 'RETIREMENT', amount: 300000 }
      ],
      expectedNetTax: 840000 // (5000000 - 800000) * 0.2
    },
    {
      income: 10000000,
      deductions: [
        { type: 'CHARITY', amount: 1000000 },
        { type: 'EDUCATION', amount: 500000 }
      ],
      expectedNetTax: 2550000 // (10000000 - 1500000) * 0.3
    }
  ])('공제를 적용한 세금을 계산한다', ({ income, deductions, expectedNetTax }) => {
    const result = calculateTaxWithDeductions(income, deductions);
    expect(result.netTaxAmount).toBe(expectedNetTax);
  });
});
```
