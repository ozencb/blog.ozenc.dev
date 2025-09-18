import { defineCollection } from "astro:content";
import { articleSchema, externalPostSchema } from "../schemas";

export const collections = {
  article: defineCollection({
    schema: articleSchema,
  }),
  external: defineCollection({
    schema: externalPostSchema,
  }),
};
