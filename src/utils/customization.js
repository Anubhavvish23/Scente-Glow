import { normalize_colours } from "./colours";

export const customization_letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export function get_product_colours(product) {
  return normalize_colours(product?.custom_colours);
}

export function has_product_letters(product) {
  return product?.letters_enabled === true;
}

export function has_product_colours(product) {
  return get_product_colours(product).length > 0;
}

export function is_letter_customizable(product) {
  return has_product_letters(product) || has_product_colours(product);
}

export function is_customization_complete(customization, product) {
  if (!is_letter_customizable(product)) {
    return true;
  }

  if (!customization) {
    return false;
  }

  if (has_product_letters(product) && !customization.letter) {
    return false;
  }

  if (has_product_colours(product) && !customization.color_name) {
    return false;
  }

  return true;
}

export function format_customization_summary(customization) {
  if (!customization) {
    return "";
  }

  const parts = [];

  if (customization.letter) {
    parts.push(`Letter ${customization.letter}`);
  }

  if (customization.color_name) {
    parts.push(customization.color_name);
  }

  return parts.join(" · ");
}

export function format_customization_whatsapp_lines(customization) {
  if (!customization) {
    return [];
  }

  const lines = [];

  if (customization.letter) {
    lines.push(`Letter: ${customization.letter}`);
  }

  if (customization.color_name) {
    lines.push(`Colour: ${customization.color_name}`);
  }

  return lines;
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
