import { createRoot } from "@wordpress/element";
import { Dashicon } from "@wordpress/components";
import { findRatioDefinition } from "./ratios";

/**
 * The template is the content used to exchange data from the editor and the frontend. It is the content saved by
 * the block's save() function (see index.js and save.js).
 *
 * Everytime the block is loaded in the frontend this content gets inserted and frontend.js will pick it up and
 * turn it into the final block display.
 */
export function renderBlockTemplate(attributes) {
  return (
      <div>
        <div className="attributes xe-display-none">
          <div className="ticker">{attributes.ticker}</div>
          <div className="ratio-id">{attributes.ratioID}</div>
          <div className="company-in-title">{attributes.companyInTitle}</div>
          <div className="company-logo-visible">{`${attributes.companyLogoVisible}`}</div>
          <div className="subtitle-visible">{`${attributes.subtitleVisible}`}</div>
        </div>
        <div className="result"></div>
      </div>
  );
}

export function createResultRoot(element) {
  const rootEl = element.querySelector(".result");
  if (!rootEl) {
    throw new Error("failed to create result root");
  }

  return createRoot(rootEl);
}

/**
 * options:
 * - linksDisabled: if true, the rendered links are not clickable
 */
export async function createBlock(element, root, options) {
  try {
    const attributes = getAttributes(element);
    if (!attributes) {
      return;
    }

    const data = await fetchData(attributes);
    root.render(renderBlock(data, options));
  } catch (e) {
    return e;
  }

  return undefined;
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
  const companyLogoVisible = getBoolAttribute(element, "company-logo-visible", true);

  return { ticker, ratioID, companyInTitle, subtitleVisible, companyLogoVisible };
}

export async function fetchData(attributes) {
  // const base = "http://localhost:8081";
  const base = "https://api.xelonic.com";
  // const base = "https://api.sol3.xelonic.de";

  const response = await fetch(
    `${base}/market-data/1.0.0/external/wordpress/financial-ratio-block?ticker=${attributes.ticker}&ratio_id=${attributes.ratioID}`,
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

  const ratioDefinition = findRatioDefinition(attributes.ratioID);
  if (!ratioDefinition) {
    throw new Error("ratio definition not found");
  }

  return {
    ...attributes,
    ratioDefinition,
    ratio: returnedData,
  };
}

/**
 * options:
 * - linksDisabled: if true, the rendered links are not clickable
 */
export function renderBlock(data, options) {
  const companyName = getCompanyName(data);
  const companyLogo = data.companyLogoVisible ? getCompanyLogo(data.ratio) : undefined;
  let companyInTitle;

  if (data.companyInTitle !== "none") {
    companyInTitle = (
      <div className="xe-ticker">
        {companyName}
      </div>
    );
  }

  let logoInTitle;

  if (companyLogo) {
    logoInTitle = (
      <img className="xe-logo" src={companyLogo} alt={companyName} />
    );
  }

  const link = data.ratio.dash_link ?? "https://xelonic.com";

  return (
    <div className="xe-container">
      {/* noreferrer: https://mathiasbynens.github.io/rel-noopener/#recommendations */}
      <a href={link} target="_blank" rel="noreferrer" className={options?.linksDisabled && "xe-disabled-link"}>
      <div className="xe-wrap-logo">{logoInTitle}</div>
        <div className="xe-company">{companyInTitle}</div>
        <div className="xe-title">
          <div><strong>{data.ratioDefinition.label}</strong></div>
        </div>
      </a>
      {data.subtitleVisible && <div className="xe-subtitle">{data.ratioDefinition.subLabel}</div>}
      <div className="xe-value">{renderRatioValue(data.ratio)}</div>
    </div>
  );
}

function getCompanyName(data) {
  if (data.companyInTitle === "company_name" && data.ratio.company_info && data.ratio.company_info.name) {
    return data.ratio.company_info.name;
  }

  return data.ticker.toUpperCase();
}

function getCompanyLogo(ratio) {
  if (!ratio) {
    return undefined;
  }

  if (!ratio.company_info) {
    return undefined;
  }

  if (!ratio.company_info.logo) {
    return undefined;
  }

  return ratio.company_info.logo.url;
}

function renderRatioValue(ratio) {
  if (!ratio.value) {
    return <div>n/a</div>;
  }

  return <div>{formatValue(ratio.value, ratio.unit)}</div>;
}

function formatValue(value, unit) {
  const options = {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    notation: "compact",
  };

  if (value.is_percentage) {
    options.style = "percent";
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

export function renderError(err) {
  return (
    <div className="xe-error-container">
      <div className="xe-icon">
        <Dashicon icon="warning" />
      </div>
      <div className="xe-message">{err}</div>
    </div>
  );
}
