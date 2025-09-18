---
slug: rehype-svg
title: SVG Theming in Astro Markdown
pubDate: 2025-09-17
draft: false
tags: ['astro', 'markdown', 'blog']
---

*TL;DR*: [rehype.ts](https://github.com/ozencb/blog.ozenc.dev/blob/main/src/rehype.ts)

Astro does allow you to add [plugins for markdown](https://docs.astro.build/en/guides/markdown-content/#markdown-plugins) files through [remark](https://remark.js.org/) and [rehype](https://github.com/rehypejs/rehype), allowing you to do all sorts of manipulations on your markdown content.

There is a [whole ecosystem](https://github.com/remarkjs/awesome-remark) built around them, but I only needed these capabilities to apply some styling to `<svg>`s because I wanted to do some Excalidraw drawings for my blog posts, copy them to my markdown as `svg`  do the styling, and that's it. `svg`s also have the advantage of being much smaller then images for most cases, and they look crispier since they are vector-based.

```typescript
// astro.config.mjs
import rehypeSvgThemeTransformer from "./src/rehype.ts";

export default defineConfig({
  markdown: {
    rehypePlugins: [rehypeSvgThemeTransformer], // <- custom plugin
  },
});

```

The plugin itself basically gives you the HTML AST, so you can traverse it and handle these objects as necessary.

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

It is a handful, but all we need to understand with this AST is, we can traverse the tree recursively to visit each node, and check if the node is what we are looking for. In our case, the node should satisfy both `type === 'raw'` and `value.includes('<svg')` conditions. Once we find our target, we can simply modify the `value` property, which is the HTML element itself as a string.

```typescript
// rehype.ts
export default function rehypeSvgThemeTransformer() {
  // remark expects the transformer to return a function
  // and gives back the AST
  // we traverse the tree, runs a predicate function which checks all criteria,
  // and run the transformer if criteria meet
  return (tree: Root) => visit(tree, predicate, transformer);
}

function predicate(node: any): boolean {
  return (
    node.type === "raw" &&
    typeof node.value === "string" &&
    node.value.trim().startsWith("<svg") && // only target <svg elements
    !node.value.includes("skip-rehype-all") // do not transform if svg has this property
  );
}

function transformer(node: Html): void {
  const shouldSkipColoring = node.value.includes("skip-rehype-color");
  node.value = node.value
    .replace(/\s(width|height)="[^"]*"/g, "") // remove width and height props for responsivity
    .replace(/<svg([^>]*)>/, `<svg$1 role="img" aria-hidden="true"`) // accessibility
    .replace(
      /<svg([^>]*)>/,
      `<svg$1 class="theme-markdown-svg ${
        !shouldSkipColoring ? "" : "colored"
      }">`; // add a css class for further styling

  if (!shouldSkipColoring) { // a handy flag in case i want to skip removing color
    node.value = node.value
      .replace(/\sfill="[^"]*"/g, "")
      .replace(/\sstroke="[^"]*"/g, "");
  }
}

function visit<T extends Node>(
  node: Node,
  type: string,
  callback: (node: T) => void
): void {
  if (Array.isArray((node as any).children)) {
    for (const child of (node as any).children) {
      if (predicate(child)) { // criteria meets
        callback(child as T); // call the transformer
      }
      visit(child, type, callback); // visit next node recursively
    }
  }
}
```

And, that's it. Transformer function can be extended to add extra functionality. Mine removes `width` and `height`, add a CSS class, and selectively (if the svg does not have a `skip-rehype-color` property) remove `fill` and `stroke` so I can provide my own colors to the shapes. I added the `skip-*` flags in case I want to keep orignal colors and dimensions.

This is what I do with the CSS classes:

```css
.theme-markdown-svg {
  max-height: 50vh;
  width: auto;
  height: auto;
  display: block;
}

.theme-markdown-svg-colored {
  stroke: currentColor;
  fill: currentColor;
}
```

Try changing the blog theme and see how these three examples change:

***Rehype (Default Behaviour)***

<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 104.24600894790547 70.21319310581336" width="208.49201789581093" height="140.42638621162672">
<!-- svg-source:excalidraw --><metadata></metadata><defs><style class="style-fonts">
      @font-face { font-family: Excalifont; src: url(data:font/woff2;base64,d09GMgABAAAAAAQQAA4AAAAABxwAAAO7AAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGhYbgQYcNAZgAEQRCAqEYINuCwoAATYCJAMQBCAFgxgHIBurBVFUT+JkHwnlxmUHkiSNgDLCVnzP4PHKn5fk5IXaZo/I7slOlb1auRpYlB8kT7y3/26LLbA8CYISDtTazf/l+NuB3OYpeltlLbATWKslFmiW9QIZWwNdtjigQAMLCDJvSdovXa9R9pjRTHqlRzcHATgCAIBCEDSCAOyFS8LsWQUVUF0TBB6qW+jsh+ptHRgBFQaAv9F4OoURsIWGY1BcwhaFfSOg54/CQERQ+xw6a9I4AOZwQkMjAEcAbGZSQZayYhsxNQDyeRpygvMXqImfk3FkF+EqOk0YY/8TYTXGkrEssAUA8qUGAMsWQAFogASNACQY4QBbtihApx4T+n+d8f/Grq+IbCVbUGkGANim/D0AP4JqXORFXgRI0nOrt1vSLdXyPdJbJu02Y8ZOezHPdy22mbJP5fvtyd6jxEW9tzHKWGWu3uWwatWuwUGHPVfUG/J8xbN7/RWtou9hs8rsu/PhXqPkYMxKezF0NZmxfsYa+RbLdrNqh9nLa/UaYKtWOaw6RmqqmG5iLdV7HAYDLpm0Js30lTjglSg7TMiR6g2WYVeN9mLg+arVE3dY1FscBqX7FCv9t1auu+SzZs+BDUfkGyzqNRvWrJGXBftSKlauxUqjZKMxfOXK8Ycr1nr7Vd307upLKi1Q/NR+dXRpsi9TWkvLpDr+vXvOe9oKZnnMuPMmXfDxlHw0t0RWWsykBWR41X01zsrwa6r9EKr8E93i0VLJA657G36U2voagwS5S/oXFwL69bk9To5mB/l8T9CMU5gunMp3p+spmfM/AR5WMWnLWo4S9LGVahrzc7JNa1bdqDKdTKbNkQyr2aKpCSTR7pmj8Z6BXeWjdWyKXXwwcfnzl1mxWmW7SV3Pp7ba58in+7v9Pl1FtnXQD3SLc3D204nrPrBU/xNb3M1kJCwqn6zQeBZOTBqt/46K8xmlOJp0iIuOs0vyUtkDAEAABJ5I7m9tdkn41daB/gKADycEZgDAR9u/nvT/7DWJ+WrGArBFAQACrxhu7gb0/zMGgXtgRhsyo4Q60YiMOzgEwLDAGgBQAIIAUgAAANioQyPTDgDv+aQIicsUxdlRihZoLsXw1kZZSeJ9DmvegEzjtWvF69VlpBEGhCjTqdsYvFaCKp0EBr1WnBUhVHhfEC8bb4JRehioQGdxjPnTmcyJFhDOww6GzZ+hXLYi8a5BGm1a6fyto0wg6NWtxwCWv3YBWJxwHD1WmwlY7yc7CFqNE4qVisdj/Y5BWJ0MOq2xFOsQigbq/8XKAAAAAAA=); }</style></defs><g transform="translate(20.636554676203104 28.048144473961088) rotate(0 0.00004999999998744897 0.00005000000000165983)" stroke="none"><path fill="#f08c00" d="M 3.14,-3.14 Q 3.14,-3.14 3.55,-2.55 3.97,-1.97 4.18,-1.28 4.40,-0.59 4.38,0.11 4.36,0.83 4.11,1.51 3.86,2.18 3.41,2.74 2.96,3.30 2.36,3.69 1.75,4.08 1.05,4.25 0.36,4.42 -0.35,4.36 -1.07,4.31 -1.73,4.02 -2.39,3.74 -2.92,3.26 -3.46,2.78 -3.81,2.15 -4.16,1.53 -4.30,0.82 -4.43,0.11 -4.34,-0.59 -4.24,-1.30 -3.92,-1.94 -3.60,-2.59 -3.09,-3.09 -2.59,-3.60 -1.94,-3.92 -1.30,-4.24 -0.59,-4.34 0.12,-4.43 0.82,-4.30 1.53,-4.16 2.15,-3.81 2.78,-3.46 3.26,-2.92 3.74,-2.39 4.02,-1.73 4.31,-1.07 4.36,-0.35 4.42,0.36 4.25,1.05 4.07,1.75 3.69,2.36 3.30,2.96 2.74,3.41 2.18,3.86 1.51,4.11 0.83,4.36 0.11,4.38 -0.60,4.40 -1.28,4.18 -1.97,3.97 -2.55,3.55 -3.14,3.13 -3.14,3.14 -3.14,3.14 -3.47,2.71 -3.80,2.29 -4.02,1.80 -4.24,1.32 -4.33,0.79 -4.43,0.26 -4.40,-0.26 -4.36,-0.80 -4.20,-1.31 -4.04,-1.82 -3.77,-2.28 -3.49,-2.73 -3.11,-3.11 -2.73,-3.49 -2.28,-3.77 -1.82,-4.05 -1.31,-4.20 -0.80,-4.36 -0.26,-4.40 0.26,-4.43 0.79,-4.33 1.32,-4.24 1.80,-4.02 2.29,-3.80 2.71,-3.47 3.14,-3.14 3.14,-3.14 L 3.14,-3.14 Z"></path></g><g transform="translate(49.38399974702247 28.59100352791208) rotate(0 0.1437372253541298 0)" stroke="none"><path fill="#f08c00" d="M 4.24,-1.32 Q 4.24,-1.32 4.30,-0.26 4.36,0.80 3.93,1.76 3.49,2.73 2.65,3.39 1.82,4.05 0.77,4.24 -0.26,4.43 -1.28,4.11 -2.29,3.80 -3.04,3.04 -3.80,2.29 -4.11,1.28 -4.43,0.26 -4.24,-0.77 -4.04,-1.82 -3.39,-2.65 -2.73,-3.49 -1.76,-3.93 -0.79,-4.36 0.26,-4.30 1.32,-4.23 2.23,-3.68 3.14,-3.13 3.69,-2.23 L 4.24,-1.32 Z"></path></g><g transform="translate(10 49.289163978901996) rotate(0 27.453810042632426 5.462014563455682)" stroke="none"><path fill="#e03131" d="M 0.61,-4.92 Q 0.61,-4.92 3.91,-4.42 7.21,-3.93 10.78,-2.97 14.36,-2.00 17.46,-1.02 20.56,-0.04 23.28,0.93 26.01,1.90 28.04,2.56 30.07,3.21 32.38,3.73 34.70,4.26 37.53,4.34 40.36,4.42 43.01,4.59 45.66,4.75 47.35,3.03 49.03,1.31 48.62,1.66 48.20,2.00 48.37,0.93 48.55,-0.13 49.06,-1.09 49.57,-2.05 50.36,-2.79 51.14,-3.54 52.13,-3.99 53.11,-4.45 54.19,-4.56 55.27,-4.68 56.33,-4.44 57.39,-4.21 58.32,-3.65 59.25,-3.09 59.95,-2.26 60.65,-1.44 61.05,-0.43 61.45,0.57 61.51,1.65 61.57,2.74 61.28,3.78 60.99,4.83 60.38,5.73 59.77,6.62 58.90,7.28 58.04,7.94 57.01,8.28 55.98,8.63 54.90,8.63 53.81,8.62 52.78,8.28 51.76,7.93 50.89,7.27 50.03,6.61 49.42,5.72 48.81,4.82 48.52,3.77 48.24,2.73 48.29,1.64 48.35,0.56 48.76,-0.44 49.16,-1.45 49.86,-2.27 50.57,-3.10 51.50,-3.66 52.43,-4.22 53.49,-4.45 54.55,-4.68 55.62,-4.56 56.70,-4.44 57.69,-3.99 58.67,-3.53 59.46,-2.78 60.25,-2.04 60.75,-1.08 61.26,-0.12 61.43,0.94 61.61,2.01 61.61,2.01 61.61,2.01 60.50,5.92 59.38,9.83 58.20,11.73 57.02,13.64 54.35,15.05 51.68,16.47 49.25,16.76 46.83,17.06 44.70,16.85 42.57,16.64 39.73,16.07 36.89,15.51 34.37,14.97 31.84,14.43 29.25,13.41 26.66,12.40 24.67,11.56 22.68,10.72 20.23,9.75 17.78,8.78 14.93,7.89 12.08,7.00 9.04,6.29 6.01,5.59 2.69,5.25 -0.61,4.92 -1.19,4.77 -1.77,4.63 -2.30,4.35 -2.83,4.07 -3.27,3.67 -3.72,3.27 -4.06,2.78 -4.40,2.28 -4.61,1.72 -4.82,1.16 -4.89,0.57 -4.96,-0.01 -4.88,-0.61 -4.81,-1.20 -4.59,-1.76 -4.38,-2.32 -4.04,-2.81 -3.70,-3.30 -3.25,-3.69 -2.80,-4.09 -2.27,-4.36 -1.74,-4.64 -1.16,-4.78 -0.58,-4.92 0.01,-4.92 0.61,-4.92 0.61,-4.92 L 0.61,-4.92 Z"></path></g><g transform="translate(61.579341009673044 10) rotate(0 16.33333396911621 12.5)"><text x="0" y="17.619999999999997" font-family="Excalifont, Xiaolai, sans-serif, Segoe UI Emoji" font-size="20px" fill="#1971c2" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="alphabetic">hey</text></g><g transform="translate(20.50340255937158 27.997660838874197) rotate(0 0.00004999999998744897 0.00005000000000165983)" stroke="none"><path fill="#1e1e1e" d="M 1.57,-1.57 Q 1.57,-1.57 1.77,-1.27 1.98,-0.98 2.09,-0.64 2.20,-0.29 2.19,0.05 2.18,0.41 2.05,0.75 1.93,1.09 1.70,1.37 1.48,1.65 1.18,1.84 0.87,2.04 0.52,2.12 0.18,2.21 -0.17,2.18 -0.53,2.15 -0.86,2.01 -1.19,1.87 -1.46,1.63 -1.73,1.39 -1.90,1.07 -2.08,0.76 -2.15,0.41 -2.21,0.05 -2.17,-0.29 -2.12,-0.65 -1.96,-0.97 -1.80,-1.29 -1.54,-1.54 -1.29,-1.80 -0.97,-1.96 -0.65,-2.12 -0.29,-2.17 0.06,-2.21 0.41,-2.15 0.76,-2.08 1.07,-1.90 1.39,-1.73 1.63,-1.46 1.87,-1.19 2.01,-0.86 2.15,-0.53 2.18,-0.17 2.21,0.18 2.12,0.52 2.03,0.87 1.84,1.18 1.65,1.48 1.37,1.70 1.09,1.93 0.75,2.05 0.41,2.18 0.05,2.19 -0.30,2.20 -0.64,2.09 -0.98,1.98 -1.27,1.77 -1.57,1.56 -1.57,1.57 -1.57,1.57 -1.73,1.35 -1.90,1.14 -2.01,0.90 -2.12,0.66 -2.16,0.39 -2.21,0.13 -2.20,-0.13 -2.18,-0.40 -2.10,-0.65 -2.02,-0.91 -1.88,-1.14 -1.74,-1.36 -1.55,-1.55 -1.36,-1.74 -1.14,-1.88 -0.91,-2.02 -0.65,-2.10 -0.40,-2.18 -0.13,-2.20 0.13,-2.21 0.39,-2.16 0.66,-2.12 0.90,-2.01 1.14,-1.90 1.35,-1.73 1.57,-1.57 1.57,-1.57 L 1.57,-1.57 Z"></path></g><g transform="translate(49.4366163619643 28.382581643343286) rotate(0 0.00004999999998744897 0.00005000000000165983)" stroke="none"><path fill="#1e1e1e" d="M 1.57,-1.57 Q 1.57,-1.57 1.77,-1.27 1.98,-0.98 2.09,-0.64 2.20,-0.29 2.19,0.05 2.18,0.41 2.05,0.75 1.93,1.09 1.70,1.37 1.48,1.65 1.18,1.84 0.87,2.04 0.52,2.12 0.18,2.21 -0.17,2.18 -0.53,2.15 -0.86,2.01 -1.19,1.87 -1.46,1.63 -1.73,1.39 -1.90,1.07 -2.08,0.76 -2.15,0.41 -2.21,0.05 -2.17,-0.29 -2.12,-0.65 -1.96,-0.97 -1.80,-1.29 -1.54,-1.54 -1.29,-1.80 -0.97,-1.96 -0.65,-2.12 -0.29,-2.17 0.06,-2.21 0.41,-2.15 0.76,-2.08 1.07,-1.90 1.39,-1.73 1.63,-1.46 1.87,-1.19 2.01,-0.86 2.15,-0.53 2.18,-0.17 2.21,0.18 2.12,0.52 2.03,0.87 1.84,1.18 1.65,1.48 1.37,1.70 1.09,1.93 0.75,2.05 0.41,2.18 0.05,2.19 -0.30,2.20 -0.64,2.09 -0.98,1.98 -1.27,1.77 -1.57,1.56 -1.57,1.57 -1.57,1.57 -1.73,1.35 -1.90,1.14 -2.01,0.90 -2.12,0.66 -2.16,0.39 -2.21,0.13 -2.20,-0.13 -2.18,-0.40 -2.10,-0.65 -2.02,-0.91 -1.88,-1.14 -1.74,-1.36 -1.55,-1.55 -1.36,-1.74 -1.14,-1.88 -0.91,-2.02 -0.65,-2.10 -0.40,-2.18 -0.13,-2.20 0.13,-2.21 0.39,-2.16 0.66,-2.12 0.90,-2.01 1.14,-1.90 1.35,-1.73 1.57,-1.57 1.57,-1.57 L 1.57,-1.57 Z"></path></g></svg>

***Skip Rehype coloring (Keeps resizing)***: manually add `skip-rehype-color` like so:

```
<svg skip-rehype-color version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 185.88012871831165 134.434470714165" width="371.7602574366233" height="268.86894142833" >
```

<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 104.24600894790547 70.21319310581336" width="208.49201789581093" height="140.42638621162672" skip-rehype-color>
<!-- svg-source:excalidraw --><metadata></metadata><defs><style class="style-fonts">
      @font-face { font-family: Excalifont; src: url(data:font/woff2;base64,d09GMgABAAAAAAQQAA4AAAAABxwAAAO7AAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGhYbgQYcNAZgAEQRCAqEYINuCwoAATYCJAMQBCAFgxgHIBurBVFUT+JkHwnlxmUHkiSNgDLCVnzP4PHKn5fk5IXaZo/I7slOlb1auRpYlB8kT7y3/26LLbA8CYISDtTazf/l+NuB3OYpeltlLbATWKslFmiW9QIZWwNdtjigQAMLCDJvSdovXa9R9pjRTHqlRzcHATgCAIBCEDSCAOyFS8LsWQUVUF0TBB6qW+jsh+ptHRgBFQaAv9F4OoURsIWGY1BcwhaFfSOg54/CQERQ+xw6a9I4AOZwQkMjAEcAbGZSQZayYhsxNQDyeRpygvMXqImfk3FkF+EqOk0YY/8TYTXGkrEssAUA8qUGAMsWQAFogASNACQY4QBbtihApx4T+n+d8f/Grq+IbCVbUGkGANim/D0AP4JqXORFXgRI0nOrt1vSLdXyPdJbJu02Y8ZOezHPdy22mbJP5fvtyd6jxEW9tzHKWGWu3uWwatWuwUGHPVfUG/J8xbN7/RWtou9hs8rsu/PhXqPkYMxKezF0NZmxfsYa+RbLdrNqh9nLa/UaYKtWOaw6RmqqmG5iLdV7HAYDLpm0Js30lTjglSg7TMiR6g2WYVeN9mLg+arVE3dY1FscBqX7FCv9t1auu+SzZs+BDUfkGyzqNRvWrJGXBftSKlauxUqjZKMxfOXK8Ycr1nr7Vd307upLKi1Q/NR+dXRpsi9TWkvLpDr+vXvOe9oKZnnMuPMmXfDxlHw0t0RWWsykBWR41X01zsrwa6r9EKr8E93i0VLJA657G36U2voagwS5S/oXFwL69bk9To5mB/l8T9CMU5gunMp3p+spmfM/AR5WMWnLWo4S9LGVahrzc7JNa1bdqDKdTKbNkQyr2aKpCSTR7pmj8Z6BXeWjdWyKXXwwcfnzl1mxWmW7SV3Pp7ba58in+7v9Pl1FtnXQD3SLc3D204nrPrBU/xNb3M1kJCwqn6zQeBZOTBqt/46K8xmlOJp0iIuOs0vyUtkDAEAABJ5I7m9tdkn41daB/gKADycEZgDAR9u/nvT/7DWJ+WrGArBFAQACrxhu7gb0/zMGgXtgRhsyo4Q60YiMOzgEwLDAGgBQAIIAUgAAANioQyPTDgDv+aQIicsUxdlRihZoLsXw1kZZSeJ9DmvegEzjtWvF69VlpBEGhCjTqdsYvFaCKp0EBr1WnBUhVHhfEC8bb4JRehioQGdxjPnTmcyJFhDOww6GzZ+hXLYi8a5BGm1a6fyto0wg6NWtxwCWv3YBWJxwHD1WmwlY7yc7CFqNE4qVisdj/Y5BWJ0MOq2xFOsQigbq/8XKAAAAAAA=); }</style></defs><g transform="translate(20.636554676203104 28.048144473961088) rotate(0 0.00004999999998744897 0.00005000000000165983)" stroke="none"><path fill="#f08c00" d="M 3.14,-3.14 Q 3.14,-3.14 3.55,-2.55 3.97,-1.97 4.18,-1.28 4.40,-0.59 4.38,0.11 4.36,0.83 4.11,1.51 3.86,2.18 3.41,2.74 2.96,3.30 2.36,3.69 1.75,4.08 1.05,4.25 0.36,4.42 -0.35,4.36 -1.07,4.31 -1.73,4.02 -2.39,3.74 -2.92,3.26 -3.46,2.78 -3.81,2.15 -4.16,1.53 -4.30,0.82 -4.43,0.11 -4.34,-0.59 -4.24,-1.30 -3.92,-1.94 -3.60,-2.59 -3.09,-3.09 -2.59,-3.60 -1.94,-3.92 -1.30,-4.24 -0.59,-4.34 0.12,-4.43 0.82,-4.30 1.53,-4.16 2.15,-3.81 2.78,-3.46 3.26,-2.92 3.74,-2.39 4.02,-1.73 4.31,-1.07 4.36,-0.35 4.42,0.36 4.25,1.05 4.07,1.75 3.69,2.36 3.30,2.96 2.74,3.41 2.18,3.86 1.51,4.11 0.83,4.36 0.11,4.38 -0.60,4.40 -1.28,4.18 -1.97,3.97 -2.55,3.55 -3.14,3.13 -3.14,3.14 -3.14,3.14 -3.47,2.71 -3.80,2.29 -4.02,1.80 -4.24,1.32 -4.33,0.79 -4.43,0.26 -4.40,-0.26 -4.36,-0.80 -4.20,-1.31 -4.04,-1.82 -3.77,-2.28 -3.49,-2.73 -3.11,-3.11 -2.73,-3.49 -2.28,-3.77 -1.82,-4.05 -1.31,-4.20 -0.80,-4.36 -0.26,-4.40 0.26,-4.43 0.79,-4.33 1.32,-4.24 1.80,-4.02 2.29,-3.80 2.71,-3.47 3.14,-3.14 3.14,-3.14 L 3.14,-3.14 Z"></path></g><g transform="translate(49.38399974702247 28.59100352791208) rotate(0 0.1437372253541298 0)" stroke="none"><path fill="#f08c00" d="M 4.24,-1.32 Q 4.24,-1.32 4.30,-0.26 4.36,0.80 3.93,1.76 3.49,2.73 2.65,3.39 1.82,4.05 0.77,4.24 -0.26,4.43 -1.28,4.11 -2.29,3.80 -3.04,3.04 -3.80,2.29 -4.11,1.28 -4.43,0.26 -4.24,-0.77 -4.04,-1.82 -3.39,-2.65 -2.73,-3.49 -1.76,-3.93 -0.79,-4.36 0.26,-4.30 1.32,-4.23 2.23,-3.68 3.14,-3.13 3.69,-2.23 L 4.24,-1.32 Z"></path></g><g transform="translate(10 49.289163978901996) rotate(0 27.453810042632426 5.462014563455682)" stroke="none"><path fill="#e03131" d="M 0.61,-4.92 Q 0.61,-4.92 3.91,-4.42 7.21,-3.93 10.78,-2.97 14.36,-2.00 17.46,-1.02 20.56,-0.04 23.28,0.93 26.01,1.90 28.04,2.56 30.07,3.21 32.38,3.73 34.70,4.26 37.53,4.34 40.36,4.42 43.01,4.59 45.66,4.75 47.35,3.03 49.03,1.31 48.62,1.66 48.20,2.00 48.37,0.93 48.55,-0.13 49.06,-1.09 49.57,-2.05 50.36,-2.79 51.14,-3.54 52.13,-3.99 53.11,-4.45 54.19,-4.56 55.27,-4.68 56.33,-4.44 57.39,-4.21 58.32,-3.65 59.25,-3.09 59.95,-2.26 60.65,-1.44 61.05,-0.43 61.45,0.57 61.51,1.65 61.57,2.74 61.28,3.78 60.99,4.83 60.38,5.73 59.77,6.62 58.90,7.28 58.04,7.94 57.01,8.28 55.98,8.63 54.90,8.63 53.81,8.62 52.78,8.28 51.76,7.93 50.89,7.27 50.03,6.61 49.42,5.72 48.81,4.82 48.52,3.77 48.24,2.73 48.29,1.64 48.35,0.56 48.76,-0.44 49.16,-1.45 49.86,-2.27 50.57,-3.10 51.50,-3.66 52.43,-4.22 53.49,-4.45 54.55,-4.68 55.62,-4.56 56.70,-4.44 57.69,-3.99 58.67,-3.53 59.46,-2.78 60.25,-2.04 60.75,-1.08 61.26,-0.12 61.43,0.94 61.61,2.01 61.61,2.01 61.61,2.01 60.50,5.92 59.38,9.83 58.20,11.73 57.02,13.64 54.35,15.05 51.68,16.47 49.25,16.76 46.83,17.06 44.70,16.85 42.57,16.64 39.73,16.07 36.89,15.51 34.37,14.97 31.84,14.43 29.25,13.41 26.66,12.40 24.67,11.56 22.68,10.72 20.23,9.75 17.78,8.78 14.93,7.89 12.08,7.00 9.04,6.29 6.01,5.59 2.69,5.25 -0.61,4.92 -1.19,4.77 -1.77,4.63 -2.30,4.35 -2.83,4.07 -3.27,3.67 -3.72,3.27 -4.06,2.78 -4.40,2.28 -4.61,1.72 -4.82,1.16 -4.89,0.57 -4.96,-0.01 -4.88,-0.61 -4.81,-1.20 -4.59,-1.76 -4.38,-2.32 -4.04,-2.81 -3.70,-3.30 -3.25,-3.69 -2.80,-4.09 -2.27,-4.36 -1.74,-4.64 -1.16,-4.78 -0.58,-4.92 0.01,-4.92 0.61,-4.92 0.61,-4.92 L 0.61,-4.92 Z"></path></g><g transform="translate(61.579341009673044 10) rotate(0 16.33333396911621 12.5)"><text x="0" y="17.619999999999997" font-family="Excalifont, Xiaolai, sans-serif, Segoe UI Emoji" font-size="20px" fill="#1971c2" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="alphabetic">hey</text></g><g transform="translate(20.50340255937158 27.997660838874197) rotate(0 0.00004999999998744897 0.00005000000000165983)" stroke="none"><path fill="#1e1e1e" d="M 1.57,-1.57 Q 1.57,-1.57 1.77,-1.27 1.98,-0.98 2.09,-0.64 2.20,-0.29 2.19,0.05 2.18,0.41 2.05,0.75 1.93,1.09 1.70,1.37 1.48,1.65 1.18,1.84 0.87,2.04 0.52,2.12 0.18,2.21 -0.17,2.18 -0.53,2.15 -0.86,2.01 -1.19,1.87 -1.46,1.63 -1.73,1.39 -1.90,1.07 -2.08,0.76 -2.15,0.41 -2.21,0.05 -2.17,-0.29 -2.12,-0.65 -1.96,-0.97 -1.80,-1.29 -1.54,-1.54 -1.29,-1.80 -0.97,-1.96 -0.65,-2.12 -0.29,-2.17 0.06,-2.21 0.41,-2.15 0.76,-2.08 1.07,-1.90 1.39,-1.73 1.63,-1.46 1.87,-1.19 2.01,-0.86 2.15,-0.53 2.18,-0.17 2.21,0.18 2.12,0.52 2.03,0.87 1.84,1.18 1.65,1.48 1.37,1.70 1.09,1.93 0.75,2.05 0.41,2.18 0.05,2.19 -0.30,2.20 -0.64,2.09 -0.98,1.98 -1.27,1.77 -1.57,1.56 -1.57,1.57 -1.57,1.57 -1.73,1.35 -1.90,1.14 -2.01,0.90 -2.12,0.66 -2.16,0.39 -2.21,0.13 -2.20,-0.13 -2.18,-0.40 -2.10,-0.65 -2.02,-0.91 -1.88,-1.14 -1.74,-1.36 -1.55,-1.55 -1.36,-1.74 -1.14,-1.88 -0.91,-2.02 -0.65,-2.10 -0.40,-2.18 -0.13,-2.20 0.13,-2.21 0.39,-2.16 0.66,-2.12 0.90,-2.01 1.14,-1.90 1.35,-1.73 1.57,-1.57 1.57,-1.57 L 1.57,-1.57 Z"></path></g><g transform="translate(49.4366163619643 28.382581643343286) rotate(0 0.00004999999998744897 0.00005000000000165983)" stroke="none"><path fill="#1e1e1e" d="M 1.57,-1.57 Q 1.57,-1.57 1.77,-1.27 1.98,-0.98 2.09,-0.64 2.20,-0.29 2.19,0.05 2.18,0.41 2.05,0.75 1.93,1.09 1.70,1.37 1.48,1.65 1.18,1.84 0.87,2.04 0.52,2.12 0.18,2.21 -0.17,2.18 -0.53,2.15 -0.86,2.01 -1.19,1.87 -1.46,1.63 -1.73,1.39 -1.90,1.07 -2.08,0.76 -2.15,0.41 -2.21,0.05 -2.17,-0.29 -2.12,-0.65 -1.96,-0.97 -1.80,-1.29 -1.54,-1.54 -1.29,-1.80 -0.97,-1.96 -0.65,-2.12 -0.29,-2.17 0.06,-2.21 0.41,-2.15 0.76,-2.08 1.07,-1.90 1.39,-1.73 1.63,-1.46 1.87,-1.19 2.01,-0.86 2.15,-0.53 2.18,-0.17 2.21,0.18 2.12,0.52 2.03,0.87 1.84,1.18 1.65,1.48 1.37,1.70 1.09,1.93 0.75,2.05 0.41,2.18 0.05,2.19 -0.30,2.20 -0.64,2.09 -0.98,1.98 -1.27,1.77 -1.57,1.56 -1.57,1.57 -1.57,1.57 -1.73,1.35 -1.90,1.14 -2.01,0.90 -2.12,0.66 -2.16,0.39 -2.21,0.13 -2.20,-0.13 -2.18,-0.40 -2.10,-0.65 -2.02,-0.91 -1.88,-1.14 -1.74,-1.36 -1.55,-1.55 -1.36,-1.74 -1.14,-1.88 -0.91,-2.02 -0.65,-2.10 -0.40,-2.18 -0.13,-2.20 0.13,-2.21 0.39,-2.16 0.66,-2.12 0.90,-2.01 1.14,-1.90 1.35,-1.73 1.57,-1.57 1.57,-1.57 L 1.57,-1.57 Z"></path></g></svg>

***Skip Rehype altogether (original SVG)***: add `skip-rehype-all`

<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 104.24600894790547 70.21319310581336" width="208.49201789581093" height="140.42638621162672" skip-rehype-all>
<!-- svg-source:excalidraw --><metadata></metadata><defs><style class="style-fonts">
      @font-face { font-family: Excalifont; src: url(data:font/woff2;base64,d09GMgABAAAAAAQQAA4AAAAABxwAAAO7AAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGhYbgQYcNAZgAEQRCAqEYINuCwoAATYCJAMQBCAFgxgHIBurBVFUT+JkHwnlxmUHkiSNgDLCVnzP4PHKn5fk5IXaZo/I7slOlb1auRpYlB8kT7y3/26LLbA8CYISDtTazf/l+NuB3OYpeltlLbATWKslFmiW9QIZWwNdtjigQAMLCDJvSdovXa9R9pjRTHqlRzcHATgCAIBCEDSCAOyFS8LsWQUVUF0TBB6qW+jsh+ptHRgBFQaAv9F4OoURsIWGY1BcwhaFfSOg54/CQERQ+xw6a9I4AOZwQkMjAEcAbGZSQZayYhsxNQDyeRpygvMXqImfk3FkF+EqOk0YY/8TYTXGkrEssAUA8qUGAMsWQAFogASNACQY4QBbtihApx4T+n+d8f/Grq+IbCVbUGkGANim/D0AP4JqXORFXgRI0nOrt1vSLdXyPdJbJu02Y8ZOezHPdy22mbJP5fvtyd6jxEW9tzHKWGWu3uWwatWuwUGHPVfUG/J8xbN7/RWtou9hs8rsu/PhXqPkYMxKezF0NZmxfsYa+RbLdrNqh9nLa/UaYKtWOaw6RmqqmG5iLdV7HAYDLpm0Js30lTjglSg7TMiR6g2WYVeN9mLg+arVE3dY1FscBqX7FCv9t1auu+SzZs+BDUfkGyzqNRvWrJGXBftSKlauxUqjZKMxfOXK8Ycr1nr7Vd307upLKi1Q/NR+dXRpsi9TWkvLpDr+vXvOe9oKZnnMuPMmXfDxlHw0t0RWWsykBWR41X01zsrwa6r9EKr8E93i0VLJA657G36U2voagwS5S/oXFwL69bk9To5mB/l8T9CMU5gunMp3p+spmfM/AR5WMWnLWo4S9LGVahrzc7JNa1bdqDKdTKbNkQyr2aKpCSTR7pmj8Z6BXeWjdWyKXXwwcfnzl1mxWmW7SV3Pp7ba58in+7v9Pl1FtnXQD3SLc3D204nrPrBU/xNb3M1kJCwqn6zQeBZOTBqt/46K8xmlOJp0iIuOs0vyUtkDAEAABJ5I7m9tdkn41daB/gKADycEZgDAR9u/nvT/7DWJ+WrGArBFAQACrxhu7gb0/zMGgXtgRhsyo4Q60YiMOzgEwLDAGgBQAIIAUgAAANioQyPTDgDv+aQIicsUxdlRihZoLsXw1kZZSeJ9DmvegEzjtWvF69VlpBEGhCjTqdsYvFaCKp0EBr1WnBUhVHhfEC8bb4JRehioQGdxjPnTmcyJFhDOww6GzZ+hXLYi8a5BGm1a6fyto0wg6NWtxwCWv3YBWJxwHD1WmwlY7yc7CFqNE4qVisdj/Y5BWJ0MOq2xFOsQigbq/8XKAAAAAAA=); }</style></defs><g transform="translate(20.636554676203104 28.048144473961088) rotate(0 0.00004999999998744897 0.00005000000000165983)" stroke="none"><path fill="#f08c00" d="M 3.14,-3.14 Q 3.14,-3.14 3.55,-2.55 3.97,-1.97 4.18,-1.28 4.40,-0.59 4.38,0.11 4.36,0.83 4.11,1.51 3.86,2.18 3.41,2.74 2.96,3.30 2.36,3.69 1.75,4.08 1.05,4.25 0.36,4.42 -0.35,4.36 -1.07,4.31 -1.73,4.02 -2.39,3.74 -2.92,3.26 -3.46,2.78 -3.81,2.15 -4.16,1.53 -4.30,0.82 -4.43,0.11 -4.34,-0.59 -4.24,-1.30 -3.92,-1.94 -3.60,-2.59 -3.09,-3.09 -2.59,-3.60 -1.94,-3.92 -1.30,-4.24 -0.59,-4.34 0.12,-4.43 0.82,-4.30 1.53,-4.16 2.15,-3.81 2.78,-3.46 3.26,-2.92 3.74,-2.39 4.02,-1.73 4.31,-1.07 4.36,-0.35 4.42,0.36 4.25,1.05 4.07,1.75 3.69,2.36 3.30,2.96 2.74,3.41 2.18,3.86 1.51,4.11 0.83,4.36 0.11,4.38 -0.60,4.40 -1.28,4.18 -1.97,3.97 -2.55,3.55 -3.14,3.13 -3.14,3.14 -3.14,3.14 -3.47,2.71 -3.80,2.29 -4.02,1.80 -4.24,1.32 -4.33,0.79 -4.43,0.26 -4.40,-0.26 -4.36,-0.80 -4.20,-1.31 -4.04,-1.82 -3.77,-2.28 -3.49,-2.73 -3.11,-3.11 -2.73,-3.49 -2.28,-3.77 -1.82,-4.05 -1.31,-4.20 -0.80,-4.36 -0.26,-4.40 0.26,-4.43 0.79,-4.33 1.32,-4.24 1.80,-4.02 2.29,-3.80 2.71,-3.47 3.14,-3.14 3.14,-3.14 L 3.14,-3.14 Z"></path></g><g transform="translate(49.38399974702247 28.59100352791208) rotate(0 0.1437372253541298 0)" stroke="none"><path fill="#f08c00" d="M 4.24,-1.32 Q 4.24,-1.32 4.30,-0.26 4.36,0.80 3.93,1.76 3.49,2.73 2.65,3.39 1.82,4.05 0.77,4.24 -0.26,4.43 -1.28,4.11 -2.29,3.80 -3.04,3.04 -3.80,2.29 -4.11,1.28 -4.43,0.26 -4.24,-0.77 -4.04,-1.82 -3.39,-2.65 -2.73,-3.49 -1.76,-3.93 -0.79,-4.36 0.26,-4.30 1.32,-4.23 2.23,-3.68 3.14,-3.13 3.69,-2.23 L 4.24,-1.32 Z"></path></g><g transform="translate(10 49.289163978901996) rotate(0 27.453810042632426 5.462014563455682)" stroke="none"><path fill="#e03131" d="M 0.61,-4.92 Q 0.61,-4.92 3.91,-4.42 7.21,-3.93 10.78,-2.97 14.36,-2.00 17.46,-1.02 20.56,-0.04 23.28,0.93 26.01,1.90 28.04,2.56 30.07,3.21 32.38,3.73 34.70,4.26 37.53,4.34 40.36,4.42 43.01,4.59 45.66,4.75 47.35,3.03 49.03,1.31 48.62,1.66 48.20,2.00 48.37,0.93 48.55,-0.13 49.06,-1.09 49.57,-2.05 50.36,-2.79 51.14,-3.54 52.13,-3.99 53.11,-4.45 54.19,-4.56 55.27,-4.68 56.33,-4.44 57.39,-4.21 58.32,-3.65 59.25,-3.09 59.95,-2.26 60.65,-1.44 61.05,-0.43 61.45,0.57 61.51,1.65 61.57,2.74 61.28,3.78 60.99,4.83 60.38,5.73 59.77,6.62 58.90,7.28 58.04,7.94 57.01,8.28 55.98,8.63 54.90,8.63 53.81,8.62 52.78,8.28 51.76,7.93 50.89,7.27 50.03,6.61 49.42,5.72 48.81,4.82 48.52,3.77 48.24,2.73 48.29,1.64 48.35,0.56 48.76,-0.44 49.16,-1.45 49.86,-2.27 50.57,-3.10 51.50,-3.66 52.43,-4.22 53.49,-4.45 54.55,-4.68 55.62,-4.56 56.70,-4.44 57.69,-3.99 58.67,-3.53 59.46,-2.78 60.25,-2.04 60.75,-1.08 61.26,-0.12 61.43,0.94 61.61,2.01 61.61,2.01 61.61,2.01 60.50,5.92 59.38,9.83 58.20,11.73 57.02,13.64 54.35,15.05 51.68,16.47 49.25,16.76 46.83,17.06 44.70,16.85 42.57,16.64 39.73,16.07 36.89,15.51 34.37,14.97 31.84,14.43 29.25,13.41 26.66,12.40 24.67,11.56 22.68,10.72 20.23,9.75 17.78,8.78 14.93,7.89 12.08,7.00 9.04,6.29 6.01,5.59 2.69,5.25 -0.61,4.92 -1.19,4.77 -1.77,4.63 -2.30,4.35 -2.83,4.07 -3.27,3.67 -3.72,3.27 -4.06,2.78 -4.40,2.28 -4.61,1.72 -4.82,1.16 -4.89,0.57 -4.96,-0.01 -4.88,-0.61 -4.81,-1.20 -4.59,-1.76 -4.38,-2.32 -4.04,-2.81 -3.70,-3.30 -3.25,-3.69 -2.80,-4.09 -2.27,-4.36 -1.74,-4.64 -1.16,-4.78 -0.58,-4.92 0.01,-4.92 0.61,-4.92 0.61,-4.92 L 0.61,-4.92 Z"></path></g><g transform="translate(61.579341009673044 10) rotate(0 16.33333396911621 12.5)"><text x="0" y="17.619999999999997" font-family="Excalifont, Xiaolai, sans-serif, Segoe UI Emoji" font-size="20px" fill="#1971c2" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="alphabetic">hey</text></g><g transform="translate(20.50340255937158 27.997660838874197) rotate(0 0.00004999999998744897 0.00005000000000165983)" stroke="none"><path fill="#1e1e1e" d="M 1.57,-1.57 Q 1.57,-1.57 1.77,-1.27 1.98,-0.98 2.09,-0.64 2.20,-0.29 2.19,0.05 2.18,0.41 2.05,0.75 1.93,1.09 1.70,1.37 1.48,1.65 1.18,1.84 0.87,2.04 0.52,2.12 0.18,2.21 -0.17,2.18 -0.53,2.15 -0.86,2.01 -1.19,1.87 -1.46,1.63 -1.73,1.39 -1.90,1.07 -2.08,0.76 -2.15,0.41 -2.21,0.05 -2.17,-0.29 -2.12,-0.65 -1.96,-0.97 -1.80,-1.29 -1.54,-1.54 -1.29,-1.80 -0.97,-1.96 -0.65,-2.12 -0.29,-2.17 0.06,-2.21 0.41,-2.15 0.76,-2.08 1.07,-1.90 1.39,-1.73 1.63,-1.46 1.87,-1.19 2.01,-0.86 2.15,-0.53 2.18,-0.17 2.21,0.18 2.12,0.52 2.03,0.87 1.84,1.18 1.65,1.48 1.37,1.70 1.09,1.93 0.75,2.05 0.41,2.18 0.05,2.19 -0.30,2.20 -0.64,2.09 -0.98,1.98 -1.27,1.77 -1.57,1.56 -1.57,1.57 -1.57,1.57 -1.73,1.35 -1.90,1.14 -2.01,0.90 -2.12,0.66 -2.16,0.39 -2.21,0.13 -2.20,-0.13 -2.18,-0.40 -2.10,-0.65 -2.02,-0.91 -1.88,-1.14 -1.74,-1.36 -1.55,-1.55 -1.36,-1.74 -1.14,-1.88 -0.91,-2.02 -0.65,-2.10 -0.40,-2.18 -0.13,-2.20 0.13,-2.21 0.39,-2.16 0.66,-2.12 0.90,-2.01 1.14,-1.90 1.35,-1.73 1.57,-1.57 1.57,-1.57 L 1.57,-1.57 Z"></path></g><g transform="translate(49.4366163619643 28.382581643343286) rotate(0 0.00004999999998744897 0.00005000000000165983)" stroke="none"><path fill="#1e1e1e" d="M 1.57,-1.57 Q 1.57,-1.57 1.77,-1.27 1.98,-0.98 2.09,-0.64 2.20,-0.29 2.19,0.05 2.18,0.41 2.05,0.75 1.93,1.09 1.70,1.37 1.48,1.65 1.18,1.84 0.87,2.04 0.52,2.12 0.18,2.21 -0.17,2.18 -0.53,2.15 -0.86,2.01 -1.19,1.87 -1.46,1.63 -1.73,1.39 -1.90,1.07 -2.08,0.76 -2.15,0.41 -2.21,0.05 -2.17,-0.29 -2.12,-0.65 -1.96,-0.97 -1.80,-1.29 -1.54,-1.54 -1.29,-1.80 -0.97,-1.96 -0.65,-2.12 -0.29,-2.17 0.06,-2.21 0.41,-2.15 0.76,-2.08 1.07,-1.90 1.39,-1.73 1.63,-1.46 1.87,-1.19 2.01,-0.86 2.15,-0.53 2.18,-0.17 2.21,0.18 2.12,0.52 2.03,0.87 1.84,1.18 1.65,1.48 1.37,1.70 1.09,1.93 0.75,2.05 0.41,2.18 0.05,2.19 -0.30,2.20 -0.64,2.09 -0.98,1.98 -1.27,1.77 -1.57,1.56 -1.57,1.57 -1.57,1.57 -1.73,1.35 -1.90,1.14 -2.01,0.90 -2.12,0.66 -2.16,0.39 -2.21,0.13 -2.20,-0.13 -2.18,-0.40 -2.10,-0.65 -2.02,-0.91 -1.88,-1.14 -1.74,-1.36 -1.55,-1.55 -1.36,-1.74 -1.14,-1.88 -0.91,-2.02 -0.65,-2.10 -0.40,-2.18 -0.13,-2.20 0.13,-2.21 0.39,-2.16 0.66,-2.12 0.90,-2.01 1.14,-1.90 1.35,-1.73 1.57,-1.57 1.57,-1.57 L 1.57,-1.57 Z"></path></g></svg>