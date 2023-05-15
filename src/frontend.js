import { createBlock } from "./common";

window.addEventListener("DOMContentLoaded", async () => {
  const elements = document.querySelectorAll(".wp-block-xelonic-financial-ratio-block");

  elements.forEach(tryCreateBlock);
});

async function tryCreateBlock(element) {
  const { root, err } = await createBlock(element);
  if (err) {
    root.render(renderError(err));
  }
}

function renderError(err) {
  return (
    <div>
      <span className="dashicons dashicons-warning">{`${err}`}</span>
    </div>
  );
}
