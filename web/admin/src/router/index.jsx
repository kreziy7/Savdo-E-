import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "../components/guards/ProtectedRoute";
import { RoleGuard } from "../components/guards/RoleGuard";
import { AdminLayout } from "../layouts/AdminLayout";
import { AdminsPage } from "../pages/admins/AdminsPage";
import { AuditLogsPage } from "../pages/audit-logs/AuditLogsPage";
import { ForgotPasswordPage } from "../pages/auth/ForgotPasswordPage";
import { LoginPage } from "../pages/auth/LoginPage";
import { ResetPasswordPage } from "../pages/auth/ResetPasswordPage";
import { ContentPage } from "../pages/content/ContentPage";
import { DashboardPage } from "../pages/dashboard/DashboardPage";
import { NotFoundPage } from "../pages/not-found/NotFoundPage";
import { PermissionsPage } from "../pages/permissions/PermissionsPage";
import { ProfilePage } from "../pages/profile/ProfilePage";
import { ReportsPage } from "../pages/reports/ReportsPage";
import { RolesPage } from "../pages/roles/RolesPage";
import { SettingsPage } from "../pages/settings/SettingsPage";
import { UserDetailPage } from "../pages/users/UserDetailPage";
import { UsersPage } from "../pages/users/UsersPage";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/users/:id" element={<UserDetailPage />} />
            <Route path="/content" element={<ContentPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route
              path="/admins"
              element={
                <RoleGuard allow={["super_admin"]}>
                  <AdminsPage />
                </RoleGuard>
              }
            />
            <Route
              path="/roles"
              element={
                <RoleGuard allow={["super_admin"]}>
                  <RolesPage />
                </RoleGuard>
              }
            />
            <Route
              path="/permissions"
              element={
                <RoleGuard allow={["super_admin"]}>
                  <PermissionsPage />
                </RoleGuard>
              }
            />
            <Route
              path="/audit-logs"
              element={
                <RoleGuard allow={["super_admin"]}>
                  <AuditLogsPage />
                </RoleGuard>
              }
            />
          </Route>
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
