import { useEffect, useState } from "react";
import { usePageTitle } from "../../hooks/usePageTitle";
import { useI18n } from "../../i18n";
import { useAdminData } from "../../store/adminData";
import { useAuth } from "../../store";

export function SettingsPage() {
  const { locale, setLocale, supportedLocales, t } = useI18n();
  usePageTitle(t("settings.pageTitle"));
  const { profile, updateProfile } = useAuth();
  const { saveSettings } = useAdminData();
  const isSuperAdmin = profile?.role === "super_admin";
  const [formState, setFormState] = useState({
    name: profile?.name || "",
    email: profile?.email || "",
    sessionTimeout: "30",
    language: locale,
    note: t("settings.noteDefault")
  });

  useEffect(() => {
    setFormState((current) => ({
      ...current,
      language: locale,
      note: current.note ? current.note : t("settings.noteDefault")
    }));
  }, [locale, t]);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormState((current) => ({ ...current, [name]: value }));
  }

  function handleSave() {
    updateProfile({
      name: formState.name,
      email: formState.email
    });
    setLocale(formState.language);
    saveSettings(t("navigation.menu.settings.label"));
  }

  return (
    <section className="detail-grid">
      <article className="section-card">
        <div className="section-heading">
          <div>
            <h2>{t("settings.tabsTitle")}</h2>
            <p className="muted-text">{t("settings.description")}</p>
          </div>
          <button type="button" onClick={handleSave}>
            {t("common.saveChanges")}
          </button>
        </div>

        <div className="settings-tabs">
          <button type="button" className="settings-tab active">
            {t("settings.profileSettings")}
          </button>
          <button type="button" className="settings-tab">
            {t("settings.notificationSettings")}
          </button>
          <button type="button" className="settings-tab">
            {t("settings.securitySettings")}
          </button>
          {isSuperAdmin ? (
            <button type="button" className="settings-tab">
              {t("settings.systemSettings")}
            </button>
          ) : null}
        </div>

        <div className="settings-form">
          <label>
            {t("settings.displayName")}
            <input
              type="text"
              name="name"
              value={formState.name}
              onChange={handleChange}
            />
          </label>
          <label>
            {t("common.email")}
            <input
              type="email"
              name="email"
              value={formState.email}
              onChange={handleChange}
            />
          </label>
          <label>
            {t("settings.sessionTimeout")}
            <select
              name="sessionTimeout"
              value={formState.sessionTimeout}
              onChange={handleChange}
            >
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="60">60 minutes</option>
            </select>
          </label>
          <label>
            {t("settings.languagePreference")}
            <select name="language" value={formState.language} onChange={handleChange}>
              {supportedLocales.map((code) => (
                <option key={code} value={code}>
                  {t(`languages.${code}`)}
                </option>
              ))}
            </select>
          </label>
          <label>
            {t("settings.securityNote")}
            <textarea
              rows="5"
              name="note"
              value={formState.note}
              onChange={handleChange}
            />
          </label>
        </div>
      </article>

      <article className="section-card">
        <div className="section-heading">
          <h2>{t("settings.systemReadiness")}</h2>
          <span className="section-chip">
            {isSuperAdmin ? t("settings.superAdminScope") : t("settings.adminScope")}
          </span>
        </div>

        <div className="stack compact-stack">
          <div className="notice-card">
            <div>
              <strong>{t("settings.authFlow")}</strong>
              <p className="muted-text">{t("settings.authFlowDescription")}</p>
            </div>
          </div>
          <div className="notice-card">
            <div>
              <strong>{t("settings.featureFlags")}</strong>
              <p className="muted-text">{t("settings.featureFlagsDescription")}</p>
            </div>
          </div>
          <div className="notice-card">
            <div>
              <strong>{t("settings.auditReadiness")}</strong>
              <p className="muted-text">{t("settings.auditReadinessDescription")}</p>
            </div>
          </div>
        </div>
      </article>
    </section>
  );
}
