import api from './client';

export const analyticsApi = {
  getOverview: async (linkId) => {
    const res = await api.get(`/analytics/${linkId}/overview`);
    return res.data;
  },

  getTimeseries: async (linkId) => {
    const res = await api.get(`/analytics/${linkId}/timeseries`);
    return res.data;
  },

  getDevices: async (linkId) => {
    const res = await api.get(`/analytics/${linkId}/devices`);
    return res.data;
  },

  getReferrers: async (linkId) => {
    const res = await api.get(`/analytics/${linkId}/referrers`);
    return res.data;
  },
};
