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
    if (isElement(child)) {
      if (isCodeFigure(child)) {
        enhanceCodeFigure(child);
      }
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

function enhanceCodeFigure(figure: HastElement) {
  if (!Array.isArray(figure.children)) return;

  const titleIndex = figure.children.findIndex(
    (child) =>
      isElement(child) &&
      Boolean(child.properties?.["data-rehype-pretty-code-title"]),
  );

  const preIndex = figure.children.findIndex(
    (child) => isElement(child) && child.tagName === "pre",
  );

  if (preIndex === -1) return;

  const pre = figure.children[preIndex] as HastElement;
  const preProps = pre.properties as Record<string, unknown> | undefined;
  const language = normalizeLanguage(
    typeof preProps?.["data-language"] === "string"
      ? (preProps["data-language"] as string)
      : undefined,
  );

  const header: HastElement = {
    type: "element",
    tagName: "div",
    properties: {
      className: ["code-block-header"],
    },
    children: buildHeaderChildren(language),
  };

  const insertionIndex = titleIndex === -1 ? preIndex : titleIndex + 1;
  figure.children.splice(insertionIndex, 0, header);
}

function buildHeaderChildren(language?: string): HastElement[] {
  const label: HastElement = {
    type: "element",
    tagName: "span",
    properties: {
      className: ["code-block-label"],
    },
  children: language ? [createText(language)] : [],
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

  return language ? [label, button] : [button];
}

function normalizeLanguage(lang?: string) {
  if (!lang) return undefined;
  if (lang.length <= 3) return lang.toUpperCase();
  return lang;
}

function createText(value: string): HastText {
  return { type: "text", value };
}
