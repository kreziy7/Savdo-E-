// Sidebar menu — icon names are used in Sidebar component (Heroicons style keys)
const sidebarMenu = [
  { key: "dashboard", path: "/dashboard", icon: "home",     label: "Dashboard",      desc: "Umumiy ko'rinish" },
  { key: "users",     path: "/users",     icon: "users",    label: "Foydalanuvchilar", desc: "Boshqarish va filtr" },
  { key: "content",   path: "/content",   icon: "document", label: "Kontent",         desc: "Sahifalar va media" },
  { key: "reports",   path: "/reports",   icon: "chart",    label: "Hisobotlar",      desc: "Statistika" },
  { key: "auditLogs", path: "/audit-logs",icon: "shield",   label: "Audit logi",      desc: "Barcha harakatlar" },
  { key: "settings",  path: "/settings",  icon: "cog",      label: "Sozlamalar",      desc: "Profil va xavfsizlik" },
  { key: "profile",   path: "/profile",   icon: "user",     label: "Profil",          desc: "Mening akkauntim" }
];

// Admins page — only shown to isPrimary admin
const primaryOnlyMenu = [
  { key: "admins", path: "/admins", icon: "key", label: "Adminlar", desc: "Admin huquqlari" }
];

export function getMenuForProfile(profile) {
  const base = sidebarMenu;
  if (profile?.isPrimary) {
    // Insert admins after users
    return [
      ...base.slice(0, 2),
      ...primaryOnlyMenu,
      ...base.slice(2)
    ];
  }
  return base;
}
