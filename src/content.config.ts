import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({
    pattern: ['**/index.md', '!_drafts/**'],
    base: './src/content/posts',
  }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    categories: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
    coverImage: z.string().optional(),
  }),
});

const pages = defineCollection({
  loader: glob({
    pattern: '**/index.md',
    base: './src/content/pages',
  }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date().optional(),
  }),
});

export const collections = { posts, pages };
