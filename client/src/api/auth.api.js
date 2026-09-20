import api from './client';

export const authApi = {
  signup: async (userData) => {
    const res = await api.post('/auth/signup', userData);
    return res.data;
  },

  verifyEmail: async (token) => {
    const res = await api.get(`/auth/verify/${token}`);
    return res.data;
  },

  login: async (credentials) => {
    const res = await api.post('/auth/login', credentials);
    return res.data;
  },

  logout: async () => {
    const res = await api.post('/auth/logout');
    return res.data;
  },

  forgotPassword: async (email) => {
    const res = await api.post('/auth/forgot-password', { email });
    return res.data;
  },

  resetPassword: async (token, newPassword) => {
    const res = await api.post('/auth/reset-password', { token, newPassword });
    return res.data;
  },

  refreshToken: async () => {
    const res = await api.post('/auth/refresh');
    return res.data;
  },
};
