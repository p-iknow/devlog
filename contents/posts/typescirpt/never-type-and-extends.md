---
title: "typescirpt extends 키워드를 쓸때 never 타입을 어떻게 다루는가?"
date: '2023-06-04T23:46:37.121Z'
template: 'post'
draft: false
slug: 'typescript/handle-never-type-when-use-with-extends-keyword'
category: 'typescript'
tags:
  - 'typescirpt'
  = 'extends'
description: 'typescirpt extends 키워드를 쓸때 never 타입을 어떻게 다루는지에 대한 내용을 설명합니다. extends '


---

## 배경

Design system  컴포넌트들의 기본 Props을 아래와 같이 정의했다. 새로 만들게 design system은 기본적으로는 `headless` 이다. 확정된 경우가 아니면 별도의 스타일을 가지지 않고, 컴포넌트의 역할과 기능만을 제한한다. 필요한 경우 아주 기본적인 스타일을 기본으로 제공하지만, 쉽게 override할 수 있다.  이렇게 함으로써 스타일에 대한 유연성을 높이고 동시에 각 컴포넌트의 재사용성을 높인다. 그러나 특정 컴포넌트의 경우 스타일의 변화(variant)가 이미 정의되어있고. 사용자에게 이미 지정된 variant 내의 스타일을 쓰도록 제한한다. 

위 내용을 토대로 디자인 시스템의 타입을 정의해보자. 기본 `Props` 은 다음과 같다. 

```ts
interface StyledDefaultProps {
  css?: EmotionCss;
   // true일 경우 기본 스타일을 무시하고 주입한 css 스타일 or className, tw 내용이 적용됩니다.
  ignoreDefaultStyle?: boolean;
}

/**
 * @용도 Props 지정시 css의 타입을 emotion 의 css 로 지정하기 위한 타입입니다.
 * @내부구현 `Interpolation<Theme>`
 * @의도 추후 라이브러리의 공용타입이 변경되어도 한번에 수정할 수 있도록 합니다.
 * @권고 emotion 의 css 타입 or 라이브러리 타입이 변경될 경우 이 타입을 변경해야 합니다.
 */
export type EmotionCss = Interpolation<Theme>;
```

`varinat`가 이미 정의된 컴포넌의 경우 아래와 같이 variant prop을 필요로 한다.   

```ts
/**
 * Style의 Variant를 함께 지정할 수 있는 Props 입니다.
 * @typeparam VariantUnion
 * @example
 *  BdsProps<'primary' | 'secondary' | 'tertiary'>
 */
interface StyledPropsWithVariant<VariantUnion> extends StyledDefaultProps {
  /**
   * 해당 스타일의 Style의 Variant를 지정합니다.
   * @example 'primary' | 'secondary' | 'tertiary'
   */
  variant?: VariantUnion;
}
```

각 서비스에서 사용시에는 위 타입을 각각 쓰지 않고 `StyledProps` 만을 쓰게 만들고 싶었다. 만약 변화가 일어난다면 변화의 범위를  `StyledProps` 안으로 한정하고 싶었기 때문이다. 그럼 서비스에서는 어떻게 varinat가 있는 타입과 없는 타입을 구분해서 사용할 수 있을까? 

```ts
export type StyledProps<VariantUnion extends = never> = VariantUnion extends never
  ? StyledDefaultProps
  : StyledPropsWithVariant<VariantUnion>;
```

"`generic` 과 `extends` 키워드를 사용하면 우리의 목표를 달성할 수 있다. " 라고 생각했다. 하지만 결과는 예상과는 달랐다. 

## 이슈 

기대는 다음과 같았다.  `VariantUnion` 제네릭의 `default type`으로 `never` 를 할당한다. 

```ts type CompoenntWithoutVariant = StyledProps;
type CompoenntWithoutVariant = StyledProps;

```

위와 같이 타입 선언을 하면 `VariantUnion`  에는 `default type`으로 정의해둔 `never`타입이 할당된다. 

```ts
type CompoenntWithoutVariant = StyledProps<never>;

// StyledProps<never> 을 풀어쓰면 다음과 같다. 
never extends never
  ? StyledDefaultProps
  : StyledPropsWithVariant<VariantUnion>;
```

이제 `extends` keyword로 할당 가능성을 체크한다. `never` 타입에 할당 가능한 타입은 never 타입밖에 없다. 때문에 `StyledProps<never>` 는 `StyledDefaultProps` 로 추론되길  기대했다. 

![image-20230604175500353](/Users/youngchang/Library/Application Support/typora-user-images/image-20230604175500353.png)

하지만 `StyledProps<never>` 는 `never` 타입으로 추론되었다. 무슨일이 일어난 걸까? 

## extends keyword 

일단 extends 키워드 부터 알아보자. 

```ts
SomeType extends OtherType ? TrueType : FalseType;
```

`extends` 왼쪽에 있는 `SomeType` 을 `extends` 오른쪽에 있는 `OtherType`에 할당할 수 있는 경우 이 타입은 `TrueType` 이고, 할당할 수 없는 경우 `FalseType` 이다. 

그렇다면 할당가능(Assignability)은 어떻게 판단할까? SomeType 이 OtherType의 subType이거나 같은 타입이면 할당 가능하다. 아래는 각 타입의 `SuperType` 과 `SupType` 을 정리한 이미지이다. `unknown` 은 모든 type의 `Supertype` 이기에 모든 타입을 `unkownt` type 에 할당할 수 있다. `never` 타입은 모든 타입의 `subtype`(bottom type) 이므로 never type 이에외 어떤 타입에도 `never` type에 할당할 수 없다. 그리고 어떤 타입에도 `never` type을 할당할 수 있다. 

![image-20230604232425357](https://i.imgur.com/Gp5Qge5.png)

## `never`  타입의 예외

```ts
type IsNever<T> = T extends never ? true : false

type Res = IsNever<never> // never 🧐
```

위 `extedns` 의 동작에 따르면 `IsNever<Never>` 는 `true` 타입이어야 한다. 그러나 결과는 `never` 타입이다. 우리가 extends에 대해 더 알아야할 내용이 있다.  Condtional type(`SomeType extends OtherType`) `generic` type 에 적용되고 generic type에 `union` 타입을 할당하는 경우 `union` type의 각 요소에 distribute(배분) 하는 것이다. 

![image-20230604185652580](https://i.imgur.com/0rJJS3L.png)

```ts
type ToArray<Type> = Type extends any ? Type[] : never;
 
type StrArrOrNumArr = ToArray<string | number>; 
// => ToArray<string> | ToArray<number>; 
// => string[] | number[]

```

그런데 이 내용이 `never` 타입과 무슨 상관인가? . [Ryan Cavanaugh](https://twitter.com/searyanc)은 [이것](https://github.com/microsoft/TypeScript/issues/23182#issuecomment-379094672)에 대해 아래와 같이 설명했다 

- 타입스크립트는 조건부 타입에 대해 자동적으로 유니언 타입을 할당한다.
- `never`은 빈 유니언 타입이다.
- 그러므로 할당이 발생하면 할당할 것이 없으므로 조건부 타입은 `never`로 평가된다.

```
IsNever<never> // never 
```

## 의도를 표현하기 위한 방법

유일한 해결 방안은 암묵적 할당을 막고 타입 매개변수를 튜플에 래핑하는 것이다.

```
ype IsNever<T> = [T] extends [never] ? true : false;
type Res1 = IsNever<never> // 'true' ✅
type Res2 = IsNever<number> // 'false' ✅
```

실제로 위 내용은 타입스크립트 소스코드에 내장되어 있다.®
