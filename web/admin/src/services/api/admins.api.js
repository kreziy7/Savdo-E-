import { http } from "../http";

/**
 * Admins API — GET/PATCH /api/admins
 * Only primary admin can call these endpoints
 */

export const adminsApi = {
  /** GET /api/admins */
  getAll: () =>
    http.get("/admins"),

  /** PATCH /api/admins/:id/status */
  toggleStatus: (id) =>
    http.patch(`/admins/${id}/status`)
};
