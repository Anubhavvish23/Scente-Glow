export const product_category_options = [
  "Glow Minis",
  "The Jar Edit",
  "Elegant Essence",
];

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
