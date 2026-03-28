import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Modal } from "../../components/shared/Modal";
import { usePageTitle } from "../../hooks/usePageTitle";
import { useI18n } from "../../i18n";
import { formatRelativeTime, getRoleLabel, getStatusLabel } from "../../i18n/labels";
import { useAdminData } from "../../store/adminData";

const emptyUser = {
  name: "",
  email: "",
  phone: "",
  role: "viewer",
  status: "active"
};

export function UsersPage() {
  const { t } = useI18n();
  usePageTitle(t("users.pageTitle"));
  const { users, createUser, updateUser, toggleUserStatus, deleteUser } =
    useAdminData();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [formState, setFormState] = useState(emptyUser);
  const [editingId, setEditingId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filteredUsers = useMemo(
    () =>
      users.filter((user) => {
        const matchesSearch = [user.name, user.email, user.phone]
          .join(" ")
          .toLowerCase()
          .includes(search.toLowerCase());
        const matchesRole = roleFilter === "all" || user.role === roleFilter;
        const matchesStatus =
          statusFilter === "all" || user.status === statusFilter;

        return matchesSearch && matchesRole && matchesStatus;
      }),
    [users, search, roleFilter, statusFilter]
  );

  function resetModal() {
    setFormState(emptyUser);
    setEditingId(null);
    setModalOpen(false);
  }

  function openCreate() {
    setEditingId(null);
    setFormState(emptyUser);
    setModalOpen(true);
  }

  function openEdit(user) {
    setEditingId(user.id);
    setFormState({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status
    });
    setModalOpen(true);
  }

  function handleFormChange(event) {
    const { name, value } = event.target;
    setFormState((current) => ({ ...current, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (editingId) {
      updateUser(editingId, formState);
    } else {
      createUser(formState);
    }

    resetModal();
  }

  function clearFilters() {
    setSearch("");
    setRoleFilter("all");
    setStatusFilter("all");
  }

  return (
    <section className="stack">
      <div className="section-card">
        <div className="section-heading">
          <div>
            <h2>{t("users.title")}</h2>
            <p className="muted-text">{t("users.description")}</p>
          </div>
          <button type="button" onClick={openCreate}>
            {t("users.createUser")}
          </button>
        </div>

        <div className="filter-bar">
          <input
            type="search"
            placeholder={t("users.searchPlaceholder")}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <select
            value={roleFilter}
            onChange={(event) => setRoleFilter(event.target.value)}
          >
            <option value="all">{t("users.allRoles")}</option>
            <option value="manager">{getRoleLabel(t, "manager")}</option>
            <option value="editor">{getRoleLabel(t, "editor")}</option>
            <option value="viewer">{getRoleLabel(t, "viewer")}</option>
            <option value="customer_support">
              {getRoleLabel(t, "customer_support")}
            </option>
          </select>
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value="all">{t("users.allStatuses")}</option>
            <option value="active">{getStatusLabel(t, "active")}</option>
            <option value="pending">{getStatusLabel(t, "pending")}</option>
            <option value="blocked">{getStatusLabel(t, "blocked")}</option>
          </select>
          <button type="button" className="secondary-button" onClick={clearFilters}>
            {t("common.clearFilters")}
          </button>
        </div>

        <div className="table-shell">
          <table className="data-table">
            <thead>
              <tr>
                <th>{t("users.tableUser")}</th>
                <th>{t("users.tableRole")}</th>
                <th>{t("users.tableStatus")}</th>
                <th>{t("users.tableCreated")}</th>
                <th>{t("users.tableLastLogin")}</th>
                <th>{t("common.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className="table-user">
                      <strong>{user.name}</strong>
                      <span>{user.email}</span>
                      <small>{user.phone}</small>
                    </div>
                  </td>
                  <td>
                    <span className="table-badge neutral">
                      {getRoleLabel(t, user.role)}
                    </span>
                  </td>
                  <td>
                    <span className={`table-badge ${user.status}`}>
                      {getStatusLabel(t, user.status)}
                    </span>
                  </td>
                  <td>{user.createdAt}</td>
                  <td>{formatRelativeTime(t, user.lastLogin)}</td>
                  <td>
                    <div className="table-actions">
                      <Link className="text-link" to={`/users/${user.id}`}>
                        {t("common.view")}
                      </Link>
                      <button
                        type="button"
                        className="text-link"
                        onClick={() => openEdit(user)}
                      >
                        {t("common.edit")}
                      </button>
                      <button
                        type="button"
                        className="text-link danger-link"
                        onClick={() => toggleUserStatus(user.id)}
                      >
                        {user.status === "blocked" ? t("users.unblock") : t("users.block")}
                      </button>
                      <button
                        type="button"
                        className="text-link danger-link"
                        onClick={() => setDeleteTarget(user)}
                      >
                        {t("common.delete")}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!filteredUsers.length ? (
          <div className="empty-state">
            <strong>{t("users.noUsers")}</strong>
            <p className="muted-text">{t("users.noUsersDescription")}</p>
          </div>
        ) : null}
      </div>

      <Modal
        open={modalOpen}
        title={editingId ? t("users.editUser") : t("users.createUserModal")}
        description={t("users.userFormDescription")}
        onClose={resetModal}
        footer={
          <>
            <button type="button" className="secondary-button" onClick={resetModal}>
              {t("common.cancel")}
            </button>
            <button type="submit" form="user-form">
              {editingId ? t("common.saveChanges") : t("users.createUser")}
            </button>
          </>
        }
      >
        <form id="user-form" className="settings-form" onSubmit={handleSubmit}>
          <label>
            {t("users.fullName")}
            <input
              name="name"
              value={formState.name}
              onChange={handleFormChange}
              required
            />
          </label>
          <label>
            {t("common.email")}
            <input
              type="email"
              name="email"
              value={formState.email}
              onChange={handleFormChange}
              required
            />
          </label>
          <label>
            {t("common.phone")}
            <input
              name="phone"
              value={formState.phone}
              onChange={handleFormChange}
              required
            />
          </label>
          <label>
            {t("common.role")}
            <select name="role" value={formState.role} onChange={handleFormChange}>
              <option value="viewer">{getRoleLabel(t, "viewer")}</option>
              <option value="editor">{getRoleLabel(t, "editor")}</option>
              <option value="manager">{getRoleLabel(t, "manager")}</option>
              <option value="customer_support">
                {getRoleLabel(t, "customer_support")}
              </option>
            </select>
          </label>
          <label>
            {t("common.status")}
            <select
              name="status"
              value={formState.status}
              onChange={handleFormChange}
            >
              <option value="active">{getStatusLabel(t, "active")}</option>
              <option value="pending">{getStatusLabel(t, "pending")}</option>
              <option value="blocked">{getStatusLabel(t, "blocked")}</option>
            </select>
          </label>
        </form>
      </Modal>

      <Modal
        open={Boolean(deleteTarget)}
        title={t("users.deleteUser")}
        description={
          deleteTarget ? t("users.deleteUserConfirm", { name: deleteTarget.name }) : ""
        }
        onClose={() => setDeleteTarget(null)}
        footer={
          <>
            <button
              type="button"
              className="secondary-button"
              onClick={() => setDeleteTarget(null)}
            >
              {t("common.cancel")}
            </button>
            <button
              type="button"
              onClick={() => {
                deleteUser(deleteTarget.id);
                setDeleteTarget(null);
              }}
            >
              {t("users.deleteUser")}
            </button>
          </>
        }
      >
        <p className="muted-text">{t("users.deleteUserDescription")}</p>
      </Modal>
    </section>
  );
}
