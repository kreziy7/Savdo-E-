const sidebarMenu = [
  {
    key: "dashboard",
    path: "/dashboard",
    roles: ["admin", "super_admin"]
  },
  {
    key: "users",
    path: "/users",
    roles: ["admin", "super_admin"]
  },
  {
    key: "admins",
    path: "/admins",
    roles: ["super_admin"]
  },
  {
    key: "roles",
    path: "/roles",
    roles: ["super_admin"]
  },
  {
    key: "permissions",
    path: "/permissions",
    roles: ["super_admin"]
  },
  {
    key: "content",
    path: "/content",
    roles: ["admin", "super_admin"]
  },
  {
    key: "reports",
    path: "/reports",
    roles: ["admin", "super_admin"]
  },
  {
    key: "auditLogs",
    path: "/audit-logs",
    roles: ["super_admin"]
  },
  {
    key: "settings",
    path: "/settings",
    roles: ["admin", "super_admin"]
  },
  {
    key: "profile",
    path: "/profile",
    roles: ["admin", "super_admin"]
  }
];

export function getMenuForRole(role, t) {
  return sidebarMenu
    .filter((item) => item.roles.includes(role))
    .map((item) => ({
      ...item,
      label: t(`navigation.menu.${item.key}.label`),
      description: t(`navigation.menu.${item.key}.description`)
    }));
}
