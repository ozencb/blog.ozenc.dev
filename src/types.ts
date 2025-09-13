export type PostType = "ARTICLE" | "RESOURCE" | "PROJECT";

export type ExternalPost = {
  type: Exclude<PostType, "ARTICLE">;
  title: string;
  description?: string;
  url: string;
  pubDate: Date;
  tags?: string[];
  draft: boolean;
};

export type TagType = {
  tag: string;
  count: number;
};
