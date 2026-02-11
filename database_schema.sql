-- =====================================================
-- DATABASE PARKIR APP - COMPLETE SQL SCHEMA
-- Created: 2025-02-11
-- Purpose: Ujian Praktik Kejuruan RPL
-- =====================================================

-- Drop database if exists (for clean installation)
DROP DATABASE IF EXISTS parkir_app;

-- Create database
CREATE DATABASE parkir_app 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE parkir_app;

-- =====================================================
-- TABLE CREATION
-- =====================================================

-- Table: branches (Cabang)
CREATE TABLE branches (
  branch_id INT AUTO_INCREMENT PRIMARY KEY,
  branch_name VARCHAR(100) NOT NULL,
  address TEXT,
  phone VARCHAR(20),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_is_active (is_active)
) ENGINE=InnoDB COMMENT='Master data cabang parkir';

-- Table: users (User sistem)
CREATE TABLE users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL COMMENT 'Hashed with bcrypt',
  full_name VARCHAR(100) NOT NULL,
  role ENUM('admin', 'petugas', 'owner') NOT NULL,
  branch_id INT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (branch_id) REFERENCES branches(branch_id) ON DELETE SET NULL,
  INDEX idx_username (username),
  INDEX idx_role (role),
  INDEX idx_branch (branch_id),
  INDEX idx_is_active (is_active)
) ENGINE=InnoDB COMMENT='User dengan multi-role (admin, petugas, owner)';

-- Table: parking_areas (Area Parkir)
CREATE TABLE parking_areas (
  area_id INT AUTO_INCREMENT PRIMARY KEY,
  branch_id INT NOT NULL,
  area_name VARCHAR(50) NOT NULL,
  capacity INT NOT NULL COMMENT 'Kapasitas maksimal kendaraan',
  current_occupancy INT DEFAULT 0 COMMENT 'Jumlah kendaraan saat ini',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (branch_id) REFERENCES branches(branch_id) ON DELETE CASCADE,
  INDEX idx_branch (branch_id),
  CHECK (current_occupancy >= 0),
  CHECK (current_occupancy <= capacity)
) ENGINE=InnoDB COMMENT='Area parkir per cabang dengan tracking okupansi';

-- Table: vehicle_types (Jenis Kendaraan)
CREATE TABLE vehicle_types (
  vehicle_type_id INT AUTO_INCREMENT PRIMARY KEY,
  type_name VARCHAR(50) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB COMMENT='Master jenis kendaraan (Motor, Mobil, Bus/Truk)';

-- Table: parking_rates (Tarif Parkir)
CREATE TABLE parking_rates (
  rate_id INT AUTO_INCREMENT PRIMARY KEY,
  branch_id INT NOT NULL,
  vehicle_type_id INT NOT NULL,
  first_hour_rate DECIMAL(10,2) NOT NULL COMMENT 'Tarif jam pertama',
  next_hour_rate DECIMAL(10,2) NOT NULL COMMENT 'Tarif per jam berikutnya',
  effective_date DATE NOT NULL COMMENT 'Tanggal mulai berlaku',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (branch_id) REFERENCES branches(branch_id) ON DELETE CASCADE,
  FOREIGN KEY (vehicle_type_id) REFERENCES vehicle_types(vehicle_type_id) ON DELETE CASCADE,
  INDEX idx_branch_vehicle (branch_id, vehicle_type_id),
  INDEX idx_effective_date (effective_date),
  UNIQUE KEY unique_rate (branch_id, vehicle_type_id, effective_date)
) ENGINE=InnoDB COMMENT='Tarif parkir berbeda per cabang dan jenis kendaraan';

-- Table: vehicles (Kendaraan)
CREATE TABLE vehicles (
  vehicle_id INT AUTO_INCREMENT PRIMARY KEY,
  license_plate VARCHAR(20) NOT NULL UNIQUE COMMENT 'Nomor polisi (plat nomor)',
  vehicle_type_id INT NOT NULL,
  color VARCHAR(30) COMMENT 'Warna kendaraan - bisa diisi kemudian',
  brand VARCHAR(50) COMMENT 'Merk kendaraan - bisa diisi kemudian',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (vehicle_type_id) REFERENCES vehicle_types(vehicle_type_id),
  INDEX idx_license_plate (license_plate),
  INDEX idx_vehicle_type (vehicle_type_id)
) ENGINE=InnoDB COMMENT='Data kendaraan yang pernah parkir - sesuai requirement soal';

-- Table: transactions (Transaksi Parkir)
CREATE TABLE transactions (
  transaction_id INT AUTO_INCREMENT PRIMARY KEY,
  ticket_number VARCHAR(20) UNIQUE NOT NULL COMMENT 'Nomor tiket unik',
  vehicle_id INT NOT NULL,
  area_id INT NOT NULL,
  entry_time TIMESTAMP NOT NULL COMMENT 'Waktu masuk parkir',
  exit_time TIMESTAMP NULL COMMENT 'Waktu keluar parkir',
  duration_hours DECIMAL(5,2) COMMENT 'Durasi parkir dalam jam',
  total_amount DECIMAL(10,2) COMMENT 'Total biaya parkir',
  payment_method ENUM('cash', 'qris') COMMENT 'Metode pembayaran',
  payment_status ENUM('pending', 'paid', 'cancelled') DEFAULT 'pending',
  officer_id INT COMMENT 'Petugas yang melayani',
  midtrans_order_id VARCHAR(100) COMMENT 'Order ID dari Midtrans (untuk QRIS)',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (vehicle_id) REFERENCES vehicles(vehicle_id),
  FOREIGN KEY (area_id) REFERENCES parking_areas(area_id),
  FOREIGN KEY (officer_id) REFERENCES users(user_id) ON DELETE SET NULL,
  INDEX idx_ticket (ticket_number),
  INDEX idx_payment_status (payment_status),
  INDEX idx_entry_time (entry_time),
  INDEX idx_exit_time (exit_time),
  INDEX idx_vehicle (vehicle_id),
  INDEX idx_officer (officer_id),
  INDEX idx_composite_search (payment_status, entry_time, exit_time)
) ENGINE=InnoDB COMMENT='Transaksi parkir masuk dan keluar';

-- Table: activity_logs (Log Aktivitas)
CREATE TABLE activity_logs (
  log_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  action VARCHAR(100) NOT NULL COMMENT 'Jenis aksi (LOGIN, CREATE_USER, UPDATE_RATE, dll)',
  table_name VARCHAR(50) COMMENT 'Nama tabel yang dimodifikasi',
  record_id INT COMMENT 'ID record yang dimodifikasi',
  description TEXT COMMENT 'Deskripsi detail aktivitas',
  ip_address VARCHAR(45) COMMENT 'IP address user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL,
  INDEX idx_user_id (user_id),
  INDEX idx_created_at (created_at),
  INDEX idx_action (action)
) ENGINE=InnoDB COMMENT='Log semua aktivitas penting untuk audit trail';

-- =====================================================
-- STORED PROCEDURES
-- =====================================================

DELIMITER $$

-- Procedure: Update parking occupancy
CREATE PROCEDURE update_parking_occupancy(
  IN p_area_id INT,
  IN p_action ENUM('increment', 'decrement')
)
BEGIN
  IF p_action = 'increment' THEN
    UPDATE parking_areas 
    SET current_occupancy = current_occupancy + 1 
    WHERE area_id = p_area_id 
      AND current_occupancy < capacity;
  ELSE
    UPDATE parking_areas 
    SET current_occupancy = GREATEST(current_occupancy - 1, 0) 
    WHERE area_id = p_area_id;
  END IF;
END$$

-- Procedure: Calculate parking fee
CREATE PROCEDURE calculate_parking_fee(
  IN p_vehicle_type_id INT,
  IN p_branch_id INT,
  IN p_duration DECIMAL(5,2),
  OUT p_total_amount DECIMAL(10,2)
)
BEGIN
  DECLARE v_first_hour_rate DECIMAL(10,2);
  DECLARE v_next_hour_rate DECIMAL(10,2);
  DECLARE v_hours INT;
  
  -- Get latest rate
  SELECT first_hour_rate, next_hour_rate
  INTO v_first_hour_rate, v_next_hour_rate
  FROM parking_rates
  WHERE vehicle_type_id = p_vehicle_type_id
    AND branch_id = p_branch_id
  ORDER BY effective_date DESC
  LIMIT 1;
  
  -- Calculate hours (minimum 1 hour)
  SET v_hours = GREATEST(CEIL(p_duration), 1);
  
  -- Calculate total
  IF v_hours = 1 THEN
    SET p_total_amount = v_first_hour_rate;
  ELSE
    SET p_total_amount = v_first_hour_rate + ((v_hours - 1) * v_next_hour_rate);
  END IF;
END$$

DELIMITER ;

-- =====================================================
-- SAMPLE DATA INSERTION
-- =====================================================

-- Insert vehicle types
INSERT INTO vehicle_types (type_name, description) VALUES
('Motor', 'Sepeda motor dan skuter'),
('Mobil', 'Mobil penumpang (sedan, SUV, MPV)'),
('Bus/Truk', 'Bus, truk, dan kendaraan besar lainnya');

-- Insert branches
INSERT INTO branches (branch_name, address, phone, is_active) VALUES
('Cabang Pusat', 'Jl. Sudirman No. 123, Jakarta Pusat', '021-1234567', TRUE),
('Cabang Utara', 'Jl. Ahmad Yani No. 456, Jakarta Utara', '021-7654321', TRUE),
('Cabang Selatan', 'Jl. Fatmawati No. 789, Jakarta Selatan', '021-9876543', TRUE);

-- Insert parking areas
INSERT INTO parking_areas (branch_id, area_name, capacity, current_occupancy) VALUES
-- Cabang Pusat
(1, 'Area A - Motor', 100, 0),
(1, 'Area B - Mobil', 50, 0),
(1, 'Area C - Bus/Truk', 20, 0),
-- Cabang Utara
(2, 'Area A - Motor', 80, 0),
(2, 'Area B - Mobil', 40, 0),
-- Cabang Selatan
(3, 'Area A - Motor', 120, 0),
(3, 'Area B - Mobil', 60, 0);

-- Insert parking rates
INSERT INTO parking_rates (branch_id, vehicle_type_id, first_hour_rate, next_hour_rate, effective_date) VALUES
-- Cabang Pusat
(1, 1, 2000.00, 1000.00, '2024-01-01'), -- Motor
(1, 2, 5000.00, 3000.00, '2024-01-01'), -- Mobil
(1, 3, 10000.00, 5000.00, '2024-01-01'), -- Bus/Truk
-- Cabang Utara
(2, 1, 2000.00, 1000.00, '2024-01-01'),
(2, 2, 5000.00, 3000.00, '2024-01-01'),
(2, 3, 10000.00, 5000.00, '2024-01-01'),
-- Cabang Selatan
(3, 1, 2500.00, 1500.00, '2024-01-01'), -- Slightly higher rates
(3, 2, 6000.00, 3500.00, '2024-01-01'),
(3, 3, 12000.00, 6000.00, '2024-01-01');

-- Insert users (password for all: 'password123')
-- Note: In production, hash these with bcrypt in your application
-- Example hash: $2b$10$rBV2kHBBLw9GNsJqCfKxeeXP9MxMp0ZYEtL5zYcO3cNDpZ.KHqXqe
INSERT INTO users (username, password, full_name, role, branch_id, is_active) VALUES
-- Admins
('admin', '$2b$10$rBV2kHBBLw9GNsJqCfKxeeXP9MxMp0ZYEtL5zYcO3cNDpZ.KHqXqe', 'Administrator Utama', 'admin', 1, TRUE),
('admin2', '$2b$10$rBV2kHBBLw9GNsJqCfKxeeXP9MxMp0ZYEtL5zYcO3cNDpZ.KHqXqe', 'Administrator Cabang Utara', 'admin', 2, TRUE),
-- Petugas
('petugas1', '$2b$10$rBV2kHBBLw9GNsJqCfKxeeXP9MxMp0ZYEtL5zYcO3cNDpZ.KHqXqe', 'Petugas Shift Pagi', 'petugas', 1, TRUE),
('petugas2', '$2b$10$rBV2kHBBLw9GNsJqCfKxeeXP9MxMp0ZYEtL5zYcO3cNDpZ.KHqXqe', 'Petugas Shift Siang', 'petugas', 1, TRUE),
('petugas3', '$2b$10$rBV2kHBBLw9GNsJqCfKxeeXP9MxMp0ZYEtL5zYcO3cNDpZ.KHqXqe', 'Petugas Cabang Utara', 'petugas', 2, TRUE),
-- Owners
('owner', '$2b$10$rBV2kHBBLw9GNsJqCfKxeeXP9MxMp0ZYEtL5zYcO3cNDpZ.KHqXqe', 'Owner Bisnis', 'owner', NULL, TRUE);

-- Insert sample vehicles
INSERT INTO vehicles (license_plate, vehicle_type_id, color, brand) VALUES
('B 1234 ABC', 1, 'Hitam', 'Honda'),
('B 5678 XYZ', 2, 'Putih', 'Toyota'),
('B 9012 DEF', 2, 'Silver', 'Honda'),
('B 3456 GHI', 1, 'Merah', 'Yamaha'),
('B 7890 JKL', 3, 'Biru', 'Hino');

-- Insert sample transactions (completed)
INSERT INTO transactions (
  ticket_number, vehicle_id, area_id, entry_time, exit_time, 
  duration_hours, total_amount, payment_method, payment_status, officer_id
) VALUES
('TKT-20250210-0001', 1, 1, '2025-02-10 08:00:00', '2025-02-10 10:00:00', 2, 3000.00, 'cash', 'paid', 3),
('TKT-20250210-0002', 2, 2, '2025-02-10 09:00:00', '2025-02-10 13:00:00', 4, 14000.00, 'qris', 'paid', 3),
('TKT-20250210-0003', 3, 2, '2025-02-10 10:00:00', '2025-02-10 12:30:00', 3, 11000.00, 'cash', 'paid', 4),
('TKT-20250210-0004', 4, 1, '2025-02-10 11:00:00', '2025-02-10 11:45:00', 1, 2000.00, 'cash', 'paid', 4),
('TKT-20250210-0005', 5, 3, '2025-02-10 12:00:00', '2025-02-10 17:00:00', 5, 30000.00, 'qris', 'paid', 3);

-- Insert sample transactions (active/pending)
INSERT INTO transactions (
  ticket_number, vehicle_id, area_id, entry_time, 
  payment_status, officer_id
) VALUES
('TKT-20250211-0001', 1, 1, NOW(), 'pending', 3),
('TKT-20250211-0002', 3, 2, NOW(), 'pending', 3);

-- Update occupancy for active transactions
UPDATE parking_areas SET current_occupancy = 1 WHERE area_id = 1;
UPDATE parking_areas SET current_occupancy = 1 WHERE area_id = 2;

-- Insert sample activity logs
INSERT INTO activity_logs (user_id, action, description, ip_address) VALUES
(1, 'LOGIN', 'Admin login successful', '127.0.0.1'),
(3, 'LOGIN', 'Petugas login successful', '127.0.0.1'),
(3, 'VEHICLE_ENTRY', 'Kendaraan B 1234 ABC masuk parkir', '127.0.0.1'),
(3, 'VEHICLE_EXIT', 'Kendaraan B 1234 ABC keluar dan bayar', '127.0.0.1'),
(1, 'CREATE_USER', 'Membuat user baru: petugas3', '127.0.0.1');

-- =====================================================
-- USEFUL VIEWS
-- =====================================================

-- View: Current parking status
CREATE VIEW vw_current_parking_status AS
SELECT 
  b.branch_name,
  pa.area_name,
  pa.capacity,
  pa.current_occupancy,
  (pa.capacity - pa.current_occupancy) AS available_slots,
  ROUND((pa.current_occupancy / pa.capacity * 100), 2) AS occupancy_percentage
FROM parking_areas pa
JOIN branches b ON pa.branch_id = b.branch_id
ORDER BY b.branch_name, pa.area_name;

-- View: Active transactions (not yet paid)
CREATE VIEW vw_active_transactions AS
SELECT 
  t.transaction_id,
  t.ticket_number,
  v.license_plate,
  vt.type_name AS vehicle_type,
  t.entry_time,
  TIMESTAMPDIFF(HOUR, t.entry_time, NOW()) AS hours_parked,
  pa.area_name,
  b.branch_name,
  u.full_name AS officer_name
FROM transactions t
JOIN vehicles v ON t.vehicle_id = v.vehicle_id
JOIN vehicle_types vt ON v.vehicle_type_id = vt.vehicle_type_id
JOIN parking_areas pa ON t.area_id = pa.area_id
JOIN branches b ON pa.branch_id = b.branch_id
LEFT JOIN users u ON t.officer_id = u.user_id
WHERE t.payment_status = 'pending'
ORDER BY t.entry_time;

-- View: Daily revenue report
CREATE VIEW vw_daily_revenue AS
SELECT 
  DATE(exit_time) AS transaction_date,
  b.branch_name,
  COUNT(*) AS total_transactions,
  SUM(total_amount) AS total_revenue,
  AVG(duration_hours) AS avg_duration,
  SUM(CASE WHEN payment_method = 'cash' THEN 1 ELSE 0 END) AS cash_count,
  SUM(CASE WHEN payment_method = 'qris' THEN 1 ELSE 0 END) AS qris_count
FROM transactions t
JOIN parking_areas pa ON t.area_id = pa.area_id
JOIN branches b ON pa.branch_id = b.branch_id
WHERE payment_status = 'paid'
GROUP BY DATE(exit_time), b.branch_id
ORDER BY transaction_date DESC, b.branch_name;

-- =====================================================
-- UTILITY QUERIES FOR COMMON OPERATIONS
-- =====================================================

-- Query: Check parking availability
-- SELECT * FROM vw_current_parking_status WHERE available_slots > 0;

-- Query: Get today's revenue
-- SELECT SUM(total_amount) as today_revenue 
-- FROM transactions 
-- WHERE DATE(exit_time) = CURDATE() AND payment_status = 'paid';

-- Query: Get peak hours (last 7 days)
-- SELECT HOUR(entry_time) as hour, COUNT(*) as entry_count
-- FROM transactions
-- WHERE entry_time >= DATE_SUB(NOW(), INTERVAL 7 DAY)
-- GROUP BY HOUR(entry_time)
-- ORDER BY entry_count DESC;

-- Query: Get payment method distribution
-- SELECT payment_method, COUNT(*) as count, SUM(total_amount) as total
-- FROM transactions
-- WHERE payment_status = 'paid'
-- GROUP BY payment_method;

-- Query: Get user activity summary
-- SELECT u.full_name, u.role, COUNT(al.log_id) as activity_count
-- FROM users u
-- LEFT JOIN activity_logs al ON u.user_id = al.user_id
-- GROUP BY u.user_id
-- ORDER BY activity_count DESC;

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Additional composite indexes for common queries
CREATE INDEX idx_transaction_date_status ON transactions(payment_status, exit_time);
CREATE INDEX idx_transaction_entry_date ON transactions(entry_time, payment_status);
CREATE INDEX idx_vehicle_type_date ON transactions(exit_time);

-- =====================================================
-- TRIGGERS FOR AUTO-LOGGING
-- =====================================================

DELIMITER $$

-- Trigger: Log user creation
CREATE TRIGGER tr_user_created
AFTER INSERT ON users
FOR EACH ROW
BEGIN
  INSERT INTO activity_logs (user_id, action, table_name, record_id, description)
  VALUES (NEW.user_id, 'USER_CREATED', 'users', NEW.user_id, 
          CONCAT('New user created: ', NEW.username, ' with role: ', NEW.role));
END$$

-- Trigger: Log rate changes
CREATE TRIGGER tr_rate_updated
AFTER UPDATE ON parking_rates
FOR EACH ROW
BEGIN
  INSERT INTO activity_logs (user_id, action, table_name, record_id, description)
  VALUES (NULL, 'RATE_UPDATED', 'parking_rates', NEW.rate_id,
          CONCAT('Rate updated for vehicle type ', NEW.vehicle_type_id));
END$$

DELIMITER ;

-- =====================================================
-- BACKUP AND MAINTENANCE
-- =====================================================

-- To backup this database:
-- mysqldump -u root -p parkir_app > parkir_app_backup.sql

-- To restore:
-- mysql -u root -p parkir_app < parkir_app_backup.sql

-- =====================================================
-- END OF SQL SCHEMA
-- =====================================================

-- Display summary
SELECT 'Database parkir_app created successfully!' AS status;
SELECT 'Tables created:' AS info, COUNT(*) AS count FROM information_schema.tables WHERE table_schema = 'parkir_app';
SELECT 'Sample data inserted' AS status;
SELECT 'Views created: vw_current_parking_status, vw_active_transactions, vw_daily_revenue' AS info;
SELECT 'Stored procedures created: update_parking_occupancy, calculate_parking_fee' AS info;
SELECT 'Ready for application development!' AS status;
