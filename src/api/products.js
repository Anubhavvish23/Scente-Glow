import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const fallback_products = [
  {
    id: "noir-vetiver",
    name: "Noir Vetiver",
    scent: "Woody · Smoky",
    price: 48,
    img: "/homepage.png",
    lifestyle: "/about/b96c96116_generated_a1986ec2.png",
    active: true,
  },
  {
    id: "rose-amber",
    name: "Rose Amber",
    scent: "Floral · Warm",
    price: 52,
    img: "/about/e1256a022_generated_bebe330e.png",
    lifestyle: "/about/b231a77a8_generated_b6b6f734.png",
    active: true,
  },
  {
    id: "cedar-moss",
    name: "Cedar Moss",
    scent: "Earthy · Fresh",
    price: 46,
    img: "/about/b231a77a8_generated_b6b6f734.png",
    lifestyle: "/homepage.png",
    active: true,
  },
];

export async function fetch_products() {
  try {
    const snapshot = await getDocs(collection(db, "products"));
    const products = snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter((product) => product.active !== false)
      .sort((a, b) => (a.name || "").localeCompare(b.name || ""));

    return products.length > 0 ? products : fallback_products;
  } catch {
    return fallback_products;
  }
}
