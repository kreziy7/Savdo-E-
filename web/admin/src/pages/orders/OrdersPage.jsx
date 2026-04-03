import { usePageTitle } from "../../hooks/usePageTitle";
import { useI18n } from "../../i18n";

export function OrdersPage() {
  const { t } = useI18n();
  usePageTitle(t("navigation.pageMeta.orders.eyebrow"));

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">{t("navigation.pageMeta.orders.eyebrow")}</h2>
          <p className="text-xs text-gray-400 mt-0.5">{t("navigation.pageMeta.orders.description")}</p>
        </div>
        <div className="px-5 py-16 text-center">
          <p className="text-gray-400 text-sm">{t("navigation.pageMeta.orders.description")}</p>
        </div>
      </div>
    </div>
  );
}
