---
title: 'baseUrl: Why It Was Deprecated, and What to Do Now'
date: '2026-04-21'
draft: false
img: 'https://p-iknow.netlify.app/typescript.webp'
category: 'typescript'
tags:
  - 'typescript'
description: '`baseUrl` was deprecated in TypeScript 6. This post walks through what `baseUrl` originally did, why the TypeScript team deprecated it, and what you should do from here.'
lang: en
slug: baseurl-deprecation
---

![typescript](/typescript.webp)

## Background

`baseUrl`, which many of us have been using almost by reflex, was deprecated in TypeScript 6. Using a pnpm workspace monorepo as a running example — but keeping the discussion general — this post covers how `baseUrl` used to behave, why the TypeScript team deprecated it, and what you should do from here.

You can dig into the background in the [TSConfig `baseUrl` docs](https://www.typescriptlang.org/tsconfig/baseUrl.html), the [TypeScript 6.0 release notes](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-6-0.html#deprecated---baseurl), and [deprecation issue #62207](https://github.com/microsoft/TypeScript/issues/62207).

## The short version

- `baseUrl` is deprecated.
- You can use `paths` without `baseUrl`.
- The prefix role `baseUrl` used to play is clearer when you write it directly into each `paths` value.
- Boundaries between packages are better expressed through **real package imports** and `package.json` `exports`, rather than `tsconfig` `paths`.

In practice, what most projects need to do is:

> Remove `baseUrl`, keep only the `paths` you actually need and make them explicit, and move cross-package imports to real package boundaries.

The rest of the post explains how this conclusion falls out — from how `baseUrl` used to work, to the actual migration steps.

## What `baseUrl` originally was

On the surface, `baseUrl` looked simple. Many teams wrote something like this and it worked for years:

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

In other words, `baseUrl` was mentally treated as **a shared prefix for `paths`**. Plenty of blog posts, sample repos, and templates framed it that way too. That reading isn't wrong — but it hides a second, more implicit behavior.

## The issue: `baseUrl` did two things at once

The real problem is that TypeScript's interpretation was broader than most of us remembered. Officially, `baseUrl` did two jobs. This framing matches the [TypeScript 6.0 release notes](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-6-0.html#deprecated---baseurl) and [issue #62207](https://github.com/microsoft/TypeScript/issues/62207).

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

The second behavior is where the trouble starts. Say a developer only wants to open up `@app/*` as an alias. With `baseUrl: "./src"` set, TypeScript would still sometimes look for certain bare imports under `./src`.

That is, code like this:

```ts
import something from 'someModule.js'
```

could be resolved against `./src/someModule.js` as a candidate, even though the developer never explicitly added it to `paths`.

On the surface this looks harmless, but it's where the misunderstanding starts. The developer thinks: "I only opened two aliases." TypeScript thinks: "No, you also opened `./src` as an additional resolution base." That gap is exactly where the deprecation story begins.

## Why the TypeScript team deprecated it

The core reason is that **the meaning of the option was too implicit**. The TypeScript team makes that clear in [deprecation issue #62207](https://github.com/microsoft/TypeScript/issues/62207) and [PR #62509](https://github.com/microsoft/TypeScript/pull/62509).

### 1. Imports the developer never explicitly configured became resolution targets

Most users thought of `baseUrl` as a helper for `paths`. In reality, it could pull bare imports you didn't list in `paths` into the set of resolution candidates. The problem isn't just that it was "a bit broader" — it's that **resolution paths existed that the developer didn't realize they had opened**.

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
- Any other bare import follows normal package resolution

But TypeScript could also try `./src/someModule.js` as a candidate for:

```ts
import something from 'someModule.js'
```

So the developer thought they had only opened `@app/*` and `@lib/*`, while in practice the entire `./src` directory behaved as an extra lookup root.

### 2. TypeScript could find the import, but the runtime couldn't

This framing is sharper because it pins the issue on **who found what, and who didn't** — not on some vague "mismatch."

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

- **TypeScript**: Thanks to `baseUrl`, treats `./src/someModule.js` as a candidate and considers the import resolved.
- **Runtime / bundler**: Doesn't follow the `baseUrl` rule from `tsconfig`, so it looks at the same bare import and tries `node_modules` (or whatever resolution rules it knows).
- **Result**: The editor and type checker are green, but the module cannot be found at runtime.

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

TypeScript can find `src/config/load.ts` and quietly move on. But if Node.js or your bundler doesn't know that rule, it tries to resolve `'config/load'` as a package name and fails.

The heart of the issue is that `baseUrl` **resolved the import inside TypeScript, but didn't rewrite the import string into something the runtime could understand**. This is exactly the spirit of the [TSConfig `baseUrl` docs](https://www.typescriptlang.org/tsconfig/baseUrl.html) and the "module names are emitted as written" thread in [issue #26557](https://github.com/microsoft/TypeScript/issues/26557).

### 3. It didn't fit the modern ecosystem

Today, module boundaries are expressed far more explicitly than they used to be:

- package manager workspaces
- `exports` in `package.json`
- bundler / module resolution rules
- Node.js's standard package resolution

In that world, having a single `tsconfig` option silently change the lookup root only adds confusion. So the TypeScript team chose to stop carrying `baseUrl`'s ambiguous meaning forward, and lean into **explicit `paths` and explicit package boundaries** instead. This isn't just dropping one option — it's a shift away from "rules only TypeScript knows" toward "boundaries every tool understands."

## `paths` has worked without `baseUrl` for a long time

For years, many teams believed:

> You need `baseUrl` if you want to use `paths`.

From a modern TypeScript perspective, that assumption has been wrong for a while. As the [TSConfig `baseUrl` docs](https://www.typescriptlang.org/tsconfig/baseUrl.html) note, `paths` can be used without `baseUrl`. That changes the recommended shape of the config.

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

- Before: `baseUrl` hid behind the scenes, supplying both prefix and lookup root.
- Now: `paths` spells the mapping out **exactly as it is**.

A reader of the config can see, at a glance, where each alias actually goes.

## Resolving it: what to do now

Here's the practical part: what to actually do. Reading this alongside the [TypeScript 6.0 release notes](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-6-0.html#deprecated---baseurl) and [6.0 migration guide issue #62508](https://github.com/microsoft/TypeScript/issues/62508) makes the path clearer.

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

In this case, the fix is almost always **remove `baseUrl`, make `paths` explicit**. That's the direction the TypeScript team is pointing toward as well.

**Case B: You were relying on it as an actual lookup root**

If your codebase has bare imports that only work because `baseUrl` is quietly picking them up (no matching `paths` entry), you don't have a pure find-and-replace — you have a task of **making the real dependencies visible**. Choose one:

- Add the needed aliases explicitly to `paths`.
- Rewrite the internal imports as relative paths or clear aliases.
- Move to a proper package import structure.

### 2) For most projects, just remove `baseUrl`

Under TypeScript 6 and later, there's rarely a reason to introduce `baseUrl` in a new setup. This pattern in particular is safe to drop today:

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

`baseUrl` isn't really adding anything here — `paths` already describes the mapping you want. Simplify to:

```json
{
  "compilerOptions": {
    "paths": {
      "~/*": ["./src/*"]
    }
  }
}
```

### 3) Draw a line around how far `paths` should stretch

This matters a lot in monorepos.

**Fine: aliases inside a package or app**

```ts
import { Header } from '~/components/header'
import { cn } from '@/lib/utils'
```

These are local convenience aliases, scoped to the current app or package. Good for cutting down on relative-path hell.

**Be careful: aliases that cross package boundaries**

A root `tsconfig` that looks like this is something to watch:

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

It makes TypeScript happy, but it blurs your runtime, build, and deploy boundaries. These imports look like package imports, but they're actually leaning on a **virtual boundary** created by `tsconfig`. A cleaner split looks like this:

- **Inside a package**: `paths`
- **Between packages**: workspace dependency + `package.json` `exports` + real package imports

## Why this split matters even more in a pnpm workspace monorepo

pnpm workspaces let you treat internal packages like real packages. That means imports like `@repo/shared` can be expressed as **an actual dependency relationship**, not a `tsconfig` alias. So in a monorepo, it's much more natural to lean on what the package manager and `exports` already understand, rather than growing `baseUrl` / `paths` into a "global linker."

The benefits are concrete:

- **Package boundaries become visible**: Which app depends on which package shows up right in `package.json`.
- **Fewer TypeScript-only setups**: Virtual aliases that live only in `tsconfig` are more fragile than boundaries understood by the package manager and bundler together.
- **Public API becomes explicit via `exports`**: Instead of letting anyone import any file inside the package, you can declare the public surface in `package.json`.

In short: in a monorepo, you're better off using `paths` as a local helper and using **real package imports** as the wiring between packages.

## Is it okay to use `ignoreDeprecations: "6.0"`?

Yes, but be honest about what it is. Per the [TypeScript 6.0 release notes](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-6-0.html#deprecated---baseurl) and [migration guide issue #62508](https://github.com/microsoft/TypeScript/issues/62508), this is a stopgap, not a fix.

```json
{
  "compilerOptions": {
    "ignoreDeprecations": "6.0"
  }
}
```

It silences the warning; it doesn't complete the migration. Reach for it only when:

- You have many `tsconfig` files and can't change them all in one pass.
- You have a large codebase and need a staged migration.
- You need to keep CI green while planning the follow-up work.

If all you have is something like `baseUrl: "."`, it's usually easier to just remove it.

## A decision checklist for real projects

Nothing fancy — just:

- Have `baseUrl`? First check whether you can simply remove it.
- Have `paths`? Make each value explicit so it doesn't depend on `baseUrl`.
- Aliases scoped to one package / app? Fine to keep.
- Aliases standing in for cross-package imports? Move them to package imports + workspace dependencies + `exports`.
- Any alias only TypeScript understands and the runtime doesn't? Audit the bundler / runtime config too.

## Summary

The `baseUrl` deprecation isn't just "an option going away." The real shift is:

> Reduce implicit resolution rules. Express aliases and package boundaries explicitly.

`baseUrl` was convenient, but it was hiding a lot of behavior:

- Prefix role for `paths`
- Lookup root for bare imports

Bundling both into one option is exactly what opened the gap between "what the developer thought they configured" and "what TypeScript actually did." So the user-facing action is clear:

1. Ask whether you actually need `baseUrl`.
2. In most cases, remove it.
3. Write the aliases you still want directly into `paths`.
4. Move cross-package wiring to real package imports and `exports`.

In a pnpm workspace monorepo, this direction fits especially well — the workspace model is already pushing you to express module boundaries as packages.

### Short checklist

- [ ] Checked whether `baseUrl` can be removed
- [ ] Rewrote `paths` so it reads without relying on `baseUrl`
- [ ] Didn't abuse `paths` for cross-package imports
- [ ] Expressed cross-package dependencies via `workspace:*`, package imports, and `exports`
- [ ] Verified TypeScript and the bundler agree on the same alias rules

## References

- [TSConfig `baseUrl` docs](https://www.typescriptlang.org/tsconfig/baseUrl.html)
- [TypeScript 6.0 release notes - `baseUrl` deprecation](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-6-0.html#deprecated---baseurl)
- [Deprecate, remove support for `baseUrl` - issue #62207](https://github.com/microsoft/TypeScript/issues/62207)
- [6.0 Migration Guide - issue #62508](https://github.com/microsoft/TypeScript/issues/62508)
- [Deprecate `baseUrl` - PR #62509](https://github.com/microsoft/TypeScript/pull/62509)
