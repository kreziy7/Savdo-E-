import api from './axios';

export const getDashboardStats = () => api.get('/admin/stats');
export const getAllUsers = (params) => api.get('/admin/users', { params });
export const blockUser = (id) => api.patch(`/admin/users/${id}/block`);
export const unblockUser = (id) => api.patch(`/admin/users/${id}/unblock`);
export const deleteUser = (id) => api.delete(`/admin/users/${id}`);
export const getAllOrders = (params) => api.get('/admin/orders', { params });
export const updateOrderStatus = (id, data) => api.patch(`/admin/orders/${id}/status`, data);
