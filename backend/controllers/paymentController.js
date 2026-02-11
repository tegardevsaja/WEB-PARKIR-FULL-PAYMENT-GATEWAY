const midtransClient = require('midtrans-client');
const db = require('../config/database');

// Initialize Midtrans Snap
let snap;
try {
  snap = new midtransClient.Snap({
    isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
    serverKey: process.env.MIDTRANS_SERVER_KEY,
    clientKey: process.env.MIDTRANS_CLIENT_KEY
  });
  console.log('✅ Midtrans Snap initialized');
} catch (error) {
  console.error('❌ Failed to initialize Midtrans:', error.message);
}

// Generate QRIS payment using Midtrans
exports.generateQRIS = async (req, res) => {
  try {
    const { ticket_id, amount, ticket_number, license_plate } = req.body;

    console.log('🔄 [generateQRIS] Generating QRIS payment...');
    console.log('   Ticket ID:', ticket_id);
    console.log('   Amount:', amount);
    console.log('   Ticket Number:', ticket_number);

    if (!ticket_id || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Ticket ID and amount are required'
      });
    }

    // Check if Midtrans is configured
    if (!snap || !process.env.MIDTRANS_SERVER_KEY) {
      console.log('⚠️ Midtrans not configured - using mock QRIS');
      const mockOrderId = `PARK-${ticket_id}-${Date.now()}`;
      return res.json({
        success: true,
        data: {
          order_id: mockOrderId,
          qr_string: `QRIS-MOCK-${ticket_id}-${amount}`,
          amount: amount,
          expiry_time: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
          is_mock: true
        },
        message: 'Mock QRIS generated (Midtrans not configured)'
      });
    }

    const orderId = `PARK-${ticket_id}-${Date.now()}`;

    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: parseInt(amount)
      },
      customer_details: {
        first_name: license_plate || 'Guest',
        last_name: 'Parking'
      },
      item_details: [{
        id: ticket_number || ticket_id,
        price: parseInt(amount),
        quantity: 1,
        name: `Parking Fee - ${license_plate || ticket_number}`
      }],
      enabled_payments: ['other_qris']
    };

    console.log('🔄 [generateQRIS] Creating Midtrans transaction...');
    const transaction = await snap.createTransaction(parameter);
    console.log('✅ [generateQRIS] QRIS generated');

    res.json({
      success: true,
      data: {
        order_id: orderId,
        qr_string: transaction.qr_string || transaction.redirect_url,
        amount: amount,
        expiry_time: new Date(Date.now() + 15 * 60 * 1000).toISOString()
      }
    });
  } catch (error) {
    console.error('❌ [generateQRIS] Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate QRIS: ' + error.message
    });
  }
};

// Check QRIS payment status
exports.checkQRISStatus = async (req, res) => {
  try {
    const { order_id } = req.query;

    console.log('🔄 [checkQRISStatus] Checking status for order:', order_id);

    if (!order_id) {
      return res.status(400).json({
        success: false,
        message: 'Order ID is required'
      });
    }

    // Check if it's a mock order
    if (order_id.includes('MOCK')) {
      return res.json({
        success: true,
        data: {
          transaction_status: 'pending',
          order_id: order_id,
          is_mock: true
        }
      });
    }

    if (!snap) {
      return res.status(503).json({
        success: false,
        message: 'Midtrans not configured'
      });
    }

    const statusResponse = await snap.transaction.status(order_id);
    console.log('✅ [checkQRISStatus] Status:', statusResponse.transaction_status);

    res.json({
      success: true,
      data: {
        transaction_status: statusResponse.transaction_status,
        order_id: order_id,
        amount: statusResponse.gross_amount
      }
    });
  } catch (error) {
    console.error('❌ [checkQRISStatus] Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check status: ' + error.message
    });
  }
};

// Mock QRIS callback for development
exports.mockQRISCallback = async (req, res) => {
  try {
    const { order_id } = req.body;
    console.log('🔄 [mockQRISCallback] Mock payment success for:', order_id);
    res.json({
      success: true,
      message: 'Mock payment successful'
    });
  } catch (error) {
    console.error('❌ [mockQRISCallback] Error:', error);
    res.status(500).json({ success: false, message: 'Mock callback failed' });
  }
};

// Get all payments (history)
exports.getAllPayments = async (req, res) => {
  try {
    const { search, payment_method, payment_status, branch_id, start_date, end_date } = req.query;
    
    let query = `
      SELECT p.*, t.ticket_number, t.license_plate, t.entry_time, t.exit_time,
             vt.type_name as vehicle_type_name, pa.area_name, b.branch_name, b.branch_id,
             u.full_name as officer_name
      FROM payments p
      JOIN tickets t ON p.ticket_id = t.ticket_id
      JOIN vehicle_types vt ON t.vehicle_type_id = vt.vehicle_type_id
      JOIN parking_areas pa ON t.area_id = pa.area_id
      JOIN branches b ON pa.branch_id = b.branch_id
      LEFT JOIN users u ON t.exit_user_id = u.user_id
      WHERE 1=1
    `;
    const params = [];

    if (search) {
      query += ' AND (t.ticket_number LIKE ? OR t.license_plate LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    if (payment_method) {
      query += ' AND p.payment_method = ?';
      params.push(payment_method);
    }

    if (payment_status) {
      query += ' AND p.payment_status = ?';
      params.push(payment_status);
    }

    if (branch_id) {
      query += ' AND b.branch_id = ?';
      params.push(branch_id);
    }

    if (start_date) {
      query += ' AND DATE(p.payment_time) >= ?';
      params.push(start_date);
    }

    if (end_date) {
      query += ' AND DATE(p.payment_time) <= ?';
      params.push(end_date);
    }

    query += ' ORDER BY p.payment_id DESC';

    const [payments] = await db.query(query, params);

    res.json({
      success: true,
      data: payments
    });
  } catch (error) {
    console.error('Get payments error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get payment by ID
exports.getPaymentById = async (req, res) => {
  try {
    const { id } = req.params;

    const [payments] = await db.query(
      `SELECT p.*, t.ticket_number, t.license_plate, t.entry_time, t.exit_time,
              vt.type_name as vehicle_type_name, pa.area_name, b.branch_name,
              u.full_name as officer_name
       FROM payments p
       JOIN tickets t ON p.ticket_id = t.ticket_id
       JOIN vehicle_types vt ON t.vehicle_type_id = vt.vehicle_type_id
       JOIN parking_areas pa ON t.area_id = pa.area_id
       JOIN branches b ON pa.branch_id = b.branch_id
       LEFT JOIN users u ON t.exit_user_id = u.user_id
       WHERE p.payment_id = ?`,
      [id]
    );

    if (payments.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    res.json({
      success: true,
      data: payments[0]
    });
  } catch (error) {
    console.error('Get payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Update payment status (for QRIS confirmation)
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { payment_status } = req.body;

    if (!['paid', 'failed'].includes(payment_status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment status'
      });
    }

    const [payments] = await db.query('SELECT * FROM payments WHERE payment_id = ?', [id]);
    if (payments.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    await db.query(
      'UPDATE payments SET payment_status = ? WHERE payment_id = ?',
      [payment_status, id]
    );

    // Log activity
    await db.query(
      'INSERT INTO activity_logs (user_id, action, description) VALUES (?, ?, ?)',
      [req.user.user_id, 'update_payment', `Updated payment ${id} status to ${payment_status}`]
    );

    res.json({
      success: true,
      message: 'Payment status updated successfully'
    });
  } catch (error) {
    console.error('Update payment status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get payment statistics
exports.getPaymentStats = async (req, res) => {
  try {
    const { branch_id, start_date, end_date } = req.query;

    let whereClause = 'WHERE p.payment_status = "paid"';
    const params = [];

    if (branch_id) {
      whereClause += ' AND b.branch_id = ?';
      params.push(branch_id);
    }

    if (start_date) {
      whereClause += ' AND DATE(p.payment_time) >= ?';
      params.push(start_date);
    }

    if (end_date) {
      whereClause += ' AND DATE(p.payment_time) <= ?';
      params.push(end_date);
    }

    // Total revenue
    const [totalRevenue] = await db.query(
      `SELECT COALESCE(SUM(p.amount), 0) as total
       FROM payments p
       JOIN tickets t ON p.ticket_id = t.ticket_id
       JOIN parking_areas pa ON t.area_id = pa.area_id
       JOIN branches b ON pa.branch_id = b.branch_id
       ${whereClause}`,
      params
    );

    // Revenue by payment method
    const [revenueByMethod] = await db.query(
      `SELECT p.payment_method, COALESCE(SUM(p.amount), 0) as total
       FROM payments p
       JOIN tickets t ON p.ticket_id = t.ticket_id
       JOIN parking_areas pa ON t.area_id = pa.area_id
       JOIN branches b ON pa.branch_id = b.branch_id
       ${whereClause}
       GROUP BY p.payment_method`,
      params
    );

    // Revenue by vehicle type
    const [revenueByVehicle] = await db.query(
      `SELECT vt.type_name as vehicle_type_name, COALESCE(SUM(p.amount), 0) as total, COUNT(*) as count
       FROM payments p
       JOIN tickets t ON p.ticket_id = t.ticket_id
       JOIN vehicle_types vt ON t.vehicle_type_id = vt.vehicle_type_id
       JOIN parking_areas pa ON t.area_id = pa.area_id
       JOIN branches b ON pa.branch_id = b.branch_id
       ${whereClause}
       GROUP BY vt.type_name`,
      params
    );

    // Transaction count by status
    const [transactionsByStatus] = await db.query(
      `SELECT p.payment_status, COUNT(*) as count
       FROM payments p
       JOIN tickets t ON p.ticket_id = t.ticket_id
       JOIN parking_areas pa ON t.area_id = pa.area_id
       JOIN branches b ON pa.branch_id = b.branch_id
       WHERE 1=1 ${branch_id ? 'AND b.branch_id = ?' : ''}
       ${start_date ? 'AND DATE(p.payment_time) >= ?' : ''}
       ${end_date ? 'AND DATE(p.payment_time) <= ?' : ''}
       GROUP BY p.payment_status`,
      params
    );

    res.json({
      success: true,
      data: {
        total_revenue: totalRevenue[0].total,
        revenue_by_method: revenueByMethod,
        revenue_by_vehicle: revenueByVehicle,
        transactions_by_status: transactionsByStatus
      }
    });
  } catch (error) {
    console.error('Get payment stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get daily revenue report
exports.getDailyRevenue = async (req, res) => {
  try {
    const { branch_id, days = 7 } = req.query;

    let whereClause = 'WHERE p.payment_status = "paid"';
    const params = [];

    if (branch_id) {
      whereClause += ' AND b.branch_id = ?';
      params.push(branch_id);
    }

    params.push(parseInt(days));

    const [dailyRevenue] = await db.query(
      `SELECT DATE(p.payment_time) as date, 
              COALESCE(SUM(p.amount), 0) as revenue,
              COUNT(*) as transactions
       FROM payments p
       JOIN tickets t ON p.ticket_id = t.ticket_id
       JOIN parking_areas pa ON t.area_id = pa.area_id
       JOIN branches b ON pa.branch_id = b.branch_id
       ${whereClause}
       AND p.payment_time >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
       GROUP BY DATE(p.payment_time)
       ORDER BY date DESC`,
      params
    );

    res.json({
      success: true,
      data: dailyRevenue
    });
  } catch (error) {
    console.error('Get daily revenue error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
