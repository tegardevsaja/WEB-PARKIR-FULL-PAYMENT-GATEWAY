const db = require('../config/database');

// Get daily revenue report
exports.getDailyRevenue = async (req, res) => {
  try {
    const { branch_id, start_date, end_date } = req.query;

    let whereClause = 'WHERE t.payment_status = "paid" AND t.exit_time IS NOT NULL';
    const params = [];

    if (branch_id) {
      whereClause += ' AND b.branch_id = ?';
      params.push(branch_id);
    }

    if (start_date) {
      whereClause += ' AND DATE(t.exit_time) >= ?';
      params.push(start_date);
    }

    if (end_date) {
      whereClause += ' AND DATE(t.exit_time) <= ?';
      params.push(end_date);
    }

    console.log('🔄 [getDailyRevenue] Fetching daily revenue...');
    console.log('   Branch:', branch_id || 'All');
    console.log('   Date range:', start_date || 'All', 'to', end_date || 'All');

    const [dailyRevenue] = await db.query(
      `SELECT 
        DATE(t.exit_time) as date,
        b.branch_name,
        COUNT(*) as total_transactions,
        COALESCE(SUM(t.total_amount), 0) as total_revenue,
        SUM(CASE WHEN t.payment_method = 'cash' THEN 1 ELSE 0 END) as cash_count,
        SUM(CASE WHEN t.payment_method = 'qris' THEN 1 ELSE 0 END) as qris_count,
        COALESCE(SUM(CASE WHEN t.payment_method = 'cash' THEN t.total_amount ELSE 0 END), 0) as cash_revenue,
        COALESCE(SUM(CASE WHEN t.payment_method = 'qris' THEN t.total_amount ELSE 0 END), 0) as qris_revenue
       FROM transactions t
       JOIN parking_areas pa ON t.area_id = pa.area_id
       JOIN branches b ON pa.branch_id = b.branch_id
       ${whereClause}
       GROUP BY DATE(t.exit_time), b.branch_id
       ORDER BY date DESC, b.branch_name`,
      params
    );

    console.log('✅ [getDailyRevenue] Records found:', dailyRevenue.length);
    console.table(dailyRevenue);

    res.json({
      success: true,
      data: dailyRevenue
    });
  } catch (error) {
    console.error('❌ [getDailyRevenue] Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error: ' + (error.message || 'Failed to fetch daily revenue')
    });
  }
};

// Get transaction details
exports.getTransactionDetails = async (req, res) => {
  try {
    const { branch_id, start_date, end_date, payment_method, payment_status, search } = req.query;

    let whereClause = 'WHERE 1=1';
    const params = [];

    if (branch_id) {
      whereClause += ' AND b.branch_id = ?';
      params.push(branch_id);
    }

    if (start_date) {
      whereClause += ' AND DATE(t.exit_time) >= ?';
      params.push(start_date);
    }

    if (end_date) {
      whereClause += ' AND DATE(t.exit_time) <= ?';
      params.push(end_date);
    }

    if (payment_method) {
      whereClause += ' AND t.payment_method = ?';
      params.push(payment_method);
    }

    if (payment_status) {
      whereClause += ' AND t.payment_status = ?';
      params.push(payment_status);
    }

    if (search) {
      whereClause += ' AND (t.ticket_number LIKE ? OR v.license_plate LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    console.log('🔄 [getTransactionDetails] Fetching transactions...');

    const [transactions] = await db.query(
      `SELECT 
        t.transaction_id,
        t.ticket_number,
        t.entry_time,
        t.exit_time,
        t.duration_hours,
        t.total_amount,
        t.payment_method,
        t.payment_status,
        v.license_plate,
        vt.type_name as vehicle_type,
        pa.area_name,
        b.branch_name,
        u.full_name as officer_name
       FROM transactions t
       JOIN vehicles v ON t.vehicle_id = v.vehicle_id
       JOIN vehicle_types vt ON v.vehicle_type_id = vt.vehicle_type_id
       JOIN parking_areas pa ON t.area_id = pa.area_id
       JOIN branches b ON pa.branch_id = b.branch_id
       LEFT JOIN users u ON t.officer_id = u.user_id
       ${whereClause}
       ORDER BY t.exit_time DESC, t.entry_time DESC
       LIMIT 1000`,
      params
    );

    console.log('✅ [getTransactionDetails] Records found:', transactions.length);

    res.json({
      success: true,
      data: transactions
    });
  } catch (error) {
    console.error('❌ [getTransactionDetails] Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error: ' + (error.message || 'Failed to fetch transactions')
    });
  }
};

// Get revenue statistics
exports.getRevenueStats = async (req, res) => {
  try {
    const { branch_id, start_date, end_date } = req.query;

    let whereClause = 'WHERE t.payment_status = "paid" AND t.exit_time IS NOT NULL';
    const params = [];

    if (branch_id) {
      whereClause += ' AND b.branch_id = ?';
      params.push(branch_id);
    }

    if (start_date) {
      whereClause += ' AND DATE(t.exit_time) >= ?';
      params.push(start_date);
    }

    if (end_date) {
      whereClause += ' AND DATE(t.exit_time) <= ?';
      params.push(end_date);
    }

    console.log('🔄 [getRevenueStats] Fetching revenue stats...');

    // Total revenue and transactions
    const [totalStats] = await db.query(
      `SELECT 
        COALESCE(SUM(t.total_amount), 0) as total_revenue,
        COUNT(*) as total_transactions,
        AVG(t.duration_hours) as avg_duration
       FROM transactions t
       JOIN parking_areas pa ON t.area_id = pa.area_id
       JOIN branches b ON pa.branch_id = b.branch_id
       ${whereClause}`,
      params
    );

    // Revenue by payment method
    const [revenueByMethod] = await db.query(
      `SELECT 
        t.payment_method,
        COALESCE(SUM(t.total_amount), 0) as total,
        COUNT(*) as count
       FROM transactions t
       JOIN parking_areas pa ON t.area_id = pa.area_id
       JOIN branches b ON pa.branch_id = b.branch_id
       ${whereClause}
       GROUP BY t.payment_method`,
      params
    );

    // Revenue by vehicle type
    const [revenueByVehicle] = await db.query(
      `SELECT 
        vt.type_name as vehicle_type,
        COALESCE(SUM(t.total_amount), 0) as total,
        COUNT(*) as count
       FROM transactions t
       JOIN vehicles v ON t.vehicle_id = v.vehicle_id
       JOIN vehicle_types vt ON v.vehicle_type_id = vt.vehicle_type_id
       JOIN parking_areas pa ON t.area_id = pa.area_id
       JOIN branches b ON pa.branch_id = b.branch_id
       ${whereClause}
       GROUP BY vt.type_name`,
      params
    );

    // Revenue by branch
    const [revenueByBranch] = await db.query(
      `SELECT 
        b.branch_name,
        COALESCE(SUM(t.total_amount), 0) as total,
        COUNT(*) as count
       FROM transactions t
       JOIN parking_areas pa ON t.area_id = pa.area_id
       JOIN branches b ON pa.branch_id = b.branch_id
       ${whereClause}
       GROUP BY b.branch_id
       ORDER BY total DESC`,
      params
    );

    console.log('✅ [getRevenueStats] Stats calculated');

    res.json({
      success: true,
      data: {
        total_revenue: totalStats[0].total_revenue,
        total_transactions: totalStats[0].total_transactions,
        avg_duration: totalStats[0].avg_duration,
        revenue_by_method: revenueByMethod,
        revenue_by_vehicle: revenueByVehicle,
        revenue_by_branch: revenueByBranch
      }
    });
  } catch (error) {
    console.error('❌ [getRevenueStats] Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error: ' + (error.message || 'Failed to fetch revenue stats')
    });
  }
};

// Get today's summary
exports.getTodaySummary = async (req, res) => {
  try {
    const { branch_id } = req.query;

    let whereClause = 'WHERE DATE(t.exit_time) = CURDATE() AND t.payment_status = "paid"';
    const params = [];

    if (branch_id) {
      whereClause += ' AND b.branch_id = ?';
      params.push(branch_id);
    }

    console.log('🔄 [getTodaySummary] Fetching today summary...');

    const [todayStats] = await db.query(
      `SELECT 
        COALESCE(SUM(t.total_amount), 0) as today_revenue,
        COUNT(*) as today_transactions,
        SUM(CASE WHEN t.payment_method = 'cash' THEN 1 ELSE 0 END) as cash_count,
        SUM(CASE WHEN t.payment_method = 'qris' THEN 1 ELSE 0 END) as qris_count
       FROM transactions t
       JOIN parking_areas pa ON t.area_id = pa.area_id
       JOIN branches b ON pa.branch_id = b.branch_id
       ${whereClause}`,
      params
    );

    // Active (pending) transactions
    let pendingWhere = 'WHERE t.payment_status = "pending"';
    const pendingParams = [];

    if (branch_id) {
      pendingWhere += ' AND b.branch_id = ?';
      pendingParams.push(branch_id);
    }

    const [pendingStats] = await db.query(
      `SELECT COUNT(*) as pending_transactions
       FROM transactions t
       JOIN parking_areas pa ON t.area_id = pa.area_id
       JOIN branches b ON pa.branch_id = b.branch_id
       ${pendingWhere}`,
      pendingParams
    );

    console.log('✅ [getTodaySummary] Summary calculated');

    res.json({
      success: true,
      data: {
        today_revenue: todayStats[0].today_revenue,
        today_transactions: todayStats[0].today_transactions,
        cash_count: todayStats[0].cash_count,
        qris_count: todayStats[0].qris_count,
        pending_transactions: pendingStats[0].pending_transactions
      }
    });
  } catch (error) {
    console.error('❌ [getTodaySummary] Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error: ' + (error.message || 'Failed to fetch today summary')
    });
  }
};
