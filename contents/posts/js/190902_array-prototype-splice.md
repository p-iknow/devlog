---
title: Array.prototype.splice()
date: '2019-09-02T23:46:37.121Z'
template: 'post'
draft: false
slug: 'javascript/array-splice/'
category: 'javascript'
tags:
  - 'javascript'
description: 'splice() 메서드는 배열의 기존 요소를 삭제 또는 교체하거나 새 요소를 추가하여 배열의 내용을 변경한다'
---

## 들어가며

`splice()` 메서드는 배열의 기존 요소를 삭제 또는 교체하거나 새 요소를 추가하여 배열의 내용을 변경한다

## 문법

```js
 array.splice(start[, deleteCount[, item1[, item2[, ...]]]])
```

- `start`

  배열의 변경을 시작할 인덱스다. 배열의 길이보다 큰 값이라면 실제 시작 인덱스는 배열의 길이로 설정된다(array.length). 음수인 경우 배열의 끝에서부터 요소를 센다. (원점 -1, 즉 -n이면 요소 끝의 n번째 요소를 가리키며 `array.length - n`번째 인덱스와 같음). 값의 절대값이 배열의 길이 보다 큰 경우 0으로 설정된다. 

```js
const test = [1, 2, 3];
test.splice(-2, 0, "첫번째 추가"); // 끝에서 2번째, 0부터 센다.

// [1, "첫번째 추가"(2번째), 2(1번째), 3(끝에서 0번째)]

test.splice(-2, 0, "두번째 추가");
// [1, "첫번째 추가", 2, "두번째 추가"(끝에서 1번째), 3(끝에서 0번째)]

// 보통 끝에 추가하기 위해서는 array.push 를 쓴다. 


```

- `deleteCount` (Optional)

  배열에서 제거할 요소의 수다.

  `deleteCount`를 생략하거나 값이 `array.length - start`보다 크면 `start`부터의 모든 요소를 제거한다.

  `deleteCount`가 0 이하라면 어떤 요소도 제거하지 않습니다. 이 때는 최소한 하나의 새로운 요소를 지정해야 한다.

- `item1, item2, *...*` (Optional)

  배열에 추가할 요소입니다. 아무 요소도 지정하지 않으면 `splice()`는 요소를 제거하기만 한다.

### 반환 값

제거한 요소를 담은 배열. 하나의 요소만 제거한 경우 길이가 1인 배열을 반환합니다. 아무 값도 제거하지 않았으면 빈 배열을 반환한다

## 설명

만약 제거할 요소의 수와 추가할 요소의 수가 다른 경우 배열의 길이는 달라진다.