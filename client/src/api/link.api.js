import api from './client';

export const linkApi = {
  createLink: async ({ originalUrl, customSlug }) => {
    const payload = { originalUrl };
    if (customSlug && customSlug.trim() !== '') {
      payload.customSlug = customSlug.trim();
    }
    const res = await api.post('/links', payload);
    return res.data;
  },

  getLinks: async ({ page = 1, limit = 10, search = '' } = {}) => {
    const params = { page, limit };
    if (search && search.trim() !== '') {
      params.search = search.trim();
    }
    const res = await api.get('/links', { params });
    return res.data;
  },

  deleteLink: async (id) => {
    const res = await api.delete(`/links/${id}`);
    return res.data;
  },
};
