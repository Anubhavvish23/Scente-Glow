import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { default_sale_banner_settings } from "../utils/coupons";
import { default_fragrances, normalize_fragrances } from "../utils/fragrances";
import {
  default_product_categories,
  normalize_categories,
} from "../utils/product_categories";
import { default_hero_cover, normalize_hero_cover } from "../utils/hero_cover";

const settings_doc_id = "sale_banner";
const fragrances_doc_id = "fragrances";
const categories_doc_id = "categories";
const hero_cover_doc_id = "hero_cover";

export async function fetch_sale_banner_settings() {
  try {
    const snapshot = await getDoc(doc(db, "settings", settings_doc_id));
    if (!snapshot.exists()) {
      return default_sale_banner_settings;
    }

    const data = snapshot.data();
    return normalize_sale_banner_settings(data);
  } catch {
    return default_sale_banner_settings;
  }
}

export async function save_sale_banner_settings(settings) {
  const normalized = normalize_sale_banner_settings(settings);
  await setDoc(doc(db, "settings", settings_doc_id), normalized, { merge: true });
  return normalized;
}

function normalize_sale_banner_settings(settings = {}) {
  const code = String(settings.code ?? "").trim().toUpperCase();

  let percent = settings.percent;
  if (percent === "" || percent === null || percent === undefined) {
    percent = "";
  } else {
    const parsed = Number(percent);
    percent = Number.isFinite(parsed) ? Math.min(100, Math.max(0, parsed)) : "";
  }

  return {
    enabled: settings.enabled === true,
    code,
    percent,
  };
}

export async function fetch_fragrances() {
  try {
    const snapshot = await getDoc(doc(db, "settings", fragrances_doc_id));
    if (!snapshot.exists()) {
      return default_fragrances;
    }

    const items = normalize_fragrances(snapshot.data()?.items);
    return items.length > 0 ? items : default_fragrances;
  } catch {
    return default_fragrances;
  }
}

export async function save_fragrances(items) {
  const normalized = normalize_fragrances(items);

  if (normalized.length === 0) {
    throw new Error("Add at least one fragrance.");
  }

  await setDoc(
    doc(db, "settings", fragrances_doc_id),
    { items: normalized, updated_at: Date.now() },
    { merge: true }
  );

  return normalized;
}

export async function fetch_categories() {
  try {
    const snapshot = await getDoc(doc(db, "settings", categories_doc_id));
    if (!snapshot.exists()) {
      return default_product_categories;
    }

    const items = normalize_categories(snapshot.data()?.items);
    return items.length > 0 ? items : default_product_categories;
  } catch {
    return default_product_categories;
  }
}

export async function save_categories(items) {
  const normalized = normalize_categories(items);

  if (normalized.length === 0) {
    throw new Error("Add at least one category.");
  }

  await setDoc(
    doc(db, "settings", categories_doc_id),
    { items: normalized, updated_at: Date.now() },
    { merge: true }
  );

  return normalized;
}

export async function fetch_hero_cover() {
  try {
    const snapshot = await getDoc(doc(db, "settings", hero_cover_doc_id));
    if (!snapshot.exists()) {
      return default_hero_cover;
    }

    return normalize_hero_cover(snapshot.data());
  } catch {
    return default_hero_cover;
  }
}

export async function save_hero_cover(settings) {
  const normalized = normalize_hero_cover(settings);

  if (normalized.images.length === 0) {
    throw new Error("Add at least one cover image.");
  }

  await setDoc(
    doc(db, "settings", hero_cover_doc_id),
    { ...normalized, updated_at: Date.now() },
    { merge: false }
  );

  return normalized;
}
