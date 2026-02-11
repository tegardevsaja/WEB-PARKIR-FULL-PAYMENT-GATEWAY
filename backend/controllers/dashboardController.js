const db = require('../config/database');

// Get dashboard statistics
exports.getDashboardStats = async (req, res) => {
  try {
    const { branch_id } = req.query;
    const userRole = req.user.role;
    const userBranchId = req.user.branch_id;

    // Determine which branch to query
    let targetBranchId = null;
    if (userRole === 'admin' && branch_id) {
      targetBranchId = branch_id;
    } else if (userRole === 'owner' || userRole === 'petugas') {
      targetBranchId = userBranchId;
    }

    let branchCondition = '';
    const params = [];
    if (targetBranchId) {
      branchCondition = 'AND b.branch_id = ?';
      params.push(targetBranchId);
    }

    // Total vehicles currently parked
    const [currentVehicles] = await db.query(
      `SELECT COUNT(*) as total
       FROM tickets t
       JOIN parking_areas pa ON t.area_id = pa.area_id
       JOIN branches b ON pa.branch_id = b.branch_id
       WHERE t.exit_time IS NULL ${branchCondition}`,
      params
    );

    // Today's revenue
    const [todayRevenue] = await db.query(
      `SELECT COALESCE(SUM(p.amount), 0) as total
       FROM payments p
       JOIN tickets t ON p.ticket_id = t.ticket_id
       JOIN parking_areas pa ON t.area_id = pa.area_id
       JOIN branches b ON pa.branch_id = b.branch_id
       WHERE p.payment_status = 'paid'
       AND DATE(p.payment_time) = CURDATE() ${branchCondition}`,
      params
    );

    // Today's transactions
    const [todayTransactions] = await db.query(
      `SELECT COUNT(*) as total
       FROM payments p
       JOIN tickets t ON p.ticket_id = t.ticket_id
       JOIN parking_areas pa ON t.area_id = pa.area_id
       JOIN branches b ON pa.branch_id = b.branch_id
       WHERE DATE(p.payment_time) = CURDATE() ${branchCondition}`,
      params
    );

    // Total capacity and occupancy
    const [capacityInfo] = await db.query(
      `SELECT 
         SUM(pa.capacity) as total_capacity,
         (SELECT COUNT(*) FROM tickets t2 
          JOIN parking_areas pa2 ON t2.area_id = pa2.area_id
          JOIN branches b2 ON pa2.branch_id = b2.branch_id
          WHERE t2.exit_time IS NULL ${branchCondition.replace('b.', 'b2.')}) as current_occupancy
       FROM parking_areas pa
       JOIN branches b ON pa.branch_id = b.branch_id
       WHERE 1=1 ${branchCondition}`,
      params
    );

    // Recent transactions (last 5)
    const [recentTransactions] = await db.query(
      `SELECT p.payment_id, p.amount, p.payment_method, p.payment_status, p.payment_time,
              t.ticket_number, t.license_plate, vt.type_name as vehicle_type_name
       FROM payments p
       JOIN tickets t ON p.ticket_id = t.ticket_id
       JOIN vehicle_types vt ON t.vehicle_type_id = vt.vehicle_type_id
       JOIN parking_areas pa ON t.area_id = pa.area_id
       JOIN branches b ON pa.branch_id = b.branch_id
       WHERE 1=1 ${branchCondition}
       ORDER BY p.payment_time DESC
       LIMIT 5`,
      params
    );

    // Vehicle type breakdown (currently parked)
    const [vehicleBreakdown] = await db.query(
      `SELECT vt.type_name as vehicle_type_name, COUNT(*) as count
       FROM tickets t
       JOIN vehicle_types vt ON t.vehicle_type_id = vt.vehicle_type_id
       JOIN parking_areas pa ON t.area_id = pa.area_id
       JOIN branches b ON pa.branch_id = b.branch_id
       WHERE t.exit_time IS NULL ${branchCondition}
       GROUP BY vt.type_name`,
      params
    );

    // Monthly revenue (last 6 months)
    const [monthlyRevenue] = await db.query(
      `SELECT 
         DATE_FORMAT(p.payment_time, '%Y-%m') as month,
         COALESCE(SUM(p.amount), 0) as revenue
       FROM payments p
       JOIN tickets t ON p.ticket_id = t.ticket_id
       JOIN parking_areas pa ON t.area_id = pa.area_id
       JOIN branches b ON pa.branch_id = b.branch_id
       WHERE p.payment_status = 'paid'
       AND p.payment_time >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH) ${branchCondition}
       GROUP BY DATE_FORMAT(p.payment_time, '%Y-%m')
       ORDER BY month DESC`,
      params
    );

    res.json({
      success: true,
      data: {
        current_vehicles: currentVehicles[0].total,
        today_revenue: todayRevenue[0].total,
        today_transactions: todayTransactions[0].total,
        total_capacity: capacityInfo[0].total_capacity || 0,
        current_occupancy: capacityInfo[0].current_occupancy || 0,
        occupancy_percentage: capacityInfo[0].total_capacity > 0 
          ? ((capacityInfo[0].current_occupancy / capacityInfo[0].total_capacity) * 100).toFixed(1)
          : 0,
        recent_transactions: recentTransactions,
        vehicle_breakdown: vehicleBreakdown,
        monthly_revenue: monthlyRevenue
      }
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get branch comparison (Admin only)
exports.getBranchComparison = async (req, res) => {
  try {
    const [branchStats] = await db.query(
      `SELECT 
         b.branch_id,
         b.branch_name,
         (SELECT COUNT(*) FROM tickets t 
          JOIN parking_areas pa ON t.area_id = pa.area_id
          WHERE pa.branch_id = b.branch_id AND t.exit_time IS NULL) as current_vehicles,
         (SELECT COALESCE(SUM(p.amount), 0) FROM payments p
          JOIN tickets t ON p.ticket_id = t.ticket_id
          JOIN parking_areas pa ON t.area_id = pa.area_id
          WHERE pa.branch_id = b.branch_id 
          AND p.payment_status = 'paid'
          AND DATE(p.payment_time) = CURDATE()) as today_revenue,
         (SELECT COALESCE(SUM(p.amount), 0) FROM payments p
          JOIN tickets t ON p.ticket_id = t.ticket_id
          JOIN parking_areas pa ON t.area_id = pa.area_id
          WHERE pa.branch_id = b.branch_id 
          AND p.payment_status = 'paid'
          AND MONTH(p.payment_time) = MONTH(CURDATE())
          AND YEAR(p.payment_time) = YEAR(CURDATE())) as month_revenue
       FROM branches b
       ORDER BY b.branch_id`
    );

    res.json({
      success: true,
      data: branchStats
    });
  } catch (error) {
    console.error('Get branch comparison error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
