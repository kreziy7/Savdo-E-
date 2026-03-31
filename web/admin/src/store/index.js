import {
  createContext,
  createElement,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";

const STORAGE_KEY = "savdo-admin-auth";

// All admins share the same permissions.
// isPrimary admin gets an extra permission: admins.manage
const BASE_PERMISSIONS = [
  "dashboard.view",
  "users.view", "users.create", "users.update", "users.delete",
  "content.view", "content.create", "content.update", "content.delete",
  "reports.view", "reports.export",
  "audit_logs.view",
  "settings.view", "settings.manage",
  "profile.view", "profile.update"
];

const PRIMARY_PERMISSIONS = [...BASE_PERMISSIONS, "admins.manage"];

function buildProfile(email, isPrimary) {
  const initials = email
    .split("@")[0]
    .slice(0, 2)
    .toUpperCase();

  return {
    id: isPrimary ? "ADM-001" : `ADM-${Date.now()}`,
    name: isPrimary ? "Bosh Admin" : "Admin",
    email: email || "admin@savdo.uz",
    role: "admin",
    isPrimary,
    avatar: initials,
    permissions: isPrimary ? PRIMARY_PERMISSIONS : BASE_PERMISSIONS,
    status: "active",
    lastLogin: { type: "today_at", time: new Date().toTimeString().slice(0, 5) }
  };
}

function getStoredAuth() {
  if (typeof window === "undefined") return null;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => getStoredAuth());

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (auth) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, [auth]);

  const value = useMemo(
    () => ({
      auth,
      profile: auth?.profile ?? null,
      isAuthenticated: Boolean(auth?.token),

      login: ({ email, password }) => {
        const normalizedEmail = email?.trim().toLowerCase();
        // Primary admin: admin@savdo.uz (demo) or any email marked as primary
        const isPrimary = normalizedEmail === "admin@savdo.uz";
        const profile = buildProfile(normalizedEmail, isPrimary);

        const nextAuth = {
          token: `demo-token-${Date.now()}`,
          refreshToken: `demo-refresh-${Date.now()}`,
          profile,
          passwordLength: password?.length ?? 0
        };

        setAuth(nextAuth);
        return nextAuth;
      },

      updateProfile: (changes) =>
        setAuth((curr) =>
          curr ? { ...curr, profile: { ...curr.profile, ...changes } } : curr
        ),

      logout: () => setAuth(null),

      hasPermission: (permission) =>
        Boolean(auth?.profile?.permissions?.includes(permission))
    }),
    [auth]
  );

  return createElement(AuthContext.Provider, { value }, children);
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
