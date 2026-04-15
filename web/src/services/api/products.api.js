import { http } from "../http";

export const productsApi = {
  /** GET /api/products?page=1&limit=50&search= */
  getAll: (params = {}) =>
    http.get("/products", { params }),

  /** POST /api/products */
  create: (payload) =>
    http.post("/products", payload),

  /** PATCH /api/products/:id */
  update: (id, payload) =>
    http.patch(`/products/${id}`, payload),

  /** DELETE /api/products/:id */
  remove: (id) =>
    http.delete(`/products/${id}`),
};
