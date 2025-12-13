# Astro Migration Progress Tracker

이 문서는 Gatsby → Astro 마이그레이션 진행 상황을 추적합니다.

---

## 전체 진행률

| Phase | 설명 | 상태 | 진행률 |
|-------|------|------|--------|
| Phase 1 | 프로젝트 초기 설정 | ⬜ 대기 | 0% |
| Phase 2 | 기본 설정 파일 구성 | ⬜ 대기 | 0% |
| Phase 3 | 콘텐츠 마이그레이션 | ⬜ 대기 | 0% |
| Phase 4 | 레이아웃/컴포넌트 마이그레이션 | ⬜ 대기 | 0% |
| Phase 5 | 페이지 마이그레이션 | ⬜ 대기 | 0% |
| Phase 6 | 기능 마이그레이션 | ⬜ 대기 | 0% |
| Phase 7 | 배포 설정 | ⬜ 대기 | 0% |
| Phase 8 | 테스트 및 최적화 | ⬜ 대기 | 0% |

**상태 범례:** ⬜ 대기 | 🔄 진행중 | ✅ 완료 | ⏸️ 보류

---

## Phase 1: 프로젝트 초기 설정 (In-place 마이그레이션)

### 작업 목록
| # | 작업 | 상태 | 날짜 | 비고 |
|---|------|------|------|------|
| 1.0 | 패키지 매니저 변경 (npm → pnpm) | ⬜ | | |
| 1.0a | node_modules, package-lock.json 삭제 | ⬜ | | |
| 1.0b | pnpm install 실행 | ⬜ | | |
| 1.0c | package.json에 packageManager 필드 추가 | ⬜ | | |
| 1.1 | Gatsby 관련 패키지 제거 | ⬜ | | |
| 1.2 | styled-components 관련 패키지 제거 | ⬜ | | |
| 1.3 | 기타 불필요한 패키지 제거 | ⬜ | | |
| 1.4 | Astro 설치 (`pnpm add astro`) | ⬜ | | |
| 1.5 | MDX 통합 설치 (`pnpm astro add mdx`) | ⬜ | | |
| 1.6 | Sitemap 통합 설치 (`pnpm astro add sitemap`) | ⬜ | | |
| 1.7 | React 통합 설치 (`pnpm astro add react`) | ⬜ | 선택 |
| 1.8 | Tailwind CSS v4 설치 (`tailwindcss @tailwindcss/vite`) | ⬜ | | |
| 1.9 | astro-expressive-code 설치 | ⬜ | | |
| 1.10 | @tailwindcss/typography, clsx, tailwind-merge 설치 | ⬜ | | |
| 1.11 | @astrojs/rss 설치 | ⬜ | | |
| 1.12 | remark-math, rehype-katex, katex 설치 | ⬜ | | |
| 1.13 | date-fns 설치 | ⬜ | | |
| 1.14 | 개발 의존성 설치 (prettier, eslint, typescript) | ⬜ | | |
| 1.15 | Gatsby 설정 파일 제거 (gatsby-config.ts, gatsby-node.js) | ⬜ | | |
| 1.16 | 기존 src 폴더 백업 (src → src.gatsby-backup) | ⬜ | | |
| 1.17 | static → public 이름 변경 | ⬜ | | |
| 1.18 | 새 src 디렉토리 구조 생성 | ⬜ | | |

---

## Phase 2: 기본 설정 파일 구성

### 작업 목록
| # | 작업 | 상태 | 날짜 | 비고 |
|---|------|------|------|------|
| 2.1 | astro.config.mjs 설정 (Vite + Tailwind v4) | ⬜ | | |
| 2.2 | astro-expressive-code 설정 | ⬜ | | |
| 2.3 | Content Collections 스키마 정의 (src/content/config.ts) | ⬜ | | |
| 2.4 | global.css 설정 (Tailwind v4 + Pretendard + KaTeX) | ⬜ | | |
| 2.5 | colors.css 설정 (테마 색상) | ⬜ | | |
| 2.6 | TypeScript 설정 (tsconfig.json) | ⬜ | | |
| 2.7 | Path alias 설정 (@ → /src) | ⬜ | | |
| 2.8 | Prettier 설정 (.prettierrc) | ⬜ | | |
| 2.9 | ESLint 설정 (eslint.config.js) | ⬜ | | |

---

## Phase 3: 콘텐츠 마이그레이션

### 작업 목록
| # | 작업 | 상태 | 날짜 | 비고 |
|---|------|------|------|------|
| 3.1 | Markdown 파일 복사 (contents/posts → src/content/posts) | ⬜ | | |
| 3.2 | Frontmatter 호환성 검토 | ⬜ | | |
| 3.3 | template 필드 제거 스크립트 작성/실행 | ⬜ | | |
| 3.4 | 이미지 파일 이동 (static → public) | ⬜ | | |
| 3.5 | 이미지 경로 참조 업데이트 | ⬜ | | |
| 3.6 | draft 포스트 확인 | ⬜ | | |

### 콘텐츠 카테고리별 진행 상황
| 카테고리 | 파일 수 | 완료 | 상태 |
|----------|---------|------|------|
| algorithm | - | - | ⬜ |
| backend | - | - | ⬜ |
| cs | - | - | ⬜ |
| css | - | - | ⬜ |
| data-structure | - | - | ⬜ |
| editor | - | - | ⬜ |
| functional-programming | - | - | ⬜ |
| git | - | - | ⬜ |
| html | - | - | ⬜ |
| Issue | - | - | ⬜ |
| js | - | - | ⬜ |
| log | - | - | ⬜ |
| next-js | - | - | ⬜ |
| project | - | - | ⬜ |
| react | - | - | ⬜ |
| review | - | - | ⬜ |
| typescript | - | - | ⬜ |
| web-frontend | - | - | ⬜ |

---

## Phase 4: 레이아웃/컴포넌트 마이그레이션

### 레이아웃
| # | 컴포넌트 | Gatsby 경로 | Astro 경로 | 상태 | 비고 |
|---|----------|-------------|------------|------|------|
| 4.1 | BaseLayout | src/components/Layout | src/layouts/BaseLayout.astro | ⬜ | |
| 4.2 | PostLayout | src/templates/Post.tsx | src/layouts/PostLayout.astro | ⬜ | |
| 4.3 | SeriesLayout | src/templates/Series.tsx | src/layouts/SeriesLayout.astro | ⬜ | |

### 공통 컴포넌트
| # | 컴포넌트 | 상태 | Tailwind 변환 | 비고 |
|---|----------|------|---------------|------|
| 4.4 | Header | ⬜ | ⬜ | |
| 4.5 | Footer | ⬜ | ⬜ | |
| 4.6 | Bio | ⬜ | ⬜ | |
| 4.7 | Divider | ⬜ | ⬜ | |
| 4.8 | Title | ⬜ | ⬜ | |
| 4.9 | VerticalSpace | ⬜ | ⬜ | |
| 4.10 | TextField | ⬜ | ⬜ | 검색용 |
| 4.11 | NoContent | ⬜ | ⬜ | |

### 리스트 컴포넌트
| # | 컴포넌트 | 상태 | Tailwind 변환 | 비고 |
|---|----------|------|---------------|------|
| 4.12 | PostList | ⬜ | ⬜ | |
| 4.13 | CategoryList | ⬜ | ⬜ | |
| 4.14 | TagList | ⬜ | ⬜ | |
| 4.15 | SeriesList | ⬜ | ⬜ | |
| 4.16 | SideCategoryList | ⬜ | ⬜ | |
| 4.17 | SideTagList | ⬜ | ⬜ | |

### Article 컴포넌트
| # | 컴포넌트 | 상태 | Tailwind 변환 | 비고 |
|---|----------|------|---------------|------|
| 4.18 | Article/Header | ⬜ | ⬜ | |
| 4.19 | Article/Body | ⬜ | ⬜ | prose 클래스 사용 |
| 4.20 | Article/Body/Toc | ⬜ | ⬜ | 목차 |
| 4.21 | Article/Footer | ⬜ | ⬜ | |
| 4.22 | Article/Series | ⬜ | ⬜ | |

### 기타 컴포넌트
| # | 컴포넌트 | 상태 | 비고 |
|---|----------|------|------|
| 4.23 | RevealOnScroll | ⬜ | 애니메이션 |
| 4.24 | Comments (Utterances) | ⬜ | |

---

## Phase 5: 페이지 마이그레이션

### 작업 목록
| # | 페이지 | Gatsby 경로 | Astro 경로 | 상태 | 비고 |
|---|--------|-------------|------------|------|------|
| 5.1 | 메인 페이지 | src/pages/index.tsx | src/pages/index.astro | ⬜ | |
| 5.2 | 포스트 상세 | src/templates/Post.tsx | src/pages/posts/[...slug].astro | ⬜ | |
| 5.3 | 카테고리 목록 | src/pages/categories.tsx | src/pages/categories.astro | ⬜ | |
| 5.4 | 태그 목록 | src/pages/tags.tsx | src/pages/tags.astro | ⬜ | |
| 5.5 | 시리즈 목록 | src/pages/series.tsx | src/pages/series.astro | ⬜ | |
| 5.6 | 시리즈 상세 | src/templates/Series.tsx | src/pages/series/[slug].astro | ⬜ | |
| 5.7 | 검색 | src/pages/search.tsx | src/pages/search.astro | ⬜ | |
| 5.8 | 404 | src/pages/404.tsx | src/pages/404.astro | ⬜ | |

---

## Phase 6: 기능 마이그레이션

### 작업 목록
| # | 기능 | 상태 | 비고 |
|---|------|------|------|
| 6.1 | RSS 피드 생성 (src/pages/rss.xml.js) | ⬜ | @astrojs/rss |
| 6.2 | Sitemap 생성 | ⬜ | @astrojs/sitemap |
| 6.3 | Utterances 댓글 | ⬜ | |
| 6.4 | Google Analytics | ⬜ | gtag |
| 6.5 | 검색 기능 | ⬜ | Pagefind 또는 Fuse.js |
| 6.6 | 다크모드 | ⬜ | Tailwind dark: |
| 6.7 | SEO 메타 태그 | ⬜ | |
| 6.8 | OG Image | ⬜ | |
| 6.9 | 시리즈 네비게이션 (이전/다음 글) | ⬜ | |
| 6.10 | 코드 복사 버튼 | ⬜ | |

---

## Phase 7: 배포 설정

### 작업 목록
| # | 작업 | 상태 | 비고 |
|---|------|------|------|
| 7.1 | netlify.toml 설정 | ⬜ | |
| 7.2 | 빌드 테스트 (로컬) | ⬜ | |
| 7.3 | Preview 배포 테스트 | ⬜ | |
| 7.4 | 프로덕션 배포 | ⬜ | |
| 7.5 | 도메인/DNS 설정 확인 | ⬜ | |

---

## Phase 8: 테스트 및 최적화

### 기능 테스트
| # | 테스트 항목 | 상태 | 비고 |
|---|-------------|------|------|
| 8.1 | 모든 포스트 렌더링 | ⬜ | |
| 8.2 | 코드 하이라이팅 | ⬜ | |
| 8.3 | KaTeX 수식 렌더링 | ⬜ | |
| 8.4 | 이미지 로딩 | ⬜ | |
| 8.5 | RSS 피드 | ⬜ | |
| 8.6 | Sitemap | ⬜ | |
| 8.7 | 404 페이지 | ⬜ | |
| 8.8 | 검색 기능 | ⬜ | |
| 8.9 | 댓글 기능 | ⬜ | |
| 8.10 | 다크모드 전환 | ⬜ | |

### 반응형 테스트
| # | 디바이스 | 상태 | 비고 |
|---|----------|------|------|
| 8.11 | 모바일 (< 640px) | ⬜ | |
| 8.12 | 태블릿 (640px - 1024px) | ⬜ | |
| 8.13 | 데스크톱 (> 1024px) | ⬜ | |

### 성능 최적화
| # | 항목 | 상태 | 목표 | 결과 |
|---|------|------|------|------|
| 8.14 | Lighthouse Performance | ⬜ | 90+ | |
| 8.15 | Lighthouse Accessibility | ⬜ | 90+ | |
| 8.16 | Lighthouse Best Practices | ⬜ | 90+ | |
| 8.17 | Lighthouse SEO | ⬜ | 90+ | |
| 8.18 | Core Web Vitals (LCP) | ⬜ | < 2.5s | |
| 8.19 | Core Web Vitals (FID) | ⬜ | < 100ms | |
| 8.20 | Core Web Vitals (CLS) | ⬜ | < 0.1 | |

### 추가 최적화
| # | 항목 | 상태 | 비고 |
|---|------|------|------|
| 8.21 | View Transitions 적용 | ⬜ | 선택 |
| 8.22 | 이미지 최적화 (Astro Image) | ⬜ | |
| 8.23 | 폰트 최적화 | ⬜ | |
| 8.24 | 불필요한 JS 제거 | ⬜ | |

---

## 이슈 및 메모

### 발견된 이슈
| # | 이슈 | 심각도 | 상태 | 해결 방법 |
|---|------|--------|------|-----------|
| | | | | |

### 메모
-

---

## 변경 이력

| 날짜 | 변경 내용 |
|------|----------|
| 2024-12-13 | 마이그레이션 계획 및 진행 상황 문서 생성 |
| 2024-12-13 | blog-reference 프로젝트 참고하여 패키지 구성 업데이트 |

---

## 참고 링크

- [MIGRATION_PLAN.md](./MIGRATION_PLAN.md) - 상세 마이그레이션 계획
- [Astro 공식 문서](https://docs.astro.build)
- [Tailwind CSS 문서](https://tailwindcss.com/docs)
