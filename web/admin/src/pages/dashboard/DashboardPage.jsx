import { dashboardHighlights } from "../../constants/mockData";
import { usePageTitle } from "../../hooks/usePageTitle";
import { useI18n } from "../../i18n";
import { formatRelativeTime, getPriorityLabel } from "../../i18n/labels";
import { useAuth } from "../../store";
import { useAdminData } from "../../store/adminData";

export function DashboardPage() {
  const { t } = useI18n();
  usePageTitle(t("dashboard.pageTitle"));
  const { profile } = useAuth();
  const { users, admins, auditLogs, notificationFeed, recentActivity } =
    useAdminData();

  const stats = [
    {
      label: t("dashboard.stats.totalUsers"),
      value: String(users.length).padStart(2, "0"),
      delta: t("dashboard.stats.activeCount", {
        count: users.filter((item) => item.status === "active").length
      }),
      tone: "info"
    },
    {
      label: t("dashboard.stats.admins"),
      value: String(admins.length).padStart(2, "0"),
      delta: t("dashboard.stats.activeCount", {
        count: admins.filter((item) => item.status === "active").length
      }),
      tone: "success"
    },
    {
      label: t("dashboard.stats.auditLogs"),
      value: String(auditLogs.length).padStart(2, "0"),
      delta: t("dashboard.stats.liveTrail"),
      tone: "warning"
    },
    {
      label: t("dashboard.stats.notifications"),
      value: String(notificationFeed.length).padStart(2, "0"),
      delta: t("dashboard.stats.actionableItems"),
      tone: "danger"
    }
  ];

  return (
    <section className="page-grid">
      <div className="hero-card hero-grid">
        <div>
          <p className="eyebrow">{t("dashboard.heroEyebrow")}</p>
          <h2>
            {profile?.role === "super_admin"
              ? t("dashboard.superAdminTitle")
              : t("dashboard.adminTitle")}
          </h2>
          <p className="muted-text">{t("dashboard.heroDescription")}</p>
        </div>

        <div className="hero-panel">
          <span className="hero-pill">{t("dashboard.pillCrud")}</span>
          <span className="hero-pill">{t("dashboard.pillAudit")}</span>
          <span className="hero-pill">{t("dashboard.pillToast")}</span>
          <span className="hero-pill">{t("dashboard.pillRoleAware")}</span>
        </div>
      </div>

      <div className="stats-grid">
        {stats.map((item) => (
          <article className="stat-card" key={item.label}>
            <p>{item.label}</p>
            <strong>{item.value}</strong>
            <span className={`delta-badge ${item.tone}`}>{item.delta}</span>
          </article>
        ))}
      </div>

      <div className="content-grid">
        <article className="section-card">
          <div className="section-heading">
            <h2>{t("dashboard.recentActivity")}</h2>
            <span className="section-chip">{t("dashboard.liveStructure")}</span>
          </div>

          <div className="timeline">
            {recentActivity.map((item, index) => (
              <div className="timeline-item" key={`${item.titleKey}-${index}`}>
                <span className={`timeline-dot ${item.tone}`} />
                <div>
                  <strong>{t(item.titleKey)}</strong>
                  <p className="muted-text">
                    {t(item.detailKey, item.detailValues || {})}
                  </p>
                  <small>{formatRelativeTime(t, item.time)}</small>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="section-card">
          <div className="section-heading">
            <h2>{t("dashboard.notificationsTitle")}</h2>
            <span className="section-chip">{t("dashboard.priorityFeed")}</span>
          </div>

          <div className="stack compact-stack">
            {notificationFeed.map((item) => (
              <div className="notice-card" key={item.titleKey}>
                <div>
                  <strong>{t(item.titleKey)}</strong>
                  <p className="muted-text">{t(item.detailKey)}</p>
                </div>
                <span className="priority-badge">
                  {getPriorityLabel(t, item.priority)}
                </span>
              </div>
            ))}
          </div>
        </article>
      </div>

      <article className="section-card">
        <div className="section-heading">
          <h2>{t("dashboard.checkpoints")}</h2>
          <span className="section-chip">{t("dashboard.planAlignment")}</span>
        </div>

        <div className="feature-grid">
          {dashboardHighlights.map((item) => (
            <div className="feature-card" key={item.id}>
              <strong>{t(item.titleKey)}</strong>
              <p className="muted-text">{t(item.descriptionKey)}</p>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}
