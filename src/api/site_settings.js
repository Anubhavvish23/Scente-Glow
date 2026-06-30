import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { default_sale_banner_settings } from "../utils/coupons";
import { default_fragrances, normalize_fragrances } from "../utils/fragrances";

const settings_doc_id = "sale_banner";
const fragrances_doc_id = "fragrances";

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
