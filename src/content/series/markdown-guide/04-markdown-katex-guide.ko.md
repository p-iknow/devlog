---
title: '마크다운 KaTeX 수식 가이드'
slug: 'markdown-katex-guide'
date: '2025-05-28'
part: 4
draft: false
dev-only: true
series: 'markdown-guide'
category: 'guide'
tags:
  - 'markdown'
  - 'katex'
  - 'math'
description: 'KaTeX를 사용하여 마크다운에서 수학 공식을 작성하는 방법에 대한 종합 가이드입니다.'
lang: ko
---

이 블로그는 KaTeX를 사용한 수학 공식을 지원합니다. 인라인 수식과 블록 수식 모두 작성할 수 있습니다.

## 인라인 수식 (Inline Math)

인라인 수식에는 단일 달러 기호 `$...$`를 사용합니다.

### 문법

```markdown
이차 방정식의 근의 공식은 $x = \frac{-b \pm \sqrt{b^2-4ac}}{2a}$ 이며, 여기서 $a \neq 0$ 입니다.

아인슈타인의 유명한 방정식 $E = mc^2$는 질량-에너지 등가를 설명합니다.
```

### 출력

이차 방정식의 근의 공식은 $x = \frac{-b \pm \sqrt{b^2-4ac}}{2a}$ 이며, 여기서 $a \neq 0$ 입니다.

아인슈타인의 유명한 방정식 $E = mc^2$는 질량-에너지 등가를 설명합니다.

## 블록 수식 (Display Mode)

블록 수식에는 이중 달러 기호 `$$...$$`를 사용합니다.

### 문법

```markdown
$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$
```

### 출력

$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$

## 그리스 문자 (Greek Letters)

### 문법

```markdown
소문자: $\alpha, \beta, \gamma, \delta, \epsilon, \zeta, \eta, \theta, \lambda, \mu, \pi, \sigma, \phi, \omega$

대문자: $\Gamma, \Delta, \Theta, \Lambda, \Pi, \Sigma, \Phi, \Omega$
```

### 출력

소문자: $\alpha, \beta, \gamma, \delta, \epsilon, \zeta, \eta, \theta, \lambda, \mu, \pi, \sigma, \phi, \omega$

대문자: $\Gamma, \Delta, \Theta, \Lambda, \Pi, \Sigma, \Phi, \Omega$

## 분수와 이항 계수 (Fractions and Binomials)

### 문법

```markdown
$$
\frac{n!}{k!(n-k)!} = \binom{n}{k}
$$

$$
\cfrac{1}{1+\cfrac{1}{1+\cfrac{1}{1+x}}}
$$
```

### 출력

$$
\frac{n!}{k!(n-k)!} = \binom{n}{k}
$$

$$
\cfrac{1}{1+\cfrac{1}{1+\cfrac{1}{1+x}}}
$$

## 합과 곱 (Summation and Products)

### 문법

```markdown
$$
\sum_{i=1}^{n} i = \frac{n(n+1)}{2}
$$

$$
\prod_{i=1}^{n} i = n!
$$
```

### 출력

$$
\sum_{i=1}^{n} i = \frac{n(n+1)}{2}
$$

$$
\prod_{i=1}^{n} i = n!
$$

## 적분 (Integrals)

### 문법

```markdown
$$
\int_0^1 x^2 \, dx = \frac{1}{3}
$$

$$
\iint_D f(x,y) \, dA = \iiint_E f(x,y,z) \, dV
$$
```

### 출력

$$
\int_0^1 x^2 \, dx = \frac{1}{3}
$$

$$
\iint_D f(x,y) \, dA = \iiint_E f(x,y,z) \, dV
$$

## 극한 (Limits)

### 문법

```markdown
$$
\lim_{x \to \infty} \frac{1}{x} = 0
$$

$$
\lim_{n \to \infty} \left(1 + \frac{1}{n}\right)^n = e
$$
```

### 출력

$$
\lim_{x \to \infty} \frac{1}{x} = 0
$$

$$
\lim_{n \to \infty} \left(1 + \frac{1}{n}\right)^n = e
$$

## 행렬 (Matrices)

### 문법

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

### 출력

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

## 정렬된 수식 (Aligned Equations)

### 문법

```markdown
$$
\begin{aligned}
(a+b)^2 &= (a+b)(a+b) \\
&= a^2 + ab + ba + b^2 \\
&= a^2 + 2ab + b^2
\end{aligned}
$$
```

### 출력

$$
\begin{aligned}
(a+b)^2 &= (a+b)(a+b) \\
&= a^2 + ab + ba + b^2 \\
&= a^2 + 2ab + b^2
\end{aligned}
$$

## 조건부 함수 (Piecewise Functions)

### 문법

```markdown
$$
f(x) = \begin{cases}
x^2 & \text{if } x \geq 0 \\
-x^2 & \text{if } x < 0
\end{cases}
$$
```

### 출력

$$
f(x) = \begin{cases}
x^2 & \text{if } x \geq 0 \\
-x^2 & \text{if } x < 0
\end{cases}
$$

## 일반 표기법 (Common Notations)

### 문법

```markdown
- 집합 표기법: $\{x \in \mathbb{R} : x > 0\}$
- 벡터: $\vec{v} = \langle 1, 2, 3 \rangle$
- 편미분: $\frac{\partial f}{\partial x}$
- 나블라 연산자: $\nabla f = \left(\frac{\partial f}{\partial x}, \frac{\partial f}{\partial y}\right)$
- 제곱근: $\sqrt{x^2 + y^2}$, $\sqrt[3]{8} = 2$
- 삼각함수: $\sin^2\theta + \cos^2\theta = 1$
```

### 출력

- 집합 표기법: $\{x \in \mathbb{R} : x > 0\}$
- 벡터: $\vec{v} = \langle 1, 2, 3 \rangle$
- 편미분: $\frac{\partial f}{\partial x}$
- 나블라 연산자: $\nabla f = \left(\frac{\partial f}{\partial x}, \frac{\partial f}{\partial y}\right)$
- 제곱근: $\sqrt{x^2 + y^2}$, $\sqrt[3]{8} = 2$
- 삼각함수: $\sin^2\theta + \cos^2\theta = 1$

## 유명한 방정식 (Famous Equations)

### 오일러 항등식 (Euler's Identity)

$$
e^{i\pi} + 1 = 0
$$

### 맥스웰 방정식 (Maxwell's Equations)

$$
\begin{aligned}
\nabla \cdot \mathbf{E} &= \frac{\rho}{\epsilon_0} \\
\nabla \cdot \mathbf{B} &= 0 \\
\nabla \times \mathbf{E} &= -\frac{\partial \mathbf{B}}{\partial t} \\
\nabla \times \mathbf{B} &= \mu_0\mathbf{J} + \mu_0\epsilon_0\frac{\partial \mathbf{E}}{\partial t}
\end{aligned}
$$

### 슈뢰딩거 방정식 (Schrödinger Equation)

$$
i\hbar\frac{\partial}{\partial t}\Psi(\mathbf{r},t) = \hat{H}\Psi(\mathbf{r},t)
$$
