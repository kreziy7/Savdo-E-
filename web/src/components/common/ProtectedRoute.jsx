import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

export function ProtectedRoute({ children }) {
  const user = useAuthStore((s) => s.user);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

export function AdminRoute({ children }) {
  const user = useAuthStore((s) => s.user);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (!['ADMIN', 'SUPER_ADMIN'].includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  return children;
}

export function GuestRoute({ children }) {
  const user = useAuthStore((s) => s.user);
  if (user) return <Navigate to="/" replace />;
  return children;
}
