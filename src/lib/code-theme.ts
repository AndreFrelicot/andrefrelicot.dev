import type { ThemeRegistrationRaw } from "shiki";

/**
 * Dark code theme — its own palette, hand-tuned in the spirit of vivid editor
 * themes (navy ground, coral keywords, amber types, green strings). The values
 * are deliberately shifted and not lifted from any shipped theme. Pairs with
 * the built-in `github-light` for light mode.
 */
export const codeThemeDark: ThemeRegistrationRaw = {
  name: "ink-noir",
  type: "dark",
  colors: {
    "editor.background": "#1b1e2b",
    "editor.foreground": "#c6cbe3",
  },
  settings: [
    {
      scope: ["comment", "punctuation.definition.comment"],
      settings: { foreground: "#6b7396", fontStyle: "italic" },
    },
    {
      scope: [
        "string",
        "string.quoted",
        "string.template",
        "constant.other.symbol",
      ],
      settings: { foreground: "#b3d98c" },
    },
    {
      scope: ["punctuation.definition.string"],
      settings: { foreground: "#9cc06f" },
    },
    {
      scope: [
        "constant.numeric",
        "constant.language",
        "constant.language.boolean",
        "constant.language.null",
        "constant.language.undefined",
        "support.constant",
      ],
      settings: { foreground: "#f3aa6c" },
    },
    {
      scope: [
        "keyword",
        "keyword.control",
        "storage.type",
        "storage.modifier",
        "keyword.operator.new",
        "keyword.operator.expression",
      ],
      settings: { foreground: "#f0768a" },
    },
    {
      scope: [
        "keyword.operator",
        "punctuation",
        "punctuation.separator",
        "punctuation.terminator",
        "punctuation.accessor",
        "meta.brace",
      ],
      settings: { foreground: "#8b94bb" },
    },
    {
      scope: [
        "entity.name.function",
        "support.function",
        "meta.function-call",
        "variable.function",
      ],
      settings: { foreground: "#76a8f2" },
    },
    {
      scope: [
        "entity.name.type",
        "entity.name.class",
        "support.class",
        "support.type",
        "entity.other.inherited-class",
        "entity.name.namespace",
        "entity.name.tag",
        "support.class.component",
      ],
      settings: { foreground: "#efc173" },
    },
    {
      scope: ["entity.other.attribute-name", "meta.attribute"],
      settings: { foreground: "#cb9cf2" },
    },
    {
      scope: [
        "variable",
        "variable.other",
        "variable.parameter",
        "meta.object-literal.key",
        "support.variable",
      ],
      settings: { foreground: "#c6cbe3" },
    },
    {
      scope: ["variable.other.constant", "constant.other"],
      settings: { foreground: "#f3aa6c" },
    },
  ],
};
