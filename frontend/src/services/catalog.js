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
    product.name, product.material, product.category, product.description,
    product.gsm && `${product.gsm} GSM`, product.width && `${product.width} cm`,
  ].filter(Boolean).join(" ").toLowerCase();

  return query.toLowerCase().split(/\s+/).filter(Boolean)
    .every((term) => searchable.includes(term));
}
