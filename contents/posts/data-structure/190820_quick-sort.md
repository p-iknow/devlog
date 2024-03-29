---
title: 퀵 정렬, quick sort(with JS)
date: '2019-08-20T23:46:37.121Z'
template: 'post'
draft: false
slug: 'algorithm/quick-sort'
category: 'algorithm'
tags:
  - '자료구조'
  - 'ADT'
  - 'sorting'
description: '퀵 정렬(quick sort)은 가장 애용되는 정렬 알고리즘이다. 복잡도는 O(n long n)이고, 복잡도가 동일한 여타 정렬 알고리즘보다 성능이 낮다. 병합 정렬과 마찬가지로 분할/정복 방식으로 접근한다(그러나 병합 정렬 과는 달리, 원소를 하나 가진 배열까지 잘게 쪼개지 않는다.) 이 [링크](https://visualgo.net/ko/sorting)를 통해 퀵 정렬이 어떻게 작동하는지 참고할 수 있다.
'
---

## 퀵 정렬(quick sort)?

퀵 정렬(quick sort)은 가장 애용되는 정렬 알고리즘이다. 복잡도는 O(n long n)이고, 복잡도가 동일한 여타 정렬 알고리즘보다 성능이 낮다. 병합 정렬과 마찬가지로 분할/정복 방식으로 접근한다(그러나 병합 정렬 과는 달리, 원소를 하나 가진 배열까지 잘게 쪼개지 않는다.)

이 [링크](https://visualgo.net/ko/sorting)를 통해 퀵 정렬이 어떻게 작동하는지 참고할 수 있다.

## 시간복잡도

복잡도는 O(n long n)이고, 복잡도가 동일한 여타 정렬 알고리즘보다 성능이 낮다.

![bubble-sort 시간복잡도](https://user-images.githubusercontent.com/35516239/63222527-3d7fca00-c1e4-11e9-8cbb-7e17ffeeff83.png)

## 퀵 정렬 구현

1. 배열의 중간 지점에 위치한 원소(pivot) 를 선택한다.
2. 2개의 포인터(배열의 첫 번째 원소를 가리키는 좌측 포인터, 배열의 마지막 원소를 가리키는 우측 포인터)를 생성한다. 피봇보다 더 큰 원소가 나올 때까지 좌측 포인터를 움직이고, 피봇보다 더 작은 원소가 나올 때까지 우측 포인터를 움직인 다음, 두 포인터에 해당하는 원소를 서로 교환한다. 이 과정을 좌측 포인터가 우측 포인터보다 더 커질 때까지 반복한다. 이렇게 함으로써 피봇보다 작은 원소는 좌측에, 그리고 큰 원소는 우측에 나열된다. 이 작업을 파티션(partition) 이라고 한다.
3. 그 결과 피봇을 중심으로 나뉜 두 서브배열(더 작은 원소 배열과 더 큰 원소 배열)에 대해 정렬이 끝날 때까지 위 과정을 재귀적으로 반복한다.

```js
const quickSort = (arr) => {
  quick(arr, 0, arr.length-1);
}
```

메인 함수를 선언하고 정렬할 배열과 처음/끝 인덱스(배열의 일부가 아닌, 전체 원소를 정렬해야 함을 명심하자)를 인자로 재귀함수를 호출한다.

```js
const quick = (arr, left, right) => {
  let index;

  if (arr.length > 1){
    index = partition(arr, left, right);

    if (left < index -1) {
      quick(arr, left, index-1);
    }

    if (index < right) {
      quick(arr, index, right);
    }
  }
}
```

`index` 변수는 더 작은 원소를 가진 서브배열, 더 큰 원소를 가진 서브배열로 나누어서 `quick` 함수를 재귀 호출하기 위해 선언한다. `partition` 함수의 반환 값을 `index` 에 할당한다.

배열 크기가 2 이상이면 (원소가 1개인 배열은 이미 정렬된 것으로 생각한다) , 해당 배열에 파티션 작업(전체 배열을 넘기는 첫 번째 호출)을 하여 `index` 를 얻는다.

더 작은 원소들을 가진 서브배열이 존재하면, 같은 과정을 반복한다. 더 큰 원소들을 가진 서브배열도 마찬가지로 존재하면, 똑같은 과정을 되풀이한다.

### 파티션 과정

파티션 작업을 구현한 코드를 살펴보자

```js
const partition = (arr, left, right) => {
  const mid = Marth.floor((right + left) / 2)
  const pivot = arr[mid]
  let i = left;
  let j = right;

  while (i <= j) {
    while (arr[i] < pivot) {
      i++
    }

    while (arr[j] > pivot) {
      j--
    }
    if (i <= j) {
      swap(arr, i, j);
      i++;
      j--;
    }
  }
  return i;
}
```

가장 먼저 `pivot`을 정해야 하는데, 여기에는 몇 가지 방법이 있다. 가장 간단하게는 배열의 첫 번째 원소(좌측 끝에 위치한 원소)도 가능하다. 그러나 많은 연구 결과, 거의 정렬된 상태인 배열에서 그렇게 하면 성능상 가장 나쁘다는 사실이 밝혀졌다. 무작위로 집어내거나 맨 끝의 원소를 선택하는 방법도 있는데, 여기서는 정가운데 원소를 `pivot`으로 한다. 그리고 배열의 첫 번째 원소를 `left`(하위), `right`(상위) 로 포인터 `i, j`를 각각 초기화한다.

`i, j` 의 위치가 역전될 때까지 파티션을 반복한다. `pivot` 과 같거나 `pivot` 보다 큰 원소를 찾을 때까지 좌측 포인터를 우측으로 이동시키고(`i++`), 반대로 `pivot` 과 같거나 `pivot` 보다 작은 원소를 찾을 때까지 우측 포인터를 좌측으로 계속 이동시킨다.(`j--`)

결국, 좌측 포인터가 가리키는 원소는 `pivot` 보다 크고, 우측 포인터가 가리키는 원소는 `pivot` 보다 작을 것이다. 두 포인터가 연적된어 좌측 포인터가 우측 포인터의 우측으로 넘어가지 않았다면, 두 포인터가 가리키는 원소 둘을 교환하고 같은 과정을 반복한다.

파티션 과정이 끝나면 좌측 포인터 변수를 반환하고, `quick` 함수 내부에서 이 값을 받아 서브 배열 생성 시 사용한다.

### swap

```js
const swap = (arr, index1, index2) => {
  const aux = arr[index1];
  arr[index1] = arr[index2];
  arr[index2] = aux;
}
```

## 퀵 정렬 실행

퀵 정렬의 단계별 실행 과정을 그림으로 알아보자

![퀵정렬 1단계](https://user-images.githubusercontent.com/35516239/63343091-224dbf80-c388-11e9-8534-032de7184b2c.png)

원래 배열은 `[3, 5, 1, 6, 4, 7, 2]` 이고, 퀵 정렬의 첫 번째 파티션 과정을 나타낸 그림이다.

아래 그림은 작은 원소들이 모여 있는 첫 번째 서브배열에서 파티션하는 모습을 나타낸 것이다.(7, 6은 서브 배열의 원소가 아니다)

![퀵정렬 2단계 ](https://user-images.githubusercontent.com/35516239/63343115-2da0eb00-c388-11e9-9106-9fff2872ff86.png)



그리고 다음 그림 처럼 서브 배열이 하나 더 생기는데, 이번에는 이전 서브배열보다 더 큰 원소를 가진 서브배열이다(원소 1을 가진 서브 배열은 원소가 하나뿐이므로 파티션 대상이 아니다.

![퀵정렬 3단계](https://user-images.githubusercontent.com/35516239/63343141-398cad00-c388-11e9-8cfe-610f84932a78.png)



서브배열 `[2, 3, 5, 5]`의 하위 서브배열 `[2, 3]`도 파티션을 해준다.

![퀵정렬 4단계](https://user-images.githubusercontent.com/35516239/63343159-44474200-c388-11e9-8202-2ab35f27dd04.png)



서브배열 `[2, 3, 5, 4]`의 하위 서브배열 `[5, 4]` 역시 파티션이 필요하다

![퀵정렬 5단계](https://user-images.githubusercontent.com/35516239/63343183-4f9a6d80-c388-11e9-883a-fb9df5258911.png)

마지막으로, 상위 서브배열 `[6, 7]`을 파티션하면 퀵 정렬은 마무리 된다.

## 참고

[자바스크립트 자료 구조와 알고리즘, 로이아니 그로네르 지음](http://www.yes24.com/Product/Goods/22885878)
