import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetch_products } from "../../api/products";
import ProductPricing from "../../components/pricing/ProductPricing";
import ShopSkeleton from "../../components/shop/ShopSkeleton";
import EmptyState from "../../components/empty/EmptyState";
import { useProductSheet } from "../../context/ProductSheetContext";
import { useIsMobile } from "../../hooks/useIsMobile";
import "./Shop.css";

function ProductCard({ product }) {
  const [hovered, set_hovered] = useState(false);
  const { open_product_sheet } = useProductSheet();
  const is_mobile = useIsMobile();
  const navigate = useNavigate();

  const handle_click = () => {
    if (is_mobile) {
      open_product_sheet(product.id);
    } else {
      navigate(`/product/${product.id}`);
    }
  };

  return (
    <button
      type="button"
      className="sg-shop__card"
      onMouseEnter={() => set_hovered(true)}
      onMouseLeave={() => set_hovered(false)}
      onClick={handle_click}
    >
      <div className="sg-shop__card-media">
        {product.rating && (
          <span className="sg-shop__card-rating">
            <span className="sg-shop__card-rating-star">★</span>
            {Number(product.rating).toFixed(1)}
          </span>
        )}
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
          <ProductPricing
            price={product.price}
            original_price={product.original_price}
            compact
          />
        </div>
      </div>
    </button>
  );
}

function ShopSection({ embedded = false }) {
  const [products, set_products] = useState([]);
  const [loading, set_loading] = useState(true);
  const [search_query, set_search_query] = useState("");
  const { product_id } = useProductSheet();
  const sheet_open = Boolean(product_id);

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
                tabIndex={sheet_open ? -1 : 0}
                readOnly={sheet_open}
                aria-hidden={sheet_open}
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
          <ShopSkeleton count={embedded ? 4 : 8} />
        ) : filtered_products.length === 0 ? (
          <EmptyState
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-4-4" />
              </svg>
            }
            title={query ? "No matches found" : "No candles yet"}
            description={
              query
                ? "Try a different name or scent — like floral, woody, or amber."
                : "Our collection is being poured. Check back soon for new arrivals."
            }
            action_label={query ? "Clear search" : "Back to home"}
            action_to={query ? undefined : "/"}
            on_action={query ? () => set_search_query("") : undefined}
          />
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