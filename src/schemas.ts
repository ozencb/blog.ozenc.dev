import { z } from "astro:content";

export const postTypeSchema = z.enum([
  "ARTICLE",
  "RESOURCE",
  "PROJECT",
  "LIKED",
]);

export const pubDateProcessor = z.preprocess((val) => {
  if (typeof val === "string") {
    return new Date(val);
  }
  if (val instanceof Date) {
    return val;
  }
  return val;
}, z.date());

export const draftProcessor = z.preprocess((val) => {
  if (typeof val === "string") {
    return val === "true";
  }
  if (val instanceof Boolean) {
    return val;
  }
  return val;
}, z.boolean());

export const articleSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  draft: draftProcessor,
  pubDate: pubDateProcessor,
  tags: z.array(z.string()).optional(),
  image: z.string().optional(),
});

export const externalPostSchema = z.object({
  type: postTypeSchema.exclude(["ARTICLE"]),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  url: z.string().url("Invalid URL"),
  pubDate: pubDateProcessor.optional(),
  tags: z.array(z.string()).optional(),
  draft: draftProcessor,
});

export const likedPostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  url: z.string().url("Invalid URL"),
  pubDate: pubDateProcessor.optional(),
});
