---
title: "2. Time Test"
description: "시간 의존 로직을 Jest time mock과 date-fns로 안정적으로 테스트하는 패턴을 설명합니다."
type: pattern
tags: [Testing]
order: 2
---

# 2. Time Test

시간에 의존하는 코드를 테스트할 때의 가이드라인과 패턴을 다룹니다. 이 프로젝트는 `date-fns` 라이브러리를 사용합니다.

## 시간 의존성 문제

### 문제점

시간에 의존하는 코드는 다음과 같은 문제를 야기합니다:

- **실행 시점에 따른 결과 차이**: 테스트 실행 시간에 따라 결과가 달라짐
- **타임존 의존성**: 로컬(KST)과 CI(UTC) 환경에서 다른 결과
- **날짜/시간 계산 오류**: 윤년, 월말, 시간대 변경 등의 예외 상황
- **테스트 불안정성**: 특정 시간대나 날짜에만 실패하는 테스트

## 시간 의존성 해결 패턴

### 1. Time Mock을 사용한 현재 시간 고정

#### ❌ Do Not
```typescript
import { differenceInYears } from 'date-fns';

// 현재 시간에 의존하는 함수 - 매개변수로 시간을 받지 않음
const calculateAge = (birthDate: string) => {
  const birth = new Date(birthDate);
  const now = new Date(); // 실행 시점에 의존
  return differenceInYears(now, birth);
};

// 테스트가 실행 시점에 따라 실패할 수 있음
test('나이를 계산한다', () => {
  const result = calculateAge('1990-01-01');
  expect(result).toBe(34); // 2024년에만 통과, 2025년에는 실패
});
```

#### ✅ Do
```typescript
import { differenceInYears } from 'date-fns';

// 현재 시간에 의존하는 함수 - 그대로 유지
const calculateAge = (birthDate: string) => {
  const birth = new Date(birthDate);
  const now = new Date(); // 실행 시점에 의존
  return differenceInYears(now, birth);
};

// Time Mock을 사용하여 현재 시간을 고정
describe(calculateAge.name, () => {
  beforeEach(() => {
    // 현재 시간을 2024-01-01로 고정
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-01-01T00:00:00.000Z'));
  });
  
  afterEach(() => {
    jest.useRealTimers();
  });
  
  test('나이를 계산한다', () => {
    // given
    const birthDate = '1990-01-01';
    
    // when
    const result = calculateAge(birthDate);
    
    // then - 고정된 시간으로 항상 동일한 결과
    expect(result).toBe(34);
  });
  
  test('윤년 출생자의 나이를 계산한다', () => {
    // given
    const birthDate = '1992-02-29'; // 윤년 출생
    
    // when
    const result = calculateAge(birthDate);
    
    // then
    expect(result).toBe(32);
  });
  
  test('생일이 지나지 않은 경우 나이를 계산한다', () => {
    // given - 생일 전 날짜로 시간 고정
    jest.setSystemTime(new Date('2024-06-15T00:00:00.000Z'));
    const birthDate = '1990-12-25'; // 생일이 아직 안 지남
    
    // when
    const result = calculateAge(birthDate);
    
    // then
    expect(result).toBe(33); // 생일 전이므로 한 살 적음
  });
});
```

### 2. 복합적인 시간 로직의 Time Mock 처리

#### ❌ Do Not
```typescript
import { format, isWeekend } from 'date-fns';

// 시간 로직이 비즈니스 로직과 섞여있어 테스트하기 어려움
const generateReport = (data: ReportData) => {
  const now = new Date();
  const reportDate = format(now, 'yyyy-MM-dd HH:mm:ss');
  const weekendCheck = isWeekend(now);
  
  return {
    ...data,
    generatedAt: reportDate,
    priority: weekendCheck ? 'low' : 'high'
  };
};

// 실행 시점에 따라 결과가 달라지는 테스트
test('리포트를 생성한다', () => {
  const data = { title: 'Test Report' };
  const result = generateReport(data);
  
  // 주말/평일에 따라 priority가 달라져서 불안정
  expect(result.priority).toBe('high'); // 주말에 실행하면 실패
});
```

#### ✅ Do
```typescript
import { format, isWeekend } from 'date-fns';

// 현재 시간에 의존하는 함수 - 그대로 유지
const generateReport = (data: ReportData) => {
  const now = new Date();
  const reportDate = format(now, 'yyyy-MM-dd HH:mm:ss');
  const weekendCheck = isWeekend(now);
  
  return {
    ...data,
    generatedAt: reportDate,
    priority: weekendCheck ? 'low' : 'high'
  };
};

// Time Mock을 사용하여 다양한 시간 상황 테스트
describe(generateReport.name, () => {
  afterEach(() => {
    jest.useRealTimers();
  });
  
  test('평일에 생성된 리포트는 높은 우선순위를 갖는다', () => {
    // given - 월요일로 시간 고정
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-01-01T09:00:00.000Z')); // 월요일
    const data = { title: 'Test Report' };
    
    // when
    const result = generateReport(data);
    
    // then
    expect(result.priority).toBe('high');
    expect(result.generatedAt).toBe('2024-01-01 09:00:00');
  });
  
  test('주말에 생성된 리포트는 낮은 우선순위를 갖는다', () => {
    // given - 토요일로 시간 고정
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-01-06T09:00:00.000Z')); // 토요일
    const data = { title: 'Weekend Report' };
    
    // when
    const result = generateReport(data);
    
    // then
    expect(result.priority).toBe('low');
    expect(result.generatedAt).toBe('2024-01-06 09:00:00');
  });
});
```

### 3. date-fns를 사용한 시간대 고정 처리

#### ❌ Do Not
```typescript
import { format } from 'date-fns';

// 시스템 시간대에 의존하는 함수
const formatBusinessTime = (timestamp: number) => {
  const date = new Date(timestamp);
  return format(date, 'yyyy-MM-dd HH:mm:ss'); // 시스템 시간대에 의존
};

test('업무 시간을 포맷팅한다', () => {
  const result = formatBusinessTime(1704067200000); // 2024-01-01 00:00:00 UTC
  // 로컬(KST): "2024-01-01 09:00:00"
  // CI(UTC): "2024-01-01 00:00:00"
  expect(result).toBe('2024-01-01 09:00:00'); // CI에서 실패
});
```

#### ✅ Do
```typescript
import { format } from 'date-fns';
import { zonedTimeToUtc, utcToZonedTime } from 'date-fns-tz';

// 시간대를 명시적으로 지정하는 함수
const formatBusinessTime = (timestamp: number, timeZone: string = 'Asia/Seoul') => {
  const utcDate = new Date(timestamp);
  const zonedDate = utcToZonedTime(utcDate, timeZone);
  return format(zonedDate, 'yyyy-MM-dd HH:mm:ss');
};

test('업무 시간을 한국 시간대로 포맷팅한다', () => {
  // given
  const timestamp = 1704067200000; // 2024-01-01 00:00:00 UTC
  
  // when
  const result = formatBusinessTime(timestamp, 'Asia/Seoul');
  
  // then
  expect(result).toBe('2024-01-01 09:00:00'); // 어디서든 동일한 결과
});

test('다른 시간대로도 포맷팅할 수 있다', () => {
  // given
  const timestamp = 1704067200000; // 2024-01-01 00:00:00 UTC
  
  // when
  const result = formatBusinessTime(timestamp, 'America/New_York');
  
  // then
  expect(result).toBe('2023-12-31 19:00:00'); // EST 기준
});
```

## 날짜 계산 테스트 패턴

### 경계값 테스트

```typescript
import { addBusinessDays, format } from 'date-fns';

// date-fns를 사용한 영업일 계산 함수
const addWorkingDays = (dateString: string, days: number) => {
  const startDate = new Date(dateString);
  const result = addBusinessDays(startDate, days);
  return format(result, 'yyyy-MM-dd');
};

describe(addWorkingDays.name, () => {
  test('평일에 영업일을 더한다', () => {
    // given
    const startDate = '2024-01-02'; // 화요일
    const businessDays = 3;
    
    // when
    const result = addWorkingDays(startDate, businessDays);
    
    // then
    expect(result).toBe('2024-01-05'); // 금요일
  });
  
  test('금요일에 영업일을 더하면 주말을 건너뛴다', () => {
    // given
    const startDate = '2024-01-05'; // 금요일
    const businessDays = 1;
    
    // when
    const result = addWorkingDays(startDate, businessDays);
    
    // then
    expect(result).toBe('2024-01-08'); // 다음 주 월요일
  });
  
  test('월말에서 영업일을 더한다', () => {
    // given
    const startDate = '2024-01-31'; // 1월 마지막 날 (수요일)
    const businessDays = 2;
    
    // when
    const result = addWorkingDays(startDate, businessDays);
    
    // then
    expect(result).toBe('2024-02-02'); // 2월 2일 (금요일)
  });
  
  test('연휴가 포함된 기간의 영업일을 계산한다', () => {
    // given
    const startDate = '2024-01-04'; // 목요일
    const businessDays = 5; // 5 영업일
    
    // when
    const result = addWorkingDays(startDate, businessDays);
    
    // then
    expect(result).toBe('2024-01-11'); // 다음 주 목요일 (주말 2일 건너뜀)
  });
});
```

### 윤년 처리 테스트

```typescript
import { isLeapYear, getDaysInMonth } from 'date-fns';

describe('윤년 검사', () => {
  test('4의 배수인 해는 윤년이다', () => {
    expect(isLeapYear(new Date(2024, 0, 1))).toBe(true);
  });
  
  test('100의 배수이지만 400의 배수가 아닌 해는 평년이다', () => {
    expect(isLeapYear(new Date(1900, 0, 1))).toBe(false);
  });
  
  test('400의 배수인 해는 윤년이다', () => {
    expect(isLeapYear(new Date(2000, 0, 1))).toBe(true);
  });
});

describe('월별 일수 계산', () => {
  test('윤년 2월은 29일이다', () => {
    const februaryInLeapYear = new Date(2024, 1, 1); // 2024년 2월
    expect(getDaysInMonth(februaryInLeapYear)).toBe(29);
  });
  
  test('평년 2월은 28일이다', () => {
    const februaryInNormalYear = new Date(2023, 1, 1); // 2023년 2월
    expect(getDaysInMonth(februaryInNormalYear)).toBe(28);
  });
  
  test('31일까지 있는 달을 확인한다', () => {
    const january = new Date(2024, 0, 1); // 1월
    expect(getDaysInMonth(january)).toBe(31);
  });
  
  test('30일까지 있는 달을 확인한다', () => {
    const april = new Date(2024, 3, 1); // 4월
    expect(getDaysInMonth(april)).toBe(30);
  });
});
```

## 시간 범위 테스트

### 기간 계산 테스트

```typescript
import { differenceInDays, differenceInYears, differenceInMonths } from 'date-fns';

// date-fns를 사용한 기간 계산 함수
const calculatePeriod = (startDateString: string, endDateString: string) => {
  const startDate = new Date(startDateString);
  const endDate = new Date(endDateString);
  
  return {
    days: differenceInDays(endDate, startDate),
    months: differenceInMonths(endDate, startDate),
    years: differenceInYears(endDate, startDate)
  };
};

describe(calculatePeriod.name, () => {
  test('같은 날짜의 기간은 0일이다', () => {
    // given
    const startDate = '2024-01-01';
    const endDate = '2024-01-01';
    
    // when
    const result = calculatePeriod(startDate, endDate);
    
    // then
    expect(result.days).toBe(0);
    expect(result.months).toBe(0);
    expect(result.years).toBe(0);
  });
  
  test('연도를 넘나드는 기간을 계산한다', () => {
    // given
    const startDate = '2023-12-31';
    const endDate = '2024-01-02';
    
    // when
    const result = calculatePeriod(startDate, endDate);
    
    // then
    expect(result.days).toBe(2);
    expect(result.months).toBe(0);
    expect(result.years).toBe(0); // 1년 미만
  });
  
  test('여러 해에 걸친 기간을 계산한다', () => {
    // given
    const startDate = '2022-01-01';
    const endDate = '2024-01-01';
    
    // when
    const result = calculatePeriod(startDate, endDate);
    
    // then
    expect(result.years).toBe(2);
    expect(result.months).toBe(24);
    expect(result.days).toBe(731); // 2년 + 윤년 1일
  });
  
  test('월 단위 기간을 정확히 계산한다', () => {
    // given
    const startDate = '2024-01-15';
    const endDate = '2024-06-15';
    
    // when
    const result = calculatePeriod(startDate, endDate);
    
    // then
    expect(result.months).toBe(5);
    expect(result.days).toBe(152); // 실제 일수
  });
});
```

## 시간 Mock 패턴

### Jest Timer Mock 사용

```typescript
describe('delayedFunction', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  
  afterEach(() => {
    jest.useRealTimers();
  });
  
  test('3초 후에 콜백을 실행한다', () => {
    // given
    const mockCallback = jest.fn();
    
    // when
    delayedFunction(mockCallback, 3000);
    
    // then - 아직 실행되지 않음
    expect(mockCallback).not.toHaveBeenCalled();
    
    // 3초 경과
    jest.advanceTimersByTime(3000);
    
    // then - 콜백이 실행됨
    expect(mockCallback).toHaveBeenCalledTimes(1);
  });
});
```

### 시간 기반 함수의 Time Mock 테스트

```typescript
// 현재 시간의 타임스탬프를 반환하는 함수
const getCurrentTimestamp = () => {
  return new Date().getTime();
};

describe(getCurrentTimestamp.name, () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  
  afterEach(() => {
    jest.useRealTimers();
  });
  
  test('현재 시간의 타임스탬프를 반환한다', () => {
    // given - 시간을 고정
    jest.setSystemTime(new Date('2024-01-01T00:00:00.000Z'));
    
    // when
    const result = getCurrentTimestamp();
    
    // then
    expect(result).toBe(1704067200000);
  });
  
  test('다른 시간으로 설정하여 테스트한다', () => {
    // given - 다른 시간으로 고정
    jest.setSystemTime(new Date('2024-06-15T12:30:00.000Z'));
    
    // when
    const result = getCurrentTimestamp();
    
    // then
    expect(result).toBe(1718453400000);
  });
});
```

## 시간 관련 유틸리티 함수 테스트

### 날짜 유효성 검사

```typescript
import { isValid, parseISO } from 'date-fns';

// date-fns를 사용한 날짜 유효성 검사 함수
const isValidDateString = (dateString: string) => {
  const parsedDate = parseISO(dateString);
  return isValid(parsedDate);
};

describe(isValidDateString.name, () => {
  test('유효한 날짜 문자열을 검증한다', () => {
    expect(isValidDateString('2024-01-01')).toBe(true);
    expect(isValidDateString('2024-12-31')).toBe(true);
    expect(isValidDateString('2024-01-01T00:00:00.000Z')).toBe(true); // ISO 형식
  });
  
  test('유효하지 않은 날짜 문자열을 검증한다', () => {
    expect(isValidDateString('2024-02-30')).toBe(false); // 2월 30일은 존재하지 않음
    expect(isValidDateString('2024-13-01')).toBe(false); // 13월은 존재하지 않음
    expect(isValidDateString('invalid-date')).toBe(false);
    expect(isValidDateString('')).toBe(false); // 빈 문자열
  });
  
  test('윤년 날짜를 올바르게 검증한다', () => {
    expect(isValidDateString('2024-02-29')).toBe(true); // 윤년
    expect(isValidDateString('2023-02-29')).toBe(false); // 평년
  });
  
  test('다양한 날짜 형식을 검증한다', () => {
    expect(isValidDateString('2024-01-01T15:30:00')).toBe(true);
    expect(isValidDateString('2024-01-01T15:30:00+09:00')).toBe(true);
    expect(isValidDateString('01/01/2024')).toBe(false); // MM/DD/YYYY 형식은 parseISO로 파싱 불가
  });
});
```

### 시간 포맷팅

```typescript
import { format, intervalToDuration, addSeconds } from 'date-fns';
import { ko } from 'date-fns/locale';

// date-fns를 사용한 시간 포맷팅 함수
const formatDuration = (seconds: number): string => {
  const start = new Date(0);
  const end = addSeconds(start, seconds);
  const duration = intervalToDuration({ start, end });
  
  const parts: string[] = [];
  
  if (duration.days && duration.days > 0) parts.push(`${duration.days}일`);
  if (duration.hours && duration.hours > 0) parts.push(`${duration.hours}시간`);
  if (duration.minutes && duration.minutes > 0) parts.push(`${duration.minutes}분`);
  if (duration.seconds && duration.seconds > 0) parts.push(`${duration.seconds}초`);
  
  return parts.length > 0 ? parts.join(' ') : '0초';
};

// date-fns를 사용한 날짜 포맷팅 함수
const formatKoreanDate = (date: Date): string => {
  return format(date, 'yyyy년 MM월 dd일', { locale: ko });
};

describe(formatDuration.name, () => {
  test('초 단위 시간을 포맷팅한다', () => {
    expect(formatDuration(30)).toBe('30초');
    expect(formatDuration(90)).toBe('1분 30초');
    expect(formatDuration(3661)).toBe('1시간 1분 1초');
  });
  
  test('0초는 "0초"로 표시한다', () => {
    expect(formatDuration(0)).toBe('0초');
  });
  
  test('하루 이상의 시간을 포맷팅한다', () => {
    const oneDayInSeconds = 24 * 60 * 60;
    expect(formatDuration(oneDayInSeconds)).toBe('1일');
    expect(formatDuration(oneDayInSeconds + 3661)).toBe('1일 1시간 1분 1초');
  });
  
  test('분 단위만 있는 경우를 포맷팅한다', () => {
    expect(formatDuration(120)).toBe('2분');
    expect(formatDuration(3600)).toBe('1시간');
  });
});

describe(formatKoreanDate.name, () => {
  test('날짜를 한국어 형식으로 포맷팅한다', () => {
    // given
    const date = new Date('2024-01-01T00:00:00.000Z');
    
    // when
    const result = formatKoreanDate(date);
    
    // then
    expect(result).toBe('2024년 01월 01일');
  });
  
  test('윤년 날짜를 포맷팅한다', () => {
    // given
    const date = new Date('2024-02-29T00:00:00.000Z');
    
    // when
    const result = formatKoreanDate(date);
    
    // then
    expect(result).toBe('2024년 02월 29일');
  });
});
```

## 주의사항

### 시간대 처리 시 고려사항

1. **일관된 시간대 사용**: 테스트에서는 항상 명시적인 시간대 지정
2. **UTC 기준 계산**: 내부 계산은 UTC로, 표시는 로컬 시간대로
3. **서머타임 고려**: 서머타임이 적용되는 지역의 시간 계산 주의

### 테스트 데이터 선택

1. **의미있는 날짜 사용**: 실제 비즈니스 로직과 관련된 날짜 선택
2. **경계값 테스트**: 월말, 연말, 윤년 등의 경계 상황 포함
3. **고정된 시간 사용**: 테스트에서는 항상 고정된 시간값 사용
4. **date-fns 함수 활용**: 날짜 계산은 date-fns 함수를 사용하여 정확성 보장

### Time Mock 사용 시 주의점

1. **Timer 정리**: 테스트 후 반드시 `jest.useRealTimers()` 호출
2. **일관된 패턴**: `beforeEach`에서 `useFakeTimers()`, `afterEach`에서 `useRealTimers()` 사용
3. **시간 고정**: `jest.setSystemTime()`을 사용하여 명시적으로 시간 고정
4. **테스트 격리**: 각 테스트마다 독립적인 시간 설정으로 격리 보장
