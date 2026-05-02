import { useState } from "react";
import { useI18n } from "../../i18n";
import { useAuth } from "../../store";
import { useAdminData } from "../../store/adminData";
import { useTheme } from "../../theme";

export function SettingsPage() {
  const { locale, setLocale, supportedLocales, t } = useI18n();
  const { profile, updateProfile } = useAuth();
  const { saveSettings } = useAdminData();
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [form, setForm] = useState({
    name: profile?.name || "",
    email: profile?.email || "",
    sessionTimeout: "30",
    language: locale,
    theme
  });

  function handleSave() {
    updateProfile({ name: form.name, email: form.email });
    setLocale(form.language);
    setTheme(form.theme);
    saveSettings(t("settings.profileSettings"));
  }

  return (
    <div className="max-w-4xl space-y-5">
      <div className="bg-white rounded-2xl shadow-card">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">{t("settings.pageTitle")}</h2>
          <p className="text-xs text-gray-400 mt-0.5">{t("settings.description")}</p>
        </div>

        <div className="flex gap-1 px-5 pt-4 border-b border-gray-100">
          {[t("settings.profileSettings"), t("settings.notificationSettings"), t("settings.securitySettings")].map((tab, i) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(i)}
              className={`px-4 py-2 text-sm rounded-t-xl transition-colors ${
                activeTab === i
                  ? "bg-primary text-white font-medium"
                  : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="p-5">
          {activeTab === 0 && (
            <div className="space-y-4 max-w-md">
              {[
                { l: t("settings.displayName"), n: "name", tp: "text" },
                { l: t("common.email"), n: "email", tp: "email" }
              ].map((f) => (
                <div key={f.n}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{f.l}</label>
                  <input
                    type={f.tp}
                    value={form[f.n]}
                    onChange={(e) => setForm((c) => ({ ...c, [f.n]: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              ))}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t("settings.sessionTimeout")}</label>
                <select
                  value={form.sessionTimeout}
                  onChange={(e) => setForm((c) => ({ ...c, sessionTimeout: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 bg-white"
                >
                  <option value="15">15 daqiqa</option>
                  <option value="30">30 daqiqa</option>
                  <option value="60">1 soat</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t("settings.languagePreference")}</label>
                <select
                  value={form.language}
                  onChange={(e) => setForm((c) => ({ ...c, language: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 bg-white"
                >
                  {supportedLocales.map((code) => (
                    <option key={code} value={code}>
                      {t(`languages.${code}`)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">{t("settings.themePreference")}</label>
                <div className="w-full px-3 py-2 text-sm border border-gray-700 rounded-xl bg-slate-800 text-white">
                  {t("settings.themeManagedBySystem")}
                </div>
              </div>

              <button
                type="button"
                onClick={handleSave}
                className="px-5 py-2.5 bg-primary hover:bg-primary-dark text-white text-sm font-medium rounded-xl transition-colors"
              >
                {t("common.saveChanges")}
              </button>
            </div>
          )}

          {activeTab === 1 && (
            <div className="space-y-3">
              {[
                { l: t("settings.notificationSettings"), d: t("users.createUser") },
                { l: t("settings.securityNote"), d: t("settings.securitySettings") },
                { l: t("reports.overview"), d: t("settings.profileSettings") }
              ].map((item) => (
                <div key={item.l} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{item.l}</p>
                    <p className="text-xs text-gray-400">{item.d}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-10 h-6 bg-gray-200 rounded-full peer peer-checked:bg-primary transition-colors" />
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-4 transition-transform shadow-sm" />
                  </label>
                </div>
              ))}
            </div>
          )}

          {activeTab === 2 && (
            <div className="space-y-4 max-w-md">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t("common.password")}</label>
                <input
                  type="password"
                  placeholder="********"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t("auth.newPassword")}</label>
                <input
                  type="password"
                  placeholder="********"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t("auth.confirmPassword")}</label>
                <input
                  type="password"
                  placeholder="********"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-100 rounded-xl">
                <span className="text-yellow-500 mt-0.5">!</span>
                <p className="text-xs text-yellow-700">
                  {t("settings.securityNote")}
                  <button type="button" className="block mt-1 text-primary hover:underline">
                    {t("profile.twoFa")} -
                  </button>
                </p>
              </div>
              <button
                type="button"
                className="px-5 py-2.5 bg-primary hover:bg-primary-dark text-white text-sm font-medium rounded-xl transition-colors"
              >
                {t("auth.saveNewPassword")}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
