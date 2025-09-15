import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";
import type { ExternalPost, LikedPost } from "../types";
import { likedPostSchema } from "../schemas";

export const getLikedPosts = (): LikedPost[] => {
  const csvPath = path.resolve("./src/content/external/likes.csv");
  if (!fs.existsSync(csvPath)) {
    return [];
  }
  const file = fs.readFileSync(csvPath);
  const records: any[] = parse(file, {
    columns: true,
    skip_empty_lines: true,
  });

  return records
    .map((r) => {
      const parsedRecord = {
        ...r,
        pubDate: r.date && r.date !== "" ? new Date(r.date) : undefined,
      };

      const validatedRecord = likedPostSchema.safeParse(parsedRecord);
      if (!validatedRecord.success) {
        console.error(
          `Validation error for ${JSON.stringify(parsedRecord)}`,
          validatedRecord.error
        );
        return null;
      }

      return validatedRecord.data as LikedPost;
    })
    .filter(Boolean) as LikedPost[];
};

const likedPosts: ExternalPost[] = getLikedPosts().map((post) => ({
  ...post,
  type: "LIKED",
  tags: ["liked"],
  draft: false,
}));

const externalPosts: ExternalPost[] = [
  {
    type: "RESOURCE",
    title: "RESOURCE",
    url: "https://www.youtube.com/watch?v=Z0DO0XyS8Ko",
    pubDate: new Date("2023.01.01"),
    draft: true,
  },
  {
    type: "PROJECT",
    title: "Project test",
    url: "https://www.youtube.com/watch?v=Z0DO0XyS8Ko",
    pubDate: new Date("2023.01.01"),
    draft: true,
  },
  {
    type: "PROJECT",
    title: "empty url test",
    url: "",
    pubDate: new Date("2023.01.01"),
    draft: true,
  },
  ...likedPosts,
];

export default externalPosts;
