export enum PostTypes {
  ARTICLE,
  RESOURCE,
  PROJECT
}
export type PostType = keyof typeof PostTypes;
export type Post = {
  type: PostType;
  title: string;
  description?: string;
  slug?: string;
  pubDate?: string;
  timeToRead?: string;
  archived?: boolean;
  tags?: string[];
  url?: string;
};

export type FrontmatterPost = {
  frontmatter: Post;
};
