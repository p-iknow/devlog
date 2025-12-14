---
title: 'Markdown Style Guide'
date: '2025-05-25'
draft: false
series: 'markdown-guide'
tags:
  - 'markdown'
  - 'guide'
description: 'Here is a sample of some basic Markdown syntax that can be used when writing Markdown content in Astro.'
---

Here is a sample of some basic Markdown syntax that can be used when writing Markdown content in Astro.

## Headings

The following HTML `<h1>`—`<h6>` elements represent six levels of section headings. `<h1>` is the highest section level
while `<h6>` is the lowest.

## H2

### H3

#### H4

##### H5

###### H6

## Paragraph

Markdown has become the standard for writing documentation, README files, and blog posts across the development community. Its simplicity and readability make it an ideal choice for **technical writers** and developers alike. The lightweight markup syntax allows you to focus on content while maintaining consistent formatting that can be easily converted to HTML or other formats.

When writing in Markdown, it's essential to follow established conventions to ensure your documents are accessible and maintainable. Proper heading hierarchy, consistent list formatting, and appropriate use of emphasis help create documents that are both **human-readable** in their raw form and beautifully rendered when processed. For more details, check out the [Markdown Guide](https://www.markdownguide.org/).

The beauty of Markdown lies in its versatility and widespread adoption across platforms like [GitHub](https://github.com), [GitLab](https://gitlab.com), and countless static site generators. This universality means that learning Markdown well is an **investment that pays dividends** across your entire development workflow.

## Images

### Syntax

```markdown
![Alt text](./full/or/relative/path/of/image)
```

### Output

![blog placeholder](/typescript.webp)

## Callouts

Callouts are used to highlight important information. We support Obsidian-style callouts via the `@r4ai/remark-callout` plugin.

### Syntax

```markdown
> [!note] Title
> Write callout content here.
```

### Output

> [!note] Note
> This is a note callout example. Use it to highlight important information or additional explanations.

> [!tip] Tip
> Use this to share useful tips or recommendations.

> [!warning] Warning
> Use this to alert readers about something that requires attention.

For more callout styles (`info`, `question`, `caution`, `bug`, etc.), see the [Markdown Callout Style Guide](/series/markdown-guide/markdown-callout-guide.en).

## Blockquotes

The blockquote element represents content that is quoted from another source, optionally with a citation which must be
within a `footer` or `cite` element, and optionally with in-line changes such as annotations and abbreviations.

### Blockquote without attribution

#### Syntax

```markdown
> Tiam, ad mint andaepu dandae nostion secatur sequo quae.  
> **Note** that you can use _Markdown syntax_ within a blockquote.
```

#### Output

> Tiam, ad mint andaepu dandae nostion secatur sequo quae.  
> **Note** that you can use _Markdown syntax_ within a blockquote.

### Blockquote with attribution

#### Syntax

```markdown
> Don't communicate by sharing memory, share memory by communicating.<br>
> — <cite>Rob Pike[^1]</cite>
```

#### Output

> Don't communicate by sharing memory, share memory by communicating.<br>
> — <cite>Rob Pike[^1]</cite>

[^1]:
    The above quote is excerpted from Rob Pike's [talk](https://www.youtube.com/watch?v=PAAkCSZUG1c) during
    Gopherfest, November 18, 2015.

## Tables

### Syntax

```markdown
| Italics   | Bold     | Code   |
| --------- | -------- | ------ |
| _italics_ | **bold** | `code` |
```

### Output

| Italics   | Bold     | Code   |
| --------- | -------- | ------ |
| _italics_ | **bold** | `code` |

## Code Blocks

### Syntax

we can use 3 backticks ``` in new line and write snippet and close with 3 backticks on new line and to highlight
language specific syntac, write one word of language name after first 3 backticks, for eg. html, javascript, css,
markdown, typescript, txt, bash

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

### Output

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

## List Types

### Ordered List

#### Syntax

```markdown
1. First item
2. Second item
3. Third item
```

#### Output

1. First item
2. Second item
3. Third item

### Unordered List

#### Syntax

```markdown
- List item
- Another item
- And another item
```

#### Output

- List item
- Another item
- And another item

### Nested list

#### Syntax

```markdown
- Fruit
  - Apple
  - Orange
  - Banana
- Dairy
  - Milk
  - Cheese
```

#### Output

- Fruit
  - Apple
  - Orange
  - Banana
- Dairy
  - Milk
  - Cheese

## Math Equations (KaTeX)

This blog supports mathematical equations using KaTeX. You can write both inline and block equations.

### Syntax

```markdown
Inline: $E = mc^2$

Block:
$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$
```

### Output

Inline: $E = mc^2$

$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$

For more math syntax (Greek letters, matrices, integrals, limits, etc.), see the [Markdown KaTeX Math Guide](/series/markdown-guide/markdown-katex-guide.en).

## Other Elements — abbr, sub, sup, kbd, mark

### Syntax

```markdown
<abbr title="Graphics Interchange Format">GIF</abbr> is a bitmap image format.

H<sub>2</sub>O

X<sup>n</sup> + Y<sup>n</sup> = Z<sup>n</sup>

Press <kbd><kbd>CTRL</kbd>+<kbd>ALT</kbd>+<kbd>Delete</kbd></kbd> to end the session.

Most <mark>salamanders</mark> are nocturnal, and hunt for insects, worms, and other small creatures.
```

### Output

<abbr title="Graphics Interchange Format">GIF</abbr> is a bitmap image format.

H<sub>2</sub>O

X<sup>n</sup> + Y<sup>n</sup> = Z<sup>n</sup>

Press <kbd><kbd>CTRL</kbd>+<kbd>ALT</kbd>+<kbd>Delete</kbd></kbd> to end the session.

Most <mark>salamanders</mark> are nocturnal, and hunt for insects, worms, and other small creatures.
