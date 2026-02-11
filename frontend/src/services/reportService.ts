import api from '@/lib/axios';

export const reportService = {
  // Get daily revenue report
  getDailyRevenue: async (params?: { 
    branch_id?: number; 
    start_date?: string; 
    end_date?: string;
  }) => {
    const response = await api.get('/reports/daily-revenue', { params });
    return response.data;
  },

  // Get transaction details
  getTransactions: async (params?: {
    branch_id?: number;
    start_date?: string;
    end_date?: string;
    payment_method?: string;
    payment_status?: string;
    search?: string;
  }) => {
    const response = await api.get('/reports/transactions', { params });
    return response.data;
  },

  // Get revenue statistics
  getStats: async (params?: {
    branch_id?: number;
    start_date?: string;
    end_date?: string;
  }) => {
    const response = await api.get('/reports/stats', { params });
    return response.data;
  },

  // Get today's summary
  getTodaySummary: async (params?: {
    branch_id?: number;
  }) => {
    const response = await api.get('/reports/today-summary', { params });
    return response.data;
  },
};
