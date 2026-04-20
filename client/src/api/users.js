import api from './client';

// Guides
export const getGuides          = ()         => api.get('/guides');
export const updateGuideStatus  = (id, data) => api.patch(`/guides/${id}/status`, data);
export const deleteGuide        = (id)       => api.delete(`/guides/${id}`);

// Visitors
export const getUsers  = ()   => api.get('/users');
export const deleteUser = (id) => api.delete(`/users/${id}`);
