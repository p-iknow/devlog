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

export const collections = { posts };
