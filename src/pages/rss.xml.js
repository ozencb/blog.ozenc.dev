import rss from "@astrojs/rss";
import sanitizeHtml from "sanitize-html";
import MarkdownIt from "markdown-it";
const parser = new MarkdownIt();

import { SITE_TITLE, SITE_DESCRIPTION } from "../constants";
import { getAllArticles } from "../utils";

export async function GET(context) {
  const posts = await getAllArticles();
  const site = import.meta.env.SITE;

  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site,
    items: posts
      .map((post) => {
        if (!post.body || post.data?.draft) return null;

        let html = parser.render(post.body);

        // Convert relative image URLs (and any other relative URLs) to absolute
        html = html.replaceAll(
          /(<img[^>]+src=["'])([^"']+)/g,
          (_, prefix, src) => `${prefix}${site}${src}`
        );
        html = html.replaceAll(
          /(<a[^>]+href=["'])(\/[^"']+)/g,
          (_, prefix, href) => `${prefix}${site}${href}`
        );

        return {
          link: "/" + post.slug,
          title: post.data.title,
          pubDate: post.data.pubDate,
          description: post.data.description,
          content: sanitizeHtml(html, {
            allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
            allowedAttributes: {
              ...sanitizeHtml.defaults.allowedAttributes,
              img: ["src", "alt", "title", "width", "height"],
            },
          }),
        };
      })
      .filter(Boolean),
  });
}
