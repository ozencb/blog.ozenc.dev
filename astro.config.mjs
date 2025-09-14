import { defineConfig, sharpImageService } from "astro/config";
import sitemap from "@astrojs/sitemap";
import rehypeMermaid from "rehype-mermaid";

// https://astro.build/config
export default defineConfig({
  site: "https://blog.ozenc.io",
  integrations: [sitemap()],
  output: "static",
  image: {
    service: sharpImageService(),
  },
  markdown: {
    syntaxHighlight: {
      excludeLangs: ["mermaid", "math"],
    },
    // rehypePlugins: [rehypeMermaid],
  },
});
