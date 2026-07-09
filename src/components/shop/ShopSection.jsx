import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import ShopSkeleton from "./ShopSkeleton";
import ProductCard from "./ProductCard";
import EmptyState from "../empty/EmptyState";
import { useProductSheet } from "../../context/ProductSheetContext";
import { useSearch } from "../../context/SearchContext";
import { useShopCatalog } from "../../hooks/useShopCatalog";
import "../../pages/shop/Shop.css";

function ShopSection({ embedded = false, limit = 4 }) {
  const products_per_page = 12;
  const { open_product, product_id } = useProductSheet();
  const sheet_open = Boolean(product_id);
  const {
    search_query,
    set_search_query,
    search_open,
    clear_search,
    focus_shop_search,
    clear_focus_shop_search,
  } = useSearch();
  const search_input_ref = useRef(null);
  const [selected_category, set_selected_category] = useState("All");

  const {
    loading,
    categories,
    filtered_products,
    displayed_products,
    current_page,
    total_pages,
    handle_page_change,
    reset_filters,
  } = useShopCatalog({
    embedded,
    limit,
    search_query,
    selected_category,
    page_size: products_per_page,
  });

  useEffect(() => {
    if (embedded || !focus_shop_search || !search_open) return;

    window.requestAnimationFrame(() => {
      search_input_ref.current?.focus();
      clear_focus_shop_search();
    });
  }, [embedded, focus_shop_search, search_open, clear_focus_shop_search]);

  const handle_open_product = useCallback(
    (product_id_to_open) => {
      open_product(product_id_to_open);
    },
    [open_product]
  );

  const handle_category_select = useCallback((category) => {
    set_selected_category(category);
    search_input_ref.current?.blur();
  }, []);

  const handle_category_pointer_down = useCallback((event) => {
    event.preventDefault();
  }, []);

  const handle_clear_filters = useCallback(() => {
    clear_search();
    set_selected_category("All");
    reset_filters();
  }, [clear_search, reset_filters]);

  const has_active_filters = Boolean(search_query.trim()) || selected_category !== "All";

  return (
    <div className={`sg-shop ${embedded ? "sg-shop--embedded" : ""}`} id="shop">
      {!embedded && (
        <section className="sg-shop__header">
          <div
            className={`sg-shop__search-wrap ${search_open ? "sg-shop__search-wrap--visible" : ""}`}
            aria-hidden={!search_open}
          >
            <label className="sg-shop__search" htmlFor="shop-search">
              <svg className="sg-shop__search-icon" aria-hidden="true" viewBox="0 0 24 24">
                <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z" />
              </svg>
              <input
                ref={search_input_ref}
                id="shop-search"
                type="search"
                className="sg-shop__search-input"
                placeholder="Search by name or scent..."
                value={search_query}
                onChange={(event) => set_search_query(event.target.value)}
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
            title={has_active_filters ? "No matches found" : "No candles yet"}
            description={
              has_active_filters
                ? "Try another category or clear your search to see more candles."
                : "Our collection is being poured. Check back soon for new arrivals."
            }
            action_label={has_active_filters ? "Show all" : "Back to home"}
            action_to={has_active_filters ? undefined : "/"}
            on_action={has_active_filters ? handle_clear_filters : undefined}
          />
        ) : (
          <>
            <div className="sg-shop__grid">
              {displayed_products.map((product) => (
                <ProductCard key={product.id} product={product} on_open={handle_open_product} />
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
