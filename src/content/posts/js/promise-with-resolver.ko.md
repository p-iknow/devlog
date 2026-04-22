---
title: 'Promise.withResolvers로 Promise executor 밖에서 resolve 다루기'
date: '2026-04-22'
draft: false
category: 'javascript'
tags:
  - 'javascript'
  - 'promise'
description: 'ECMAScript 2024에 표준으로 들어온 Promise.withResolvers는 resolve/reject를 Promise executor 밖으로 꺼낼 수 있게 해준다. overlay-kit-async의 openAsync 리팩터링 경험을 통해, 이 한 줄의 API가 왜 필요한지와 코드가 얼마나 단순해지는지 살펴본다.'
lang: ko
slug: promise-with-resolver
---

## 배경

JavaScript의 Promise에는 한 가지 불편한 제약이 있다. **`resolve`/`reject`는 Promise executor 콜백 인자로만 주어진다.**

```ts
const promise = new Promise((resolve, reject) => {
  // resolve, reject 는 여기 안에서만 잡힌다
});
```

대부분의 경우 이걸로 충분하지만, 다음처럼 "나중에, 다른 곳에서 settle하고 싶은" 상황이 생긴다. 여기서 **settle**은 Promise를 `resolve` 또는 `reject` 중 어느 쪽으로든 확정짓는 것을 뜻한다 — 즉 pending 상태를 끝내는 모든 호출이다.

- 이벤트 리스너가 특정 이벤트를 받았을 때 Promise를 resolve
- 사용자 인터랙션(클릭, 폼 제출) 결과로 Promise를 settle
- 외부에서 주입받은 콜백이 호출되면 그때 settle

이걸 위해 전통적으로 써온 패턴이 **Deferred**다.

```ts
let resolve, reject;
const promise = new Promise((res, rej) => { resolve = res; reject = rej; });
// 이제 resolve/reject 를 외부에서 호출 가능
```

그리고 이 패턴은 2024년, ECMAScript에 [`Promise.withResolvers()`](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Promise/withResolvers)라는 이름으로 **정식 채택**됐다.

```ts
const { promise, resolve, reject } = Promise.withResolvers<T>();
```

이 글은 이 패턴이 왜 필요한지, 그리고 도입하면 코드가 얼마나 달라지는지를 [`overlay-kit-async`](https://github.com/p-iknow/overlay-kit-async)의 `openAsync` 리팩터링(refactoring) 경험으로 보여준다.

> [!info] [`overlay-kit-async`](https://github.com/p-iknow/overlay-kit-async) 라이브러리란?
> [`toss/overlay-kit`](https://github.com/toss/overlay-kit)의 포크로, `overlay.openAsync`가 어떤 경로(`close`/`closeAll`/`unmount`/`unmountAll`)로 닫혀도 Promise가 항상 settle되도록 보장하는 drop-in replacement 라이브러리다. 원본은 외부에서 닫힐 때 Promise가 resolve되지 않아 메모리 누수와 `await` 데드락을 유발하는 문제가 있다([#169](https://github.com/toss/overlay-kit/issues/169)).

## 문제

`openAsync`는 오버레이(모달, 다이얼로그)를 Promise로 감싼다.

```ts
const answer = await overlay.openAsync<'yes' | 'no'>((props) => (
  <Dialog onOk={() => props.close('yes')} onCancel={() => props.close('no')} />
));
```

하나의 Promise가 settle되는 경로가 여섯 가지나 얽혀 있다.

- 사용자: `props.close(value)` / `props.reject(reason)`
- 시스템 이벤트: `close` / `closeAll` / `unmount` / `unmountAll`

어느 쪽이든 먼저 도착하면 Promise를 settle하고, 동시에 네 개의 구독(subscription)을 전부 해제해야 한다. 그런데 이런 요구들이 하나의 `Promise` executor에 모이면 의존성이 복잡하게 얽혀 흐름 파악이 어려워진다.

리팩터 전 구조는 이랬다.

```ts {6-11, 13-18, 20-25, 30-41}
function openAsync<T>(controller, options?): Promise<T | undefined> {
  return new Promise<T | undefined>((_resolve, _reject) => {
    let resolved = false;
    const hasDefaultValue = options != null && 'defaultValue' in options;

    const cleanup = () => {
      unsubscribeClose();
      unsubscribeCloseAll();
      unsubscribeUnmount();
      unsubscribeUnmountAll();
    };

    const resolve = (value: T | undefined) => {
      if (resolved) return;
      resolved = true;
      cleanup();
      _resolve(value);
    };

    const reject = (reason?: unknown) => {
      if (resolved) return;
      resolved = true;
      cleanup();
      _reject(reason);
    };

    const currentOverlayId = options?.overlayId ?? randomId();
    const defaultValue = hasDefaultValue ? options.defaultValue : undefined;

    const unsubscribeClose = subscribeEvent('close', (id) => {
      if (id === currentOverlayId) resolve(defaultValue);
    });
    const unsubscribeCloseAll = subscribeEvent('closeAll', () => {
      resolve(defaultValue);
    });
    const unsubscribeUnmount = subscribeEvent('unmount', (id) => {
      if (id === currentOverlayId) resolve(defaultValue);
    });
    const unsubscribeUnmountAll = subscribeEvent('unmountAll', () => {
      resolve(defaultValue);
    });

    open(
      (overlayProps, ...ctx) => controller({
        ...overlayProps,
        close:  (v: T)             => { resolve(v); overlayProps.close(); },
        reject: (reason?: unknown) => { reject(reason); overlayProps.close(); },
      }, ...ctx),
      { overlayId: currentOverlayId }
    );
  });
}
```

의존성을 그려보면 이렇다.

```
subscribeEvent('close', cb) ────반환값────► unsubscribeClose
        │                                         ▲
        │ 이벤트 발생 시 cb 실행                    │ cleanup()이 호출
        ▼                                         │
       cb ──호출──► resolve ──호출──► cleanup ─────┘
```

같은 `subscribeEvent` 호출이 왼쪽(콜백 등록)과 오른쪽(반환값 할당) 양쪽을 만든다. `cleanup → unsubscribeClose → subscribeEvent → cb → resolve → cleanup`으로 순환 의존성이 생긴다.

특히 `cleanup`은 **아직 선언되지 않은** `unsubscribeClose`를 참조한다.

이게 지금 동작하는 이유는 세 가지가 맞물려 있기 때문이다.

1. 클로저는 값을 복사하지 않고 변수 바인딩을 참조한다 — 콜백이 정의될 땐 TDZ 상태여도, 실제로 실행될 때는 이미 할당이 끝나 있다.
2. `subscribeEvent`는 콜백을 등록만 하지 즉시 실행하지 않는다.
3. Promise executor 실행 중에 종료 이벤트가 동기로 발생(emit)하지 않는다.

**즉 "우연히" 동작한다.** 위 조건들 중 하나만 어긋나도 `ReferenceError: Cannot access 'unsubscribeClose' before initialization`이 터진다.

### 무엇이 순환 의존성을 만드는가?

> `resolve`/`reject`는 Promise executor 콜백 인자로만 주어진다. 그래서 `resolve`를 호출해야 하는 코드는 물론, 그 코드를 뒷받침하는 구조까지 전부 같은 executor 스코프로 따라 들어올 수밖에 없다.

openAsync의 경우 executor 안에서 네 가지를 모두 처리해야 한다.

1. `resolve`/`reject`를 얻는다 — executor 안에서만 가능
2. 이벤트 구독을 등록한다 — 콜백이 `resolve`를 호출해야 하므로 같은 스코프여야 한다
3. `open()`을 호출해 오버레이를 연다
4. `subscribeEvent()`가 반환하는 해제 함수(`unsubscribe*`)를 변수에 담아둔다 — 나중에 cleanup이 호출해야 하므로

이 네 가지가 한 스코프에 모이는 순간, `cleanup`(`unsubscribe*`를 호출) → `unsubscribe*`(= `subscribeEvent(...)`의 반환값) → 그 `subscribeEvent`의 콜백(`resolve` 호출) → `resolve`(`cleanup` 호출)로 이어지는 순환 의존성이 자연스럽게 만들어진다.

**문제의 뿌리는 Promise executor의 책임이 너무 커졌다는 것이다.** executor에 원래 꼭 필요한 건 "`resolve` 노출" 하나뿐인데, 생성자 API 때문에 구독 등록·해제 함수 보관·`cleanup` 정의까지 전부 같은 스코프로 묶여버렸다.

해법은 명확하다. **`resolve`/`reject`만 executor 밖으로 꺼내면 된다.** `resolve`가 `const`로 바깥에 있으면, 나머지(구독 등록, 해제 함수 보관, cleanup 연결)는 각각 독립된 문장에서 선언 순서대로 쓸 수 있다. 순환의 원인이었던 "같은 스코프 속박" 자체가 풀리기 때문이다.

## 해결

### `promiseWithResolver` util

ES2024의 `Promise.withResolvers()`가 있다면 그대로 쓸 수 있다. 하지만 `overlay-kit`은 `target: es2016`을 유지해야 해서 그대로 쓸 수는 없다. 그래서 같은 시그니처(signature)의 유틸을 직접 만들어 `let`을 **이 한 곳에만** 가뒀다.

```ts
// utils/promise-with-resolver.ts
export function promiseWithResolver<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}
```

`let`은 JS 언어 특성상 Promise executor 밖으로 `resolve`/`reject`를 꺼내기 위해 어쩔 수 없이 필요하다. 하지만 그걸 **한 유틸에만 가둬두면**, 호출부는 `let` 없이 깨끗한 `const`만 남는다. 나중에 런타임 타깃(runtime target)이 올라가면 `Promise.withResolvers()` 한 줄로 교체할 수 있다.

### 리팩터 결과

`openAsync`의 리팩터 전후를 diff로 비교하면 이렇다.

```diff lang="ts"
  function openAsync<T>(controller, options?): Promise<T | undefined> {
-   return new Promise<T | undefined>((_resolve, _reject) => {
-     let resolved = false;
-     const hasDefaultValue = options != null && 'defaultValue' in options;
-
-     const cleanup = () => {
-       unsubscribeClose();
-       unsubscribeCloseAll();
-       unsubscribeUnmount();
-       unsubscribeUnmountAll();
-     };
-
-     const resolve = (value: T | undefined) => {
-       if (resolved) return;
-       resolved = true;
-       cleanup();
-       _resolve(value);
-     };
-
-     const reject = (reason?: unknown) => {
-       if (resolved) return;
-       resolved = true;
-       cleanup();
-       _reject(reason);
-     };
-
-     const currentOverlayId = options?.overlayId ?? randomId();
-     const defaultValue = hasDefaultValue ? options.defaultValue : undefined;
-
-     const unsubscribeClose = subscribeEvent('close', (id) => {
-       if (id === currentOverlayId) resolve(defaultValue);
-     });
-     const unsubscribeCloseAll = subscribeEvent('closeAll', () => {
-       resolve(defaultValue);
-     });
-     const unsubscribeUnmount = subscribeEvent('unmount', (id) => {
-       if (id === currentOverlayId) resolve(defaultValue);
-     });
-     const unsubscribeUnmountAll = subscribeEvent('unmountAll', () => {
-       resolve(defaultValue);
-     });
-
-     open(
-       (overlayProps, ...ctx) => controller({
-         ...overlayProps,
-         close:  (v: T)             => { resolve(v); overlayProps.close(); },
-         reject: (reason?: unknown) => {
-           reject(reason);
-           overlayProps.close();
-         },
-       }, ...ctx),
-       { overlayId: currentOverlayId }
-     );
-   });
+   const currentOverlayId = options?.overlayId ?? randomId();
+   const hasDefaultValue = options != null && 'defaultValue' in options;
+   const defaultValue = hasDefaultValue ? options.defaultValue : undefined;
+
+   const { promise, resolve, reject } = promiseWithResolver<T | undefined>();
+   const cleanup = subscribeOverlayEnd(
+     subscribeEvent,
+     currentOverlayId,
+     defaultValue,
+     resolve
+   );
+
+   open(
+     (overlayProps, ...ctx) => controller({
+       ...overlayProps,
+       close:  (v: T)             => { resolve(v); overlayProps.close(); },
+       reject: (reason?: unknown) => { reject(reason); overlayProps.close(); },
+     }, ...ctx),
+     { overlayId: currentOverlayId }
+   );
+
+   return promise.finally(cleanup);
  }
```

> [!note] 전체 수정과 diff는 [overlay-kit-async#9](https://github.com/p-iknow/overlay-kit-async/pull/9) PR에서 확인할 수 있다.

달라진 점을 하나씩 보자.

#### 1. 의존 순서가 선언 순서와 일치한다.

```
promiseWithResolver
  ↓
subscribeOverlayEnd(resolve)
  ↓
open()
  ↓
promise.finally(cleanup)
```

위에서 아래로 읽으면 된다. 바인딩이 만들어지고, 그 바인딩을 아래 줄이 쓰고, 더 아래 줄이 결과를 마무리한다. 순환이 없다.

#### 2. `let`도 `settled` 플래그도 필요 없다.

`resolve`/`reject`가 `const`로 Promise executor 바깥에 있어서, 사용자 호출이든 시스템 이벤트 핸들러든 여러 경로에서 직접 호출할 수 있다. "여러 경로가 경쟁적으로 호출해도 괜찮은가?"라는 의문이 들 수 있는데, Promise 명세상 한 번 fulfilled 또는 rejected로 확정(settle)된 뒤의 `resolve`/`reject` 호출은 모두 조용히 무시된다. 즉 두 번째 이후의 호출은 상태 전이를 일으키지 않고 no-op이 되므로, 리팩터 전 코드의 `resolved` 플래그처럼 중복 실행을 막는 수동 가드(guard flag)를 따로 둘 필요가 없다.

#### 3. Cleanup은 `promise.finally`에서 단 1회 실행된다.

Promise가 어떻게 settle되든 — 사용자 `close`든, `reject`든, 이벤트든 — `finally` 콜백은 정확히 한 번 실행된다. "settle될 때 반드시 해야 할 일"을 Promise API에 그대로 위임할 수 있다.

#### 4. TDZ에 기대던 암묵적 불변식이 사라졌다.

이제 "Promise executor 실행 중에 종료 이벤트가 동기(synchronous)로 발생하지 않는다"는 가정에 의존하지 않는다. 누가 `subscribeEvent`를 목킹(mocking)하든, emitter 구현이 바뀌든, 선언 순서만으로 올바름이 보장된다.

## 정리

`Promise.withResolvers()`(또는 같은 모양의 자체 유틸) 하나로 달라지는 것들:

- ✅ Deferred가 필요할 때 `let` 두 줄짜리 보일러플레이트가 사라진다
- ✅ `resolve`/`reject`가 `const`가 되므로 호출부 전체가 선언 순서로 읽힌다
- ✅ Promise executor 안에 갇혀 있던 로직이 바깥으로 나와 자연스럽게 분해된다
- ✅ 중복 settle 방지 플래그가 Promise API 자체로 대체된다
- ✅ Cleanup을 `promise.finally`에 맡겨 "한 번만 실행"이 자동 보장된다

다음에 Promise executor 안에서 코드가 복잡해진다고 느낀다면, 질문 하나를 던져보자.

> `resolve`를 밖으로 꺼낼 수 있다면, 이 코드가 어떻게 바뀔까?

Promise executor 밖에서 `resolve`를 다룰 수 있다는 사실 하나만으로, 선언 순서, 클로저(closure), 수명(lifetime) 관리에 관한 많은 문제가 훨씬 단순해진다. `Promise.withResolvers`가 표준에 들어온 이유도 바로 그것이다.
