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
