import { http } from "../http";

export const ordersApi = {
  /** GET /api/admin/orders?page=1&limit=20 */
  getAll: (params = {}) =>
    http.get("/admin/orders", { params }),

  /** PATCH /api/admin/orders/:id/status */
  updateStatus: (id, orderStatus) =>
    http.patch(`/admin/orders/${id}/status`, { orderStatus }),
};
