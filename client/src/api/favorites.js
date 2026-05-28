import client from './client';

export const getFavorites   = ()       => client.get('/favorites');
export const addFavorite    = (tourId) => client.post(`/favorites/${tourId}`);
export const removeFavorite = (tourId) => client.delete(`/favorites/${tourId}`);
