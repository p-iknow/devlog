---
title: JS 단축평가(short-circuit evaluation)
date: '2019-06-30T23:46:37.121Z'
template: 'post'
draft: true
slug: 'javascript/short-circuit-evaluation'
category: 'javascript'
tags:
  - 'javascript'
description: 'JS를 시작한지 얼마 안된 상태에서 Promise는 어렵다. 비동기도 어려운데 .then 과 .catch 로 전개되는 흐름, 함수(resolve, reject) 가 인자로 전달되는 풍경은 머리속을 하얗게 만든다. 물리학에 한 획을 그은 파이만 아저씨는 이렇게 복잡하고 어려운 내용을 공부할 때 실제 그 대상을 직접 만들어보면서 공부 했다고 한다. 무모하지만 필자도  Custom Promise를 만들어보며 promise를 이해해 보려고 한다. 해당 글이 promise로 인해 골머리를 앓고 있는 이들에게 조금이나마 도움이 될 수 있으면 한다. '
---
# JS 단축평가(short-circuit evaluation)

## 개요

- JS 에서 단축평가란 무엇인가? 
- 단축평가를 사용할때의 이점
- 단축평가를 사용할 때 유의할 점 

##  JS 에서 단축평가란 무엇인가?

- 단축 평가(short circuit) 

```
a = (b = 'string is truthy'); // b gets string; a gets b, which is a primitive (copy)
a = (b = { c: 'yes' }); // they point to the same object; a === b (not a copy)
```

------

`(a && b)` is logically `(a ? b : a)` and behaves like multiplication (eg. `!!a * !!b`)

`(a || b)` is logically `(a ? a : b)` and behaves like addition (eg. `!!a + !!b`)

```
(a = 0, b)` is short for not caring if `a` is truthy, implicitly return `b
```

------

```
a = (b = 0) && "nope, but a is 0 and b is 0"; // b is falsey + order of operations
a = (b = "b is this string") && "a gets this string"; // b is truthy + order of ops
```
