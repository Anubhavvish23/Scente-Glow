import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "../hooks/useIsMobile";

const ProductSheetContext = createContext(null);

export function ProductSheetProvider({ children }) {
  const [product_id, set_product_id] = useState(null);
  const navigate = useNavigate();
  const is_mobile = useIsMobile();

  const open_product_sheet = useCallback((id) => {
    set_product_id(id);
  }, []);

  const close_product_sheet = useCallback(() => {
    set_product_id(null);
  }, []);

  const open_product = useCallback(
    (id) => {
      if (is_mobile) {
        open_product_sheet(id);
        return;
      }
      navigate(`/product/${id}`);
    },
    [is_mobile, navigate, open_product_sheet]
  );

  const value = useMemo(
    () => ({
      product_id,
      open_product_sheet,
      close_product_sheet,
      open_product,
    }),
    [product_id, open_product_sheet, close_product_sheet, open_product]
  );

  return (
    <ProductSheetContext.Provider value={value}>
      {children}
    </ProductSheetContext.Provider>
  );
}

export function useProductSheet() {
  const context = useContext(ProductSheetContext);
  if (!context) {
    throw new Error("useProductSheet must be used within ProductSheetProvider");
  }
  return context;
}
