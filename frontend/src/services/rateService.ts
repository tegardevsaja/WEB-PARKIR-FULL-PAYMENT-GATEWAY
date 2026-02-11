import api from '@/lib/axios';

export const rateService = {
  getAll: async (params?: { branch_id?: number; vehicle_type_id?: number }) => {
    const response = await api.get('/rates', { params });
    return response.data;
  },

  getActiveRate: async (branch_id: number, vehicle_type_id: number) => {
    const response = await api.get('/rates/active', {
      params: { branch_id, vehicle_type_id }
    });
    return response.data;
  },

  getVehicleTypes: async () => {
    const response = await api.get('/rates/vehicle-types');
    return response.data;
  },

  create: async (data: {
    branch_id: number;
    vehicle_type_id: number;
    first_hour_rate: number;
    next_hour_rate: number;
    effective_date?: string;
  }) => {
    const response = await api.post('/rates', data);
    return response.data;
  },

  update: async (id: number, data: {
    branch_id: number;
    vehicle_type_id: number;
    first_hour_rate: number;
    next_hour_rate: number;
    effective_date?: string;
  }) => {
    const response = await api.put(`/rates/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/rates/${id}`);
    return response.data;
  },
};
