import { http } from "../http";

/**
 * Users API — GET/POST/PUT/DELETE /api/users
 */

export const usersApi = {
  /** GET /api/users?page=1&limit=20&search=&role=&status= */
  getAll: (params = {}) =>
    http.get("/users", { params }),

  /** GET /api/users/:id */
  getById: (id) =>
    http.get(`/users/${id}`),

  /** POST /api/users */
  create: (payload) =>
    http.post("/users", payload),

  /** PUT /api/users/:id */
  update: (id, payload) =>
    http.put(`/users/${id}`, payload),

  /** DELETE /api/users/:id */
  remove: (id) =>
    http.delete(`/users/${id}`),

  /** PATCH /api/users/:id/status */
  toggleStatus: (id) =>
    http.patch(`/users/${id}/status`),

  /** POST /api/users/:id/grant-admin — primary admin only */
  grantAdmin: (id) =>
    http.post(`/users/${id}/grant-admin`),

  /** DELETE /api/users/:id/grant-admin — primary admin only */
  revokeAdmin: (id) =>
    http.delete(`/users/${id}/grant-admin`)
};
