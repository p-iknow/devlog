---
title: 'baseUrl, 왜 deprecated 되었고, 이제 무엇을 해야 할까'
date: '2026-04-21'
draft: false
img: 'https://p-iknow.netlify.app/typescript.webp'
category: 'typescript'
tags:
  - 'typescript'
description: 'TypeScript 6에서 `baseUrl`이 deprecated 되었다. 이 글에서는 `baseUrl`이 원래 어떤 역할을 했는지, TypeScript 팀은 왜 deprecated 했는지, 그리고 이제 사용자는 무엇을 해야 하는지 정리한다.'
lang: ko
slug: baseurl-deprecation
---

![typescript](/typescript.webp)

## 배경

한동안 너무 자연스럽게 써왔던 `baseUrl`이 TypeScript 6에서 deprecated 되었다. 이 글은 pnpm workspace 모노레포를 예시로 삼되, 더 일반적인 관점에서 `baseUrl`이 예전에는 어떻게 동작했는지, TypeScript 팀은 왜 deprecated 하는지, 그리고 이제 사용자는 무엇을 해야 하는지 정리한다.

관련 배경은 [TSConfig `baseUrl` 문서](https://www.typescriptlang.org/tsconfig/baseUrl.html), [TypeScript 6.0 release notes](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-6-0.html#deprecated---baseurl), 그리고 [deprecation issue #62207](https://github.com/microsoft/TypeScript/issues/62207)에서 직접 확인할 수 있다.

## 먼저 결론부터

- `baseUrl`은 deprecated 되었다.
- `paths`가 필요하다면 `baseUrl` 없이도 쓸 수 있다.
- 과거에 `baseUrl`이 하던 prefix 역할은 `paths` 값에 직접 적는 쪽이 더 명확하다.
- 패키지 간 경계는 가능하면 `tsconfig paths`보다 **실제 package import**와 `package.json exports`로 표현하는 편이 낫다.

즉, 대부분의 프로젝트에서 해야 할 일은 다음과 같다.

> `baseUrl`을 제거하고, 필요한 `paths`만 명시적으로 남긴다. 그리고 cross-package import는 실제 패키지 경계로 옮긴다.

이 글은 왜 이런 결론에 도달했는지를, 예전 동작부터 migration action까지 순서대로 설명한다.

## `baseUrl`은 원래 무엇이었나

예전의 `baseUrl`은 겉으로 보기에는 꽤 단순했다. 많은 팀이 아래처럼 썼고, 실제로도 한동안 큰 문제 없이 굴러갔다.

```json
{
  "compilerOptions": {
    "baseUrl": "./src",
    "paths": {
      "@app/*": ["app/*"],
      "@lib/*": ["lib/*"]
    }
  }
}
```

대부분의 개발자는 이 설정을 이렇게 이해했다.

- `@app/*`는 `./src/app/*`로 resolve 된다.
- `@lib/*`는 `./src/lib/*`로 resolve 된다.

즉, `baseUrl`은 **`paths`의 공통 prefix** 정도로 받아들여졌다. 실제로 많은 블로그 글, 예제 프로젝트, 템플릿들도 이 관점으로 작성되었다. 이 해석 자체는 틀리지 않았지만, 우리가 알던 동작과 다른 암묵적인 부분이 숨어 있다.

## 이슈: `baseUrl`이 두 가지 역할을 동시에 했다

문제는 실제 TypeScript의 해석이 우리가 흔히 기억하는 것보다 넓었다는 점이다. `baseUrl`은 공식적으로 두 가지 일을 했다. 이 배경은 [TypeScript 6.0 release notes](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-6-0.html#deprecated---baseurl)와 [issue #62207](https://github.com/microsoft/TypeScript/issues/62207)에서 설명된다.

### 1. `paths` 값의 prefix 역할

이건 대부분이 알고 있던 기능이다.

```json
{
  "compilerOptions": {
    "baseUrl": "./src",
    "paths": {
      "@app/*": ["app/*"]
    }
  }
}
```

여기서 `@app/foo`는 실질적으로 `./src/app/foo`를 가리키는 식으로 해석되었다.

### 2. bare import에 대한 lookup root 역할

문제는 이 두 번째 기능이었다. 예를 들어 개발자는 `@app/*`만 alias로 열어두고 싶었을 수 있다. 그런데 `baseUrl: "./src"`가 있으면, TypeScript는 특정 bare import를 `./src` 아래에서 찾으려 하기도 했다.

즉, 이런 코드가:

```ts
import something from 'someModule.js'
```

개발자가 명시적으로 `paths`에 넣지 않았더라도, TypeScript가 `./src/someModule.js` 같은 경로를 후보로 보게 되는 일이 있었다.

겉으로 보면 별 차이 없어 보이지만, 여기서부터 오해가 생긴다. 개발자는 "나는 alias 두 개만 만든 줄 알았는데", TypeScript는 "아니, 너는 `./src`를 해석 기준점(resolution base)으로 하나 더 열어둔 거야"라고 이해했던 셈이다. 바로 이 간극이 deprecation의 출발점이다.

## TypeScript 팀은 왜 이걸 deprecated 했나

핵심 이유는 **설정의 의미가 너무 암묵적이었기 때문**이다. TypeScript 팀은 이 점을 [deprecation issue #62207](https://github.com/microsoft/TypeScript/issues/62207)와 [PR #62509](https://github.com/microsoft/TypeScript/pull/62509)에서 분명하게 드러냈다.

### 1. 개발자가 명시적으로 설정하지 않은 import까지 해석 대상(resolution target)으로 삼았다

대부분의 사용자는 `baseUrl`을 `paths`의 helper 정도로 이해했다. 하지만 실제로는 `paths`에 적어두지 않은 bare import까지도 해석 후보(resolution candidate)에 넣을 수 있었다. 문제의 핵심이 단순히 "좀 더 넓게 동작했다"가 아니라 **개발자가 열어둔 줄도 몰랐던 해석 경로(resolution path)가 생겼다**는 데 있다.

예를 들어 설정이 이렇게 있다고 하자.

```json
{
  "compilerOptions": {
    "baseUrl": "./src",
    "paths": {
      "@app/*": ["app/*"],
      "@lib/*": ["lib/*"]
    }
  }
}
```

많은 개발자는 이 설정을 보고 이렇게 생각한다.

- `@app/*`만 `./src/app/*`로 간다
- `@lib/*`만 `./src/lib/*`로 간다
- 그 외 bare import는 평소처럼 package resolution을 따른다

하지만 TypeScript는 다음 코드도 `./src/someModule.js` 같은 후보로 해석하려고 시도할 수 있다.

```ts
import something from 'someModule.js'
```

즉, 개발자는 `@app/*`, `@lib/*`만 열어둔 줄 알았는데, 실제로는 `./src` 전체가 추가적인 lookup root처럼 작동했던 셈이다.

### 2. TypeScript는 import를 찾았지만, 실제 실행 환경(runtime)은 같은 import를 이해하지 못할 수 있었다

이 표현이 더 정확한 이유는, 문제를 "추상적인 불일치"가 아니라 **누가 무엇을 찾았고, 누가 무엇을 못 찾았는지**로 드러내기 때문이다.

예를 들어 아래와 같은 설정이 있다고 하자.

```json
{
  "compilerOptions": {
    "baseUrl": "./src",
    "paths": {
      "@app/*": ["app/*"],
      "@lib/*": ["lib/*"]
    }
  }
}
```

그리고 코드에 이런 import가 있다고 하자.

```ts
import something from 'someModule.js'
```

이 상황에서 벌어질 수 있는 일은 다음과 같다.

- **TypeScript**: `baseUrl` 때문에 `./src/someModule.js`를 후보로 보고, import를 찾았다고 판단한다
- **런타임 / 번들러**: `baseUrl`이라는 tsconfig 규칙을 그대로 따르지 않기 때문에, 같은 bare import를 보고 `node_modules`나 자신이 아는 해석 규칙만 따른다
- **결과**: 에디터와 타입체크는 통과했는데, 실제 실행 시점에는 모듈을 찾지 못한다

조금 더 실무적으로 쓰면 이런 상황이다.

```ts
// src/main.ts
import { readConfig } from 'config/load'
```

```json
{
  "compilerOptions": {
    "baseUrl": "./src"
  }
}
```

TypeScript는 `src/config/load.ts`를 찾을 수 있어서 조용히 넘어갈 수 있다. 하지만 Node.js나 번들러가 같은 규칙을 모르면, 런타임에서는 `'config/load'`를 패키지 이름처럼 해석하려 하다가 실패할 수 있다.

즉, 문제의 본질은 `baseUrl`이 **TypeScript 안에서는 import를 해결해줬지만, 그 import 문자열 자체를 런타임이 이해 가능한 형태로 바꿔주지는 않았다**는 데 있다. 이 점은 [TSConfig `baseUrl` 문서](https://www.typescriptlang.org/tsconfig/baseUrl.html)와 module names are emitted as written라고 설명하는 [issue #26557](https://github.com/microsoft/TypeScript/issues/26557) 맥락과도 맞닿아 있다.

### 3. 현대 생태계의 방향과 맞지 않았다

오늘날 모듈 경계(module boundary)는 예전보다 훨씬 명확하게 표현된다.

- package manager workspace
- `package.json`의 `exports`
- bundler/module resolution 규칙
- Node.js의 표준 package resolution

이런 시대에는 하나의 tsconfig 옵션이 조용히 lookup root까지 바꾸는 방식이 오히려 혼란을 만든다. TypeScript 팀은 그래서 `baseUrl`의 애매한 의미를 계속 끌고 가기보다, **명시적인 `paths`와 명시적인 패키지 경계(package boundary)** 쪽으로 방향을 잡았다. 이건 단순히 옵션 하나를 없애는 일이 아니라, "TypeScript만 아는 암묵 규칙"보다 "도구들이 함께 이해하는 명시적 경계"를 선호하겠다는 방향 전환에 가깝다.

## `paths`는 오래전부터 `baseUrl` 없이도 쓸 수 있었다

많은 팀이 오랫동안 이렇게 생각했다.

> `paths`를 쓰려면 `baseUrl`이 꼭 필요하다.

하지만 최신 TypeScript 관점에서는 이 전제가 이미 오래전에 깨졌다. [TSConfig `baseUrl` 문서](https://www.typescriptlang.org/tsconfig/baseUrl.html)에도 나오듯이, `paths`는 오래전부터 `baseUrl` 없이 사용할 수 있다. 그래서 이제 권장되는 방식은 이렇게 바뀐다.

### 예전 방식

```json
{
  "compilerOptions": {
    "baseUrl": "./src",
    "paths": {
      "@app/*": ["app/*"],
      "@lib/*": ["lib/*"]
    }
  }
}
```

### 지금 권장 방식

```json
{
  "compilerOptions": {
    "paths": {
      "@app/*": ["./src/app/*"],
      "@lib/*": ["./src/lib/*"]
    }
  }
}
```

차이는 단순해 보이지만 의미는 크다.

- 예전: `baseUrl`이 숨어서 prefix와 lookup root를 같이 제공
- 지금: `paths`에 원하는 매핑을 **그대로 적는다**

즉, 설정을 읽는 사람이 "이 alias가 정확히 어디로 가는지"를 바로 이해할 수 있다.

## 이슈 해결: 지금 무엇을 해야 하나

여기서부터는 실제로 무엇을 해야 하는지를 다룬다. 이 부분은 [TypeScript 6.0 release notes](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-6-0.html#deprecated---baseurl)와 [6.0 migration guide issue #62508](https://github.com/microsoft/TypeScript/issues/62508)를 기준으로 정리해보면 더 명확해진다.

### 1) 먼저 내 프로젝트의 `baseUrl`이 어떤 역할이었는지 구분한다

대부분은 두 경우 중 하나다.

**경우 A: `paths`의 prefix로만 사용했다**

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

또는:

```json
{
  "compilerOptions": {
    "baseUrl": "./src",
    "paths": {
      "@/*": ["*"]
    }
  }
}
```

이 경우에는 거의 항상 **`baseUrl` 제거 + `paths` 명시화**로 정리하면 된다. TypeScript 팀이 제시하는 방향도 사실상 이쪽이다.

**경우 B: 실제 lookup root처럼 기대하고 있었다**

즉, 명시적인 `paths`가 없는데도 `baseUrl` 덕분에 bare import가 잡히는 패턴이 코드베이스에 섞여 있었다면, 그건 단순 치환이 아니라 **의존 관계(dependency)를 다시 드러내는 작업**이 필요하다. 이 경우는 다음 중 하나를 선택해야 한다.

- 필요한 alias를 `paths`에 명시적으로 추가한다
- 내부 import를 상대 경로나 명확한 alias로 바꾼다
- 아예 package import 구조로 옮긴다

### 2) 대부분의 경우 `baseUrl`은 제거한다

이제 TypeScript 6 이후 기준에서는 `baseUrl`을 새로 도입할 이유가 거의 없다. 특히 이런 패턴은 지금 바로 걷어내도 되는 경우다.

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "~/*": ["./src/*"]
    }
  }
}
```

여기서는 `baseUrl`이 사실상 아무 중요한 의미도 추가하지 않는다. `paths`가 이미 원하는 경로를 충분히 설명하고 있기 때문이다. 그래서 이렇게 단순화하면 된다.

```json
{
  "compilerOptions": {
    "paths": {
      "~/*": ["./src/*"]
    }
  }
}
```

### 3) `paths`는 어디까지 써도 되는지 선을 긋는다

이 지점이 특히 모노레포에서 중요하다.

**권장되는 경우: 패키지 내부 / 앱 내부 alias**

```ts
import { Header } from '~/components/header'
import { cn } from '@/lib/utils'
```

이건 현재 앱이나 패키지 안에서만 쓰는 로컬 convenience alias다. 상대 경로 지옥(relative path hell)을 줄이는 데 꽤 유용하다.

**주의가 필요한 경우: 패키지 간 경계**

예를 들어 루트 tsconfig에 이런 식으로 적는 구조는 장기적으로 조심해야 한다.

```json
{
  "compilerOptions": {
    "paths": {
      "@repo/shared/*": ["packages/shared/src/*"],
      "@repo/ui/*": ["packages/ui/src/*"]
    }
  }
}
```

이렇게 하면 TypeScript는 편해질 수 있지만, 런타임/빌드/배포 경계가 흐려진다. "패키지 import"처럼 보이지만 사실은 tsconfig가 만든 가상 경계(virtual boundary)에 기대는 셈이기 때문이다. 그래서 최신 기준에서는 이렇게 나누는 편이 더 낫다.

- **패키지 내부 이동**: `paths`
- **패키지 간 연결**: workspace dependency + `package.json exports` + 실제 package import

## pnpm workspace 모노레포에서는 왜 이 구분이 더 중요할까

pnpm workspace는 내부 패키지를 실제 패키지처럼 다루게 만든다. 즉, `@repo/shared` 같은 import를 tsconfig alias가 아니라 **실제 dependency 관계**로 표현할 수 있다. 그래서 모노레포에서는 `baseUrl`/`paths`를 "전역 연결 도구"로 키우기보다, package manager와 `exports`가 이해하는 경계 쪽으로 가는 것이 훨씬 자연스럽다.

이 방식의 장점은 명확하다.

- **패키지 경계가 드러난다**: 어떤 앱이 어떤 패키지에 의존하는지가 `package.json`에 나타난다.
- **TypeScript만 맞는 구성이 줄어든다**: tsconfig에만 있는 가상 alias보다, package manager와 bundler가 함께 이해하는 경계가 훨씬 안정적이다.
- **`exports`와 함께 공개 API를 명시할 수 있다**: 패키지 내부 아무 파일이나 import하게 두는 대신, 무엇이 공개 API인지 `package.json`에서 선언할 수 있다.

즉, 모노레포일수록 `paths`를 전역 연결 도구로 쓰기보다 **실제 package import 체계**로 가는 쪽이 더 건강하다.

## `ignoreDeprecations: "6.0"`는 써도 되나

된다. 하지만 의미를 정확히 이해해야 한다. [TypeScript 6.0 release notes](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-6-0.html#deprecated---baseurl)와 [migration guide issue #62508](https://github.com/microsoft/TypeScript/issues/62508) 기준으로 보면, 이 옵션은 해결책이라기보다 유예책(stopgap)에 가깝다.

```json
{
  "compilerOptions": {
    "ignoreDeprecations": "6.0"
  }
}
```

이건 migration을 끝낸 것이 아니라, 경고를 잠시 미뤄두는 것이다. 따라서 아래 상황이 아니라면 장기적인 해결책으로 여기면 안 된다.

- tsconfig가 많아서 한 번에 바꾸기 어렵다
- 대규모 코드베이스라 단계적 migration이 필요하다
- 일단 CI를 살려두고 후속 작업을 해야 한다

반대로 `baseUrl: "."` 수준의 단순한 패턴이라면, 보통은 그냥 제거하는 편이 더 낫다.

## 실무용 의사결정 기준

복잡하게 생각하지 않고 아래 기준으로 정리하면 된다.

- `baseUrl`이 있다 → 먼저 제거 가능한지 본다.
- `paths`가 있다 → `baseUrl`에 기대지 않도록 값을 명시적으로 적는다.
- alias가 패키지 내부용이다 → 유지 가능하다.
- alias가 패키지 간 import를 대신하고 있다 → package import + workspace dependency + `exports` 구조로 옮기는 편이 낫다.
- TypeScript만 이해하고 런타임은 모르는 alias다 → bundler/runtime 설정까지 같이 점검한다.

## Summary

`baseUrl` deprecation의 본질은 "옵션 하나가 사라진다"가 아니다. 더 정확히 말하면 다음 변화다.

> 암묵적인 해석 규칙(resolution rules)을 줄이고, alias와 패키지 경계를 더 명시적으로 표현하라.

예전의 `baseUrl`은 편리했지만, 실제로는 꽤 많은 동작을 뒤에 숨기고 있었다.

- `paths`의 prefix 역할
- bare import lookup root 역할

이 두 가지가 한 옵션 안에 섞여 있었기 때문에, 개발자가 이해한 설정과 TypeScript가 실제로 수행한 해석 사이에 차이가 생겼다. 그래서 지금 사용자가 해야 할 action은 명확하다.

1. `baseUrl`이 정말 필요한지 다시 본다.
2. 대부분의 경우 `baseUrl`은 제거한다.
3. 필요한 alias는 `paths`에 명시적으로 적는다.
4. 패키지 간 경계는 실제 package import와 `exports`로 옮긴다.

pnpm workspace 모노레포라면 이 방향은 특히 잘 맞는다. workspace 자체가 이미 "모듈 경계는 패키지로 표현하라"는 철학과 잘 맞기 때문이다.

### 짧은 체크리스트

- [ ] `baseUrl`이 있으면 먼저 제거 가능한지 확인했다
- [ ] `paths`는 `baseUrl` 없이 읽히도록 명시적으로 적었다
- [ ] `paths`를 cross-package import 용도로 남용하지 않았다
- [ ] 패키지 간 의존은 `workspace:*`, package import, `exports`로 표현했다
- [ ] TypeScript와 bundler가 같은 alias 규칙을 이해하는지 확인했다

## 참고

- [TSConfig `baseUrl` 문서](https://www.typescriptlang.org/tsconfig/baseUrl.html)
- [TypeScript 6.0 release notes - `baseUrl` deprecation](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-6-0.html#deprecated---baseurl)
- [Deprecate, remove support for `baseUrl` - issue #62207](https://github.com/microsoft/TypeScript/issues/62207)
- [6.0 Migration Guide - issue #62508](https://github.com/microsoft/TypeScript/issues/62508)
- [Deprecate `baseUrl` - PR #62509](https://github.com/microsoft/TypeScript/pull/62509)
