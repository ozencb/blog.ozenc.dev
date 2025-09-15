import { getCollection } from "astro:content";
import type { TagType } from "./types";
import { __DEV__ } from "./constants";
import externalPosts from "./content/external";
import { externalPostSchema, likedPostSchema } from "./schemas";

export const calculateReadingTime = (text: string) => {
  if (!text) return;

  const WORDS_PER_MINUTE = 200;

  const clean = text.replace(/<\/?[^>]+(>|$)/g, "");
  const numberOfWords = clean.split(/\s/g).length;
  const time = Math.ceil(numberOfWords / WORDS_PER_MINUTE);
  return `${time} min read`;
};

export const getExternalPosts = async () => {
  return externalPosts.filter((post) => post.draft !== true || __DEV__);
};

export const getAllArticles = async () => {
  const articleCollection = await getCollection(
    "article",
    ({ data }) => data.draft !== true || __DEV__
  );

  return articleCollection.map((item) => ({
    ...item,
    ...item.data,
    type: "ARTICLE",
    timeToRead: calculateReadingTime(item.body),
  }));
};

export const getSortedAndFilteredPosts = async (tag?: string | null) => {
  const articles = await getAllArticles();
  const externalPosts = await getExternalPosts();

  const validatedExternalPosts = externalPosts.filter(
    (post) => externalPostSchema.safeParse(post).success
  );

  const sorted = [...articles, ...validatedExternalPosts].sort((a, b) => {
    if (!a.pubDate || !b.pubDate) return 0;
    return new Date(b.pubDate).valueOf() - new Date(a.pubDate).valueOf();
  });

  return tag
    ? sorted.filter((post) => !tag || post?.tags?.includes(tag))
    : sorted;
};

export const getTags = async (): Promise<TagType[]> => {
  const articlesTags = (await getAllArticles()).map((x) => x.tags).flat();
  const externalTags = (await getExternalPosts()).map((x) => x.tags).flat();

  const allTags = [...articlesTags, ...externalTags].filter(Boolean);
  const counts = {};

  allTags.forEach(function (x: string) {
    counts[x] = (counts[x] || 0) + 1;
  });

  return Object.entries(counts)?.map((entry) => {
    const [key, value] = entry;
    return {
      tag: key,
      count: value,
    } as TagType;
  });
};
