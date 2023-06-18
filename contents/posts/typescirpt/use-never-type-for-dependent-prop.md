---
title: 'interface의 union과 never 타입을 활용하여 서로 의존적인 prop을 가진 interface 정의하기'
date: '2023-06-19T23:46:37.121Z'
template: 'post'
draft: false
slug: 'typescript/use-union-of-interface-and-never-type-to-express-dependent-prop-in-react'
img: 'https://p-iknow.netlify.app/typescript.webp'
category: 'typescript'
tags:
  - 'typescript'
  - 'union'
  - 'interface'
  - 'never'
description: '타입스크립트의 인터페이스를 정의할 때 각각의 prop이 서로 의존적일 경우 `interface` 의 `union` 과 `never` 타입을 활용하면 원하는 타입 표현을 할 수 있다'
---

![typescript](../../../static/typescript.webp)

## 서로 의존적인 필드를 가진 `Interface` 란?

`isDark` 와 `isLight` 이라는 prop을 가진 인터페이스가 있다고 하자.

```ts
interface DependentProps {
  isDark: boolean
  isLigrht: boolean
}
```

`isDark` 가 `true` 인 경우 `isLight`는 `false` 여야 한다. `isDark` 가 `false` 인 경우 `isLight`는 `true` 여야 한다. 하나의 property의 상태가 다른 property의 결과에 영향을 미친다. 이런 경우 서로 의존적인 필드가 있다고 말한다.  사내의 리엑트 컴포넌트의  `Props` 를 정의중에 이런 의존적인 field를 가진 상황을 마주했다. 해당 상황에 대해 더 살펴보자.

## 배경

 사내에 있는 이미지를 보다 편히 쓰기위해 아래와 같은 `CustomImg` 컴포넌트를 사용한다. `resourceId`를 주입하면 dark, light mode에 따르는 cdn이미지를 추출해서 사용자의 `color-scheme` 에 맞는 이미지를 제공한다. 여기서 `resouceId` 는 사내에 보유한 모든 이미지의 주소의 `union` 으로 정의된다. 이렇게 이미지 주소를 정확하게 몰라도, 에디터의 자동 타입추론 기능을 통해 쉽게 img 주소를 작성할 수 있다.

이 타입은 언제 생성되는 것일까? cdn에 이미지를 업로드 하는 `pipe line` 에서 현재 우리가 보유한 이미지 주소를 `GraphicResourceId` 라는 타입으로 생성하고, `<CustomImg/>` 컴포넌트에서 사용한다.

```tsx
export type GraphicResourceId =
  | 'https://cdn.xxx.com/graphic/icon/account-book-badge-won.png'
  | 'https://cdn.xxx.com/graphic/icon/account-book

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet'> & {
  resourceId?: GraphicResourceId;
  forceLightColorScheme?: boolean
}
export const CutomImg = (props: Props) => {
    const {
      resourceId,
      forceLightColorScheme = false,
      ...htmlImgProps
    } = props;
    const { lightUrl, darkUrl } = getUrlOfMode(resourceId);

    return (
      <picture>
        {
          !forceLightColorScheme &&
         	<source media='(prefers-color-scheme: dark)' srcSet={darkUrl} />
      	}
        <img
          ref={ref}
          css={[dimension, customCss]}
          {...htmlImgProps}
          src={lightUrl}
        />
      </picture>
    );
  }),
);
```

## 첫번째 이슈

실제 서비스에서 `<CutomImg/>` 태그를 사용할 때는 resourceId를 직접 주입하는 일은 드물다. 대다수 이미지 url은 서버에서 내려주는 url을 그대로 CustomImg에 주입해서 사용한다. 다만 이때 편의를 위해 세팅한`GraphicResourceId` 타입이 문제가 된다.

![image-20230618234100435](https://i.imgur.com/bkezhhb.png)

서버에서 가져온`imgUrl` 은 `string` 으로 추론되기 때문에 `GraphicResourceId` 타입에 할당 할 수 없고 위와 같이 에러가 발생하게 된다. 에러를 피하기 위해서는 아래와 같이 `as` 키워드를 이용한 타입캐스팅이 불가피하다.

```tsx
const imgUrlFromSever = 'https://cdn.xxx.com/graphic/icon/account-book' as GraphicResourceId;
const Img = <CustomImg resourceId={imgUrlFromSever} />;
```

`as` keyword를 사용해야 하기 때문에 사용처에서의 편의성이 떨어진다.

## 첫번째 이슈 해결

```tsx
interface ResourceIdProp {
  resourceIdFromServer?: string;
  resourceId?: BdsGraphicResourceId;
  forceLightColorScheme?: boolean;
}
type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet'> &
  ResourceIdProp;

export const CutomImg = (props: Props) => {
    //...
);
```

이를 해결하기`resoureIdFromServer` prop을 추가했다. 이슈를 해결하기 위해서는 아래와 같은 요구사항이 있었고

> `resoureIdFromServer` 를 쓸때는  `resourceId` 를 주입하지 않아도 되며, `resourceId` 를 쓸때는  `resoureIdFromServer`  를 주입하지 않는다.

 요구사항을 만족시키기 위해 `resoureIdFromServer`,  `resourceId`  를 둘다 `optional` 로 처리했다.

![image-20230619001943583](https://i.imgur.com/UrTBw5q.png)

이제 서버에서 가져온 `imgUrl` 을 사용할 때는 `resourceIdFromServer` 를 사용하면 별도 타입에러가 발생하지 않는다. 또한 불필요한 타입 캐스팅( `as resourceId`)을 하지 않아도 된다.

## 두번째 이슈

그러나 위 수정사항으로 인해 다른 이슈가 발생한다.

```ts
interface ResourceIdProp {
  resourceIdFromServer?: string;
  resourceId?: BdsGraphicResourceId;
  forceLightColorScheme?: boolean;
}
```

`resoureIdFromServer` , `resourceId` prop 둘다 `optional ` 이기 때문에 아래와 같은 코드가 사용이 가능해진다.

```tsx
// 꼭 필요한 prop이 전달되지 않을 수 있는 이슈
<CustomImg />; // Pass
// 두가지 prop을 다 주입할 수 있는 이슈
<CustomImg resourceId={...} resoureIdFromServer={...} /> // Pass

```

타입으로 props 의 사용 유형을 제약할 수 없다보니 컴포넌트의 사용시 실수로 prop 전달을 누락하는 휴먼에러가 발생할 수 있다. 또한 두  prop을 모두 적는 경우엔 컴포넌트 안쪽에서 두 prop을 어떻게 처리할지 모르기 때문에 컴포넌트의 동작을 예측할 수 없고 코드 안쪽을 확인해야 하는 부담이 생긴다. 따라서 아래와 같은 추가 요구사항이 필요하다.

>`resoureIdFromServer` 를 쓸때는  `resourceId` 를 주입하지 않아도 되며, `resourceId` 를 쓸때는  `resoureIdFromServer`  를 주입하지 않는다. 단 이때 resourceId, resoureIdFromServer 는 동시에 `optional` type 일 수 없다.

위 요구사항을 달성하기 두 prop을 단순 `optional` 처리하는 것 이외에 다른 방법이 필요하다.

## 두번째 이슈 해결

`interface`의 `union` 그리고 `never` type을 이용하면 요구사항을 충족할 수 있다. `ResourceIdFromServerProp` 인터페이스에서는  `resourceIdFromServer`  사용시에 `resourceId` 가 `never`  임을 정의했고,  그 반대의 경우는  `ResourceIdProp` 인터페이스에 정의했다. 그후   `ResourceIdFromServerProp | ResourceIdProp` 두 인터페이스의 union을 Prop으로 만들었다.

```tsx
interface ResourceIdFromServerProp {
  resourceIdFromServer: string;
  resourceId?: never;
}
interface ResourceIdProp {
  resourceIdFromServer?: never;
  resourceId: BdsGraphicResourceId;
}
type Props = (ResourceIdFromServerProp | ResourceIdProp)
	& Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet'>;

export const CutomImg = (props: Props) => {
    //...
);
```

그후 아래와 같이 테스트를 해보자.

![image-20230619020035829](https://i.imgur.com/aGrtyyJ.png)

![image-20230619015956437](https://i.imgur.com/mbTTUJu.png)

```ts
// 잘못된 사용 케이스
const Prop_누락_케이스 = <CustomImg />; // Type Error
const Prop_동시에_사용하는_케이스 = <CustomImg resourceId='...' resourceIdFromServer='...' />
// ^ Type Error

// 정상 사용 케이스
const ResourceId만_쓰는경우 = <CustomImg resourceId='...' /> // Pass
const ResourceIdFromServer만_쓰는경우 = <CustomImg resourceIdFromServer='...' /> // Pass
```

인터페이스의 union을 통한 prop 정의로 모든 케이스의 요구사항을 만족시켰다. 위와 같이 interface의 union을 사용하는 전략을 `Tagged Union Types (Discriminated Unions)` 이라고 한다.  `Tagged Union Types`  더 자세한 내용은 [링크](https://mariusschulz.com/blog/tagged-union-types-in-typescript)에 접속하여 확인할 수 있다.

## Summery

리엑트의  `Props` 정의를 할 때  각각의 prop이 서로 의존적일 경우 `interface` 의 `union` 과 `never` 타입을 활용하면 원하는 타입 표현을 할 수 있다.
