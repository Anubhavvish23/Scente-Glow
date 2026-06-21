import { createContext, useContext, useState } from "react";

const ProductSheetContext = createContext(null);

export function ProductSheetProvider({ children }) {
  const [product_id, set_product_id] = useState(null);

  const open_product_sheet = (id) => set_product_id(id);
  const close_product_sheet = () => set_product_id(null);

  return (
    <ProductSheetContext.Provider
      value={{
        product_id,
        open_product_sheet,
        close_product_sheet,
      }}
    >
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
