import { Link } from "react-router-dom";
import { useI18n } from "../../i18n";

export function NotFoundPage() {
  const { t } = useI18n();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#eef4f9]">
      <div className="text-center">
        <p className="text-7xl font-bold text-gray-200 mb-4">404</p>
        <h1 className="text-xl font-semibold text-gray-700 mb-2">{t("notFound.title")}</h1>
        <p className="text-sm text-gray-400 mb-6">{t("notFound.description")}</p>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-dark text-white text-sm font-medium rounded-xl transition-colors"
        >
          {"<-"} {t("notFound.openDashboard")}
        </Link>
      </div>
    </div>
  );
}
