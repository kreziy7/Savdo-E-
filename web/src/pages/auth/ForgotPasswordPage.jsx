import { Link } from "react-router-dom";
import { usePageTitle } from "../../hooks/usePageTitle";
import { useI18n } from "../../i18n";

export function ForgotPasswordPage() {
  const { t } = useI18n();
  usePageTitle(t("auth.forgotPasswordTitle"));

  return (
    <section className="auth-shell">
      <div className="auth-card auth-card-single">
        <p className="eyebrow">{t("auth.forgotPasswordEyebrow")}</p>
        <h1>{t("auth.forgotPasswordTitle")}</h1>
        <p className="muted-text">{t("auth.forgotPasswordDescription")}</p>
        <form className="auth-form">
          <label>
            {t("auth.workEmail")}
            <input type="email" placeholder="admin@savdo.uz" />
          </label>
          <button type="button">{t("auth.sendResetLink")}</button>
        </form>
        <Link className="text-link" to="/login">
          {t("common.backToLogin")}
        </Link>
      </div>
    </section>
  );
}
