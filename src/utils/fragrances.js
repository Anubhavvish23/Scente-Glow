export const default_fragrances = [
  "Lavender",
  "Jasmine",
  "Vanilla",
  "Sandalwood",
  "Ocean Breeze",
];

export const dummy_fragrances = default_fragrances;

export function has_product_fragrances(product) {
  return product?.fragrances_enabled === true;
}

export function normalize_fragrances(items) {
  if (!Array.isArray(items)) {
    return [];
  }

  const seen = new Set();
  const normalized = [];

  for (const item of items) {
    const name = String(item || "").trim();
    const key = name.toLowerCase();

    if (!name || seen.has(key)) {
      continue;
    }

    seen.add(key);
    normalized.push(name);
  }

  return normalized;
}
