import { Navigate } from "react-router-dom";
import { useAuth } from "../../store";

/**
 * PrimaryGuard — faqat isPrimary admin kirishi mumkin bo'lgan sahifalar uchun
 * RoleGuard nomini saqladik, lekin endi isPrimary tekshiriladi
 */
export function RoleGuard({ children }) {
  const { profile } = useAuth();

  if (!profile?.isPrimary) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
