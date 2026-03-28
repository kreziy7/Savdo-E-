import { profileSections } from "../../constants/mockData";
import { usePageTitle } from "../../hooks/usePageTitle";
import { useI18n } from "../../i18n";
import { formatRelativeTime, getRoleLabel, getStatusLabel } from "../../i18n/labels";
import { useAuth } from "../../store";
import { useAdminData } from "../../store/adminData";

export function ProfilePage() {
  const { t } = useI18n();
  usePageTitle(t("profile.pageTitle"));
  const { profile } = useAuth();
  const { auditLogs } = useAdminData();

  return (
    <section className="detail-grid">
      <article className="section-card">
        <div className="section-heading">
          <div>
            <h2>{profile?.name}</h2>
            <p className="muted-text">
              {profile?.titleKey ? t(profile.titleKey) : profile?.title} | {profile?.email}
            </p>
          </div>
          <span className="table-badge info">
            {getRoleLabel(t, profile?.role)}
          </span>
        </div>

        <div className="key-value-grid">
          <div>
            <span>{t("common.status")}</span>
            <strong>{getStatusLabel(t, profile?.status)}</strong>
          </div>
          <div>
            <span>{t("common.lastLogin")}</span>
            <strong>{formatRelativeTime(t, profile?.lastLogin)}</strong>
          </div>
          <div>
            <span>{t("common.permissions")}</span>
            <strong>
              {t("profile.permissionsConnected", {
                count: profile?.permissions?.length || 0
              })}
            </strong>
          </div>
          <div>
            <span>{t("profile.twoFa")}</span>
            <strong>{t("profile.architectureReady")}</strong>
          </div>
          <div>
            <span>{t("profile.recentAuditEntries")}</span>
            <strong>
              {t("profile.visibleInPanel", { count: auditLogs.slice(0, 3).length })}
            </strong>
          </div>
        </div>
      </article>

      <article className="section-card">
        <div className="section-heading">
          <h2>{t("profile.modules")}</h2>
          <span className="section-chip">{t("profile.plannedSections")}</span>
        </div>

        <div className="feature-grid">
          {profileSections.map((section) => (
            <div className="feature-card" key={section.titleKey}>
              <strong>{t(section.titleKey)}</strong>
              <ul className="clean-list">
                {t(section.itemsKey, {}, []).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}
