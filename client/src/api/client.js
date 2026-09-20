import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true, //for httpOnly refresh token cookies 
  headers: {
    'Content-Type': 'application/json',
  },
});

let inMemoryToken = null;

export const setAccessToken = (token) => {
  inMemoryToken = token;
};

export const getAccessToken = () => inMemoryToken;

api.interceptors.request.use(
  (config) => {
    if (inMemoryToken) {
      config.headers.Authorization = `Bearer ${inMemoryToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes('/auth/refresh') &&
      !originalRequest.url.includes('/auth/login')
    ) {
      originalRequest._retry = true;
      try {
        const res = await axios.post(
          'http://localhost:5000/api/auth/refresh',
          {},
          { withCredentials: true }
        );
        const newToken = res.data.accessToken;
        setAccessToken(newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest); // Retry original request with new token
      } catch (refreshError) {
        setAccessToken(null);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
