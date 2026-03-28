import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Header } from "../components/navigation/Header";
import { Sidebar } from "../components/navigation/Sidebar";

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="admin-shell">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="admin-content">
        <Header onMenuToggle={() => setSidebarOpen((value) => !value)} />
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
