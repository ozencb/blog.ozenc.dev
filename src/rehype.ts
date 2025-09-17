import type { Root, Html, Node } from "mdast";

export default function rehypeSvgThemeTransformer() {
  return (tree: Root) => visit(tree, "raw", transformer);
}

function predicate(node: Html): boolean {
  return (
    typeof node.value === "string" &&
    node.value.trim().startsWith("<svg") &&
    !node.value.includes("skip-rehype-all")
  );
}

function transformer(node: Html): void {
  node.value = node.value
    .replace(/\s(width|height)="[^"]*"/g, "")
    .replace(/<svg([^>]*)>/, `<svg$1 role="img" aria-hidden="true"`)
    .replace(/<svg([^>]*)>/, `<svg$1 class="theme-markdown-svg">`);

  if (!node.value.includes("skip-rehype-color")) {
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
      if (child.type === type && predicate(child)) {
        callback(child as T);
      }
      visit(child, type, callback);
    }
  }
}
