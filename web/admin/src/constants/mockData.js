export const dashboardHighlights = [
  {
    id: "permission-rollout",
    titleKey: "seeds.dashboardHighlights.permissionRollout.title",
    descriptionKey: "seeds.dashboardHighlights.permissionRollout.description"
  },
  {
    id: "api-readiness",
    titleKey: "seeds.dashboardHighlights.apiReadiness.title",
    descriptionKey: "seeds.dashboardHighlights.apiReadiness.description"
  },
  {
    id: "mvp-scope",
    titleKey: "seeds.dashboardHighlights.mvpScope.title",
    descriptionKey: "seeds.dashboardHighlights.mvpScope.description"
  }
];

export const recentActivities = [
  {
    titleKey: "seeds.activities.adminRoleUpdated.title",
    detailKey: "seeds.activities.adminRoleUpdated.detail",
    detailValues: { name: "Madina Ergasheva" },
    time: { type: "minutes_ago", count: 10 },
    tone: "info"
  },
  {
    titleKey: "seeds.activities.userBlocked.title",
    detailKey: "seeds.activities.userBlocked.detail",
    time: { type: "minutes_ago", count: 22 },
    tone: "danger"
  },
  {
    titleKey: "seeds.activities.reportExported.title",
    detailKey: "seeds.activities.reportExported.detail",
    time: { type: "minutes_ago", count: 48 },
    tone: "success"
  }
];

export const notificationFeed = [
  {
    titleKey: "seeds.notifications.twoFaPending.title",
    detailKey: "seeds.notifications.twoFaPending.detail",
    priority: "medium"
  },
  {
    titleKey: "seeds.notifications.singleton.title",
    detailKey: "seeds.notifications.singleton.detail",
    priority: "high"
  },
  {
    titleKey: "seeds.notifications.auditExport.title",
    detailKey: "seeds.notifications.auditExport.detail",
    priority: "low"
  }
];

export const users = [
  {
    id: "USR-1042",
    name: "Muhammadali Sodiqov",
    email: "muhammadali@savdo.uz",
    phone: "+998 90 100 22 11",
    role: "customer_support",
    status: "active",
    createdAt: "2026-03-14",
    lastLogin: "2026-03-27 08:11"
  },
  {
    id: "USR-1038",
    name: "Shahnoza Tursunova",
    email: "shahnoza@savdo.uz",
    phone: "+998 93 544 78 12",
    role: "manager",
    status: "pending",
    createdAt: "2026-03-12",
    lastLogin: { type: "never" }
  },
  {
    id: "USR-1030",
    name: "Akmal Gafurov",
    email: "akmal@savdo.uz",
    phone: "+998 91 881 09 09",
    role: "editor",
    status: "blocked",
    createdAt: "2026-03-06",
    lastLogin: "2026-03-20 15:44"
  },
  {
    id: "USR-1016",
    name: "Maftuna Rasulova",
    email: "maftuna@savdo.uz",
    phone: "+998 99 450 01 19",
    role: "viewer",
    status: "active",
    createdAt: "2026-02-26",
    lastLogin: "2026-03-27 09:02"
  }
];

export const admins = [
  {
    id: "ADM-001",
    name: "Sevara Alimuhamedova",
    email: "superadmin@savdo.uz",
    role: "super_admin",
    permissionsKey: "full_access",
    status: "active",
    lastActive: { type: "just_now" },
    createdBy: { type: "system" }
  },
  {
    id: "ADM-014",
    name: "Javohir Qodirov",
    email: "admin@savdo.uz",
    role: "admin",
    permissionsKey: "users_content_reports",
    status: "active",
    lastActive: { type: "minutes_ago", count: 8 },
    createdBy: "Sevara Alimuhamedova"
  },
  {
    id: "ADM-018",
    name: "Malika Usmonova",
    email: "support.admin@savdo.uz",
    role: "support",
    permissionsKey: "users_view_reports_view",
    status: "invited",
    lastActive: { type: "pending_invite" },
    createdBy: "Sevara Alimuhamedova"
  }
];

export const roles = [
  {
    name: "super_admin",
    members: 1,
    scopeKey: "seeds.roles.super_admin.scope",
    noteKey: "seeds.roles.super_admin.note"
  },
  {
    name: "admin",
    members: 8,
    scopeKey: "seeds.roles.admin.scope",
    noteKey: "seeds.roles.admin.note"
  },
  {
    name: "editor",
    members: 14,
    scopeKey: "seeds.roles.editor.scope",
    noteKey: "seeds.roles.editor.note"
  },
  {
    name: "viewer",
    members: 21,
    scopeKey: "seeds.roles.viewer.scope",
    noteKey: "seeds.roles.viewer.note"
  }
];

export const permissionMatrix = [
  {
    module: "dashboard",
    super_admin: ["view", "manage"],
    admin: ["view"],
    editor: ["view"],
    viewer: ["view"]
  },
  {
    module: "users",
    super_admin: ["view", "create", "update", "delete"],
    admin: ["view", "create", "update"],
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
    module: "reports",
    super_admin: ["view", "export"],
    admin: ["view"],
    editor: [],
    viewer: []
  },
  {
    module: "audit_logs",
    super_admin: ["view", "export"],
    admin: [],
    editor: [],
    viewer: []
  }
];

export const contentRows = [
  {
    nameKey: "seeds.content.springCampaign",
    type: "landing_page",
    status: "published",
    owner: "Maftuna Rasulova",
    updatedAt: "2026-03-27 09:10"
  },
  {
    nameKey: "seeds.content.deliveryFaq",
    type: "knowledge_base",
    status: "draft",
    owner: "Akmal Gafurov",
    updatedAt: "2026-03-26 18:44"
  },
  {
    nameKey: "seeds.content.promoBanners",
    type: "media_asset",
    status: "archived",
    owner: "Javohir Qodirov",
    updatedAt: "2026-03-24 13:06"
  }
];

export const reportCards = [
  {
    titleKey: "seeds.reports.dailyActiveUsers.title",
    value: "4,284",
    noteKey: "seeds.reports.dailyActiveUsers.note"
  },
  {
    titleKey: "seeds.reports.weeklyRegistrations.title",
    value: "742",
    noteKey: "seeds.reports.weeklyRegistrations.note"
  },
  {
    titleKey: "seeds.reports.failedLogins.title",
    value: "19",
    noteKey: "seeds.reports.failedLogins.note"
  }
];

export const auditLogs = [
  {
    actionKey: "seeds.auditActions.permissionChanged",
    category: "permission",
    actor: "Sevara Alimuhamedova",
    target: "Role: support",
    ip: "10.10.4.25",
    timestamp: "2026-03-27 09:15"
  },
  {
    actionKey: "seeds.auditActions.userBlocked",
    category: "user",
    actor: "Javohir Qodirov",
    target: "USR-1030",
    ip: "10.10.4.42",
    timestamp: "2026-03-27 08:57"
  },
  {
    actionKey: "seeds.auditActions.loginFailed",
    category: "auth",
    actor: "shahnoza@savdo.uz",
    target: "Auth",
    ip: "10.10.9.90",
    timestamp: "2026-03-27 08:33"
  }
];

export const profileSections = [
  {
    titleKey: "seeds.profileSections.personalInfo.title",
    itemsKey: "seeds.profileSections.personalInfo.items"
  },
  {
    titleKey: "seeds.profileSections.security.title",
    itemsKey: "seeds.profileSections.security.items"
  },
  {
    titleKey: "seeds.profileSections.preferences.title",
    itemsKey: "seeds.profileSections.preferences.items"
  }
];
