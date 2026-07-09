import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { fetch_products } from "../api/products";

const ProductsCatalogContext = createContext(null);

export function ProductsCatalogProvider({ children }) {
  const [products, set_products] = useState([]);
  const [loading, set_loading] = useState(true);
  const inflight_ref = useRef(null);
  const products_ref = useRef(products);

  products_ref.current = products;

  const load_products = useCallback(async (force = false) => {
    if (!force && products_ref.current.length > 0) {
      return products_ref.current;
    }

    if (inflight_ref.current) {
      return inflight_ref.current;
    }

    set_loading(true);

    const request = fetch_products()
      .then((data) => {
        set_products(data);
        set_loading(false);
        inflight_ref.current = null;
        return data;
      })
      .catch(() => {
        set_loading(false);
        inflight_ref.current = null;
        return [];
      });

    inflight_ref.current = request;
    return request;
  }, []);

  useEffect(() => {
    load_products();
  }, [load_products]);

  const refresh_products = useCallback(async () => {
    inflight_ref.current = null;
    return load_products(true);
  }, [load_products]);

  const value = useMemo(
    () => ({
      products,
      loading,
      load_products,
      refresh_products,
    }),
    [products, loading, load_products, refresh_products]
  );

  return (
    <ProductsCatalogContext.Provider value={value}>
      {children}
    </ProductsCatalogContext.Provider>
  );
}

export function useProductsCatalog() {
  const context = useContext(ProductsCatalogContext);
  if (!context) {
    throw new Error("useProductsCatalog must be used within ProductsCatalogProvider");
  }
  return context;
}
