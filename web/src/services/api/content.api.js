import { http } from "../http";

export const contentApi = {
  /** GET /api/content?page=1&limit=20&type=&status= */
  getAll: (params = {}) =>
    http.get("/content", { params }),

  /** POST /api/content */
  create: (payload) =>
    http.post("/content", payload),

  /** PATCH /api/content/:id/status */
  updateStatus: (id, status) =>
    http.patch(`/content/${id}/status`, { status }),

  /** DELETE /api/content/:id */
  remove: (id) =>
    http.delete(`/content/${id}`)
};
