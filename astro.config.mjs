import { defineConfig, sharpImageService } from "astro/config";
import sitemap from "@astrojs/sitemap";
import rehypeSvgThemeTransformer from "./src/rehype.ts";

// https://astro.build/config
export default defineConfig({
  site: "https://blog.ozenc.dev",
  integrations: [sitemap()],
  output: "static",
  image: {
    service: sharpImageService(),
  },
  markdown: {
    rehypePlugins: [rehypeSvgThemeTransformer],
  },
});
