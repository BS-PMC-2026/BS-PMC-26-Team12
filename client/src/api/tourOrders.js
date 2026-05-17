import client from './client';

export const bookTour      = (data) => client.post('/tour-orders', data);
export const getMyBookings = ()     => client.get('/tour-orders/my');
