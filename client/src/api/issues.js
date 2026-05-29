import client from './client';

export const submitIssue       = (formData) => client.post('/issues', formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
});
export const getIssues          = ()          => client.get('/issues');
export const updateIssueStatus  = (id, data)  => client.patch(`/issues/${id}/status`, data);
