const db = require('../config/database');

// Get all branches
exports.getAllBranches = async (req, res) => {
  try {
    const [branches] = await db.query(`
      SELECT b.*, 
             COUNT(DISTINCT pa.area_id) as total_areas,
             COUNT(DISTINCT u.user_id) as total_petugas
      FROM branches b
      LEFT JOIN parking_areas pa ON b.branch_id = pa.branch_id
      LEFT JOIN users u ON b.branch_id = u.branch_id AND u.role = 'petugas'
      GROUP BY b.branch_id
      ORDER BY b.branch_id DESC
    `);

    res.json({
      success: true,
      data: branches
    });
  } catch (error) {
    console.error('Get branches error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get branch by ID
exports.getBranchById = async (req, res) => {
  try {
    const { id } = req.params;

    const [branches] = await db.query(
      'SELECT * FROM branches WHERE branch_id = ?',
      [id]
    );

    if (branches.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Branch not found'
      });
    }

    res.json({
      success: true,
      data: branches[0]
    });
  } catch (error) {
    console.error('Get branch error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Create branch
exports.createBranch = async (req, res) => {
  try {
    const { branch_name, address, phone } = req.body;

    if (!branch_name || !address) {
      return res.status(400).json({
        success: false,
        message: 'Branch name and address are required'
      });
    }

    const [result] = await db.query(
      'INSERT INTO branches (branch_name, address, phone) VALUES (?, ?, ?)',
      [branch_name, address, phone]
    );

    // Log activity
    await db.query(
      'INSERT INTO activity_logs (user_id, action, description) VALUES (?, ?, ?)',
      [req.user.user_id, 'create_branch', `Created branch: ${branch_name}`]
    );

    res.status(201).json({
      success: true,
      message: 'Branch created successfully',
      data: { branch_id: result.insertId }
    });
  } catch (error) {
    console.error('Create branch error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Update branch
exports.updateBranch = async (req, res) => {
  try {
    const { id } = req.params;
    const { branch_name, address, phone } = req.body;

    const [branches] = await db.query('SELECT * FROM branches WHERE branch_id = ?', [id]);
    if (branches.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Branch not found'
      });
    }

    console.log('UPDATE branch id:', id, 'data:', { branch_name, address, phone });

    const [result] = await db.query(
      'UPDATE branches SET branch_name = ?, address = ?, phone = ? WHERE branch_id = ?',
      [branch_name, address, phone, id]
    );

    console.log('UPDATE result - affectedRows:', result.affectedRows);

    // Log activity
    await db.query(
      'INSERT INTO activity_logs (user_id, action, description) VALUES (?, ?, ?)',
      [req.user.user_id, 'update_branch', `Updated branch: ${branch_name}`]
    );

    res.json({
      success: true,
      message: 'Branch updated successfully'
    });
  } catch (error) {
    console.error('Update branch error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Delete branch
exports.deleteBranch = async (req, res) => {
  try {
    const { id } = req.params;

    const [branches] = await db.query('SELECT branch_name FROM branches WHERE branch_id = ?', [id]);
    if (branches.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Branch not found'
      });
    }

    // Get all area_ids for this branch
    const [areas] = await db.query('SELECT area_id FROM parking_areas WHERE branch_id = ?', [id]);
    const areaIds = areas.map(a => a.area_id);

    console.log('DELETE branch id:', id);
    console.log('Areas found:', areaIds);

    // Delete in correct order
    if (areaIds.length > 0) {
      // 1. Delete transactions for these areas
      await db.query('DELETE FROM transactions WHERE area_id IN (?)', [areaIds]);
    }

    // 2. Delete parking_rates for this branch
    await db.query('DELETE FROM parking_rates WHERE branch_id = ?', [id]);

    // 3. Delete parking_areas for this branch
    await db.query('DELETE FROM parking_areas WHERE branch_id = ?', [id]);

    // 4. Set users branch_id to NULL for this branch
    await db.query('UPDATE users SET branch_id = NULL WHERE branch_id = ?', [id]);

    // 5. Finally delete the branch
    await db.query('DELETE FROM branches WHERE branch_id = ?', [id]);

    // Log activity
    await db.query(
      'INSERT INTO activity_logs (user_id, action, description) VALUES (?, ?, ?)',
      [req.user.user_id, 'delete_branch', `Deleted branch: ${branches[0].branch_name}`]
    );

    res.json({
      success: true,
      message: 'Branch deleted successfully'
    });
  } catch (error) {
    console.error('Delete branch error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error: ' + (error.message || 'Failed to delete branch')
    });
  }
};
