export const empty_admin_product_form = {
  name: "",
  scent: "",
  description: "",
  price: "",
  original_price: "",
  weight: "",
  burn_time: "",
  details_heading: "",
  details_text: "",
  image_links: [""],
  categories: [],
  rating: "",
  featured: false,
};

export function product_to_admin_form(product) {
  if (!product) {
    return empty_admin_product_form;
  }

  const image_links = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : [product.img, product.lifestyle].filter(Boolean);

  const categories = Array.isArray(product.categories) && product.categories.length > 0
    ? product.categories
    : product.category
      ? [product.category]
      : [];

  return {
    name: product.name || "",
    scent: product.scent || "",
    description: product.description || "",
    price: product.price ?? "",
    original_price: product.original_price ?? "",
    weight: product.weight || "",
    burn_time: product.burn_time || "",
    details_heading: product.details_heading || "",
    details_text: Array.isArray(product.details) ? product.details.join("\n") : "",
    image_links: image_links.length > 0 ? image_links : [""],
    categories,
    rating: product.rating ?? "",
    featured: Boolean(product.featured),
  };
}
