import api from '@/lib/axios';

export const logService = {
  getAll: async (params?: {
    search?: string;
    action?: string;
    user_id?: number;
    start_date?: string;
    end_date?: string;
  }) => {
    const response = await api.get('/logs', { params });
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get(`/logs/${id}`);
    return response.data;
  },
};
