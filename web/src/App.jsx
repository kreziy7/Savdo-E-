import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';

import AppLayout from './components/layout/AppLayout';
import { ProtectedRoute, GuestRoute } from './components/common/ProtectedRoute';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Sales from './pages/Sales';
import Reports from './pages/Reports';

import useAuthStore from './store/authStore';

export default function App() {
  const fetchMe = useAuthStore((s) => s.fetchMe);
  const accessToken = useAuthStore((s) => s.accessToken);
  const user = useAuthStore((s) => s.user);

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
          style: {
            borderRadius: '12px',
            fontSize: '15px',
            fontWeight: '500',
            padding: '12px 16px',
          },
        }}
      />

      <Routes>
        {/* Public routes */}
        <Route path="/login" element={
          <GuestRoute><Login /></GuestRoute>
        } />
        <Route path="/register" element={
          <GuestRoute><Register /></GuestRoute>
        } />

        {/* Protected app routes */}
        <Route element={
          <ProtectedRoute><AppLayout /></ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="sales" element={<Sales />} />
          <Route path="reports" element={<Reports />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
