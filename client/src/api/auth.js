import api from './client';

export const registerVisitor = (data) => api.post('/auth/visitor/register', data);
export const loginVisitor    = (data) => api.post('/auth/visitor/login', data);
export const registerGuide   = (data) => api.post('/auth/guide/register', data);
export const loginGuide      = (data) => api.post('/auth/guide/login', data);
export const loginAdmin      = (data) => api.post('/auth/admin/login', data);
