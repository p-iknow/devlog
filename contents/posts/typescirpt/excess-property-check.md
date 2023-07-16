---
title: 'Excess Property Check, Typescript Structural Typing의 예외'
date: '2023-07-18T23:46:37.121Z'
template: 'post'
draft: false
slug: 'typescript/excess-property-check'
img: 'https://p-iknow.netlify.app/typescript.webp'
category: 'typescript'
tags:
  - 'typescript'
  - 'Structural Typing'
description: '타입스크립트는 Structural Typing 을 지원한다. 객체 타입을 구성하는 '

---

![typescript](/Users/youngchang/dev/personal/devlog/static/typescript.webp)

## 타입스크립트의 구조적 타이핑(Structural Typing)


타입스크립트의 구조적 타이핑 (Structural Typing)은 프로그래밍에서 타입 호환성이나 타입 검사 방식을 결정하는 방식이다. 구조적 타이핑 (Structural Typing)는 값의 형태에 따라 타입을 결정한다. 즉, 타입을 체크할 때 타입의 이름이나 선언 방식이 아닌 그 구조를 확인한다. 예를 들어보자.

```typescript
interface Point2D {
    x: number;
    y: number;
}

interface Point3D {
    x: number;
    y: number;
    z: number;
}

let point2D: Point2D = { x: 0, y: 10 };
let point3D: Point3D = { x: 0, y: 10, z: 20 };

function printPoint2D(point: Point2D) {
    console.log(`X: ${point.x}, Y: ${point.y}`);
}


PrintPoint2D(point3D); // 할당 가능함
```

위 코드에는 `Point2D`와 `Point3D` 두 인터페이스가 있다. `Point2D`는 x와 y를 가지고 있고, `Point3D`는 추가로 z를 가지고 있다.

`printPoint2D` 함수는 `Point2D` 타입의 객체를 인수로 받지만, `Point3D` 타입의 `point3D`를 인자로 넘겨도 오류가 발생하지 않는다. `Point3D`는 `Point2D`의 모든 프로퍼티를 포함하므로 `Point2D`를 기대하는 위치에서 동일하게 사용할 수 있다. 이것이 바로 구조적 타이핑 (Structural Typing) 인 것이다. 구조만 같다면 할당이 가능하다. 

이러한 방식으로 구조적 타이핑은 코드의 유연성을 높여주고, 다양한 상황에서 같은 인터페이스를 적용할 수 있게 한다. 이는 "덕 타이핑" (duck typing)이라고도 부른다. "만약 어떤 새가 오리처럼 걷고, 오리처럼 꽥꽥거린다면 그것은 오리일 것이다"라는 논리를 따르기 때문에 덕 타이핑이라고 이름을 붙였다. 

## 이슈 





자바스크립트는 동적 타이핑 언어로, 변수의 타입이 실행시점에 결정된다. 반면 타입스크립트는 컴파일 시점에 타입 검사를 수행하는 정적 타이핑 언어다. 이러한 차이에도 불구하고 타입스크립트는 자바스크립트와 호환성을 유지하기 위해 구조적 타이핑을 채택했다. 





위에서 타입스크립트는 구조적 타이핑 (Structural Typing)을 따른다고 했다. 따라서 타입의 구조만 동일하다면  동일한 타입으로 간주한다. 따라서 



`isDark` 와 `isLight` 이라는 prop을 가진 인터페이스가 있다고 하자.

```ts
interface DependentProps {
  isDark: boolean
  isLigrht: boolean
}
```

`isDark` 가 `true` 인 경우 `isLight`는 `false` 여야 한다. `isDark` 가 `false` 인 경우 `isLight`는 `true` 여야 한다. 하나의 property의 상태가 다른 property의 결과에 영향을 미친다. 이런 경우 서로 의존적인 필드가 있다고 말한다.  사내의 리엑트 컴포넌트의  `Props` 를 정의중에 이런 의존적인 field를 가진 상황을 마주했다. 해당 상황에 대해 더 살펴보자.





## Summary

리엑트의  `Props` 정의를 할 때  각각의 prop이 서로 의존적일 경우 `interface` 의 `union` 과 `never` 타입을 활용하면 원하는 타입 표현을 할 수 있다.