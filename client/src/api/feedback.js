import client from './client';

export const submitFeedback  = (data)   => client.post('/feedback', data);
export const getMyFeedback   = ()       => client.get('/feedback/my');
export const getTourFeedback = (tourId) => client.get(`/feedback/tour/${tourId}`);
export const getAllFeedback   = ()       => client.get('/feedback');
export const deleteFeedback  = (id)     => client.delete(`/feedback/${id}`);
