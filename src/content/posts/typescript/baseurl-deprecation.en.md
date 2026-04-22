---
title: 'baseUrl: Why It Was Deprecated, and What to Do Now'
date: '2026-04-21'
draft: false
img: 'https://p-iknow.netlify.app/typescript.webp'
category: 'typescript'
tags:
  - 'typescript'
description: '`baseUrl` was deprecated in TypeScript 6. This post walks through what `baseUrl` originally did, why the TypeScript team deprecated it, and what you should do now.'
lang: en
slug: baseurl-deprecation
---

![typescript](/typescript.webp)

## Background

`baseUrl`, an option many of us reach for almost by reflex, was deprecated in TypeScript 6. This post uses a pnpm workspace monorepo as a running example but keeps the discussion general, covering how `baseUrl` used to behave, why the TypeScript team deprecated it, and what you should do now.

For the full background, see the [TSConfig `baseUrl` docs](https://www.typescriptlang.org/tsconfig/baseUrl.html), the [TypeScript 6.0 release notes](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-6-0.html#deprecated---baseurl), and [deprecation issue #62207](https://github.com/microsoft/TypeScript/issues/62207).

## The short version

- `baseUrl` is deprecated.
- `paths` works without `baseUrl`.
- The prefix role `baseUrl` used to play reads more clearly when written directly into each `paths` value.
- Package boundaries belong in **real package imports** and `package.json` `exports`, not in `tsconfig` `paths`.

For most projects, that boils down to:

> Remove `baseUrl`. Keep only the `paths` entries you actually need, and make them explicit. Move cross-package imports to real package boundaries.

The rest of the post walks through how we get there — from how `baseUrl` used to work to the actual migration steps.

## What `baseUrl` originally was

On the surface, `baseUrl` looked simple. Many teams wrote it like this, and it worked for years:

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

Most developers read this config as:

- `@app/*` resolves to `./src/app/*`
- `@lib/*` resolves to `./src/lib/*`

In other words, `baseUrl` was treated as **a shared prefix for `paths`** — a framing echoed in countless blog posts, sample repos, and templates. That reading isn't wrong, but it glosses over a second, more implicit behavior.

## The issue: `baseUrl` did two things at once

TypeScript's interpretation of `baseUrl` was broader than most of us realized. Officially, it did two jobs — a framing that matches both the [TypeScript 6.0 release notes](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-6-0.html#deprecated---baseurl) and [issue #62207](https://github.com/microsoft/TypeScript/issues/62207).

### 1. Prefix for `paths` values

This is the part most people already knew.

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

Here, `@app/foo` effectively pointed to `./src/app/foo`.

### 2. A lookup root for bare imports

This is where the trouble starts. Say a developer only wants to expose `@app/*` as an alias. With `baseUrl: "./src"` set, TypeScript would still sometimes look for certain bare imports under `./src`.

So code like this:

```ts
import something from 'someModule.js'
```

could resolve to `./src/someModule.js` as a candidate, even though the developer never added it to `paths`.

This looks harmless on the surface, but it's the seed of the misunderstanding. The developer thinks: "I only opened two aliases." TypeScript thinks: "No, you also opened `./src` as an additional resolution base." That gap is where the deprecation story begins.

## Why the TypeScript team deprecated it

The core reason: **the option's meaning was too implicit**. The TypeScript team makes that clear in [deprecation issue #62207](https://github.com/microsoft/TypeScript/issues/62207) and [PR #62509](https://github.com/microsoft/TypeScript/pull/62509).

### 1. Imports the developer never configured became resolution targets

Most users thought of `baseUrl` as a helper for `paths`. In reality, it could pull bare imports — ones you hadn't listed in `paths` — into the set of resolution candidates. The issue isn't just that it was "a bit broader." It's that **resolution paths were open that the developer didn't know existed**.

Given this config:

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

many developers read it as:

- Only `@app/*` resolves to `./src/app/*`
- Only `@lib/*` resolves to `./src/lib/*`
- Every other bare import follows normal package resolution

But TypeScript could also try `./src/someModule.js` as a candidate for:

```ts
import something from 'someModule.js'
```

So while the developer thought they had opened only `@app/*` and `@lib/*`, the entire `./src` directory quietly acted as an extra lookup root.

### 2. TypeScript could find the import; the runtime couldn't

This framing is sharper because it pins the issue on **who found what, and who didn't** — rather than on some vague "mismatch."

Given:

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

and code like:

```ts
import something from 'someModule.js'
```

what actually happened was:

- **TypeScript**: thanks to `baseUrl`, treats `./src/someModule.js` as a candidate and considers the import resolved.
- **Runtime / bundler**: doesn't know about the `baseUrl` rule in `tsconfig`, so it sees the same bare import and falls back to `node_modules` (or whatever resolution rules it knows).
- **Result**: the editor and type checker are green, but the module can't be found at runtime.

A more concrete example:

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

TypeScript finds `src/config/load.ts` and quietly moves on. But if Node.js or your bundler doesn't know about that rule, it tries to resolve `'config/load'` as a package name and fails.

The heart of the issue: `baseUrl` **resolved the import inside TypeScript, but didn't rewrite the import string into anything the runtime could understand**. This matches the spirit of the [TSConfig `baseUrl` docs](https://www.typescriptlang.org/tsconfig/baseUrl.html) and the "module names are emitted as written" point in [issue #26557](https://github.com/microsoft/TypeScript/issues/26557).

### 3. It didn't fit the modern ecosystem

Today, module boundaries are expressed far more explicitly than they used to be:

- package manager workspaces
- `exports` in `package.json`
- bundler / module resolution rules
- Node.js's standard package resolution

In that world, a single `tsconfig` option that quietly changes the lookup root only adds confusion. So the TypeScript team chose to stop carrying `baseUrl`'s ambiguous meaning forward, in favor of **explicit `paths` and explicit package boundaries**. This isn't just one option going away — it's a shift from "rules only TypeScript knows" to "boundaries every tool understands."

## `paths` has worked without `baseUrl` for a long time

For years, many teams believed:

> You need `baseUrl` to use `paths`.

That assumption has been outdated for a while. As the [TSConfig `baseUrl` docs](https://www.typescriptlang.org/tsconfig/baseUrl.html) note, `paths` works without `baseUrl` — which changes the recommended shape of the config.

### The old way

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

### The recommended way now

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

The diff looks small, but the meaning is different:

- Before: `baseUrl` hid behind the scenes, supplying both the prefix and the lookup root.
- Now: `paths` spells the mapping out **exactly as it is**.

A reader of the config can see at a glance where each alias actually goes.

## Fixing it: what to do now

Here's the practical part. Read this alongside the [TypeScript 6.0 release notes](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-6-0.html#deprecated---baseurl) and the [6.0 migration guide (issue #62508)](https://github.com/microsoft/TypeScript/issues/62508) for a clearer picture.

### 1) Figure out which role `baseUrl` was playing in your project

You're almost certainly in one of two camps.

**Case A: You only used it as a `paths` prefix**

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

or:

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

Here the fix is almost always **remove `baseUrl` and make `paths` explicit** — the same direction the TypeScript team is pointing.

**Case B: You were relying on it as an actual lookup root**

If your codebase has bare imports that only work because `baseUrl` quietly picks them up (with no matching `paths` entry), this isn't a find-and-replace — it's a job of **making the real dependencies visible**. Pick one:

- Add the needed aliases to `paths` explicitly.
- Rewrite the internal imports as relative paths or clear aliases.
- Move to a proper package import structure.

### 2) For most projects, just remove `baseUrl`

In TypeScript 6 and later, there's rarely a reason to introduce `baseUrl` in a new setup. This pattern, in particular, is safe to drop today:

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

`baseUrl` adds nothing here — `paths` already describes the mapping you want. Simplify to:

```json
{
  "compilerOptions": {
    "paths": {
      "~/*": ["./src/*"]
    }
  }
}
```

### 3) Decide how far `paths` should reach

This matters most in monorepos.

**Fine: aliases inside a package or app**

```ts
import { Header } from '~/components/header'
import { cn } from '@/lib/utils'
```

Local convenience aliases, scoped to the current app or package. Useful for cutting down on relative-path hell.

**Be careful: aliases that cross package boundaries**

A root `tsconfig` like this is worth a second look:

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

TypeScript is happy, but your runtime, build, and deploy boundaries blur. These imports look like package imports, but they're leaning on a **virtual boundary** created by `tsconfig`. A cleaner split:

- **Inside a package**: `paths`
- **Between packages**: workspace dependency + `package.json` `exports` + real package imports

## Why this split matters even more in a pnpm workspace monorepo

pnpm workspaces let you treat internal packages like real packages. Imports like `@repo/shared` can be expressed as **an actual dependency relationship** instead of a `tsconfig` alias. In a monorepo, leaning on what the package manager and `exports` already understand is far more natural than growing `baseUrl` / `paths` into a "global linker."

The benefits are concrete:

- **Package boundaries become visible**: which app depends on which package is right there in `package.json`.
- **Fewer TypeScript-only setups**: virtual aliases that live only in `tsconfig` are more fragile than boundaries the package manager and bundler share.
- **Public API becomes explicit via `exports`**: instead of letting anyone import any file inside the package, you declare the public surface in `package.json`.

In short: in a monorepo, treat `paths` as a local helper and let **real package imports** do the wiring between packages.

## Is it okay to use `ignoreDeprecations: "6.0"`?

Yes, but be honest about what it is. Per the [TypeScript 6.0 release notes](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-6-0.html#deprecated---baseurl) and the [migration guide (issue #62508)](https://github.com/microsoft/TypeScript/issues/62508), this is a stopgap, not a fix.

```json
{
  "compilerOptions": {
    "ignoreDeprecations": "6.0"
  }
}
```

It silences the warning; it doesn't complete the migration. Reach for it only when:

- You have many `tsconfig` files and can't change them all in one pass.
- Your codebase is large enough to need a staged migration.
- You need to keep CI green while planning the follow-up work.

If all you have is something like `baseUrl: "."`, just remove it.

## A decision checklist for real projects

Nothing fancy:

- Have `baseUrl`? Check first whether you can simply remove it.
- Have `paths`? Make each value explicit so it doesn't lean on `baseUrl`.
- Aliases scoped to a single package or app? Fine to keep.
- Aliases standing in for cross-package imports? Move them to package imports + workspace dependencies + `exports`.
- Alias only TypeScript understands and the runtime doesn't? Audit the bundler / runtime config too.

## Summary

The `baseUrl` deprecation isn't just "an option going away." The real shift is:

> Reduce implicit resolution rules. Express aliases and package boundaries explicitly.

`baseUrl` was convenient, but it hid two behaviors behind one option:

- a prefix role for `paths`
- a lookup root for bare imports

Bundling both into a single option is exactly what opened the gap between "what the developer thought they configured" and "what TypeScript actually did." So the action is clear:

1. Ask whether you actually need `baseUrl`.
2. In most cases, remove it.
3. Write the aliases you still want directly into `paths`.
4. Move cross-package wiring to real package imports and `exports`.

This direction fits a pnpm workspace monorepo especially well — the workspace model already pushes you to express module boundaries as packages.

### Short checklist

- [ ] Checked whether `baseUrl` can be removed
- [ ] Rewrote `paths` so it reads without relying on `baseUrl`
- [ ] Didn't overload `paths` for cross-package imports
- [ ] Expressed cross-package dependencies via `workspace:*`, package imports, and `exports`
- [ ] Verified TypeScript and the bundler agree on the same alias rules

## References

- [TSConfig `baseUrl` docs](https://www.typescriptlang.org/tsconfig/baseUrl.html)
- [TypeScript 6.0 release notes - `baseUrl` deprecation](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-6-0.html#deprecated---baseurl)
- [Deprecate, remove support for `baseUrl` - issue #62207](https://github.com/microsoft/TypeScript/issues/62207)
- [6.0 Migration Guide - issue #62508](https://github.com/microsoft/TypeScript/issues/62508)
- [Deprecate `baseUrl` - PR #62509](https://github.com/microsoft/TypeScript/pull/62509)
