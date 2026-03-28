import { Navigate } from "react-router-dom";
import { useAuth } from "../../store";

export function RoleGuard({ allow, children }) {
  const { profile } = useAuth();

  if (!profile || !allow.includes(profile.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
