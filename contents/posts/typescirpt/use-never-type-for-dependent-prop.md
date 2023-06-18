---
title: 'never type을 활용하여 서로 의존적인 props 표현하기'
date: '2023-06-18T23:46:37.121Z'
template: 'post'
draft: false
slug: 'typescript/use-never-type-to-express-dependent-prop
img: 'https://p-iknow.netlify.app/typescript.webp'
category: 'typescript'
tags:
  - 'typescript'
  - 'never'
  - 'props'
description:
  'never type을 활용하여 서로 의존적인 props를 표현하는 방법을 알아보자'

---

![typescript](/Users/youngchang/dev/personal/devlog/static/typescript.webp)

## 배경

사내에 있는 이미지를 보다 편히 쓰기위해 아래와 같은 `CustomImg` 컴포넌트를 사용한다. `resourceId`를 주입하면 dark, light mode에 따르는 cdn이미지를 추출해서 사용자의 `color-scheme` 에 맞는 이미지를 제공한다. 여기서 `resouceId` 는 사내에 보유한 모든 이미지의 주소의 `union` 으로 정의된다. 이렇게 이미지 주소를 정확하게 몰라도, 에디터의 자동 타입추론 기능을 통해 쉽게 img 주소를 작성할 수 있다. 

이 타입은 언제 생성되는 것일까?  cdn에 이미지를  업로드 하는 `pipe line` 에서 현재 우리가 보유한 이미지 주소를  `GraphicResourceId` 라는 타입으로 생성하고, `CustomImg` 컴포넌트에서 사용한다. 

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
      width,
      height,
      forceLightColorScheme = false,
      ...htmlImgProps
    } = props;
    const { lightUrl, darkUrl } = getUrlOfMode(resourceId);

    const dimension = css`
      width: ${typeof width === 'string' ? width : `${width}px`};
      height: ${typeof height === 'string' ? height : `${height}px`};
    `;

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



## 이슈

실제 서비스에서 `<CutomImg/>` 태그를 사용할 때는 resourceId를 직접 주입하는 일은 드물다. 대다수 이미지 url은 서버에서 내려주는 url을 그대로 CustomImg에 주입해서 사용한다. 다만 이때 편의를 위해 세팅한 `GraphicResourceId` 타입이 문제가 된다. 

![image-20230618234100435](https://i.imgur.com/bkezhhb.png)

서버에서 가져온`imgUrl` 은 `string` 으로 추론되기 때문에  `GraphicResourceId` 타입에 할당 할 수 없고 위와 같이 에러가 발생하게 된다. 에러를 피하기 위해서는 아래와 같이 `as` 키워드를 이용한 타입캐스팅이 불가피하다.

```tsx
const imgUrlFromSever = 'https://cdn.xxx.com/graphic/icon/account-book' as GraphicResourceId;
const Img = <CustomImg resourceId={imgUrlFromSever} />
```

`as` keyword를 사용해야 하기 때문에 사용처에서의 편의성이 떨어진다. 이를 해결하기 `resoureIdFromServer` prop을 추가해보자. 

```tsx
export type GraphicResourceId =
  | 'https://cdn.xxx.com/graphic/icon/account-book-badge-won.png'
  | 'https://cdn.xxx.com/graphic/icon/account-book


interface ResourceIdProp extends {
  /**
   * @description 서버로부터를받아온 imgUrl을 prop으로 전달할 때 쓰입니다.
   * static 하게 resourceId를 prop으로 전달할 때는 resourceId prop을 사용해주세요.
   */
  resourceIdFromServer?: never;
  /**
   * @description  bdsGraphic에서 사용될 수 있는 이미지 url로 자동으로 추론됩니다.
   * 서버에서 받아온 imgUrl을 prop으로 전달할 때는 resourceIdFromServer prop을 사용해주세요.
   */
  resourceId: BdsGraphicResourceId;
  forceLightColorScheme?: boolean;
}
type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet'> &
  ResourceIdProp;

export const CutomImg = (props: Props) => {
    const {
      resourceIdFromServer,
      resourceId,
      width,
      height,
      forceLightColorScheme = false,
      ...htmlImgProps
    } = props;
    const { lightUrl, darkUrl } = getUrlOfMode(resourceIdFromServer ?? resourceId ?? '');

    const dimension = css`
      width: ${typeof width === 'string' ? width : `${width}px`};
      height: ${typeof height === 'string' ? height : `${height}px`};
    `;

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



## `resourceId` 와 `resourceIdFromServer` 를 함께 사용하지 못하도록 막는 타입 표현법

```tsx

type Base = {
  forceLightColorScheme?: boolean;
};

interface UrlProp extends Base {
  /**
   * @description 서버로부터를받아온 imgUrl을 prop으로 전달할 때 쓰입니다.
   * static 하게 resourceId를 prop으로 전달할 때는 resourceId prop을 사용해주세요.
   */
  resourceIdFromServer: string;
  /**
   * @description resourceIdFromServer prop을 사용할 때는 사용하지 않습니다.
   */
  resourceId?: never;
}
interface ResourceIdProp extends Base {
  /**
   * @description resourceId 를 prop으로 사용할 때 사용하지 않습니다.
   */
  resourceIdFromServer?: never;
  /**
   * @description  bdsGraphic에서 사용될 수 있는 이미지 url로 자동으로 추론됩니다.
   * 서버에서 받아온 imgUrl을 prop으로 전달할 때는 resourceIdFromServer prop을 사용해주세요.
   */
  resourceId: BdsGraphicResourceId;
}
type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet'> &
  ResourceIdProp;

export const CutomImg = (props: Props) => {
    const {
      resourceIdFromServer,
      resourceId,
      width,
      height,
      forceLightColorScheme = false,
      ...htmlImgProps
    } = props;
    const { lightUrl, darkUrl } = getUrlOfMode(resourceIdFromServer ?? resourceId);

    const dimension = css`
      width: ${typeof width === 'string' ? width : `${width}px`};
      height: ${typeof height === 'string' ? height : `${height}px`};
    `;

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

위와 같이 never 타입을 이용하면 `resourceId` 와 `resourceIdFromServer` 두가지의 prop을 함께 사용할 수 없도록 타입 제한이 되고, 사용자도 누락없이 용도에 맞게 prop을 넘겨줄 수 있다.  

## Summery

prop이 각각 서로의 필드에 의존적일 경우 `interface` 의 `union` 그리고 `never` 타입을 활용하면 원하는 타입 표현을 할 수 있다. 