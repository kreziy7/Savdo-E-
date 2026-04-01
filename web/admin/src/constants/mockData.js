// ─── Dashboard ────────────────────────────────────────────
export const notificationFeed = [
  {
    id: 1,
    titleKey: "dashboard.notificationFeed.newUsers",
    detailKey: "dashboard.notificationFeed.newUsersDetail",
    priority: "medium"
  },
  {
    id: 2,
    titleKey: "dashboard.notificationFeed.blockedAccounts",
    detailKey: "dashboard.notificationFeed.blockedAccountsDetail",
    priority: "high"
  },
  {
    id: 3,
    titleKey: "dashboard.notificationFeed.reportReady",
    detailKey: "dashboard.notificationFeed.reportReadyDetail",
    priority: "low"
  }
];

export const recentActivities = [
  {
    titleKey: "dashboard.recentActivityEntries.adminRightsGranted",
    detailKey: "dashboard.recentActivityEntries.adminRightsGrantedDetail",
    time: "10 daqiqa oldin",
    tone: "success"
  },
  {
    titleKey: "dashboard.recentActivityEntries.userBlocked",
    detailKey: "dashboard.recentActivityEntries.userBlockedDetail",
    time: "22 daqiqa oldin",
    tone: "danger"
  },
  {
    titleKey: "dashboard.recentActivityEntries.contentPublished",
    detailKey: "dashboard.recentActivityEntries.contentPublishedDetail",
    time: "1 soat oldin",
    tone: "info"
  }
];

// ─── Users ────────────────────────────────────────────────
export const users = [
  {
    id: "USR-1042",
    name: "Muhammadali Sodiqov",
    email: "muhammadali@savdo.uz",
    phone: "+998 90 100 22 11",
    role: "manager",
    status: "active",
    isAdmin: false,
    createdAt: "2026-03-14",
    lastLogin: "2026-03-27 08:11"
  },
  {
    id: "USR-1038",
    name: "Shahnoza Tursunova",
    email: "shahnoza@savdo.uz",
    phone: "+998 93 544 78 12",
    role: "editor",
    status: "pending",
    isAdmin: false,
    createdAt: "2026-03-12",
    lastLogin: null
  },
  {
    id: "USR-1030",
    name: "Akmal Gafurov",
    email: "akmal@savdo.uz",
    phone: "+998 91 881 09 09",
    role: "viewer",
    status: "blocked",
    isAdmin: false,
    createdAt: "2026-03-06",
    lastLogin: "2026-03-20 15:44"
  },
  {
    id: "USR-1016",
    name: "Maftuna Rasulova",
    email: "maftuna@savdo.uz",
    phone: "+998 99 450 01 19",
    role: "editor",
    status: "active",
    isAdmin: true,
    createdAt: "2026-02-26",
    lastLogin: "2026-03-27 09:02"
  }
];

// ─── Admins ───────────────────────────────────────────────
// isPrimary: true = bosh admin (faqat bitta)
// boshqa adminlar foydalanuvchilardan grant qilingan
export const admins = [
  {
    id: "ADM-001",
    name: "Bosh Admin",
    email: "admin@savdo.uz",
    isPrimary: true,
    status: "active",
    lastActive: "2026-03-30 09:00",
    createdBy: "Tizim"
  },
  {
    id: "ADM-016",
    name: "Maftuna Rasulova",
    email: "maftuna@savdo.uz",
    isPrimary: false,
    status: "active",
    lastActive: "2026-03-27 09:02",
    createdBy: "Bosh Admin",
    grantedFromUserId: "USR-1016"
  }
];

// ─── Content ──────────────────────────────────────────────
export const contentRows = [
  {
    id: "CNT-001",
    name: "Bahor aksiyasi",
    type: "landing_page",
    status: "published",
    owner: "Maftuna Rasulova",
    updatedAt: "2026-03-27 09:10"
  },
  {
    id: "CNT-002",
    name: "Yetkazib berish FAQ",
    type: "knowledge_base",
    status: "draft",
    owner: "Akmal Gafurov",
    updatedAt: "2026-03-26 18:44"
  },
  {
    id: "CNT-003",
    name: "Promo bannerlar",
    type: "media_asset",
    status: "archived",
    owner: "Muhammadali Sodiqov",
    updatedAt: "2026-03-24 13:06"
  }
];

// ─── Audit Logs ───────────────────────────────────────────
export const auditLogs = [
  {
    id: "LOG-001",
    action: "Admin huquqi berildi",
    category: "admin",
    actor: "Bosh Admin",
    target: "Maftuna Rasulova",
    ip: "10.10.4.25",
    timestamp: "2026-03-27 09:15"
  },
  {
    id: "LOG-002",
    action: "Foydalanuvchi bloklandi",
    category: "user",
    actor: "Bosh Admin",
    target: "USR-1030",
    ip: "10.10.4.42",
    timestamp: "2026-03-27 08:57"
  },
  {
    id: "LOG-003",
    action: "Kontent nashr etildi",
    category: "content",
    actor: "Maftuna Rasulova",
    target: "Bahor aksiyasi",
    ip: "10.10.9.90",
    timestamp: "2026-03-27 08:33"
  }
];

// ─── Roles ────────────────────────────────────────────────
export const roles = [
  {
    id: "role-super-admin",
    name: "super_admin",
    scopeKey: "seeds.roles.super_admin.scope",
    noteKey: "seeds.roles.super_admin.note",
    members: 1,
    isSystem: true
  },
  {
    id: "role-admin",
    name: "admin",
    scopeKey: "seeds.roles.admin.scope",
    noteKey: "seeds.roles.admin.note",
    members: 2,
    isSystem: true
  },
  {
    id: "role-editor",
    name: "editor",
    scopeKey: "seeds.roles.editor.scope",
    noteKey: "seeds.roles.editor.note",
    members: 1,
    isSystem: false
  },
  {
    id: "role-viewer",
    name: "viewer",
    scopeKey: "seeds.roles.viewer.scope",
    noteKey: "seeds.roles.viewer.note",
    members: 1,
    isSystem: false
  }
];

// ─── Permission Matrix ─────────────────────────────────────
// row = { module, super_admin: ["view",...], admin: [...], editor: [...], viewer: [...] }
export const permissionMatrix = [
  {
    module: "dashboard",
    super_admin: ["view"],
    admin: ["view"],
    editor: ["view"],
    viewer: ["view"]
  },
  {
    module: "users",
    super_admin: ["view", "create", "update", "delete", "export"],
    admin: ["view", "create", "update", "delete"],
    editor: ["view"],
    viewer: ["view"]
  },
  {
    module: "admins",
    super_admin: ["view", "create", "update", "delete", "manage"],
    admin: [],
    editor: [],
    viewer: []
  },
  {
    module: "roles",
    super_admin: ["view", "create", "update", "delete", "manage"],
    admin: ["view"],
    editor: [],
    viewer: []
  },
  {
    module: "permissions",
    super_admin: ["view", "manage"],
    admin: ["view"],
    editor: [],
    viewer: []
  },
  {
    module: "content",
    super_admin: ["view", "create", "update", "delete", "export"],
    admin: ["view", "create", "update", "delete"],
    editor: ["view", "create", "update"],
    viewer: ["view"]
  },
  {
    module: "reports",
    super_admin: ["view", "export"],
    admin: ["view", "export"],
    editor: ["view"],
    viewer: ["view"]
  },
  {
    module: "audit_logs",
    super_admin: ["view", "export"],
    admin: ["view"],
    editor: [],
    viewer: []
  },
  {
    module: "settings",
    super_admin: ["view", "update", "manage"],
    admin: ["view", "update"],
    editor: [],
    viewer: []
  }
];

// ─── Chart Data ───────────────────────────────────────────
export const weeklyUserStats = [
  { day: "Dush", users: 12, active: 9 },
  { day: "Sesh", users: 19, active: 14 },
  { day: "Chor", users: 8, active: 6 },
  { day: "Pay", users: 24, active: 18 },
  { day: "Juma", users: 31, active: 25 },
  { day: "Shan", users: 15, active: 11 },
  { day: "Yak", users: 7, active: 5 }
];

export const monthlyOrderStats = [
  { month: "Yan", orders: 45, revenue: 12500000 },
  { month: "Fev", orders: 62, revenue: 18200000 },
  { month: "Mar", orders: 58, revenue: 16800000 },
  { month: "Apr", orders: 71, revenue: 21000000 },
  { month: "May", orders: 84, revenue: 24500000 },
  { month: "Iyn", orders: 93, revenue: 28100000 }
];

// ─── Products ─────────────────────────────────────────────
export const products = [
  {
    id: "PRD-001",
    name: "iPhone 15 Pro",
    category: "Elektronika",
    price: 12999000,
    stock: 15,
    status: "active",
    sku: "APL-IP15P",
    createdAt: "2026-03-01"
  },
  {
    id: "PRD-002",
    name: "Samsung Galaxy S24",
    category: "Elektronika",
    price: 10500000,
    stock: 8,
    status: "active",
    sku: "SAM-S24",
    createdAt: "2026-03-05"
  },
  {
    id: "PRD-003",
    name: "AirPods Pro 2",
    category: "Aksessuarlar",
    price: 2990000,
    stock: 0,
    status: "inactive",
    sku: "APL-APP2",
    createdAt: "2026-02-20"
  },
  {
    id: "PRD-004",
    name: "MacBook Air M3",
    category: "Noutbuklar",
    price: 24500000,
    stock: 4,
    status: "active",
    sku: "APL-MBA-M3",
    createdAt: "2026-03-10"
  },
  {
    id: "PRD-005",
    name: "Xiaomi Redmi Note 13",
    category: "Elektronika",
    price: 3200000,
    stock: 22,
    status: "active",
    sku: "XMI-RN13",
    createdAt: "2026-03-15"
  }
];
