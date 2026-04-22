---
title: 'Handling resolve Outside the Promise Executor with Promise.withResolvers'
date: '2026-04-22'
draft: false
category: 'javascript'
tags:
  - 'javascript'
  - 'promise'
description: 'Standardized in ECMAScript 2024, Promise.withResolvers lets you pull resolve/reject out of the Promise executor. Through an openAsync refactor in overlay-kit-async, this post looks at why this one-line API is needed and how much it simplifies the code.'
lang: en
slug: promise-with-resolver
---

## Background

JavaScript's Promise has one awkward constraint: **`resolve`/`reject` are only ever handed to you as arguments of the Promise executor callback.**

```ts
const promise = new Promise((resolve, reject) => {
  // resolve and reject are captured only in here
});
```

That's enough for most cases, but situations like "I want to settle this later, from somewhere else" do come up. Here **settle** means committing a Promise to either `resolve` or `reject` — that is, any call that ends the pending state.

- Resolving a Promise when an event listener receives a specific event
- Settling a Promise based on a user interaction (click, form submit)
- Settling only when an externally injected callback fires

The traditional pattern for this is the **Deferred**.

```ts
let resolve, reject;
const promise = new Promise((res, rej) => { resolve = res; reject = rej; });
// resolve/reject can now be called from outside
```

In 2024, this pattern was **officially adopted** into ECMAScript as [`Promise.withResolvers()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/withResolvers).

```ts
const { promise, resolve, reject } = Promise.withResolvers<T>();
```

This post walks through why the pattern is needed and how much code shifts once you adopt it, using the `openAsync` refactor in [`overlay-kit-async`](https://github.com/p-iknow/overlay-kit-async) as the example.

> [!info] What is [`overlay-kit-async`](https://github.com/p-iknow/overlay-kit-async)?
> A fork of [`toss/overlay-kit`](https://github.com/toss/overlay-kit) and a drop-in replacement that guarantees `overlay.openAsync` always settles its Promise, no matter which path (`close`/`closeAll`/`unmount`/`unmountAll`) closes it. The original has a bug where the Promise never resolves when the overlay is closed externally, causing memory leaks and `await` deadlocks ([#169](https://github.com/toss/overlay-kit/issues/169)).

## The problem

`openAsync` wraps an overlay (modal, dialog) in a Promise.

```ts
const answer = await overlay.openAsync<'yes' | 'no'>((props) => (
  <Dialog onOk={() => props.close('yes')} onCancel={() => props.close('no')} />
));
```

A single Promise can be settled through six tangled paths.

- User-driven: `props.close(value)` / `props.reject(reason)`
- System events: `close` / `closeAll` / `unmount` / `unmountAll`

Whichever arrives first should settle the Promise and, at the same time, tear down all four subscriptions. But when all of these requirements pile into a single `Promise` executor, the dependencies get tangled and the flow becomes hard to follow.

Before the refactor, the structure looked like this.

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

Sketching the dependencies looks like this.

```
subscribeEvent('close', cb) ──return value──► unsubscribeClose
        │                                         ▲
        │ cb runs on event                        │ called by cleanup()
        ▼                                         │
       cb ──calls──► resolve ──calls──► cleanup ──┘
```

The same `subscribeEvent` call produces both sides: the callback registration on the left and the return-value assignment on the right. That gives you a cycle: `cleanup → unsubscribeClose → subscribeEvent → cb → resolve → cleanup`.

Notably, `cleanup` references `unsubscribeClose`, which **has not been declared yet**.

The only reason this works right now is that three things line up at once.

1. Closures don't copy values; they reference variable bindings — when the callback is defined the binding is in the TDZ, but by the time it actually runs the assignment has already happened.
2. `subscribeEvent` only registers the callback; it doesn't invoke it immediately.
3. No termination event is emitted synchronously while the Promise executor is still running.

**In other words, it works "by coincidence."** Break any one of those conditions and you get `ReferenceError: Cannot access 'unsubscribeClose' before initialization`.

### What creates the cycle?

> `resolve`/`reject` are only ever handed to you as arguments of the Promise executor callback. So the code that needs to call `resolve` — along with everything that supports it — has no choice but to live inside the same executor scope.

For `openAsync`, four things have to be handled inside the executor.

1. Obtain `resolve`/`reject` — only possible inside the executor.
2. Register event subscriptions — their callbacks need to call `resolve`, so they must share the scope.
3. Call `open()` to open the overlay.
4. Store the unsubscribe functions (`unsubscribe*`) returned by `subscribeEvent()` in variables — so `cleanup` can call them later.

The moment these four converge in one scope, you naturally get the cycle: `cleanup` (calls `unsubscribe*`) → `unsubscribe*` (= return value of `subscribeEvent(...)`) → the callback passed to that `subscribeEvent` (calls `resolve`) → `resolve` (calls `cleanup`).

**The root cause is that the Promise executor is doing too much.** All the executor strictly needs to do is "expose `resolve`," but the constructor API forces subscription registration, unsubscribe-handle storage, and `cleanup` definition into the same scope.

The fix is clear. **Pull `resolve`/`reject` out of the executor.** Once `resolve` lives in an outer `const`, the rest — registering subscriptions, storing unsubscribe handles, wiring `cleanup` — can each sit in its own statement and be written in declaration order. The shared-scope binding that created the cycle is simply dissolved.

## The solution

### A `promiseWithResolver` utility

If you have ES2024's `Promise.withResolvers()`, use it directly. But `overlay-kit` has to stay on `target: es2016`, so that's not an option. Instead, I wrote a utility with the same signature that keeps `let` confined to **this one place**.

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

`let` is unavoidable here — it's how the language lets you smuggle `resolve`/`reject` out of the Promise executor. But by **quarantining it in a single utility**, every call site is left with clean `const`s and no `let`. Later, once the runtime target moves up, you can swap the utility for a single `Promise.withResolvers()` call.

### The refactor

Before and after diff of `openAsync`:

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

> [!note] The full change set and diff are available in [overlay-kit-async#9](https://github.com/p-iknow/overlay-kit-async/pull/9).

Let's go through what changed.

#### 1. Dependency order matches declaration order.

```
promiseWithResolver
  ↓
subscribeOverlayEnd(resolve)
  ↓
open()
  ↓
promise.finally(cleanup)
```

You can read it top to bottom. A binding is created, the next line uses it, the line after that wraps up the result. No cycle.

#### 2. No more `let`, no more `settled` flag.

Because `resolve`/`reject` are `const`s living outside the Promise executor, they can be called directly from many paths — user-initiated calls or system event handlers. You might wonder: "Is it fine for multiple paths to race into the call?" By the Promise spec, once a Promise is fulfilled or rejected, any subsequent `resolve`/`reject` calls are silently ignored. Second and later calls are no-ops — they don't trigger state transitions — so there's no need for the manual guard flag (`resolved`) the original code used to prevent double execution.

#### 3. Cleanup runs exactly once, in `promise.finally`.

No matter how the Promise settles — user `close`, `reject`, or a system event — the `finally` callback runs exactly once. You can offload "work that must happen on settle" to the Promise API itself.

#### 4. The implicit invariant that leaned on TDZ is gone.

The code no longer assumes "no termination event is emitted synchronously while the Promise executor is running." Whoever mocks `subscribeEvent`, however the emitter is rewritten, correctness now follows from declaration order alone.

## Takeaways

What changes with `Promise.withResolvers()` (or an equivalent home-grown utility):

- ✅ The two-line `let` boilerplate for a Deferred disappears.
- ✅ `resolve`/`reject` become `const`, so the whole call site reads in declaration order.
- ✅ Logic that was trapped inside the Promise executor can live outside and decompose naturally.
- ✅ The "prevent double settle" guard flag is replaced by the Promise API itself.
- ✅ Cleanup handed to `promise.finally` is guaranteed to run exactly once, automatically.

The next time code inside a Promise executor starts to feel tangled, ask yourself:

> What would this code look like if I could pull `resolve` outside?

Being able to handle `resolve` outside the Promise executor alone makes many problems — declaration order, closures, lifetime management — noticeably simpler. That's exactly why `Promise.withResolvers` made it into the standard.
