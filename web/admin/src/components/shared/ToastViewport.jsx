import { useAdminData } from "../../store/adminData";
import { useI18n } from "../../i18n";

export function ToastViewport() {
  const { toasts, dismissToast } = useAdminData();
  const { t } = useI18n();

  return (
    <div className="toast-viewport" aria-live="polite" aria-atomic="true">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast-card ${toast.tone || "success"}`}>
          <span>{t(toast.messageKey, toast.values)}</span>
          <button
            type="button"
            className="icon-button"
            onClick={() => dismissToast(toast.id)}
          >
            {t("common.dismiss")}
          </button>
        </div>
      ))}
    </div>
  );
}
