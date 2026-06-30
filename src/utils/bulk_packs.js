export function get_product_bulk_packs(product) {
  if (!Array.isArray(product?.bulk_packs)) {
    return [];
  }
  return product.bulk_packs;
}

export function has_bulk_packs(product) {
  return get_product_bulk_packs(product).length > 0;
}

export function bulk_pack_matches(left, right) {
  if (!left && !right) {
    return true;
  }
  if (!left || !right) {
    return false;
  }
  return left.id === right.id;
}

export function format_bulk_pack_summary(bulk_pack) {
  if (!bulk_pack?.label) {
    return "";
  }
  return bulk_pack.label;
}

export function get_line_price(product, bulk_pack = null) {
  if (bulk_pack?.price != null) {
    return bulk_pack.price;
  }
  return product?.price ?? 0;
}

export function get_line_original_price(product, bulk_pack = null) {
  if (bulk_pack?.original_price != null) {
    return bulk_pack.original_price;
  }
  return product?.original_price;
}

export function get_default_bulk_pack(product) {
  const packs = get_product_bulk_packs(product);
  return packs[0] ?? null;
}
