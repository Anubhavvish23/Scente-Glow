import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const fallback_products = [
  {
    id: "noir-vetiver",
    name: "Noir Vetiver",
    scent: "Woody · Smoky",
    price: 1169,
    original_price: 1299,
    rating: 4.98,
    review_count: 127,
    description:
      "A deep woody blend with smoky vetiver and warm amber notes, poured in small batches for a long, clean burn.",
    img: "/homepage.png",
    lifestyle: "/about/b96c96116_generated_a1986ec2.png",
    active: true,
  },
  {
    id: "rose-amber",
    name: "Rose Amber",
    scent: "Floral · Warm",
    price: 1049,
    original_price: 1199,
    rating: 4.92,
    review_count: 98,
    description:
      "Soft rose petals layered with golden amber create a warm floral glow perfect for evening rituals.",
    img: "/about/e1256a022_generated_bebe330e.png",
    lifestyle: "/about/b231a77a8_generated_b6b6f734.png",
    active: true,
  },
  {
    id: "cedar-moss",
    name: "Cedar Moss",
    scent: "Earthy · Fresh",
    price: 999,
    original_price: 1149,
    rating: 4.95,
    review_count: 84,
    description:
      "Fresh cedar and green moss grounded with earthy tones — crisp, calming, and naturally refined.",
    img: "/about/b231a77a8_generated_b6b6f734.png",
    lifestyle: "/homepage.png",
    active: true,
  },
];

export async function fetch_products() {
  try {
    const snapshot = await getDocs(collection(db, "products"));
    const products = snapshot.docs
      .map((item) => ({ id: item.id, ...item.data() }))
      .filter((product) => product.active !== false)
      .sort((a, b) => (a.name || "").localeCompare(b.name || ""));

    return products.length > 0 ? products : fallback_products;
  } catch {
    return fallback_products;
  }
}

export async function fetch_product_by_id(id) {
  try {
    const doc_ref = doc(db, "products", id);
    const snapshot = await getDoc(doc_ref);
    if (snapshot.exists()) {
      return { id: snapshot.id, ...snapshot.data() };
    }
  } catch {
    // fall through to local products
  }

  return fallback_products.find((product) => product.id === id) || null;
}
