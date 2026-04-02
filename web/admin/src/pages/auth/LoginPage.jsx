import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../store";
import { useI18n } from "../../i18n";

export function LoginPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, login } = useAuth();
  const { t } = useI18n();
  const [form, setForm] = useState({ email: "admin@savdo.uz", password: "12345678" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const nextRoute = location.state?.from || "/dashboard";

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login({ email: form.email, password: form.password });
      navigate(nextRoute, { replace: true });
    } catch (err) {
      setError(err?.message || "Email yoki parol noto'g'ri");
      setLoading(false);
    }
  }

  async function quickLogin(email) {
    setError("");
    try {
      await login({ email, password: "12345678" });
      navigate(nextRoute, { replace: true });
    } catch (err) {
      setError(err?.message || "Kirish amalga oshmadi");
    }
  }

  return (
    <div className="min-h-screen flex bg-[#eef4f9]">
      <div className="hidden lg:flex flex-col justify-center px-16 w-[480px] bg-[#0e2037] text-white shrink-0">
        <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center font-bold text-lg mb-8">
          SE
        </div>
        <h1 className="text-3xl font-bold leading-tight mb-4">
          {t("app.name")}
          <br />
          {t("auth.cardEyebrow")}
        </h1>
        <p className="text-white/50 text-sm leading-relaxed mb-10">{t("auth.heroDescription")}</p>
        <div className="space-y-4">
          {[
            { titleKey: "auth.routeProtectionTitle", descKey: "auth.routeProtectionDescription" },
            { titleKey: "auth.roleMenuTitle", descKey: "auth.roleMenuDescription" },
            { titleKey: "auth.singletonTitle", descKey: "auth.singletonDescription" }
          ].map((item) => (
            <div key={item.titleKey} className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-primary/30 flex items-center justify-center text-xs mt-0.5">v</span>
              <div>
                <p className="text-sm font-medium">{t(item.titleKey)}</p>
                <p className="text-xs text-white/40">{t(item.descKey)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="bg-white rounded-2xl shadow-card p-8">
            <p className="text-xs font-medium text-primary uppercase tracking-wider mb-2">{t("common.adminPanel")}</p>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">{t("auth.signIn")}</h2>
            <p className="text-sm text-gray-500 mb-6">{t("auth.signInDescription")}</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t("common.email")}</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                  placeholder="admin@savdo.uz"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t("common.password")}</label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                  placeholder={t("auth.enterPassword")}
                />
              </div>

              {error && (
                <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-primary hover:bg-primary-dark text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-60"
              >
                {loading ? t("auth.continue") : t("auth.signIn")}
              </button>
            </form>

            <div className="mt-5 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-400 mb-3 text-center">{t("auth.demoAccounts")}</p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => quickLogin("admin@savdo.uz")}
                  className="flex-1 py-2 text-xs font-medium border border-primary/30 text-primary rounded-lg hover:bg-primary/5 transition-colors"
                >
                  {t("auth.demoSuperAdmin")}
                </button>
                <button
                  type="button"
                  onClick={() => quickLogin("staff@savdo.uz")}
                  className="flex-1 py-2 text-xs font-medium border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {t("auth.demoAdmin")}
                </button>
              </div>
            </div>

            <div className="mt-4 flex justify-between">
              <Link to="/forgot-password" className="text-xs text-gray-400 hover:text-primary transition-colors">
                {t("auth.forgotPassword")}
              </Link>
              <Link to="/reset-password" className="text-xs text-gray-400 hover:text-primary transition-colors">
                {t("auth.resetPassword")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
