const db = require('../config/database');

// Get all activity logs
exports.getAllLogs = async (req, res) => {
  try {
    const { search, action, user_id, start_date, end_date } = req.query;
    
    let query = `
      SELECT al.*, u.username, u.full_name, u.role
      FROM activity_logs al
      LEFT JOIN users u ON al.user_id = u.user_id
      WHERE 1=1
    `;
    const params = [];

    if (search) {
      query += ' AND (al.description LIKE ? OR u.username LIKE ? OR u.full_name LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (action) {
      query += ' AND al.action = ?';
      params.push(action);
    }

    if (user_id) {
      query += ' AND al.user_id = ?';
      params.push(user_id);
    }

    if (start_date) {
      query += ' AND DATE(al.timestamp) >= ?';
      params.push(start_date);
    }

    if (end_date) {
      query += ' AND DATE(al.timestamp) <= ?';
      params.push(end_date);
    }

    query += ' ORDER BY al.log_id DESC';

    const [logs] = await db.query(query, params);

    res.json({
      success: true,
      data: logs
    });
  } catch (error) {
    console.error('Get logs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get log by ID
exports.getLogById = async (req, res) => {
  try {
    const { id } = req.params;

    const [logs] = await db.query(
      `SELECT al.*, u.username, u.full_name, u.role
       FROM activity_logs al
       LEFT JOIN users u ON al.user_id = u.user_id
       WHERE al.log_id = ?`,
      [id]
    );

    if (logs.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Log not found'
      });
    }

    res.json({
      success: true,
      data: logs[0]
    });
  } catch (error) {
    console.error('Get log error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
