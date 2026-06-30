type HastElement = {
  type: "element";
  tagName: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
};

type HastRoot = {
  type: "root";
  children: HastNode[];
};

type HastText = {
  type: "text";
  value: string;
};

type HastNode = HastRoot | HastElement | HastText;

function isElement(node: HastNode | undefined): node is HastElement {
  return Boolean(node && node.type === "element");
}

export function rehypeCodeHeaders() {
  return function transformer(tree: HastRoot) {
    walk(tree);
  };
}

function walk(node: HastNode) {
  if (!node || !("children" in node) || !Array.isArray(node.children)) return;

  node.children.forEach((child) => {
    if (isElement(child) && isCodeFigure(child)) {
      enhanceCodeFigure(child);
    }
    walk(child as HastNode);
  });
}

function isCodeFigure(node: HastElement) {
  return (
    node.tagName === "figure" &&
    node.properties &&
    Object.prototype.hasOwnProperty.call(
      node.properties,
      "data-rehype-pretty-code-figure",
    )
  );
}

/**
 * Builds a single title bar per code block: the `title="…"` filename when one
 * is set (verbatim), otherwise the lowercased language. The original
 * rehype-pretty-code title element is removed so there is never a double bar.
 */
function enhanceCodeFigure(figure: HastElement) {
  if (!Array.isArray(figure.children)) return;

  if (
    figure.children.findIndex(
      (child) => isElement(child) && child.tagName === "pre",
    ) === -1
  ) {
    return;
  }

  const titleIndex = figure.children.findIndex(
    (child) =>
      isElement(child) &&
      Boolean(child.properties?.["data-rehype-pretty-code-title"]),
  );

  let label: string | undefined;

  if (titleIndex !== -1) {
    label = textContent(figure.children[titleIndex]).trim() || undefined;
    figure.children.splice(titleIndex, 1);
  } else {
    const pre = figure.children.find(
      (child) => isElement(child) && child.tagName === "pre",
    ) as HastElement | undefined;
    const language = pre?.properties?.["data-language"];
    label = typeof language === "string" ? language.toLowerCase() : undefined;
  }

  const preIndex = figure.children.findIndex(
    (child) => isElement(child) && child.tagName === "pre",
  );

  const header: HastElement = {
    type: "element",
    tagName: "div",
    properties: {
      className: ["code-block-header"],
    },
    children: buildHeaderChildren(label),
  };

  figure.children.splice(preIndex, 0, header);
}

function buildHeaderChildren(label?: string): HastElement[] {
  const labelEl: HastElement = {
    type: "element",
    tagName: "span",
    properties: {
      className: ["code-block-label"],
    },
    children: label ? [createText(label)] : [],
  };

  const button: HastElement = {
    type: "element",
    tagName: "button",
    properties: {
      type: "button",
      className: ["code-copy-button"],
      "data-copy-code": "",
      "aria-label": "Copy code",
    },
    children: [createText("Copy code")],
  };

  return [labelEl, button];
}

function textContent(node: HastNode): string {
  if (node.type === "text") return node.value;
  if ("children" in node && Array.isArray(node.children)) {
    return node.children.map(textContent).join("");
  }
  return "";
}

function createText(value: string): HastText {
  return { type: "text", value };
}
