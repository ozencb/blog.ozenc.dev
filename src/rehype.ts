import type { Root, Html, Node } from "mdast";

export default function rehypeSvgThemeTransformer() {
  return (tree: Root) => {
    visit(tree, "raw", (node: Html) => {
      if (
        typeof node.value === "string" &&
        node.value.trim().startsWith("<svg")
      ) {
        node.value = transformSvg(node.value);
      }
    });
  };
}

function transformSvg(svgString: string): string {
  return svgString
    .replace(/\sfill="[^"]*"/g, "")
    .replace(/\sstroke="[^"]*"/g, "")
    .replace(/\s(width|height)="[^"]*"/g, "")
    .replace(/<svg([^>]*)>/, `<svg$1 role="img" aria-hidden="true"`)
    .replace(/<svg([^>]*)>/, `<svg$1 class="theme-markdown-svg">`);
}

// Minimal custom "visit" implementation
function visit<T extends Node>(
  node: Node,
  type: string,
  callback: (node: T) => void
): void {
  if (Array.isArray((node as any).children)) {
    for (const child of (node as any).children) {
      if (child.type === type) {
        callback(child as T);
      }
      visit(child, type, callback);
    }
  }
}
