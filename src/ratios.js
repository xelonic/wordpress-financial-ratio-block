import { __ } from "@wordpress/i18n";

export function findRatioDefinition(ratioID) {
  return ratioDefinitions.find((def) => def.id === ratioID);
}

export const ratioDefinitions = [
  {
    id: "market_cap",
    label: __("Market Cap", "financial-ratio"),
    subLabel: __("Shares × Price", "financial-ratio"),
  },
  {
    id: "price_earnings_basic",
    label: __("Price/Earnings", "financial-ratio"),
  },
  {
    id: "price_sales",
    label: __("Price/Sales", "financial-ratio"),
    subLabel: __("Price / Revenues", "financial-ratio"),
  },
  {
    id: "price_book",
    label: __("Price/Book", "financial-ratio"),
  },
  {
    id: "price_cash_flow",
    label: __("Price/Cash-Flow", "financial-ratio"),
  },
];
