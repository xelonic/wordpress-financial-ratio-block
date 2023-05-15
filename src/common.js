import { createRoot } from "@wordpress/element";
import { createIcon } from "./icon";

/**
 * The template is the content used to exchange data from the editor and the frontend. It is the content saved by
 * the block's save() function (see index.js and save.js).
 *
 * Everytime the block is loaded in the frontend this content gets inserted and frontend.js will pick it up and
 * turn it into the final block display.
 */
export function renderBlockTemplate(blockProps, attributes) {
  return (
    <div {...blockProps}>
      {/* IMPORTANT: don't remove this container div. we need to call createRoot() below not on the root element, that
      React uses as the root element of the block. At some point it will remove the root element, but can't because
      I don't know, perhaps the createRoot() already registered a removal callback or so.
      */}
      <div>
        <div className="ticker">{attributes.ticker}</div>
        <div className="ratio-id">{attributes.ratioID}</div>
        <div className="company-in-title">{attributes.companyInTitle}</div>
        <div className="subtitle-visible">{`${attributes.subtitleVisible}`}</div>
      </div>
    </div>
  );
}

export async function createBlock(element) {
  const attributes = getAttributes(element);
  if (!attributes) {
    // it's rendered already
    return {};
  }

  let root;
  let err;

  try {
    root = createRoot(element.childNodes[0]); // IMPORTANT: we need to select the container div here, not the direct root
    const data = await fetchData(attributes);
    root.render(renderBlock(data));
  } catch (e) {
    err = e;
  }

  return { root, err };
}

function getAttribute(element, className) {
  const attributeElement = element.querySelector("." + className);
  if (!attributeElement) {
    return undefined;
  }

  return attributeElement.innerText;
}

function getBoolAttribute(element, className, defaultValue) {
  const value = getAttribute(element, className);
  if (value === undefined || value.length < 1) {
    return defaultValue;
  }

  return value === "true";
}

export function getAttributes(element) {
  const ticker = getAttribute(element, "ticker");
  if (!ticker) {
    return undefined;
  }

  const ratioID = getAttribute(element, "ratio-id");
  if (!ratioID) {
    return undefined;
  }

  const companyInTitle = getAttribute(element, "company-in-title") ?? "ticker";
  const subtitleVisible = getBoolAttribute(element, "subtitle-visible", true);

  return { ticker, ratioID, companyInTitle, subtitleVisible };
}

export async function fetchData(attributes) {
  const response = await fetch(
    `http://localhost:8081/market-data/1.0.0/external/wordpress/financial-ratio-block?ticker=${attributes.ticker}&ratio_id=${attributes.ratioID}`,
  );

  if (!response.ok) {
    let details = "";
    const body = await response.text();
    if (body) {
      details = ` Details: ${body}`;
    }

    const err = new Error(`${response.status} ${response.statusText}${details}`);
    err.status = response.status;
    throw err;
  }

  const returnedData = await response.json();

  return {
    ...attributes,
    data: returnedData,
  };
}

export function renderBlock(data) {
  const companyInTitle = getCompanyInTitle(data);

  return (
    <div className="container">
      {/* noreferrer: https://mathiasbynens.github.io/rel-noopener/#recommendations */}
      <a href="https://xelonic.com" target="_blank" rel="noreferrer">
        <div className="title">
          {companyInTitle && <div className="ticker">{companyInTitle}</div>}
          <div className="ratio">{data.data.title}</div>
        </div>
      </a>
      {data.subtitleVisible && <div className="subtitle">{data.data.subtitle}</div>}
      <div className="value">{renderRatioValue(data.data.value, data.data.unit)}</div>
      <a href="https://xelonic.com" target="_blank" rel="noreferrer" className="xelonic-link">
        {createIcon()}
      </a>
    </div>
  );
}

function getCompanyInTitle(data) {
  if (data.companyInTitle === "company_name" && data.name) {
    return data.name;
  }

  if (data.companyInTitle !== "none") {
    return data.ticker.toUpperCase();
  }

  return undefined;
}

function renderRatioValue(value, unit) {
  if (!value) {
    return <div>n/a</div>;
  }

  return <div>{formatValue(value, unit)}</div>;
}

function formatValue(value, unit) {
  const options = {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    notation: "compact",
  };

  if (value.is_percentage) {
    options.style = "percentage";
    options.notation = "standard";
  }

  const currency = getCurrency(unit);
  if (currency) {
    options.style = "currency";
    options.currency = currency;
  }

  return new Intl.NumberFormat(getLocale(), options).format(value.value);
}

function getLocale() {
  if (typeof Intl !== "undefined") {
    try {
      return Intl.NumberFormat().resolvedOptions().locale;
    } catch (err) {
      // continue below
    }
  }

  if (window.navigator.languages) {
    return window.navigator.languages[0];
  }

  if (window.navigator.userLanguage) {
    return window.navigator.userLanguage;
  }

  return window.navigator.language;
}

function getCurrency(unit) {
  if (!unit) {
    return "";
  }

  if (!unit.name) {
    return "";
  }

  const name = unit.name.toUpperCase().trim();

  if (!name.includes("ISO4217:")) {
    return "";
  }

  return name.substring(name.indexOf(":") + 1);
}
