import { useEffect, useState } from "react";
import { fetch_product_by_id } from "../api/products";
import { track_product_view } from "../api/stats";

export function useProductDetail(product_id, { enabled = true } = {}) {
  const [product, set_product] = useState(null);
  const [loading, set_loading] = useState(Boolean(enabled && product_id));
  const [selected_fragrance, set_selected_fragrance] = useState("");
  const [customization, set_customization] = useState(null);
  const [selected_bulk_pack, set_selected_bulk_pack] = useState(null);

  useEffect(() => {
    if (!enabled || !product_id) {
      set_product(null);
      set_loading(false);
      return undefined;
    }

    let active = true;

    set_selected_fragrance("");
    set_customization(null);
    set_selected_bulk_pack(null);
    set_loading(true);

    fetch_product_by_id(product_id)
      .then((data) => {
        if (!active) {
          return;
        }
        set_product(data);
        if (data?.id) {
          track_product_view(data.id);
        }
        set_loading(false);
      })
      .catch(() => {
        if (active) {
          set_loading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [product_id, enabled]);

  return {
    product,
    loading,
    selected_fragrance,
    set_selected_fragrance,
    customization,
    set_customization,
    selected_bulk_pack,
    set_selected_bulk_pack,
  };
}
