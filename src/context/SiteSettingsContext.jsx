import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  fetch_categories,
  fetch_fragrances,
  fetch_sale_banner_settings,
  save_categories,
  save_fragrances,
  save_sale_banner_settings,
} from "../api/site_settings";
import {
  build_coupon_map,
  build_sale_banner_message,
  default_sale_banner_settings,
} from "../utils/coupons";
import { default_fragrances } from "../utils/fragrances";
import { default_product_categories } from "../utils/product_categories";

const SiteSettingsContext = createContext(null);

export function SiteSettingsProvider({ children }) {
  const [sale_banner_settings, set_sale_banner_settings] = useState(
    default_sale_banner_settings
  );
  const [fragrances, set_fragrances] = useState(default_fragrances);
  const [categories, set_categories] = useState(default_product_categories);
  const [loading, set_loading] = useState(true);

  useEffect(() => {
    let active = true;

    Promise.all([
      fetch_sale_banner_settings(),
      fetch_fragrances(),
      fetch_categories(),
    ])
      .then(([banner_settings, fragrance_items, category_items]) => {
        if (active) {
          set_sale_banner_settings(banner_settings);
          set_fragrances(fragrance_items);
          set_categories(category_items);
          set_loading(false);
        }
      })
      .catch(() => {
        if (active) {
          set_loading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const coupon_map = useMemo(
    () => build_coupon_map(sale_banner_settings),
    [sale_banner_settings]
  );

  const sale_banner_message = useMemo(
    () =>
      build_sale_banner_message(
        sale_banner_settings.code,
        sale_banner_settings.percent
      ),
    [sale_banner_settings]
  );

  const update_sale_banner = useCallback(async (next_settings) => {
    const saved = await save_sale_banner_settings(next_settings);
    set_sale_banner_settings(saved);
    return saved;
  }, []);

  const update_fragrances = useCallback(async (items) => {
    const saved = await save_fragrances(items);
    set_fragrances(saved);
    return saved;
  }, []);

  const update_categories = useCallback(async (items) => {
    const saved = await save_categories(items);
    set_categories(saved);
    return saved;
  }, []);

  const value = useMemo(
    () => ({
      loading,
      sale_banner_settings,
      sale_banner_message,
      coupon_map,
      fragrances,
      categories,
      update_sale_banner,
      update_fragrances,
      update_categories,
    }),
    [
      loading,
      sale_banner_settings,
      sale_banner_message,
      coupon_map,
      fragrances,
      categories,
      update_sale_banner,
      update_fragrances,
      update_categories,
    ]
  );

  return (
    <SiteSettingsContext.Provider value={value}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  const context = useContext(SiteSettingsContext);
  if (!context) {
    throw new Error("useSiteSettings must be used within SiteSettingsProvider");
  }
  return context;
}
