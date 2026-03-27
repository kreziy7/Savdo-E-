import { Outlet } from "react-router-dom";
import { Header } from "../components/navigation/Header";
import { Sidebar } from "../components/navigation/Sidebar";

export function AdminLayout() {
  return (
    <div className="admin-shell">
      <Sidebar />
      <div className="admin-content">
        <Header />
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
