import { __ } from "@wordpress/i18n";
import { createBlock, renderError } from "./common";

window.addEventListener("DOMContentLoaded", async () => {
  const elements = document.querySelectorAll(".wp-block-xelonic-financial-ratio-block");

  elements.forEach(tryCreateBlock);
});

async function tryCreateBlock(element) {
  const { root, err } = await createBlock(element);
  if (err) {
    root.render(renderError(__("Failed to fetch ratio data", "xelonic-financial-ratio-block")));
  }
}
