import { useState } from "react";
import { Outlet } from "react-router-dom";
import { ToastViewport } from "../components/shared/ToastViewport";
import { Header } from "../components/navigation/Header";
import { Sidebar } from "../components/navigation/Sidebar";

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-full min-h-screen" style={{ background: "var(--app-bg)" }}>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main area */}
      <div className="flex flex-col flex-1 min-w-0">
        <Header onMenuToggle={() => setSidebarOpen((v) => !v)} />
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      <ToastViewport />
    </div>
  );
}
