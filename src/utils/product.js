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
    return product.images.filter(Boolean);
  }

  return [product?.img, product?.lifestyle].filter(Boolean);
}
