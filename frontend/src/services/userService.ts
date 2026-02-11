import api from '@/lib/axios';

export const userService = {
  getAll: async (params?: { search?: string; role?: string; branch_id?: number }) => {
    const response = await api.get('/users', { params });
    return response.data.data; // Extract data from { success: true, data: [...] }
  },

  getByBranch: async () => {
    const response = await api.get('/users/branch');
    return response.data.data;
  },

  create: async (data: {
    username: string;
    password: string;
    full_name: string;
    role: string;
    branch_id?: number | null;
  }) => {
    const response = await api.post('/users', data);
    return response.data;
  },

  update: async (id: number, data: {
    username: string;
    password?: string;
    full_name: string;
    role: string;
    branch_id?: number | null;
  }) => {
    const response = await api.put(`/users/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },
};
