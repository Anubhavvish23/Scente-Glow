import { format_price } from "./pricing";

const whatsapp_number = "917406903913";

export function build_whatsapp_order_message(cart_items, cart_total, options = {}) {
  const { cart_subtotal, coupon_code, cart_discount } = options;
  const item_lines = cart_items.map((item, index) => {
    const line_total = item.price * item.quantity;
    return `${index + 1}. ${item.name} (${item.scent}) x ${item.quantity} - ${format_price(line_total)}`;
  });

  const lines = [
    "Hello Scenté Glow,",
    "",
    "I would like to place an order for the following candles:",
    "",
    ...item_lines,
    "",
  ];

  if (coupon_code && cart_discount > 0) {
    lines.push(`Subtotal: ${format_price(cart_subtotal)}`);
    lines.push(`Coupon (${coupon_code}): -${format_price(cart_discount)}`);
    lines.push(`Total: ${format_price(cart_total)}`);
  } else {
    lines.push(`Total: ${format_price(cart_total)}`);
  }

  lines.push("", "Please confirm availability and delivery details. Thank you!");

  return lines.join("\n");
}

export function get_whatsapp_order_url(cart_items, cart_total, options = {}) {
  const message = build_whatsapp_order_message(cart_items, cart_total, options);
  return `https://wa.me/${whatsapp_number}?text=${encodeURIComponent(message)}`;
}

export function get_whatsapp_product_url(product) {
  const message = [
    "Hello Scenté Glow,",
    "",
    "I would like to order:",
    "",
    `${product.name} (${product.scent}) x 1 - ${format_price(product.price)}`,
    "",
    "Please confirm availability and delivery details. Thank you!",
  ].join("\n");

  return `https://wa.me/${whatsapp_number}?text=${encodeURIComponent(message)}`;
}
