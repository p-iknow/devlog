import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const posts = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/posts" }),
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
  }),
});

// 시리즈 메타정보 (각 시리즈 폴더의 _index.md)
const series = defineCollection({
  loader: glob({ pattern: "*/_index.md", base: "./src/content/series" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
  }),
});

// 시리즈에 속한 글들 (_index.md 제외)
const seriesPosts = defineCollection({
  loader: glob({ pattern: "**/[!_]*.md", base: "./src/content/series" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    update: z.coerce.date().optional(),
    draft: z.boolean().default(false),
    "dev-only": z.boolean().default(false),
    tags: z.array(z.string()).default([]),
    order: z.number().optional(), // 시리즈 내 순서 (없으면 파일명/날짜로 정렬)
    img: z.string().optional(),
  }),
});

export const collections = { posts, series, seriesPosts };
