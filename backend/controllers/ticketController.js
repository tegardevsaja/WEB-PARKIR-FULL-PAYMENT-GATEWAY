const db = require('../config/database');

// Generate ticket number
function generateTicketNumber() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `TKT-${year}${month}${day}-${random}`;
}

// Calculate parking fee
function calculateParkingFee(entryTime, exitTime, firstHourRate, nextHourRate) {
  const entry = new Date(entryTime);
  const exit = new Date(exitTime);
  const diffMs = exit - entry;
  const diffHours = Math.ceil(diffMs / (1000 * 60 * 60)); // Round up to nearest hour

  if (diffHours <= 1) {
    return firstHourRate;
  } else {
    return firstHourRate + ((diffHours - 1) * nextHourRate);
  }
}

// Entry - Create ticket
exports.createTicket = async (req, res) => {
  try {
    const { license_plate, vehicle_type_id, area_id } = req.body;
    const user_id = req.user.user_id;

    if (!license_plate || !vehicle_type_id || !area_id) {
      return res.status(400).json({
        success: false,
        message: 'License plate, vehicle type, and area are required'
      });
    }

    // Check area capacity
    const [areaInfo] = await db.query(
      `SELECT pa.capacity, pa.branch_id,
              (SELECT COUNT(*) FROM transactions t 
               WHERE t.area_id = pa.area_id AND t.exit_time IS NULL) as current_occupancy
       FROM parking_areas pa
       WHERE pa.area_id = ?`,
      [area_id]
    );

    if (areaInfo.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Parking area not found'
      });
    }

    if (areaInfo[0].current_occupancy >= areaInfo[0].capacity) {
      return res.status(400).json({
        success: false,
        message: 'Parking area is full'
      });
    }

    // Check if vehicle exists, if not create it
    let [vehicle] = await db.query(
      'SELECT vehicle_id FROM vehicles WHERE license_plate = ?',
      [license_plate.toUpperCase()]
    );

    let vehicleId;
    if (vehicle.length === 0) {
      // Create new vehicle
      const [vehicleResult] = await db.query(
        'INSERT INTO vehicles (license_plate, vehicle_type_id) VALUES (?, ?)',
        [license_plate.toUpperCase(), vehicle_type_id]
      );
      vehicleId = vehicleResult.insertId;
      console.log('✅ [createTicket] Created new vehicle, ID:', vehicleId);
    } else {
      vehicleId = vehicle[0].vehicle_id;
      console.log('✅ [createTicket] Found existing vehicle, ID:', vehicleId);
    }

    // Generate ticket number
    const ticketNumber = generateTicketNumber();

    // Insert transaction
    const [result] = await db.query(
      `INSERT INTO transactions (ticket_number, vehicle_id, area_id, entry_time, officer_id, payment_status)
       VALUES (?, ?, ?, NOW(), ?, 'pending')`,
      [ticketNumber, vehicleId, area_id, user_id]
    );

    // Log activity
    await db.query(
      'INSERT INTO activity_logs (user_id, action, description) VALUES (?, ?, ?)',
      [user_id, 'vehicle_entry', `Vehicle ${license_plate} entered - Ticket: ${ticketNumber}`]
    );

    // Get created ticket with vehicle info
    const [ticket] = await db.query(
      `SELECT t.*, v.license_plate, vt.type_name as vehicle_type_name, pa.area_name, b.branch_name
       FROM transactions t
       JOIN vehicles v ON t.vehicle_id = v.vehicle_id
       JOIN vehicle_types vt ON v.vehicle_type_id = vt.vehicle_type_id
       JOIN parking_areas pa ON t.area_id = pa.area_id
       JOIN branches b ON pa.branch_id = b.branch_id
       WHERE t.transaction_id = ?`,
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: 'Ticket created successfully',
      data: ticket[0]
    });
  } catch (error) {
    console.error('❌ [createTicket] Error:', error);
    console.error('❌ [createTicket] Error message:', error.message);
    console.error('❌ [createTicket] Error code:', error.code);
    res.status(500).json({
      success: false,
      message: 'Server error: ' + (error.message || 'Failed to create ticket'),
      error_detail: error.message
    });
  }
};

// Search ticket for exit
exports.searchTicket = async (req, res) => {
  try {
    const { ticket_number, license_plate } = req.query;

    if (!ticket_number && !license_plate) {
      return res.status(400).json({
        success: false,
        message: 'Ticket number or license plate is required'
      });
    }

    let query = `
      SELECT t.*, v.license_plate, v.vehicle_type_id, vt.type_name as vehicle_type_name, pa.area_name, pa.branch_id, b.branch_name
      FROM transactions t
      JOIN vehicles v ON t.vehicle_id = v.vehicle_id
      JOIN vehicle_types vt ON v.vehicle_type_id = vt.vehicle_type_id
      JOIN parking_areas pa ON t.area_id = pa.area_id
      JOIN branches b ON pa.branch_id = b.branch_id
      WHERE t.exit_time IS NULL
    `;
    const params = [];

    if (ticket_number) {
      query += ' AND t.ticket_number = ?';
      params.push(ticket_number);
    } else if (license_plate) {
      query += ' AND v.license_plate = ?';
      params.push(license_plate.toUpperCase());
    }

    const [tickets] = await db.query(query, params);

    if (tickets.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Active ticket not found'
      });
    }

    // Map transaction_id to ticket_id for frontend compatibility
    const ticket = {
      ...tickets[0],
      ticket_id: tickets[0].transaction_id
    };

    // Get parking rate
    const [rates] = await db.query(
      `SELECT first_hour_rate, next_hour_rate
       FROM parking_rates
       WHERE branch_id = ? AND vehicle_type_id = ?
       ORDER BY effective_date DESC
       LIMIT 1`,
      [ticket.branch_id, ticket.vehicle_type_id]
    );

    if (rates.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Parking rate not found'
      });
    }

    // Calculate fee
    const amount = calculateParkingFee(
      ticket.entry_time,
      new Date(),
      rates[0].first_hour_rate,
      rates[0].next_hour_rate
    );

    res.json({
      success: true,
      data: {
        ...ticket,
        calculated_amount: amount,
        first_hour_rate: rates[0].first_hour_rate,
        next_hour_rate: rates[0].next_hour_rate
      }
    });
  } catch (error) {
    console.error('Search ticket error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Exit - Process payment
exports.processExit = async (req, res) => {
  try {
    const { ticket_id, payment_method } = req.body;
    const user_id = req.user.user_id;

    if (!ticket_id || !payment_method) {
      return res.status(400).json({
        success: false,
        message: 'Ticket ID and payment method are required'
      });
    }

    // Get ticket info
    const [tickets] = await db.query(
      `SELECT t.*, pa.branch_id
       FROM transactions t
       JOIN parking_areas pa ON t.area_id = pa.area_id
       WHERE t.transaction_id = ? AND t.exit_time IS NULL`,
      [ticket_id]
    );

    if (tickets.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Active ticket not found'
      });
    }

    const ticket = tickets[0];

    // Get parking rate
    const [rates] = await db.query(
      `SELECT first_hour_rate, next_hour_rate
       FROM parking_rates
       WHERE branch_id = ? AND vehicle_type_id = ?
       ORDER BY effective_date DESC
       LIMIT 1`,
      [ticket.branch_id, ticket.vehicle_type_id]
    );

    if (rates.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Parking rate not found'
      });
    }

    const exitTime = new Date();
    const amount = calculateParkingFee(
      ticket.entry_time,
      exitTime,
      rates[0].first_hour_rate,
      rates[0].next_hour_rate
    );

    // Update ticket
    await db.query(
      'UPDATE transactions SET exit_time = ?, officer_id = ? WHERE transaction_id = ?',
      [exitTime, user_id, ticket_id]
    );

    // Create payment record
    const paymentStatus = payment_method === 'cash' ? 'paid' : 'pending';
    
    const [paymentResult] = await db.query(
      `INSERT INTO payments (ticket_id, amount, payment_method, payment_status, payment_time)
       VALUES (?, ?, ?, ?, ?)`,
      [ticket_id, amount, payment_method, paymentStatus, exitTime]
    );

    // Log activity
    await db.query(
      'INSERT INTO activity_logs (user_id, action, description) VALUES (?, ?, ?)',
      [user_id, 'vehicle_exit', `Vehicle ${ticket.license_plate} exited - Amount: ${amount}`]
    );

    res.json({
      success: true,
      message: 'Exit processed successfully',
      data: {
        payment_id: paymentResult.insertId,
        ticket_number: ticket.ticket_number,
        license_plate: ticket.license_plate,
        entry_time: ticket.entry_time,
        exit_time: exitTime,
        amount: amount,
        payment_method: payment_method,
        payment_status: paymentStatus
      }
    });
  } catch (error) {
    console.error('Process exit error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get active tickets
exports.getActiveTickets = async (req, res) => {
  try {
    const { branch_id } = req.query;

    let query = `
      SELECT t.*, v.license_plate, v.vehicle_type_id, vt.type_name as vehicle_type_name, pa.area_name, b.branch_name,
             u.full_name as entry_officer
      FROM transactions t
      JOIN vehicles v ON t.vehicle_id = v.vehicle_id
      JOIN vehicle_types vt ON v.vehicle_type_id = vt.vehicle_type_id
      JOIN parking_areas pa ON t.area_id = pa.area_id
      JOIN branches b ON pa.branch_id = b.branch_id
      LEFT JOIN users u ON t.officer_id = u.user_id
      WHERE t.exit_time IS NULL
    `;
    const params = [];

    if (branch_id) {
      query += ' AND pa.branch_id = ?';
      params.push(branch_id);
    }

    query += ' ORDER BY t.entry_time DESC';

    const [tickets] = await db.query(query, params);

    res.json({
      success: true,
      data: tickets
    });
  } catch (error) {
    console.error('Get active tickets error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
