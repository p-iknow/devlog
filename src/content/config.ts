import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import { LOCALES } from "@/config/locale";

const posts = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/posts",
    // 파일 경로 기반으로 id 생성 (frontmatter slug 대신)
    generateId: ({ entry }) => {
      // entry는 파일 경로에서 확장자를 제외한 값 (예: "log/첫삽은아득하지만")
      return entry.replace(/\.md$/, "");
    },
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    update: z.coerce.date().optional(),
    draft: z.boolean().default(false),
    "dev-only": z.boolean().default(false), // dev 환경에서만 보임
    category: z.string().optional(),
    tags: z.array(z.string()).default([]),
    series: z.string().optional(),
    img: z.string().optional(),
    lang: z.enum(LOCALES).optional(), // 파일명에서 추출 (예: post.ko.md -> ko)
    slug: z.string(), // URL용 slug (폴더경로/kebab-case-영문)
  }),
});

// 시리즈 메타정보 (각 시리즈 폴더의 _index*.md)
const series = defineCollection({
  loader: glob({
    pattern: "*/_index*.md",
    base: "./src/content/series",
    generateId: ({ entry }) => entry.replace(/\.md$/, ""),
  }),
  schema: z.object({
    title: z.string(),
    slug: z.string().optional(),
    description: z.string(),
    lang: z.enum(LOCALES).optional(),
  }),
});

// 시리즈에 속한 글들 (_index.md 제외)
const seriesPosts = defineCollection({
  loader: glob({
    pattern: "**/[!_]*.md",
    base: "./src/content/series",
    generateId: ({ entry }) => entry.replace(/\.md$/, ""),
  }),
  schema: z.object({
    title: z.string(),
    slug: z.string().optional(),
    description: z.string(),
    date: z.coerce.date(),
    update: z.coerce.date().optional(),
    draft: z.boolean().default(false),
    "dev-only": z.boolean().default(false),
    series: z.string(), // 시리즈 slug (예: 'markdown-guide')
    category: z.string().optional(),
    tags: z.array(z.string()).default([]),
    part: z.number().optional(), // 시리즈 내 순서 (없으면 파일명/날짜로 정렬)
    img: z.string().optional(),
    lang: z.enum(LOCALES).optional(),
  }),
});

export const collections = { posts, series, seriesPosts };
