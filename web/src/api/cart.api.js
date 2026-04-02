import api from './axios';

export const getCart = () => api.get('/cart');
export const addToCart = (data) => api.post('/cart/add', data);
export const removeFromCart = (productId) => api.delete(`/cart/item/${productId}`);
export const updateCartItem = (productId, data) => api.patch(`/cart/item/${productId}`, data);
export const clearCart = () => api.delete('/cart/clear');
