import rss from "@astrojs/rss";
import sanitizeHtml from "sanitize-html";
import MarkdownIt from "markdown-it";
const parser = new MarkdownIt();

import { SITE_TITLE, SITE_DESCRIPTION, __DEV__ } from "../constants";
import { getAllArticles } from "../utils";

export async function GET(context) {
  const posts = await getAllArticles();

  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: import.meta.env.SITE,
    items: posts.map((post) => ({
      link: "/" + post.slug,
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      content: sanitizeHtml(parser.render(post.body), {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
      }),
    })),
  });
}
