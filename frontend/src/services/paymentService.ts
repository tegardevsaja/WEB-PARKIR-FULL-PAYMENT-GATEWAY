import api from '@/lib/axios';

export const paymentService = {
  getAll: async (params?: {
    search?: string;
    payment_method?: string;
    payment_status?: string;
    branch_id?: number;
    start_date?: string;
    end_date?: string;
  }) => {
    const response = await api.get('/payments', { params });
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get(`/payments/${id}`);
    return response.data;
  },

  updateStatus: async (id: number, status: 'paid' | 'failed') => {
    const response = await api.put(`/payments/${id}/status`, {
      payment_status: status
    });
    return response.data;
  },

  getStats: async (params?: {
    branch_id?: number;
    start_date?: string;
    end_date?: string;
  }) => {
    const response = await api.get('/payments/stats', { params });
    return response.data;
  },

  getDailyRevenue: async (params?: {
    branch_id?: number;
    days?: number;
  }) => {
    const response = await api.get('/payments/daily-revenue', { params });
    return response.data;
  },
};
