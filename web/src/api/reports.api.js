import api from './axios';

export const getSummary = () => api.get('/reports/summary');
export const getDailyReport = (date) => api.get('/reports/daily', { params: { date } });
export const getMonthlyReport = (month) => api.get('/reports/monthly', { params: { month } });
