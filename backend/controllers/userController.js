const bcrypt = require('bcryptjs');
const db = require('../config/database');

// Get all users (Admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const { search, role, branch_id } = req.query;
    
    let query = `
      SELECT u.user_id, u.username, u.full_name, u.role, u.branch_id, 
             b.branch_name, u.created_at
      FROM users u
      LEFT JOIN branches b ON u.branch_id = b.branch_id
      WHERE 1=1
    `;
    const params = [];

    if (search) {
      query += ' AND (u.username LIKE ? OR u.full_name LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    if (role) {
      query += ' AND u.role = ?';
      params.push(role);
    }

    if (branch_id) {
      query += ' AND u.branch_id = ?';
      params.push(branch_id);
    }

    query += ' ORDER BY u.user_id DESC';

    console.log('🔄 [getAllUsers] Fetching users...');
    
    const [users] = await db.query(query, params);
    
    console.log('✅ [getAllUsers] Users found:', users.length);
    console.table(users);

    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('❌ [getAllUsers] Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get users by branch (Owner only - for their branch)
exports.getUsersByBranch = async (req, res) => {
  try {
    const branchId = req.user.branch_id;

    const [users] = await db.query(
      `SELECT u.user_id, u.username, u.full_name, u.role, u.branch_id, 
              b.branch_name, u.created_at
       FROM users u
       LEFT JOIN branches b ON u.branch_id = b.branch_id
       WHERE u.branch_id = ? AND u.role = 'petugas'
       ORDER BY u.user_id DESC`,
      [branchId]
    );

    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('Get users by branch error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Create user
exports.createUser = async (req, res) => {
  try {
    const { username, password, full_name, role, branch_id } = req.body;

    // Validate input
    if (!username || !password || !full_name || !role) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    console.log('➕ [createUser] Creating user:', { username, full_name, role, branch_id });

    // Check if username exists
    const [existing] = await db.query(
      'SELECT user_id FROM users WHERE username = ?',
      [username]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Username already exists'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const [result] = await db.query(
      'INSERT INTO users (username, password, full_name, role, branch_id) VALUES (?, ?, ?, ?, ?)',
      [username, hashedPassword, full_name, role, branch_id || null]
    );

    // Log activity
    await db.query(
      'INSERT INTO activity_logs (user_id, action, description) VALUES (?, ?, ?)',
      [req.user.user_id, 'create_user', `Created user: ${username}`]
    );

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: { user_id: result.insertId }
    });
  } catch (error) {
    console.error('❌ [createUser] Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, password, full_name, role, branch_id } = req.body;

    console.log('📝 [updateUser] Updating user:', id, { username, full_name, role, branch_id });

    // Check if user exists
    const [users] = await db.query('SELECT * FROM users WHERE user_id = ?', [id]);
    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    let query = 'UPDATE users SET username = ?, full_name = ?, role = ?, branch_id = ?';
    let params = [username, full_name, role, branch_id || null];

    // Update password if provided
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      query += ', password = ?';
      params.push(hashedPassword);
    }

    query += ' WHERE user_id = ?';
    params.push(id);

    await db.query(query, params);

    // Log activity
    await db.query(
      'INSERT INTO activity_logs (user_id, action, description) VALUES (?, ?, ?)',
      [req.user.user_id, 'update_user', `Updated user: ${username}`]
    );

    res.json({
      success: true,
      message: 'User updated successfully'
    });
  } catch (error) {
    console.error('❌ [updateUser] Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    console.log('🗑️ [deleteUser] Deleting user:', id);

    // Check if user exists
    const [users] = await db.query('SELECT username FROM users WHERE user_id = ?', [id]);
    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    await db.query('DELETE FROM users WHERE user_id = ?', [id]);
    console.log('✅ [deleteUser] Deleted user:', id);

    // Log activity
    await db.query(
      'INSERT INTO activity_logs (user_id, action, description) VALUES (?, ?, ?)',
      [req.user.user_id, 'delete_user', `Deleted user: ${users[0].username}`]
    );

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('❌ [deleteUser] Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
