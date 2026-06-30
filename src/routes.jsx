import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/home/Home";
import Shop from "./pages/shop/Shop";
import Product from "./pages/product/Product";
import About from "./pages/about/About";
import Contact from "./pages/contact";
import AdminRoute from "./components/admin/AdminRoute";
import Admin from "./pages/admin/Admin";
import AdminProductsList from "./pages/admin/AdminProductsList";
import AdminProductEdit from "./pages/admin/AdminProductEdit";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/product/:id" element={<Product />} />
      <Route path="/collections" element={<Navigate to="/shop" replace />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/admin" element={<AdminRoute />}>
        <Route index element={<Admin />} />
        <Route path="products" element={<AdminProductsList />} />
        <Route path="products/:id/edit" element={<AdminProductEdit />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
