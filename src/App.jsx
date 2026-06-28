import { useEffect } from "react";
import Navbar from "./pages/navbar/Navbar";
import AppRoutes from "./routes";
import CartDrawer from "./components/cart/CartDrawer";
import ProductSheet from "./components/product/ProductSheet";
import SaleBanner from "./components/banner/SaleBanner";
import ScrollToTop from "./components/ScrollToTop";
import { CartProvider } from "./context/CartContext";
import { SearchProvider } from "./context/SearchContext";
import { ProductSheetProvider } from "./context/ProductSheetContext";
import { ToastProvider } from "./context/ToastContext";

const legacy_storage_keys = [
  "scenteglow_cart",
  "scenteglow_coupon",
  "scenteglow_sale_banner_dismissed",
];

function App() {
  useEffect(() => {
    legacy_storage_keys.forEach((key) => localStorage.removeItem(key));
  }, []);

  return (
    <ToastProvider>
      <SearchProvider>
        <CartProvider>
          <ProductSheetProvider>
            <ScrollToTop />
            <SaleBanner />
            <Navbar />
            <main className="sg-main">
              <AppRoutes />
            </main>
            <CartDrawer />
            <ProductSheet />
          </ProductSheetProvider>
        </CartProvider>
      </SearchProvider>
    </ToastProvider>
  );
}

export default App;
