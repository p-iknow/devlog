---
title: 'npm E404로 실패한 Changesets publish 디버깅'
date: '2026-05-12'
draft: false
category: 'issue'
tags:
  - 'github-actions'
  - 'npm'
  - 'changesets'
description: 'GitHub Actions Release workflow에서 react-use-hook-kit publish가 npm E404로 실패한 원인을 추적하고, Changesets publish step에 NODE_AUTH_TOKEN을 명시적으로 전달해 해결한 과정을 정리한다.'
lang: ko
slug: npm-e404-changesets-publish
---

## 배경

[`react-use-hook-kit`](https://github.com/practical-stack/react-use-hook-kit)은 npm에 배포되는 React hooks 패키지다. 이 패키지는 [`Release` GitHub Actions workflow](https://github.com/practical-stack/react-use-hook-kit/blob/main/.github/workflows/release.yml)에서 Changesets를 사용해 버전 태그와 npm publish를 처리한다.

2026-05-12, [`react-use-hook-kit@0.1.1`](https://www.npmjs.com/package/react-use-hook-kit/v/0.1.1)을 배포하는 과정에서 release workflow가 실패했다.

## 문제

실패 지점은 빌드나 패키징이 아니라 Changesets publish 단계였다. npm registry가 publish 요청에 대해 `E404 Not Found`를 반환했다.

```text
Publishing "react-use-hook-kit" at "0.1.1"
E404 Not Found - PUT https://registry.npmjs.org/react-use-hook-kit - Not found
The requested resource 'react-use-hook-kit@0.1.1' could not be found or you do not have permission to access it.
```

처음에는 패키지 이름, npm 권한, 토큰 값 자체가 문제인지 확인했다. 하지만 다음 항목들은 모두 정상이었다.

다음 단계들은 GitHub Actions에서 정상 통과했다.

- `pnpm install --frozen-lockfile`
- `pnpm --filter react-use-hook-kit run build`

로컬에서도 publish 대상 tarball은 정상 생성됐다.

```bash
pnpm --filter react-use-hook-kit pack --pack-destination /tmp
pnpm --filter react-use-hook-kit exec npm publish --dry-run --access public --registry=https://registry.npmjs.org
```

npm registry에는 기존 버전이 존재했다.

```text
react-use-hook-kit@0.1.0
```

임시로 workflow에 `Verify npm auth` step을 추가해 Actions 내부에서 확인했다.

```yaml
- name: Verify npm auth
  run: |
    npm whoami --registry=https://registry.npmjs.org
    npm access list collaborators react-use-hook-kit --registry=https://registry.npmjs.org
  env:
    NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

출력은 정상적이었다.

```text
p-iknow
p-iknow: read-write
```

따라서 패키지가 없거나, `secrets.NPM_TOKEN` 값이 잘못되었거나, npm 계정에 publish 권한이 없는 문제는 아니었다.

## 원인

### 헷갈렸던 신호들

npm publish 실패는 `E404 Not Found`로 표시됐다. 하지만 실제로는 패키지가 없다는 뜻이 아니라, publish 요청에서 인증이 제대로 적용되지 않았을 때도 같은 형태로 나타날 수 있다.

또 하나 헷갈렸던 점은 기존 publish step이 겉보기에는 정상적인 인증 설정처럼 보였다는 것이다. [`changesets/action`](https://github.com/changesets/action)에 `NPM_TOKEN`을 전달하고 있었기 때문이다.

```yaml
env:
  GITHUB_TOKEN: ${{ secrets.GH_ACCESS_TOKEN }}
  NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

패키지가 npm registry에 이미 존재했고, GitHub Actions 내부에서 `npm whoami`와 collaborator 권한 확인도 성공했기 때문에 문제는 더 모호해졌다. 하지만 이 확인은 `NODE_AUTH_TOKEN`을 직접 넣어 실행한 별도 검증 step이었고, 실제 Changesets publish step의 인증 경로가 동일하게 동작한다는 뜻은 아니었다.

### 토큰을 읽는 주체가 달랐다

[`actions/setup-node`](https://github.com/actions/setup-node)가 `registry-url`을 설정하면 runner에 임시 npm config가 만들어지고, workflow env에 `NPM_CONFIG_USERCONFIG`가 설정된다.

로그에서도 publish step에 다음 env가 있었다.

```text
NPM_CONFIG_USERCONFIG: /home/runner/work/_temp/.npmrc
NODE_AUTH_TOKEN: XXXXX-XXXXX-XXXXX-XXXXX
NPM_TOKEN: ***
```

이 임시 `.npmrc`는 일반적으로 `NODE_AUTH_TOKEN`을 참조한다.

```ini
//registry.npmjs.org/:_authToken=${NODE_AUTH_TOKEN}
```

여기서 두 토큰 env는 같은 secret 값을 가리킬 수 있지만, 읽는 주체가 다르다.

- `NPM_TOKEN`: [`changesets/action`의 publishing 예제](https://github.com/changesets/action#with-publishing)가 요구하는 GitHub secret 이름이다. Changesets action은 기본적으로 이 값을 사용해 npm publish용 `.npmrc`를 구성한다.
- `NODE_AUTH_TOKEN`: [`actions/setup-node`의 `registry-url` 옵션](https://github.com/actions/setup-node#readme)과 [GitHub Docs의 npm publish 예제](https://docs.github.com/en/actions/tutorials/publish-packages/publish-nodejs-packages#publishing-packages-to-the-npm-registry)에서 사용하는 env 이름이다. `setup-node`가 만든 `.npmrc`는 이 값을 참조한다.

npm 쪽 규칙도 여기에 맞물린다. [npm Docs의 `.npmrc` 문서](https://docs.npmjs.com/cli/v8/configuring-npm/npmrc/)에 따르면 `.npmrc` 안에서는 `${VARIABLE_NAME}` 형태로 환경 변수를 치환할 수 있고, `_authToken`은 registry별로 scope를 붙여 설정해야 한다.

이번 workflow에서는 `NPM_TOKEN`을 action에 넘기는 것만으로는 부족했다. 실제 publish를 수행하는 프로세스는 `changesets/action` 자체가 아니라, 그 안에서 실행되는 `pnpm changeset publish`와 `npm publish`였다.

정리하면 다음과 같다.

```text
NPM_TOKEN
  -> changesets/action이 읽음
  -> publish command를 준비하는 데 사용

NODE_AUTH_TOKEN
  -> setup-node가 만든 .npmrc에서 참조
  -> npm CLI가 registry에 publish할 때 사용
```

이 때문에 publish 요청이 인증 부족 상태로 npm registry에 전달됐고, npm은 `E404 Not Found`를 반환했다.

## 해결

[`release.yml`](https://github.com/practical-stack/react-use-hook-kit/blob/main/.github/workflows/release.yml)의 Changesets publish step에 `NODE_AUTH_TOKEN`을 명시적으로 추가했다.

```diff
 env:
   GITHUB_TOKEN: ${{ secrets.GH_ACCESS_TOKEN }}
   NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
+  NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

값은 동일한 GitHub secret을 사용하지만, 두 env 이름을 모두 넘겨 action과 npm CLI 양쪽 인증 경로를 동시에 만족시켰다.

수정 커밋은 [`d0cdf9d ci: pass npm token to release publish`](https://github.com/practical-stack/react-use-hook-kit/commit/d0cdf9d)이고, 수정 후 [`Release run: 25724365449`](https://github.com/practical-stack/react-use-hook-kit/actions/runs/25724365449)가 성공했다.

```text
Result: success
```

최종 확인:

```text
npm latest: react-use-hook-kit@0.1.1
tag: react-use-hook-kit@0.1.1
tag: v0.1.1
```

- npm package: [`react-use-hook-kit@0.1.1`](https://www.npmjs.com/package/react-use-hook-kit/v/0.1.1)
- GitHub release: [`react-use-hook-kit@0.1.1`](https://github.com/practical-stack/react-use-hook-kit/releases/tag/react-use-hook-kit%400.1.1)
- GitHub tag: [`v0.1.1`](https://github.com/practical-stack/react-use-hook-kit/releases/tag/v0.1.1)
