import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AdminLayout } from "../layouts/AdminLayout";
import { LoginPage } from "../pages/auth/LoginPage";
import { CustomersPage } from "../pages/customers/CustomersPage";
import { DashboardPage } from "../pages/dashboard/DashboardPage";
import { NotFoundPage } from "../pages/not-found/NotFoundPage";
import { OrdersPage } from "../pages/orders/OrdersPage";
import { ProductsPage } from "../pages/products/ProductsPage";
import { SettingsPage } from "../pages/settings/SettingsPage";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<AdminLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/customers" element={<CustomersPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
