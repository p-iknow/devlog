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