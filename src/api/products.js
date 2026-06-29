import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const retired_product_ids = new Set(["noir-vetiver", "rose-amber", "cedar-moss"]);

const glow_minis_meta = {
  category: "Glow Minis",
  weight: "120g",
  burn_time: "60 mins",
  details: [
    "Fully customizable colors",
    "Lead-free cotton wick",
    "60 min burn time",
    "Handmade with love",
  ],
};

const fallback_products = [
  {
    id: "fresh-scent-candle",
    name: "Fresh Scent Candle",
    scent: "Fresh · Customizable",
    category: "The Jar Edit",
    price: 269,
    description:
      "Handcrafted scented candles designed to bring warmth and calm to your space. With a clean burn and soft glow, they're perfect for everyday relaxation and aesthetic décor. Customize colours and fragrance of your choice.",
    img: "/products/fresh-scent-candle.png",
    lifestyle: "/products/fresh-scent-candle.png",
    active: true,
  },
  {
    id: "heart-glow-tealights",
    name: "Heart Glow Tealights",
    scent: "Romantic · Customizable",
    price: 299,
    description:
      "Pack of 10 heart-shaped tealight candles, fully customizable with colors of your choice. Perfect for gifting, décor and adding a warm romantic glow to any space.",
    img: "/products/heart-glow-tealights.png",
    lifestyle: "/products/heart-glow-tealights-lifestyle.png",
    ...glow_minis_meta,
    active: true,
  },
  {
    id: "bloom-bliss-candles",
    name: "Bloom Bliss Candles",
    scent: "Floral · Customizable",
    price: 299,
    description:
      "Pack of 10 flower-shaped candles, fully customizable with colors of your choice. Perfect for gifting, décor and adding a soft elegant charm to any space.",
    img: "/products/bloom-bliss-candles.png",
    lifestyle: "/products/bloom-bliss-candles-lifestyle.png",
    ...glow_minis_meta,
    active: true,
  },
  {
    id: "heart-whisper-candles",
    name: "Heart Whisper Candles",
    scent: "Personalized · Customizable",
    price: 35,
    description:
      "Personalized heart candles with name charms, fully customized in colors of your choice. A sweet little gift made with love.",
    img: "/products/heart-whisper-candles.png",
    lifestyle: "/products/heart-whisper-candles.png",
    ...glow_minis_meta,
    active: true,
  },
  {
    id: "butterfly-bliss",
    name: "Butterfly Bliss",
    scent: "Elegant · Customizable",
    price: 299,
    description:
      "Pack of 10 elegant polycarbonate candles, perfect for gifting and décor. Customized colours available as per your choice to make every set unique.",
    img: "/products/butterfly-bliss.png",
    lifestyle: "/products/butterfly-bliss-lifestyle.png",
    ...glow_minis_meta,
    active: true,
  },
  {
    id: "glow-sphere",
    name: "Glow Sphere",
    scent: "Classic · Customizable",
    price: 299,
    description:
      "Pack of 10 elegant round-shaped polycarbonate candles, perfect for décor, gifting and special occasions. Durable finish with customized colours available as per your choice.",
    img: "/products/glow-sphere.png",
    lifestyle: "/products/glow-sphere-lifestyle.png",
    ...glow_minis_meta,
    active: true,
  },
  {
    id: "crystal-cube",
    name: "Crystal Cube",
    scent: "Modern · Customizable",
    price: 299,
    description:
      "Pack of 10 square-shaped polycarbonate candles, designed to add a modern touch to your décor and gifting. Premium finish with customized colours available as per your choice.",
    img: "/products/crystal-cube.png",
    lifestyle: "/products/crystal-cube.png",
    ...glow_minis_meta,
    active: true,
  },
  {
    id: "luxe-tin-glow",
    name: "Luxe Tin Glow",
    scent: "Sleek · Customizable",
    price: 249,
    description:
      "Pack of 10 elegant aluminium container candles, perfect for décor, return gifts and special occasions. Sleek finish with customized colours available as per your choice.",
    img: "/products/luxe-tin-glow.png",
    lifestyle: "/products/luxe-tin-glow-lifestyle.png",
    ...glow_minis_meta,
    active: true,
  },
  {
    id: "daisy-bloom-ceramic-pot",
    name: "Daisy Bloom",
    scent: "Floral · Ceramic Pot",
    category: "Elegant Essence",
    price: 375,
    original_price: 420,
    description:
      "A handcrafted daisy flower candle in a premium ceramic pot, designed to add a soft elegant touch to your space. Perfect for gifting, décor and cozy moments. Tailor-made candles with your choice of colours and aromas.",
    img: "/products/daisy-bloom-ceramic-pot.png",
    lifestyle: "/products/daisy-bloom-ceramic-pot.png",
    active: true,
  },
  {
    id: "daisy-bloom",
    name: "Daisy Bloom Mini",
    scent: "Floral · Customizable",
    category: "Elegant Essence",
    price: 80,
    description:
      "A charming single daisy candle, perfect for gifting, décor and adding a floral touch to any space. Beautifully crafted with customized colours available as per your choice.",
    img: "/products/daisy-bloom.png",
    lifestyle: "/products/daisy-bloom-lifestyle.png",
    active: true,
  },
  {
    id: "ocean-whisper-shell",
    name: "Ocean Whisper Shell",
    scent: "Coastal · Customizable",
    category: "Elegant Essence",
    price: 109,
    description:
      "Bring the calm beauty of the sea into your space with this elegant seashell candle. Handcrafted with a soothing design, it adds a coastal charm and warm glow to any corner. Perfect for gifting, décor and customized colours available as per your choice.",
    img: "/products/ocean-whisper-shell.png",
    lifestyle: "/products/ocean-whisper-shell-lifestyle.png",
    active: true,
  },
  {
    id: "wax-sachets",
    name: "Wax sachets",
    scent: "Fragrance · Customizable",
    category: "Elegant Essence",
    price: 199,
    description:
      "A beautifully crafted wax sachet, perfect for adding a fresh and soothing fragrance to wardrobes, drawers and small spaces. Elegant design with customized colours and fragrance available as per your choice.",
    img: "/products/wax-sachets.png",
    lifestyle: "/products/wax-sachets-lifestyle.png",
    active: true,
  },
  {
    id: "eternal-bloom-embrace",
    name: "Eternal Bloom Embrace",
    scent: "Romantic · Customizable",
    category: "Elegant Essence",
    price: 399,
    description:
      "A beautifully sculpted candle symbolizing love, connection and timeless elegance. Featuring two graceful faces crowned with blooming roses in dreamy lavender and white marble tones, this handcrafted piece adds romance and charm to any space. Perfect for gifting, décor or creating a cozy luxe vibe. Customized colours available on request.",
    img: "/products/eternal-bloom-embrace.png",
    lifestyle: "/products/eternal-bloom-embrace.png",
    active: true,
  },
  {
    id: "blush-hearts-candle-jar",
    name: "Blush Hearts Candle Jar",
    scent: "Romantic · Customizable",
    category: "The Jar Edit",
    price: 219,
    description:
      "A dreamy candle featuring delicate heart-shaped wax embeds in a stylish glass jar. Perfect for gifting, romantic décor or self-care moments. Available with customized colours and fragrances to suit your vibe perfectly.",
    img: "/products/blush-hearts-candle-jar.png",
    lifestyle: "/products/blush-hearts-candle-jar.png",
    active: true,
  },
  {
    id: "aura-glow-jar-candle",
    name: "Aura Glow Jar Candle",
    scent: "Warm · Customizable",
    category: "The Jar Edit",
    price: 249,
    description:
      "A sleek jar candle crafted to create a warm, soothing ambiance. Perfect for home décor, gifting or unwinding moments. Customized colours and fragrances available to match your mood and style.",
    img: "/products/aura-glow-jar-candle.png",
    lifestyle: "/products/aura-glow-jar-candle.png",
    active: true,
  },
  {
    id: "calm-essence",
    name: "Calm Essence",
    scent: "Layered · Customizable",
    category: "The Jar Edit",
    price: 279,
    description:
      "Handcrafted candle featuring 3 beautiful layers of different colours, designed to add a unique and aesthetic touch to your space. Made with a clean long-lasting burn, it's perfect for decor, relaxation and gifting. Customization available — choose your preferred colours, fragrance and design to make it truly yours.",
    img: "/products/calm-essence.png",
    lifestyle: "/products/calm-essence.png",
    active: true,
  },
  {
    id: "rose-bliss",
    name: "Rose bliss",
    scent: "Floral · Rose",
    category: "The Jar Edit",
    price: 299,
    description:
      "A handcrafted scented candle infused with delicate rose petals, designed to create a warm, calming ambiance. Its soft glow and floral aroma bring a touch of elegance and serenity to any space.",
    img: "/products/rose-bliss.png",
    lifestyle: "/products/rose-bliss.png",
    active: true,
  },
  {
    id: "flora-glow-candle-jar",
    name: "Flora Glow Candle Jar",
    scent: "Floral · Customizable",
    category: "The Jar Edit",
    price: 349,
    original_price: 399,
    description:
      "A beautifully handcrafted candle featuring an elegant floral design in a premium glass jar. Designed to bring warmth, charm and sophistication to any space. Flora Glow is perfect for home décor, gifting and relaxing self-care moments. Available in customizable colours and fragrances to match your style and mood.",
    img: "/products/flora-glow-candle-jar.png",
    lifestyle: "/products/flora-glow-candle-jar.png",
    active: true,
  },
  {
    id: "boho-bliss-tin-candle-set",
    name: "Boho Bliss Tin Candle Set",
    scent: "Boho · Customizable",
    category: "Elegant Essence",
    price: 299,
    description:
      "A vibrant pack of 2 decorative candles, customizable in your preferred fragrance and colour. Perfect for home décor, gifting, or cozy evenings.",
    img: "/products/boho-bliss-tin-candle-set.png",
    lifestyle: "/products/boho-bliss-tin-candle-set.png",
    active: true,
  },
  {
    id: "minimal-ribbed-pillar",
    name: "Minimal Ribbed Pillar",
    scent: "Minimal · Customizable",
    price: 199,
    original_price: 249,
    description:
      "Minimal ribbed pillar candles crafted to bring a soft, elegant aesthetic to your space. Perfect for bedside décor, gifting, cozy corners and luxury table styling. Handmade with a clean modern finish for a timeless look. Customisation of colours and fragrances available according to your choice.",
    img: "/products/minimal-ribbed-pillar.png",
    lifestyle: "/products/minimal-ribbed-pillar.png",
    active: true,
  },
];

function filter_catalog(products) {
  return products.filter(
    (product) => product.active !== false && !retired_product_ids.has(product.id)
  );
}

function merge_products(firestore_products) {
  const by_id = new Map(firestore_products.map((product) => [product.id, product]));

  for (const fallback of fallback_products) {
    if (!by_id.has(fallback.id)) {
      by_id.set(fallback.id, fallback);
    }
  }

  return Array.from(by_id.values())
    .filter((product) => !retired_product_ids.has(product.id))
    .sort((a, b) => (a.name || "").localeCompare(b.name || ""));
}

export async function fetch_products() {
  try {
    const snapshot = await getDocs(collection(db, "products"));
    const products = filter_catalog(
      snapshot.docs.map((item) => ({ id: item.id, ...item.data() }))
    );

    if (products.length > 0) {
      return merge_products(products);
    }

    return filter_catalog(fallback_products);
  } catch {
    return filter_catalog(fallback_products);
  }
}

export async function fetch_product_by_id(id) {
  if (retired_product_ids.has(id)) {
    return null;
  }

  try {
    const doc_ref = doc(db, "products", id);
    const snapshot = await getDoc(doc_ref);
    if (snapshot.exists()) {
      return { id: snapshot.id, ...snapshot.data() };
    }
  } catch {
    // fall through to local products
  }

  return (
    filter_catalog(fallback_products).find((product) => product.id === id) || null
  );
}
