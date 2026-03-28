import {
  createContext,
  createElement,
  useContext,
  useMemo,
  useState
} from "react";
import {
  admins as initialAdmins,
  auditLogs as initialAuditLogs,
  contentRows as initialContentRows,
  notificationFeed,
  permissionMatrix as initialPermissionMatrix,
  recentActivities as initialRecentActivities,
  roles as initialRoles,
  users as initialUsers
} from "../constants/mockData";
import { getStatusLabel } from "../i18n/labels";
import { useI18n } from "../i18n";
import { useAuth } from "./index";

const AdminDataContext = createContext(null);

function formatNow() {
  return new Date().toISOString().slice(0, 16).replace("T", " ");
}

function nextId(prefix, list) {
  const currentMax = list.reduce((max, item) => {
    const numeric = Number(String(item.id || "").replace(/\D/g, ""));
    return Number.isFinite(numeric) ? Math.max(max, numeric) : max;
  }, 0);

  return `${prefix}-${String(currentMax + 1).padStart(4, "0")}`;
}

function buildActivity(titleKey, detailKey, detailValues = {}, tone = "info") {
  return {
    titleKey,
    detailKey,
    detailValues,
    time: { type: "just_now" },
    tone
  };
}

export function AdminDataProvider({ children }) {
  const { profile } = useAuth();
  const { t } = useI18n();
  const [users, setUsers] = useState(initialUsers);
  const [admins, setAdmins] = useState(initialAdmins);
  const [roles, setRoles] = useState(initialRoles);
  const [permissionMatrix, setPermissionMatrix] = useState(initialPermissionMatrix);
  const [contentRows, setContentRows] = useState(initialContentRows);
  const [auditLogs, setAuditLogs] = useState(initialAuditLogs);
  const [recentActivity, setRecentActivity] = useState(initialRecentActivities);
  const [toasts, setToasts] = useState([]);

  function dismissToast(id) {
    setToasts((current) => current.filter((item) => item.id !== id));
  }

  function pushToast(messageKey, values = {}, tone = "success") {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
    setToasts((current) => [...current, { id, messageKey, values, tone }]);

    window.setTimeout(() => {
      dismissToast(id);
    }, 3200);
  }

  function appendActivity(titleKey, detailKey, detailValues, tone) {
    setRecentActivity((current) =>
      [buildActivity(titleKey, detailKey, detailValues, tone), ...current].slice(0, 5)
    );
  }

  function logAudit(actionKey, target, tone = "info", category = "settings") {
    const actor = profile?.name || "Unknown actor";
    const entry = {
      id: `${Date.now()}`,
      actionKey,
      category,
      actor,
      target,
      ip: "10.10.4.99",
      timestamp: formatNow()
    };

    setAuditLogs((current) => [entry, ...current]);
    appendActivity(actionKey, "seeds.activities.genericUpdatedBy.detail", { target, actor }, tone);
  }

  function createUser(payload) {
    const user = {
      id: nextId("USR", users),
      createdAt: formatNow().slice(0, 10),
      lastLogin: { type: "never" },
      ...payload
    };

    setUsers((current) => [user, ...current]);
    logAudit("seeds.auditActions.userCreated", user.id, "success", "user");
    pushToast("toast.userCreated", { name: user.name });
  }

  function updateUser(id, payload) {
    setUsers((current) =>
      current.map((item) => (item.id === id ? { ...item, ...payload } : item))
    );
    logAudit("seeds.auditActions.userUpdated", id, "info", "user");
    pushToast("toast.userUpdated");
  }

  function toggleUserStatus(id) {
    let nextStatus = "blocked";

    setUsers((current) =>
      current.map((item) => {
        if (item.id !== id) {
          return item;
        }

        nextStatus = item.status === "blocked" ? "active" : "blocked";
        return { ...item, status: nextStatus };
      })
    );

    logAudit(
      nextStatus === "blocked"
        ? "seeds.auditActions.userBlocked"
        : "seeds.auditActions.userUnblocked",
      id,
      nextStatus === "blocked" ? "danger" : "success",
      "user"
    );
    pushToast("toast.userStatus", { status: getStatusLabel(t, nextStatus) });
  }

  function deleteUser(id) {
    const target = users.find((item) => item.id === id);
    setUsers((current) => current.filter((item) => item.id !== id));
    logAudit("seeds.auditActions.userDeleted", id, "danger", "user");
    pushToast("toast.userDeleted", { name: target?.name || id }, "danger");
  }

  function createAdmin(payload) {
    if (payload.role === "super_admin") {
      pushToast("toast.onlyOneSuperAdmin", {}, "danger");
      return false;
    }

    const customPermissions = payload.permissions?.trim();
    const admin = {
      id: nextId("ADM", admins),
      status: payload.status || "invited",
      lastActive: { type: "pending_invite" },
      createdBy: profile?.name || { type: "system" },
      permissionsKey: customPermissions ? undefined : "scoped_access",
      ...payload
    };

    setAdmins((current) => [admin, ...current]);
    logAudit("seeds.auditActions.adminCreated", admin.id, "success", "admin");
    pushToast("toast.adminCreated", { name: admin.name });
    return true;
  }

  function updateAdmin(id, payload) {
    const currentAdmin = admins.find((item) => item.id === id);

    if (currentAdmin?.role === "super_admin" && payload.role && payload.role !== "super_admin") {
      pushToast("toast.superAdminTransferDisabled", {}, "danger");
      return false;
    }

    setAdmins((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              ...payload,
              permissionsKey: payload.permissions?.trim() ? undefined : item.permissionsKey
            }
          : item
      )
    );
    logAudit("seeds.auditActions.adminUpdated", id, "info", "admin");
    pushToast("toast.adminUpdated");
    return true;
  }

  function toggleAdminStatus(id) {
    let nextStatus = "suspended";

    setAdmins((current) =>
      current.map((item) => {
        if (item.id !== id || item.role === "super_admin") {
          return item;
        }

        nextStatus = item.status === "suspended" ? "active" : "suspended";
        return { ...item, status: nextStatus };
      })
    );

    logAudit("seeds.auditActions.adminStatusChanged", id, "warning", "admin");
    pushToast("toast.adminStatus", { status: getStatusLabel(t, nextStatus) });
  }

  function createRole(payload) {
    const role = {
      name: payload.name,
      members: 0,
      scope: payload.scope,
      note: payload.note
    };

    setRoles((current) => [role, ...current]);
    logAudit("seeds.auditActions.roleCreated", payload.name, "success", "permission");
    pushToast("toast.roleCreated", { name: payload.name });
  }

  function togglePermission(moduleName, roleName, actionName) {
    setPermissionMatrix((current) =>
      current.map((row) => {
        if (row.module !== moduleName) {
          return row;
        }

        const currentActions = row[roleName];
        const nextActions = currentActions.includes(actionName)
          ? currentActions.filter((item) => item !== actionName)
          : [...currentActions, actionName];

        return { ...row, [roleName]: nextActions };
      })
    );
  }

  function savePermissions() {
    logAudit("seeds.auditActions.permissionsSaved", "Permissions", "success", "permission");
    pushToast("toast.permissionsSaved");
  }

  function createContent(payload) {
    const row = {
      id: nextId("CNT", contentRows),
      updatedAt: formatNow(),
      ...payload
    };

    setContentRows((current) => [row, ...current]);
    logAudit("seeds.auditActions.contentCreated", row.name, "success", "content");
    pushToast("toast.contentCreated", { name: row.name });
  }

  function updateContentStatus(idOrName, status) {
    let resolvedName = String(idOrName);

    setContentRows((current) =>
      current.map((item) => {
        if ((item.id || item.name || item.nameKey) !== idOrName) {
          return item;
        }

        resolvedName = item.name || t(item.nameKey, {}, String(idOrName));
        return { ...item, status, updatedAt: formatNow() };
      })
    );
    logAudit("seeds.auditActions.contentStatusChanged", resolvedName, "info", "content");
    pushToast("toast.contentStatusUpdated", { status: getStatusLabel(t, status) });
  }

  function saveSettings(section) {
    logAudit("seeds.auditActions.settingsUpdated", section, "success", "settings");
    pushToast("toast.settingsSaved", { section });
  }

  const value = useMemo(
    () => ({
      users,
      admins,
      roles,
      permissionMatrix,
      contentRows,
      auditLogs,
      notificationFeed,
      recentActivity,
      toasts,
      pushToast,
      dismissToast,
      createUser,
      updateUser,
      toggleUserStatus,
      deleteUser,
      createAdmin,
      updateAdmin,
      toggleAdminStatus,
      createRole,
      togglePermission,
      savePermissions,
      createContent,
      updateContentStatus,
      saveSettings
    }),
    [
      users,
      admins,
      roles,
      permissionMatrix,
      contentRows,
      auditLogs,
      recentActivity,
      toasts
    ]
  );

  return createElement(AdminDataContext.Provider, { value }, children);
}

export function useAdminData() {
  const context = useContext(AdminDataContext);

  if (!context) {
    throw new Error("useAdminData must be used within AdminDataProvider");
  }

  return context;
}
