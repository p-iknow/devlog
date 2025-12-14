---
title: '마크다운 한글 스타일 가이드'
date: '2025-05-25'
draft: false
series: 'markdown-guide'
tags:
  - 'markdown'
  - 'guide'
description: '한글 가이드로 테스트하기'
---

Astro에서 마크다운 콘텐츠를 작성할 때 사용할 수 있는 기본 마크다운 문법 예시입니다.

## 제목 (Headings)

다음 HTML `<h2>`—`<h6>` 요소들은 5단계의 섹션 제목을 나타냅니다. blog 내에서 `<h2>`이 가장 높은 섹션 레벨이고 `<h6>`이 가장 낮은 레벨입니다.
h1은 blog 제목에 들어가기 때문에 배제했습니다.

## 제목(Heading) 2

### 제목(Heading) 3

#### 제목(Heading) 4

##### 제목(Heading) 5

###### 제목(Heading) 6

## 단락 (Paragraph)

이것은 한글 더미 텍스트입니다. 다양한 문장과 단어들이 섞여 있으며, 실제 내용과는 무관합니다. 블로그 스타일 가이드의 마크다운 렌더링을 테스트하기 위해 사용되는 예시 문장입니다. 여러 줄에 걸쳐서 문단이 이어지며, 문단 간의 마진이나 스타일이 어떻게 적용되는지 확인할 수 있습니다. 실제 글에서는 이 부분에 본문 내용이 들어가게 됩니다. 테스트를 위해 임의로 작성된 문장들이며, 반복적으로 사용해도 무방합니다. 이렇게 여러 문장이 이어지면 실제 포스트와 유사한 레이아웃을 확인할 수 있습니다.

이 문단은 두 번째 단락입니다. 여기서도 마찬가지로 한글로 작성된 더미 텍스트가 들어갑니다. 문단 간의 간격, 줄바꿈, 스타일 등을 확인하는 데 도움이 됩니다.

## 이미지 (Images)

### 문법 (Syntax)

```markdown
![대체 텍스트](./full/or/relative/path/of/image)
```

### 출력 (Output)

![blog placeholder](/typescript.webp)

## 콜아웃 (Callouts)

콜아웃은 중요한 정보를 강조하는 데 사용됩니다. `@r4ai/remark-callout` 플러그인을 통해 Obsidian 스타일의 콜아웃을 지원합니다.

### 문법

```markdown
> [!note] 제목
> 콜아웃 내용을 여기에 작성합니다.
```

### 출력

> [!note] 참고
> 이것은 노트 콜아웃 예시입니다. 중요한 정보나 추가 설명을 강조할 때 사용합니다.

> [!tip] 팁
> 유용한 팁이나 권장 사항을 공유할 때 사용합니다.

> [!warning] 경고
> 주의가 필요한 내용을 알릴 때 사용합니다.

더 다양한 콜아웃 스타일(`info`, `question`, `caution`, `bug` 등)은 [마크다운 콜아웃 스타일 가이드](/series/markdown-guide/markdown-callout-guide.ko)를 참고하세요.

## 인용구 (Blockquotes)

인용구 요소는 다른 출처에서 인용된 콘텐츠를 나타내며, 선택적으로 `footer` 또는 `cite` 요소 내에 인용 출처를 포함할 수 있습니다. 또한 주석이나 약어와 같은 인라인 변경사항도 포함할 수 있습니다.

### 출처 없는 인용구

#### 문법

```markdown
> Tiam, ad mint andaepu dandae nostion secatur sequo quae.  
> **참고**: 인용구 내에서 *마크다운 문법*을 사용할 수 있습니다.
```

#### 출력

> Tiam, ad mint andaepu dandae nostion secatur sequo quae.  
> **참고**: 인용구 내에서 *마크다운 문법*을 사용할 수 있습니다.

### 출처가 있는 인용구

#### 문법

```markdown
> 메모리를 공유하는 방식으로 소통하지 말고, 소통하는 방식으로 메모리를 공유하라.<br>
> — <cite>Rob Pike[^1]</cite>
```

#### 출력

> 메모리를 공유하는 방식으로 소통하지 말고, 소통하는 방식으로 메모리를 공유하라.<br>
> — <cite>Rob Pike[^1]</cite>

[^1]: 위 인용구는 2015년 11월 18일 Gopherfest에서 Rob Pike의 [강연](https://www.youtube.com/watch?v=PAAkCSZUG1c)에서 발췌했습니다.

## 표 (Tables)

### 문법

```markdown
| 이탤릭체   | 굵게     | 코드   |
| ---------- | -------- | ------ |
| _이탤릭체_ | **굵게** | `코드` |
```

### 출력

| 이탤릭체   | 굵게     | 코드   |
| ---------- | -------- | ------ |
| _이탤릭체_ | **굵게** | `코드` |

## 코드 블록 (Code Blocks)

### 문법

새 줄에 3개의 백틱 ```을 사용하고 코드를 작성한 후, 새 줄에 3개의 백틱으로 닫습니다. 특정 언어의 구문을 강조하려면 첫 번째 3개의 백틱 뒤에 언어 이름을 한 단어로 작성합니다. 예: html, javascript, css, markdown, typescript, txt, bash

````markdown
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Example HTML5 Document</title>
  </head>
  <body>
    <p>Test</p>
  </body>
</html>
```
````

### 출력

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Example HTML5 Document</title>
  </head>
  <body>
    <p>Test</p>
  </body>
</html>
```

## 목록 유형 (List Types)

### 순서 있는 목록 (Ordered List)

#### 문법

```markdown
1. 첫 번째 항목
2. 두 번째 항목
3. 세 번째 항목
```

#### 출력

1. 첫 번째 항목
2. 두 번째 항목
3. 세 번째 항목

### 순서 없는 목록 (Unordered List)

#### 문법

```markdown
- 목록 항목
- 다른 항목
- 또 다른 항목
```

#### 출력

- 목록 항목
- 다른 항목
- 또 다른 항목

### 중첩 목록 (Nested list)

#### 문법

```markdown
- 과일
  - 사과
  - 오렌지
  - 바나나
- 유제품
  - 우유
  - 치즈
```

#### 출력

- 과일
  - 사과
  - 오렌지
  - 바나나
- 유제품
  - 우유
  - 치즈

## 수학 공식 (KaTeX)

이 블로그는 KaTeX를 사용한 수학 공식을 지원합니다. 인라인 수식과 블록 수식 모두 작성할 수 있습니다.

### 문법

```markdown
인라인: $E = mc^2$

블록:
$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$
```

### 출력

인라인: $E = mc^2$

$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$

더 다양한 수학 문법(그리스 문자, 행렬, 적분, 극한 등)은 [마크다운 KaTeX 수식 가이드](/series/markdown-guide/markdown-katex-guide.ko)를 참고하세요.

## 기타 요소 — abbr, sub, sup, kbd, mark

### 문법

```markdown
<abbr title="Graphics Interchange Format">GIF</abbr>는 비트맵 이미지 형식입니다.

H<sub>2</sub>O

X<sup>n</sup> + Y<sup>n</sup> = Z<sup>n</sup>

세션을 종료하려면 <kbd><kbd>CTRL</kbd>+<kbd>ALT</kbd>+<kbd>Delete</kbd></kbd>를 누르세요.

대부분의 <mark>도롱뇽</mark>은 야행성이며, 곤충, 벌레 및 기타 작은 생물을 사냥합니다.
```

### 출력

<abbr title="Graphics Interchange Format">GIF</abbr>는 비트맵 이미지 형식입니다.

H<sub>2</sub>O

X<sup>n</sup> + Y<sup>n</sup> = Z<sup>n</sup>

세션을 종료하려면 <kbd><kbd>CTRL</kbd>+<kbd>ALT</kbd>+<kbd>Delete</kbd></kbd>를 누르세요.

대부분의 <mark>도롱뇽</mark>은 야행성이며, 곤충, 벌레 및 기타 작은 생물을 사냥합니다.
