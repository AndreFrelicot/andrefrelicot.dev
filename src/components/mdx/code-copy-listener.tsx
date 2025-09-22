"use client";

import { useEffect } from "react";

const COPY_ATTRIBUTE = "data-copy-code";

export function CodeCopyListener() {
  useEffect(() => {
    const buttons = Array.from(
      document.querySelectorAll<HTMLButtonElement>(`button[${COPY_ATTRIBUTE}]`),
    );

    if (buttons.length === 0) return;

    const handleClick = async (event: Event) => {
      const button = event.currentTarget as HTMLButtonElement | null;
      if (!button) return;

      if (!button.dataset.copyLabel) {
        button.dataset.copyLabel = button.textContent ?? "Copy code";
      }

      const figure = button.closest("figure[data-rehype-pretty-code-figure]");
      const code = figure?.querySelector("pre code");
      if (!code) return;

      const text = code.textContent ?? "";

      if (!navigator.clipboard) {
        updateCopyState(button, "error");
        return;
      }

      try {
        await navigator.clipboard.writeText(text);
        updateCopyState(button, "copied");
      } catch {
        updateCopyState(button, "error");
      }
    };

    buttons.forEach((button) =>
      button.addEventListener("click", handleClick),
    );

    return () => {
      buttons.forEach((button) =>
        button.removeEventListener("click", handleClick),
      );
    };
  }, []);

  return null;
}

function updateCopyState(button: HTMLButtonElement, state: "copied" | "error") {
  const defaultLabel = button.dataset.copyLabel ?? "Copy code";
  const nextLabel = state === "copied" ? "Copied!" : "Copy failed";
  button.textContent = nextLabel;
  button.dataset.copyState = state;
  window.setTimeout(() => {
    button.textContent = defaultLabel;
    delete button.dataset.copyState;
  }, 2000);
}
