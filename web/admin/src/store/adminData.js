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
  recentActivities as initialRecentActivities,
  users as initialUsers
} from "../constants/mockData";
import { useAuth } from "./index";

const AdminDataContext = createContext(null);

function formatNow() {
  return new Date().toISOString().slice(0, 16).replace("T", " ");
}

function nextId(prefix, list) {
  const max = list.reduce((m, item) => {
    const n = Number(String(item.id || "").replace(/\D/g, ""));
    return Number.isFinite(n) ? Math.max(m, n) : m;
  }, 0);
  return `${prefix}-${String(max + 1).padStart(4, "0")}`;
}

export function AdminDataProvider({ children }) {
  const { profile } = useAuth();
  const [users, setUsers] = useState(initialUsers);
  const [admins, setAdmins] = useState(initialAdmins);
  const [contentRows, setContentRows] = useState(initialContentRows);
  const [auditLogs, setAuditLogs] = useState(initialAuditLogs);
  const [recentActivity, setRecentActivity] = useState(initialRecentActivities);
  const [toasts, setToasts] = useState([]);

  // ── Toast ───────────────────────────────────────────────
  function dismissToast(id) {
    setToasts((curr) => curr.filter((t) => t.id !== id));
  }

  function pushToast(message, tone = "success") {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
    setToasts((curr) => [...curr, { id, message, tone }]);
    window.setTimeout(() => dismissToast(id), 3400);
  }

  // ── Activity + Audit ────────────────────────────────────
  function appendActivity(title, detail, tone = "info") {
    setRecentActivity((curr) =>
      [{ title, detail, time: "Hozir", tone }, ...curr].slice(0, 8)
    );
  }

  function logAudit(action, target, category = "user", tone = "info") {
    const actor = profile?.name || "Tizim";
    setAuditLogs((curr) => [
      {
        id: `${Date.now()}`,
        action,
        category,
        actor,
        target,
        ip: "10.10.4.99",
        timestamp: formatNow()
      },
      ...curr
    ]);
    appendActivity(action, `${actor} → ${target}`, tone);
  }

  // ── Users ────────────────────────────────────────────────
  function createUser(payload) {
    const user = {
      id: nextId("USR", users),
      createdAt: formatNow().slice(0, 10),
      lastLogin: null,
      isAdmin: false,
      ...payload
    };
    setUsers((curr) => [user, ...curr]);
    logAudit("Foydalanuvchi yaratildi", user.id, "user", "success");
    pushToast(`${user.name} yaratildi`);
  }

  function updateUser(id, payload) {
    setUsers((curr) =>
      curr.map((u) => (u.id === id ? { ...u, ...payload } : u))
    );
    logAudit("Foydalanuvchi yangilandi", id, "user", "info");
    pushToast("O'zgarishlar saqlandi");
  }

  function toggleUserStatus(id) {
    let next = "blocked";
    setUsers((curr) =>
      curr.map((u) => {
        if (u.id !== id) return u;
        next = u.status === "blocked" ? "active" : "blocked";
        return { ...u, status: next };
      })
    );
    logAudit(
      next === "blocked" ? "Foydalanuvchi bloklandi" : "Foydalanuvchi aktivlashtirildi",
      id, "user",
      next === "blocked" ? "danger" : "success"
    );
    pushToast(next === "blocked" ? "Foydalanuvchi bloklandi" : "Foydalanuvchi aktivlashtirildi",
      next === "blocked" ? "danger" : "success");
  }

  function deleteUser(id) {
    const target = users.find((u) => u.id === id);
    setUsers((curr) => curr.filter((u) => u.id !== id));
    logAudit("Foydalanuvchi o'chirildi", id, "user", "danger");
    pushToast(`${target?.name || id} o'chirildi`, "danger");
  }

  // ── Grant / Revoke Admin ────────────────────────────────
  // Primary admin can promote a user to admin or revoke their admin access
  function grantAdminToUser(userId) {
    const user = users.find((u) => u.id === userId);
    if (!user) return;

    // Mark user as admin in users list
    setUsers((curr) =>
      curr.map((u) => (u.id === userId ? { ...u, isAdmin: true } : u))
    );

    // Add to admins list if not already there
    const alreadyAdmin = admins.find((a) => a.email === user.email);
    if (!alreadyAdmin) {
      const admin = {
        id: nextId("ADM", admins),
        name: user.name,
        email: user.email,
        isPrimary: false,
        status: "active",
        lastActive: formatNow(),
        createdBy: profile?.name || "Bosh Admin",
        grantedFromUserId: userId
      };
      setAdmins((curr) => [...curr, admin]);
    }

    logAudit("Admin huquqi berildi", user.name, "admin", "success");
    pushToast(`${user.name} ga admin huquqi berildi`);
  }

  function revokeAdminFromUser(userId) {
    const user = users.find((u) => u.id === userId);
    if (!user) return;

    setUsers((curr) =>
      curr.map((u) => (u.id === userId ? { ...u, isAdmin: false } : u))
    );
    setAdmins((curr) =>
      curr.filter((a) => a.grantedFromUserId !== userId && a.email !== user.email)
    );

    logAudit("Admin huquqi olindi", user.name, "admin", "warning");
    pushToast(`${user.name} dan admin huquqi olindi`, "warning");
  }

  // ── Admins ───────────────────────────────────────────────
  function toggleAdminStatus(id) {
    let next = "suspended";
    setAdmins((curr) =>
      curr.map((a) => {
        if (a.id !== id || a.isPrimary) return a;
        next = a.status === "suspended" ? "active" : "suspended";
        return { ...a, status: next };
      })
    );
    logAudit(
      next === "suspended" ? "Admin to'xtatildi" : "Admin aktivlashtirildi",
      id, "admin", "warning"
    );
    pushToast(next === "suspended" ? "Admin to'xtatildi" : "Admin aktivlashtirildi", "warning");
  }

  // ── Content ──────────────────────────────────────────────
  function createContent(payload) {
    const row = {
      id: nextId("CNT", contentRows),
      updatedAt: formatNow(),
      ...payload
    };
    setContentRows((curr) => [row, ...curr]);
    logAudit("Kontent yaratildi", row.name || row.id, "content", "success");
    pushToast(`"${row.name}" yaratildi`);
  }

  function updateContentStatus(id, status) {
    let name = id;
    setContentRows((curr) =>
      curr.map((c) => {
        if (c.id !== id) return c;
        name = c.name || id;
        return { ...c, status, updatedAt: formatNow() };
      })
    );
    logAudit(`Kontent statusi: ${status}`, name, "content", "info");
    pushToast(`Kontent statusi yangilandi: ${status}`);
  }

  function deleteContent(id) {
    const target = contentRows.find((c) => c.id === id);
    setContentRows((curr) => curr.filter((c) => c.id !== id));
    logAudit("Kontent o'chirildi", target?.name || id, "content", "danger");
    pushToast(`"${target?.name || id}" o'chirildi`, "danger");
  }

  // ── Settings ─────────────────────────────────────────────
  function saveSettings(section) {
    logAudit("Sozlamalar saqlandi", section, "settings", "success");
    pushToast("Sozlamalar saqlandi");
  }

  const value = useMemo(
    () => ({
      users, admins, contentRows, auditLogs,
      notificationFeed, recentActivity, toasts,
      pushToast, dismissToast,
      createUser, updateUser, toggleUserStatus, deleteUser,
      grantAdminToUser, revokeAdminFromUser,
      toggleAdminStatus,
      createContent, updateContentStatus, deleteContent,
      saveSettings
    }),
    [users, admins, contentRows, auditLogs, recentActivity, toasts]
  );

  return createElement(AdminDataContext.Provider, { value }, children);
}

export function useAdminData() {
  const ctx = useContext(AdminDataContext);
  if (!ctx) throw new Error("useAdminData must be used within AdminDataProvider");
  return ctx;
}
