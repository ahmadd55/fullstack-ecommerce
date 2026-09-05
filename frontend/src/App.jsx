import { Routes, Route } from "react-router-dom";
import Layout from "./layout/Layout";
import DashboardLayout from "./layout/DashboardLayout";
import Home from "./pages/Home";
import Detail from "./pages/Detail";
import Login from "./pages/Login";
import Checkout from "./pages/Checkout";
import Cart from "./pages/Cart";
import { ProductProvider } from "./contexts/ProductContext";

import DashboardHome from "./pages/dashboard/DashboardHome";
import CategoryManager from "./pages/dashboard/CategoryManager";
import SubCategoryManager from "./pages/dashboard/SubCategoryManager";
import ProductManager from "./pages/dashboard/ProductManager";
import AdminLogin from "./pages/dashboard/AdminLogin";
import OrderManager from "./pages/dashboard/OrderManager";
import UserManager from "./pages/dashboard/UserManager";
import CategoryPage from "./pages/CategoryPage";
import UserProfile from "./pages/UserProfile";

import AdminRoute from "./components/AdminRoute";
import UserRoute from "./components/UserRoute";

export default function App() {
  return (
    <ProductProvider>
      <Routes>
        <Route element={<Layout />}>
          
          <Route path="/" element={<Home />} />
          <Route path="/detail/:id" element={<Detail />} />
          <Route path="/category/:id" element={<CategoryPage />} />

          <Route element={<UserRoute />}>
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/profile" element={<UserProfile />} />
          </Route>
        </Route>

        <Route path="/login" element={<Login />} />

        <Route path="/admin/login" element={<AdminLogin />} />

        <Route element={<AdminRoute />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="categories" element={<CategoryManager />} />
            <Route path="subcategories" element={<SubCategoryManager />} />
            <Route path="products" element={<ProductManager />} />
            <Route path="orders" element={<OrderManager />} />
            <Route path="users" element={<UserManager />} />
          </Route>
        </Route>
      </Routes>
    </ProductProvider>
  );
}
