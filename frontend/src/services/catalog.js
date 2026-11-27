import { apiUrl } from "./api";

export const isDemoMode = import.meta.env.MODE === "demo";

export async function getCatalog(signal) {
  const response = await fetch(apiUrl("/products"), { signal });
  if (!response.ok) throw new Error("Catalog unavailable");
  const products = await response.json();
  if (!Array.isArray(products)) throw new Error("Invalid catalog response");
  return products;
}

export function itemPrice(product) {
  const { price, discountPrice } = product;
  return Number.isFinite(discountPrice) && discountPrice >= 0 && discountPrice <= price
    ? discountPrice : price;
}

export function availableQuantity(product) {
  const { inStock, stockCount } = product;
  return inStock !== false && Number.isSafeInteger(stockCount) ? Math.max(0, stockCount) : 0;
}

export function matchesFabricSearch(product, query) {
  const searchable = [
    product.name, product.material, product.category, product.description, product.colour, product.finish, product.stretch,
    ...(product.intendedUses ?? []),
    product.gsm && `${product.gsm} GSM`, product.width && `${product.width} cm`,
  ].filter(Boolean).join(" ").toLowerCase();

  return query.toLowerCase().split(/\s+/).filter(Boolean)
    .every((term) => searchable.includes(term));
}

export function uniqueTraitValues(products, key) {
  return [...new Set(products.map((product) => product[key]).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b));
}

export function matchesFabricTrait(product, key, value) {
  return !value || product[key] === value;
}

export const weightBands = [
  { value: "light", label: "Lightweight · under 150 GSM", min: 0, max: 150 },
  { value: "medium", label: "Midweight · 150–249 GSM", min: 150, max: 250 },
  { value: "heavy", label: "Heavyweight · 250 GSM and up", min: 250, max: Infinity },
];

export function matchesFabricWeight(product, filter) {
  const band = weightBands.find(({ value }) => value === filter);
  return !band || (Number.isFinite(product.gsm) && product.gsm >= band.min && product.gsm < band.max);
}

export function formatFabricQuantity(quantity, unit) {
  if (!unit) return `${quantity} ${quantity === 1 ? "unit" : "units"}`;
  return `${quantity} ${unit}${quantity === 1 ? "" : "s"}`;
}

export function minimumQuantity(product) {
  const value = product.minimumOrderQuantity;
  return Number.isSafeInteger(value) && value > 0 ? value : 1;
}
