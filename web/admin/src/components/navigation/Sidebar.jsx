import { NavLink } from "react-router-dom";
import { appConfig } from "../../config/appConfig";
import { sidebarMenu } from "../../constants/menu";

export function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="sidebar-brand-mark">SE</span>
        <div>
          <p className="sidebar-brand-name">{appConfig.appName}</p>
          <p className="sidebar-brand-copy">Management workspace</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        {sidebarMenu.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
