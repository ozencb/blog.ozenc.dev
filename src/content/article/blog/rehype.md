---
slug: rehype-svg
title: SVG Theming in Astro Markdown
pubDate: 2025-09-17
draft: true
---

*TL;DR*: [rehype.ts](https://github.com/ozencb/blog.ozenc.dev/blob/main/src/rehype.ts)

Astro does allow you to add [plugins for markdown](https://docs.astro.build/en/guides/markdown-content/#markdown-plugins) files through [remark](https://remark.js.org/) and [rehype](https://github.com/rehypejs/rehype), allowing you to do all sorts of manipulations on your markdown content. 

There is a [whole ecosystem](https://github.com/remarkjs/awesome-remark) built around them, but I simply needed these capabilities to apply some styling over `<svg>`s because I wanted to do some Excalidraw drawings for my blog posts, copy them to my markdown as `svg`  do the styling, and that's it. `svg`s also have the advantage of being much smaller then images for most cases, and they look crispier since they are vectoral.


```typescript
// astro.config.mjs

import rehypeSvgThemeTransformer from "./src/rehype.ts";

export default defineConfig({
  markdown: {
    rehypePlugins: [rehypeSvgThemeTransformer], // <- custom plugin
  },
});

```

The plugin itself basically gives you the HTML AST, so you can traverse through it and handle these objects as necessary. 

For example, this markdown

```markdown
# A heading

some content..

<div>html stuff</div>
```

becomes

```json
{
  "type": "root",
  "children": [
    {
      "type": "element",
      "tagName": "h1",
      "properties": {},
      "children": [
        {
          "type": "text",
          "value": "A heading",
          "position": {
            "start": { "line": 1, "column": 3, "offset": 2 },
            "end": { "line": 1, "column": 12, "offset": 11 }
          }
        }
      ],
      "position": {
        "start": { "line": 1, "column": 1, "offset": 0 },
        "end": { "line": 1, "column": 12, "offset": 11 }
      }
    },
    { "type": "text", "value": "\n" },
    {
      "type": "element",
      "tagName": "p",
      "properties": {},
      "children": [
        {
          "type": "text",
          "value": "some content..",
          "position": {
            "start": { "line": 3, "column": 1, "offset": 13 },
            "end": { "line": 3, "column": 15, "offset": 27 }
          }
        }
      ],
      "position": {
        "start": { "line": 3, "column": 1, "offset": 13 },
        "end": { "line": 3, "column": 15, "offset": 27 }
      }
    },
    { "type": "text", "value": "\n" },
    {
      "type": "raw",
      "value": "<div>html stuff</div>",
      "position": {
        "start": { "line": 5, "column": 1, "offset": 29 },
        "end": { "line": 5, "column": 22, "offset": 50 }
      }
    }
  ],
  "position": {
    "start": { "line": 1, "column": 1, "offset": 0 },
    "end": { "line": 5, "column": 22, "offset": 50 }
  }
}
```

It is a handful, but all we need to understand with this is AST is, we can traverse through the tree recursively to visit each node, and check if the node is what we are looking for. In our case, the node should satisfy both `type === 'raw'` and `value.includes('<svg')` conditions. Once we find our target, we can simply modify the `value` property, which is the HTML element itself as a string.

I 

***Rehype***

<?xml version="1.0" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 306.7709313298576 330.58621763694094" width="613.5418626597152" height="661.1724352738819"><!-- svg-source:excalidraw --><metadata></metadata><defs><style class="style-fonts">
      </style></defs><g stroke-linecap="round"><g transform="translate(11.15000993385911 319.45055311030706) rotate(0 142.25 0)"><path d="M-1.15 -0.13 C46.14 0.07, 237.01 1.15, 284.57 1.14 M0.45 -1.24 C47.51 -1.35, 236.52 -0.76, 283.66 -0.39" stroke="#1e1e1e" stroke-width="2" fill="none"></path></g></g><mask></mask><g stroke-linecap="round"><g transform="translate(294.1500099338591 318.95055311030706) rotate(0 0 -154.25)"><path d="M1.01 1.2 C1.21 -49.93, 0.67 -255.7, 0.48 -307.4 M0.08 0.78 C0.23 -50.6, -0.05 -257.48, -0.22 -308.95" stroke="#1e1e1e" stroke-width="2" fill="none"></path></g></g><mask></mask><g stroke-linecap="round"><g transform="translate(296.6500099338591 55.450553110307055) rotate(0 -14.75 0)"><path d="M0.12 0.4 C-4.87 0.48, -25.07 0.24, -29.99 0.24 M-0.48 0.12 C-5.3 0.06, -24.14 -0.51, -29.01 -0.6" stroke="#1e1e1e" stroke-width="2" fill="none"></path></g></g><mask></mask><g stroke-linecap="round" transform="translate(160.1500099338591 30.450553110307055) rotate(0 52.25 26.25)"><path d="M13.13 0 C32.58 0.68, 56.45 0.45, 91.38 0 M13.13 0 C39.17 0.73, 66.02 1.19, 91.38 0 M91.38 0 C101.35 0.47, 105.92 5.98, 104.5 13.13 M91.38 0 C98.55 2.23, 106.67 2.67, 104.5 13.13 M104.5 13.13 C105 19.69, 106.54 29.82, 104.5 39.38 M104.5 13.13 C104.72 17.76, 103.68 22.81, 104.5 39.38 M104.5 39.38 C103 48.37, 98.54 54.36, 91.38 52.5 M104.5 39.38 C106.58 49.06, 99.06 53.79, 91.38 52.5 M91.38 52.5 C67.14 53.58, 39.86 54.53, 13.13 52.5 M91.38 52.5 C75.01 52.89, 55.92 51.86, 13.13 52.5 M13.13 52.5 C5.34 50.88, 0.57 46.58, 0 39.38 M13.13 52.5 C6.38 52.31, 0.42 47.39, 0 39.38 M0 39.38 C0.21 30.3, 1.5 20.54, 0 13.13 M0 39.38 C0.7 33.9, 0.68 26.76, 0 13.13 M0 13.13 C0.11 6.34, 2.46 1.58, 13.13 0 M0 13.13 C0.82 5.43, 6.08 -0.58, 13.13 0" stroke="#1e1e1e" stroke-width="2" fill="none"></path></g><g stroke-linecap="round" transform="translate(199.1500099338591 82.45055311030706) rotate(0 15.25 27.75)"><path d="M7.63 0 C9.33 0.75, 13.75 0.17, 22.88 0 M7.63 0 C12.88 -0.39, 19.52 0.62, 22.88 0 M22.88 0 C26.01 -0.6, 31.9 1.05, 30.5 7.63 M22.88 0 C28.86 -0.9, 32.72 2.29, 30.5 7.63 M30.5 7.63 C32.71 19.86, 29.74 31.7, 30.5 47.88 M30.5 7.63 C30.52 20.39, 31.41 34.19, 30.5 47.88 M30.5 47.88 C29.57 53.35, 28.01 56.53, 22.88 55.5 M30.5 47.88 C29.08 51.62, 26.86 53.48, 22.88 55.5 M22.88 55.5 C19.27 55.09, 14.42 56.6, 7.63 55.5 M22.88 55.5 C18.03 55.11, 12.23 56, 7.63 55.5 M7.63 55.5 C2.1 56.12, -1.11 51.88, 0 47.88 M7.63 55.5 C4.29 54.92, 1.73 51.65, 0 47.88 M0 47.88 C0.74 36.69, -0.48 24.38, 0 7.63 M0 47.88 C1.23 37.69, 0.59 25.37, 0 7.63 M0 7.63 C0.92 3.44, 3.31 1.32, 7.63 0 M0 7.63 C-1.46 1.77, 1.64 1.6, 7.63 0" stroke="#1e1e1e" stroke-width="2" fill="none"></path></g><g stroke-linecap="round" transform="translate(160.1500099338591 287.95055311030706) rotate(0 54.25 15.25)"><path d="M7.63 0 C43.54 -0.6, 75.94 0.59, 100.88 0 M7.63 0 C27.86 -1.2, 50.01 -0.65, 100.88 0 M100.88 0 C106.1 0.19, 108.78 1.86, 108.5 7.63 M100.88 0 C104.28 2.28, 109.07 1.5, 108.5 7.63 M108.5 7.63 C107.18 12.88, 107.95 17.89, 108.5 22.88 M108.5 7.63 C108.41 11.15, 108.03 15.83, 108.5 22.88 M108.5 22.88 C110 28.43, 105.74 31.83, 100.88 30.5 M108.5 22.88 C110.42 26.99, 106.91 29.89, 100.88 30.5 M100.88 30.5 C68.49 28.51, 34.45 29.32, 7.63 30.5 M100.88 30.5 C64.3 30.74, 26.14 29.97, 7.63 30.5 M7.63 30.5 C3.42 31.72, 1.91 29.08, 0 22.88 M7.63 30.5 C0.5 31.38, 1.65 28.47, 0 22.88 M0 22.88 C-1.15 19.95, -1.22 15.59, 0 7.63 M0 22.88 C0.9 18.33, -0.52 14.34, 0 7.63 M0 7.63 C-1.24 3.26, 0.89 -1.11, 7.63 0 M0 7.63 C-0.31 0.66, 0.61 -1.99, 7.63 0" stroke="#1e1e1e" stroke-width="2" fill="none"></path></g><g stroke-linecap="round"><g transform="translate(193.6500099338591 56.450553110307055) rotate(0 21.25 0)"><path d="M-0.4 0.35 C6.59 0.4, 34.94 0.33, 42.07 0.18 M0.39 0.06 C7.54 -0.06, 36.15 -0.65, 43.09 -0.69" stroke="#1e1e1e" stroke-width="2" fill="none"></path></g></g><mask></mask><g stroke-linecap="round"><g transform="translate(198.1171185327587 140.8348463630159) rotate(0 -18.19214662635443 70.27450188728852)"><path d="M-0.8 0.61 C-6.56 24.07, -29.63 116.4, -35.6 139.77" stroke="#1e1e1e" stroke-width="2.5" fill="none" stroke-dasharray="1.5 8"></path></g></g><mask></mask><g stroke-linecap="round"><g transform="translate(229.80666426898892 140.2480029234561) rotate(0 18.4855683461343 71.74161048618802)"><path d="M1.04 -0.34 C7.05 23.43, 31.21 118.81, 37.01 142.61" stroke="#1e1e1e" stroke-width="2.5" fill="none" stroke-dasharray="1.5 8"></path></g></g><mask></mask></svg>


***Skip Rehype coloring (Keeps resizing)***: add `skip-rehype-color`

<?xml version="1.0" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 306.7709313298576 330.58621763694094" width="613.5418626597152" height="661.1724352738819"><!-- svg-source:excalidraw --><metadata></metadata><defs><style class="style-fonts">
      </style></defs><g stroke-linecap="round"><g transform="translate(11.15000993385911 319.45055311030706) rotate(0 142.25 0)"><path d="M-1.15 -0.13 C46.14 0.07, 237.01 1.15, 284.57 1.14 M0.45 -1.24 C47.51 -1.35, 236.52 -0.76, 283.66 -0.39" stroke="#1e1e1e" stroke-width="2" fill="none"></path></g></g><mask></mask><g stroke-linecap="round"><g transform="translate(294.1500099338591 318.95055311030706) rotate(0 0 -154.25)"><path d="M1.01 1.2 C1.21 -49.93, 0.67 -255.7, 0.48 -307.4 M0.08 0.78 C0.23 -50.6, -0.05 -257.48, -0.22 -308.95" stroke="#1e1e1e" stroke-width="2" fill="none"></path></g></g><mask></mask><g stroke-linecap="round"><g transform="translate(296.6500099338591 55.450553110307055) rotate(0 -14.75 0)"><path d="M0.12 0.4 C-4.87 0.48, -25.07 0.24, -29.99 0.24 M-0.48 0.12 C-5.3 0.06, -24.14 -0.51, -29.01 -0.6" stroke="#1e1e1e" stroke-width="2" fill="none"></path></g></g><mask></mask><g stroke-linecap="round" transform="translate(160.1500099338591 30.450553110307055) rotate(0 52.25 26.25)"><path d="M13.13 0 C32.58 0.68, 56.45 0.45, 91.38 0 M13.13 0 C39.17 0.73, 66.02 1.19, 91.38 0 M91.38 0 C101.35 0.47, 105.92 5.98, 104.5 13.13 M91.38 0 C98.55 2.23, 106.67 2.67, 104.5 13.13 M104.5 13.13 C105 19.69, 106.54 29.82, 104.5 39.38 M104.5 13.13 C104.72 17.76, 103.68 22.81, 104.5 39.38 M104.5 39.38 C103 48.37, 98.54 54.36, 91.38 52.5 M104.5 39.38 C106.58 49.06, 99.06 53.79, 91.38 52.5 M91.38 52.5 C67.14 53.58, 39.86 54.53, 13.13 52.5 M91.38 52.5 C75.01 52.89, 55.92 51.86, 13.13 52.5 M13.13 52.5 C5.34 50.88, 0.57 46.58, 0 39.38 M13.13 52.5 C6.38 52.31, 0.42 47.39, 0 39.38 M0 39.38 C0.21 30.3, 1.5 20.54, 0 13.13 M0 39.38 C0.7 33.9, 0.68 26.76, 0 13.13 M0 13.13 C0.11 6.34, 2.46 1.58, 13.13 0 M0 13.13 C0.82 5.43, 6.08 -0.58, 13.13 0" stroke="#1e1e1e" stroke-width="2" fill="none"></path></g><g stroke-linecap="round" transform="translate(199.1500099338591 82.45055311030706) rotate(0 15.25 27.75)"><path d="M7.63 0 C9.33 0.75, 13.75 0.17, 22.88 0 M7.63 0 C12.88 -0.39, 19.52 0.62, 22.88 0 M22.88 0 C26.01 -0.6, 31.9 1.05, 30.5 7.63 M22.88 0 C28.86 -0.9, 32.72 2.29, 30.5 7.63 M30.5 7.63 C32.71 19.86, 29.74 31.7, 30.5 47.88 M30.5 7.63 C30.52 20.39, 31.41 34.19, 30.5 47.88 M30.5 47.88 C29.57 53.35, 28.01 56.53, 22.88 55.5 M30.5 47.88 C29.08 51.62, 26.86 53.48, 22.88 55.5 M22.88 55.5 C19.27 55.09, 14.42 56.6, 7.63 55.5 M22.88 55.5 C18.03 55.11, 12.23 56, 7.63 55.5 M7.63 55.5 C2.1 56.12, -1.11 51.88, 0 47.88 M7.63 55.5 C4.29 54.92, 1.73 51.65, 0 47.88 M0 47.88 C0.74 36.69, -0.48 24.38, 0 7.63 M0 47.88 C1.23 37.69, 0.59 25.37, 0 7.63 M0 7.63 C0.92 3.44, 3.31 1.32, 7.63 0 M0 7.63 C-1.46 1.77, 1.64 1.6, 7.63 0" stroke="#1e1e1e" stroke-width="2" fill="none"></path></g><g stroke-linecap="round" transform="translate(160.1500099338591 287.95055311030706) rotate(0 54.25 15.25)"><path d="M7.63 0 C43.54 -0.6, 75.94 0.59, 100.88 0 M7.63 0 C27.86 -1.2, 50.01 -0.65, 100.88 0 M100.88 0 C106.1 0.19, 108.78 1.86, 108.5 7.63 M100.88 0 C104.28 2.28, 109.07 1.5, 108.5 7.63 M108.5 7.63 C107.18 12.88, 107.95 17.89, 108.5 22.88 M108.5 7.63 C108.41 11.15, 108.03 15.83, 108.5 22.88 M108.5 22.88 C110 28.43, 105.74 31.83, 100.88 30.5 M108.5 22.88 C110.42 26.99, 106.91 29.89, 100.88 30.5 M100.88 30.5 C68.49 28.51, 34.45 29.32, 7.63 30.5 M100.88 30.5 C64.3 30.74, 26.14 29.97, 7.63 30.5 M7.63 30.5 C3.42 31.72, 1.91 29.08, 0 22.88 M7.63 30.5 C0.5 31.38, 1.65 28.47, 0 22.88 M0 22.88 C-1.15 19.95, -1.22 15.59, 0 7.63 M0 22.88 C0.9 18.33, -0.52 14.34, 0 7.63 M0 7.63 C-1.24 3.26, 0.89 -1.11, 7.63 0 M0 7.63 C-0.31 0.66, 0.61 -1.99, 7.63 0" stroke="#1e1e1e" stroke-width="2" fill="none"></path></g><g stroke-linecap="round"><g transform="translate(193.6500099338591 56.450553110307055) rotate(0 21.25 0)"><path d="M-0.4 0.35 C6.59 0.4, 34.94 0.33, 42.07 0.18 M0.39 0.06 C7.54 -0.06, 36.15 -0.65, 43.09 -0.69" stroke="#1e1e1e" stroke-width="2" fill="none"></path></g></g><mask></mask><g stroke-linecap="round"><g transform="translate(198.1171185327587 140.8348463630159) rotate(0 -18.19214662635443 70.27450188728852)"><path d="M-0.8 0.61 C-6.56 24.07, -29.63 116.4, -35.6 139.77" stroke="#1e1e1e" stroke-width="2.5" fill="none" stroke-dasharray="1.5 8"></path></g></g><mask></mask><g stroke-linecap="round"><g transform="translate(229.80666426898892 140.2480029234561) rotate(0 18.4855683461343 71.74161048618802)"><path d="M1.04 -0.34 C7.05 23.43, 31.21 118.81, 37.01 142.61" stroke="#1e1e1e" stroke-width="2.5" fill="none" stroke-dasharray="1.5 8"></path></g></g><mask></mask></svg>


***Skip Rehype altogether***: add `skip-rehype-all`

<?xml version="1.0" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 306.7709313298576 330.58621763694094" width="613.5418626597152" height="661.1724352738819"><!-- svg-source:excalidraw --><metadata></metadata><defs><style class="style-fonts">
      </style></defs><g stroke-linecap="round"><g transform="translate(11.15000993385911 319.45055311030706) rotate(0 142.25 0)"><path d="M-1.15 -0.13 C46.14 0.07, 237.01 1.15, 284.57 1.14 M0.45 -1.24 C47.51 -1.35, 236.52 -0.76, 283.66 -0.39" stroke="#1e1e1e" stroke-width="2" fill="none"></path></g></g><mask></mask><g stroke-linecap="round"><g transform="translate(294.1500099338591 318.95055311030706) rotate(0 0 -154.25)"><path d="M1.01 1.2 C1.21 -49.93, 0.67 -255.7, 0.48 -307.4 M0.08 0.78 C0.23 -50.6, -0.05 -257.48, -0.22 -308.95" stroke="#1e1e1e" stroke-width="2" fill="none"></path></g></g><mask></mask><g stroke-linecap="round"><g transform="translate(296.6500099338591 55.450553110307055) rotate(0 -14.75 0)"><path d="M0.12 0.4 C-4.87 0.48, -25.07 0.24, -29.99 0.24 M-0.48 0.12 C-5.3 0.06, -24.14 -0.51, -29.01 -0.6" stroke="#1e1e1e" stroke-width="2" fill="none"></path></g></g><mask></mask><g stroke-linecap="round" transform="translate(160.1500099338591 30.450553110307055) rotate(0 52.25 26.25)"><path d="M13.13 0 C32.58 0.68, 56.45 0.45, 91.38 0 M13.13 0 C39.17 0.73, 66.02 1.19, 91.38 0 M91.38 0 C101.35 0.47, 105.92 5.98, 104.5 13.13 M91.38 0 C98.55 2.23, 106.67 2.67, 104.5 13.13 M104.5 13.13 C105 19.69, 106.54 29.82, 104.5 39.38 M104.5 13.13 C104.72 17.76, 103.68 22.81, 104.5 39.38 M104.5 39.38 C103 48.37, 98.54 54.36, 91.38 52.5 M104.5 39.38 C106.58 49.06, 99.06 53.79, 91.38 52.5 M91.38 52.5 C67.14 53.58, 39.86 54.53, 13.13 52.5 M91.38 52.5 C75.01 52.89, 55.92 51.86, 13.13 52.5 M13.13 52.5 C5.34 50.88, 0.57 46.58, 0 39.38 M13.13 52.5 C6.38 52.31, 0.42 47.39, 0 39.38 M0 39.38 C0.21 30.3, 1.5 20.54, 0 13.13 M0 39.38 C0.7 33.9, 0.68 26.76, 0 13.13 M0 13.13 C0.11 6.34, 2.46 1.58, 13.13 0 M0 13.13 C0.82 5.43, 6.08 -0.58, 13.13 0" stroke="#1e1e1e" stroke-width="2" fill="none"></path></g><g stroke-linecap="round" transform="translate(199.1500099338591 82.45055311030706) rotate(0 15.25 27.75)"><path d="M7.63 0 C9.33 0.75, 13.75 0.17, 22.88 0 M7.63 0 C12.88 -0.39, 19.52 0.62, 22.88 0 M22.88 0 C26.01 -0.6, 31.9 1.05, 30.5 7.63 M22.88 0 C28.86 -0.9, 32.72 2.29, 30.5 7.63 M30.5 7.63 C32.71 19.86, 29.74 31.7, 30.5 47.88 M30.5 7.63 C30.52 20.39, 31.41 34.19, 30.5 47.88 M30.5 47.88 C29.57 53.35, 28.01 56.53, 22.88 55.5 M30.5 47.88 C29.08 51.62, 26.86 53.48, 22.88 55.5 M22.88 55.5 C19.27 55.09, 14.42 56.6, 7.63 55.5 M22.88 55.5 C18.03 55.11, 12.23 56, 7.63 55.5 M7.63 55.5 C2.1 56.12, -1.11 51.88, 0 47.88 M7.63 55.5 C4.29 54.92, 1.73 51.65, 0 47.88 M0 47.88 C0.74 36.69, -0.48 24.38, 0 7.63 M0 47.88 C1.23 37.69, 0.59 25.37, 0 7.63 M0 7.63 C0.92 3.44, 3.31 1.32, 7.63 0 M0 7.63 C-1.46 1.77, 1.64 1.6, 7.63 0" stroke="#1e1e1e" stroke-width="2" fill="none"></path></g><g stroke-linecap="round" transform="translate(160.1500099338591 287.95055311030706) rotate(0 54.25 15.25)"><path d="M7.63 0 C43.54 -0.6, 75.94 0.59, 100.88 0 M7.63 0 C27.86 -1.2, 50.01 -0.65, 100.88 0 M100.88 0 C106.1 0.19, 108.78 1.86, 108.5 7.63 M100.88 0 C104.28 2.28, 109.07 1.5, 108.5 7.63 M108.5 7.63 C107.18 12.88, 107.95 17.89, 108.5 22.88 M108.5 7.63 C108.41 11.15, 108.03 15.83, 108.5 22.88 M108.5 22.88 C110 28.43, 105.74 31.83, 100.88 30.5 M108.5 22.88 C110.42 26.99, 106.91 29.89, 100.88 30.5 M100.88 30.5 C68.49 28.51, 34.45 29.32, 7.63 30.5 M100.88 30.5 C64.3 30.74, 26.14 29.97, 7.63 30.5 M7.63 30.5 C3.42 31.72, 1.91 29.08, 0 22.88 M7.63 30.5 C0.5 31.38, 1.65 28.47, 0 22.88 M0 22.88 C-1.15 19.95, -1.22 15.59, 0 7.63 M0 22.88 C0.9 18.33, -0.52 14.34, 0 7.63 M0 7.63 C-1.24 3.26, 0.89 -1.11, 7.63 0 M0 7.63 C-0.31 0.66, 0.61 -1.99, 7.63 0" stroke="#1e1e1e" stroke-width="2" fill="none"></path></g><g stroke-linecap="round"><g transform="translate(193.6500099338591 56.450553110307055) rotate(0 21.25 0)"><path d="M-0.4 0.35 C6.59 0.4, 34.94 0.33, 42.07 0.18 M0.39 0.06 C7.54 -0.06, 36.15 -0.65, 43.09 -0.69" stroke="#1e1e1e" stroke-width="2" fill="none"></path></g></g><mask></mask><g stroke-linecap="round"><g transform="translate(198.1171185327587 140.8348463630159) rotate(0 -18.19214662635443 70.27450188728852)"><path d="M-0.8 0.61 C-6.56 24.07, -29.63 116.4, -35.6 139.77" stroke="#1e1e1e" stroke-width="2.5" fill="none" stroke-dasharray="1.5 8"></path></g></g><mask></mask><g stroke-linecap="round"><g transform="translate(229.80666426898892 140.2480029234561) rotate(0 18.4855683461343 71.74161048618802)"><path d="M1.04 -0.34 C7.05 23.43, 31.21 118.81, 37.01 142.61" stroke="#1e1e1e" stroke-width="2.5" fill="none" stroke-dasharray="1.5 8"></path></g></g><mask></mask></svg>

