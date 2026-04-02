import { Link } from "react-router-dom";
import { usePageTitle } from "../../hooks/usePageTitle";
import { useI18n } from "../../i18n";

export function ResetPasswordPage() {
  const { t } = useI18n();
  usePageTitle(t("auth.resetPasswordTitle"));

  return (
    <section className="auth-shell">
      <div className="auth-card auth-card-single">
        <p className="eyebrow">{t("auth.resetPasswordEyebrow")}</p>
        <h1>{t("auth.resetPasswordTitle")}</h1>
        <p className="muted-text">{t("auth.resetPasswordDescription")}</p>
        <form className="auth-form">
          <label>
            {t("auth.newPassword")}
            <input type="password" placeholder={t("auth.enterNewPassword")} />
          </label>
          <label>
            {t("auth.confirmPassword")}
            <input type="password" placeholder={t("auth.repeatPassword")} />
          </label>
          <button type="button">{t("auth.saveNewPassword")}</button>
        </form>
        <Link className="text-link" to="/login">
          {t("common.backToLogin")}
        </Link>
      </div>
    </section>
  );
}
