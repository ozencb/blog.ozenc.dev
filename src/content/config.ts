import { defineCollection } from "astro:content";
import { articleSchema } from "../schemas";

export const collections = {
  article: defineCollection({
    schema: articleSchema,
  }),
};
