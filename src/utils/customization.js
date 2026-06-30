export const letter_customizable_product_ids = new Set(["heart-whisper-candles"]);

export const customization_colors = [
  { name: "Blush Petal", hex: "#f4a6c1" },
  { name: "Celestial Blue", hex: "#6baed6" },
  { name: "Sunset Tangerine", hex: "#f5a623" },
  { name: "Ruby Flame", hex: "#e63946" },
  { name: "Emerald Meadow", hex: "#6aab73" },
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
