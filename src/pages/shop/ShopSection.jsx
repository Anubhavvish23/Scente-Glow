import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetch_products } from "../../api/products";
import "./Shop.css";

function ProductCard({ product }) {
  const [hovered, set_hovered] = useState(false);

  return (
    <Link
      to={`/product/${product.id}`}
      className="sg-shop__card"
      onMouseEnter={() => set_hovered(true)}
      onMouseLeave={() => set_hovered(false)}
    >
      <div className="sg-shop__card-media">
        <img
          src={product.img}
          alt={product.name}
          className={`sg-shop__card-img ${hovered ? "sg-shop__card-img--hidden" : ""}`}
        />
        <img
          src={product.lifestyle}
          alt={`${product.name} lifestyle`}
          className={`sg-shop__card-img sg-shop__card-img--lifestyle ${hovered ? "sg-shop__card-img--visible" : ""}`}
        />
      </div>
      <div className="sg-shop__card-info">
        <div>
          <h3 className="sg-shop__card-name">{product.name}</h3>
          <p className="sg-shop__card-scent">{product.scent}</p>
        </div>
        <span className="sg-shop__card-price">${product.price}</span>
      </div>
    </Link>
  );
}

function ShopSection({ embedded = false }) {
  const [products, set_products] = useState([]);
  const [loading, set_loading] = useState(true);
  const [search_query, set_search_query] = useState("");

  useEffect(() => {
    fetch_products()
      .then((data) => {
        set_products(data);
        set_loading(false);
      })
      .catch(() => {
        set_loading(false);
      });
  }, []);

  const query = search_query.trim().toLowerCase();
  const filtered_products = query
    ? products.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          (product.scent || "").toLowerCase().includes(query)
      )
    : products;

  return (
    <div className={`sg-shop ${embedded ? "sg-shop--embedded" : ""}`} id="shop">
      <section
        className={`sg-shop__header ${embedded ? "sg-shop__header--embedded" : "sg-shop__header--with-search"}`}
      >
        {!embedded && (
          <div className="sg-shop__search-wrap">
            <label className="sg-shop__search" htmlFor="shop-search">
              <svg
                className="sg-shop__search-icon"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-4-4" />
              </svg>
              <input
                id="shop-search"
                type="search"
                className="sg-shop__search-input"
                placeholder="Search by name or scent..."
                value={search_query}
                onChange={(e) => set_search_query(e.target.value)}
              />
            </label>
          </div>
        )}

        <div className="sg-shop__header-inner">
          <p className="sg-shop__eyebrow"> Our Collection</p>
          <p className="sg-shop__title">Crafted with Love </p>
        </div>
      </section>

      <section className="sg-shop__grid-section">
        {loading ? (
          <div className="sg-shop__loading">
            <div className="sg-shop__spinner" />
          </div>
        ) : filtered_products.length === 0 ? (
          <p className="sg-shop__empty">
            {query ? "No candles match your search." : "No candles available yet. Check back soon."}
          </p>
        ) : (
          <div className="sg-shop__grid">
            {filtered_products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default ShopSection;
