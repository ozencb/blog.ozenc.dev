import { getCollection, getEntryBySlug } from "astro:content";
import type { PostType, TagType } from "./types";
import { __DEV__ } from "./constants";
import externalPosts from "./content/external";

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

export const getAllArticles = async () =>
  (
    await getCollection("article", ({ data }) => data.draft !== true || __DEV__)
  ).map((item) => ({
    ...item,
    ...item.data,
    type: "ARTICLE" as PostType,
    timeToRead: calculateReadingTime(item.body),
  }));

export const getSortedAndFilteredPosts = async (tag?: string | null) => {
  const articles = await getAllArticles();
  const external = await getExternalPosts();

  const sorted = [...articles, ...external].sort(
    (a, b) => new Date(b.pubDate).valueOf() - new Date(a?.pubDate).valueOf()
  );

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
