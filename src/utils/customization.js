export const letter_customizable_product_ids = new Set(["heart-whisper-candles"]);

export const customization_colors = [
  { name: "Blush Pink", hex: "#e8b4b8" },
  { name: "Ivory Cream", hex: "#f5f0e6" },
  { name: "Lavender Mist", hex: "#c9b8d9" },
  { name: "Sage Green", hex: "#b8c9a8" },
  { name: "Golden Amber", hex: "#d4a574" },
];

export const customization_letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export function is_letter_customizable(product) {
  return letter_customizable_product_ids.has(product?.id);
}

export function format_customization_summary(customization) {
  if (!customization?.letter || !customization?.color_name) {
    return "";
  }
  return `Letter ${customization.letter} · ${customization.color_name}`;
}

export function format_customization_whatsapp_lines(customization) {
  if (!customization?.letter || !customization?.color_name) {
    return [];
  }
  return [`Letter: ${customization.letter}`, `Colour: ${customization.color_name}`];
}

export function customization_matches(left, right) {
  if (!left && !right) {
    return true;
  }
  if (!left || !right) {
    return false;
  }
  return left.letter === right.letter && left.color_name === right.color_name;
}
