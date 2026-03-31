import { usePageTitle } from "../../hooks/usePageTitle";
import { useI18n } from "../../i18n";

export function CustomersPage() {
  const { t } = useI18n();
  usePageTitle(t("navigation.pageMeta.customers.eyebrow"));

  return (
    <section className="stack">
      <div className="section-card">
        <h2>{t("navigation.pageMeta.customers.eyebrow")}</h2>
        <p className="muted-text">{t("navigation.pageMeta.customers.description")}</p>
      </div>
    </section>
  );
}
