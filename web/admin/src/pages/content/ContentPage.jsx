import { useState } from "react";
import { Modal } from "../../components/shared/Modal";
import { useAdminData } from "../../store/adminData";
import { useI18n } from "../../i18n";

const statusStyle = {
  published: "bg-green-100 text-green-700",
  draft: "bg-yellow-100 text-yellow-700",
  archived: "bg-gray-100 text-gray-500"
};

const empty = { name: "", type: "landing_page", status: "draft", owner: "" };

export function ContentPage() {
  const { contentRows, createContent, updateContentStatus, deleteContent } = useAdminData();
  const { t } = useI18n();
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(empty);
  const [deleteTarget, setDeleteTarget] = useState(null);

  function closeModal() {
    setModalOpen(false);
    setForm(empty);
  }

  function handleSubmit(e) {
    e.preventDefault();
    createContent(form);
    closeModal();
  }

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-gray-100">
          <div>
            <h2 className="font-semibold text-gray-900">{t("content.title")}</h2>
            <p className="text-xs text-gray-400 mt-0.5">{t("navigation.pageMeta.content.eyebrow")}</p>
          </div>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="px-4 py-2 bg-primary hover:bg-primary-dark text-white text-sm font-medium rounded-xl transition-colors shrink-0"
          >
            + {t("content.createContent")}
          </button>
        </div>

        <div className="table-scroll">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {[t("common.name"), t("common.type"), t("common.status"), t("common.owner"), t("common.updatedAt"), t("common.actions")].map((header) => (
                  <th key={header} className="text-left text-xs font-medium text-gray-400 px-4 py-3 whitespace-nowrap">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {contentRows.map((row) => (
                <tr key={row.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-800">{row.name}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full">
                      {t(`labels.contentTypes.${row.type}`, {}, row.type)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusStyle[row.status] || "bg-gray-100 text-gray-600"}`}>
                      {t(`labels.statuses.${row.status}`, {}, row.status)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">{row.owner}</td>
                  <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">{row.updatedAt}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {row.status !== "published" && (
                        <button
                          type="button"
                          onClick={() => updateContentStatus(row.id, "published")}
                          className="text-xs text-green-600 hover:text-green-800 font-medium"
                        >
                          {t("content.publish")}
                        </button>
                      )}
                      {row.status !== "archived" && (
                        <button
                          type="button"
                          onClick={() => updateContentStatus(row.id, "archived")}
                          className="text-xs text-gray-400 hover:text-gray-600 font-medium"
                        >
                          {t("content.archive")}
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(row)}
                        className="text-xs text-danger hover:text-red-700 font-medium"
                      >
                        {t("common.delete")}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {!contentRows.length && (
            <div className="py-16 text-center">
              <p className="text-gray-400 text-sm">{t("content.noContent")}</p>
            </div>
          )}
        </div>

        <div className="px-5 py-3 border-t border-gray-100 text-xs text-gray-400">
          {contentRows.length} {t("content.pageTitle").toLowerCase()}
        </div>
      </div>

      <Modal
        open={modalOpen}
        title={t("content.createContent")}
        onClose={closeModal}
        footer={
          <>
            <button type="button" onClick={closeModal} className="px-4 py-2 text-sm border border-gray-200 rounded-xl hover:bg-gray-50">
              {t("common.cancel")}
            </button>
            <button type="submit" form="content-form" className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary-dark">
              {t("common.create")}
            </button>
          </>
        }
      >
        <form id="content-form" onSubmit={handleSubmit} className="space-y-3">
          {[{ l: t("common.name"), n: "name", tp: "text" }, { l: t("common.owner"), n: "owner", tp: "text" }].map((field) => (
            <div key={field.n}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{field.l}</label>
              <input
                type={field.tp}
                name={field.n}
                value={form[field.n]}
                required
                onChange={(e) => setForm((current) => ({ ...current, [e.target.name]: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t("common.type")}</label>
            <select
              value={form.type}
              onChange={(e) => setForm((current) => ({ ...current, type: e.target.value }))}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 bg-white"
            >
              <option value="landing_page">{t("labels.contentTypes.landing_page")}</option>
              <option value="knowledge_base">{t("labels.contentTypes.knowledge_base")}</option>
              <option value="media_asset">{t("labels.contentTypes.media_asset")}</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t("common.status")}</label>
            <select
              value={form.status}
              onChange={(e) => setForm((current) => ({ ...current, status: e.target.value }))}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 bg-white"
            >
              <option value="draft">{t("labels.statuses.draft")}</option>
              <option value="published">{t("labels.statuses.published")}</option>
              <option value="archived">{t("labels.statuses.archived")}</option>
            </select>
          </div>
        </form>
      </Modal>

      <Modal
        open={Boolean(deleteTarget)}
        title={t("common.delete")}
        description={deleteTarget?.name}
        onClose={() => setDeleteTarget(null)}
        footer={
          <>
            <button type="button" onClick={() => setDeleteTarget(null)} className="px-4 py-2 text-sm border border-gray-200 rounded-xl hover:bg-gray-50">
              {t("common.cancel")}
            </button>
            <button
              type="button"
              onClick={() => {
                deleteContent(deleteTarget.id);
                setDeleteTarget(null);
              }}
              className="px-4 py-2 bg-danger text-white text-sm font-medium rounded-xl hover:bg-red-700"
            >
              {t("common.delete")}
            </button>
          </>
        }
      >
        <p className="text-sm text-gray-500">{t("users.deleteUserDescription")}</p>
      </Modal>
    </div>
  );
}
