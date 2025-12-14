# Gatsby to Astro Migration Plan

> ✅ **마이그레이션 완료** (2024-12-13)
>
> 이 문서는 Gatsby → Astro 마이그레이션 계획을 담고 있습니다. 마이그레이션이 성공적으로 완료되었습니다.
> 현재 상태는 [MIGRATION_PROGRESS.md](./MIGRATION_PROGRESS.md)를 참고하세요.

## 개요

### 이전 스택 (Gatsby)
- **Framework**: Gatsby 5
- **Styling**: styled-components v6
- **Content**: Markdown (gatsby-transformer-remark)
- **Syntax Highlighting**: Prism.js
- **Math**: KaTeX
- **Comments**: Utterances
- **Hosting**: Netlify

### 현재 스택 (Astro) ✅
- **Framework**: Astro 5.x
- **Styling**: Tailwind CSS v4 (@tailwindcss/vite)
- **Content**: Astro Content Collections
- **Syntax Highlighting**: astro-expressive-code (Shiki 기반)
- **Math**: KaTeX (remark-math + rehype-katex)
- **Comments**: Utterances
- **Hosting**: Netlify

### 참고 프로젝트
- [oedotme/website](https://github.com/oedotme/website) - Astro 5 + Tailwind v4 블로그

---

## Phase 1: 프로젝트 초기 설정 (In-place 마이그레이션)

### 1.0 패키지 매니저 변경 (npm → pnpm)
```bash
# pnpm 설치 (없는 경우)
npm install -g pnpm

# node_modules 및 lock 파일 제거
rm -rf node_modules
rm package-lock.json

# pnpm으로 기존 의존성 설치 (삭제 전 테스트용)
pnpm install

# package.json에 packageManager 필드 추가
# "packageManager": "pnpm@10.5.2"
```

### 1.1 기존 Gatsby 패키지 제거
```bash
# Gatsby 관련 패키지 제거
pnpm remove gatsby gatsby-image gatsby-plugin-catch-links gatsby-plugin-feed \
  gatsby-plugin-google-gtag gatsby-plugin-image gatsby-plugin-manifest \
  gatsby-plugin-mdx gatsby-plugin-netlify gatsby-plugin-offline \
  gatsby-plugin-resolve-src gatsby-plugin-robots-txt gatsby-plugin-sharp \
  gatsby-plugin-sitemap gatsby-plugin-styled-components gatsby-plugin-web-font-loader \
  gatsby-remark-images gatsby-remark-images-anywhere gatsby-remark-katex \
  gatsby-remark-prismjs gatsby-remark-static-images gatsby-source-filesystem \
  gatsby-transformer-remark gatsby-transformer-sharp

# styled-components 제거
pnpm remove styled-components styled-reset babel-plugin-styled-components

# 기타 불필요한 패키지 제거
pnpm remove prism-themes prismjs react-helmet react-md-spinner react-scroll react-utterances
```

### 1.2 Astro 설치
```bash
pnpm add astro
```

### 1.3 필수 통합 설치
```bash
# MDX 지원
pnpm astro add mdx

# Sitemap
pnpm astro add sitemap

# React (기존 컴포넌트 점진적 마이그레이션용, 선택)
pnpm astro add react
```

### 1.4 추가 패키지 설치 (blog-reference 참고)
```bash
# Tailwind CSS v4 (Vite 플러그인 방식)
pnpm add tailwindcss @tailwindcss/vite

# 코드 하이라이팅 (expressive-code - Shiki 기반)
pnpm add astro-expressive-code @expressive-code/plugin-line-numbers
pnpm add @shikijs/transformers

# Tailwind 유틸리티
pnpm add @tailwindcss/typography
pnpm add clsx tailwind-merge

# RSS 피드
pnpm add @astrojs/rss

# 마크다운 플러그인
pnpm add remark-math rehype-katex katex
pnpm add @r4ai/remark-callout  # callout 지원 (선택)

# 날짜 처리
pnpm add date-fns
```

### 1.5 개발 의존성
```bash
pnpm add -D @astrojs/check typescript
pnpm add -D prettier prettier-plugin-astro prettier-plugin-tailwindcss
pnpm add -D eslint eslint-plugin-astro
```

### 1.6 Gatsby 설정 파일 제거
```bash
# Gatsby 설정 파일 제거 (백업 후)
rm gatsby-config.ts gatsby-node.js
rm -rf .cache

# 기존 src 폴더 백업
mv src src.gatsby-backup
```

### 1.7 프로젝트 구조 재구성 (In-place)
```
devlog/
├── astro.config.mjs           # 새로 생성
├── src/
│   ├── content/
│   │   ├── config.ts          # Content Collections 스키마
│   │   └── posts/             # contents/posts에서 이동
│   ├── components/            # src.gatsby-backup에서 마이그레이션
│   ├── layouts/
│   │   ├── BaseLayout.astro
│   │   └── PostLayout.astro
│   ├── pages/
│   │   ├── index.astro
│   │   ├── posts/[...slug].astro
│   │   ├── categories.astro
│   │   ├── tags.astro
│   │   ├── series.astro
│   │   ├── search.astro
│   │   ├── 404.astro
│   │   └── rss.xml.js
│   └── styles/
│       ├── global.css
│       └── colors.css
├── public/                    # static에서 이름 변경
│   └── (static assets)
├── contents/posts/            # 기존 콘텐츠 (src/content/posts로 이동 예정)
├── src.gatsby-backup/         # 기존 Gatsby 소스 백업
├── blog-config.ts             # 유지 (설정 참조용)
└── package.json
```

### 1.8 static → public 이름 변경
```bash
mv static public
```

---

## Phase 2: 기본 설정 파일 구성

### 2.1 astro.config.mjs (blog-reference 패턴 참고)
```javascript
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import tailwind from '@tailwindcss/vite';
import astroExpressiveCode from 'astro-expressive-code';
import { pluginLineNumbers } from '@expressive-code/plugin-line-numbers';
import {
  transformerNotationDiff,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
} from '@shikijs/transformers';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

export default defineConfig({
  site: 'https://p-iknow.netlify.app',

  // Vite 설정 (Tailwind v4 + path alias)
  vite: {
    resolve: { alias: { '@': '/src' } },
    plugins: [tailwind()],
  },

  // 마크다운 설정
  markdown: {
    syntaxHighlight: false, // expressive-code가 처리
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
    shikiConfig: {
      transformers: [
        transformerNotationDiff(),
        transformerNotationHighlight(),
        transformerNotationWordHighlight(),
      ],
    },
  },

  // prefetch 설정
  prefetch: { prefetchAll: true },

  // 통합
  integrations: [
    // 코드 하이라이팅 (MDX 전에 배치)
    astroExpressiveCode({
      themes: ['github-light', 'github-dark'],
      useDarkModeMediaQuery: true,
      themeCssRoot: 'html',
      themeCssSelector: (theme) => `[data-theme='${theme.type}']`,
      plugins: [pluginLineNumbers()],
      defaultProps: {
        showLineNumbers: true, // 기존 Prism 설정 유지
      },
    }),
    mdx(),
    sitemap(),
    react(),
  ],
});
```

### 2.2 Content Collections 스키마 (src/content/config.ts)
```typescript
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    update: z.coerce.date().optional(),
    draft: z.boolean().default(false),
    category: z.string().optional(),
    tags: z.array(z.string()).default([]),
    series: z.string().optional(),
    img: z.string().optional(),
  }),
});

export const collections = { posts };
```

### 2.3 Tailwind CSS v4 설정

**src/styles/global.css**
```css
/* Tailwind CSS v4 */
@import 'tailwindcss';
@plugin '@tailwindcss/typography';

/* 커스텀 폰트 - Pretendard */
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard-dynamic-subset.css');

/* KaTeX 스타일 */
@import 'katex/dist/katex.min.css';

/* 커스텀 CSS 변수 */
@theme {
  --font-sans: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
  --color-surface: #ffffff;
  --color-default: #1a1a1a;
}

/* 다크모드 */
@media (prefers-color-scheme: dark) {
  :root {
    --color-surface: #1a1a1a;
    --color-default: #ffffff;
  }
}
```

**src/styles/colors.css** (선택 - 테마 색상 분리)
```css
:root {
  --color-primary: #3b82f6;
  --color-secondary: #6b7280;
  /* ... */
}

[data-theme='dark'] {
  --color-surface: #0d1117;
  --color-default: #f0f6fc;
}
```

---

## Phase 3: 콘텐츠 마이그레이션

### 3.1 Markdown 파일 마이그레이션
- `contents/posts/` → `src/content/posts/`로 복사
- Frontmatter 호환성 확인:
  - `template: "post"` 필드 제거 (불필요)
  - `slug` 필드가 있으면 파일 경로로 반영

### 3.2 이미지 처리
- 로컬 이미지: `public/` 폴더로 이동
- 상대 경로 이미지 참조 업데이트
- Gatsby의 `gatsby-remark-images` 대체:
  - Astro의 `<Image />` 컴포넌트 사용
  - 또는 표준 Markdown 이미지 문법 유지

### 3.3 Frontmatter 변환 스크립트 (선택)
```javascript
// scripts/migrate-frontmatter.js
// template 필드 제거, date 포맷 확인 등
```

---

## Phase 4: 레이아웃 및 컴포넌트 마이그레이션

### 4.1 Base Layout (styled-components → Tailwind)

**Before (Gatsby + styled-components):**
```tsx
const Container = styled.div`
  max-width: 720px;
  margin: 0 auto;
  padding: 0 1rem;
`;
```

**After (Astro + Tailwind):**
```astro
<div class="max-w-3xl mx-auto px-4">
  <slot />
</div>
```

### 4.2 주요 컴포넌트 마이그레이션 순서
1. `Layout` → `BaseLayout.astro`
2. `Header` → `Header.astro`
3. `Footer` → `Footer.astro`
4. `PostList` → `PostList.astro`
5. `Bio` → `Bio.astro`
6. `CategoryList` → `CategoryList.astro`
7. `TagList` → `TagList.astro`
8. `SeriesList` → `SeriesList.astro`
9. `Article/Body` → Tailwind Typography (`prose` 클래스)
10. `Article/Header` → `PostHeader.astro`
11. `Article/Footer` → `PostFooter.astro`
12. `Toc` → `TableOfContents.astro`

### 4.3 Tailwind Typography 설정
```astro
<!-- PostLayout.astro -->
<article class="prose prose-lg dark:prose-invert max-w-none">
  <Content />
</article>
```

---

## Phase 5: 페이지 마이그레이션

### 5.1 메인 페이지 (src/pages/index.astro)
```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../layouts/BaseLayout.astro';
import PostList from '../components/PostList.astro';

const posts = await getCollection('posts', ({ data }) => !data.draft);
const sortedPosts = posts.sort((a, b) =>
  b.data.date.valueOf() - a.data.date.valueOf()
);
---
<BaseLayout title="p-iknow's devlog">
  <PostList posts={sortedPosts} />
</BaseLayout>
```

### 5.2 포스트 상세 페이지 (src/pages/posts/[...slug].astro)
```astro
---
import { getCollection, render } from 'astro:content';
import PostLayout from '../../layouts/PostLayout.astro';

export async function getStaticPaths() {
  const posts = await getCollection('posts');
  return posts.map(post => ({
    params: { slug: post.id },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content, headings } = await render(post);
---
<PostLayout frontmatter={post.data} headings={headings}>
  <Content />
</PostLayout>
```

### 5.3 카테고리/태그/시리즈 페이지
- 동적 라우팅 또는 정적 페이지로 구현
- `getCollection`으로 데이터 필터링

### 5.4 RSS 피드 (src/pages/rss.xml.js)
```javascript
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = await getCollection('posts', ({ data }) => !data.draft);
  return rss({
    title: "p-iknow's devlog",
    description: '많은 것을 이해하고 싶습니다.',
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description,
      link: `/posts/${post.id}/`,
    })),
  });
}
```

---

## Phase 6: 기능 마이그레이션

### 6.1 Utterances 댓글
```astro
<!-- components/Comments.astro -->
<script
  src="https://utteranc.es/client.js"
  repo="p-iknow/p-iknow-devlog-comment"
  issue-term="pathname"
  theme="github-light"
  crossorigin="anonymous"
  async
></script>
```

### 6.2 검색 기능
- 클라이언트 사이드 검색: Pagefind 또는 Fuse.js 사용
```bash
npx astro add pagefind
```

### 6.3 Google Analytics
```astro
<!-- BaseLayout.astro head -->
<script async src="https://www.googletagmanager.com/gtag/js?id=UA-110581115-1"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'UA-110581115-1');
</script>
```

### 6.4 다크모드
```javascript
// Tailwind v4에서 dark mode 설정
// tailwind.config.mjs
export default {
  darkMode: 'class',
  // ...
}
```

---

## Phase 7: 배포 설정

### 7.1 Netlify 설정
```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/404"
  status = 404
```

### 7.2 빌드 스크립트
```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview"
  }
}
```

---

## Phase 8: 테스트 및 최적화

### 8.1 체크리스트
- [ ] 모든 포스트 렌더링 확인
- [ ] 코드 하이라이팅 동작 확인
- [ ] KaTeX 수식 렌더링 확인
- [ ] 이미지 로딩 확인
- [ ] RSS 피드 생성 확인
- [ ] Sitemap 생성 확인
- [ ] 404 페이지 동작 확인
- [ ] 모바일 반응형 확인
- [ ] Lighthouse 성능 점수 확인
- [ ] SEO 메타 태그 확인

### 8.2 성능 최적화
- View Transitions API 적용
- 이미지 최적화 (Astro Image)
- 폰트 최적화

---

## 마이그레이션 전략

### 권장 접근 방식: 점진적 마이그레이션
1. 새 Astro 프로젝트를 별도 브랜치에서 시작
2. 콘텐츠(Markdown)를 먼저 마이그레이션하고 렌더링 확인
3. 핵심 레이아웃 구현 (Tailwind 사용)
4. 컴포넌트를 하나씩 변환
5. 기존 Gatsby 사이트와 병행 테스트
6. 완료 후 메인 브랜치로 교체

### 예상 작업량
- Phase 1-2: 프로젝트 설정 (1일)
- Phase 3: 콘텐츠 마이그레이션 (1일)
- Phase 4: 컴포넌트 마이그레이션 (3-5일)
- Phase 5: 페이지 마이그레이션 (2일)
- Phase 6: 기능 마이그레이션 (2일)
- Phase 7-8: 배포 및 테스트 (1-2일)

---

## 부록: package.json 예시

blog-reference 프로젝트 기반 권장 패키지 구성:

```json
{
  "name": "p-iknow-devlog",
  "type": "module",
  "version": "1.0.0",
  "packageManager": "pnpm@10.5.2",
  "scripts": {
    "dev": "astro dev --port 3000",
    "build": "astro build",
    "preview": "astro preview --port 5000",
    "type-check": "astro check && tsc --noEmit",
    "format": "prettier --write 'src/**/*.{astro,css,html,json,md,mdx,js,jsx,ts,tsx}'",
    "lint": "eslint --fix 'src/**/*.{astro,js,jsx,ts,tsx}'"
  },
  "dependencies": {
    "@astrojs/mdx": "^4.x",
    "@astrojs/rss": "^4.x",
    "@astrojs/sitemap": "^3.x",
    "@expressive-code/plugin-line-numbers": "^0.41.x",
    "@shikijs/transformers": "^3.x",
    "astro": "^5.x",
    "astro-expressive-code": "^0.41.x",
    "clsx": "^2.x",
    "date-fns": "^4.x",
    "katex": "^0.16.x",
    "rehype-katex": "^7.x",
    "remark-math": "^6.x",
    "tailwind-merge": "^3.x"
  },
  "devDependencies": {
    "@astrojs/check": "^0.9.x",
    "@astrojs/react": "^4.x",
    "@tailwindcss/typography": "^0.5.x",
    "@tailwindcss/vite": "^4.x",
    "eslint": "^9.x",
    "eslint-plugin-astro": "^1.x",
    "prettier": "^3.x",
    "prettier-plugin-astro": "^0.14.x",
    "prettier-plugin-tailwindcss": "^0.7.x",
    "react": "^18.x",
    "react-dom": "^18.x",
    "tailwindcss": "^4.x",
    "typescript": "^5.x"
  },
  "pnpm": {
    "onlyBuiltDependencies": [
      "@tailwindcss/oxide",
      "esbuild",
      "sharp"
    ]
  }
}
```

---

## 참고 자료

- [Astro 공식 문서](https://docs.astro.build)
- [Gatsby to Astro 마이그레이션 가이드](https://docs.astro.build/en/guides/migrate-to-astro/from-gatsby/)
- [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/)
- [Tailwind CSS v4 문서](https://tailwindcss.com/docs)
- [@tailwindcss/typography](https://tailwindcss.com/docs/typography-plugin)
- [Expressive Code](https://expressive-code.com/) - 코드 하이라이팅
- [oedotme/website](https://github.com/oedotme/website) - 참고 프로젝트
