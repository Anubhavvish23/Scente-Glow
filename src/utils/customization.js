import { normalize_colours } from "./colours";

export const customization_letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export function get_product_colours(product) {
  return normalize_colours(product?.custom_colours);
}

export function is_letter_customizable(product) {
  return get_product_colours(product).length > 0;
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
