import { useMemo, useState } from "react";
import { useAdminData } from "../../store/adminData";
import { useI18n } from "../../i18n";

const catStyle = {
  admin:    "bg-blue-100 text-blue-700",
  user:     "bg-green-100 text-green-700",
  content:  "bg-purple-100 text-purple-700",
  settings: "bg-orange-100 text-orange-700",
  auth:     "bg-red-100 text-red-700",
  permission:"bg-yellow-100 text-yellow-700"
};

export function AuditLogsPage() {
  const { auditLogs } = useAdminData();
  const { t } = useI18n();
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");

  const filtered = useMemo(() =>
    auditLogs.filter((row) => {
      const haystack = [row.action, row.actor, row.target, row.ip].join(" ").toLowerCase();
      return (
        haystack.includes(search.toLowerCase()) &&
        (catFilter === "all" || row.category === catFilter)
      );
    }),
    [auditLogs, search, catFilter]
  );

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-gray-100">
          <div>
            <h2 className="font-semibold text-gray-900">{t("audit.title")}</h2>
            <p className="text-xs text-gray-400 mt-0.5">{t("navigation.pageMeta.auditLogs.eyebrow")}</p>
          </div>
          <button
            type="button"
            className="px-4 py-2 text-sm border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors shrink-0"
          >
            {t("common.exportCsv")}
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 px-5 py-3 bg-gray-50 border-b border-gray-100">
          <input
            type="search"
            placeholder={t("audit.searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 min-w-[160px] px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
          />
          <select
            value={catFilter}
            onChange={(e) => setCatFilter(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 bg-white"
          >
            <option value="all">{t("audit.allActions")}</option>
            <option value="admin">{t("audit.adminActions")}</option>
            <option value="user">{t("audit.userActions")}</option>
            <option value="content">{t("audit.contentActions")}</option>
            <option value="settings">{t("audit.settingsActions")}</option>
            <option value="auth">{t("audit.authActions")}</option>
            <option value="permission">{t("audit.permissionChanges")}</option>
          </select>
        </div>

        {/* Table */}
        <div className="table-scroll">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {[t("audit.action"), t("common.type"), t("audit.actor"), t("audit.target"), t("audit.ipAddress"), t("audit.timestamp")].map((h) => (
                  <th key={h} className="text-left text-xs font-medium text-gray-400 px-4 py-3 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={row.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-800">{row.action}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${catStyle[row.category] || "bg-gray-100 text-gray-600"}`}>
                      {row.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{row.actor}</td>
                  <td className="px-4 py-3 text-gray-500">{row.target}</td>
                  <td className="px-4 py-3 text-xs text-gray-400 font-mono">{row.ip}</td>
                  <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">{row.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!filtered.length && (
            <div className="py-16 text-center">
              <p className="text-gray-400 text-sm">{t("audit.noAudit")}</p>
              <p className="text-gray-300 text-xs mt-1">{t("audit.noAuditDescription")}</p>
            </div>
          )}
        </div>
        <div className="px-5 py-3 border-t border-gray-100 text-xs text-gray-400">
          {filtered.length} {t("audit.pageTitle").toLowerCase()}
        </div>
      </div>
    </div>
  );
}
