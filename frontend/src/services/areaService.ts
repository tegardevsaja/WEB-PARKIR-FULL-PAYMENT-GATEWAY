import api from '@/lib/axios';

export const areaService = {
  getAll: async (branch_id?: number) => {
    const response = await api.get('/areas', {
      params: { branch_id }
    });
    return response.data.data; // Extract data from { success: true, data: [...] }
  },

  create: async (data: {
    branch_id: number;
    area_name: string;
    capacity: number;
  }) => {
    const response = await api.post('/areas', data);
    return response.data;
  },

  update: async (id: number, data: {
    branch_id: number;
    area_name: string;
    capacity: number;
  }) => {
    const response = await api.put(`/areas/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/areas/${id}`);
    return response.data;
  },
};
