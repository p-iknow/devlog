---
title: "0. Unit Test Standard"
description: "테스트 가능한 함수 설계와 시간 의존성 분리 등 안정적인 단위 테스트를 위한 핵심 원칙을 정리합니다."
type: reference
tags: [Testing, BestPractice]
order: 0
---

# 0. Unit Test Standard

## 1. 테스트 코드 작성 이전에 함수 자체를 testable하게 만들고 테스트 코드를 작성한다

**원칙의 의도**: 테스트하기 어려운 함수는 좋은 테스트를 작성할 수 없다. 테스트 작성 전에 함수 자체를 testable하게 설계하여 멱등성을 보장하고 신뢰할 수 있는 테스트를 만든다.

**해결하려는 문제**:
- 실행 시점에 따라 테스트 결과가 달라지는 문제
- 외부 의존성(API, 시간, 브라우저 API)으로 인한 테스트 불안정성
- 사이드이펙트와 비즈니스 로직이 섞여 있어 핵심 로직을 테스트하기 어려운 문제
- CI/CD 환경과 로컬 환경에서 테스트 결과가 다른 문제

### 시간 의존성 분리

#### ❌ Do Not
```typescript
// 시간 의존성이 있어 테스트하기 어려운 함수
const formatOrderTime = (orderData: OrderData) => {
  return {
    ...orderData,
    createdAt: new Date().toISOString(), // 실행 시점마다 다른 결과
    displayTime: new Date().toLocaleString('ko-KR'), // 타임존에 따라 다른 결과
    businessDay: isBusinessDay(new Date()) // 실행 날짜에 따라 다른 결과
  };
};

// 테스트가 실행 환경과 시점에 따라 실패
describe('formatOrderTime', () => {
  it('주문 시간을 포맷팅한다', () => {
    const order = { id: '1', amount: 1000 };
    const result = formatOrderTime(order);
    
    // 로컬(KST): 2024-01-01 09:00:00 통과
    // CI(UTC): 2024-01-01 00:00:00 실패
    expect(result.displayTime).toContain('2024-01-01 09:00:00');
    
    // 평일 실행: true, 주말 실행: false
    expect(result.businessDay).toBe(true);
  });
});
```

#### ✅ Do
```typescript
// 시간을 매개변수로 받아 testable하게 만든 함수
const formatOrderTime = (orderData: OrderData, currentTime: Date) => {
  return {
    ...orderData,
    createdAt: currentTime.toISOString(),
    displayTime: currentTime.toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }),
    businessDay: isBusinessDay(currentTime)
  };
};

// 테스트가 환경과 시점에 무관하게 안정적
describe(formatOrderTime.name, () => {
  it('주문 시간을 한국 시간으로 포맷팅한다', () => {
    // given
    const order = { id: '1', amount: 1000 };
    const fixedTime = new Date('2024-01-01T00:00:00.000Z'); // 고정된 UTC 시간

    // when
    const result = formatOrderTime(order, fixedTime);

    // then
    expect(result.createdAt).toBe('2024-01-01T00:00:00.000Z');
    expect(result.displayTime).toBe('2024. 1. 1. 오전 9:00:00'); // 항상 일정한 KST 결과
    expect(result.businessDay).toBe(true); // 2024-01-01은 월요일(평일)
  });
});
```

### API 호출과 비즈니스 로직 분리

#### ❌ Do Not
```typescript
// API 호출과 비즈니스 로직이 섞여있어 테스트하기 어려운 함수
const processUserData = async (userId: string) => {
  const userData = await fetchUser(userId); // API 호출 - 외부 의존성
  const formattedName = `${userData.lastName}${userData.firstName}`; // 비즈니스 로직
  const age = new Date().getFullYear() - new Date(userData.birthDate).getFullYear(); // 시간 의존성
  
  return {
    displayName: formattedName,
    age: age,
    createdAt: new Date().toISOString() // 런타임 의존성
  };
};
```

#### ✅ Do
```typescript
// 비즈니스 로직만 담은 순수 함수 (테스트 가능)
const formatUserData = (userData: UserData, currentDate: string) => {
  return {
    displayName: `${userData.lastName}${userData.firstName}`,
    age: new Date(currentDate).getFullYear() - new Date(userData.birthDate).getFullYear(),
    isAdult: new Date(currentDate).getFullYear() - new Date(userData.birthDate).getFullYear() >= 20
  };
};

// API 호출 로직은 별도 분리 (integration test에서 테스트)
const processUserData = async (userId: string) => {
  const userData = await fetchUser(userId); // API 호출
  const currentDate = new Date().toISOString(); // 시간 의존성
  return formatUserData(userData, currentDate); // 순수 함수 호출
};
```

### 런타임 의존성과 비즈니스 로직 분리

#### ❌ Do Not
```typescript
// 런타임(브라우저) 의존성이 있어 테스트하기 어려운 함수
const saveToLocalStorage = (key: string, data: any) => {
  const serialized = JSON.stringify(data); // 비즈니스 로직
  localStorage.setItem(key, serialized); // 브라우저 API 의존성
  return serialized;
};
```

#### ✅ Do
```typescript
// 비즈니스 로직만 담은 순수 함수 (테스트 가능)
const serializeData = (data: any) => {
  return JSON.stringify(data);
};

// 런타임 의존성은 별도 분리
const saveToLocalStorage = (key: string, data: any) => {
  const serialized = serializeData(data); // 순수 함수 호출
  localStorage.setItem(key, serialized); // 런타임 의존성
  return serialized;
};
```

### React Query select를 활용한 데이터 변환 로직 분리

#### ❌ Do Not
```typescript
// React Query를 사용하지만 select 없이 컴포넌트에서 데이터 변환하는 경우
const useUserProfile = (userId: string) => {
  return useSuspenseQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    // select 옵션 없이 raw data 반환
  });
};

const UserProfileComponent = ({ userId }: { userId: string }) => {
  const { data: userData } = useUserProfile(userId);
  
  // 비즈니스 로직이 컴포넌트에 섞여있어 테스트하기 어려움
  const displayName = `${userData.lastName}${userData.firstName}`;
  const age = new Date().getFullYear() - new Date(userData.birthDate).getFullYear();
  const isAdult = age >= 20;
  
  return (
    <div>
      <h1>{displayName}</h1>
      <p>나이: {age}</p>
      <p>{isAdult ? '성인' : '미성년자'}</p>
    </div>
  );
};
```

#### ✅ Do
```typescript
// React Query select를 활용한 데이터 변환 로직 분리
const selectUserDisplayData = (apiResponse: UserApiResponse) => {
  return {
    displayName: `${apiResponse.lastName}${apiResponse.firstName}`,
    age: calculateAge(apiResponse.birthDate, '2024-01-01'), // 고정된 기준일 사용
    isAdult: calculateAge(apiResponse.birthDate, '2024-01-01') >= 20
  };
};

// React Query에서 사용
const useUserProfile = (userId: string) => {
  return useSuspenseQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    select: selectUserDisplayData // 비즈니스 로직만 분리하여 테스트 가능
  });
};
```

### 전역 상태 의존성 제거

#### ❌ Do Not
```typescript
// 전역 상태에 의존하는 함수
let globalCounter = 0;
const incrementCounter = () => {
  globalCounter++; // 전역 상태 변경 - 테스트 실행 순서에 의존
  return globalCounter;
};
```

#### ✅ Do
```typescript
// 상태를 매개변수로 받고 새로운 상태를 반환하는 순수 함수
const incrementCounter = (currentValue: number) => {
  return currentValue + 1;
};
```

## 2. 테스트 코드를 통해 테스트 대상 코드에 대한 유즈케이스를 명확히 이해할 수 있다

**원칙의 의도**: 테스트 코드가 함수의 사용 설명서 역할을 하도록 한다. 테스트만 읽어도 함수의 모든 사용 사례와 동작 방식을 이해할 수 있게 만든다.

**해결하려는 문제**:
- 함수의 사용법을 파악하기 위해 구현 코드를 일일이 읽어야 하는 문제
- 함수의 예외 상황이나 경계 조건을 놓치기 쉬운 문제
- 새로운 개발자가 기존 코드의 동작 방식을 이해하기 어려운 문제
- 테스트명이 모호하여 실제 동작을 예측할 수 없는 문제

### 모호한 테스트명 문제

#### ❌ Do Not
```typescript
// 모호한 테스트명으로 Use Case를 파악할 수 없음
describe('calculateLoanRate', () => {
  it('금리를 계산한다', () => {
    const result = calculateLoanRate(mockCustomer, 1000000);
    expect(result).toBe(50000);
  });
});
// 이 테스트만으로는 어떤 고객이 어떤 금리를 받는지 알 수 없음
```

#### ✅ Do
```typescript
// 구체적인 Use Case가 명확한 테스트명 사용
describe(calculateLoanRate.name, () => {
  it('일반 고객의 기본 금리 5%를 계산한다', () => {
    // given
    const customer = customerFactory.build({ grade: 'NORMAL', creditScore: 700 });
    
    // when
    const result = calculateLoanRate(customer, 1000000);
    
    // then
    expect(result).toBe(50000); // 5% 금리
  });
  
  it('VIP 고객에게 우대 금리 3%를 적용한다', () => {
    // given
    const vipCustomer = customerFactory.build({ grade: 'VIP', creditScore: 800 });
    
    // when
    const result = calculateLoanRate(vipCustomer, 1000000);
    
    // then
    expect(result).toBe(30000); // 3% 금리
  });
});
```

### 예외 상황 테스트 누락 문제

#### ❌ Do Not
```typescript
// 예외 상황이나 경계 조건이 명시되지 않음
describe('processPayment', () => {
  it('결제를 처리한다', () => {
    const result = processPayment(paymentData);
    expect(result.success).toBe(true);
  });
});
// 실패 케이스나 특별한 조건들이 테스트에서 드러나지 않음
```

#### ✅ Do
```typescript
// 예외 상황과 경계 조건을 명시적으로 테스트
describe(processPayment.name, () => {
  it('유효한 결제 정보로 결제를 성공한다', () => {
    // given
    const validPaymentData = paymentFactory.build({ 
      amount: 10000, 
      cardNumber: '1234-5678-9012-3456' 
    });
    
    // when
    const result = processPayment(validPaymentData);
    
    // then
    expect(result.success).toBe(true);
    expect(result.transactionId).toBeDefined();
  });
  
  it('잔액 부족 시 결제를 실패한다', () => {
    // given
    const insufficientPaymentData = paymentFactory.build({ 
      amount: 1000000, // 잔액보다 큰 금액
      cardNumber: '1234-5678-9012-3456' 
    });
    
    // when
    const result = processPayment(insufficientPaymentData);
    
    // then
    expect(result.success).toBe(false);
    expect(result.errorCode).toBe('INSUFFICIENT_BALANCE');
  });
});
```

## 3. 효율적인 커버리지

**원칙의 의도**: 테스트는 많다고 좋은 것이 아니다. 최소한의 테스트로 최대한의 신뢰성을 확보하여 유지보수 비용을 줄이고 개발 생산성을 높인다.

**해결하려는 문제**:
- 불필요한 중복 테스트로 인한 유지보수 부담 증가
- 테스트 실행 시간이 길어져 개발 생산성 저하
- 중요하지 않은 테스트가 많아 핵심 로직을 놓치기 쉬운 문제
- 테스트 코드 자체가 버그의 원인이 되는 문제

### 불필요한 중복 테스트 문제

#### ❌ Do Not
```typescript
// 경계값이 아닌 중간값들만 반복 테스트하여 진짜 버그를 놓침
describe('validateAge', () => {
  it('25세는 성인이다', () => { 
    expect(validateAge(25)).toBe('adult'); 
  });
  
  it('30세는 성인이다', () => { 
    expect(validateAge(30)).toBe('adult'); 
  });
  
  it('35세는 성인이다', () => { 
    expect(validateAge(35)).toBe('adult'); 
  });
  
  it('40세는 성인이다', () => { 
    expect(validateAge(40)).toBe('adult'); 
  });
  // 모두 성인 범위 안의 중간값만 테스트, 경계값(20세, 19세)은 테스트 안함
  // 실제 버그는 경계값에서 발생할 가능성이 높음
});
```

#### ✅ Do
```typescript
// 경계값과 핵심 케이스에 집중한 효과적인 테스트
describe(validateAge.name, () => {
  it('정상 성인 나이를 검증한다', () => {
    // given
    const age = 25; // 일반적인 케이스
    
    // when
    const result = validateAge(age);
    
    // then
    expect(result).toBe('adult');
  });
  
  it('성인 경계값(20세)을 올바르게 처리한다', () => {
    // given
    const age = 20; // 경계값 - 성인 최소 나이
    
    // when
    const result = validateAge(age);
    
    // then
    expect(result).toBe('adult');
  });
  
  it('미성년자 경계값(19세)을 올바르게 처리한다', () => {
    // given
    const age = 19; // 경계값 - 미성년자 최대 나이
    
    // when
    const result = validateAge(age);
    
    // then
    expect(result).toBe('minor');
  });
  
  it('유효하지 않은 나이인 경우 에러를 발생시킨다', () => {
    // given
    const invalidAge = -1; // 경계값 - 최소값 미만
    
    // when & then
    expect(() => validateAge(invalidAge)).toThrow(AssertError);
  });
});
```

### 리스트 데이터 테스트에서 불필요한 케이스 반복 문제

#### ❌ Do Not
```typescript
// 리스트 크기별로 의미 없는 테스트 반복
describe('calculateTotalPrice', () => {
  it('1개 상품의 총 금액을 계산한다', () => {
    const items = [{ price: 1000 }];
    expect(calculateTotalPrice(items)).toBe(1000);
  });
  
  it('2개 상품의 총 금액을 계산한다', () => {
    const items = [{ price: 1000 }, { price: 2000 }];
    expect(calculateTotalPrice(items)).toBe(3000);
  });
  
  it('3개 상품의 총 금액을 계산한다', () => {
    const items = [{ price: 1000 }, { price: 2000 }, { price: 3000 }];
    expect(calculateTotalPrice(items)).toBe(6000);
  });
  
  it('4개 상품의 총 금액을 계산한다', () => {
    const items = [{ price: 1000 }, { price: 2000 }, { price: 3000 }, { price: 4000 }];
    expect(calculateTotalPrice(items)).toBe(10000);
  });
  // 3개, 4개, 5개... 테스트는 2개 테스트와 동일한 로직만 반복
});
```

#### ✅ Do
```typescript
// 리스트 처리의 핵심 경계값만 테스트: 0개, 1개, 2개
describe(calculateTotalPrice.name, () => {
  it('빈 배열(0개)인 경우 0을 반환한다', () => {
    // given - 경계값: 빈 배열 처리 로직 검증
    const items = [];
    
    // when
    const result = calculateTotalPrice(items);
    
    // then
    expect(result).toBe(0);
  });
  
  it('단일 상품(1개)의 총 금액을 계산한다', () => {
    // given - 최소 정상 케이스: 기본 로직 작동 확인
    const items = [{ price: 1000 }];
    
    // when
    const result = calculateTotalPrice(items);
    
    // then
    expect(result).toBe(1000);
  });
  
  it('여러 상품(2개)의 총 금액을 계산한다', () => {
    // given - 반복 로직 검증: 루프가 올바르게 작동하는지 확인
    const items = [{ price: 1000 }, { price: 2000 }];
    
    // when
    const result = calculateTotalPrice(items);
    
    // then
    expect(result).toBe(3000);
    // 2개로 반복 로직을 검증했다면, 3개, 4개... N개도 동일하게 작동함
  });
  
  it('잘못된 price 값이 있는 경우 에러를 발생시킨다', () => {
    // given - 예외 케이스
    const items = [{ price: null }];
    
    // when & then
    expect(() => calculateTotalPrice(items)).toThrow(AssertError);
  });
});
```

### 핵심이 아닌 세부 케이스 테스트 문제

#### ❌ Do Not
```typescript
// 핵심이 아닌 세부 케이스들로 시간 낭비
describe('formatUserData', () => {
  it('이름을 포맷팅한다', () => { /* 복잡한 설정 */ });
  it('이름을 대문자로 포맷팅한다', () => { /* 복잡한 설정 */ });
  it('이름을 소문자로 포맷팅한다', () => { /* 복잡한 설정 */ });
  it('이름을 카멜케이스로 포맷팅한다', () => { /* 복잡한 설정 */ });
  // 중요하지 않은 세부 케이스들만 테스트
});
```

#### ✅ Do
```typescript
// 비즈니스 로직의 핵심 분기점에 집중
describe(formatUserData.name, () => {
  it('유효한 사용자 데이터를 포맷팅한다', () => {
  // given
    const userData = userFactory.build({
      firstName: '길동',
      lastName: '홍',
      birthDate: '1990-01-01'
    });
    
    // when
    const result = formatUserData(userData);
    
    // then
    expect(result.displayName).toBe('홍길동');
    expect(result.isAdult).toBe(true);
  });
  
  it('필수 필드가 누락된 경우 에러를 발생시킨다', () => {
    // given
    const invalidUserData = userFactory.build({
      firstName: undefined,
      lastName: '홍'
  });

  // when & then
    expect(() => formatUserData(invalidUserData)).toThrow(AssertError);
  });
});
```

## 4. 유지보수 편의성 및 가독성

**원칙의 의도**: 테스트가 개발을 방해하는 요소가 되지 않도록 한다. 코드 변경 시 관련 없는 테스트가 깨지지 않게 하여 개발자가 테스트를 신뢰하고 유지할 수 있게 만든다.

**해결하려는 문제**:
- 코드 변경 시 관련 없는 테스트까지 깨져서 개발 속도가 저하되는 문제
- 테스트가 자주 깨져 개발자들이 테스트를 무시하거나 삭제하게 되는 문제
- 테스트 코드 수정이 어려워 기능 개발보다 테스트 수정에 더 많은 시간이 소요되는 문제
- 복잡한 의존성으로 인해 테스트 자체가 불안정해지는 문제
- 거대한 객체를 inline snapshot으로 처리하여 테스트 파일이 비대해지고 가독성이 떨어지는 문제
- 테스트 데이터가 무엇을 표현하려는지 파악하기 어려운 문제

### 다른 코드 변경으로 깨지기 쉬운 테스트 문제

#### ❌ Do Not
```typescript
// 다른 코드 변경으로 깨지기 쉬운 테스트
describe('calculateDiscount', () => {
  it('할인을 계산한다', () => {
    const result = calculateDiscount(mockCustomer, 100000);
    expect(result).toEqual({
      discountRate: 0.2,
      finalAmount: 80000,
      appliedAt: getCurrentTime(), // 시간 변경으로 깨짐
      metadata: mockCustomer.fullProfile // 다른 필드 추가로 깨짐
    });
  });
});
```

#### ✅ Do
```typescript
// 핵심 필드만 검증하여 변경에 강한 테스트
describe(calculateDiscount.name, () => {
  it('VIP 고객에게 20% 할인을 적용한다', () => {
    // given
    const customer = customerFactory.build({ grade: 'VIP' });
    const amount = 100000;

    // when
    const result = calculateDiscount(customer, amount);

    // then
    expect(result.discountRate).toBe(0.2);
    expect(result.finalAmount).toBe(80000);
    // 시간이나 메타데이터 같은 부차적인 필드는 검증하지 않음
  });
});
```

### Mock 데이터 가독성 및 유지보수 문제

#### ❌ Do Not
```typescript
// inline으로 큰 데이터를 작성하여 테스트 의도가 불분명하고 유지보수 어려움
describe('calculateLoanEligibility', () => {
  it('대출 자격을 검증한다', () => {
    // given - 어떤 데이터가 중요한지 파악하기 어려움
    const userData = {
      id: '12345',
      name: '홍길동',
      birthDate: '1990-01-01',
      address: {
        city: '서울',
        district: '강남구',
        street: '테헤란로 123',
        zipCode: '12345'
      },
      employment: {
        company: '테스트회사',
        position: '개발자',
        salary: 5000000,
        workPeriod: 36
      },
      creditHistory: {
        score: 750,
        records: [
          { type: 'loan', amount: 1000000, status: 'completed' },
          { type: 'card', amount: 500000, status: 'active' }
        ]
      },
      assets: {
        savings: 10000000,
        realEstate: 50000000
      }
    };
    
    // when
    const result = calculateLoanEligibility(userData);
    
    // then - 테스트 의도를 파악하기 어려움
    expect(result.eligible).toBe(true);
  });
  
  it('저신용자는 대출 자격이 없다', () => {
    // given - 새로운 케이스 추가 시 모든 필드를 다시 작성해야 함
    const userData = {
      id: '12346',  // 일일이 변경
      name: '김철수', // 일일이 변경
      birthDate: '1985-05-15', // 일일이 변경
      address: {
        city: '부산', // 일일이 변경
        district: '해운대구', // 일일이 변경
        street: '해운대로 456', // 일일이 변경
        zipCode: '48000' // 일일이 변경
      },
      employment: {
        company: '다른회사', // 일일이 변경
        position: '디자이너', // 일일이 변경
        salary: 3000000, // 일일이 변경
        workPeriod: 24 // 일일이 변경
      },
      creditHistory: {
        score: 400, // 핵심 변경사항 - 하지만 다른 불필요한 변경들에 묻힘
        records: [
          { type: 'loan', amount: 500000, status: 'overdue' } // 일일이 변경
        ]
      },
      assets: {
        savings: 1000000, // 일일이 변경
        realEstate: 0 // 일일이 변경
      }
    };
    
    // when
    const result = calculateLoanEligibility(userData);
    
    // then
    expect(result.eligible).toBe(false);
  });
});
```

#### ✅ Do
```typescript
// Factory를 사용하여 테스트 의도를 명확히 표현
describe(calculateLoanEligibility.name, () => {
  it('고소득 직장인은 대출 자격이 있다', () => {
    // given - 테스트에 중요한 부분만 명시적으로 표현
    const highIncomeUser = userDataFactory.build({
      employment: employmentFactory.build({
        salary: 8000000, // 고소득 - 테스트 의도가 명확
        workPeriod: 48    // 장기 근무 - 테스트 의도가 명확
      }),
      creditHistory: creditHistoryFactory.build({
        score: 850 // 높은 신용점수 - 테스트 의도가 명확
      })
      // 나머지 필드들은 기본값으로 자동 생성
    });
    
    // when
    const result = calculateLoanEligibility(highIncomeUser);
    
    // then
    expect(result.eligible).toBe(true);
    expect(result.maxAmount).toBe(80000000); // 연봉의 10배
  });
  
  it('저신용자는 대출 자격이 없다', () => {
    // given - 실패 케이스의 핵심 조건만 명시
    const lowCreditUser = userDataFactory.build({
      creditHistory: creditHistoryFactory.build({
        score: 400 // 낮은 신용점수 - 실패 조건이 명확
      })
      // 다른 조건들은 기본값(정상값)으로 설정
    });
    
    // when
    const result = calculateLoanEligibility(lowCreditUser);
    
    // then
    expect(result.eligible).toBe(false);
    expect(result.reason).toBe('LOW_CREDIT_SCORE');
  });
});
```

### Jest Mock과 런타임 의존성으로 자주 깨지는 테스트 문제

#### ❌ Do Not
```typescript
// Jest mock과 toBeCalled 검증으로 자주 깨지는 테스트
describe('trackUserAction', () => {
  beforeEach(() => {
    // window 객체 mock 설정
    global.window = Object.create(window);
    global.window.gtag = jest.fn();
    global.window.localStorage = {
      setItem: jest.fn(),
      getItem: jest.fn()
    };
  });
  
  it('사용자 액션을 추적한다', () => {
    // given
    const action = 'click_button';
    const userId = 'user123';
    
    // when
    trackUserAction(action, userId);
    
    // then - Jest 실행 순서나 다른 테스트의 영향으로 자주 실패
    expect(window.gtag).toHaveBeenCalledTimes(1);
    expect(window.gtag).toHaveBeenCalledWith('event', action, {
      user_id: userId
    });
    expect(window.localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(window.localStorage.setItem).toHaveBeenCalledWith(
      'last_action', 
      JSON.stringify({ action, userId, timestamp: expect.any(Number) })
    );
  });
  
  it('중복 액션은 필터링한다', () => {
    // given
    const action = 'click_button';
    window.localStorage.getItem.mockReturnValue(
      JSON.stringify({ action, timestamp: Date.now() - 1000 })
    );
    
    // when
    trackUserAction(action, 'user123');
    
    // then - 이전 테스트의 mock 호출 횟수와 섞여서 실패
    expect(window.gtag).toHaveBeenCalledTimes(0); // 실제로는 이전 테스트 + 현재 = 1회
    expect(window.localStorage.setItem).not.toHaveBeenCalled(); // mock 상태 초기화 누락으로 실패
  });
});
```

#### ✅ Do
```typescript
// 런타임 의존성을 분리하여 안정적인 테스트
describe(formatTrackingData.name, () => {
  it('추적 데이터를 올바른 형식으로 변환한다', () => {
    // given
    const action = 'click_button';
    const userId = 'user123';
    const timestamp = 1640995200000; // 고정된 시간
    
    // when
    const result = formatTrackingData(action, userId, timestamp);
    
    // then - 순수 함수이므로 안정적
    expect(result).toEqual({
      event: action,
      user_id: userId,
      timestamp: timestamp
    });
  });
  
  it('중복 액션을 필터링해야 하는지 판단한다', () => {
    // given
    const currentAction = 'click_button';
    const currentTime = 1640995200000;
    const lastAction = { action: 'click_button', timestamp: 1640995199000 }; // 1초 전
    
    // when
    const result = shouldFilterDuplicateAction(currentAction, lastAction, currentTime);
    
    // then - 비즈니스 로직만 테스트하므로 안정적
    expect(result).toBe(true); // 1초 이내 중복 액션
  });
  
  it('시간 차이가 충분한 경우 중복 필터링하지 않는다', () => {
      // given
    const currentAction = 'click_button';
    const currentTime = 1640995200000;
    const lastAction = { action: 'click_button', timestamp: 1640995195000 }; // 5초 전

      // when
    const result = shouldFilterDuplicateAction(currentAction, lastAction, currentTime);

      // then
    expect(result).toBe(false); // 5초 차이로 필터링하지 않음
  });
});
```

### 거대한 객체로 인한 테스트 가독성 문제

#### ❌ Do Not
```typescript
// 거대한 객체를 inline snapshot으로 처리하여 가독성이 떨어지는 테스트
describe('generateUserReport', () => {
  it('사용자 리포트를 생성한다', () => {
    // given
    const userData = userDataFactory.build();
    
    // when
    const result = generateUserReport(userData);
    
    // then - 테스트 파일이 비대해지고 무엇을 검증하려는지 불분명
    expect(result).toMatchInlineSnapshot(`
      {
        "user": {
          "id": "12345",
          "name": "홍길동",
          "email": "hong@example.com",
          "birthDate": "1990-01-01",
          "address": {
            "city": "서울",
            "district": "강남구",
            "street": "테헤란로 123",
            "zipCode": "12345",
            "coordinates": {
              "latitude": 37.123456,
              "longitude": 127.123456
            }
          },
          "preferences": {
            "language": "ko",
            "timezone": "Asia/Seoul",
            "notifications": {
              "email": true,
              "sms": false,
              "push": true
            }
          }
        },
        "statistics": {
          "totalOrders": 42,
          "totalAmount": 1250000,
          "averageOrderValue": 29761.90,
          "lastOrderDate": "2024-01-15",
          "favoriteCategories": ["electronics", "books", "clothing"],
          "monthlySpending": {
            "2024-01": 125000,
            "2024-02": 89000,
            "2024-03": 156000
          }
        },
        "metadata": {
          "generatedAt": "2024-03-15T10:30:00.000Z",
          "version": "1.2.3",
          "processingTime": 245
        }
      }
    `);
    // 200줄이 넘는 snapshot으로 테스트 파일이 비대해짐
    // 실제로 검증하려는 핵심 로직이 무엇인지 파악하기 어려움
  });
});
```

#### ✅ Do
```typescript
// Helper 함수로 필요한 데이터만 추출하거나 개별 expect로 검증
describe(generateUserReport.name, () => {
  // 방법 1: Helper 함수로 핵심 데이터만 추출
  it('사용자 리포트의 핵심 정보를 올바르게 생성한다', () => {
    // given
    const userData = userDataFactory.build({
      id: '12345',
      name: '홍길동'
    });
    
    // when
    const result = generateUserReport(userData);
    
    // then - Helper 함수로 핵심 정보만 추출하여 검증
    const essentialData = extractReportEssentials(result);
    expect(essentialData).toMatchInlineSnapshot(`
      {
        "userName": "홍길동",
        "userId": "12345",
        "totalOrders": 42,
        "totalAmount": 1250000,
        "reportGenerated": true
      }
    `);
  });
  
  // 방법 2: 개별 expect로 핵심 필드들을 명시적으로 검증
  it('사용자 통계를 정확히 계산한다', () => {
      // given
    const userData = userDataFactory.build();
    
    // when
    const result = generateUserReport(userData);
    
    // then - 각 핵심 로직을 개별적으로 명확히 검증
    expect(result.user.name).toBe('홍길동');
    expect(result.statistics.totalOrders).toBe(42);
    expect(result.statistics.averageOrderValue).toBe(29761.90);
    expect(result.statistics.favoriteCategories).toEqual(['electronics', 'books', 'clothing']);
    expect(result.metadata.generatedAt).toBeDefined();
  });
});

// Helper 함수 정의
const extractReportEssentials = (report: UserReport) => ({
  userName: report.user.name,
  userId: report.user.id,
  totalOrders: report.statistics.totalOrders,
  totalAmount: report.statistics.totalAmount,
  reportGenerated: !!report.metadata.generatedAt
});
```

### DOM 의존성 테스트를 Unit Test에서 다루는 문제

#### ❌ Do Not
```typescript
// React Testing Library로 DOM 상호작용을 Unit Test에서 처리
describe('LoginForm', () => {
  it('유효하지 않은 이메일 입력 시 에러 메시지를 표시한다', () => {
    // given
    render(<LoginForm onSubmit={jest.fn()} />);
    
    // when
    const emailInput = screen.getByLabelText('이메일'); // 접근성 속성 변경 시 깨짐
    const submitButton = screen.getByRole('button', { name: '로그인' }); // 버튼 텍스트 변경 시 깨짐
    
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.click(submitButton);
    
    // then - DOM 구조나 텍스트 변경에 매우 취약
    expect(screen.getByText('올바른 이메일 형식을 입력해주세요')).toBeInTheDocument();
    // 실행 시간이 오래 걸림 (DOM 렌더링 + 이벤트 처리)
    // 접근성 속성 누락 시 테스트 실패
  });
  
  it('로그인 버튼 클릭 시 로딩 상태를 표시한다', () => {
      // given
    const mockSubmit = jest.fn().mockImplementation(() => new Promise(resolve => setTimeout(resolve, 1000)));
    render(<LoginForm onSubmit={mockSubmit} />);
    
    // when
    fireEvent.click(screen.getByRole('button', { name: '로그인' }));
    
    // then - DOM 의존성으로 인해 불안정하고 느림
    expect(screen.getByText('로그인 중...')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

#### ✅ Do
```typescript
// Unit Test: 순수 로직만 검증
describe(validateEmail.name, () => {
  it('유효한 이메일 형식을 올바르게 검증한다', () => {
    // given
    const validEmail = 'user@example.com';

      // when
    const result = validateEmail(validEmail);
    
    // then - 빠르고 안정적인 순수 함수 테스트
    expect(result.isValid).toBe(true);
    expect(result.errorMessage).toBeNull();
  });
  
  it('유효하지 않은 이메일에 대해 적절한 에러 메시지를 반환한다', () => {
      // given
    const invalidEmail = 'invalid-email';

      // when
    const result = validateEmail(invalidEmail);

      // then
    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toBe('올바른 이메일 형식을 입력해주세요');
  });
    });

describe(getLoginButtonState.name, () => {
  it('로딩 중일 때 버튼 상태를 올바르게 반환한다', () => {
      // given
    const isLoading = true;
    const isValid = true;

      // when
    const result = getLoginButtonState(isLoading, isValid);
    
    // then - DOM 없이 순수 로직만 테스트
    expect(result.disabled).toBe(true);
    expect(result.text).toBe('로그인 중...');
  });
  
  it('유효하지 않은 입력일 때 버튼을 비활성화한다', () => {
      // given
    const isLoading = false;
    const isValid = false;

      // when
    const result = getLoginButtonState(isLoading, isValid);

      // then
    expect(result.disabled).toBe(true);
    expect(result.text).toBe('로그인');
  });
});

// 통합 테스트에서 다뤄야 할 내용:
// - DOM 렌더링 결과
// - 사용자 상호작용 (클릭, 입력 등)
// - 접근성 속성 검증
// - 컴포넌트 간 상호작용
// - 실제 브라우저 환경에서의 동작
```



## 세부 가이드라인

세부 사항들은 별도 파일에서 다룹니다:
- 테스트 목 데이터: `unit-test-mock-data.md`
- 테스트 컨벤션: `unit-test-convention.md`
- 시간 의존성 테스트: `unit-test-time.md`
