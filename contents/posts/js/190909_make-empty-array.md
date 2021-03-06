---
title: Array.apply(null, Array(n))
date: '2019-09-09T23:46:37.121Z'
template: 'post'
draft: false
slug: 'javascript/array-apply-null-new-array/'
category: 'javascript'
tags:
  - 'javascript'
description: 'Array.apply(null, Array(n)) 용법에 대해 알아보았다.'
---

## TLDR 

- `Array(3)` 은 `length`  는 3 이지만 비어있는 배열을 리턴한다. 해당 리턴값은 비어있기 때문에 배열이 가진 메소드를 사용할 수 없다. (iterable 하지 않다.)
- `Array.apply(null, Array(3) )` 에서 apply 메소드는 두번째 인자로 배열을 받고, 해당 배열을 spread 하여 실행한다. 결국 각 인덱스의 값이 `undefined` 인 길이 3의 배열이 만들어진다. 


## Array(3)

- 길이 값만 존재하는 빈배열 생성
- `map, filter` 등의 배열 메소드 사용시 에러 발생 

```js
Array(3); // creates [], with a length of 3
// (3) [empty × 3] (크롬 console 결과)


Array(3).map()
/* 
VM601:1 Uncaught TypeError: undefined is not a function
   at Array.map (<anonymous>)
   at <anonymous>:1:10 
*/
```

## Array.apply(null, Array(3))

- 두번째 인자를 spread 하여 실행 
- undefined로 채워진 길이 3의 배열을 리턴함 
- `map, filter` 등의 메소드 사용 가능 

```js
Array.apply(null, Array(3))
[undefined, undefined, undefined]

```

### 응용

0 부터 3까지 순차적으로 채워진 배열 만들기(index 0 부터 시작하는 것에 주의해야함)

```js
Array.apply(null, Array(4)).map((el, i) => {
  return i
})

// (4) [0, 1, 2, 3]
```

> ## 참고
> - [스텍오버플로우 답변](https://stackoverflow.com/questions/28416547/difference-between-array-applynull-arrayx-and-arrayx)
