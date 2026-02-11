# 🗄️ ERD DETAILED - APLIKASI PARKIR

## Entity Relationship Diagram dengan Detail Lengkap

---

## FULL ERD WITH ALL ATTRIBUTES

```mermaid
erDiagram
    BRANCHES {
        int branch_id PK "Auto Increment"
        varchar(100) branch_name UK "NOT NULL"
        text address "Alamat cabang"
        varchar(20) phone "Nomor telepon"
        boolean is_active "Default TRUE"
        timestamp created_at "Default CURRENT_TIMESTAMP"
        timestamp updated_at "Auto update"
    }
    
    USERS {
        int user_id PK "Auto Increment"
        varchar(50) username UK "NOT NULL, Unique"
        varchar(255) password "Hashed with bcrypt"
        varchar(100) full_name "NOT NULL"
        enum role "admin, petugas, owner"
        int branch_id FK "NULL for owner"
        boolean is_active "Default TRUE"
        timestamp created_at "Default CURRENT_TIMESTAMP"
        timestamp updated_at "Auto update"
    }
    
    PARKING_AREAS {
        int area_id PK "Auto Increment"
        int branch_id FK "NOT NULL"
        varchar(50) area_name "NOT NULL"
        int capacity "NOT NULL, Max kendaraan"
        int current_occupancy "Default 0, Real-time"
        timestamp created_at "Default CURRENT_TIMESTAMP"
        timestamp updated_at "Auto update"
    }
    
    VEHICLE_TYPES {
        int vehicle_type_id PK "Auto Increment"
        varchar(50) type_name UK "Motor, Mobil, Bus/Truk"
        text description "Deskripsi jenis"
        timestamp created_at "Default CURRENT_TIMESTAMP"
    }
    
    PARKING_RATES {
        int rate_id PK "Auto Increment"
        int branch_id FK "NOT NULL"
        int vehicle_type_id FK "NOT NULL"
        decimal(10,2) first_hour_rate "Tarif jam pertama"
        decimal(10,2) next_hour_rate "Tarif per jam berikutnya"
        date effective_date "Tanggal mulai berlaku"
        timestamp created_at "Default CURRENT_TIMESTAMP"
        timestamp updated_at "Auto update"
    }
    
    VEHICLES {
        int vehicle_id PK "Auto Increment"
        varchar(20) license_plate UK "Plat nomor, Unique"
        int vehicle_type_id FK "NOT NULL"
        varchar(30) color "Optional, bisa NULL"
        varchar(50) brand "Optional, bisa NULL"
        timestamp created_at "Default CURRENT_TIMESTAMP"
        timestamp updated_at "Auto update"
    }
    
    TRANSACTIONS {
        int transaction_id PK "Auto Increment"
        varchar(20) ticket_number UK "TKT-YYYYMMDD-XXXX"
        int vehicle_id FK "NOT NULL"
        int area_id FK "NOT NULL"
        timestamp entry_time "Waktu masuk"
        timestamp exit_time "Waktu keluar, NULL saat pending"
        decimal(5,2) duration_hours "Durasi parkir"
        decimal(10,2) total_amount "Total biaya"
        enum payment_method "cash, qris"
        enum payment_status "pending, paid, cancelled"
        int officer_id FK "Petugas yang melayani"
        varchar(100) midtrans_order_id "Order ID Midtrans"
        timestamp created_at "Default CURRENT_TIMESTAMP"
        timestamp updated_at "Auto update"
    }
    
    ACTIVITY_LOGS {
        int log_id PK "Auto Increment"
        int user_id FK "User yang melakukan aksi"
        varchar(100) action "LOGIN, CREATE_USER, dll"
        varchar(50) table_name "Tabel yang dimodifikasi"
        int record_id "ID record yang dimodifikasi"
        text description "Deskripsi detail"
        varchar(45) ip_address "IP address user"
        timestamp created_at "Default CURRENT_TIMESTAMP"
    }
    
    BRANCHES ||--o{ USERS : "branch_id"
    BRANCHES ||--o{ PARKING_AREAS : "branch_id"
    BRANCHES ||--o{ PARKING_RATES : "branch_id"
    VEHICLE_TYPES ||--o{ VEHICLES : "vehicle_type_id"
    VEHICLE_TYPES ||--o{ PARKING_RATES : "vehicle_type_id"
    VEHICLES ||--o{ TRANSACTIONS : "vehicle_id"
    PARKING_AREAS ||--o{ TRANSACTIONS : "area_id"
    USERS ||--o{ TRANSACTIONS : "officer_id"
    USERS ||--o{ ACTIVITY_LOGS : "user_id"
```

---

## ENTITY DETAILS

### 1. BRANCHES (Cabang Parkir)

**Purpose:** Master data cabang parkir untuk support multi-lokasi

**Attributes:**
| Column | Type | Constraint | Description |
|--------|------|------------|-------------|
| branch_id | INT | PK, AUTO_INCREMENT | ID unik cabang |
| branch_name | VARCHAR(100) | NOT NULL, UNIQUE | Nama cabang |
| address | TEXT | NULL | Alamat lengkap |
| phone | VARCHAR(20) | NULL | Nomor telepon |
| is_active | BOOLEAN | DEFAULT TRUE | Status aktif |
| created_at | TIMESTAMP | DEFAULT NOW | Waktu dibuat |
| updated_at | TIMESTAMP | ON UPDATE NOW | Waktu diupdate |

**Business Rules:**
- Branch name harus unique
- Soft delete (set is_active = FALSE)
- Tidak bisa delete jika ada transaksi aktif

**Sample Data:**
```sql
(1, 'Cabang Pusat', 'Jl. Sudirman No. 123', '021-1234567', TRUE)
(2, 'Cabang Utara', 'Jl. Ahmad Yani No. 456', '021-7654321', TRUE)
```

---

### 2. USERS (Pengguna Sistem)

**Purpose:** Autentikasi dan otorisasi dengan multi-role

**Attributes:**
| Column | Type | Constraint | Description |
|--------|------|------------|-------------|
| user_id | INT | PK, AUTO_INCREMENT | ID unik user |
| username | VARCHAR(50) | NOT NULL, UNIQUE | Username login |
| password | VARCHAR(255) | NOT NULL | Password (bcrypt hashed) |
| full_name | VARCHAR(100) | NOT NULL | Nama lengkap |
| role | ENUM | NOT NULL | admin/petugas/owner |
| branch_id | INT | FK, NULL | ID cabang (NULL untuk owner) |
| is_active | BOOLEAN | DEFAULT TRUE | Status aktif |
| created_at | TIMESTAMP | DEFAULT NOW | Waktu dibuat |
| updated_at | TIMESTAMP | ON UPDATE NOW | Waktu diupdate |

**Business Rules:**
- Username harus unique
- Password minimal 8 karakter, di-hash dengan bcrypt
- Role menentukan akses menu
- Petugas harus punya branch_id
- Owner tidak perlu branch_id (akses semua cabang)

**Sample Data:**
```sql
(1, 'admin', '$2b$10$...', 'Administrator Utama', 'admin', 1, TRUE)
(2, 'petugas1', '$2b$10$...', 'Petugas Shift Pagi', 'petugas', 1, TRUE)
(3, 'owner', '$2b$10$...', 'Owner Bisnis', 'owner', NULL, TRUE)
```

---

### 3. PARKING_AREAS (Area Parkir)

**Purpose:** Manajemen area parkir per cabang dengan tracking okupansi

**Attributes:**
| Column | Type | Constraint | Description |
|--------|------|------------|-------------|
| area_id | INT | PK, AUTO_INCREMENT | ID unik area |
| branch_id | INT | FK, NOT NULL | ID cabang |
| area_name | VARCHAR(50) | NOT NULL | Nama area (Area A, B, C) |
| capacity | INT | NOT NULL | Kapasitas maksimal |
| current_occupancy | INT | DEFAULT 0 | Okupansi saat ini |
| created_at | TIMESTAMP | DEFAULT NOW | Waktu dibuat |
| updated_at | TIMESTAMP | ON UPDATE NOW | Waktu diupdate |

**Business Rules:**
- Area name unique per cabang
- current_occupancy >= 0
- current_occupancy <= capacity
- Auto-update saat entry/exit

**Sample Data:**
```sql
(1, 1, 'Area A - Motor', 100, 45)
(2, 1, 'Area B - Mobil', 50, 30)
```

---

### 4. VEHICLE_TYPES (Jenis Kendaraan)

**Purpose:** Master jenis kendaraan untuk kategorisasi dan pricing

**Attributes:**
| Column | Type | Constraint | Description |
|--------|------|------------|-------------|
| vehicle_type_id | INT | PK, AUTO_INCREMENT | ID unik jenis |
| type_name | VARCHAR(50) | NOT NULL, UNIQUE | Nama jenis |
| description | TEXT | NULL | Deskripsi |
| created_at | TIMESTAMP | DEFAULT NOW | Waktu dibuat |

**Business Rules:**
- Type name harus unique
- Static data (jarang berubah)
- Tidak bisa delete jika ada kendaraan/tarif terkait

**Sample Data:**
```sql
(1, 'Motor', 'Sepeda motor dan skuter')
(2, 'Mobil', 'Mobil penumpang (sedan, SUV, MPV)')
(3, 'Bus/Truk', 'Bus, truk, dan kendaraan besar')
```

---

### 5. PARKING_RATES (Tarif Parkir)

**Purpose:** Tarif parkir yang flexible per cabang dan jenis kendaraan

**Attributes:**
| Column | Type | Constraint | Description |
|--------|------|------------|-------------|
| rate_id | INT | PK, AUTO_INCREMENT | ID unik tarif |
| branch_id | INT | FK, NOT NULL | ID cabang |
| vehicle_type_id | INT | FK, NOT NULL | ID jenis kendaraan |
| first_hour_rate | DECIMAL(10,2) | NOT NULL | Tarif jam pertama |
| next_hour_rate | DECIMAL(10,2) | NOT NULL | Tarif per jam berikutnya |
| effective_date | DATE | NOT NULL | Tanggal mulai berlaku |
| created_at | TIMESTAMP | DEFAULT NOW | Waktu dibuat |
| updated_at | TIMESTAMP | ON UPDATE NOW | Waktu diupdate |

**Business Rules:**
- Kombinasi (branch_id, vehicle_type_id, effective_date) harus unique
- Rates harus > 0
- Effective date bisa di masa depan
- Query tarif: ORDER BY effective_date DESC LIMIT 1

**Sample Data:**
```sql
(1, 1, 1, 2000.00, 1000.00, '2024-01-01')  -- Motor di Cabang Pusat
(2, 1, 2, 5000.00, 3000.00, '2024-01-01')  -- Mobil di Cabang Pusat
```

---

### 6. VEHICLES (Kendaraan)

**Purpose:** Registry kendaraan yang pernah parkir

**Attributes:**
| Column | Type | Constraint | Description |
|--------|------|------------|-------------|
| vehicle_id | INT | PK, AUTO_INCREMENT | ID unik kendaraan |
| license_plate | VARCHAR(20) | NOT NULL, UNIQUE | Plat nomor |
| vehicle_type_id | INT | FK, NOT NULL | ID jenis kendaraan |
| color | VARCHAR(30) | NULL | Warna (optional) |
| brand | VARCHAR(50) | NULL | Merk (optional) |
| created_at | TIMESTAMP | DEFAULT NOW | Waktu dibuat |
| updated_at | TIMESTAMP | ON UPDATE NOW | Waktu diupdate |

**Business Rules:**
- License plate harus unique
- Auto-uppercase untuk license plate
- Color dan brand bisa NULL (untuk kecepatan entry)
- Auto-register saat first entry

**Sample Data:**
```sql
(1, 'B 1234 ABC', 1, 'Hitam', 'Honda')
(2, 'B 5678 XYZ', 2, 'Putih', 'Toyota')
(3, 'B 9012 DEF', 2, NULL, NULL)  -- Color & brand NULL
```

---

### 7. TRANSACTIONS (Transaksi Parkir)

**Purpose:** Core business process - transaksi parkir masuk dan keluar

**Attributes:**
| Column | Type | Constraint | Description |
|--------|------|------------|-------------|
| transaction_id | INT | PK, AUTO_INCREMENT | ID unik transaksi |
| ticket_number | VARCHAR(20) | NOT NULL, UNIQUE | Nomor tiket |
| vehicle_id | INT | FK, NOT NULL | ID kendaraan |
| area_id | INT | FK, NOT NULL | ID area parkir |
| entry_time | TIMESTAMP | NOT NULL | Waktu masuk |
| exit_time | TIMESTAMP | NULL | Waktu keluar |
| duration_hours | DECIMAL(5,2) | NULL | Durasi (jam) |
| total_amount | DECIMAL(10,2) | NULL | Total biaya |
| payment_method | ENUM | NULL | cash/qris |
| payment_status | ENUM | DEFAULT pending | pending/paid/cancelled |
| officer_id | INT | FK | ID petugas |
| midtrans_order_id | VARCHAR(100) | NULL | Order ID Midtrans |
| created_at | TIMESTAMP | DEFAULT NOW | Waktu dibuat |
| updated_at | TIMESTAMP | ON UPDATE NOW | Waktu diupdate |

**Business Rules:**
- Ticket number format: TKT-YYYYMMDD-XXXX
- Minimum charge: 1 jam
- Duration dibulatkan ke atas (CEIL)
- Formula: first_hour + (duration-1) * next_hour
- Payment status: pending → paid/cancelled

**Sample Data:**
```sql
-- Active transaction
(1, 'TKT-20250211-0001', 1, 1, '2025-02-11 08:00:00', NULL, NULL, NULL, NULL, 'pending', 2, NULL)

-- Completed transaction
(2, 'TKT-20250211-0002', 2, 2, '2025-02-11 09:00:00', '2025-02-11 13:00:00', 4, 14000.00, 'cash', 'paid', 2, NULL)
```

---

### 8. ACTIVITY_LOGS (Log Aktivitas)

**Purpose:** Audit trail untuk semua aktivitas penting

**Attributes:**
| Column | Type | Constraint | Description |
|--------|------|------------|-------------|
| log_id | INT | PK, AUTO_INCREMENT | ID unik log |
| user_id | INT | FK | ID user |
| action | VARCHAR(100) | NOT NULL | Jenis aksi |
| table_name | VARCHAR(50) | NULL | Tabel yang dimodifikasi |
| record_id | INT | NULL | ID record |
| description | TEXT | NULL | Deskripsi detail |
| ip_address | VARCHAR(45) | NULL | IP address |
| created_at | TIMESTAMP | DEFAULT NOW | Waktu aksi |

**Business Rules:**
- Log tidak bisa dihapus/diubah
- Auto-log untuk aksi penting
- Retention: 1 tahun

**Sample Data:**
```sql
(1, 1, 'LOGIN', NULL, NULL, 'Admin login successful', '127.0.0.1', '2025-02-11 08:00:00')
(2, 2, 'VEHICLE_ENTRY', 'transactions', 1, 'Kendaraan B 1234 ABC masuk', '127.0.0.1', '2025-02-11 08:05:00')
```

---

## RELATIONSHIP MATRIX

| Parent Table | Child Table | Relationship | FK Column | On Delete |
|--------------|-------------|--------------|-----------|-----------|
| BRANCHES | USERS | 1:N | branch_id | SET NULL |
| BRANCHES | PARKING_AREAS | 1:N | branch_id | CASCADE |
| BRANCHES | PARKING_RATES | 1:N | branch_id | CASCADE |
| VEHICLE_TYPES | VEHICLES | 1:N | vehicle_type_id | RESTRICT |
| VEHICLE_TYPES | PARKING_RATES | 1:N | vehicle_type_id | CASCADE |
| VEHICLES | TRANSACTIONS | 1:N | vehicle_id | RESTRICT |
| PARKING_AREAS | TRANSACTIONS | 1:N | area_id | RESTRICT |
| USERS | TRANSACTIONS | 1:N | officer_id | SET NULL |
| USERS | ACTIVITY_LOGS | 1:N | user_id | SET NULL |

---

## SQL CREATE STATEMENTS

Lihat file: `database_schema.sql` untuk SQL lengkap dengan:
- CREATE TABLE statements
- FOREIGN KEY constraints
- CHECK constraints
- INDEXES
- STORED PROCEDURES
- VIEWS
- TRIGGERS
- SAMPLE DATA

---

**Good luck! 🎓**
