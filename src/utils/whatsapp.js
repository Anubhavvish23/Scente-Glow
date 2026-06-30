import { format_price } from "./pricing";
import {
  format_customization_whatsapp_lines,
  is_letter_customizable,
} from "./customization";
import {
  format_bulk_pack_summary,
  get_line_price,
  has_bulk_packs,
} from "./bulk_packs";

const whatsapp_number = "917406903913";

function format_fragrance_line(fragrance, scent = "") {
  if (fragrance) {
    return `Fragrance: ${fragrance}`;
  }
  if (scent) {
    return `Scent: ${scent}`;
  }
  return "Fragrance: Not selected";
}

export function build_whatsapp_order_message(cart_items, cart_total, options = {}) {
  const { cart_subtotal, coupon_code, cart_discount, is_gift, gift_note } = options;
  const item_lines = cart_items.flatMap((item, index) => {
    const line_total = item.price * item.quantity;
    const customization_lines = format_customization_whatsapp_lines(item.customization);
    const bulk_pack_summary = format_bulk_pack_summary(item.bulk_pack);
    return [
      `${index + 1}. ${item.name}`,
      `   ${format_fragrance_line(item.fragrance, item.scent)}`,
      ...(bulk_pack_summary ? [`   ${bulk_pack_summary}`] : []),
      ...customization_lines.map((line) => `   ${line}`),
      `   Qty: ${item.quantity} - ${format_price(line_total)}`,
      "",
    ];
  });

  const lines = [
    "Hello Scenté Glow,",
    "",
    "I would like to place an order for the following candles:",
    "",
    ...item_lines,
  ];

  if (coupon_code && cart_discount > 0) {
    lines.push(`Subtotal: ${format_price(cart_subtotal)}`);
    lines.push(`Coupon (${coupon_code}): -${format_price(cart_discount)}`);
    lines.push(`Total: ${format_price(cart_total)}`);
  } else {
    lines.push(`Total: ${format_price(cart_total)}`);
  }

  if (is_gift || gift_note?.trim()) {
    lines.push("");
    lines.push(`Gift order: ${is_gift ? "Yes" : "No"}`);
    if (gift_note?.trim()) {
      lines.push(`Gift message: ${gift_note.trim()}`);
    }
  }

  lines.push("", "Please confirm availability and delivery details. Thank you!");

  return lines.join("\n");
}

export function get_whatsapp_order_url(cart_items, cart_total, options = {}) {
  const message = build_whatsapp_order_message(cart_items, cart_total, options);
  return `https://wa.me/${whatsapp_number}?text=${encodeURIComponent(message)}`;
}

export function get_whatsapp_product_url(
  product,
  fragrance = "",
  customization = null,
  bulk_pack = null,
  options = {}
) {
  if (!fragrance || product?.sold_out) {
    return null;
  }

  if (is_letter_customizable(product) && !customization) {
    return null;
  }

  if (has_bulk_packs(product) && !bulk_pack) {
    return null;
  }

  const { is_gift = false, gift_note = "" } = options;
  const customization_lines = format_customization_whatsapp_lines(customization);
  const bulk_pack_summary = format_bulk_pack_summary(bulk_pack);
  const price = get_line_price(product, bulk_pack);
  const gift_lines =
    is_gift || gift_note?.trim()
      ? [
          `Gift order: ${is_gift ? "Yes" : "No"}`,
          ...(gift_note?.trim() ? [`Gift message: ${gift_note.trim()}`] : []),
          "",
        ]
      : [];
  const message = [
    "Hello Scenté Glow,",
    "",
    "I would like to order:",
    "",
    product.name,
    `Fragrance: ${fragrance}`,
    ...(bulk_pack_summary ? [bulk_pack_summary] : []),
    ...customization_lines,
    `Qty: 1 - ${format_price(price)}`,
    "",
    ...gift_lines,
    "Please confirm availability and delivery details. Thank you!",
  ].join("\n");

  return `https://wa.me/${whatsapp_number}?text=${encodeURIComponent(message)}`;
}
