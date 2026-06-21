export function format_price(amount) {
  return `₹${Number(amount).toLocaleString("en-IN")}`;
}

export function get_discount_percent(price, original_price) {
  if (!original_price || original_price <= price) return 0;
  return Math.round(((original_price - price) / original_price) * 100);
}
