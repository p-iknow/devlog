---
title: 'Markdown Style Guide'
date: '2025-05-25'
draft: false
category: 'template'
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

![blog placeholder](/blog-placeholder-about.jpg)

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

### Inline Math

Use single dollar signs `$...$` for inline math expressions.

#### Syntax

```markdown
The quadratic formula is $x = \frac{-b \pm \sqrt{b^2-4ac}}{2a}$ where $a \neq 0$.

Einstein's famous equation $E = mc^2$ describes mass-energy equivalence.
```

#### Output

The quadratic formula is $x = \frac{-b \pm \sqrt{b^2-4ac}}{2a}$ where $a \neq 0$.

Einstein's famous equation $E = mc^2$ describes mass-energy equivalence.

### Block Math (Display Mode)

Use double dollar signs `$$...$$` for block equations.

#### Syntax

```markdown
$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$
```

#### Output

$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$

### Greek Letters

#### Syntax

```markdown
Lowercase: $\alpha, \beta, \gamma, \delta, \epsilon, \zeta, \eta, \theta, \lambda, \mu, \pi, \sigma, \phi, \omega$

Uppercase: $\Gamma, \Delta, \Theta, \Lambda, \Pi, \Sigma, \Phi, \Omega$
```

#### Output

Lowercase: $\alpha, \beta, \gamma, \delta, \epsilon, \zeta, \eta, \theta, \lambda, \mu, \pi, \sigma, \phi, \omega$

Uppercase: $\Gamma, \Delta, \Theta, \Lambda, \Pi, \Sigma, \Phi, \Omega$

### Fractions and Binomials

#### Syntax

```markdown
$$
\frac{n!}{k!(n-k)!} = \binom{n}{k}
$$

$$
\cfrac{1}{1+\cfrac{1}{1+\cfrac{1}{1+x}}}
$$
```

#### Output

$$
\frac{n!}{k!(n-k)!} = \binom{n}{k}
$$

$$
\cfrac{1}{1+\cfrac{1}{1+\cfrac{1}{1+x}}}
$$

### Summation and Products

#### Syntax

```markdown
$$
\sum_{i=1}^{n} i = \frac{n(n+1)}{2}
$$

$$
\prod_{i=1}^{n} i = n!
$$
```

#### Output

$$
\sum_{i=1}^{n} i = \frac{n(n+1)}{2}
$$

$$
\prod_{i=1}^{n} i = n!
$$

### Integrals

#### Syntax

```markdown
$$
\int_0^1 x^2 \, dx = \frac{1}{3}
$$

$$
\iint_D f(x,y) \, dA = \iiint_E f(x,y,z) \, dV
$$
```

#### Output

$$
\int_0^1 x^2 \, dx = \frac{1}{3}
$$

$$
\iint_D f(x,y) \, dA = \iiint_E f(x,y,z) \, dV
$$

### Limits

#### Syntax

```markdown
$$
\lim_{x \to \infty} \frac{1}{x} = 0
$$

$$
\lim_{n \to \infty} \left(1 + \frac{1}{n}\right)^n = e
$$
```

#### Output

$$
\lim_{x \to \infty} \frac{1}{x} = 0
$$

$$
\lim_{n \to \infty} \left(1 + \frac{1}{n}\right)^n = e
$$

### Matrices

#### Syntax

```markdown
$$
\begin{pmatrix}
a & b \\
c & d
\end{pmatrix}
\begin{bmatrix}
1 & 2 & 3 \\
4 & 5 & 6 \\
7 & 8 & 9
\end{bmatrix}
$$

$$
\det(A) = \begin{vmatrix}
a & b \\
c & d
\end{vmatrix} = ad - bc
$$
```

#### Output

$$
\begin{pmatrix}
a & b \\
c & d
\end{pmatrix}
\begin{bmatrix}
1 & 2 & 3 \\
4 & 5 & 6 \\
7 & 8 & 9
\end{bmatrix}
$$

$$
\det(A) = \begin{vmatrix}
a & b \\
c & d
\end{vmatrix} = ad - bc
$$

### Aligned Equations

#### Syntax

```markdown
$$
\begin{aligned}
(a+b)^2 &= (a+b)(a+b) \\
&= a^2 + ab + ba + b^2 \\
&= a^2 + 2ab + b^2
\end{aligned}
$$
```

#### Output

$$
\begin{aligned}
(a+b)^2 &= (a+b)(a+b) \\
&= a^2 + ab + ba + b^2 \\
&= a^2 + 2ab + b^2
\end{aligned}
$$

### Cases (Piecewise Functions)

#### Syntax

```markdown
$$
f(x) = \begin{cases}
x^2 & \text{if } x \geq 0 \\
-x^2 & \text{if } x < 0
\end{cases}
$$
```

#### Output

$$
f(x) = \begin{cases}
x^2 & \text{if } x \geq 0 \\
-x^2 & \text{if } x < 0
\end{cases}
$$

### Common Notations

#### Syntax

```markdown
- Set notation: $\{x \in \mathbb{R} : x > 0\}$
- Vectors: $\vec{v} = \langle 1, 2, 3 \rangle$
- Partial derivatives: $\frac{\partial f}{\partial x}$
- Nabla operator: $\nabla f = \left(\frac{\partial f}{\partial x}, \frac{\partial f}{\partial y}\right)$
- Square root: $\sqrt{x^2 + y^2}$, $\sqrt[3]{8} = 2$
- Trigonometry: $\sin^2\theta + \cos^2\theta = 1$
```

#### Output

- Set notation: $\{x \in \mathbb{R} : x > 0\}$
- Vectors: $\vec{v} = \langle 1, 2, 3 \rangle$
- Partial derivatives: $\frac{\partial f}{\partial x}$
- Nabla operator: $\nabla f = \left(\frac{\partial f}{\partial x}, \frac{\partial f}{\partial y}\right)$
- Square root: $\sqrt{x^2 + y^2}$, $\sqrt[3]{8} = 2$
- Trigonometry: $\sin^2\theta + \cos^2\theta = 1$

### Famous Equations

#### Euler's Identity

$$
e^{i\pi} + 1 = 0
$$

#### Maxwell's Equations

$$
\begin{aligned}
\nabla \cdot \mathbf{E} &= \frac{\rho}{\epsilon_0} \\
\nabla \cdot \mathbf{B} &= 0 \\
\nabla \times \mathbf{E} &= -\frac{\partial \mathbf{B}}{\partial t} \\
\nabla \times \mathbf{B} &= \mu_0\mathbf{J} + \mu_0\epsilon_0\frac{\partial \mathbf{E}}{\partial t}
\end{aligned}
$$

#### Schrödinger Equation

$$
i\hbar\frac{\partial}{\partial t}\Psi(\mathbf{r},t) = \hat{H}\Psi(\mathbf{r},t)
$$

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
