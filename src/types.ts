export type POST_TYPE = 'ARTICLE' | 'RESOURCE' | 'PROJECT';

export type Post = {
  type: POST_TYPE;
  title: string;
  description: string;
  slug?: string;
  image?: string;
  pubDate?: string;
  timeToRead?: string;
  archived?: boolean;
  tags?: string[];
  url?: string;
};

export type FrontmatterPost = {
  frontmatter: Post;
};
