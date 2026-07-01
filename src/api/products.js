import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { normalize_image_links } from "../utils/google_drive";
import { sort_products_for_display } from "../utils/product_sort";
import { admin_rows_to_bulk_packs } from "../utils/admin_bulk_packs";
import { normalize_colours } from "../utils/colours";

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
    name: "Heart Glow Tealights || 15gm",
    scent: "Romantic · Customizable",
    category: "Glow Minis",
    price: 320,
    original_price: 352,
    weight: "15gm",
    burn_time: "60 mins",
    description:
      "Tiny hearts. Timeless glow.\n\nDesigned to add warmth, beauty and a touch of love to every space, these handcrafted tealights create an ambience that's both cozy and unforgettable.",
    details_heading: "Why You'll Love It",
    details: [
      "❤️ Heart-shaped elegance",
      "✨ Clean-burning premium wax",
      "♻️ Reusable polycarbonate cups",
      "🏡 Beautiful for any setting",
      "🎁 Made for gifting & celebrating",
    ],
    bulk_packs: [
      {
        id: "pack-10",
        label: "Pack of 10",
        size: 10,
        price: 320,
        original_price: 352,
      },
      {
        id: "pack-25",
        label: "Pack of 25",
        size: 25,
        price: 755,
        original_price: 830,
      },
      {
        id: "pack-50",
        label: "Pack of 50",
        size: 50,
        price: 1458,
        original_price: 1602,
      },
    ],
    img: "/products/heart-glow-tealights.png",
    lifestyle: "/products/heart-glow-tealights-size.png",
    images: [
      "/products/heart-glow-tealights.png",
      "/products/heart-glow-tealights-size.png",
    ],
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
    name: "Heart Whisper Candles || 15gm",
    scent: "Personalized · Customizable",
    category: "Glow Minis",
    price: 36,
    original_price: 45,
    weight: "15gm",
    burn_time: "45–60 mins",
    description:
      "Every heart has a story. Let yours glow.\n\nOur Heart Whisper Candles are thoughtfully handcrafted to turn meaningful moments into lasting memories. Featuring a delicate heart-shaped design with a personalized initial, each candle is more than décor it's a heartfelt keepsake made to celebrate love, friendship and the people who matter most.\n\nWhether it's a single initial, a name or a special word, Heart Whisper candles add a warm, elegant touch to every celebration and every corner of your home.",
    details_heading: "Why You'll Love It",
    details: [
      "♡ Personalized with your chosen initial",
      "♡ Hand-poured with premium wax",
      "♡ Elegant heart-shaped design",
      "♡ Perfect for home décor and special occasions",
      "♡ Crafted with love, one piece at a time",
    ],
    img: "/products/heart-whisper-candles.png",
    lifestyle: "/products/heart-whisper-candles-lifestyle.png",
    images: [
      "/products/heart-whisper-candles.png",
      "/products/heart-whisper-candles-lifestyle.png",
      "/products/heart-whisper-candles-size.png",
    ],
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

  return sort_products_for_display(
    Array.from(by_id.values()).filter((product) => !retired_product_ids.has(product.id))
  );
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

    return sort_products_for_display(filter_catalog(fallback_products));
  } catch {
    return sort_products_for_display(filter_catalog(fallback_products));
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

function slugify_product_id(name) {
  return String(name || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parse_details_text(details_text) {
  return String(details_text || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function validate_product_input(product_input) {
  if (!product_input.name?.trim()) {
    throw new Error("Product title is required.");
  }

  const categories = Array.isArray(product_input.categories)
    ? product_input.categories.filter(Boolean)
    : [];

  if (categories.length === 0) {
    throw new Error("Select at least one category.");
  }

  const price = Number(product_input.price);
  if (!Number.isFinite(price) || price < 0) {
    throw new Error("Enter a valid price.");
  }

  return { categories, price };
}

function build_product_payload(product_input) {
  const { categories, price } = validate_product_input(product_input);
  const images = normalize_image_links(product_input.image_links);
  const details = parse_details_text(product_input.details_text);
  const original_price_raw = product_input.original_price;
  const original_price =
    original_price_raw === "" || original_price_raw == null
      ? undefined
      : Number(original_price_raw);

  const rating_raw = product_input.rating;
  let rating = null;
  if (rating_raw !== "" && rating_raw != null) {
    const parsed_rating = Number(rating_raw);
    if (Number.isFinite(parsed_rating) && parsed_rating > 0 && parsed_rating <= 5) {
      rating = Math.round(parsed_rating * 10) / 10;
    }
  }

  const payload = {
    name: product_input.name.trim(),
    scent: product_input.scent?.trim() || "Hand-poured · Scenté Glow",
    description: product_input.description?.trim() || "",
    price,
    categories,
    category: categories[0],
    images,
    img: images[0] || "",
    lifestyle: images[1] || images[0] || "",
    weight: product_input.weight?.trim() || "",
    burn_time: product_input.burn_time?.trim() || "",
    details_heading: product_input.details_heading?.trim() || "",
    details,
    rating,
    featured: Boolean(product_input.featured),
    sold_out: Boolean(product_input.sold_out),
    active: product_input.active !== false,
    updated_at: Date.now(),
  };

  if (original_price != null && Number.isFinite(original_price) && original_price > price) {
    payload.original_price = original_price;
  }

  if (product_input.packages_visible) {
    payload.bulk_packs = admin_rows_to_bulk_packs(product_input.pack_rows);
  }

  if (product_input.colours_enabled) {
    payload.custom_colours = normalize_colours(product_input.custom_colours);
  } else {
    payload.custom_colours = [];
  }

  return payload;
}

export async function create_product(product_input) {
  const product_id = slugify_product_id(product_input.name);

  if (!product_id) {
    throw new Error("Could not create a product id from this title.");
  }

  const existing = await getDoc(doc(db, "products", product_id));
  if (existing.exists()) {
    throw new Error("A product with this title already exists.");
  }

  const payload = build_product_payload(product_input);
  await setDoc(doc(db, "products", product_id), payload, { merge: false });
  return { id: product_id, ...payload };
}

export async function update_product(product_id, product_input) {
  if (!product_id) {
    throw new Error("Product not found.");
  }

  const payload = build_product_payload(product_input);
  await setDoc(doc(db, "products", product_id), payload, { merge: true });
  return { id: product_id, ...payload };
}

export async function delete_product(product_id) {
  if (!product_id) {
    throw new Error("Product not found.");
  }

  await setDoc(
    doc(db, "products", product_id),
    { active: false, updated_at: Date.now() },
    { merge: true }
  );
}
