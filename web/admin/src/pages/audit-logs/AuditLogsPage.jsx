import { useMemo, useState } from "react";
import { usePageTitle } from "../../hooks/usePageTitle";
import { useI18n } from "../../i18n";
import { useAdminData } from "../../store/adminData";

export function AuditLogsPage() {
  const { t } = useI18n();
  usePageTitle(t("audit.pageTitle"));
  const { auditLogs } = useAdminData();
  const [search, setSearch] = useState("");
  const [selectedAction, setSelectedAction] = useState("all");

  const filteredLogs = useMemo(
    () =>
      auditLogs.filter((row) => {
        const haystack = [
          t(row.actionKey),
          row.actor,
          row.target,
          row.ip
        ]
          .join(" ")
          .toLowerCase();
        const matchesSearch = haystack.includes(search.toLowerCase());
        const matchesAction =
          selectedAction === "all" || row.category === selectedAction;

        return matchesSearch && matchesAction;
      }),
    [auditLogs, search, selectedAction, t]
  );

  return (
    <section className="stack">
      <div className="section-card">
        <div className="section-heading">
          <div>
            <h2>{t("audit.title")}</h2>
            <p className="muted-text">{t("audit.description")}</p>
          </div>
          <button type="button">{t("common.exportLogs")}</button>
        </div>

        <div className="filter-bar">
          <input
            type="search"
            placeholder={t("audit.searchPlaceholder")}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <select
            value={selectedAction}
            onChange={(event) => setSelectedAction(event.target.value)}
          >
            <option value="all">{t("audit.allActions")}</option>
            <option value="permission">{t("audit.permissionChanges")}</option>
            <option value="user">{t("audit.userActions")}</option>
            <option value="admin">{t("audit.adminActions")}</option>
            <option value="content">{t("audit.contentActions")}</option>
            <option value="settings">{t("audit.settingsActions")}</option>
            <option value="auth">{t("audit.authActions")}</option>
          </select>
          <input type="date" defaultValue="2026-03-27" />
        </div>

        <div className="table-shell">
          <table className="data-table">
            <thead>
              <tr>
                <th>{t("audit.action")}</th>
                <th>{t("audit.actor")}</th>
                <th>{t("audit.target")}</th>
                <th>{t("audit.ipAddress")}</th>
                <th>{t("audit.timestamp")}</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((row) => (
                <tr key={`${row.actionKey}-${row.timestamp}-${row.target}`}>
                  <td>{t(row.actionKey)}</td>
                  <td>{row.actor}</td>
                  <td>{row.target}</td>
                  <td>{row.ip}</td>
                  <td>{row.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!filteredLogs.length ? (
          <div className="empty-state">
            <strong>{t("audit.noAudit")}</strong>
            <p className="muted-text">{t("audit.noAuditDescription")}</p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
