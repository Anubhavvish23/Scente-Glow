import { doc, getDoc, setDoc, increment } from "firebase/firestore";
import { db } from "../firebase";

const stats_doc_id = "summary";

const empty_stats = {
  total_product_views: 0,
  total_cart_adds: 0,
  total_whatsapp_orders: 0,
  product_views: {},
  cart_adds: {},
  fragrance_picks: {},
};

function stat_key(value) {
  return String(value || "")
    .trim()
    .replace(/[.[\]#$\/]/g, "_");
}

function top_entries(record, limit = 5) {
  return Object.entries(record || {})
    .sort((a, b) => Number(b[1]) - Number(a[1]))
    .slice(0, limit)
    .map(([key, count]) => ({
      key,
      count: Number(count) || 0,
    }));
}

function normalize_stats(data = {}) {
  return {
    total_product_views: Number(data.total_product_views) || 0,
    total_cart_adds: Number(data.total_cart_adds) || 0,
    total_whatsapp_orders: Number(data.total_whatsapp_orders) || 0,
    top_product_views: top_entries(data.product_views),
    top_cart_adds: top_entries(data.cart_adds),
    top_fragrances: top_entries(data.fragrance_picks),
  };
}

export async function fetch_stats_summary() {
  try {
    const snapshot = await getDoc(doc(db, "stats", stats_doc_id));
    if (!snapshot.exists()) {
      return normalize_stats(empty_stats);
    }
    return normalize_stats(snapshot.data());
  } catch {
    return normalize_stats(empty_stats);
  }
}

export async function track_product_view(product_id) {
  if (!product_id) {
    return;
  }

  try {
    await setDoc(
      doc(db, "stats", stats_doc_id),
      {
        total_product_views: increment(1),
        [`product_views.${stat_key(product_id)}`]: increment(1),
        updated_at: Date.now(),
      },
      { merge: true }
    );
  } catch {
    // ignore tracking errors
  }
}

export async function track_cart_add(product_id, fragrance = "") {
  if (!product_id) {
    return;
  }

  const payload = {
    total_cart_adds: increment(1),
    [`cart_adds.${stat_key(product_id)}`]: increment(1),
    updated_at: Date.now(),
  };

  if (fragrance) {
    payload[`fragrance_picks.${stat_key(fragrance)}`] = increment(1);
  }

  try {
    await setDoc(doc(db, "stats", stats_doc_id), payload, { merge: true });
  } catch {
    // ignore tracking errors
  }
}

export async function track_whatsapp_order() {
  try {
    await setDoc(
      doc(db, "stats", stats_doc_id),
      {
        total_whatsapp_orders: increment(1),
        updated_at: Date.now(),
      },
      { merge: true }
    );
  } catch {
    // ignore tracking errors
  }
}
