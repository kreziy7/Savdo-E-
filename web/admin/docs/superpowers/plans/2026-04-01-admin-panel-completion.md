# Admin Panel Completion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete the admin panel by fixing broken Roles/Permissions pages, adding Dashboard charts, and implementing Products/Orders/Customers modules.

**Architecture:** All state lives in `adminData.js` (Context + useState); pages consume via `useAdminData()`. Mock data seeded in `mockData.js`. UI follows existing dark Tailwind patterns. No backend yet — all operations in-memory with audit logging.

**Tech Stack:** React 18, Vite, Tailwind CSS, recharts (new), existing i18n (uz/en/ru), existing Modal/toast components.

---

## File Map

### Phase 1 — Roles & Permissions (store fix)
| Action | File |
|--------|------|
| Modify | `src/constants/mockData.js` — add `roles[]`, `permissionMatrix[]`, `products[]`, `orders[]`, `customers[]` |
| Modify | `src/store/adminData.js` — add roles/permissions/products/orders/customers state & methods |
| Modify | `src/i18n/translations.en.js` — add missing `labels.modules` keys + products/orders/customers labels |
| Modify | `src/i18n/translations.uz.js` — same |
| Modify | `src/i18n/translations.ru.js` — same |

### Phase 2 — Dashboard Charts
| Action | File |
|--------|------|
| Create | `src/pages/dashboard/components/StatsChart.jsx` — recharts LineChart + BarChart |
| Modify | `src/pages/dashboard/DashboardPage.jsx` — add chart section |

### Phase 3 — Products
| Action | File |
|--------|------|
| Modify | `src/pages/products/ProductsPage.jsx` — full CRUD table |

### Phase 4 — Orders
| Action | File |
|--------|------|
| Modify | `src/pages/orders/OrdersPage.jsx` — table with status management |

### Phase 5 — Customers
| Action | File |
|--------|------|
| Modify | `src/pages/customers/CustomersPage.jsx` — table with tier/status |

---

## Task 1: Add roles and permissionMatrix mock data

**Files:**
- Modify: `src/constants/mockData.js`

- [ ] **Step 1: Add roles array to the bottom of mockData.js**

Open `src/constants/mockData.js` and append after the `auditLogs` export:

```js
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
```

- [ ] **Step 2: Verify dev server still starts**

```bash
npm run dev
```
Expected: Server starts on http://localhost:5174 with no errors.

---

## Task 2: Add roles and permissions methods to adminData.js

**Files:**
- Modify: `src/store/adminData.js`

- [ ] **Step 1: Import roles and permissionMatrix from mockData**

At the top of `src/store/adminData.js`, update the import:

```js
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
```

- [ ] **Step 2: Add state for roles and permissionMatrix inside AdminDataProvider**

After the existing `const [toasts, setToasts] = useState([]);` line, add:

```js
  const [roles, setRoles] = useState(initialRoles);
  const [permissionMatrix, setPermissionMatrix] = useState(initialPermissionMatrix);
```

- [ ] **Step 3: Add roles CRUD functions inside AdminDataProvider**

After the `// ── Settings` section and before the `const value = useMemo(...)` line, add:

```js
  // ── Roles ─────────────────────────────────────────────────
  function createRole(payload) {
    const role = {
      id: `role-${Date.now()}`,
      name: payload.name,
      scope: payload.scope,
      note: payload.note,
      members: 0,
      isSystem: false
    };
    setRoles((curr) => [...curr, role]);
    logAudit("Rol yaratildi", role.name, "settings", "success");
    pushToast(`"${role.name}" roli yaratildi`);
  }

  function deleteRole(id) {
    const target = roles.find((r) => r.id === id);
    if (target?.isSystem) {
      pushToast("Tizim rolini o'chirib bo'lmaydi", "danger");
      return;
    }
    setRoles((curr) => curr.filter((r) => r.id !== id));
    logAudit("Rol o'chirildi", target?.name || id, "settings", "danger");
    pushToast(`"${target?.name}" roli o'chirildi`, "danger");
  }

  // ── Permissions ────────────────────────────────────────────
  function togglePermission(module, roleKey, action) {
    setPermissionMatrix((curr) =>
      curr.map((row) => {
        if (row.module !== module) return row;
        const current = row[roleKey] || [];
        const updated = current.includes(action)
          ? current.filter((a) => a !== action)
          : [...current, action];
        return { ...row, [roleKey]: updated };
      })
    );
  }

  function savePermissions() {
    logAudit("Ruxsatlar saqlandi", "permission matrix", "settings", "success");
    pushToast("Ruxsatlar saqlandi");
  }
```

- [ ] **Step 4: Expose new values in the useMemo value object**

Find the `const value = useMemo(` block and update it:

```js
  const value = useMemo(
    () => ({
      users, admins, contentRows, auditLogs,
      notificationFeed, recentActivity, toasts,
      roles, permissionMatrix,
      pushToast, dismissToast,
      createUser, updateUser, toggleUserStatus, deleteUser,
      grantAdminToUser, revokeAdminFromUser,
      toggleAdminStatus,
      createContent, updateContentStatus, deleteContent,
      saveSettings,
      createRole, deleteRole,
      togglePermission, savePermissions
    }),
    [users, admins, contentRows, auditLogs, recentActivity, toasts, roles, permissionMatrix]
  );
```

- [ ] **Step 5: Verify Roles and Permissions pages work**

Open browser → navigate to `/roles` — should show 4 role cards with "Create role" button.
Navigate to `/permissions` — should show permission matrix with checkboxes.
Click "Save changes" on Permissions page — should show toast "Ruxsatlar saqlandi".

---

## Task 3: Add missing i18n labels for modules

**Files:**
- Modify: `src/i18n/translations.en.js`
- Modify: `src/i18n/translations.uz.js`
- Modify: `src/i18n/translations.ru.js`

- [ ] **Step 1: Add missing module labels in translations.en.js**

Find the `labels.modules` object in `src/i18n/translations.en.js`:
```js
    modules: {
      dashboard: "Dashboard",
      users: "Users",
      admins: "Admins",
      reports: "Reports",
      audit_logs: "Audit Logs"
    },
```

Replace with:
```js
    modules: {
      dashboard: "Dashboard",
      users: "Users",
      admins: "Admins",
      roles: "Roles",
      permissions: "Permissions",
      content: "Content",
      reports: "Reports",
      audit_logs: "Audit Logs",
      settings: "Settings"
    },
```

- [ ] **Step 2: Add same labels in translations.uz.js**

Find `labels.modules` in `src/i18n/translations.uz.js` and replace with:
```js
    modules: {
      dashboard: "Dashboard",
      users: "Foydalanuvchilar",
      admins: "Adminlar",
      roles: "Rollar",
      permissions: "Ruxsatlar",
      content: "Kontent",
      reports: "Hisobotlar",
      audit_logs: "Audit loglar",
      settings: "Sozlamalar"
    },
```

- [ ] **Step 3: Add same labels in translations.ru.js**

Find `labels.modules` in `src/i18n/translations.ru.js` and replace with:
```js
    modules: {
      dashboard: "Дашборд",
      users: "Пользователи",
      admins: "Администраторы",
      roles: "Роли",
      permissions: "Права",
      content: "Контент",
      reports: "Отчёты",
      audit_logs: "Журнал действий",
      settings: "Настройки"
    },
```

- [ ] **Step 4: Verify permission matrix shows module names correctly**

Navigate to `/permissions` — all 9 module cards should show translated names (not raw keys like "audit_logs").

- [ ] **Step 5: Commit Phase 1**

```bash
git add src/constants/mockData.js src/store/adminData.js src/i18n/translations.en.js src/i18n/translations.uz.js src/i18n/translations.ru.js
git commit -m "feat: complete roles and permissions module with store and i18n"
```

---

## Task 4: Install recharts and add mock chart data

**Files:**
- Modify: `src/constants/mockData.js` — add weekly stats for charts

- [ ] **Step 1: Install recharts**

```bash
npm install recharts
```

Expected: `recharts` added to `package.json` dependencies.

- [ ] **Step 2: Add weekly chart data to mockData.js**

Append to the end of `src/constants/mockData.js`:

```js
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
```

---

## Task 5: Create StatsChart component

**Files:**
- Create: `src/pages/dashboard/components/StatsChart.jsx`

- [ ] **Step 1: Create the components directory and StatsChart file**

Create `src/pages/dashboard/components/StatsChart.jsx`:

```jsx
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

const tooltipStyle = {
  backgroundColor: "#0e2037",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "12px",
  color: "#fff",
  fontSize: "12px"
};

export function UserActivityChart({ data }) {
  return (
    <div className="bg-slate-900/70 border border-white/10 rounded-2xl p-5 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-white text-sm">Haftalik foydalanuvchilar</h3>
        <span className="text-xs text-white/60">Jami va faol</span>
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
          <XAxis dataKey="day" tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: "rgba(255,255,255,0.1)" }} />
          <Line type="monotone" dataKey="users" stroke="#2563c9" strokeWidth={2} dot={false} name="Jami" />
          <Line type="monotone" dataKey="active" stroke="#1f9d67" strokeWidth={2} dot={false} name="Faol" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function OrderRevenueChart({ data }) {
  return (
    <div className="bg-slate-900/70 border border-white/10 rounded-2xl p-5 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-white text-sm">Oylik buyurtmalar</h3>
        <span className="text-xs text-white/60">So'nggi 6 oy</span>
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
          <XAxis dataKey="month" tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(255,255,255,0.04)" }} formatter={(v, n) => n === "revenue" ? [`${(v / 1000000).toFixed(1)}M`, "Daromad"] : [v, "Buyurtma"]} />
          <Bar dataKey="orders" fill="#2563c9" radius={[4, 4, 0, 0]} name="Buyurtmalar" />
          <Bar dataKey="revenue" fill="#1f9d67" radius={[4, 4, 0, 0]} name="Daromad" hide />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
```

- [ ] **Step 2: Verify component has no syntax errors**

```bash
npm run dev
```

Expected: Dev server compiles without errors.

---

## Task 6: Update DashboardPage with charts section

**Files:**
- Modify: `src/pages/dashboard/DashboardPage.jsx`

- [ ] **Step 1: Add imports at the top of DashboardPage.jsx**

Add after existing imports:

```js
import { monthlyOrderStats, weeklyUserStats } from "../../constants/mockData";
import { OrderRevenueChart, UserActivityChart } from "./components/StatsChart";
```

- [ ] **Step 2: Add charts section between stats cards and activity grid**

In `DashboardPage.jsx`, find the line:
```jsx
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
```
(this is the activity + notifications grid)

Insert BEFORE it:

```jsx
      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <UserActivityChart data={weeklyUserStats} />
        <OrderRevenueChart data={monthlyOrderStats} />
      </div>
```

- [ ] **Step 3: Verify charts appear on dashboard**

Open browser → `/dashboard`. Two charts should appear between stats cards and the activity feed: a line chart (haftalik foydalanuvchilar) and a bar chart (oylik buyurtmalar).

- [ ] **Step 4: Commit Phase 2**

```bash
git add src/constants/mockData.js src/pages/dashboard/components/StatsChart.jsx src/pages/dashboard/DashboardPage.jsx package.json package-lock.json
git commit -m "feat: add recharts dashboard — user activity line chart and order bar chart"
```

---

## Task 7: Add Products mock data

**Files:**
- Modify: `src/constants/mockData.js`

- [ ] **Step 1: Add products array to mockData.js**

Append to `src/constants/mockData.js`:

```js
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
```

---

## Task 8: Add products store methods to adminData.js

**Files:**
- Modify: `src/store/adminData.js`

- [ ] **Step 1: Import products from mockData at the top of adminData.js**

Update the import block:
```js
import {
  admins as initialAdmins,
  auditLogs as initialAuditLogs,
  contentRows as initialContentRows,
  notificationFeed,
  permissionMatrix as initialPermissionMatrix,
  products as initialProducts,
  recentActivities as initialRecentActivities,
  roles as initialRoles,
  users as initialUsers
} from "../constants/mockData";
```

- [ ] **Step 2: Add products state inside AdminDataProvider**

After `const [permissionMatrix, setPermissionMatrix] = useState(initialPermissionMatrix);` add:

```js
  const [products, setProducts] = useState(initialProducts);
```

- [ ] **Step 3: Add product CRUD functions inside AdminDataProvider**

After the permissions section, add:

```js
  // ── Products ───────────────────────────────────────────────
  function createProduct(payload) {
    const product = {
      id: nextId("PRD", products),
      createdAt: formatNow().slice(0, 10),
      status: "active",
      stock: 0,
      ...payload
    };
    setProducts((curr) => [product, ...curr]);
    logAudit("Mahsulot yaratildi", product.name, "content", "success");
    pushToast(`"${product.name}" qo'shildi`);
  }

  function updateProduct(id, payload) {
    setProducts((curr) =>
      curr.map((p) => (p.id === id ? { ...p, ...payload } : p))
    );
    logAudit("Mahsulot yangilandi", id, "content", "info");
    pushToast("Mahsulot saqlandi");
  }

  function deleteProduct(id) {
    const target = products.find((p) => p.id === id);
    setProducts((curr) => curr.filter((p) => p.id !== id));
    logAudit("Mahsulot o'chirildi", target?.name || id, "content", "danger");
    pushToast(`"${target?.name || id}" o'chirildi`, "danger");
  }

  function toggleProductStatus(id) {
    let next = "inactive";
    setProducts((curr) =>
      curr.map((p) => {
        if (p.id !== id) return p;
        next = p.status === "active" ? "inactive" : "active";
        return { ...p, status: next };
      })
    );
    logAudit(
      next === "active" ? "Mahsulot aktivlashtirildi" : "Mahsulot o'chirildi",
      id, "content", next === "active" ? "success" : "warning"
    );
    pushToast(next === "active" ? "Mahsulot aktivlashtirildi" : "Mahsulot nofaol qilindi");
  }
```

- [ ] **Step 4: Expose products in useMemo value**

Update the `const value = useMemo(` object to include:
```js
      products,
      createProduct, updateProduct, deleteProduct, toggleProductStatus,
```
Also add `products` to the dependency array:
```js
    [users, admins, contentRows, auditLogs, recentActivity, toasts, roles, permissionMatrix, products]
```

---

## Task 9: Implement ProductsPage with full CRUD

**Files:**
- Modify: `src/pages/products/ProductsPage.jsx`

- [ ] **Step 1: Replace ProductsPage.jsx with full implementation**

```jsx
import { useState } from "react";
import { Modal } from "../../components/shared/Modal";
import { usePageTitle } from "../../hooks/usePageTitle";
import { useAdminData } from "../../store/adminData";

const emptyProduct = { name: "", category: "", price: "", stock: "", sku: "" };

const STATUS_STYLES = {
  active: "bg-green-500/10 text-green-400",
  inactive: "bg-gray-500/10 text-gray-400"
};

function formatPrice(p) {
  return Number(p).toLocaleString("uz-UZ") + " so'm";
}

export function ProductsPage() {
  usePageTitle("Mahsulotlar");
  const { products, createProduct, updateProduct, deleteProduct, toggleProductStatus } = useAdminData();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm] = useState(emptyProduct);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filtered = products.filter((p) => {
    const matchSearch = !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku?.toLowerCase().includes(search.toLowerCase()) ||
      p.category?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  function openCreate() {
    setEditTarget(null);
    setForm(emptyProduct);
    setModalOpen(true);
  }

  function openEdit(product) {
    setEditTarget(product);
    setForm({ name: product.name, category: product.category, price: product.price, stock: product.stock, sku: product.sku || "" });
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditTarget(null);
    setForm(emptyProduct);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const payload = { ...form, price: Number(form.price), stock: Number(form.stock) };
    if (editTarget) {
      updateProduct(editTarget.id, payload);
    } else {
      createProduct(payload);
    }
    closeModal();
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((c) => ({ ...c, [name]: value }));
  }

  return (
    <div className="space-y-5">
      <div className="bg-[#0e2037] rounded-2xl shadow-card border border-white/10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-white/10">
          <div>
            <h2 className="font-semibold text-white">Mahsulotlar ({filtered.length})</h2>
            <p className="text-xs text-white/60 mt-0.5">Mahsulotlar katalogi va ombor boshqaruvi</p>
          </div>
          <button
            type="button"
            onClick={openCreate}
            className="px-4 py-2 bg-primary hover:bg-primary-dark text-white text-sm font-medium rounded-xl transition-colors shrink-0"
          >
            + Mahsulot qo'shish
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 px-5 py-3 border-b border-white/10">
          <input
            type="text"
            placeholder="Nom, SKU yoki kategoriya..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 min-w-[180px] px-3 py-1.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 bg-white"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white outline-none"
          >
            <option value="all">Barcha holat</option>
            <option value="active">Aktiv</option>
            <option value="inactive">Nofaol</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                {["Mahsulot", "SKU", "Kategoriya", "Narx", "Qoldiq", "Holat", "Amallar"].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-medium text-white/50 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-white/40 text-sm">
                    Mahsulot topilmadi
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-5 py-3">
                      <p className="font-medium text-white">{p.name}</p>
                      <p className="text-xs text-white/40">{p.id}</p>
                    </td>
                    <td className="px-5 py-3 text-white/60 font-mono text-xs">{p.sku || "—"}</td>
                    <td className="px-5 py-3 text-white/70">{p.category}</td>
                    <td className="px-5 py-3 text-white font-medium">{formatPrice(p.price)}</td>
                    <td className="px-5 py-3">
                      <span className={`font-medium ${p.stock === 0 ? "text-red-400" : "text-white/80"}`}>
                        {p.stock}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_STYLES[p.status] || "bg-gray-100 text-gray-600"}`}>
                        {p.status === "active" ? "Aktiv" : "Nofaol"}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => openEdit(p)}
                          className="text-xs text-primary hover:underline"
                        >
                          Tahrirlash
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleProductStatus(p.id)}
                          className="text-xs text-white/50 hover:text-white/80"
                        >
                          {p.status === "active" ? "O'chirish" : "Yoqish"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(p)}
                          className="text-xs text-red-400 hover:text-red-300"
                        >
                          O'chirish
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit modal */}
      <Modal
        open={modalOpen}
        title={editTarget ? "Mahsulotni tahrirlash" : "Yangi mahsulot"}
        description="Mahsulot ma'lumotlarini kiriting"
        onClose={closeModal}
        footer={
          <>
            <button type="button" className="secondary-button" onClick={closeModal}>Bekor qilish</button>
            <button type="submit" form="product-form">{editTarget ? "Saqlash" : "Qo'shish"}</button>
          </>
        }
      >
        <form id="product-form" className="settings-form" onSubmit={handleSubmit}>
          {[
            { l: "Mahsulot nomi", n: "name", t: "text", r: true },
            { l: "Kategoriya", n: "category", t: "text", r: true },
            { l: "SKU", n: "sku", t: "text", r: false },
            { l: "Narx (so'm)", n: "price", t: "number", r: true },
            { l: "Ombor qoldig'i", n: "stock", t: "number", r: true }
          ].map((f) => (
            <label key={f.n}>
              {f.l}
              <input
                name={f.n}
                type={f.t}
                value={form[f.n]}
                onChange={handleChange}
                required={f.r}
                min={f.t === "number" ? 0 : undefined}
              />
            </label>
          ))}
        </form>
      </Modal>

      {/* Delete confirm modal */}
      <Modal
        open={!!deleteTarget}
        title="Mahsulotni o'chirish"
        description={`"${deleteTarget?.name}" mahsulotini o'chirishni tasdiqlaysizmi?`}
        onClose={() => setDeleteTarget(null)}
        footer={
          <>
            <button type="button" className="secondary-button" onClick={() => setDeleteTarget(null)}>Bekor qilish</button>
            <button
              type="button"
              className="danger-button"
              onClick={() => { deleteProduct(deleteTarget.id); setDeleteTarget(null); }}
            >
              O'chirish
            </button>
          </>
        }
      >
        <p className="text-sm text-gray-500">Bu amalni qaytarib bo'lmaydi.</p>
      </Modal>
    </div>
  );
}
```

- [ ] **Step 2: Verify Products page works**

Navigate to `/products` — should show 5 products in a table. Test: create a new product, edit it, toggle status, delete it.

- [ ] **Step 3: Commit Phase 3**

```bash
git add src/constants/mockData.js src/store/adminData.js src/pages/products/ProductsPage.jsx
git commit -m "feat: products module — full CRUD with table, create/edit modal, and status toggle"
```

---

## Task 10: Add Orders mock data and store methods

**Files:**
- Modify: `src/constants/mockData.js`
- Modify: `src/store/adminData.js`

- [ ] **Step 1: Add orders array to mockData.js**

Append to `src/constants/mockData.js`:

```js
// ─── Orders ───────────────────────────────────────────────
export const orders = [
  {
    id: "ORD-1001",
    customerName: "Alisher Toshmatov",
    customerPhone: "+998901234567",
    total: 12999000,
    status: "delivered",
    paymentStatus: "paid",
    items: 1,
    createdAt: "2026-03-25"
  },
  {
    id: "ORD-1002",
    customerName: "Malika Yusupova",
    customerPhone: "+998901234568",
    total: 5990000,
    status: "shipped",
    paymentStatus: "paid",
    items: 2,
    createdAt: "2026-03-28"
  },
  {
    id: "ORD-1003",
    customerName: "Jasur Karimov",
    customerPhone: "+998901234569",
    total: 3200000,
    status: "confirmed",
    paymentStatus: "pending",
    items: 1,
    createdAt: "2026-03-30"
  },
  {
    id: "ORD-1004",
    customerName: "Nodira Sharipova",
    customerPhone: "+998901234570",
    total: 24500000,
    status: "new",
    paymentStatus: "pending",
    items: 1,
    createdAt: "2026-04-01"
  },
  {
    id: "ORD-1005",
    customerName: "Bobur Ergashev",
    customerPhone: "+998901234571",
    total: 2990000,
    status: "cancelled",
    paymentStatus: "refunded",
    items: 1,
    createdAt: "2026-03-22"
  }
];
```

- [ ] **Step 2: Import orders and add state/methods in adminData.js**

Update the import at the top:
```js
import {
  admins as initialAdmins,
  auditLogs as initialAuditLogs,
  contentRows as initialContentRows,
  notificationFeed,
  orders as initialOrders,
  permissionMatrix as initialPermissionMatrix,
  products as initialProducts,
  recentActivities as initialRecentActivities,
  roles as initialRoles,
  users as initialUsers
} from "../constants/mockData";
```

Add state after products state:
```js
  const [orders, setOrders] = useState(initialOrders);
```

Add function after products section:
```js
  // ── Orders ─────────────────────────────────────────────────
  function updateOrderStatus(id, status) {
    setOrders((curr) =>
      curr.map((o) => (o.id === id ? { ...o, status } : o))
    );
    logAudit(`Buyurtma holati: ${status}`, id, "content", "info");
    pushToast(`Buyurtma holati yangilandi: ${status}`);
  }
```

Update `useMemo` value object to include:
```js
      orders,
      updateOrderStatus,
```

Update dependency array:
```js
    [users, admins, contentRows, auditLogs, recentActivity, toasts, roles, permissionMatrix, products, orders]
```

---

## Task 11: Implement OrdersPage

**Files:**
- Modify: `src/pages/orders/OrdersPage.jsx`

- [ ] **Step 1: Replace OrdersPage.jsx with full implementation**

```jsx
import { useState } from "react";
import { usePageTitle } from "../../hooks/usePageTitle";
import { useAdminData } from "../../store/adminData";

const ORDER_STATUSES = ["new", "confirmed", "shipped", "delivered", "cancelled"];

const STATUS_STYLES = {
  new: "bg-blue-500/10 text-blue-400",
  confirmed: "bg-yellow-500/10 text-yellow-400",
  shipped: "bg-purple-500/10 text-purple-400",
  delivered: "bg-green-500/10 text-green-400",
  cancelled: "bg-red-500/10 text-red-400"
};

const STATUS_LABELS = {
  new: "Yangi",
  confirmed: "Tasdiqlangan",
  shipped: "Jo'natildi",
  delivered: "Yetkazildi",
  cancelled: "Bekor"
};

const PAYMENT_LABELS = {
  paid: "To'langan",
  pending: "Kutilmoqda",
  refunded: "Qaytarildi"
};

const PAYMENT_STYLES = {
  paid: "text-green-400",
  pending: "text-yellow-400",
  refunded: "text-gray-400"
};

function formatPrice(p) {
  return Number(p).toLocaleString("uz-UZ") + " so'm";
}

export function OrdersPage() {
  usePageTitle("Buyurtmalar");
  const { orders, updateOrderStatus } = useAdminData();

  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [changeTarget, setChangeTarget] = useState(null);

  const filtered = orders.filter((o) => {
    const matchSearch = !search ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-5">
      <div className="bg-[#0e2037] rounded-2xl shadow-card border border-white/10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-white/10">
          <div>
            <h2 className="font-semibold text-white">Buyurtmalar ({filtered.length})</h2>
            <p className="text-xs text-white/60 mt-0.5">Buyurtmalar holati va yetkazib berish</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 px-5 py-3 border-b border-white/10">
          <input
            type="text"
            placeholder="Mijoz yoki buyurtma ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 min-w-[180px] px-3 py-1.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 bg-white"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white outline-none"
          >
            <option value="all">Barcha holat</option>
            {ORDER_STATUSES.map((s) => (
              <option key={s} value={s}>{STATUS_LABELS[s]}</option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                {["ID", "Mijoz", "Sana", "Summa", "Mahsulotlar", "To'lov", "Holat", "Amallar"].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-medium text-white/50 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-10 text-center text-white/40 text-sm">
                    Buyurtma topilmadi
                  </td>
                </tr>
              ) : (
                filtered.map((o) => (
                  <tr key={o.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-5 py-3 text-white/70 font-mono text-xs">{o.id}</td>
                    <td className="px-5 py-3">
                      <p className="font-medium text-white">{o.customerName}</p>
                      <p className="text-xs text-white/40">{o.customerPhone}</p>
                    </td>
                    <td className="px-5 py-3 text-white/60 text-xs">{o.createdAt}</td>
                    <td className="px-5 py-3 text-white font-medium">{formatPrice(o.total)}</td>
                    <td className="px-5 py-3 text-center text-white/70">{o.items}</td>
                    <td className="px-5 py-3">
                      <span className={`text-xs font-medium ${PAYMENT_STYLES[o.paymentStatus]}`}>
                        {PAYMENT_LABELS[o.paymentStatus] || o.paymentStatus}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_STYLES[o.status]}`}>
                        {STATUS_LABELS[o.status] || o.status}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      {o.status !== "delivered" && o.status !== "cancelled" && (
                        <button
                          type="button"
                          onClick={() => setChangeTarget(o)}
                          className="text-xs text-primary hover:underline"
                        >
                          Holat
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Status change inline dropdown */}
      {changeTarget && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setChangeTarget(null)}>
          <div className="bg-[#0e2037] border border-white/10 rounded-2xl p-5 w-full max-w-xs shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-semibold text-white mb-1">Holat o'zgartirish</h3>
            <p className="text-xs text-white/50 mb-4">{changeTarget.id} — {changeTarget.customerName}</p>
            <div className="space-y-2">
              {ORDER_STATUSES.filter((s) => s !== changeTarget.status).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => { updateOrderStatus(changeTarget.id, s); setChangeTarget(null); }}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-colors hover:opacity-80 ${STATUS_STYLES[s]}`}
                >
                  {STATUS_LABELS[s]}
                </button>
              ))}
            </div>
            <button type="button" onClick={() => setChangeTarget(null)} className="mt-3 w-full text-sm text-white/40 hover:text-white/60 py-2">
              Bekor qilish
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Verify Orders page works**

Navigate to `/orders` — should show 5 orders. Test: click "Holat" button and change an order's status — toast should appear.

- [ ] **Step 3: Commit Phase 4**

```bash
git add src/constants/mockData.js src/store/adminData.js src/pages/orders/OrdersPage.jsx
git commit -m "feat: orders module — table with status filters and inline status change"
```

---

## Task 12: Add Customers mock data and store methods

**Files:**
- Modify: `src/constants/mockData.js`
- Modify: `src/store/adminData.js`

- [ ] **Step 1: Add customers array to mockData.js**

Append to `src/constants/mockData.js`:

```js
// ─── Customers ────────────────────────────────────────────
export const customers = [
  {
    id: "CST-001",
    name: "Alisher Toshmatov",
    email: "alisher@example.com",
    phone: "+998901234567",
    status: "active",
    tier: "vip",
    totalOrders: 12,
    totalSpent: 45000000,
    createdAt: "2025-12-15"
  },
  {
    id: "CST-002",
    name: "Malika Yusupova",
    email: "malika@example.com",
    phone: "+998901234568",
    status: "active",
    tier: "regular",
    totalOrders: 5,
    totalSpent: 12000000,
    createdAt: "2026-01-10"
  },
  {
    id: "CST-003",
    name: "Jasur Karimov",
    email: "jasur@example.com",
    phone: "+998901234569",
    status: "active",
    tier: "new",
    totalOrders: 1,
    totalSpent: 3200000,
    createdAt: "2026-03-28"
  },
  {
    id: "CST-004",
    name: "Nodira Sharipova",
    email: "nodira@example.com",
    phone: "+998901234570",
    status: "blocked",
    tier: "regular",
    totalOrders: 3,
    totalSpent: 8500000,
    createdAt: "2026-02-05"
  },
  {
    id: "CST-005",
    name: "Bobur Ergashev",
    email: "bobur@example.com",
    phone: "+998901234571",
    status: "active",
    tier: "vip",
    totalOrders: 18,
    totalSpent: 62000000,
    createdAt: "2025-11-20"
  }
];
```

- [ ] **Step 2: Import customers and add state/methods in adminData.js**

Update import:
```js
import {
  admins as initialAdmins,
  auditLogs as initialAuditLogs,
  contentRows as initialContentRows,
  customers as initialCustomers,
  notificationFeed,
  orders as initialOrders,
  permissionMatrix as initialPermissionMatrix,
  products as initialProducts,
  recentActivities as initialRecentActivities,
  roles as initialRoles,
  users as initialUsers
} from "../constants/mockData";
```

Add state after orders state:
```js
  const [customers, setCustomers] = useState(initialCustomers);
```

Add function after orders section:
```js
  // ── Customers ──────────────────────────────────────────────
  function toggleCustomerStatus(id) {
    let next = "blocked";
    setCustomers((curr) =>
      curr.map((c) => {
        if (c.id !== id) return c;
        next = c.status === "blocked" ? "active" : "blocked";
        return { ...c, status: next };
      })
    );
    logAudit(
      next === "blocked" ? "Mijoz bloklandi" : "Mijoz aktivlashtirildi",
      id, "user", next === "blocked" ? "danger" : "success"
    );
    pushToast(next === "blocked" ? "Mijoz bloklandi" : "Mijoz aktivlashtirildi",
      next === "blocked" ? "danger" : "success");
  }
```

Update `useMemo` value:
```js
      customers,
      toggleCustomerStatus,
```

Update dependency array:
```js
    [users, admins, contentRows, auditLogs, recentActivity, toasts, roles, permissionMatrix, products, orders, customers]
```

---

## Task 13: Implement CustomersPage

**Files:**
- Modify: `src/pages/customers/CustomersPage.jsx`

- [ ] **Step 1: Replace CustomersPage.jsx with full implementation**

```jsx
import { useState } from "react";
import { usePageTitle } from "../../hooks/usePageTitle";
import { useAdminData } from "../../store/adminData";

const TIER_STYLES = {
  vip: "bg-yellow-500/10 text-yellow-400",
  regular: "bg-blue-500/10 text-blue-400",
  new: "bg-green-500/10 text-green-400"
};

const TIER_LABELS = {
  vip: "VIP",
  regular: "Doimiy",
  new: "Yangi"
};

const STATUS_STYLES = {
  active: "bg-green-500/10 text-green-400",
  blocked: "bg-red-500/10 text-red-400"
};

function formatPrice(p) {
  return (Number(p) / 1000000).toFixed(1) + " mln so'm";
}

export function CustomersPage() {
  usePageTitle("Mijozlar");
  const { customers, toggleCustomerStatus } = useAdminData();

  const [search, setSearch] = useState("");
  const [tierFilter, setTierFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = customers.filter((c) => {
    const matchSearch = !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search);
    const matchTier = tierFilter === "all" || c.tier === tierFilter;
    const matchStatus = statusFilter === "all" || c.status === statusFilter;
    return matchSearch && matchTier && matchStatus;
  });

  return (
    <div className="space-y-5">
      <div className="bg-[#0e2037] rounded-2xl shadow-card border border-white/10">
        {/* Header */}
        <div className="px-5 py-4 border-b border-white/10">
          <h2 className="font-semibold text-white">Mijozlar ({filtered.length})</h2>
          <p className="text-xs text-white/60 mt-0.5">Mijozlar ma'lumoti, toifa va holati</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 px-5 py-3 border-b border-white/10">
          <input
            type="text"
            placeholder="Ism, email yoki telefon..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 min-w-[180px] px-3 py-1.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 bg-white"
          />
          <select
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value)}
            className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white outline-none"
          >
            <option value="all">Barcha toifa</option>
            <option value="vip">VIP</option>
            <option value="regular">Doimiy</option>
            <option value="new">Yangi</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white outline-none"
          >
            <option value="all">Barcha holat</option>
            <option value="active">Aktiv</option>
            <option value="blocked">Bloklangan</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                {["Mijoz", "Telefon", "Toifa", "Buyurtmalar", "Jami xarid", "Ro'yxatga olish", "Holat", "Amallar"].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-medium text-white/50 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-10 text-center text-white/40 text-sm">
                    Mijoz topilmadi
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-5 py-3">
                      <p className="font-medium text-white">{c.name}</p>
                      <p className="text-xs text-white/40">{c.email}</p>
                    </td>
                    <td className="px-5 py-3 text-white/60 text-sm">{c.phone}</td>
                    <td className="px-5 py-3">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${TIER_STYLES[c.tier]}`}>
                        {TIER_LABELS[c.tier] || c.tier}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-center text-white/70">{c.totalOrders}</td>
                    <td className="px-5 py-3 text-white/70">{formatPrice(c.totalSpent)}</td>
                    <td className="px-5 py-3 text-white/50 text-xs">{c.createdAt}</td>
                    <td className="px-5 py-3">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_STYLES[c.status]}`}>
                        {c.status === "active" ? "Aktiv" : "Bloklangan"}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <button
                        type="button"
                        onClick={() => toggleCustomerStatus(c.id)}
                        className={`text-xs hover:underline ${c.status === "active" ? "text-red-400" : "text-green-400"}`}
                      >
                        {c.status === "active" ? "Bloklash" : "Faollashtirish"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify Customers page works**

Navigate to `/customers` — should show 5 customers. Test: filter by tier VIP (should show 2), click "Bloklash" on an active customer — status badge should change.

- [ ] **Step 3: Final commit**

```bash
git add src/constants/mockData.js src/store/adminData.js src/pages/customers/CustomersPage.jsx
git commit -m "feat: customers module — table with tier/status filters and block/unblock"
```

---

## Self-Review Checklist

### Spec coverage
- [x] Roles page — store methods added, UI already existed
- [x] Permissions page — permissionMatrix + togglePermission + savePermissions added
- [x] Missing i18n modules labels — added in all 3 locales
- [x] Dashboard charts — recharts LineChart + BarChart
- [x] Products — full CRUD (create, edit, delete, toggle status)
- [x] Orders — table with status change
- [x] Customers — table with block/unblock, tier filter

### Placeholder scan
- No TBD or TODO in any code step
- All code blocks are complete and runnable

### Type consistency
- `createRole(payload)` uses `payload.name/scope/note` — matches form fields `name`, `scope`, `note` in RolesPage
- `togglePermission(module, roleKey, action)` — matches PermissionsPage call signature `togglePermission(row.module, roleKey, action)`
- `savePermissions()` — matches PermissionsPage call `savePermissions()`
- `products` array shape (id, name, category, price, stock, status, sku) — matches ProductsPage table columns
- `orders` array shape (id, customerName, total, status, paymentStatus) — matches OrdersPage table
- `customers` array shape (id, name, email, phone, tier, status) — matches CustomersPage table

### Import consistency
The final adminData.js import block after all tasks:
```js
import {
  admins as initialAdmins,
  auditLogs as initialAuditLogs,
  contentRows as initialContentRows,
  customers as initialCustomers,
  notificationFeed,
  orders as initialOrders,
  permissionMatrix as initialPermissionMatrix,
  products as initialProducts,
  recentActivities as initialRecentActivities,
  roles as initialRoles,
  users as initialUsers
} from "../constants/mockData";
```
