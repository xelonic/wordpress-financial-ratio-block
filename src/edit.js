import { __ } from "@wordpress/i18n";
import { useBlockProps } from "@wordpress/block-editor";
import { useRef, useLayoutEffect } from "@wordpress/element";
import { CheckboxControl, SelectControl, TextControl } from "@wordpress/components";
import { createBlock, renderBlockTemplate, renderError } from "./common";
import MutationObserver from "mutation-observer";

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import "./editor.scss";
import { ratioDefinitions } from "./ratios";

function onDOMElementsChanged(mutationList) {
  for (const mutation of mutationList) {
    switch (mutation.type.toLowerCase().trim()) {
      case "childlist": {
        for (const node of mutation.addedNodes) {
          tryCreateBlock(node);
        }
        break;
      }
      case "attributes": {
        tryCreateBlock(mutation.target);
        break;
      }
    }
  }
}

async function tryCreateBlock(node) {
  if (!node.classList) {
    return;
  }

  if (!node.classList.contains("wp-block-xelonic-financial-ratio-block")) {
    return;
  }

  if (node.classList.contains("is-selected")) {
    return;
  }

  const { root, err } = await createBlock(node);
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

export default function Edit({ attributes, isSelected, setAttributes }) {
  const ref = useRef(null);

  const blockProps = useBlockProps({ ref });

  // the following idea is taken from https://wordpress.stackexchange.com/questions/391371/how-to-load-an-additional-script-for-a-block-in-the-block-editor/391399#391399?newreg=4fbf23f481494d328272395fc4c75bca
  //
  // initialize the mutation observer once the block is rendered.
  useLayoutEffect(() => {
    let observer = null;

    if (ref.current) {
      observer = new MutationObserver(onDOMElementsChanged);

      observer.observe(ref.current, {
        childList: true,
        subtree: true,
        attributes: true,
      });

      tryCreateBlock(ref.current);
    }

    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, []);

  const showEditor = isSelected || !attributes.ticker || !attributes.ratioID;

  if (!showEditor) {
    return renderBlockTemplate(blockProps, attributes);
  }

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
      <TextControl
        label={__("Stock Symbol", "xelonic-financial-ratio-block")}
        value={attributes.ticker}
        onChange={(val) => setAttributes({ ticker: val })}
      />
      <SelectControl
        label={__("Ratio", "xelonic-financial-ratio-block")}
        options={ratioOptions}
        value={attributes.ratioID}
        onChange={(val) => setAttributes({ ratioID: val })}
      />
      <SelectControl
        label={__("Company in Title", "xelonic-financial-ratio-block")}
        options={[
          {
            label: __("Stock Symbol", "xelonic-financial-ratio-block"),
            value: "ticker",
          },
          {
            label: __("Company Name", "xelonic-financial-ratio-block"),
            value: "company_name",
          },
          {
            label: __("None", "xelonic-financial-ratio-block"),
            value: "none",
          },
        ]}
        value={attributes.companyInTitle}
        onChange={(val) => setAttributes({ companyInTitle: val })}
      />
      <CheckboxControl
        label={__("Show Company Logo", "xelonic-financial-ratio-block")}
        help={__("show company logo if company is displayed in title ", "xelonic-financial-ratio-block")}
        checked={attributes.companyLogoVisible}
        onChange={(val) => setAttributes({ companyLogoVisible: val })}
      />
      <CheckboxControl
        label={__("Show Subtitle", "xelonic-financial-ratio-block")}
        help={__("toggle visibility of brief ratio description", "xelonic-financial-ratio-block")}
        checked={attributes.subtitleVisible}
        onChange={(val) => setAttributes({ subtitleVisible: val })}
      />
    </div>
  );
}
