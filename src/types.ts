import { z } from "astro:content";
import type {
  externalPostSchema,
  articleSchema,
  postTypeSchema,
  likedPostSchema,
} from "./schemas";

export type Article = z.infer<typeof articleSchema>;
export type ExternalPost = z.infer<typeof externalPostSchema>;
export type PostType = z.infer<typeof postTypeSchema>;
export type LikedPost = z.infer<typeof likedPostSchema>;

export type TagType = {
  tag: string;
  count: number;
};
