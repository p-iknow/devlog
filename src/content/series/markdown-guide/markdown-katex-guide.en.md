---
title: 'Markdown KaTeX Math Guide'
date: '2025-05-28'
draft: false
series: 'markdown-guide'
tags:
  - 'markdown'
  - 'katex'
  - 'math'
description: 'A comprehensive guide to writing mathematical equations using KaTeX in Markdown.'
---

This blog supports mathematical equations using KaTeX. You can write both inline and block equations.

## Inline Math

Use single dollar signs `$...$` for inline math expressions.

### Syntax

```markdown
The quadratic formula is $x = \frac{-b \pm \sqrt{b^2-4ac}}{2a}$ where $a \neq 0$.

Einstein's famous equation $E = mc^2$ describes mass-energy equivalence.
```

### Output

The quadratic formula is $x = \frac{-b \pm \sqrt{b^2-4ac}}{2a}$ where $a \neq 0$.

Einstein's famous equation $E = mc^2$ describes mass-energy equivalence.

## Block Math (Display Mode)

Use double dollar signs `$$...$$` for block equations.

### Syntax

```markdown
$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$
```

### Output

$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$

## Greek Letters

### Syntax

```markdown
Lowercase: $\alpha, \beta, \gamma, \delta, \epsilon, \zeta, \eta, \theta, \lambda, \mu, \pi, \sigma, \phi, \omega$

Uppercase: $\Gamma, \Delta, \Theta, \Lambda, \Pi, \Sigma, \Phi, \Omega$
```

### Output

Lowercase: $\alpha, \beta, \gamma, \delta, \epsilon, \zeta, \eta, \theta, \lambda, \mu, \pi, \sigma, \phi, \omega$

Uppercase: $\Gamma, \Delta, \Theta, \Lambda, \Pi, \Sigma, \Phi, \Omega$

## Fractions and Binomials

### Syntax

```markdown
$$
\frac{n!}{k!(n-k)!} = \binom{n}{k}
$$

$$
\cfrac{1}{1+\cfrac{1}{1+\cfrac{1}{1+x}}}
$$
```

### Output

$$
\frac{n!}{k!(n-k)!} = \binom{n}{k}
$$

$$
\cfrac{1}{1+\cfrac{1}{1+\cfrac{1}{1+x}}}
$$

## Summation and Products

### Syntax

```markdown
$$
\sum_{i=1}^{n} i = \frac{n(n+1)}{2}
$$

$$
\prod_{i=1}^{n} i = n!
$$
```

### Output

$$
\sum_{i=1}^{n} i = \frac{n(n+1)}{2}
$$

$$
\prod_{i=1}^{n} i = n!
$$

## Integrals

### Syntax

```markdown
$$
\int_0^1 x^2 \, dx = \frac{1}{3}
$$

$$
\iint_D f(x,y) \, dA = \iiint_E f(x,y,z) \, dV
$$
```

### Output

$$
\int_0^1 x^2 \, dx = \frac{1}{3}
$$

$$
\iint_D f(x,y) \, dA = \iiint_E f(x,y,z) \, dV
$$

## Limits

### Syntax

```markdown
$$
\lim_{x \to \infty} \frac{1}{x} = 0
$$

$$
\lim_{n \to \infty} \left(1 + \frac{1}{n}\right)^n = e
$$
```

### Output

$$
\lim_{x \to \infty} \frac{1}{x} = 0
$$

$$
\lim_{n \to \infty} \left(1 + \frac{1}{n}\right)^n = e
$$

## Matrices

### Syntax

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

### Output

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

## Aligned Equations

### Syntax

```markdown
$$
\begin{aligned}
(a+b)^2 &= (a+b)(a+b) \\
&= a^2 + ab + ba + b^2 \\
&= a^2 + 2ab + b^2
\end{aligned}
$$
```

### Output

$$
\begin{aligned}
(a+b)^2 &= (a+b)(a+b) \\
&= a^2 + ab + ba + b^2 \\
&= a^2 + 2ab + b^2
\end{aligned}
$$

## Cases (Piecewise Functions)

### Syntax

```markdown
$$
f(x) = \begin{cases}
x^2 & \text{if } x \geq 0 \\
-x^2 & \text{if } x < 0
\end{cases}
$$
```

### Output

$$
f(x) = \begin{cases}
x^2 & \text{if } x \geq 0 \\
-x^2 & \text{if } x < 0
\end{cases}
$$

## Common Notations

### Syntax

```markdown
- Set notation: $\{x \in \mathbb{R} : x > 0\}$
- Vectors: $\vec{v} = \langle 1, 2, 3 \rangle$
- Partial derivatives: $\frac{\partial f}{\partial x}$
- Nabla operator: $\nabla f = \left(\frac{\partial f}{\partial x}, \frac{\partial f}{\partial y}\right)$
- Square root: $\sqrt{x^2 + y^2}$, $\sqrt[3]{8} = 2$
- Trigonometry: $\sin^2\theta + \cos^2\theta = 1$
```

### Output

- Set notation: $\{x \in \mathbb{R} : x > 0\}$
- Vectors: $\vec{v} = \langle 1, 2, 3 \rangle$
- Partial derivatives: $\frac{\partial f}{\partial x}$
- Nabla operator: $\nabla f = \left(\frac{\partial f}{\partial x}, \frac{\partial f}{\partial y}\right)$
- Square root: $\sqrt{x^2 + y^2}$, $\sqrt[3]{8} = 2$
- Trigonometry: $\sin^2\theta + \cos^2\theta = 1$

## Famous Equations

### Euler's Identity

$$
e^{i\pi} + 1 = 0
$$

### Maxwell's Equations

$$
\begin{aligned}
\nabla \cdot \mathbf{E} &= \frac{\rho}{\epsilon_0} \\
\nabla \cdot \mathbf{B} &= 0 \\
\nabla \times \mathbf{E} &= -\frac{\partial \mathbf{B}}{\partial t} \\
\nabla \times \mathbf{B} &= \mu_0\mathbf{J} + \mu_0\epsilon_0\frac{\partial \mathbf{E}}{\partial t}
\end{aligned}
$$

### Schrödinger Equation

$$
i\hbar\frac{\partial}{\partial t}\Psi(\mathbf{r},t) = \hat{H}\Psi(\mathbf{r},t)
$$
