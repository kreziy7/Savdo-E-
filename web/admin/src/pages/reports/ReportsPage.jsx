import { reportCards } from "../../constants/mockData";
import { usePageTitle } from "../../hooks/usePageTitle";
import { useI18n } from "../../i18n";
import { useAuth } from "../../store";

export function ReportsPage() {
  const { t } = useI18n();
  usePageTitle(t("reports.pageTitle"));
  const { hasPermission } = useAuth();

  return (
    <section className="stack">
      <div className="section-card">
        <div className="section-heading">
          <div>
            <h2>{t("reports.title")}</h2>
            <p className="muted-text">{t("reports.description")}</p>
          </div>
          <div className="button-row">
            <button type="button">{t("common.applyFilter")}</button>
            {hasPermission("reports.export") ? (
              <button type="button" className="secondary-button">
                {t("common.exportCsv")}
              </button>
            ) : null}
          </div>
        </div>

        <div className="filter-bar">
          <input type="date" defaultValue="2026-03-01" />
          <input type="date" defaultValue="2026-03-27" />
          <select defaultValue="overview">
            <option value="overview">{t("reports.overview")}</option>
            <option value="admin-activity">{t("reports.adminActivity")}</option>
            <option value="security">{t("reports.security")}</option>
          </select>
        </div>

        <div className="feature-grid">
          {reportCards.map((item) => (
            <article className="feature-card" key={item.titleKey}>
              <strong>{t(item.titleKey)}</strong>
              <h3>{item.value}</h3>
              <p className="muted-text">{t(item.noteKey)}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
