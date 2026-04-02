import { http } from "../http";

export const auditLogsApi = {
  /** GET /api/audit-logs?page=1&limit=30&category=&from=&to=&search= */
  getAll: (params = {}) =>
    http.get("/audit-logs", { params }),

  /** GET /api/audit-logs/export?category=&from=&to= — returns CSV blob */
  export: (params = {}) =>
    http.get("/audit-logs/export", { params, responseType: "blob" })
};
