---
title: Next.js 에서 router.query 사용시 type 정의해서 사용하기
date: '2023-03-12T23:46:37.121Z'
template: 'post'
draft: false
slug: 'next-js/apply-type-narrowing-to-router-query'
category: 'next.js'
img: 'https://imgur.com/kQii7ow.png'
tags:
  - 'next.js'
  - 'react'

description: 'next.js 를 router.query 사용할 때 불필요한 타입체크가 필요한 경우가 많다. 이때 불필요한 타입 체크 구문을 쓰지 않고 편하게 queryParam과 pathParam을 이용하는 법에 대해 알아본다.'

---
![next-js-logo](../../../static/next-js.webp)

##  Code

코드는 [링크의 샌드박스](https://codesandbox.io/p/github/p-iknow/next-boilerplate/main?file=%2Fpages%2Fexamples%2Fparams%2F%5Bid%5D%2Fbefore.tsx&selection=%5B%7B%22endColumn%22%3A28%2C%22endLineNumber%22%3A5%2C%22startColumn%22%3A28%2C%22startLineNumber%22%3A5%7D%5D&workspace=%257B%2522activeFileId%2522%253A%2522clf5gq3hy000dg3gnhumxcon6%2522%252C%2522openFiles%2522%253A%255B%2522%252FREADME.md%2522%252C%2522%252Fpages%252Fexamples%252Fparams%252F%255Bid%255D%252Fafter.tsx%2522%252C%2522%252Fpages%252Fexamples%252Fparams%252F%255Bid%255D%252Fbefore.tsx%2522%252C%2522%252Fpages%252F_app.tsx%2522%252C%2522%252Fpages%252F_document.tsx%2522%255D%252C%2522sidebarPanel%2522%253A%2522GIT%2522%252C%2522gitSidebarPanel%2522%253A%2522COMMIT%2522%252C%2522spaces%2522%253A%257B%2522clf5gq6vo000x3b6iea58z4d0%2522%253A%257B%2522key%2522%253A%2522clf5gq6vo000x3b6iea58z4d0%2522%252C%2522name%2522%253A%2522Preview%2520-%25203000%2522%252C%2522devtools%2522%253A%255B%257B%2522type%2522%253A%2522UNASSIGNED_PORT%2522%252C%2522port%2522%253A3000%252C%2522url%2522%253A%2522xskp61-3000.csb.app%2522%252C%2522key%2522%253A%2522clf5gtkh6006p3b6iksluz5fz%2522%252C%2522isMinimized%2522%253Afalse%257D%255D%257D%252C%2522clf5guzd400fg3b6ippb6o06q%2522%253A%257B%2522key%2522%253A%2522clf5guzd400fg3b6ippb6o06q%2522%252C%2522devtools%2522%253A%255B%255D%252C%2522name%2522%253A%2522Preview%2520-%25203000%2522%257D%257D%252C%2522currentSpace%2522%253A%2522clf5guzd400fg3b6ippb6o06q%2522%252C%2522spacesOrder%2522%253A%255B%2522clf5gq6vo000x3b6iea58z4d0%2522%252C%2522clf5guzd400fg3b6ippb6o06q%2522%255D%252C%2522hideCodeEditor%2522%253Atrue%257D)에서 확인하실 수 있습니다.

## Background

nextjs 에서 pathParam 과 queryParam 값에 접근 하고자 한다. URI는 다음과 같다.

[`http://doamin/examples/params/1?queryKey=queryKeyValue`](http://localhost:3000/examples/params/1?queryKey=queryKeyValue)

pathParam과 queryParam에 접근하는 코드는 다음과 같다.

```tsx
export const UseQueryParamPage:React.FC<Props> = () => {
  const router = useRouter();
  const queryValue = router.query.queryKey;
  const id = router.query.id;
	return <div tw='flex justify-center items-center h-screen' >
    <div css={tw`text-center m-auto`}>id: {id}<br />queryKey2: {queryKey2}</div>
  </div>
}
```

pathParam 인 `id` 와 queryParam 인 `queryValue` 는 아래와 같은 타입으로 추론된다.

![image-20230312224721441](https://i.imgur.com/JeNUePT.png)
![image-20230312224745117](https://i.imgur.com/0nc3PKw.png)

`pathParam` 의 경우 명시적으로 url 에 포함되어야 하고, SSR을 사용할 경우 router.isReady 상태와 무관하게 `router.query` 에는 `pathParam` 값이 담겨 있다.

`queryParam` 의  경우 `queryParam` 의 사용 용도에 따라 `string | undefined` ,  `string[]| undefiend` , `string | string[] | undefined`  로 사용될 수 있다.

## Problem

`pathParam` 값이 `undefined` 가 아님이 보장됨에도 불구하고 `router.query` 의 값이 `string | string [] | undefined` 으로 추론되기 때문에 type narrowing을 위해 불필요한 분기문이 생긴다.

```tsx
export const UseQueryParamPage:React.FC<Props> = () => {
  const router = useRouter();
  const id = router.query.id;
  const queryValue = router.query.queryKey;

  if (!isString(id) || !isArray(queryValue)) {
    return null
  }

	return <div tw='flex justify-center items-center h-screen' >
    <div css={tw`text-center m-auto`}>id: {id}<br />queryKey2: {queryValue}</div>
  </div>
}
```

![image-20230312224857453](https://i.imgur.com/Ea1uWkG.png)
> NextJs 의 타입은 `router.isReady` 가 `false` 될때, pathParam이 `undefined` 가 될 수 있는 점을 고려하여 `string | string [] | undefined` 타입으로 추론된다.

## Solution

목표는 다음과 같다.
> 각 queryKey가 특정 타입으로 추론될 것이 확실한 경우 각 key에 맞는 타입으로 추론되게 한다.

### `usePathParam`

```tsx
import { useRouter } from 'next/router';

/**
* @description In the case of pathParam, there is no chance of it being undefined,
* so we can cast it to a string type.
*/
export type ParamKeys = 'id'|'id2';
export const usePathParam = (paramKey: ParamKeys) => {
  const { query } = useRouter();
  return query[paramKey] as string;
};
```
`pathParam` 의 경우 `string` 타입이 보장되므로 `string` 으로 타입 캐스팅해준다.
![image-20230312224929352](https://i.imgur.com/HrFokPZ.png)
`usePathParam` 을 사용할 땐 위와 같이 key가 suggestion 된다.
![image-20230312224947458](https://i.imgur.com/NnpNqke.png)
`pathParam` 인 `id` 는 `string`  으로 추론되고 불필요한 분기 코드를 삭제할 수 있다.

### `useQueryParam`
```tsx
export type UrlQueryParams = {
  'queryKey'?: stirng[];
};
export const useQueryParam = <T extends keyof UrlQueryParams>(queryKey: T) => {
  const { query } = useRouter();
  return (query as UrlQueryParams)[queryKey];
};
```
`queryParam` 의 경우 각 key에 따라 리턴타입이 달라져야 한다. 따라서 generic(`T`) 을 써서 각 key 에 따라 미리 설정한 타입이 추론되도록 한다.
![image-20230312225006625](https://i.imgur.com/bJLj9Px.png)
`useQueryParam` 을 사용할 때 위와 같이 key가 suggest 된다.
![image-20230312225032602](https://i.imgur.com/3tW8Rfk.png)
`queryValue` 는 `UrlQueryParams` 에서 정의한 대로 `stirng[]` 으로 추론된다.
![image-20230312225040666](https://i.imgur.com/l9GlOpa.png)
결과적으로 불필요한 분기문을 삭제하고, 의도한대로 타입을 추론하여 사용할 수 있다.

## Caveat
`usePathParam`, `useQueryParam` 은 query 의 타입이 확실하게 보장될 때 사용할 수 있다. 타입이 확실 보장되지 않는 경우에 위 hook의 사용은 런타임 오류로 이어진다. query 타입이 보장되지 않는 상황은 다음과 같다.

페이지에 getServerSideProps 또는 getInitialProps가 없는 경우 Next.js는 페이지를 정적 HTML로  prerendering 하여 page를 `statically optimize` 한다. prerendering 이 진행되는 시점에는 router `query` object 가 비어있게 된다. 따라서 prerendering 시점에 `router.query.queryKey` 는 undefined 가 될 수 있다. 따라서 이때는 `router.isReady` 상태를 확인하여 true 가 되었을 때 비어있는 queryKey가 업데이트 됬음을 보장받아야 한다. 보다 자세한 내용은 [Next.js 의 문서](https://nextjs.org/docs/advanced-features/automatic-static-optimization#how-it-works)를 참고하자.