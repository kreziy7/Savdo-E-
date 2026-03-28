import {
  createContext,
  createElement,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";

const STORAGE_KEY = "savdo-admin-auth";

const rolePermissions = {
  admin: [
    "dashboard.view",
    "users.view",
    "users.create",
    "users.update",
    "content.view",
    "content.update",
    "reports.view",
    "settings.view",
    "profile.view"
  ],
  super_admin: [
    "dashboard.view",
    "users.view",
    "users.create",
    "users.update",
    "users.delete",
    "admins.manage",
    "roles.manage",
    "permissions.manage",
    "content.view",
    "content.update",
    "reports.view",
    "reports.export",
    "settings.view",
    "settings.manage",
    "audit_logs.view",
    "profile.view"
  ]
};

function buildProfile(role, email) {
  const isSuperAdmin = role === "super_admin";

  return {
    id: isSuperAdmin ? "sa-001" : "ad-014",
    name: isSuperAdmin ? "Super Admin" : "Admin",
    email,
    role,
    avatar: isSuperAdmin ? "SA" : "JQ",
    permissions: rolePermissions[role],
    status: "active",
    lastLogin: { type: "today_at", time: "09:24" },
    titleKey: isSuperAdmin ? "titles.platformSuperAdmin" : "titles.operationsAdmin"
  };
}

function getStoredAuth() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const storedValue = window.localStorage.getItem(STORAGE_KEY);
    return storedValue ? JSON.parse(storedValue) : null;
  } catch {
    return null;
  }
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => getStoredAuth());

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (auth) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
      return;
    }

    window.localStorage.removeItem(STORAGE_KEY);
  }, [auth]);

  const value = useMemo(
    () => ({
      auth,
      profile: auth?.profile ?? null,
      isAuthenticated: Boolean(auth?.token),
      login: ({ email, password, role }) => {
        const normalizedEmail = email?.trim().toLowerCase();
        const resolvedRole =
          role ?? (normalizedEmail?.includes("super") ? "super_admin" : "admin");

        const profile = buildProfile(
          resolvedRole,
          normalizedEmail || "admin@savdo.uz"
        );

        const nextAuth = {
          token: `demo-token-${resolvedRole}`,
          refreshToken: `demo-refresh-${resolvedRole}`,
          profile,
          passwordLength: password?.length ?? 0
        };

        setAuth(nextAuth);
        return nextAuth;
      },
      updateProfile: (changes) =>
        setAuth((current) =>
          current
            ? {
                ...current,
                profile: {
                  ...current.profile,
                  ...changes
                }
              }
            : current
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
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
