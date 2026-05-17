import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

// Attach JWT to every request if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Global response error handling
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      const hadToken = !!localStorage.getItem('token');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Only redirect guests who were previously logged in (expired session)
      if (hadToken) window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
