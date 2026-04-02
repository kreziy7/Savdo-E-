import api from './axios';

export const createOrder = (data) => api.post('/orders', data);
export const getMyOrders = (params) => api.get('/orders/my-orders', { params });
export const getOrderById = (id) => api.get(`/orders/${id}`);
export const cancelOrder = (id) => api.patch(`/orders/${id}/cancel`);
