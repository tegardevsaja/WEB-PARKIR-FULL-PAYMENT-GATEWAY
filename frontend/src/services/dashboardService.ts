import api from '@/lib/axios';

export const dashboardService = {
  getStats: async (branch_id?: number) => {
    const response = await api.get('/dashboard/stats', {
      params: { branch_id }
    });
    return response.data;
  },

  getBranchComparison: async () => {
    const response = await api.get('/dashboard/branch-comparison');
    return response.data;
  },
};
