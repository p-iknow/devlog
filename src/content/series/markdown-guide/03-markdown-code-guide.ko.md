---
title: '마크다운 코드 스타일 가이드'
slug: 'markdown-code-guide'
date: '2025-05-27'
part: 3
draft: false
series: 'markdown-guide'
tags:
  - 'markdown'
  - 'code'
description: 'Astro에서 Markdown 콘텐츠를 작성할 때 사용할 수 있는 기본적인 Markdown 문법의 예시입니다.'
lang: ko
---

### 코드 에디터 프레임

문법:

````md title="editor-example.md" ins=/title=".*?"/ ins=/<!--.*?-->/
```js title="my-test-file.js"
console.log("Title attribute example");
```

```html
<!-- src/content/index.html -->
<div>File name comment example</div>
```
````

결과:

```js title="my-test-file.js"
console.log("Title attribute example");
```

```html
<!-- src/content/index.html -->
<div>File name comment example</div>
```

### 터미널 프레임

터미널 세션이나 shell 스크립트에 일반적으로 사용되는 언어 식별자(`ansi`, `bash`, `bat`, `batch`, `cmd`, `console`, `powershell`, `ps`, `ps1`, `psd1`, `psm1`, `sh`, `shell`, `shellscript`, `shellsession`, `zsh`)가 포함된 코드 블록을 만나면, Expressive Code는 사용할 프레임 유형을 감지하기 위해 추가 검사를 수행합니다:

- 코드 블록이 opening code fence의 `title` 속성에 shell 스크립트 파일명을 포함하거나 [파일명 주석](#file-name-comments)을 포함하거나, 코드가 shebang(`#!`)으로 시작하는 경우, 터미널 세션이 아닌 스크립트 파일로 간주되며, 파일명이 제공된 경우 코드 에디터 프레임으로 렌더링되고, 그렇지 않으면 일반 코드 블록으로 렌더링됩니다.
- 다른 모든 경우에는 코드 블록이 터미널 세션으로 간주되어 터미널 프레임으로 렌더링됩니다.

코드 에디터 프레임과 달리 터미널 프레임은 제목이 필요하지 않습니다. 제목 표시줄은 항상 렌더링되며, `title` 속성을 사용하여 선택적으로 제목을 추가할 수 있습니다:

````md ins=/title=".*?"/
```bash
echo "This terminal frame has no title"
```

```powershell title="PowerShell terminal example"
Write-Output "This one has a title!"
```
````

렌더링된 결과는 다음과 같습니다:

```bash
echo "This frame has no title"
```

```powershell title="PowerShell terminal example"
Write-Output "This one has a title!"
```

### 전체 라인 및 라인 범위 표시

코드 블록의 메타 정보에 **중괄호 안에 라인 번호**를 추가하여 라인을 표시할 수 있습니다. 라인 번호는 VS Code 및 기타 인기 에디터와 마찬가지로 1부터 시작합니다.

단일 라인 또는 라인 범위를 표시할 수 있으며, 쉼표로 구분하여 여러 라인 마커를 조합할 수 있습니다:

- 단일 라인: `{4}`
- 세 개의 개별 라인: `{4, 8, 12}`
- 시작과 끝으로 정의된 라인 범위: `{4-8}`
- 여러 선택자 조합: `{1, 4, 7-8}`

다음은 여러 라인 번호와 라인 범위 선택자를 조합한 예시입니다:

````md
```js {1, 4, 7-8}
// Line 1 - targeted by line number
// Line 2
// Line 3
// Line 4 - targeted by line number
// Line 5
// Line 6
// Line 7 - targeted by range "7-8"
// Line 8 - targeted by range "7-8"
```
````

이는 다음과 같이 렌더링됩니다:

```js {1, 4, 7-8}
// Line 1 - targeted by line number
// Line 2
// Line 3
// Line 4 - targeted by line number
// Line 5
// Line 6
// Line 7 - targeted by range "7-8"
// Line 8 - targeted by range "7-8"
```

### 라인 마커 타입 선택 (`mark`, `ins`, `del`)

기본적으로 모든 대상 라인은 `mark` 마커 타입을 사용하며, 이는 의미를 추가하지 않고 단순히 라인을 강조하는 중성 색상으로 렌더링됩니다.

라인에 의미를 추가하는 두 가지 다른 마커 타입이 있습니다: `ins` (삽입됨)과 `del` (삭제됨). 이들은 각각 녹색과 빨간색으로 렌더링되며, 코드 변경사항을 나타내는 데 일반적으로 사용됩니다.

대상 라인의 마커 타입을 지정하려면 여는 중괄호 앞에 등호를 붙여 추가하세요. 예를 들어, `ins={4}`는 라인 4를 삽입됨으로 표시하고, `del={7-12}`는 라인 7부터 12까지를 삭제됨으로 표시합니다.

다음은 세 가지 마커 타입을 모두 조합한 예시입니다:

````md
```js title="line-markers.js" del={2} ins={3-4} {6}
function demo() {
  console.log("this line is marked as deleted");
  // This line and the next one are marked as inserted
  console.log("this is the second inserted line");

  return "this line uses the neutral default marker type";
}
```
````

이는 다음과 같이 렌더링됩니다:

```js title="line-markers.js" del={2} ins={3-4} {6}
function demo() {
  console.log("this line is marked as deleted");
  // This line and the next one are marked as inserted
  console.log("this is the second inserted line");

  return "this line uses the neutral default marker type";
}
```

### 라인 마커에 라벨 추가

라인 마커에 텍스트 라벨을 추가할 수 있으며, 이는 표시된 라인 범위의 첫 번째 라인에 컬러풀한 박스로 렌더링됩니다. 이를 통해 주변 텍스트에서 코드의 특정 부분을 참조할 수 있습니다.

텍스트를 라벨로 추가하려면 작은따옴표나 큰따옴표로 감싸고 여는 중괄호 바로 뒤에 콜론(`:`)을 붙여 추가하세요. 예를 들어, `ins={"A":6-10}`은 라인 6부터 10까지를 삽입됨으로 표시하고 라벨 `A`를 추가합니다.

다음은 예시입니다:

````md
```jsx {"1":5} del={"2":7-8} ins={"3":10-12}
// labeled-line-markers.jsx
<button
  role="button"
  {...props}
  value={value}
  className={buttonClassName}
  disabled={disabled}
  active={active}
>
  {children &&
    !active &&
    (typeof children === "string" ? <span>{children}</span> : children)}
</button>
```
````

이는 다음과 같이 렌더링됩니다:

```jsx {"1":5} del={"2":7-8} ins={"3":10-12}
// labeled-line-markers.jsx
<button
  role="button"
  {...props}
  value={value}
  className={buttonClassName}
  disabled={disabled}
  active={active}
>
  {children &&
    !active &&
    (typeof children === "string" ? <span>{children}</span> : children)}
</button>
```

### `diff`와 유사한 문법으로 문법 강조

일반적으로 `diff` 언어를 사용하는 단점은 실제 코드 언어의 문법 강조를 잃는다는 것입니다. 이를 해결하기 위해 이 플러그인은 opening code fence에 `lang="..."` 속성을 추가하여 두 번째 언어 식별자를 지정할 수 있도록 합니다. 이 속성의 값은 문법 강조에 사용되며, `diff`와 유사한 문법은 라인 표시에 사용할 수 있습니다:

````md
```diff lang="js"
  function thisIsJavaScript() {
    // This entire block gets highlighted as JavaScript,
    // and we can still add diff markers to it!
-   console.log('Old code to be removed')
+   console.log('New and shiny code!')
  }
```
````

이는 다음과 같이 렌더링됩니다:

```diff lang="js"
  function thisIsJavaScript() {
    // This entire block gets highlighted as JavaScript,
    // and we can still add diff markers to it!
-   console.log('Old code to be removed')
+   console.log('New and shiny code!')
  }
```

### 라인 내 개별 텍스트 표시

#### 일반 텍스트 검색 문자열

코드 블록 라인 내의 텍스트 문자열을 매치하려면 단순히 **따옴표로 감싸면** 됩니다. 큰따옴표나 작은따옴표 모두 사용할 수 있습니다:

- `"this will be marked"`
- `'this will be marked'`

매치하려는 텍스트에 따옴표가 포함되어 있다면, 중첩된 따옴표를 이스케이프하지 않고 다른 따옴표 타입을 사용할 수 있습니다:

- `"these 'single' quotes need no escaping"`
- `'these "double" quotes need no escaping'`

같은 타입의 중첩된 따옴표를 피할 수 없는 경우, 백슬래시를 사용하여 이스케이프할 수 있습니다:

- `"this contains both \"double\" and 'single' quotes"`
- `'this contains both "double" and \'single\' quotes'`

예시:

````md
```js "given text"
function demo() {
  // Mark any given text inside lines
  return "Multiple matches of the given text are supported";
}
```
````

이는 다음과 같이 렌더링됩니다:

```js "given text"
function demo() {
  // Mark any given text inside lines
  return "Multiple matches of the given text are supported";
}
```
