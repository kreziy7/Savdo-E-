import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { usePageTitle } from "../../hooks/usePageTitle";
import { useI18n } from "../../i18n";
import { useAuth } from "../../store";

export function LoginPage() {
  const { t } = useI18n();
  usePageTitle(t("auth.signIn"));
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, login } = useAuth();
  const [form, setForm] = useState({
    email: "superadmin@savdo.uz",
    password: "12345678"
  });

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const nextRoute = location.state?.from || "/dashboard";

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function signIn(role) {
    const email =
      role === "super_admin" ? "superadmin@savdo.uz" : "admin@savdo.uz";

    login({
      email,
      password: form.password,
      role
    });

    navigate(nextRoute, { replace: true });
  }

  function handleSubmit(event) {
    event.preventDefault();

    login({
      email: form.email,
      password: form.password
    });

    navigate(nextRoute, { replace: true });
  }

  return (
    <section className="auth-shell">
      <div className="auth-surface">
        <div className="auth-hero">
          <p className="eyebrow">{t("auth.heroEyebrow")}</p>
          <h1>{t("auth.heroTitle")}</h1>
          <p className="muted-text">{t("auth.heroDescription")}</p>
          <div className="auth-points">
            <div className="auth-point">
              <strong>{t("auth.routeProtectionTitle")}</strong>
              <span>{t("auth.routeProtectionDescription")}</span>
            </div>
            <div className="auth-point">
              <strong>{t("auth.roleMenuTitle")}</strong>
              <span>{t("auth.roleMenuDescription")}</span>
            </div>
            <div className="auth-point">
              <strong>{t("auth.singletonTitle")}</strong>
              <span>{t("auth.singletonDescription")}</span>
            </div>
          </div>
        </div>

        <div className="auth-card">
          <p className="eyebrow">{t("auth.cardEyebrow")}</p>
          <h1>{t("auth.signIn")}</h1>
          <p className="muted-text">{t("auth.signInDescription")}</p>
          <form className="auth-form" onSubmit={handleSubmit}>
            <label>
              {t("common.email")}
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="admin@savdo.uz"
              />
            </label>
            <label>
              {t("common.password")}
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder={t("auth.enterPassword")}
              />
            </label>

            <div className="button-row">
              <button type="submit">{t("auth.continue")}</button>
              <button
                type="button"
                className="secondary-button"
                onClick={() => signIn("admin")}
              >
                {t("auth.demoAdmin")}
              </button>
              <button
                type="button"
                className="secondary-button"
                onClick={() => signIn("super_admin")}
              >
                {t("auth.demoSuperAdmin")}
              </button>
            </div>
          </form>

          <div className="login-hint">
            <span>{t("auth.demoAccounts")}</span>
            <strong>`admin@savdo.uz` / `superadmin@savdo.uz`</strong>
          </div>

          <div className="auth-links">
            <Link className="text-link" to="/forgot-password">
              {t("auth.forgotPassword")}
            </Link>
            <Link className="text-link" to="/reset-password">
              {t("auth.resetPassword")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
