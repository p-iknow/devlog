---
title: 'Markdown Code Style Guide'
date: '2025-05-25'
draft: false
category: 'template'
tags:
  - 'markdown'
  - 'code'
description: 'Here is a sample of some basic Markdown syntax that can be used when writing Markdown content in Astro.'
---

### Code editor frames

syntax:

````md title="editor-example.md" ins=/title=".*?"/ ins=/<!--.*?-->/
```js title="my-test-file.js"
console.log("Title attribute example");
```

```html
<!-- src/content/index.html -->
<div>File name comment example</div>
```
````

result:

```js title="my-test-file.js"
console.log("Title attribute example");
```

```html
<!-- src/content/index.html -->
<div>File name comment example</div>
```

### Terminal frames

When encountering code blocks with a language identifier that is typically used for terminal sessions or shell scripts (`ansi`, `bash`, `bat`, `batch`, `cmd`, `console`, `powershell`, `ps`, `ps1`, `psd1`, `psm1`, `sh`, `shell`, `shellscript`, `shellsession`, `zsh`), Expressive Code performs additional checks to detect the frame type to use:

- If the code block contains a shell script file name in the `title` attribute of the opening code fence or a [file name comment](#file-name-comments), or if the code starts with a shebang (`#!`), it is considered to be a script file instead of a terminal session, and is rendered with a code editor frame if a file name was provided, or as a plain code block otherwise.
- In all other cases, the code block is considered to be a terminal session and rendered with a terminal frame.

In contrast to code editor frames, terminal frames do not require a title. The title bar will always be rendered, and you can optionally add a title using the `title` attribute:

````md ins=/title=".*?"/
```bash
echo "This terminal frame has no title"
```

```powershell title="PowerShell terminal example"
Write-Output "This one has a title!"
```
````

The rendered result looks like this:

```bash
echo "This frame has no title"
```

```powershell title="PowerShell terminal example"
Write-Output "This one has a title!"
```

### Marking full lines & line ranges

Lines can be marked by adding their **line numbers inside curly brackets** to a code block's meta information. Line numbers start at 1, just like in VS Code and other popular editors.

You can either mark a single line, or a range of lines, and you can combine multiple line markers by separating them with commas:

- Single line: `{4}`
- Three separate lines: `{4, 8, 12}`
- Range of lines defined by a start and end: `{4-8}`
- Multiple selectors combined: `{1, 4, 7-8}`

Here's an example combining multiple line number & line range selectors:

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

This will render as follows:

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

### Selecting line marker types (`mark`, `ins`, `del`)

By default, all targeted lines will use the marker type `mark`, which is rendered in a neutral color that just highlights the line without adding any semantic meaning to it.

There are two other marker types available that add semantic meaning to your lines: `ins` (inserted) and `del` (deleted). These are rendered in green and red, respectively, and are commonly used to indicate changes to your code.

To specify the marker type for targeted lines, add it in front of their opening curly brace, followed by an equals sign. For example, `ins={4}` would mark line 4 as inserted, and `del={7-12}` would mark lines 7 to 12 as deleted.

Here's an example combining all three marker types:

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

This will render as follows:

```js title="line-markers.js" del={2} ins={3-4} {6}
function demo() {
  console.log("this line is marked as deleted");
  // This line and the next one are marked as inserted
  console.log("this is the second inserted line");

  return "this line uses the neutral default marker type";
}
```

### Adding labels to line markers

You can add a text label to any line marker, which will be rendered as a colorful box in the first line of the marked line range. This allows you to reference specific parts of your code in the surrounding text.

To add any text as a label, enclose it in single or double quotes and add it directly after the opening curly brace, followed by a colon (`:`). For example, `ins={"A":6-10}` would mark lines 6 to 10 as inserted and add the label `A` to them.

Here's an example:

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

This will render as follows:

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

### Syntax highlighting with `diff`-like syntax

Usually, a downside of using the `diff` language is that you lose syntax highlighting of the actual code's language. To work around this, this plugin allows you to specify a second language identifier by adding a `lang="..."` attribute to the opening code fence. The value of this attribute will then be used for syntax highlighting, while the `diff`-like syntax can be used for marking lines:

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

This will render as follows:

```diff lang="js"
  function thisIsJavaScript() {
    // This entire block gets highlighted as JavaScript,
    // and we can still add diff markers to it!
-   console.log('Old code to be removed')
+   console.log('New and shiny code!')
  }
```

### Marking individual text inside lines

#### Plaintext search strings

To match a string of text inside your code block's lines, simply **wrap it in quotes**. You can use either double or single quotes:

- `"this will be marked"`
- `'this will be marked'`

If the text you want to match contains quotes itself, you can use the other quote type to wrap it without having to escape the nested quotes:

- `"these 'single' quotes need no escaping"`
- `'these "double" quotes need no escaping'`

If you cannot avoid nested quotes of the same type, you can escape them using a backslash:

- `"this contains both \"double\" and 'single' quotes"`
- `'this contains both "double" and \'single\' quotes'`

Example:

````md
```js "given text"
function demo() {
  // Mark any given text inside lines
  return "Multiple matches of the given text are supported";
}
```
````

This will render as follows:

```js "given text"
function demo() {
  // Mark any given text inside lines
  return "Multiple matches of the given text are supported";
}
```
