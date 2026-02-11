import api from '@/lib/axios';

export const ticketService = {
  // Vehicle Entry - Create ticket
  entry: async (data: {
    license_plate: string;
    vehicle_type_id: number;
    area_id: number;
  }) => {
    console.log('🔄 [ticketService.entry] Creating ticket...', data);
    const response = await api.post('/tickets/entry', data);
    console.log('✅ [ticketService.entry] Response:', response.data);
    return response.data;
  },

  // Search ticket for exit
  search: async (params: { ticket_number?: string; license_plate?: string }) => {
    console.log('🔄 [ticketService.search] Searching ticket...', params);
    const response = await api.get('/tickets/search', { params });
    console.log('✅ [ticketService.search] Response:', response.data);
    return response.data;
  },

  // Process exit with payment
  exit: async (data: {
    ticket_id: number;
    payment_method: 'cash' | 'qris';
  }) => {
    console.log('🔄 [ticketService.exit] Processing exit...', data);
    const response = await api.post('/tickets/exit', data);
    console.log('✅ [ticketService.exit] Response:', response.data);
    return response.data;
  },

  // Get active tickets
  getActive: async (branch_id?: number) => {
    console.log('🔄 [ticketService.getActive] Fetching active tickets...');
    const response = await api.get('/tickets/active', {
      params: { branch_id }
    });
    console.log('✅ [ticketService.getActive] Response:', response.data);
    return response.data;
  },
};

// Payment service with QRIS
export const paymentService = {
  // Generate QRIS payment
  generateQRIS: async (data: {
    ticket_id: number;
    amount: number;
    ticket_number?: string;
    license_plate?: string;
  }) => {
    console.log('🔄 [paymentService.generateQRIS] Generating QRIS...', data);
    const response = await api.post('/payments/qris/generate', data);
    console.log('✅ [paymentService.generateQRIS] Response:', response.data);
    return response.data;
  },

  // Check QRIS payment status
  checkQRISStatus: async (order_id: string) => {
    console.log('🔄 [paymentService.checkQRISStatus] Checking status...', order_id);
    const response = await api.get('/payments/qris/status', {
      params: { order_id }
    });
    console.log('✅ [paymentService.checkQRISStatus] Response:', response.data);
    return response.data;
  },

  // Mock QRIS callback (for development)
  mockQRISCallback: async (order_id: string) => {
    console.log('🔄 [paymentService.mockQRISCallback] Mock callback...', order_id);
    const response = await api.post('/payments/qris/mock-callback', { order_id });
    console.log('✅ [paymentService.mockQRISCallback] Response:', response.data);
    return response.data;
  },
};
