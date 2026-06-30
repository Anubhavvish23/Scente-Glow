import { resolve_product_image_url } from "./google_drive";

export const default_product_details = [
  "100% natural soy wax",
  "Lead-free cotton wick",
  "45+ hour burn time",
  "Small batch poured",
  "Phthalate-free fragrance oils",
  "Reusable glass jar",
];

export function get_product_details(product) {
  if (Array.isArray(product?.details) && product.details.length > 0) {
    return product.details;
  }

  return default_product_details;
}

export function get_product_images(product) {
  if (Array.isArray(product?.images) && product.images.length > 0) {
    return product.images.map(resolve_product_image_url).filter(Boolean);
  }

  return [product?.img, product?.lifestyle].map(resolve_product_image_url).filter(Boolean);
}

export function get_product_rating(product) {
  const value = Number(product?.rating);
  if (!Number.isFinite(value) || value <= 0 || value > 5) {
    return null;
  }
  return Math.round(value * 10) / 10;
}

export function format_product_rating(rating) {
  const value = typeof rating === "number" ? rating : get_product_rating({ rating });
  if (value == null) {
    return null;
  }
  return value.toFixed(1);
}

export function is_product_sold_out(product) {
  return product?.sold_out === true;
}
