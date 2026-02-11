-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Feb 11, 2026 at 05:18 PM
-- Server version: 9.4.0
-- PHP Version: 8.3.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `parkir_app`
--

DELIMITER $$
--
-- Procedures
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `calculate_parking_fee` (IN `p_vehicle_type_id` INT, IN `p_branch_id` INT, IN `p_duration` DECIMAL(5,2), OUT `p_total_amount` DECIMAL(10,2))   BEGIN
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

CREATE DEFINER=`root`@`localhost` PROCEDURE `update_parking_occupancy` (IN `p_area_id` INT, IN `p_action` ENUM('increment','decrement'))   BEGIN
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

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `activity_logs`
--

CREATE TABLE `activity_logs` (
  `log_id` int NOT NULL,
  `user_id` int DEFAULT NULL,
  `action` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Jenis aksi (LOGIN, CREATE_USER, UPDATE_RATE, dll)',
  `table_name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Nama tabel yang dimodifikasi',
  `record_id` int DEFAULT NULL COMMENT 'ID record yang dimodifikasi',
  `description` text COLLATE utf8mb4_unicode_ci COMMENT 'Deskripsi detail aktivitas',
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'IP address user',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Log semua aktivitas penting untuk audit trail';

--
-- Dumping data for table `activity_logs`
--

INSERT INTO `activity_logs` (`log_id`, `user_id`, `action`, `table_name`, `record_id`, `description`, `ip_address`, `created_at`) VALUES
(1, 1, 'LOGIN', NULL, NULL, 'Admin login successful', '127.0.0.1', '2026-02-11 15:02:52'),
(2, 3, 'LOGIN', NULL, NULL, 'Petugas login successful', '127.0.0.1', '2026-02-11 15:02:52'),
(3, 3, 'VEHICLE_ENTRY', NULL, NULL, 'Kendaraan B 1234 ABC masuk parkir', '127.0.0.1', '2026-02-11 15:02:52'),
(4, 3, 'VEHICLE_EXIT', NULL, NULL, 'Kendaraan B 1234 ABC keluar dan bayar', '127.0.0.1', '2026-02-11 15:02:52'),
(5, 1, 'CREATE_USER', NULL, NULL, 'Membuat user baru: petugas3', '127.0.0.1', '2026-02-11 15:02:52'),
(6, 1, 'login', NULL, NULL, 'User admin logged in', NULL, '2026-02-11 15:08:22'),
(7, 1, 'login', NULL, NULL, 'User admin logged in', NULL, '2026-02-11 15:11:29'),
(8, 1, 'login', NULL, NULL, 'User admin logged in', NULL, '2026-02-11 15:12:48'),
(9, 1, 'login', NULL, NULL, 'User admin logged in', NULL, '2026-02-11 15:13:02'),
(10, 1, 'login', NULL, NULL, 'User admin logged in', NULL, '2026-02-11 15:13:04'),
(11, 1, 'login', NULL, NULL, 'User admin logged in', NULL, '2026-02-11 15:13:05'),
(12, 1, 'login', NULL, NULL, 'User admin logged in', NULL, '2026-02-11 15:13:06'),
(13, 1, 'login', NULL, NULL, 'User admin logged in', NULL, '2026-02-11 15:13:09'),
(14, 1, 'login', NULL, NULL, 'User admin logged in', NULL, '2026-02-11 15:13:11'),
(15, 1, 'login', NULL, NULL, 'User admin logged in', NULL, '2026-02-11 15:13:12'),
(16, 1, 'login', NULL, NULL, 'User admin logged in', NULL, '2026-02-11 15:13:12'),
(17, 1, 'login', NULL, NULL, 'User admin logged in', NULL, '2026-02-11 15:13:12'),
(18, 1, 'login', NULL, NULL, 'User admin logged in', NULL, '2026-02-11 15:13:13'),
(19, 1, 'login', NULL, NULL, 'User admin logged in', NULL, '2026-02-11 15:13:14'),
(20, 1, 'login', NULL, NULL, 'User admin logged in', NULL, '2026-02-11 15:13:14'),
(21, 1, 'login', NULL, NULL, 'User admin logged in', NULL, '2026-02-11 15:13:40'),
(22, 1, 'login', NULL, NULL, 'User admin logged in', NULL, '2026-02-11 15:15:06'),
(23, 1, 'login', NULL, NULL, 'User admin logged in', NULL, '2026-02-11 15:15:57'),
(24, 1, 'login', NULL, NULL, 'User admin logged in', NULL, '2026-02-11 15:16:08'),
(25, 1, 'login', NULL, NULL, 'User admin logged in', NULL, '2026-02-11 15:16:58'),
(26, 1, 'login', NULL, NULL, 'User admin logged in', NULL, '2026-02-11 15:17:00'),
(27, 1, 'login', NULL, NULL, 'User admin logged in', NULL, '2026-02-11 15:17:03'),
(28, 1, 'login', NULL, NULL, 'User admin logged in', NULL, '2026-02-11 15:17:26'),
(29, 1, 'login', NULL, NULL, 'User admin logged in', NULL, '2026-02-11 15:17:33'),
(30, 1, 'login', NULL, NULL, 'User admin logged in', NULL, '2026-02-11 15:17:35'),
(31, 1, 'login', NULL, NULL, 'User admin logged in', NULL, '2026-02-11 15:17:37'),
(32, 1, 'login', NULL, NULL, 'User admin logged in', NULL, '2026-02-11 15:17:54'),
(33, 1, 'login', NULL, NULL, 'User admin logged in', NULL, '2026-02-11 15:17:58'),
(34, 1, 'login', NULL, NULL, 'User admin logged in', NULL, '2026-02-11 15:18:00'),
(35, 1, 'login', NULL, NULL, 'User admin logged in', NULL, '2026-02-11 15:19:24'),
(36, 1, 'logout', NULL, NULL, 'User admin logged out', NULL, '2026-02-11 15:22:04'),
(37, 1, 'login', NULL, NULL, 'User admin logged in', NULL, '2026-02-11 15:22:07'),
(38, 1, 'delete_user', NULL, NULL, 'Deleted user: admin2', NULL, '2026-02-11 15:38:29'),
(39, 1, 'update_user', NULL, NULL, 'Updated user: petugas 123', NULL, '2026-02-11 15:41:29'),
(40, 7, 'USER_CREATED', 'users', 7, 'New user created: TEGAR with role: owner', NULL, '2026-02-11 15:41:51'),
(41, 1, 'create_user', NULL, NULL, 'Created user: TEGAR', NULL, '2026-02-11 15:41:51'),
(42, 1, 'login', NULL, NULL, 'User admin logged in', NULL, '2026-02-11 16:11:32'),
(43, 1, 'login', NULL, NULL, 'User admin logged in', NULL, '2026-02-11 16:18:45'),
(44, 1, 'update_branch', NULL, NULL, 'Updated branch: Cabang Selatan', NULL, '2026-02-11 16:24:50'),
(45, 1, 'delete_branch', NULL, NULL, 'Deleted branch: Cabang Selatan', NULL, '2026-02-11 16:24:57'),
(46, 1, 'login', NULL, NULL, 'User admin logged in', NULL, '2026-02-11 16:30:48'),
(47, 1, 'login', NULL, NULL, 'User admin logged in', NULL, '2026-02-11 16:36:36'),
(48, 1, 'update_branch', NULL, NULL, 'Updated branch: Cabang Utara ya', NULL, '2026-02-11 16:41:04'),
(49, 1, 'create_rate', NULL, NULL, 'Created parking rate for branch 2', NULL, '2026-02-11 16:48:27'),
(50, 1, 'delete_rate', NULL, NULL, 'Deleted parking rate ID: 10', NULL, '2026-02-11 16:48:33'),
(51, 1, 'login', NULL, NULL, 'User admin logged in', NULL, '2026-02-11 17:00:08'),
(52, 1, 'login', NULL, NULL, 'User admin logged in', NULL, '2026-02-11 17:00:14'),
(53, 3, 'login', NULL, NULL, 'User petugas1 logged in', NULL, '2026-02-11 17:00:31'),
(54, 3, 'logout', NULL, NULL, 'User petugas1 logged out', NULL, '2026-02-11 17:08:12'),
(55, 3, 'login', NULL, NULL, 'User petugas1 logged in', NULL, '2026-02-11 17:08:14'),
(56, 3, 'vehicle_entry', NULL, NULL, 'Vehicle B 9245 GR entered - Ticket: TKT-20260212-2476', NULL, '2026-02-11 17:08:24');

-- --------------------------------------------------------

--
-- Table structure for table `branches`
--

CREATE TABLE `branches` (
  `branch_id` int NOT NULL,
  `branch_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` text COLLATE utf8mb4_unicode_ci,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Master data cabang parkir';

--
-- Dumping data for table `branches`
--

INSERT INTO `branches` (`branch_id`, `branch_name`, `address`, `phone`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Cabang Pusat', 'Jl. Sudirman No. 123, Jakarta Pusat', '021-1234567', 1, '2026-02-11 15:02:52', '2026-02-11 15:02:52'),
(2, 'Cabang Utara ya', 'Jl. Ahmad Yani No. 456, Jakarta Utara', '021-7654321', 1, '2026-02-11 15:02:52', '2026-02-11 16:41:04');

-- --------------------------------------------------------

--
-- Table structure for table `parking_areas`
--

CREATE TABLE `parking_areas` (
  `area_id` int NOT NULL,
  `branch_id` int NOT NULL,
  `area_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `capacity` int NOT NULL COMMENT 'Kapasitas maksimal kendaraan',
  `current_occupancy` int DEFAULT '0' COMMENT 'Jumlah kendaraan saat ini',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ;

--
-- Dumping data for table `parking_areas`
--

INSERT INTO `parking_areas` (`area_id`, `branch_id`, `area_name`, `capacity`, `current_occupancy`, `created_at`, `updated_at`) VALUES
(1, 1, 'Area A - Motor', 100, 1, '2026-02-11 15:02:52', '2026-02-11 15:02:52'),
(2, 1, 'Area B - Mobil', 50, 1, '2026-02-11 15:02:52', '2026-02-11 15:02:52'),
(3, 1, 'Area C - Bus/Truk', 20, 0, '2026-02-11 15:02:52', '2026-02-11 15:02:52'),
(4, 2, 'Area A - Motor', 80, 0, '2026-02-11 15:02:52', '2026-02-11 15:02:52'),
(5, 2, 'Area B - Mobil', 40, 0, '2026-02-11 15:02:52', '2026-02-11 15:02:52');

-- --------------------------------------------------------

--
-- Table structure for table `parking_rates`
--

CREATE TABLE `parking_rates` (
  `rate_id` int NOT NULL,
  `branch_id` int NOT NULL,
  `vehicle_type_id` int NOT NULL,
  `first_hour_rate` decimal(10,2) NOT NULL COMMENT 'Tarif jam pertama',
  `next_hour_rate` decimal(10,2) NOT NULL COMMENT 'Tarif per jam berikutnya',
  `effective_date` date NOT NULL COMMENT 'Tanggal mulai berlaku',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Tarif parkir berbeda per cabang dan jenis kendaraan';

--
-- Dumping data for table `parking_rates`
--

INSERT INTO `parking_rates` (`rate_id`, `branch_id`, `vehicle_type_id`, `first_hour_rate`, `next_hour_rate`, `effective_date`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 2000.00, 1000.00, '2024-01-01', '2026-02-11 15:02:52', '2026-02-11 15:02:52'),
(2, 1, 2, 5000.00, 3000.00, '2024-01-01', '2026-02-11 15:02:52', '2026-02-11 15:02:52'),
(3, 1, 3, 10000.00, 5000.00, '2024-01-01', '2026-02-11 15:02:52', '2026-02-11 15:02:52'),
(4, 2, 1, 2000.00, 1000.00, '2024-01-01', '2026-02-11 15:02:52', '2026-02-11 15:02:52'),
(5, 2, 2, 5000.00, 3000.00, '2024-01-01', '2026-02-11 15:02:52', '2026-02-11 15:02:52'),
(6, 2, 3, 10000.00, 5000.00, '2024-01-01', '2026-02-11 15:02:52', '2026-02-11 15:02:52');

--
-- Triggers `parking_rates`
--
DELIMITER $$
CREATE TRIGGER `tr_rate_updated` AFTER UPDATE ON `parking_rates` FOR EACH ROW BEGIN
  INSERT INTO activity_logs (user_id, action, table_name, record_id, description)
  VALUES (NULL, 'RATE_UPDATED', 'parking_rates', NEW.rate_id,
          CONCAT('Rate updated for vehicle type ', NEW.vehicle_type_id));
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `transaction_id` int NOT NULL,
  `ticket_number` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Nomor tiket unik',
  `vehicle_id` int NOT NULL,
  `area_id` int NOT NULL,
  `entry_time` timestamp NOT NULL COMMENT 'Waktu masuk parkir',
  `exit_time` timestamp NULL DEFAULT NULL COMMENT 'Waktu keluar parkir',
  `duration_hours` decimal(5,2) DEFAULT NULL COMMENT 'Durasi parkir dalam jam',
  `total_amount` decimal(10,2) DEFAULT NULL COMMENT 'Total biaya parkir',
  `payment_method` enum('cash','qris') COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Metode pembayaran',
  `payment_status` enum('pending','paid','cancelled') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `officer_id` int DEFAULT NULL COMMENT 'Petugas yang melayani',
  `midtrans_order_id` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Order ID dari Midtrans (untuk QRIS)',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Transaksi parkir masuk dan keluar';

--
-- Dumping data for table `transactions`
--

INSERT INTO `transactions` (`transaction_id`, `ticket_number`, `vehicle_id`, `area_id`, `entry_time`, `exit_time`, `duration_hours`, `total_amount`, `payment_method`, `payment_status`, `officer_id`, `midtrans_order_id`, `created_at`, `updated_at`) VALUES
(1, 'TKT-20250210-0001', 1, 1, '2025-02-10 01:00:00', '2025-02-10 03:00:00', 2.00, 3000.00, 'cash', 'paid', 3, NULL, '2026-02-11 15:02:52', '2026-02-11 15:02:52'),
(2, 'TKT-20250210-0002', 2, 2, '2025-02-10 02:00:00', '2025-02-10 06:00:00', 4.00, 14000.00, 'qris', 'paid', 3, NULL, '2026-02-11 15:02:52', '2026-02-11 15:02:52'),
(3, 'TKT-20250210-0003', 3, 2, '2025-02-10 03:00:00', '2025-02-10 05:30:00', 3.00, 11000.00, 'cash', 'paid', 4, NULL, '2026-02-11 15:02:52', '2026-02-11 15:02:52'),
(4, 'TKT-20250210-0004', 4, 1, '2025-02-10 04:00:00', '2025-02-10 04:45:00', 1.00, 2000.00, 'cash', 'paid', 4, NULL, '2026-02-11 15:02:52', '2026-02-11 15:02:52'),
(5, 'TKT-20250210-0005', 5, 3, '2025-02-10 05:00:00', '2025-02-10 10:00:00', 5.00, 30000.00, 'qris', 'paid', 3, NULL, '2026-02-11 15:02:52', '2026-02-11 15:02:52'),
(6, 'TKT-20250211-0001', 1, 1, '2026-02-11 15:02:52', NULL, NULL, NULL, NULL, 'pending', 3, NULL, '2026-02-11 15:02:52', '2026-02-11 15:02:52'),
(7, 'TKT-20250211-0002', 3, 2, '2026-02-11 15:02:52', NULL, NULL, NULL, NULL, 'pending', 3, NULL, '2026-02-11 15:02:52', '2026-02-11 15:02:52'),
(8, 'TKT-20260212-2476', 6, 1, '2026-02-11 17:08:24', NULL, NULL, NULL, NULL, 'pending', 3, NULL, '2026-02-11 17:08:24', '2026-02-11 17:08:24');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int NOT NULL,
  `username` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Hashed with bcrypt',
  `full_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('admin','petugas','owner') COLLATE utf8mb4_unicode_ci NOT NULL,
  `branch_id` int DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='User dengan multi-role (admin, petugas, owner)';

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `username`, `password`, `full_name`, `role`, `branch_id`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'admin', '$2a$10$7xX5N2L9JLOUQDzz9G.hRecINaUOqJ/Rinvknr70vYFQVTFx6NjFm', 'Administrator Utama', 'admin', 1, 1, '2026-02-11 15:02:52', '2026-02-11 15:08:12'),
(3, 'petugas1', '$2a$10$7xX5N2L9JLOUQDzz9G.hRecINaUOqJ/Rinvknr70vYFQVTFx6NjFm', 'Petugas Shift Pagi', 'petugas', 1, 1, '2026-02-11 15:02:52', '2026-02-11 15:08:12'),
(4, 'petugas2', '$2a$10$7xX5N2L9JLOUQDzz9G.hRecINaUOqJ/Rinvknr70vYFQVTFx6NjFm', 'Petugas Shift Siang', 'petugas', 1, 1, '2026-02-11 15:02:52', '2026-02-11 15:08:12'),
(5, 'petugas 123', '$2a$10$7xX5N2L9JLOUQDzz9G.hRecINaUOqJ/Rinvknr70vYFQVTFx6NjFm', 'Petugas Cabang Utara', 'petugas', 2, 1, '2026-02-11 15:02:52', '2026-02-11 15:41:29'),
(6, 'owner', '$2a$10$7xX5N2L9JLOUQDzz9G.hRecINaUOqJ/Rinvknr70vYFQVTFx6NjFm', 'Owner Bisnis', 'owner', NULL, 1, '2026-02-11 15:02:52', '2026-02-11 15:08:12'),
(7, 'TEGAR', '$2a$10$nzar/JhsErTbNRHDnSSIp.Eu/eEV9hHni8wk/jMXgCtrn.VjvK4Ea', 'TEAGR AJALAH', 'owner', NULL, 1, '2026-02-11 15:41:51', '2026-02-11 15:41:51');

--
-- Triggers `users`
--
DELIMITER $$
CREATE TRIGGER `tr_user_created` AFTER INSERT ON `users` FOR EACH ROW BEGIN
  INSERT INTO activity_logs (user_id, action, table_name, record_id, description)
  VALUES (NEW.user_id, 'USER_CREATED', 'users', NEW.user_id, 
          CONCAT('New user created: ', NEW.username, ' with role: ', NEW.role));
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `vehicles`
--

CREATE TABLE `vehicles` (
  `vehicle_id` int NOT NULL,
  `license_plate` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Nomor polisi (plat nomor)',
  `vehicle_type_id` int NOT NULL,
  `color` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Warna kendaraan - bisa diisi kemudian',
  `brand` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Merk kendaraan - bisa diisi kemudian',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Data kendaraan yang pernah parkir - sesuai requirement soal';

--
-- Dumping data for table `vehicles`
--

INSERT INTO `vehicles` (`vehicle_id`, `license_plate`, `vehicle_type_id`, `color`, `brand`, `created_at`, `updated_at`) VALUES
(1, 'B 1234 ABC', 1, 'Hitam', 'Honda', '2026-02-11 15:02:52', '2026-02-11 15:02:52'),
(2, 'B 5678 XYZ', 2, 'Putih', 'Toyota', '2026-02-11 15:02:52', '2026-02-11 15:02:52'),
(3, 'B 9012 DEF', 2, 'Silver', 'Honda', '2026-02-11 15:02:52', '2026-02-11 15:02:52'),
(4, 'B 3456 GHI', 1, 'Merah', 'Yamaha', '2026-02-11 15:02:52', '2026-02-11 15:02:52'),
(5, 'B 7890 JKL', 3, 'Biru', 'Hino', '2026-02-11 15:02:52', '2026-02-11 15:02:52'),
(6, 'B 9245 GR', 1, NULL, NULL, '2026-02-11 17:08:24', '2026-02-11 17:08:24');

-- --------------------------------------------------------

--
-- Table structure for table `vehicle_types`
--

CREATE TABLE `vehicle_types` (
  `vehicle_type_id` int NOT NULL,
  `type_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Master jenis kendaraan (Motor, Mobil, Bus/Truk)';

--
-- Dumping data for table `vehicle_types`
--

INSERT INTO `vehicle_types` (`vehicle_type_id`, `type_name`, `description`, `created_at`) VALUES
(1, 'Motor', 'Sepeda motor dan skuter', '2026-02-11 15:02:52'),
(2, 'Mobil', 'Mobil penumpang (sedan, SUV, MPV)', '2026-02-11 15:02:52'),
(3, 'Bus/Truk', 'Bus, truk, dan kendaraan besar lainnya', '2026-02-11 15:02:52');

-- --------------------------------------------------------

--
-- Stand-in structure for view `vw_active_transactions`
-- (See below for the actual view)
--
CREATE TABLE `vw_active_transactions` (
`area_name` varchar(50)
,`branch_name` varchar(100)
,`entry_time` timestamp
,`hours_parked` bigint
,`license_plate` varchar(20)
,`officer_name` varchar(100)
,`ticket_number` varchar(20)
,`transaction_id` int
,`vehicle_type` varchar(50)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `vw_current_parking_status`
-- (See below for the actual view)
--
CREATE TABLE `vw_current_parking_status` (
`area_name` varchar(50)
,`available_slots` bigint
,`branch_name` varchar(100)
,`capacity` int
,`current_occupancy` int
,`occupancy_percentage` decimal(16,2)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `vw_daily_revenue`
-- (See below for the actual view)
--
CREATE TABLE `vw_daily_revenue` (
`avg_duration` decimal(9,6)
,`branch_name` varchar(100)
,`cash_count` decimal(23,0)
,`qris_count` decimal(23,0)
,`total_revenue` decimal(32,2)
,`total_transactions` bigint
,`transaction_date` date
);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD PRIMARY KEY (`log_id`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_created_at` (`created_at`),
  ADD KEY `idx_action` (`action`);

--
-- Indexes for table `branches`
--
ALTER TABLE `branches`
  ADD PRIMARY KEY (`branch_id`),
  ADD KEY `idx_is_active` (`is_active`);

--
-- Indexes for table `parking_areas`
--
ALTER TABLE `parking_areas`
  ADD PRIMARY KEY (`area_id`),
  ADD KEY `idx_branch` (`branch_id`);

--
-- Indexes for table `parking_rates`
--
ALTER TABLE `parking_rates`
  ADD PRIMARY KEY (`rate_id`),
  ADD UNIQUE KEY `unique_rate` (`branch_id`,`vehicle_type_id`,`effective_date`),
  ADD KEY `vehicle_type_id` (`vehicle_type_id`),
  ADD KEY `idx_branch_vehicle` (`branch_id`,`vehicle_type_id`),
  ADD KEY `idx_effective_date` (`effective_date`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`transaction_id`),
  ADD UNIQUE KEY `ticket_number` (`ticket_number`),
  ADD KEY `area_id` (`area_id`),
  ADD KEY `idx_ticket` (`ticket_number`),
  ADD KEY `idx_payment_status` (`payment_status`),
  ADD KEY `idx_entry_time` (`entry_time`),
  ADD KEY `idx_exit_time` (`exit_time`),
  ADD KEY `idx_vehicle` (`vehicle_id`),
  ADD KEY `idx_officer` (`officer_id`),
  ADD KEY `idx_composite_search` (`payment_status`,`entry_time`,`exit_time`),
  ADD KEY `idx_transaction_date_status` (`payment_status`,`exit_time`),
  ADD KEY `idx_transaction_entry_date` (`entry_time`,`payment_status`),
  ADD KEY `idx_vehicle_type_date` (`exit_time`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD KEY `idx_username` (`username`),
  ADD KEY `idx_role` (`role`),
  ADD KEY `idx_branch` (`branch_id`),
  ADD KEY `idx_is_active` (`is_active`);

--
-- Indexes for table `vehicles`
--
ALTER TABLE `vehicles`
  ADD PRIMARY KEY (`vehicle_id`),
  ADD UNIQUE KEY `license_plate` (`license_plate`),
  ADD KEY `idx_license_plate` (`license_plate`),
  ADD KEY `idx_vehicle_type` (`vehicle_type_id`);

--
-- Indexes for table `vehicle_types`
--
ALTER TABLE `vehicle_types`
  ADD PRIMARY KEY (`vehicle_type_id`),
  ADD UNIQUE KEY `type_name` (`type_name`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `activity_logs`
--
ALTER TABLE `activity_logs`
  MODIFY `log_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=57;

--
-- AUTO_INCREMENT for table `branches`
--
ALTER TABLE `branches`
  MODIFY `branch_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `parking_areas`
--
ALTER TABLE `parking_areas`
  MODIFY `area_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `parking_rates`
--
ALTER TABLE `parking_rates`
  MODIFY `rate_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `transaction_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `vehicles`
--
ALTER TABLE `vehicles`
  MODIFY `vehicle_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `vehicle_types`
--
ALTER TABLE `vehicle_types`
  MODIFY `vehicle_type_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

-- --------------------------------------------------------

--
-- Structure for view `vw_active_transactions`
--
DROP TABLE IF EXISTS `vw_active_transactions`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vw_active_transactions`  AS SELECT `t`.`transaction_id` AS `transaction_id`, `t`.`ticket_number` AS `ticket_number`, `v`.`license_plate` AS `license_plate`, `vt`.`type_name` AS `vehicle_type`, `t`.`entry_time` AS `entry_time`, timestampdiff(HOUR,`t`.`entry_time`,now()) AS `hours_parked`, `pa`.`area_name` AS `area_name`, `b`.`branch_name` AS `branch_name`, `u`.`full_name` AS `officer_name` FROM (((((`transactions` `t` join `vehicles` `v` on((`t`.`vehicle_id` = `v`.`vehicle_id`))) join `vehicle_types` `vt` on((`v`.`vehicle_type_id` = `vt`.`vehicle_type_id`))) join `parking_areas` `pa` on((`t`.`area_id` = `pa`.`area_id`))) join `branches` `b` on((`pa`.`branch_id` = `b`.`branch_id`))) left join `users` `u` on((`t`.`officer_id` = `u`.`user_id`))) WHERE (`t`.`payment_status` = 'pending') ORDER BY `t`.`entry_time` ASC ;

-- --------------------------------------------------------

--
-- Structure for view `vw_current_parking_status`
--
DROP TABLE IF EXISTS `vw_current_parking_status`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vw_current_parking_status`  AS SELECT `b`.`branch_name` AS `branch_name`, `pa`.`area_name` AS `area_name`, `pa`.`capacity` AS `capacity`, `pa`.`current_occupancy` AS `current_occupancy`, (`pa`.`capacity` - `pa`.`current_occupancy`) AS `available_slots`, round(((`pa`.`current_occupancy` / `pa`.`capacity`) * 100),2) AS `occupancy_percentage` FROM (`parking_areas` `pa` join `branches` `b` on((`pa`.`branch_id` = `b`.`branch_id`))) ORDER BY `b`.`branch_name` ASC, `pa`.`area_name` ASC ;

-- --------------------------------------------------------

--
-- Structure for view `vw_daily_revenue`
--
DROP TABLE IF EXISTS `vw_daily_revenue`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vw_daily_revenue`  AS SELECT cast(`t`.`exit_time` as date) AS `transaction_date`, `b`.`branch_name` AS `branch_name`, count(0) AS `total_transactions`, sum(`t`.`total_amount`) AS `total_revenue`, avg(`t`.`duration_hours`) AS `avg_duration`, sum((case when (`t`.`payment_method` = 'cash') then 1 else 0 end)) AS `cash_count`, sum((case when (`t`.`payment_method` = 'qris') then 1 else 0 end)) AS `qris_count` FROM ((`transactions` `t` join `parking_areas` `pa` on((`t`.`area_id` = `pa`.`area_id`))) join `branches` `b` on((`pa`.`branch_id` = `b`.`branch_id`))) WHERE (`t`.`payment_status` = 'paid') GROUP BY cast(`t`.`exit_time` as date), `b`.`branch_id` ORDER BY `transaction_date` DESC, `b`.`branch_name` ASC ;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD CONSTRAINT `activity_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL;

--
-- Constraints for table `parking_areas`
--
ALTER TABLE `parking_areas`
  ADD CONSTRAINT `parking_areas_ibfk_1` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`branch_id`) ON DELETE CASCADE;

--
-- Constraints for table `parking_rates`
--
ALTER TABLE `parking_rates`
  ADD CONSTRAINT `parking_rates_ibfk_1` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`branch_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `parking_rates_ibfk_2` FOREIGN KEY (`vehicle_type_id`) REFERENCES `vehicle_types` (`vehicle_type_id`) ON DELETE CASCADE;

--
-- Constraints for table `transactions`
--
ALTER TABLE `transactions`
  ADD CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles` (`vehicle_id`),
  ADD CONSTRAINT `transactions_ibfk_2` FOREIGN KEY (`area_id`) REFERENCES `parking_areas` (`area_id`),
  ADD CONSTRAINT `transactions_ibfk_3` FOREIGN KEY (`officer_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`branch_id`) ON DELETE SET NULL;

--
-- Constraints for table `vehicles`
--
ALTER TABLE `vehicles`
  ADD CONSTRAINT `vehicles_ibfk_1` FOREIGN KEY (`vehicle_type_id`) REFERENCES `vehicle_types` (`vehicle_type_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
