---
title: 'Markdown Callout Style Guide'
date: '2025-05-25'
draft: false
category: 'template'
tags:
  - 'markdown'
  - 'callout'
description: 'Here is a sample of some basic Markdown syntax that can be used when writing Markdown content in Astro.'
---

### Note

#### Syntax

```markdown
> [!note] Note
> This is a longer note content that will likely wrap to multiple lines to test how the callout styling handles text wrapping and line breaks. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
```

#### Output

> [!note] Note
> This is a longer note content that will likely wrap to multiple lines to test how the callout styling handles text wrapping and line breaks. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

### Info

#### Syntax

```markdown
> [!info] Info
> This is a longer note content that will likely wrap to multiple lines to test how the callout styling handles text wrapping and line breaks. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
```

#### Output

> [!info] Info
> This is a longer note content that will likely wrap to multiple lines to test how the callout styling handles text wrapping and line breaks. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

### Tip

#### Syntax

```markdown
> [!tip] Tip
> alias: `important`
> Here's a helpful tip with enough content to demonstrate line wrapping behavior. This text should be long enough to span multiple lines and show how the callout container handles longer paragraphs with proper spacing and alignment.
```

#### Output

> [!tip] Tip
> alias: `important`
>
> Here's a helpful tip with enough content to demonstrate line wrapping behavior. This text should be long enough to span multiple lines and show how the callout container handles longer paragraphs with proper spacing and alignment.

### Warning

#### Syntax

```markdown
> [!warning] Warning
> alias: `attention`
>
> Please be careful when proceeding with this action. This warning contains sufficient text to demonstrate how warning callouts handle line breaks and text wrapping while maintaining the visual hierarchy and readability of the alert message.
```

#### Output

> [!warning] Warning
> alias: `attention`
>
> Please be careful when proceeding with this action. This warning contains sufficient text to demonstrate how warning callouts handle line breaks and text wrapping while maintaining the visual hierarchy and readability of the alert message.

### Question

#### Syntax

```markdown
> [!question] Question
> alias: `faq`, `help`
>
> This is a critical caution message that you should not ignore. The text is deliberately lengthy to showcase how caution callouts display when the content spans multiple lines and requires proper text wrapping and visual emphasis.
```

#### Output

> [!question] Question
> alias: `faq`, `help`
>
> This is a critical caution message that you should not ignore. The text is deliberately lengthy to showcase how caution callouts display when the content spans multiple lines and requires proper text wrapping and visual emphasis.

### Caution

#### Syntax

```markdown
> [!caution] Caution
> This is a critical caution message that you should not ignore. The text is deliberately lengthy to showcase how caution callouts display when the content spans multiple lines and requires proper text wrapping and visual emphasis.
```

#### Output

> [!caution] Caution
> This is a critical caution message that you should not ignore. The text is deliberately lengthy to showcase how caution callouts display when the content spans multiple lines and requires proper text wrapping and visual emphasis.

### Bug

#### Syntax

```markdown
> [!bug] Bug
> A critical bug has been identified in this section. This callout is used to highlight issues, errors, or problems that need immediate attention from developers or users.
```

#### Output

> [!bug] Bug
> A critical bug has been identified in this section. This callout is used to highlight issues, errors, or problems that need immediate attention from developers or users.
