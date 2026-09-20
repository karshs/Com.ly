import api from './client';

export const bioApi = {
  getMyBio: async () => {
    const res = await api.get('/bio/me');
    return res.data;
  },

  updateMyBio: async (bioData) => {
    const res = await api.put('/bio/me', bioData);
    return res.data;
  },

  getPublicBio: async (username) => {
    const res = await api.get(`/bio/public/${username}`);
    return res.data;
  },
};
