import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./pages/navbar/Navbar";
import AppRoutes from "./routes";
import CartDrawer from "./components/cart/CartDrawer";
import ProductSheet from "./components/product/ProductSheet";
import SaleBanner from "./components/banner/SaleBanner";
import ScrollToTop from "./components/ScrollToTop";
import AdminSecretGate from "./components/admin/AdminSecretGate";
import { AdminProvider } from "./context/AdminContext";
import { SiteSettingsProvider } from "./context/SiteSettingsContext";
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
  const location = useLocation();
  const is_admin_route = location.pathname.startsWith("/admin");

  useEffect(() => {
    legacy_storage_keys.forEach((key) => localStorage.removeItem(key));
  }, []);

  return (
    <ToastProvider>
      <SiteSettingsProvider>
        <AdminProvider>
          <SearchProvider>
            <CartProvider>
              <ProductSheetProvider>
                <ScrollToTop />
                <AdminSecretGate />
                {!is_admin_route && <SaleBanner />}
                {!is_admin_route && <Navbar />}
                <main className="sg-main">
                  <AppRoutes />
                </main>
                {!is_admin_route && <CartDrawer />}
                {!is_admin_route && <ProductSheet />}
              </ProductSheetProvider>
            </CartProvider>
          </SearchProvider>
        </AdminProvider>
      </SiteSettingsProvider>
    </ToastProvider>
  );
}

export default App;
