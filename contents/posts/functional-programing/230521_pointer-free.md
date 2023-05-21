---
title: "point free in functional programming"
date: '2023-05-21T23:46:37.121Z'
template: 'post'
draft: false
slug: 'functional-programming/point-free'
category: 'functional programming'
tags:
  - 'functional programming'
description: '함수형 프로그래밍의 맥락에서 "point free"가 어떤 맥락으로 사용되는지 알아본다.'

---

## 배경

함수형에 대한 블로그 글을 찾아 보던 중 [pointfree-javascript](https://lucasmreis.github.io/blog/pointfree-javascript/) 라는 글을 접하게 되었다.
기존의 경험을 통해서 유추해봐도 의미를 알기 어려웠다. point free 란 무엇인지 알아보기 위해 글을 정리했다.

## 첫인상
해당 글상서는 함수 조합(compose)을 하면 함수가 smaller(작게 쪼개고), generic(잘 추상화되고), reusable(재사용 가능) 하게 만들 수 있다고 설명한다. 함수 합성의 효과는 잘 이해했다. 여전히 pointer free는 아리송하다.

## 다른 블로그의 설명으로 유추한 내용

![Image](https://pbs.twimg.com/media/FQ_i1mTaIAA12Uz?format=png&name=900x900)

pointer free 라는 맥락에서 point는 argument를 뜻하고, 위 이미지에서 처럼 argument를 특정(identify) 하지않도록 하는게 pointer free style인 것이다. 요렇게 하면 위에서 언급한 smaller, generic, reusable이 달성된다.

### pointer free 장점: Simplicity 간단 명료함 

redundant(거추장스러운) arguments 들은 issue(아마 함수가 해결하려는 문제)를 이해하는데 방해요소가 되는데, point free는 그 부분에서 free 하다. 왜 그럴까? 위 이미지에서 처럼 함수명만(isEven)을 사용하면 사용처에서 불필요한 정보(argument myNumber의 name)을 감춰버리니까 함수를 쓰거나 읽는 입장에서 매우 간결해진다.

array 의 메소드인 `map`, `filter` 쓸 때 자주 inline으로 `v => logic()` 형식으로 쓰곤 했다. inline 함수는 익명이라 의미가 명확하지 않고, 항상 argument에 v라고 쓰는것이 어색해서 배열의 element이름을 길게 늘여썼다. 그것은 그 나름대로 거추장 스러웠다. pointer free style을 하면 이런 점을 해소 할 수 있다. 

### pointer free 장점: No variables to name 

네이밍 짓는게 상당히 어려운 일인데 point-free style로 이름짓기 시간을 save하고, 특정 함수에 컨텍스를 맞춰서 보다 명시적이고 추상화된 이름을 쓸 수 있어 편하다.

```js
numList.map(num => logic()).filter(num => logic())
```

큰 문제는 아니지만 numList위쪽에 num 이라는 변수가 있다면 variable shadowing 이 노출되서 eslint 가 붉은 줄을 그어준다.  이런 문제를 point free가 해결해주기도 한다.

### pointer free 장점: 디버깅 쉽고, 합성이 쉬워진다.

각 함수별로 라인에 break 를 걸 수 있고, stack trace에서 함수의 이름이 노출되어 디버깅 하기 쉽다. 또한 함수의 역할이 명확하고 간결해서 각 함수들을   pipe, compose 함수를 통해 합성하기 쉬운 디자인이 된다. 

## Tradeoff

다만 은총알은 없듯이 tradeoff 도 존재한다.  조합하는 함수의 이름이 잘못디자인 된 경우 내부로직을 확인 해야 하기 때문에(인자도 없고 구현도 안보이니까) 가독성이  회손된다. 다만 이건 point free style의 문제라기 보다 충분히 고려하지 않은 함수명의 책임이 크다. 물론 그 파급효과가 point free style에서 더 두드러지는 건 사실이다. 

또 따른 문제는 `this`  문제 이다. 합성하는 함수에서 this context를 쓴다면(js 한정) 해당 this가 어떤 컨텍스트에 있냐에 따라 달라 this가 지칭하는 것이 달라진다. 따라서  point free style에 this를 쓴다면 코드를 읽는 사람이 this의 컨텍스트를  파악하기 어렵다. 다만 map, filter 등의 higher order function을 쓸때 this를 왠만하면 안쓰도록 디자인 하도록하면 큰 문제는 아니다. 

![Image](https://pbs.twimg.com/media/FQ_ulrbacAAjv-d?format=png&name=900x900)

마지막으로 unary(단항)을 가지는 함수를 사용할 때 문제인데, 아래 부분은 pointer free style을 쓸 때 꼭 유의해서 써야 하겠다. unary라는 currying util함수로 한번 감싸서 쓰자. 

```js
let myStringNumbers= ['1', '2', '3'];
const unary = fn => (...args) => fn(args[0]);
console.log(myStringNumbers.map(unary(parseInt))); // will output [1, 2, 3]
```



