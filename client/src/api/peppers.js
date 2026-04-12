import api from './client';

export const getPeppers  = (search = '') => api.get('/peppers', { params: search ? { search } : {} });
export const getPepper   = (id)          => api.get(`/peppers/${id}`);
export const addPepper   = (data)        => api.post('/peppers', data);
export const deletePepper = (id)         => api.delete(`/peppers/${id}`);
