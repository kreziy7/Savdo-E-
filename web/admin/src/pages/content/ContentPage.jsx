import { useState } from "react";
import { Modal } from "../../components/shared/Modal";
import { usePageTitle } from "../../hooks/usePageTitle";
import { useI18n } from "../../i18n";
import { getContentTypeLabel, getStatusLabel, resolveText } from "../../i18n/labels";
import { useAdminData } from "../../store/adminData";

const emptyContent = {
  name: "",
  type: "landing_page",
  status: "draft",
  owner: ""
};

export function ContentPage() {
  const { t } = useI18n();
  usePageTitle(t("content.pageTitle"));
  const { contentRows, createContent, updateContentStatus } = useAdminData();
  const [modalOpen, setModalOpen] = useState(false);
  const [formState, setFormState] = useState(emptyContent);

  function closeModal() {
    setModalOpen(false);
    setFormState(emptyContent);
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setFormState((current) => ({ ...current, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    createContent(formState);
    closeModal();
  }

  return (
    <section className="stack">
      <div className="section-card">
        <div className="section-heading">
          <div>
            <h2>{t("content.title")}</h2>
            <p className="muted-text">{t("content.description")}</p>
          </div>
          <button type="button" onClick={() => setModalOpen(true)}>
            {t("content.createContent")}
          </button>
        </div>

        <div className="table-shell">
          <table className="data-table">
            <thead>
              <tr>
                <th>{t("common.name")}</th>
                <th>{t("common.type")}</th>
                <th>{t("common.status")}</th>
                <th>{t("common.owner")}</th>
                <th>{t("common.updatedAt")}</th>
                <th>{t("common.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {contentRows.map((row) => (
                <tr key={row.id || row.name || row.nameKey}>
                  <td>{resolveText(t, row, "nameKey", "name")}</td>
                  <td>{getContentTypeLabel(t, row.type)}</td>
                  <td>
                    <span className={`table-badge ${row.status}`}>
                      {getStatusLabel(t, row.status)}
                    </span>
                  </td>
                  <td>{row.owner}</td>
                  <td>{row.updatedAt}</td>
                  <td>
                    <div className="table-actions">
                      <button
                        type="button"
                        className="text-link"
                        onClick={() =>
                          updateContentStatus(row.id || row.name || row.nameKey, "published")
                        }
                      >
                        {t("content.publish")}
                      </button>
                      <button
                        type="button"
                        className="text-link danger-link"
                        onClick={() =>
                          updateContentStatus(row.id || row.name || row.nameKey, "archived")
                        }
                      >
                        {t("content.archive")}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        open={modalOpen}
        title={t("content.createContent")}
        description={t("content.createContentDescription")}
        onClose={closeModal}
        footer={
          <>
            <button type="button" className="secondary-button" onClick={closeModal}>
              {t("common.cancel")}
            </button>
            <button type="submit" form="content-form">
              {t("content.createContent")}
            </button>
          </>
        }
      >
        <form id="content-form" className="settings-form" onSubmit={handleSubmit}>
          <label>
            {t("common.name")}
            <input
              name="name"
              value={formState.name}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            {t("common.type")}
            <select name="type" value={formState.type} onChange={handleChange}>
              <option value="landing_page">{getContentTypeLabel(t, "landing_page")}</option>
              <option value="knowledge_base">
                {getContentTypeLabel(t, "knowledge_base")}
              </option>
              <option value="media_asset">{getContentTypeLabel(t, "media_asset")}</option>
            </select>
          </label>
          <label>
            {t("common.owner")}
            <input
              name="owner"
              value={formState.owner}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            {t("common.status")}
            <select name="status" value={formState.status} onChange={handleChange}>
              <option value="draft">{getStatusLabel(t, "draft")}</option>
              <option value="published">{getStatusLabel(t, "published")}</option>
              <option value="archived">{getStatusLabel(t, "archived")}</option>
            </select>
          </label>
        </form>
      </Modal>
    </section>
  );
}
