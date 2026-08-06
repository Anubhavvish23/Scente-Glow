export const default_product_categories = [
  "Glow Minis",
  "The Jar Edit",
  "Elegant Essence",
];

export const product_category_options = default_product_categories;

export function normalize_categories(items) {
  if (!Array.isArray(items)) {
    return [];
  }

  const seen = new Set();
  const normalized = [];

  items.forEach((item) => {
    const name = String(item || "").trim();
    if (!name) {
      return;
    }

    const key = name.toLowerCase();
    if (seen.has(key)) {
      return;
    }

    seen.add(key);
    normalized.push(name);
  });

  return normalized;
}

export function merge_category_options(custom_items = []) {
  return normalize_categories([...default_product_categories, ...custom_items]);
}

export function product_matches_category(product, category) {
  if (!category || category === "All") {
    return true;
  }

  if (product.category === category) {
    return true;
  }

  return Array.isArray(product.categories) && product.categories.includes(category);
}

export function collect_product_categories(products) {
  const categories = new Set();

  products.forEach((product) => {
    if (product.category) {
      categories.add(product.category);
    }
    (product.categories || []).forEach((category) => {
      if (category) {
        categories.add(category);
      }
    });
  });

  return Array.from(categories).sort((a, b) => a.localeCompare(b));
}

export function get_product_category_label(product) {
  if (Array.isArray(product?.categories) && product.categories.length > 0) {
    return product.categories.join(" · ");
  }

  return product?.category || "";
}
