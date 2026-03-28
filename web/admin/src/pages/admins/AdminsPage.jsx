import { useState } from "react";
import { Modal } from "../../components/shared/Modal";
import { usePageTitle } from "../../hooks/usePageTitle";
import { useI18n } from "../../i18n";
import {
  formatRelativeTime,
  getCreatedByLabel,
  getPermissionSummaryLabel,
  getRoleLabel,
  getStatusLabel
} from "../../i18n/labels";
import { useAdminData } from "../../store/adminData";

const emptyAdmin = {
  name: "",
  email: "",
  role: "admin",
  status: "invited",
  permissions: ""
};

export function AdminsPage() {
  const { t } = useI18n();
  usePageTitle(t("admins.pageTitle"));
  const { admins, createAdmin, updateAdmin, toggleAdminStatus } = useAdminData();
  const [modalOpen, setModalOpen] = useState(false);
  const [formState, setFormState] = useState(emptyAdmin);
  const [editingId, setEditingId] = useState(null);

  function closeModal() {
    setModalOpen(false);
    setEditingId(null);
    setFormState(emptyAdmin);
  }

  function openCreate() {
    setEditingId(null);
    setFormState(emptyAdmin);
    setModalOpen(true);
  }

  function openEdit(admin) {
    setEditingId(admin.id);
    setFormState({
      name: admin.name,
      email: admin.email,
      role: admin.role,
      status: admin.status,
      permissions: admin.permissions || ""
    });
    setModalOpen(true);
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setFormState((current) => ({ ...current, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (editingId) {
      updateAdmin(editingId, formState);
    } else {
      const success = createAdmin(formState);
      if (!success) {
        return;
      }
    }

    closeModal();
  }

  return (
    <section className="stack">
      <div className="section-card">
        <div className="section-heading">
          <div>
            <h2>{t("admins.title")}</h2>
            <p className="muted-text">{t("admins.description")}</p>
          </div>
          <button type="button" onClick={openCreate}>
            {t("admins.createAdmin")}
          </button>
        </div>

        <div className="callout warning-callout">
          <strong>{t("admins.singletonTitle")}</strong>
          <p className="muted-text">{t("admins.singletonDescription")}</p>
        </div>

        <div className="table-shell">
          <table className="data-table">
            <thead>
              <tr>
                <th>{t("admins.adminColumn")}</th>
                <th>{t("common.role")}</th>
                <th>{t("common.permissions")}</th>
                <th>{t("common.status")}</th>
                <th>{t("common.lastActive")}</th>
                <th>{t("common.createdBy")}</th>
                <th>{t("common.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin) => (
                <tr key={admin.id}>
                  <td>
                    <div className="table-user">
                      <strong>{admin.name}</strong>
                      <span>{admin.email}</span>
                    </div>
                  </td>
                  <td>
                    <span
                      className={`table-badge ${
                        admin.role === "super_admin" ? "info" : "neutral"
                      }`}
                    >
                      {getRoleLabel(t, admin.role)}
                    </span>
                  </td>
                  <td>
                    {admin.permissionsKey
                      ? getPermissionSummaryLabel(t, admin.permissionsKey)
                      : admin.permissions}
                  </td>
                  <td>
                    <span className={`table-badge ${admin.status}`}>
                      {getStatusLabel(t, admin.status)}
                    </span>
                  </td>
                  <td>{formatRelativeTime(t, admin.lastActive)}</td>
                  <td>{getCreatedByLabel(t, admin.createdBy)}</td>
                  <td>
                    <div className="table-actions">
                      <button
                        type="button"
                        className="text-link"
                        onClick={() => openEdit(admin)}
                        disabled={admin.role === "super_admin"}
                      >
                        {t("common.edit")}
                      </button>
                      <button
                        type="button"
                        className="text-link danger-link"
                        onClick={() => toggleAdminStatus(admin.id)}
                        disabled={admin.role === "super_admin"}
                      >
                        {admin.status === "suspended"
                          ? t("admins.activate")
                          : t("admins.suspend")}
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
        title={editingId ? t("admins.editAdmin") : t("admins.createAdminModal")}
        description={t("admins.modalDescription")}
        onClose={closeModal}
        footer={
          <>
            <button type="button" className="secondary-button" onClick={closeModal}>
              {t("common.cancel")}
            </button>
            <button type="submit" form="admin-form">
              {editingId ? t("common.saveChanges") : t("admins.createAdmin")}
            </button>
          </>
        }
      >
        <form id="admin-form" className="settings-form" onSubmit={handleSubmit}>
          <label>
            {t("users.fullName")}
            <input
              name="name"
              value={formState.name}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            {t("common.email")}
            <input
              type="email"
              name="email"
              value={formState.email}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            {t("common.role")}
            <select name="role" value={formState.role} onChange={handleChange}>
              <option value="admin">{getRoleLabel(t, "admin")}</option>
              <option value="support">{getRoleLabel(t, "support")}</option>
              <option value="viewer">{getRoleLabel(t, "viewer")}</option>
            </select>
          </label>
          <label>
            {t("common.status")}
            <select name="status" value={formState.status} onChange={handleChange}>
              <option value="invited">{getStatusLabel(t, "invited")}</option>
              <option value="active">{getStatusLabel(t, "active")}</option>
              <option value="suspended">{getStatusLabel(t, "suspended")}</option>
            </select>
          </label>
          <label>
            {t("admins.permissionsSummary")}
            <textarea
              rows="4"
              name="permissions"
              value={formState.permissions}
              onChange={handleChange}
            />
          </label>
        </form>
      </Modal>
    </section>
  );
}
