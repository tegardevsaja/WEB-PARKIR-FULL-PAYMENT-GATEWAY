const db = require('../config/database');

// Get all parking areas
exports.getAllAreas = async (req, res) => {
  try {
    const { branch_id } = req.query;
    
    let query = `
      SELECT pa.*, b.branch_name,
             (SELECT COUNT(*) FROM transactions t 
              WHERE t.area_id = pa.area_id AND t.exit_time IS NULL) as current_occupancy
      FROM parking_areas pa
      JOIN branches b ON pa.branch_id = b.branch_id
      WHERE 1=1
    `;
    const params = [];

    if (branch_id) {
      query += ' AND pa.branch_id = ?';
      params.push(branch_id);
    }

    query += ' ORDER BY pa.area_id DESC';

    console.log('🔄 [getAllAreas] Fetching areas...');
    
    const [areas] = await db.query(query, params);
    
    console.log('✅ [getAllAreas] Areas found:', areas.length);
    console.table(areas);

    res.json({
      success: true,
      data: areas
    });
  } catch (error) {
    console.error('❌ [getAllAreas] Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error: ' + (error.message || 'Unknown error'),
      error: error.stack
    });
  }
};

// Create parking area
exports.createArea = async (req, res) => {
  try {
    const { branch_id, area_name, capacity } = req.body;

    if (!branch_id || !area_name || !capacity) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    console.log('➕ [createArea] Creating area:', { branch_id, area_name, capacity });

    const [result] = await db.query(
      'INSERT INTO parking_areas (branch_id, area_name, capacity) VALUES (?, ?, ?)',
      [branch_id, area_name, capacity]
    );

    console.log('✅ [createArea] Created with ID:', result.insertId);

    await db.query(
      'INSERT INTO activity_logs (user_id, action, description) VALUES (?, ?, ?)',
      [req.user.user_id, 'create_area', `Created parking area: ${area_name}`]
    );

    res.status(201).json({
      success: true,
      message: 'Parking area created successfully',
      data: { area_id: result.insertId }
    });
  } catch (error) {
    console.error('❌ [createArea] Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Update parking area
exports.updateArea = async (req, res) => {
  try {
    const { id } = req.params;
    const { branch_id, area_name, capacity } = req.body;

    console.log('📝 [updateArea] Updating area:', id, { branch_id, area_name, capacity });

    const [areas] = await db.query('SELECT * FROM parking_areas WHERE area_id = ?', [id]);
    if (areas.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Parking area not found'
      });
    }

    const [result] = await db.query(
      'UPDATE parking_areas SET branch_id = ?, area_name = ?, capacity = ? WHERE area_id = ?',
      [branch_id, area_name, capacity, id]
    );

    console.log('✅ [updateArea] Updated, affectedRows:', result.affectedRows);

    await db.query(
      'INSERT INTO activity_logs (user_id, action, description) VALUES (?, ?, ?)',
      [req.user.user_id, 'update_area', `Updated parking area: ${area_name}`]
    );

    res.json({
      success: true,
      message: 'Parking area updated successfully'
    });
  } catch (error) {
    console.error('❌ [updateArea] Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Delete parking area
exports.deleteArea = async (req, res) => {
  try {
    const { id } = req.params;

    const [areas] = await db.query('SELECT area_name FROM parking_areas WHERE area_id = ?', [id]);
    if (areas.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Parking area not found'
      });
    }

    console.log('🗑️ [deleteArea] Deleting area:', id, areas[0].area_name);

    // Delete related transactions first (foreign key constraint)
    await db.query('DELETE FROM transactions WHERE area_id = ?', [id]);
    console.log('✅ [deleteArea] Deleted related transactions');

    // Now delete the area
    await db.query('DELETE FROM parking_areas WHERE area_id = ?', [id]);
    console.log('✅ [deleteArea] Deleted area:', id);

    await db.query(
      'INSERT INTO activity_logs (user_id, action, description) VALUES (?, ?, ?)',
      [req.user.user_id, 'delete_area', `Deleted parking area: ${areas[0].area_name}`]
    );

    res.json({
      success: true,
      message: 'Parking area deleted successfully'
    });
  } catch (error) {
    console.error('❌ [deleteArea] Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error: ' + (error.message || 'Failed to delete area')
    });
  }
};
