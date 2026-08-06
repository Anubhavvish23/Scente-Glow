import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  build_shop_categories,
  filter_shop_products,
  paginate_shop_products,
} from "../utils/shop_products";
import { useProductsCatalog } from "../context/ProductsCatalogContext";
import { useSiteSettings } from "../context/SiteSettingsContext";

const default_page_size = 12;

export function useShopCatalog({
  embedded = false,
  limit = 4,
  search_query = "",
  selected_category = "All",
  page_size = default_page_size,
}) {
  const { products, loading } = useProductsCatalog();
  const { categories: managed_categories } = useSiteSettings();
  const [current_page, set_current_page] = useState(1);
  const skip_page_scroll_ref = useRef(true);

  const categories = useMemo(
    () => build_shop_categories(products, embedded, managed_categories),
    [products, embedded, managed_categories]
  );

  const filtered_products = useMemo(
    () =>
      filter_shop_products(products, {
        query: search_query,
        selected_category,
        embedded,
      }),
    [products, search_query, selected_category, embedded]
  );

  useEffect(() => {
    set_current_page(1);
  }, [search_query, selected_category]);

  const pagination = useMemo(
    () =>
      paginate_shop_products(filtered_products, {
        page: current_page,
        page_size,
        embedded,
        limit,
      }),
    [filtered_products, current_page, page_size, embedded, limit]
  );

  useEffect(() => {
    if (embedded || skip_page_scroll_ref.current) {
      skip_page_scroll_ref.current = false;
      return;
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pagination.current_page, embedded]);

  const handle_page_change = useCallback((next_page) => {
    set_current_page(next_page);
  }, []);

  const reset_filters = useCallback(() => {
    set_current_page(1);
  }, []);

  return {
    products,
    loading,
    categories,
    filtered_products,
    displayed_products: pagination.items,
    current_page: pagination.current_page,
    total_pages: pagination.total_pages,
    handle_page_change,
    reset_filters,
    set_current_page,
  };
}
