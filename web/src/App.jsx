import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';

import Layout from './components/layout/Layout';
import AdminLayout from './components/layout/AdminLayout';
import { ProtectedRoute, AdminRoute, GuestRoute } from './components/common/ProtectedRoute';

import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Wishlist from './pages/Wishlist';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminUsers from './pages/admin/AdminUsers';
import AdminOrders from './pages/admin/AdminOrders';

import PosLayout from './components/layout/PosLayout';
import PosDashboard from './pages/pos/PosDashboard';
import PosProducts from './pages/pos/PosProducts';
import PosSales from './pages/pos/PosSales';
import PosNewSale from './pages/pos/PosNewSale';
import PosReports from './pages/pos/PosReports';

import useThemeStore from './store/themeStore';
import useAuthStore from './store/authStore';

export default function App() {
  const applyTheme = useThemeStore((s) => s.applyTheme);
  const fetchMe = useAuthStore((s) => s.fetchMe);
  const user = useAuthStore((s) => s.user);
  const accessToken = useAuthStore((s) => s.accessToken);

  useEffect(() => {
    applyTheme();
  }, []);

  useEffect(() => {
    if (accessToken && !user) {
      fetchMe();
    }
  }, [accessToken]);

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: { borderRadius: '10px', fontSize: '14px' },
        }}
      />

      <Routes>
        {/* Public layout */}
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="products" element={<Products />} />
          <Route path="products/:slug" element={<ProductDetail />} />

          <Route path="login" element={
            <GuestRoute><Login /></GuestRoute>
          } />
          <Route path="register" element={
            <GuestRoute><Register /></GuestRoute>
          } />

          <Route path="cart" element={
            <ProtectedRoute><Cart /></ProtectedRoute>
          } />
          <Route path="checkout" element={
            <ProtectedRoute><Checkout /></ProtectedRoute>
          } />
          <Route path="profile" element={
            <ProtectedRoute><Profile /></ProtectedRoute>
          } />
          <Route path="wishlist" element={
            <ProtectedRoute><Wishlist /></ProtectedRoute>
          } />
        </Route>

        {/* Admin layout */}
        <Route path="admin" element={
          <AdminRoute><AdminLayout /></AdminRoute>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="orders" element={<AdminOrders />} />
        </Route>

        {/* POS layout */}
        <Route path="pos" element={
          <ProtectedRoute><PosLayout /></ProtectedRoute>
        }>
          <Route index element={<PosDashboard />} />
          <Route path="products" element={<PosProducts />} />
          <Route path="sales" element={<PosSales />} />
          <Route path="sales/new" element={<PosNewSale />} />
          <Route path="reports" element={<PosReports />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
