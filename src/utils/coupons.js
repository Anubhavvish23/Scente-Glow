export const active_coupons = {
  GLOW10: { percent: 10, label: "10% off your order" },
  WELCOME15: { percent: 15, label: "15% off your first order" },
};

export const sale_banner_sentence =
  'Use code "{code}" for {percent}% off on your order';

export const default_sale_banner_settings = {
  enabled: false,
  code: "",
  percent: "",
};

export function has_sale_banner_content(settings = default_sale_banner_settings) {
  const code = String(settings?.code ?? "").trim();
  const percent = settings?.percent;
  return Boolean(code) && percent !== "" && percent !== null && percent !== undefined;
}

export function build_sale_banner_message(code, percent) {
  return sale_banner_sentence
    .replace("{code}", String(code || "").toUpperCase())
    .replace("{percent}", String(percent ?? ""));
}

export function build_coupon_map(banner_settings = default_sale_banner_settings) {
  const merged = { ...active_coupons };

  if (banner_settings?.code && banner_settings.percent !== "" && banner_settings.percent != null) {
    const code = banner_settings.code.toUpperCase();
    merged[code] = {
      percent: banner_settings.percent,
      label: `${banner_settings.percent}% off your order`,
    };
  }

  return merged;
}

export function get_coupon_percent(code, coupon_map = active_coupons) {
  const coupon = coupon_map[code?.toUpperCase()];
  return coupon?.percent || 0;
}

export function get_coupon_label(code, coupon_map = active_coupons) {
  const coupon = coupon_map[code?.toUpperCase()];
  return coupon?.label || "";
}
