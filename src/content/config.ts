import { z, defineCollection } from 'astro:content';

const articleCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    draft: z.boolean(),
    pubDate: z.string().transform((str) => new Date(str)),
    tags: z.array(z.string()).optional(),
    image: z.string().optional()
  })
});

export const collections = {
  article: articleCollection
};
