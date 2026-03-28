import { Link } from "react-router-dom";
import { usePageTitle } from "../../hooks/usePageTitle";
import { useI18n } from "../../i18n";

export function NotFoundPage() {
  const { t } = useI18n();
  usePageTitle(t("notFound.pageTitle"));

  return (
    <section className="auth-shell">
      <div className="auth-card">
        <p className="eyebrow">404</p>
        <h1>{t("notFound.title")}</h1>
        <p className="muted-text">{t("notFound.description")}</p>
        <Link className="inline-link" to="/dashboard">
          {t("notFound.openDashboard")}
        </Link>
      </div>
    </section>
  );
}
