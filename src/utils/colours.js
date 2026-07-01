export function normalize_hex(value) {
  let hex = String(value || "").trim().toLowerCase();

  if (!hex) {
    return "";
  }

  if (!hex.startsWith("#")) {
    hex = `#${hex}`;
  }

  if (/^#[0-9a-f]{3}$/.test(hex)) {
    hex = `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;
  }

  if (!/^#[0-9a-f]{6}$/.test(hex)) {
    return "";
  }

  return hex;
}

export function normalize_colours(items) {
  if (!Array.isArray(items)) {
    return [];
  }

  const seen = new Set();
  const normalized = [];

  for (const item of items) {
    const name = String(item?.name || "").trim();
    const hex = normalize_hex(item?.hex);
    const key = name.toLowerCase();

    if (!name || !hex || seen.has(key)) {
      continue;
    }

    seen.add(key);
    normalized.push({ name, hex });
  }

  return normalized;
}
