import { __ } from "@wordpress/i18n";

export function findRatioDefinition(ratioID) {
  return ratioDefinitions.find((def) => def.id === ratioID);
}

export const ratioDefinitions = [
  {
    id: "market_cap",
    label: __("Market Cap", "xelonic-financial-ratio-block"),
    subLabel: __("Shares × Price", "xelonic-financial-ratio-block"),
  },
  {
    id: "price_earnings_basic",
    label: __("Price/Earnings", "xelonic-financial-ratio-block"),
  },
  {
    id: "price_sales",
    label: __("Price/Sales", "xelonic-financial-ratio-block"),
    subLabel: __("Price / Revenues", "xelonic-financial-ratio-block"),
  },
  {
    id: "price_book",
    label: __("Price/Book", "xelonic-financial-ratio-block"),
  },
  {
    id: "price_cash_flow",
    label: __("Price/Cash-Flow", "xelonic-financial-ratio-block"),
  },
];
