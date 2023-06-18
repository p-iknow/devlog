---
title: 'typescript는 never를 어떻게 다루고 있는가?'
date: '2023-06-04T23:46:37.121Z'
template: 'post'
draft: false
slug: 'typescript/handle-never-type-weird
img: 'https://p-iknow.netlify.app/typescript.webp'
category: 'typescript'
tags:
  - 'typescript'
  - 'never'
  - 'conditional type'
description:
  'coditional type의 맥락에서 generic에 never가 할당되면 typescript가 never를 어떻게 다루는지에 대해 이슈를 통해 알아봅니다.'
---

![typescript](../../../static/typescript.webp)

## 배경

Design system 컴포넌트들의 기본 Props을 아래와 같이 정의했다. 새로 만들 design system은 기본적으로는`headless` 이다. 확정된 경우가 아니면 별도의 스타일을 가지지 않고, 컴포넌트의 역할과 기능만 정의한다. 필요한 경우 아주 기본적인 스타일을 기본으로 제공하지만, 쉽게 override할 수 있다. 이런 정의는 스타일에 대한 유연성을 높이고 동시에 각 컴포넌트의 재사용성을 높인다. 그러나 특정 컴포넌트의 경우 스타일의 변화(variant)가 이미 정의되어있고. 사용자에게 이미 지정된 variant 내의 스타일을 쓰도록제한한다.

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

각 서비스에서 사용시에는 위 타입을 각각 쓰지 않고 `StyledProps` 만을 쓰게 만들고 싶었다. 만약 변화가 일어난다면 변화의 범위를 `StyledProps` 안으로 한정하고 싶었기 때문이다. 그럼 서비스에서는 어떻게 variant가 있는 타입과 variant가 없는 타입을 구분해서 사용할 수 있을까?

```ts
export type StyledProps<VariantUnion extends = never> = VariantUnion extends never
  ? StyledDefaultProps
  : StyledPropsWithVariant<VariantUnion>;
```

"`generic` 과 `extends` 키워드를 사용하면 우리의 목표를 달성할 수 있다. " 라고 생각했다. 하지만 결과는 예상과는 달랐다.

## 이슈

기대는 다음과 같았다. `VariantUnion` 제네릭의 `default type`으로 `never` 를 할당한다.

```ts type CompoenntWithoutVariant = StyledProps;
type CompoenntWithoutVariant = StyledProps;
```

위와 같이 타입 선언을 하면 `VariantUnion` 에는 `default type`으로 정의해둔 `never`타입이 할당된다.

```ts
type CompoenntWithoutVariant = StyledProps<never>;

// StyledProps<never> 을 풀어쓰면 다음과 같다.
never extends never
  ? StyledDefaultProps
  : StyledPropsWithVariant<VariantUnion>;
```

이제 `extends` keyword로 할당 가능성을 체크한다. `never` 타입에 할당 가능한 타입은 never 타입밖에 없다. 때문에 `StyledProps<never>` 는 `StyledDefaultProps` 로 추론되길 기대했다.



하지만 `StyledProps<never>` 는 `never` 타입으로 추론되었다. 무슨일이 일어난 걸까?

## extends keyword

원인 파악을 위해 타입정의에 사용된 `extends` 키워드에 대해 알아보자.

```ts
SomeType extends OtherType ? TrueType : FalseType;
```

`extends` 왼쪽에 있는 `SomeType` 을 `extends` 오른쪽에 있는 `OtherType`에 할당할 수 있는 경우 이 타입은 `TrueType` 이고, 할당할 수 없는 경우 `FalseType` 이다.

그렇다면 할당가능(Assignability)은 어떻게 판단할까? SomeType 이 OtherType의 subType이거나 같은 타입이면 할당 가능하다. 아래는 각 타입의 `SuperType` 과 `SupType` 을 정리한 이미지이다. `unknown` 은 모든 type의 `Supertype` 이기에 모든 타입을 `unkown` type 에 할당할 수 있다. `never` 타입은 모든 타입의 `subtype`(bottom type) 이므로 never type 이에외 어떤 타입에도 `never` type에 할당할 수 없다. 그리
고 어떤 타입에도 `never` type을 할당할 수 있다.

![image-20230604232425357](https://i.imgur.com/Gp5Qge5.png)

## `never` 타입의 특징과 예외 사항

```ts
type IsNever<T> = T extends never ? true : false;

type Res = IsNever<never>; // never 🧐
```

위 `extedns` 의 동작에 따르면 `IsNever<Never>` 는 `true` 타입이어야 한다. 그러나 결과는 `never` 타입이다. 우리가 extends에 대해 더 알아야할 내용이 있다.

```ts
type ToArray<Type> = Type extends any ? Type[] : never;

type StrArrOrNumArr = ToArray<string | number>;
// => ToArray<string> | ToArray<number>;
// => string[] | number[]
```

>  Conditional type(SomeType extends OtherType)`에 `generic` type(`<Type>`) 을 적용하고, `generic` 에`union` 타입을 할당하는 경우, 타입스크립트는 `union`type의 각 요소에개별적으로 조건문을 적용시킨다. 이것을 타입스크립트 맥락에서 `distribution(배분)` 이라 한다. [(Distribute Conditional Types 참고)](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#distributive-conditional-types)

그런데 이 내용이 `never` 타입과 무슨 상관인가? . [Ryan Cavanaugh](https://twitter.com/searyanc)은 [조건부 타입에서 generic 에 never를 할당할 경우 발생하는 현상](https://github.com/microsoft/TypeScript/issues/23182#issuecomment-379094672)에 대해 아래와 같이 설명했다

>* `never`은 `empty union`이다.
>
>  => `neve` behaves as the *empty union*
>
>* 타입스크립트는 조건부 타입에 대해 유니언 타입을 할당한다.  
>
>  => so it distributes over the conditional 
>
>* 할당이 발생하면 할당할 것이 없으므로 조건부 타입(`Conditional Type`)은 `never`로 평가된다.
>
>  =>  so it distributes over the conditional and produces another empty union (which is just `never` again)

위 내용을 타입스크립트 코드로 바꿔보면 다음과 같다. 

```typescript
type IsNumber<T> = T extends number  ? true : false;
type IsNumberResult1 = IsNumber<1 | 0>
       = <1 | '0'> extends number ? true : false;
			 // distribute 를 array의 map 문법 처럼 표현했다. 
       = <1 | '0'>.distribute(t => t extends number ? true : false); 
			 = <1 extends number ? true : false | '0' extens number ? true : false>
       = <true | false>
       = true | false
// 1 | never === '1'
// IsNumber<1> === IsNumber<1 | never>
type IsNumberResult2 = IsNumber<1>
       = <1 | never> extends number ? true : false
       = <1 | never>.distribute(t => t extends 0 ? true : false)
			 = <1 extends number ? true : false | never extends number ? true : false>
       // only union as generic in conditional type
       // never extends number ? true : false = never
       = <true | never>
       = true
// never | never === never
type IsNumberResult3 = IsNumber<never>
       = <never | never> extends number ? true : false
       = <never | never>.distribute(t => t extends 0 ? true : false)
       // only union as generic in conditional type
       // never extends number ? true : false = never 
			 = <never extends number ? true : false | never extends number ? true : false>
       = <never | never>
       = never
```

위 코드를 보면 `IsNever<never> ` 뿐만 아니라 `IsNumber<never>` 또한 `never` 타입으로 추론되는 것을 확인할 수 있다. 이것을 기반으로 `IsNever` 의 내부적 동작을 풀어써봤다.

```ts
type IsNever<T> = T extends never ? true : false;
// never | never === never
type Result = IsNever<never>
       = <never | never> extends never ? true : false
       = <never | never>.distribute(t => t extends 0 ? true : false)
			 = <never extends never ? true : false | never extends number ? true : false = true>
       // only union as generic in conditional type
       //never extends number ? true : false = never
       = <never | never>
       = never
```

결론적으로, 아래 결과가 도출된다. 

```ts
type IsNever<T> = T extends never ? true : false;
type Res = IsNever<never>; // never 🧐
```

> `string | never` 가 `never` 인 이유에 대해 궁금해 하실 분이 있을 수 있는데, 타입은 집합으로 표현될 수 있는데 `never` 는 공집합을 의미 하고 `union(|)` 은 합집합 연산자이다. 따라서 특정 집합(string)과 공집합의 집합은 특정 집합으로 귀결된다. 따라서 `string | never` 가  `never` 가 되는 것이다. 자세한 내용은 [스텍오버플로우](https://stackoverflow.com/questions/64230626/why-is-the-type-never-meaningless-in-union-types)를 참고하길 바란다. 

## `never extends never ? true:  false = true`

아마 위 설명을 보면서 타입스크립트 playground에 각 부분을 실행시켜보신 분들은 이해가 되지 않는 부분이 있을 것이다. 

```ts
never extends number ? true : false // never
```

라고 했는데 실제로는 다음과 같기 때문에다.

```ts
never extends number ? true : false // true
```

다시한번 아래 내용을 참고하자 

> `Conditional type(SomeType extends OtherType)`에 `generic` type(`<Type>`) 을 적용하고, `generic` 에`union` 타입을 할당하는 경우, 타입스크립트는 `union`type의 각 요소에개별적으로 조건문을 적용시킨다. 이것을 타입스크립트 맥락에서 `distribution(배분)` 이라 한다. [(Distribute Conditional Types 참고)](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#distributive-conditional-types)

코드로 확인해보면 다음과 같다. 

```ts
type IsNever<T> = T extends never ? true : false;

type Res1 = IsNumber<never>; // never
type Res2 = never extends number ? true : false // true
```

`union` 이 `generic`을 통해 할당된 경우가 아니라면 어떻게 동작할까?

```ts
// (1 | '0') extends number ? true : false !== 
//	| 1 extends number ? true : false 
//	| '0' extends number ? true : false
type Res1 = (1 | '0') extends number  ? true : false; // false
// distribution이 적용되지 않기 때문에 
// (1 | '0') extends (1 | '0') 일때만 true가 된다. 
type Res2 = (1 | '0') extends (1 | '0') ? true : false; // true
// 아래와 같이 generic에 union type이 적용될 때만 distribution이 작용한다.
type Res3 = IsNumber<1 | '0'>; // true | false
```

`union`이 `generic`에 할당된게 아니라면 `distribution` 이 적용되지 않는다. 이제 예외사항 까지 모두 다뤘다. 

## 의도를 표현하기 위한 방법

그렇다면 우리가 원래 의도한 대로 `IsNever<never>;  // true` 가 되게 하려면 어떻게 해야할까? 해결 방안은 암묵적인 distribution을 막고 타입 매개변수를 튜플에 래핑하는 것이다. 코드로 확인해보자. 

```
type IsNever<T> = [T] extends [never] ? true : false;
type Res1 = IsNever<never> // 'true' ✅
type Res2 = IsNever<number> // 'false' ✅
```

실제로 위 내용은 [타입스크립트 소스코드](https://github.com/microsoft/TypeScript/blob/main/tests/cases/conformance/types/conditional/conditionalTypes1.ts#L212)에 내장되어 있다.

## Summery

- `Conditional type(SomeType extends OtherType)`에 `generic` type(`<Type>`) 을 적용하고, `generic` 에`union` 타입을 할당하는 경우, 타입스크립트는 `union`type의 각 요소에개별적으로 조건문을 적용시킨다. 이것을 타입스크립트 맥락에서 `distribution(배분)` 이라 한다. [(Distribute Conditional Types 참고)](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#distributive-conditional-types)
- `Conditional type(SomeType extends OtherType)`에 `generic` type(`<Type>`) 을 적용하고, `generic` 에 `never` 를 할당할 경우 never 는 `empty union` 으로 작동한다. 
- `Conditional type(SomeType extends OtherType)` 에서 `empty union` 은 never 로 추론된다. 
- `IsNever<never>` 는 `never` 타입으로 추론된다. 



## 참고 

- [A Complete Guide To TypeScript's Never Type](https://www.zhenghao.io/posts/ts-never https://www.zhenghao.io/posts/ts-never)
- [타입스크립트의 Never 타입 완벽 가이드](https://ui.toast.com/weekly-pick/ko_20220323)
