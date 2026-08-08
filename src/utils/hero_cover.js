import { resolve_product_image_url } from "./google_drive";

export const default_hero_cover = {
  cover_image: "/homepage.png",
  second_image: "",
};

export function normalize_hero_cover(settings = {}) {
  const cover_image =
    resolve_product_image_url(settings.cover_image) || default_hero_cover.cover_image;
  const second_image = resolve_product_image_url(settings.second_image);

  return {
    cover_image,
    second_image,
  };
}

export function get_hero_cover_images(settings = default_hero_cover) {
  const normalized = normalize_hero_cover(settings);
  return [normalized.cover_image, normalized.second_image].filter(Boolean);
}
