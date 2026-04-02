import { useState } from "react";
import { Modal } from "../../components/shared/Modal";
import { useAdminData } from "../../store/adminData";
import { useI18n } from "../../i18n";

const statusStyle = {
  active:    "bg-green-100 text-green-700",
  suspended: "bg-red-100 text-red-700",
  invited:   "bg-yellow-100 text-yellow-700"
};

export function AdminsPage() {
  const { admins, toggleAdminStatus } = useAdminData();
  const { t } = useI18n();
  const [confirmTarget, setConfirmTarget] = useState(null);

  // Bosh adminni ro'yxatdan olib, boshqalarni ko'rsatamiz
  const otherAdmins = admins.filter((a) => !a.isPrimary);

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">{t("admins.title")}</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            {t("admins.description")}
          </p>
        </div>

        {/* Info callout */}
        <div className="mx-5 my-3 flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
          <span className="text-blue-400 text-base mt-0.5">ℹ</span>
          <div>
            <p className="text-sm font-medium text-blue-800">{t("admins.singletonTitle")}</p>
            <p className="text-xs text-blue-600 mt-0.5">{t("admins.singletonDescription")}</p>
          </div>
        </div>

        {/* Table */}
        <div className="table-scroll">
          {otherAdmins.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-gray-400 text-sm">{t("audit.noAudit")}</p>
              <p className="text-gray-300 text-xs mt-1">{t("audit.noAuditDescription")}</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {[t("admins.adminColumn"), t("common.status"), t("common.lastActive"), t("common.createdBy"), t("common.actions")].map((h) => (
                    <th key={h} className="text-left text-xs font-medium text-gray-400 px-4 py-3 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {otherAdmins.map((admin) => (
                  <tr key={admin.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-xs flex items-center justify-center shrink-0">
                          {admin.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{admin.name}</p>
                          <p className="text-xs text-gray-400">{admin.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusStyle[admin.status] || "bg-gray-100 text-gray-600"}`}>
                        {t(`labels.statuses.${admin.status}`, {}, admin.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">
                      {admin.lastActive || "—"}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400">
                      {admin.createdBy}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => setConfirmTarget(admin)}
                        className={`text-xs font-medium transition-colors
                          ${admin.status === "suspended"
                            ? "text-green-600 hover:text-green-800"
                            : "text-orange-500 hover:text-orange-700"}`}
                      >
                        {admin.status === "suspended" ? t("admins.activate") : t("admins.suspend")}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="px-5 py-3 border-t border-gray-100 text-xs text-gray-400">
          {otherAdmins.length} {t("admins.pageTitle").toLowerCase()}
        </div>
      </div>

      {/* Confirm modal */}
      <Modal
        open={Boolean(confirmTarget)}
        title={confirmTarget?.status === "suspended" ? t("admins.activate") : t("admins.suspend")}
        description={confirmTarget?.name}
        onClose={() => setConfirmTarget(null)}
        footer={
          <>
            <button type="button" onClick={() => setConfirmTarget(null)} className="px-4 py-2 text-sm border border-gray-200 rounded-xl hover:bg-gray-50">{t("common.cancel")}</button>
            <button
              type="button"
              onClick={() => { toggleAdminStatus(confirmTarget.id); setConfirmTarget(null); }}
              className={`px-4 py-2 text-white text-sm font-medium rounded-xl transition-colors
                ${confirmTarget?.status === "suspended" ? "bg-green-600 hover:bg-green-700" : "bg-orange-500 hover:bg-orange-600"}`}
            >
              {confirmTarget?.status === "suspended" ? t("admins.activate") : t("admins.suspend")}
            </button>
          </>
        }
      >
        <p className="text-sm text-gray-500">{t("admins.modalDescription")}</p>
      </Modal>
    </div>
  );
}
