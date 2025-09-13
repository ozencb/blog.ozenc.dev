import { z, defineCollection } from "astro:content";

export const pubDate = z.preprocess((val) => {
  if (typeof val === "string") {
    return new Date(val);
  }
  if (val instanceof Date) {
    return val;
  }
  return val;
}, z.date());

export const draft = z.preprocess((val) => {
  if (typeof val === "string") {
    return val === "true";
  }
  if (val instanceof Boolean) {
    return val;
  }
  return val;
}, z.boolean());

const articleCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    draft: draft,
    pubDate: pubDate,
    tags: z.array(z.string()).optional(),
    image: z.string().optional(),
  }),
});

export const collections = {
  article: articleCollection,
};
