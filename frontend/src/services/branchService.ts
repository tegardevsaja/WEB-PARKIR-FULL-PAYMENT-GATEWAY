import api from '@/lib/axios';

export const branchService = {
  getAll: async () => {
    const response = await api.get('/branches');
    return response.data.data; // Extract data from { success: true, data: [...] }
  },

  getById: async (id: number) => {
    const response = await api.get(`/branches/${id}`);
    return response.data.data;
  },

  create: async (data: {
    branch_name: string;
    address: string;
    phone: string;
  }) => {
    const response = await api.post('/branches', data);
    return response.data;
  },

  update: async (id: number, data: {
    branch_name: string;
    address: string;
    phone: string;
  }) => {
    const response = await api.put(`/branches/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/branches/${id}`);
    return response.data;
  },
};
