import { useAuth } from "../../store";
import { useAdminData } from "../../store/adminData";
import { useI18n } from "../../i18n";

export function ProfilePage() {
  const { profile } = useAuth();
  const { auditLogs } = useAdminData();
  const { t } = useI18n();

  const myLogs = auditLogs.filter((l) => l.actor === profile?.name).slice(0, 5);

  const stats = [
    { l: t("common.status"), v: t(`labels.statuses.${profile?.status}`, {}, profile?.status) },
    { l: t("common.role"), v: profile?.isPrimary ? t("labels.roles.super_admin") : t("labels.roles.admin") },
    { l: t("common.permissions"), v: `${profile?.permissions?.length || 0}` },
    { l: t("profile.twoFa"), v: t("time.never") },
    { l: t("audit.title"), v: `${myLogs.length}` }
  ];

  return (
    <div className="max-w-3xl space-y-5">
      {/* Profile card */}
      <div className="bg-white rounded-2xl shadow-card p-6">
        <div className="flex items-start gap-5">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary font-bold text-2xl flex items-center justify-center shrink-0">
            {profile?.avatar || "A"}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-bold text-gray-900">{profile?.name}</h2>
              {profile?.isPrimary && (
                <span className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full font-medium">{t("labels.roles.super_admin")}</span>
              )}
            </div>
            <p className="text-sm text-gray-400 mt-1">{profile?.email}</p>
            <p className="text-xs text-green-500 mt-1 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              {t("labels.statuses.active")}
            </p>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-6">
          {stats.map((s) => (
            <div key={s.l} className="bg-gray-50 rounded-xl p-3 text-center">
              <p className="text-xs text-gray-400 mb-1">{s.l}</p>
              <p className="text-sm font-semibold text-gray-800">{s.v}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Permissions */}
      <div className="bg-white rounded-2xl shadow-card p-6">
        <h3 className="font-semibold text-gray-900 mb-3">{t("common.permissions")}</h3>
        <div className="flex flex-wrap gap-2">
          {(profile?.permissions || []).map((p) => (
            <span key={p} className="text-xs bg-blue-50 text-blue-600 px-2.5 py-1 rounded-lg font-mono">
              {p}
            </span>
          ))}
        </div>
      </div>

      {/* Recent activity */}
      <div className="bg-white rounded-2xl shadow-card p-6">
        <h3 className="font-semibold text-gray-900 mb-3">{t("profile.recentAuditEntries")}</h3>
        {myLogs.length === 0 ? (
          <p className="text-sm text-gray-400">{t("audit.noAudit")}</p>
        ) : (
          <div className="space-y-2">
            {myLogs.map((l) => (
              <div key={l.id} className="flex items-start justify-between gap-3 py-2 border-b border-gray-50">
                <div>
                  <p className="text-sm text-gray-800">{l.action}</p>
                  <p className="text-xs text-gray-400">{l.target}</p>
                </div>
                <span className="text-xs text-gray-300 whitespace-nowrap">{l.timestamp}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
