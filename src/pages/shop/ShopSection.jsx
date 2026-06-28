import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetch_products } from "../../api/products";
import ProductPricing from "../../components/pricing/ProductPricing";
import ShopSkeleton from "../../components/shop/ShopSkeleton";
import EmptyState from "../../components/empty/EmptyState";
import { useProductSheet } from "../../context/ProductSheetContext";
import { useSearch } from "../../context/SearchContext";
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

function ShopSection({ embedded = false, limit = 4 }) {
  const [products, set_products] = useState([]);
  const [loading, set_loading] = useState(true);
  const {
    search_query,
    set_search_query,
    search_open,
    clear_search,
    focus_shop_search,
    clear_focus_shop_search,
  } = useSearch();
  const search_input_ref = useRef(null);
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

  useEffect(() => {
    if (embedded || !focus_shop_search || !search_open) return;

    window.scrollTo(0, 0);
    window.requestAnimationFrame(() => {
      search_input_ref.current?.focus();
      clear_focus_shop_search();
    });
  }, [embedded, focus_shop_search, search_open, clear_focus_shop_search]);

  const query = embedded ? "" : search_query.trim().toLowerCase();
  const filtered_products = query
    ? products.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          (product.scent || "").toLowerCase().includes(query)
      )
    : products;

  const displayed_products = embedded
    ? filtered_products.slice(0, limit)
    : filtered_products;

  return (
    <div className={`sg-shop ${embedded ? "sg-shop--embedded" : ""}`} id="shop">
      {!embedded && (
        <section className="sg-shop__header">
          <div
            className={`sg-shop__search-wrap ${search_open ? "sg-shop__search-wrap--visible" : ""}`}
            aria-hidden={!search_open}
          >
            <label className="sg-shop__search" htmlFor="shop-search">
              <svg
                className="sg-shop__search-icon"
                aria-hidden="true"
                viewBox="0 0 24 24"
              >
                <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z" />
              </svg>
              <input
                ref={search_input_ref}
                id="shop-search"
                type="search"
                className="sg-shop__search-input"
                placeholder="Search by name or scent..."
                value={search_query}
                onChange={(e) => set_search_query(e.target.value)}
                tabIndex={search_open && !sheet_open ? 0 : -1}
                readOnly={sheet_open}
              />
            </label>
          </div>

          <div className="sg-shop__header-inner">
            <p className="sg-shop__eyebrow">Our Collection</p>
          </div>
        </section>
      )}

      {embedded && (
        <section className="sg-shop__header sg-shop__header--embedded">
          <div className="sg-shop__header-inner">
            <p className="sg-shop__title">Our Collection</p>
          </div>
        </section>
      )}

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
            on_action={query ? clear_search : undefined}
          />
        ) : (
          <>
            <div className="sg-shop__grid">
              {displayed_products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            {embedded && displayed_products.length > 0 && (
              <div className="sg-shop__view-all-wrap">
                <Link to="/collections" className="sg-shop__view-all">
                  View All
                </Link>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}

export default ShopSection;
