import { resolve_product_image_url } from "./google_drive";

export const default_hero_cover = {
  images: ["/homepage.png"],
};

export function normalize_hero_cover(settings = {}) {
  let raw_images = [];

  if (Array.isArray(settings.images) && settings.images.length > 0) {
    raw_images = settings.images;
  } else {
    raw_images = [settings.cover_image, settings.second_image].filter(Boolean);
  }

  const images = raw_images
    .map((item) => resolve_product_image_url(item))
    .filter(Boolean);

  return {
    images: images.length > 0 ? images : [...default_hero_cover.images],
  };
}

export function get_hero_cover_images(settings = default_hero_cover) {
  return normalize_hero_cover(settings).images;
}
