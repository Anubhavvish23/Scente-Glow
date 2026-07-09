import {
  collect_product_categories,
  get_product_category_label,
  product_matches_category,
} from "./product_categories";

export function build_shop_categories(products, embedded = false) {
  if (embedded) {
    return [];
  }

  return ["All", ...collect_product_categories(products)];
}

export function filter_shop_products(
  products,
  { query = "", selected_category = "All", embedded = false } = {}
) {
  const normalized_query = embedded ? "" : query.trim().toLowerCase();

  const category_products =
    embedded || selected_category === "All"
      ? products
      : products.filter((product) => product_matches_category(product, selected_category));

  if (!normalized_query) {
    return category_products;
  }

  return category_products.filter((product) => {
    const category_label = get_product_category_label(product).toLowerCase();
    const categories_text = (product.categories || []).join(" ").toLowerCase();

    return (
      product.name.toLowerCase().includes(normalized_query) ||
      (product.scent || "").toLowerCase().includes(normalized_query) ||
      category_label.includes(normalized_query) ||
      categories_text.includes(normalized_query) ||
      (product.description || "").toLowerCase().includes(normalized_query)
    );
  });
}

export function paginate_shop_products(products, { page, page_size, embedded, limit }) {
  if (embedded) {
    return {
      items: products.slice(0, limit),
      total_pages: 1,
      current_page: 1,
    };
  }

  const total_pages = Math.max(1, Math.ceil(products.length / page_size));
  const safe_page = Math.min(Math.max(page, 1), total_pages);
  const page_start = (safe_page - 1) * page_size;

  return {
    items: products.slice(page_start, page_start + page_size),
    total_pages,
    current_page: safe_page,
  };
}

export function get_related_products(products, current_product, limit = 4) {
  if (!current_product || !Array.isArray(products)) {
    return [];
  }

  const scent_tag = (current_product.scent || "").split("·")[0].trim().toLowerCase();

  return products
    .filter((item) => item.id !== current_product.id)
    .sort((left, right) => {
      const left_match = (left.scent || "").toLowerCase().includes(scent_tag) ? 0 : 1;
      const right_match = (right.scent || "").toLowerCase().includes(scent_tag) ? 0 : 1;
      return left_match - right_match;
    })
    .slice(0, limit);
}
