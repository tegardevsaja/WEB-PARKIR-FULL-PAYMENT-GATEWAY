const db = require('../config/database');

// Get all parking rates
exports.getAllRates = async (req, res) => {
  try {
    const { branch_id, vehicle_type_id } = req.query;
    
    let query = `
      SELECT pr.*, b.branch_name, vt.type_name as vehicle_type_name
      FROM parking_rates pr
      JOIN branches b ON pr.branch_id = b.branch_id
      JOIN vehicle_types vt ON pr.vehicle_type_id = vt.vehicle_type_id
      WHERE 1=1
    `;
    const params = [];

    if (branch_id) {
      query += ' AND pr.branch_id = ?';
      params.push(branch_id);
    }

    if (vehicle_type_id) {
      query += ' AND pr.vehicle_type_id = ?';
      params.push(vehicle_type_id);
    }

    query += ' ORDER BY pr.rate_id DESC';

    console.log('🔄 [getAllRates] Fetching rates...');
    
    const [rates] = await db.query(query, params);
    
    console.log('✅ [getAllRates] Rates found:', rates.length);
    console.table(rates);

    res.json({
      success: true,
      data: rates
    });
  } catch (error) {
    console.error('❌ [getAllRates] Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get active rate for calculation
exports.getActiveRate = async (req, res) => {
  try {
    const { branch_id, vehicle_type_id } = req.query;

    if (!branch_id || !vehicle_type_id) {
      return res.status(400).json({
        success: false,
        message: 'Branch ID and Vehicle Type ID are required'
      });
    }

    const [rates] = await db.query(
      `SELECT pr.*, vt.type_name as vehicle_type_name
       FROM parking_rates pr
       JOIN vehicle_types vt ON pr.vehicle_type_id = vt.vehicle_type_id
       WHERE pr.branch_id = ? AND pr.vehicle_type_id = ?
       ORDER BY pr.effective_date DESC
       LIMIT 1`,
      [branch_id, vehicle_type_id]
    );

    if (rates.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No rate found for this branch and vehicle type'
      });
    }

    res.json({
      success: true,
      data: rates[0]
    });
  } catch (error) {
    console.error('Get active rate error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Create parking rate
exports.createRate = async (req, res) => {
  try {
    const { branch_id, vehicle_type_id, first_hour_rate, next_hour_rate, effective_date } = req.body;

    if (!branch_id || !vehicle_type_id || !first_hour_rate || !next_hour_rate) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    console.log('➕ [createRate] Creating rate:', { branch_id, vehicle_type_id, first_hour_rate, next_hour_rate, effective_date });

    const [result] = await db.query(
      'INSERT INTO parking_rates (branch_id, vehicle_type_id, first_hour_rate, next_hour_rate, effective_date) VALUES (?, ?, ?, ?, ?)',
      [branch_id, vehicle_type_id, first_hour_rate, next_hour_rate, effective_date || new Date()]
    );

    await db.query(
      'INSERT INTO activity_logs (user_id, action, description) VALUES (?, ?, ?)',
      [req.user.user_id, 'create_rate', `Created parking rate for branch ${branch_id}`]
    );

    res.status(201).json({
      success: true,
      message: 'Parking rate created successfully',
      data: { rate_id: result.insertId }
    });
  } catch (error) {
    console.error('❌ [createRate] Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Update parking rate
exports.updateRate = async (req, res) => {
  try {
    const { id } = req.params;
    const { branch_id, vehicle_type_id, first_hour_rate, next_hour_rate, effective_date } = req.body;

    console.log('📝 [updateRate] Updating rate:', id, { branch_id, vehicle_type_id, first_hour_rate, next_hour_rate, effective_date });

    const [rates] = await db.query('SELECT * FROM parking_rates WHERE rate_id = ?', [id]);
    if (rates.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Parking rate not found'
      });
    }

    const [result] = await db.query(
      'UPDATE parking_rates SET branch_id = ?, vehicle_type_id = ?, first_hour_rate = ?, next_hour_rate = ?, effective_date = ? WHERE rate_id = ?',
      [branch_id, vehicle_type_id, first_hour_rate, next_hour_rate, effective_date, id]
    );

    await db.query(
      'INSERT INTO activity_logs (user_id, action, description) VALUES (?, ?, ?)',
      [req.user.user_id, 'update_rate', `Updated parking rate ID: ${id}`]
    );

    res.json({
      success: true,
      message: 'Parking rate updated successfully'
    });
  } catch (error) {
    console.error('❌ [updateRate] Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Delete parking rate
exports.deleteRate = async (req, res) => {
  try {
    const { id } = req.params;

    const [rates] = await db.query('SELECT * FROM parking_rates WHERE rate_id = ?', [id]);
    if (rates.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Parking rate not found'
      });
    }

    console.log('🗑️ [deleteRate] Deleting rate:', id);

    await db.query('DELETE FROM parking_rates WHERE rate_id = ?', [id]);
    console.log('✅ [deleteRate] Deleted rate:', id);

    await db.query(
      'INSERT INTO activity_logs (user_id, action, description) VALUES (?, ?, ?)',
      [req.user.user_id, 'delete_rate', `Deleted parking rate ID: ${id}`]
    );

    res.json({
      success: true,
      message: 'Parking rate deleted successfully'
    });
  } catch (error) {
    console.error('❌ [deleteRate] Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get vehicle types
exports.getVehicleTypes = async (req, res) => {
  try {
    const [types] = await db.query('SELECT * FROM vehicle_types ORDER BY vehicle_type_id');

    res.json({
      success: true,
      data: types
    });
  } catch (error) {
    console.error('Get vehicle types error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
