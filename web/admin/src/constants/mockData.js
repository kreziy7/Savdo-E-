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
