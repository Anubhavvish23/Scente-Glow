import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetch_products } from "../../api/products";
import ProductPricing from "../../components/pricing/ProductPricing";
import ShopSkeleton from "../../components/shop/ShopSkeleton";
import EmptyState from "../../components/empty/EmptyState";
import { useProductSheet } from "../../context/ProductSheetContext";
import { useSearch } from "../../context/SearchContext";
import { useIsMobile } from "../../hooks/useIsMobile";
import {
  collect_product_categories,
  get_product_category_label,
  product_matches_category,
} from "../../utils/product_categories";
import { get_product_images } from "../../utils/product";
import ProductHoverImages from "../../components/product/ProductHoverImages";
import "./Shop.css";

function ProductCard({ product }) {
  const { open_product_sheet } = useProductSheet();
  const is_mobile = useIsMobile();
  const navigate = useNavigate();
  const images = get_product_images(product);

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
      onClick={handle_click}
    >
      <ProductHoverImages
        images={images}
        alt={product.name}
        product={product}
        className="sg-hover-images--shop"
      />
      <div className="sg-shop__card-info">
        <div>
          <h3 className="sg-shop__card-name">{product.name}</h3>
          {get_product_category_label(product) && (
            <p className="sg-shop__card-category">{get_product_category_label(product)}</p>
          )}
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
  const products_per_page = 12;
  const [products, set_products] = useState([]);
  const [loading, set_loading] = useState(true);
  const [current_page, set_current_page] = useState(1);
  const [selected_category, set_selected_category] = useState("All");
  const {
    search_query,
    set_search_query,
    search_open,
    clear_search,
    focus_shop_search,
    clear_focus_shop_search,
  } = useSearch();
  const search_input_ref = useRef(null);
  const skip_page_scroll_ref = useRef(true);
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

    window.requestAnimationFrame(() => {
      search_input_ref.current?.focus();
      clear_focus_shop_search();
    });
  }, [embedded, focus_shop_search, search_open, clear_focus_shop_search]);

  const query = embedded ? "" : search_query.trim().toLowerCase();

  const categories = embedded ? [] : ["All", ...collect_product_categories(products)];

  const category_products =
    embedded || selected_category === "All"
      ? products
      : products.filter((product) => product_matches_category(product, selected_category));

  const filtered_products = query
    ? category_products.filter((product) => {
        const category_label = get_product_category_label(product).toLowerCase();
        const categories_text = (product.categories || []).join(" ").toLowerCase();

        return (
          product.name.toLowerCase().includes(query) ||
          (product.scent || "").toLowerCase().includes(query) ||
          category_label.includes(query) ||
          categories_text.includes(query) ||
          (product.description || "").toLowerCase().includes(query)
        );
      })
    : category_products;

  useEffect(() => {
    set_current_page(1);
  }, [query, selected_category]);

  useEffect(() => {
    if (embedded || skip_page_scroll_ref.current) {
      skip_page_scroll_ref.current = false;
      return;
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [current_page, embedded]);

  const total_pages = embedded
    ? 1
    : Math.max(1, Math.ceil(filtered_products.length / products_per_page));

  const page_start = embedded ? 0 : (current_page - 1) * products_per_page;
  const page_end = embedded ? limit : page_start + products_per_page;

  const displayed_products = embedded
    ? filtered_products.slice(0, limit)
    : filtered_products.slice(page_start, page_end);

  const handle_page_change = (next_page) => {
    set_current_page(next_page);
  };

  const handle_category_select = (category) => {
    set_selected_category(category);
    search_input_ref.current?.blur();
  };

  const handle_category_pointer_down = (event) => {
    event.preventDefault();
  };

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

          {categories.length > 1 && (
            <div className="sg-shop__categories">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  className={`sg-shop__category-btn ${
                    selected_category === category ? "sg-shop__category-btn--active" : ""
                  }`}
                  onMouseDown={handle_category_pointer_down}
                  onTouchStart={handle_category_pointer_down}
                  onClick={() => handle_category_select(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          )}
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
          <ShopSkeleton count={embedded ? 4 : products_per_page} />
        ) : filtered_products.length === 0 ? (
          <EmptyState
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-4-4" />
              </svg>
            }
            title={query || selected_category !== "All" ? "No matches found" : "No candles yet"}
            description={
              query || selected_category !== "All"
                ? "Try another category or clear your search to see more candles."
                : "Our collection is being poured. Check back soon for new arrivals."
            }
            action_label={query || selected_category !== "All" ? "Show all" : "Back to home"}
            action_to={query || selected_category !== "All" ? undefined : "/"}
            on_action={
              query || selected_category !== "All"
                ? () => {
                    clear_search();
                    set_selected_category("All");
                  }
                : undefined
            }
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
            {!embedded && total_pages > 1 && (
              <div className="sg-shop__pagination">
                <button
                  type="button"
                  className="sg-shop__pagination-btn"
                  disabled={current_page === 1}
                  onClick={() => handle_page_change(current_page - 1)}
                >
                  Previous
                </button>
                <span className="sg-shop__pagination-label">
                  Page {current_page} of {total_pages}
                </span>
                <button
                  type="button"
                  className="sg-shop__pagination-btn"
                  disabled={current_page === total_pages}
                  onClick={() => handle_page_change(current_page + 1)}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}

export default ShopSection;
