import { bulk_packs_to_admin_rows, empty_pack_rows } from "./admin_bulk_packs";
import { normalize_colours } from "./colours";

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
  sold_out: false,
  packages_visible: false,
  pack_rows: empty_pack_rows.map((row) => ({ ...row })),
  colours_enabled: false,
  custom_colours: [],
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

  const pack_rows = bulk_packs_to_admin_rows(product.bulk_packs);
  const packages_visible = pack_rows.some((row) => row.size || row.price || row.discount_percent);
  const custom_colours = normalize_colours(product.custom_colours);

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
    sold_out: Boolean(product.sold_out),
    packages_visible,
    pack_rows,
    colours_enabled: custom_colours.length > 0,
    custom_colours,
  };
}
