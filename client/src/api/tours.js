import client from './client';

export const getTours    = (params = {}) => client.get('/tours', { params });
export const getTour     = (id)          => client.get(`/tours/${id}`);
export const getMyTours  = ()            => client.get('/tours/my');
export const createTour  = (data)        => client.post('/tours', data);
export const updateTour  = (id, data)    => client.put(`/tours/${id}`, data);
