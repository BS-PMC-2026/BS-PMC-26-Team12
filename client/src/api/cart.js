import client from './client';

export const getCart        = ()            => client.get('/cart');
export const addToCart      = (data)        => client.post('/cart', data);
export const updateCartItem = (id, data)    => client.put(`/cart/${id}`, data);
export const removeFromCart = (id)          => client.delete(`/cart/${id}`);
