import { NavLink } from "react-router-dom";
import { appConfig } from "../../config/appConfig";
import { useI18n } from "../../i18n";
import { getMenuForRole } from "../../constants/menu";
import { useAuth } from "../../store";

export function Sidebar({ open, onClose }) {
  const { profile } = useAuth();
  const { t } = useI18n();
  const menuItems = getMenuForRole(profile?.role || "admin", t);

  return (
    <>
      <div
        className={`sidebar-backdrop${open ? " visible" : ""}`}
        onClick={onClose}
      />
      <aside className={`sidebar${open ? " open" : ""}`}>
        <div className="sidebar-brand">
          <span className="sidebar-brand-mark">SE</span>
          <div>
            <p className="sidebar-brand-name">{appConfig.appName}</p>
            <p className="sidebar-brand-copy">
              {profile?.role === "super_admin"
                ? t("workspace.superAdmin")
                : t("workspace.admin")}
            </p>
          </div>
        </div>

        <div className="sidebar-profile">
          <span className="sidebar-profile-avatar">{profile?.avatar}</span>
          <div>
            <p className="sidebar-profile-name">{profile?.name}</p>
            <p className="sidebar-profile-copy">
              {profile?.titleKey ? t(profile.titleKey) : profile?.title}
            </p>
          </div>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                isActive ? "sidebar-link active" : "sidebar-link"
              }
            >
              <span>{item.label}</span>
              <small>{item.description}</small>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
