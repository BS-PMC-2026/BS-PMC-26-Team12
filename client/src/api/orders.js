import client from './client';

export const checkout         = (selectedItemIds) => client.post('/orders', selectedItemIds?.length ? { selectedItemIds } : {});
export const getOrders        = ()       => client.get('/orders');
export const getMyOrders      = ()       => client.get('/orders/my');
export const updateOrderStatus = (id, status) => client.put(`/orders/${id}`, { status });
