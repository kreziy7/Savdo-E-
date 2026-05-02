import api from './axios';

export const getSales = (params) => api.get('/sales', { params });
export const createSale = (data) => api.post('/sales', data);
export const bulkSync = (data) => api.post('/sales/bulk-sync', data);
