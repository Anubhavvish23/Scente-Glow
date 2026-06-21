export const active_coupons = {
  GLOW10: { percent: 10, label: "10% off your order" },
  WELCOME15: { percent: 15, label: "15% off your first order" },
};

export const sale_banner = {
  message: "Use code GLOW10 for 10% off · WELCOME15 for 15% off your first order",
  code: "GLOW10",
};

export function get_coupon_percent(code) {
  const coupon = active_coupons[code?.toUpperCase()];
  return coupon?.percent || 0;
}

export function get_coupon_label(code) {
  const coupon = active_coupons[code?.toUpperCase()];
  return coupon?.label || "";
}
