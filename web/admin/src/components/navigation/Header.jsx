import { Link, useLocation } from "react-router-dom";
import { useI18n } from "../../i18n";
import { useAuth } from "../../store";
import { getBreadcrumbs, getPageMeta } from "../../utils/nav";

export function Header({ onMenuToggle }) {
  const location = useLocation();
  const { logout, profile } = useAuth();
  const { locale, setLocale, supportedLocales, t } = useI18n();
  const meta = getPageMeta(location.pathname, t);
  const breadcrumbs = getBreadcrumbs(location.pathname, t);

  return (
    <header className="topbar">
      <div className="topbar-title">
        <button className="menu-toggle" type="button" onClick={onMenuToggle}>
          {t("common.menu")}
        </button>
        <div>
          <p className="eyebrow">{meta.eyebrow}</p>
          <h1>{meta.title}</h1>
          <p className="muted-text topbar-copy">{meta.description}</p>
        </div>
      </div>

      <div className="topbar-actions">
        <div className="breadcrumbs">
          {breadcrumbs.map((item) => (
            <Link key={item.path} to={item.path} className="breadcrumb-link">
              {item.label}
            </Link>
          ))}
        </div>

        <div className="topbar-card">
          <span className="status-dot" />
          <span>
            {profile?.role === "super_admin"
              ? t("access.full")
              : t("access.scoped")}
          </span>
        </div>

        <label className="language-switch">
          <span className="language-switch-label">{t("common.language")}</span>
          <select value={locale} onChange={(event) => setLocale(event.target.value)}>
            {supportedLocales.map((code) => (
              <option key={code} value={code}>
                {t(`languages.${code}`)}
              </option>
            ))}
          </select>
        </label>

        <button className="ghost-button" type="button" onClick={logout}>
          {t("common.signOut")}
        </button>
      </div>
    </header>
  );
}
