import { __ } from "@wordpress/i18n";
import { useBlockProps, InspectorControls } from "@wordpress/block-editor";
import { useRef, useLayoutEffect } from "@wordpress/element";
import { CheckboxControl, SelectControl, TextControl } from "@wordpress/components";
import { createBlock, createResultRoot, renderBlockTemplate, renderError } from "./common";
import MutationObserver from "mutation-observer";

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import "./editor.scss";
import { ratioDefinitions } from "./ratios";

async function tryCreateBlock(node, root) {
  if (!node.classList) {
    return;
  }

  if (!node.classList.contains("wp-block-xelonic-financial-ratio-block")) {
    return;
  }

  const err = await createBlock(node, root, { linksDisabled: true });
  if (err) {
    handleError(err, root);
  }
}

function handleError(err, root) {
  let data = `${err}`;

  if (err.status === 404) {
    data = "error: ticker or ratio not found";
  }

  root.render(renderError(data));
}

export default function Edit({ attributes, setAttributes }) {
  const ref = useRef(null);
  let resultRoot;

  const blockProps = useBlockProps({ ref });

  // the following idea is taken from https://wordpress.stackexchange.com/questions/391371/how-to-load-an-additional-script-for-a-block-in-the-block-editor/391399#391399?newreg=4fbf23f481494d328272395fc4c75bca
  //
  // initialize the mutation observer once the block is rendered.
  useLayoutEffect(() => {
    if (!ref.current) {
      return;
    }

    async function invokeTryCreateBlock() {
      tryCreateBlock(ref.current, resultRoot);
    }

    const observer = new MutationObserver(invokeTryCreateBlock);

    const attributes = ref.current.querySelector(".attributes");
    if (!attributes) {
      console.error("no attributes container found. Won't update widget.");
      return;
    }

    resultRoot = createResultRoot(ref.current);

    observer.observe(attributes, {
      childList: true,
      subtree: true,
      attributes: true,
      characterData: true,
    });

    invokeTryCreateBlock();

    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, []);

  return renderBlockEditorTemplate(blockProps, attributes, setAttributes);
}

function renderBlockEditorTemplate(blockProps, attributes, setAttributes) {
  const ratioOptions = ratioDefinitions.map((ratioDef) => {
    return {
      label: ratioDef.label,
      value: ratioDef.id,
    };
  });

  return (
    <div {...blockProps}>
      { renderBlockTemplate(attributes) }
      <InspectorControls>
        <TextControl
          label={__("Stock Symbol", "financial-ratio")}
          value={attributes.ticker}
          onChange={(val) => setAttributes({ ticker: val })}
        />
        <SelectControl
          label={__("Ratio", "financial-ratio")}
          options={ratioOptions}
          value={attributes.ratioID}
          onChange={(val) => setAttributes({ ratioID: val })}
        />
        <SelectControl
          label={__("Company in Title", "financial-ratio")}
          options={[
            {
              label: __("Stock Symbol", "financial-ratio"),
              value: "ticker",
            },
            {
              label: __("Company Name", "financial-ratio"),
              value: "company_name",
            },
            {
              label: __("None", "financial-ratio"),
              value: "none",
            },
          ]}
          value={attributes.companyInTitle}
          onChange={(val) => setAttributes({ companyInTitle: val })}
        />
        <CheckboxControl
          label={__("Show Company Logo", "financial-ratio")}
          help={__("show company logo if company is displayed in title ", "financial-ratio")}
          checked={attributes.companyLogoVisible}
          onChange={(val) => setAttributes({ companyLogoVisible: val })}
        />
        <CheckboxControl
          label={__("Show Subtitle", "financial-ratio")}
          help={__("toggle visibility of brief ratio description", "financial-ratio")}
          checked={attributes.subtitleVisible}
          onChange={(val) => setAttributes({ subtitleVisible: val })}
        />
      </InspectorControls>
    </div>
  );
}
