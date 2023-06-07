import { __ } from "@wordpress/i18n";
import { createBlock, createResultRoot, renderError } from "./common";

window.addEventListener("DOMContentLoaded", async () => {
  const elements = document.querySelectorAll(".wp-block-xelonic-financial-ratio-block");

  elements.forEach(tryCreateBlock);
});

async function tryCreateBlock(element) {
  const root = createResultRoot(element);
  if (!root) {
    console.error("failed to create result root");
    return;
  }

  const err = await createBlock(element, root);
  if (err) {
    root.render(renderError(__("Failed to fetch ratio data", "xelonic-financial-ratio-block")));
  }
}
