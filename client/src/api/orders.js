import client from './client';

export const checkout         = ()       => client.post('/orders');
export const getOrders        = ()       => client.get('/orders');
export const getMyOrders      = ()       => client.get('/orders/my');
export const updateOrderStatus = (id, status) => client.put(`/orders/${id}`, { status });
