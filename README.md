# ANALISIS LENGKAP PROJECT APLIKASI PARKIR DESKTOP

**Dokumentasi Lengkap untuk Ujian Praktik Kejuruan**  
**SMK - Rekayasa Perangkat Lunak**

---

## ✅ SYSTEM STATUS: READY TO USE

**Backend**: ✅ Running on http://localhost:5000  
**Frontend**: ✅ Running on http://localhost:3000  
**Database**: ✅ Connected and seeded  
**Login**: ✅ Working (admin / password123)

📖 **Quick Start**: See [QUICK_REFERENCE.md](QUICK_REFERENCE.md)  
🔐 **Login Info**: See [LOGIN_CREDENTIALS.md](LOGIN_CREDENTIALS.md)  
✨ **Setup Guide**: See [SETUP_COMPLETE.md](SETUP_COMPLETE.md)

---

## 📋 DAFTAR ISI

1. [Ringkasan Eksekutif](#1-ringkasan-eksekutif)
2. [Analisis Kebutuhan (Requirements)](#2-analisis-kebutuhan-requirements)
3. [Metodologi Waterfall](#3-metodologi-waterfall)
4. [Fitur dan Sistem](#4-fitur-dan-sistem)
5. [Entity Relationship Diagram (ERD)](#5-entity-relationship-diagram-erd)
6. [Data Flow Diagram (DFD)](#6-data-flow-diagram-dfd)
7. [Flowchart (5 Proses Utama)](#7-flowchart-5-proses-utama)
8. [Alur Kerja Sistem](#8-alur-kerja-sistem)
9. [Teknologi Stack](#9-teknologi-stack)
10. [Best Practices & Coding Guidelines](#10-best-practices--coding-guidelines)
11. [Struktur Database SQL](#11-struktur-database-sql)
12. [Rencana Implementasi](#12-rencana-implementasi)

---

## 1. RINGKASAN EKSEKUTIF

### Project Overview

**Aplikasi Parkir Desktop** adalah sistem manajemen parkir berbasis desktop yang dirancang untuk mengelola operasional parkir multi-cabang dengan sistem pembayaran modern (Cash dan QRIS). Sistem ini dikembangkan menggunakan metodologi Waterfall dan menerapkan best practices dalam coding.

### Informasi Teknis

| Aspek | Detail |
|-------|--------|
| **Platform** | Desktop Application |
| **Frontend** | Next.js |
| **Backend** | Node.js dengan Express.js |
| **Database** | MySQL |
| **Payment Gateway** | Midtrans (QRIS) |
| **Metodologi** | Waterfall |
| **Waktu Pengerjaan** | 11 jam |

### Tujuan Utama

- ✅ Mengelola operasional parkir multi-cabang secara efisien
- ✅ Menyediakan sistem pembayaran modern (Cash dan QRIS)
- ✅ Memfasilitasi manajemen user dengan multi-role (Admin, Petugas, Owner)
- ✅ Menyediakan laporan dan statistik untuk pengambilan keputusan
- ✅ Mencatat log aktivitas untuk audit dan keamanan

---

## 2. ANALISIS KEBUTUHAN (REQUIREMENTS)

### 2.1 Kebutuhan Fungsional

#### A. Manajemen User dan Autentikasi

- **Login/Logout** untuk 3 level user: Admin, Petugas, Owner
- **CRUD User** (khusus Admin)
- **Role-based access control**
- **Session management** dengan JWT token
- **Password hashing** dengan bcrypt

#### B. Manajemen Data Master

**CRUD Tarif Parkir (Admin)**
- Tarif 1 jam pertama
- Tarif per jam berikutnya
- Tarif berbeda per jenis kendaraan
- Multi-cabang support

**CRUD Area/Lokasi Parkir (Admin)**
- Kapasitas area
- Real-time occupancy tracking
- Multi-area per cabang

**CRUD Kendaraan (Admin)**
- Registrasi kendaraan baru
- Update informasi kendaraan
- History kendaraan

**Management Cabang (Admin)**
- Data cabang
- Konfigurasi per cabang
- Status aktif/non-aktif

#### C. Transaksi Parkir

- **Input kendaraan masuk** (Petugas)
- **Proses pembayaran keluar** (Petugas)
- **Pilihan metode pembayaran**: Cash atau QRIS
- **Integrasi dengan Midtrans** untuk QRIS
- **Cetak struk parkir** (Petugas)
- **Generate ticket number** otomatis
- **Kalkulasi biaya** otomatis berdasarkan durasi

#### D. Pelaporan dan Monitoring

- **Log Aktivitas** sistem (Admin)
- **Statistik parkir** (Admin, Owner)
  - Pendapatan per hari/bulan
  - Jumlah kendaraan masuk/keluar
  - Tingkat okupansi
  - Peak hours analysis
- **Rekap transaksi** berdasarkan waktu (Owner)
- **Dashboard** dengan visualisasi data

### 2.2 Kebutuhan Non-Fungsional

#### Performance
- Query harus efisien dengan penggunaan index yang tepat
- Response time < 2 detik untuk operasi normal
- Pagination untuk data besar (LIMIT & OFFSET)
- Caching untuk data yang sering diakses

#### Security
- Password hashing dengan bcrypt (cost factor 10)
- SQL injection prevention (prepared statements)
- XSS protection
- CSRF token untuk form
- Input validation & sanitization
- Session timeout setelah 30 menit idle

#### Usability
- Interface user-friendly dan responsive
- Minimal 3 klik untuk fungsi utama
- Error message yang jelas dan helpful
- Konfirmasi untuk aksi destructive (delete)

#### Reliability
- Error handling yang comprehensive
- Transaction rollback pada error
- Backup database otomatis (daily)
- Logging untuk troubleshooting

#### Maintainability
- Code yang clean dan modular
- Dokumentasi inline (JSDoc)
- Naming convention yang konsisten
- Separation of concerns (MVC pattern)

---

## 3. METODOLOGI WATERFALL

### Overview

Metodologi Waterfall adalah pendekatan sekuensial dalam pengembangan perangkat lunak di mana setiap fase harus diselesaikan sebelum fase berikutnya dimulai.

### 3.1 Fase 1: Analisis Kebutuhan (Requirements Analysis)

**Aktivitas:**
- Mengidentifikasi kebutuhan fungsional dan non-fungsional
- Mendefinisikan scope project
- Menganalisis stakeholder requirements
- Identifikasi constraints dan assumptions

**Output:**
- Dokumen SRS (Software Requirements Specification)
- Use case diagram
- User stories

**Durasi:** 1-2 jam

---

### 3.2 Fase 2: Desain Sistem (System Design)

**Aktivitas:**
- Membuat Entity Relationship Diagram (ERD)
- Membuat Data Flow Diagram (DFD)
- Membuat Flowchart untuk proses kritis
- Mendesain arsitektur sistem (3-tier architecture)
- Mendesain database schema dengan normalisasi
- Mendesain UI/UX mockup (wireframe)
- Mendesain API endpoints

**Output:**
- ERD (Entity Relationship Diagram)
- DFD Level 0, 1, dan 2
- Flowchart (minimal 5)
- Database schema
- UI mockup
- API documentation

**Durasi:** 2-3 jam

---

### 3.3 Fase 3: Implementasi (Implementation/Coding)

**Aktivitas:**
- Setup environment development
- Membuat database berdasarkan ERD
- Coding backend (Node.js + Express)
  - API routes
  - Controllers
  - Models
  - Middleware
- Coding frontend (Next.js)
  - Pages
  - Components
  - State management
- Integrasi payment gateway (Midtrans)
- Mengikuti coding guidelines dan best practices

**Output:**
- Source code lengkap
- Database dengan data dummy
- API endpoints yang berfungsi
- Frontend yang terintegrasi

**Durasi:** 5-6 jam

---

### 3.4 Fase 4: Testing (Pengujian)

**Aktivitas:**
- Unit testing untuk setiap modul
- Integration testing
- System testing
- User acceptance testing (UAT)
- Bug fixing dan debugging
- Performance testing

**Output:**
- Test cases dan test results
- Bug report dan fix documentation
- Performance test results

**Durasi:** 1-2 jam

---

### 3.5 Fase 5: Deployment dan Maintenance

**Aktivitas:**
- Deploy aplikasi ke production
- User training dan dokumentasi
- Monitoring dan maintenance
- Bug fixes dan updates

**Output:**
- Aplikasi yang ready to use
- User manual
- Technical documentation
- Maintenance log

**Durasi:** 1 jam

---

## 4. FITUR DAN SISTEM

### 4.1 Fitur Berdasarkan Role

| Role | Fitur yang Dapat Diakses |
|------|--------------------------|
| **ADMIN** | • Login/Logout<br>• CRUD User<br>• CRUD Tarif Parkir<br>• CRUD Area/Lokasi Parkir<br>• CRUD Kendaraan<br>• Management Cabang<br>• Akses Log Aktivitas<br>• View Statistik |
| **PETUGAS** | • Login/Logout<br>• Input Kendaraan Masuk<br>• Proses Transaksi Pembayaran<br>• Pilih Metode Payment (Cash/QRIS)<br>• Cetak Struk Parkir |
| **OWNER** | • Login/Logout<br>• View Statistik Parkir<br>• Rekap Transaksi Berdasarkan Waktu<br>• Dashboard Analytics |

---

### 4.2 Sistem Tarif Parkir

#### Mekanisme Perhitungan Tarif

1. **Jam pertama**: Tarif flat sesuai jenis kendaraan
2. **Jam berikutnya**: Tarif per jam berbeda
3. **Setiap jenis kendaraan** memiliki tarif sendiri
4. **Formula**:
   ```
   Total = (duration <= 1) 
           ? first_hour_rate 
           : first_hour_rate + ((duration - 1) * next_hour_rate)
   ```

#### Contoh Struktur Tarif

| Jenis Kendaraan | Tarif 1 Jam Pertama | Tarif Per Jam Berikutnya |
|-----------------|---------------------|--------------------------|
| Motor | Rp 2.000 | Rp 1.000 |
| Mobil | Rp 5.000 | Rp 3.000 |
| Bus/Truk | Rp 10.000 | Rp 5.000 |

#### Contoh Perhitungan

**Kasus 1: Motor parkir 30 menit**
- Duration = 0.5 jam → dibulatkan menjadi 1 jam (minimum charge)
- Total = Rp 2.000

**Kasus 2: Mobil parkir 3.5 jam**
- Duration = 3.5 jam → dibulatkan menjadi 4 jam
- Total = Rp 5.000 + ((4-1) × Rp 3.000) = Rp 14.000

---

### 4.3 Sistem Pembayaran

#### Cash Payment
- Input langsung oleh petugas
- Update status payment ke "paid" secara real-time
- Print struk otomatis

#### QRIS Payment (Midtrans)
1. Generate QR code via Midtrans API
2. Customer scan QR dengan mobile banking
3. Webhook notification dari Midtrans
4. Auto-update payment status
5. Print struk setelah pembayaran sukses

---

## 5. ENTITY RELATIONSHIP DIAGRAM (ERD)

### 5.1 Entitas dan Atribut

#### 1. USERS
```
- user_id (PK) - INT, AUTO_INCREMENT
- username - VARCHAR(50), UNIQUE, NOT NULL
- password - VARCHAR(255), NOT NULL (hashed with bcrypt)
- full_name - VARCHAR(100), NOT NULL
- role - ENUM('admin', 'petugas', 'owner'), NOT NULL
- branch_id (FK) - INT
- is_active - BOOLEAN, DEFAULT TRUE
- created_at - TIMESTAMP, DEFAULT CURRENT_TIMESTAMP
- updated_at - TIMESTAMP, ON UPDATE CURRENT_TIMESTAMP
```

#### 2. BRANCHES (Cabang)
```
- branch_id (PK) - INT, AUTO_INCREMENT
- branch_name - VARCHAR(100), NOT NULL
- address - TEXT
- phone - VARCHAR(20)
- is_active - BOOLEAN, DEFAULT TRUE
- created_at - TIMESTAMP, DEFAULT CURRENT_TIMESTAMP
- updated_at - TIMESTAMP
```

#### 3. PARKING_AREAS (Area Parkir)
```
- area_id (PK) - INT, AUTO_INCREMENT
- branch_id (FK) - INT, NOT NULL
- area_name - VARCHAR(50), NOT NULL
- capacity - INT, NOT NULL
- current_occupancy - INT, DEFAULT 0
- created_at - TIMESTAMP
```

#### 4. VEHICLE_TYPES (Jenis Kendaraan)
```
- vehicle_type_id (PK) - INT, AUTO_INCREMENT
- type_name - VARCHAR(50), NOT NULL (Motor, Mobil, Bus/Truk)
- description - TEXT
- created_at - TIMESTAMP
```

#### 5. PARKING_RATES (Tarif Parkir)
```
- rate_id (PK) - INT, AUTO_INCREMENT
- branch_id (FK) - INT, NOT NULL
- vehicle_type_id (FK) - INT, NOT NULL
- first_hour_rate - DECIMAL(10,2), NOT NULL
- next_hour_rate - DECIMAL(10,2), NOT NULL
- effective_date - DATE, NOT NULL
- created_at - TIMESTAMP
- updated_at - TIMESTAMP
```

#### 6. VEHICLES (Kendaraan)
```
- vehicle_id (PK) - INT, AUTO_INCREMENT
- license_plate - VARCHAR(20), NOT NULL, UNIQUE
- vehicle_type_id (FK) - INT, NOT NULL
- color - VARCHAR(30)
- brand - VARCHAR(50)
- created_at - TIMESTAMP
- updated_at - TIMESTAMP
```

#### 7. TRANSACTIONS (Transaksi Parkir)
```
- transaction_id (PK) - INT, AUTO_INCREMENT
- ticket_number - VARCHAR(20), UNIQUE, NOT NULL
- vehicle_id (FK) - INT, NOT NULL
- area_id (FK) - INT, NOT NULL
- entry_time - TIMESTAMP, NOT NULL
- exit_time - TIMESTAMP
- duration_hours - DECIMAL(5,2)
- total_amount - DECIMAL(10,2)
- payment_method - ENUM('cash', 'qris')
- payment_status - ENUM('pending', 'paid', 'cancelled'), DEFAULT 'pending'
- officer_id (FK) - INT (petugas yang melayani)
- midtrans_order_id - VARCHAR(100)
- created_at - TIMESTAMP
- updated_at - TIMESTAMP
```

#### 8. ACTIVITY_LOGS (Log Aktivitas)
```
- log_id (PK) - INT, AUTO_INCREMENT
- user_id (FK) - INT
- action - VARCHAR(100), NOT NULL
- table_name - VARCHAR(50)
- record_id - INT
- description - TEXT
- ip_address - VARCHAR(45)
- created_at - TIMESTAMP, DEFAULT CURRENT_TIMESTAMP
```

---

### 5.2 Relasi Antar Tabel

```
USERS → BRANCHES (Many to One)
  - Setiap user bekerja di satu cabang

PARKING_AREAS → BRANCHES (Many to One)
  - Setiap area parkir milik satu cabang

PARKING_RATES → BRANCHES (Many to One)
  - Tarif bisa berbeda per cabang

PARKING_RATES → VEHICLE_TYPES (Many to One)
  - Setiap tarif untuk satu jenis kendaraan

VEHICLES → VEHICLE_TYPES (Many to One)
  - Setiap kendaraan punya satu tipe

TRANSACTIONS → VEHICLES (Many to One)
  - Satu kendaraan bisa punya banyak transaksi

TRANSACTIONS → PARKING_AREAS (Many to One)
  - Transaksi terjadi di satu area

TRANSACTIONS → USERS (Many to One)
  - Transaksi dilayani oleh satu petugas (officer_id)

ACTIVITY_LOGS → USERS (Many to One)
  - Log aktivitas mencatat user yang melakukan aksi
```

---

## 6. DATA FLOW DIAGRAM (DFD)

### 6.1 Context Diagram (Level 0)

#### Entitas Eksternal:
- **Admin** - mengelola data master sistem
- **Petugas** - melakukan transaksi parkir harian
- **Owner** - melihat laporan dan statistik bisnis
- **Midtrans API** - payment gateway untuk QRIS

#### Aliran Data Masuk:
- Login credentials dari semua user
- Data master (user, tarif, area, kendaraan, cabang) dari Admin
- Data kendaraan masuk dari Petugas
- Data pembayaran dari Petugas
- Konfirmasi pembayaran dari Midtrans

#### Aliran Data Keluar:
- Dashboard dan menu sesuai role
- Struk parkir ke Petugas
- Laporan dan statistik ke Owner
- Log aktivitas ke Admin
- Request pembayaran QRIS ke Midtrans

---

### 6.2 DFD Level 1

#### Proses 1.0: Manajemen Autentikasi
**Input:**
- Username
- Password

**Proses:**
1. Validasi kredensial dengan database
2. Cek role user
3. Generate JWT token
4. Create session

**Output:**
- Session token
- Redirect ke dashboard sesuai role

**Data Store:**
- USERS

---

#### Proses 2.0: Manajemen Data Master
**Input:**
- Data user (username, password, role, dll)
- Data cabang (nama, alamat, phone)
- Data area (nama, kapasitas)
- Data tarif (jenis kendaraan, harga)
- Data kendaraan (plat nomor, jenis)

**Proses:**
- CRUD operations
- Validasi data
- Check constraint (unique, foreign key)
- Log aktivitas

**Output:**
- Konfirmasi sukses/gagal
- Data yang sudah tersimpan

**Data Store:**
- USERS
- BRANCHES
- PARKING_AREAS
- PARKING_RATES
- VEHICLES
- VEHICLE_TYPES
- ACTIVITY_LOGS

---

#### Proses 3.0: Proses Transaksi Parkir
**Input:**
- Data kendaraan masuk (plat, jenis, warna, merk)
- Waktu keluar
- Metode pembayaran

**Proses:**
1. Check slot parkir tersedia
2. Register/identify vehicle
3. Generate ticket number
4. Calculate duration
5. Calculate amount based on rate
6. Process payment
7. Update area occupancy

**Output:**
- Ticket masuk
- Struk pembayaran
- Konfirmasi pembayaran

**Data Store:**
- TRANSACTIONS
- VEHICLES
- PARKING_AREAS
- PARKING_RATES
- ACTIVITY_LOGS

---

#### Proses 4.0: Manajemen Payment
**Input:**
- Transaction ID
- Payment method (cash/qris)
- Amount

**Proses:**
- **Jika Cash:**
  - Update payment status langsung
- **Jika QRIS:**
  - Generate order via Midtrans API
  - Create QR code
  - Wait for webhook confirmation
  - Update payment status

**Output:**
- Payment confirmation
- QR code (untuk QRIS)
- Receipt

**Data Store:**
- TRANSACTIONS

**External:**
- Midtrans API

---

#### Proses 5.0: Pelaporan dan Statistik
**Input:**
- Filter periode (tanggal mulai - tanggal akhir)
- Filter cabang
- Filter jenis kendaraan

**Proses:**
1. Agregasi data transaksi
2. Kalkulasi statistik:
   - Total pendapatan
   - Jumlah kendaraan
   - Average duration
   - Peak hours
   - Okupansi rate
3. Generate chart dan graph

**Output:**
- Dashboard dengan visualisasi
- Laporan PDF/Excel
- Real-time statistics

**Data Store:**
- TRANSACTIONS
- BRANCHES
- PARKING_AREAS

---

#### Proses 6.0: Log Aktivitas
**Input:**
- User action
- Timestamp
- Table name
- Record ID
- IP address

**Proses:**
- Record semua aktivitas penting:
  - Login/logout
  - CRUD operations
  - Transaction completion
  - Payment processing

**Output:**
- Log history dengan filter
- Audit trail

**Data Store:**
- ACTIVITY_LOGS
- USERS

---

## 7. FLOWCHART (5 PROSES UTAMA)

### 7.1 Flowchart: Proses Login

```
START
  ↓
[Tampilkan Form Login]
  ↓
[User Input Username & Password]
  ↓
<Username & Password Kosong?> ─YES→ [Error: Field Required] → (Kembali ke Form)
  ↓ NO
[Query: SELECT * FROM users WHERE username = ?]
  ↓
<User Ditemukan?> ─NO→ [Error: Username Tidak Ditemukan] → (Kembali)
  ↓ YES
[Verify Password dengan bcrypt.compare()]
  ↓
<Password Cocok?> ─NO→ [Error: Password Salah] → (Kembali)
  ↓ YES
<is_active = TRUE?> ─NO→ [Error: Akun Non-Aktif] → END
  ↓ YES
[Generate JWT Token (user_id, username, role)]
  ↓
[Simpan Token ke Session/Cookie]
  ↓
[INSERT INTO activity_logs (action='LOGIN')]
  ↓
<Cek Role>
  ├─ admin → [Redirect /admin/dashboard]
  ├─ petugas → [Redirect /petugas/transaction]
  └─ owner → [Redirect /owner/statistics]
  ↓
END
```

**Key Points:**
- Validasi input sebelum query database
- Password verification dengan bcrypt (tidak plain text)
- Check status aktif user
- JWT token untuk session management
- Role-based redirect
- Log setiap login untuk audit

---

### 7.2 Flowchart: Proses Transaksi (Kendaraan Masuk)

```
START
  ↓
[Petugas Login]
  ↓
[Tampilkan Form Input Kendaraan Masuk]
  ↓
[Input: Plat Nomor (wajib), Jenis Kendaraan (dropdown 3 pilihan)]
  ↓
<Validasi Input?> ─INVALID→ [Error Message] → (Kembali)
  ↓ VALID
[Query: SELECT area_id, capacity, current_occupancy 
 FROM parking_areas WHERE branch_id = ?]
  ↓
<Ada Slot Kosong? (occupancy < capacity)> ─NO→ [Error: Parkir Penuh] → END
  ↓ YES
[Query: SELECT vehicle_id FROM vehicles 
 WHERE license_plate = ?]
  ↓
<Kendaraan Sudah Terdaftar?>
  ├─ NO → [INSERT INTO vehicles (...)]
  └─ YES → [Gunakan vehicle_id yang ada]
  ↓
[Generate Ticket Number: TKT-YYYYMMDD-XXXX]
  ↓
[INSERT INTO transactions 
 (ticket_number, vehicle_id, area_id, 
  entry_time, officer_id, payment_status='pending')]
  ↓
[UPDATE parking_areas 
 SET current_occupancy = current_occupancy + 1]
  ↓
[INSERT INTO activity_logs (action='VEHICLE_ENTRY')]
  ↓
[Tampilkan Konfirmasi & Cetak Tiket Masuk]
  ↓
END
```

**Key Points:**
- Input MINIMAL (plat + jenis) untuk kecepatan (< 10 detik)
- Check kapasitas parkir sebelum admit kendaraan
- Auto-register kendaraan baru jika belum ada
- Generate unique ticket number dengan format terstruktur
- Update occupancy real-time
- Log setiap entry untuk tracking

**Design Decision:**
- Warna dan merk TIDAK diinput untuk efisiensi operasional
- Fokus pada kecepatan layanan (avoid antrian panjang)
- Data minimal yang dibutuhkan untuk perhitungan tarif

---

### 7.3 Flowchart: Cetak Struk Parkir (Kendaraan Keluar)

```
START
  ↓
[Petugas Scan/Input Ticket Number]
  ↓
[Query: SELECT t.*, v.license_plate, v.vehicle_type_id, 
        vt.type_name, b.branch_id
 FROM transactions t
 JOIN vehicles v ON t.vehicle_id = v.vehicle_id
 JOIN vehicle_types vt ON v.vehicle_type_id = vt.vehicle_type_id
 JOIN parking_areas pa ON t.area_id = pa.area_id
 JOIN branches b ON pa.branch_id = b.branch_id
 WHERE t.ticket_number = ? AND t.payment_status = 'pending']
  ↓
<Tiket Valid & Status Pending?> ─NO→ [Error: Tiket Tidak Valid] → END
  ↓ YES
[Catat exit_time = CURRENT_TIMESTAMP]
  ↓
[Hitung duration_hours = 
 TIMESTAMPDIFF(HOUR, entry_time, exit_time)]
  ↓
<duration < 1?> ─YES→ [Set duration = 1 (minimum charge)]
  ↓ NO (duration >= 1)
[Query Tarif: SELECT first_hour_rate, next_hour_rate
 FROM parking_rates 
 WHERE vehicle_type_id = ? AND branch_id = ?
 ORDER BY effective_date DESC LIMIT 1]
  ↓
[Kalkulasi Total Amount:
 IF duration = 1 THEN
   total = first_hour_rate
 ELSE
   total = first_hour_rate + ((duration - 1) * next_hour_rate)
 END IF]
  ↓
[UPDATE transactions 
 SET exit_time=?, duration_hours=?, total_amount=?
 WHERE transaction_id=?]
  ↓
[Tampilkan Pilihan Metode: CASH atau QRIS]
  ↓
<User Pilih Metode>
  ├─ CASH → [Lanjut ke Proses Cash]
  └─ QRIS → [Lanjut ke Proses QRIS]

[PROSES CASH:]
  ↓
[UPDATE transactions SET 
 payment_method='cash', payment_status='paid']
  ↓
[Lanjut ke Cetak Struk]

[PROSES QRIS:]
  ↓
[Generate order_id = TRX-{transaction_id}-{timestamp}]
  ↓
[Call Midtrans API: 
 createTransaction(amount, order_id, customer_details)]
  ↓
<API Response Success?> ─NO→ [Error: Gagal Generate QR] → END
  ↓ YES
[Terima QR Code String dari Midtrans]
  ↓
[UPDATE transactions SET 
 payment_method='qris', midtrans_order_id=?]
  ↓
[Tampilkan QR Code untuk Customer Scan]
  ↓
[Polling/Webhook Midtrans untuk Status Payment]
  ↓
<Pembayaran Berhasil?> ─NO→ [Error: Pembayaran Gagal/Timeout] → END
  ↓ YES
[UPDATE transactions SET payment_status='paid']
  ↓
[Lanjut ke Cetak Struk]

[CETAK STRUK:]
  ↓
[UPDATE parking_areas 
 SET current_occupancy = current_occupancy - 1]
  ↓
[INSERT INTO activity_logs (action='VEHICLE_EXIT')]
  ↓
[Generate Struk PDF/Print dengan data:
 - Ticket Number
 - License Plate, Vehicle Type
 - Entry Time, Exit Time
 - Duration (hours)
 - Total Amount
 - Payment Method
 - Timestamp, Officer Name]
  ↓
[Print/Download Struk]
  ↓
[Tampilkan Konfirmasi Sukses]
  ↓
END
```

**Key Points:**
- Minimum charge 1 jam (meskipun parkir < 1 jam)
- Tarif dinamis berdasarkan jenis kendaraan dan cabang
- Support 2 metode pembayaran dengan flow berbeda
- Midtrans integration untuk QRIS
- Update occupancy setelah payment sukses
- Struk detail untuk customer dan record

---

### 7.4 Flowchart: CRUD Tarif Parkir (Master Data)

#### A. CREATE (Tambah Tarif)

```
START
  ↓
[Admin Login & Masuk Menu Tarif Parkir]
  ↓
[Klik 'Tambah Tarif Baru']
  ↓
[Tampilkan Form Input:
 - Pilih Cabang (dropdown)
 - Pilih Jenis Kendaraan (dropdown)
 - Input Tarif 1 Jam Pertama
 - Input Tarif Per Jam Berikutnya
 - Tanggal Berlaku]
  ↓
[Admin Isi Form & Submit]
  ↓
<Validasi Input?
 - Semua field required
 - Tarif harus > 0
 - Tanggal valid>
  ├─ INVALID → [Tampilkan Error Message] → (Kembali ke Form)
  └─ VALID ↓
[Query: SELECT COUNT(*) FROM parking_rates
 WHERE branch_id=? AND vehicle_type_id=? 
 AND effective_date=?]
  ↓
<Tarif Sudah Ada?> ─YES→ [Error: Duplikasi Data] → (Kembali)
  ↓ NO
[INSERT INTO parking_rates 
 (branch_id, vehicle_type_id, first_hour_rate, 
  next_hour_rate, effective_date)]
  ↓
[INSERT INTO activity_logs (action='CREATE_RATE')]
  ↓
[Tampilkan Notifikasi Sukses]
  ↓
[Refresh/Reload Daftar Tarif]
  ↓
END
```

#### B. READ (Lihat/Filter Tarif)

```
START
  ↓
[Query: SELECT pr.*, b.branch_name, vt.type_name
 FROM parking_rates pr
 JOIN branches b ON pr.branch_id = b.branch_id
 JOIN vehicle_types vt ON pr.vehicle_type_id = vt.vehicle_type_id
 ORDER BY pr.effective_date DESC
 LIMIT 100]
  ↓
[Tampilkan dalam Tabel dengan Kolom:
 - Cabang
 - Jenis Kendaraan
 - Tarif 1 Jam Pertama
 - Tarif Per Jam Berikutnya
 - Tanggal Berlaku
 - Aksi (Edit, Delete)]
  ↓
[Sediakan Filter:
 - By Cabang
 - By Jenis Kendaraan
 - By Tanggal]
  ↓
<Filter Diterapkan?> ─YES→ [Re-query dengan WHERE clause] → (Tampilkan)
  ↓ NO
END
```

#### C. UPDATE (Edit Tarif)

```
START
  ↓
[Admin Klik 'Edit' pada Row Tertentu]
  ↓
[Query: SELECT * FROM parking_rates WHERE rate_id=?]
  ↓
[Populate Form dengan Data Existing]
  ↓
[Admin Ubah Field yang Perlu]
  ↓
[Submit Form]
  ↓
<Validasi Input?> ─INVALID→ [Error] → (Kembali)
  ↓ VALID
[UPDATE parking_rates 
 SET branch_id=?, vehicle_type_id=?, 
     first_hour_rate=?, next_hour_rate=?, 
     effective_date=?, updated_at=NOW()
 WHERE rate_id=?]
  ↓
[INSERT INTO activity_logs (action='UPDATE_RATE')]
  ↓
[Tampilkan Notifikasi Sukses]
  ↓
[Refresh List]
  ↓
END
```

#### D. DELETE (Hapus Tarif)

```
START
  ↓
[Admin Klik 'Hapus' pada Row Tertentu]
  ↓
[Tampilkan Konfirmasi Dialog:
 'Yakin ingin menghapus tarif ini?']
  ↓
<Konfirmasi?> ─NO→ END
  ↓ YES
[Query: SELECT COUNT(*) FROM transactions t
 JOIN vehicles v ON t.vehicle_id = v.vehicle_id
 JOIN parking_areas pa ON t.area_id = pa.area_id
 WHERE v.vehicle_type_id = ? 
 AND pa.branch_id = ?]
  ↓
<Ada Transaksi Terkait?> ─YES→ [Error: Tidak Bisa Hapus] → END
  ↓ NO
[DELETE FROM parking_rates WHERE rate_id=?]
  ↓
[INSERT INTO activity_logs (action='DELETE_RATE')]
  ↓
[Tampilkan Notifikasi Sukses]
  ↓
[Refresh List]
  ↓
END
```

**Key Points:**
- Validasi input untuk mencegah data invalid
- Check duplikasi sebelum insert
- Soft delete atau hard delete dengan constraint check
- Log setiap perubahan data master
- User-friendly error messages

---

### 7.5 Flowchart: Generate Laporan Statistik

```
START
  ↓
[Owner Login]
  ↓
[Tampilkan Dashboard Statistik]
  ↓
[Input Filter:
 - Tanggal Mulai (default: awal bulan)
 - Tanggal Akhir (default: hari ini)
 - Pilih Cabang (optional, default: semua)
 - Pilih Jenis Kendaraan (optional)]
  ↓
[Owner Submit Filter]
  ↓
[Query Agregasi Data:]

[1. Total Pendapatan:
 SELECT SUM(total_amount) as total_revenue
 FROM transactions
 WHERE payment_status='paid'
 AND exit_time BETWEEN ? AND ?
 AND area_id IN (SELECT area_id FROM parking_areas WHERE branch_id=?)]
  ↓
[2. Jumlah Kendaraan Masuk:
 SELECT COUNT(*) as total_vehicles
 FROM transactions
 WHERE entry_time BETWEEN ? AND ?]
  ↓
[3. Average Duration:
 SELECT AVG(duration_hours) as avg_duration
 FROM transactions
 WHERE payment_status='paid']
  ↓
[4. Breakdown by Vehicle Type:
 SELECT vt.type_name, COUNT(*) as count, SUM(t.total_amount) as revenue
 FROM transactions t
 JOIN vehicles v ON t.vehicle_id = v.vehicle_id
 JOIN vehicle_types vt ON v.vehicle_type_id = vt.vehicle_type_id
 WHERE t.payment_status='paid'
 GROUP BY vt.type_name]
  ↓
[5. Peak Hours Analysis:
 SELECT HOUR(entry_time) as hour, COUNT(*) as count
 FROM transactions
 WHERE entry_time BETWEEN ? AND ?
 GROUP BY HOUR(entry_time)
 ORDER BY count DESC]
  ↓
[6. Okupansi Rate:
 SELECT pa.area_name, 
        pa.capacity, 
        pa.current_occupancy,
        (pa.current_occupancy / pa.capacity * 100) as occupancy_rate
 FROM parking_areas pa]
  ↓
[7. Payment Method Distribution:
 SELECT payment_method, COUNT(*) as count
 FROM transactions
 WHERE payment_status='paid'
 GROUP BY payment_method]
  ↓
[Visualisasi Data:]
  ├─ [Line Chart: Pendapatan per Hari]
  ├─ [Bar Chart: Kendaraan by Type]
  ├─ [Pie Chart: Payment Method Distribution]
  ├─ [Heat Map: Peak Hours]
  └─ [Gauge: Real-time Occupancy Rate]
  ↓
[Tampilkan Dashboard dengan Semua Visualisasi]
  ↓
<Owner Ingin Export Report?> ─YES→ [Generate PDF/Excel] → [Download]
  ↓ NO
END
```

**Key Points:**
- Flexible filtering untuk custom report
- Multiple aggregation queries untuk insight berbeda
- Visualisasi data untuk easy understanding
- Export functionality untuk sharing/presentation
- Efficient queries dengan proper indexing
- Real-time data untuk current occupancy

---

## 8. ALUR KERJA SISTEM

### 8.1 Alur Kerja Harian - Petugas

**Morning Shift (07:00 - 15:00)**

1. **Login ke Sistem**
   - Input username dan password
   - Sistem validasi dan redirect ke dashboard petugas

2. **Menerima Kendaraan Masuk**
   - Customer datang dengan kendaraan
   - Petugas input data:
     - Nomor plat
     - Jenis kendaraan (dropdown)
     - Warna dan merk (optional)
   - Sistem generate ticket otomatis
   - Print tiket untuk customer
   - Update ocupancy counter

3. **Proses Kendaraan Keluar**
   - Customer datang dengan tiket
   - Petugas scan/input ticket number
   - Sistem kalkulasi biaya otomatis
   - Tampilkan detail: durasi, tarif, total
   - Customer pilih metode pembayaran:
     - **Cash**: Langsung update status paid
     - **QRIS**: Generate QR → Customer scan → Konfirmasi
   - Print struk pembayaran
   - Update occupancy counter

4. **Logout**
   - End shift
   - Sistem catat log logout

---

### 8.2 Alur Kerja Periodik - Admin

**Weekly/Monthly Tasks**

1. **Manajemen User**
   - Tambah user baru (petugas/owner baru)
   - Update data user
   - Deaktivasi user yang resign
   - Reset password jika lupa

2. **Update Tarif Parkir**
   - Review tarif existing
   - Update tarif jika ada perubahan kebijakan
   - Set effective date untuk tarif baru

3. **Manajemen Cabang & Area**
   - Tambah cabang baru jika ekspansi
   - Update kapasitas area jika ada renovasi
   - Monitor occupancy rate per area

4. **Monitor Log Aktivitas**
   - Review suspicious activities
   - Check user access patterns
   - Identify potential security issues

5. **Data Maintenance**
   - Cleanup old data (archive transactions > 1 year)
   - Backup database
   - Optimize queries jika ada performance issue

---

### 8.3 Alur Kerja Periodik - Owner

**Daily/Weekly/Monthly Review**

1. **Login ke Dashboard**
   - View real-time statistics
   - Monitor key metrics:
     - Pendapatan hari ini
     - Jumlah kendaraan masuk/keluar
     - Occupancy rate
     - Payment method preference

2. **Analisis Trends**
   - Compare revenue: hari ini vs kemarin, minggu ini vs minggu lalu
   - Identify peak hours untuk staffing optimization
   - Analyze vehicle type distribution
   - Review payment method adoption (QRIS vs Cash)

3. **Generate Reports**
   - Monthly revenue report
   - Performance by branch
   - Growth analysis
   - Export data untuk presentation/meeting

4. **Strategic Decision Making**
   - Determine pricing strategy
   - Evaluate need untuk expansion
   - Staffing requirements
   - Marketing initiatives

---

### 8.4 Flow Integrasi Midtrans (QRIS)

**Payment Flow Sequence**

```
1. [Petugas] Pilih pembayaran QRIS
   ↓
2. [Backend] Generate order_id unique
   ↓
3. [Backend] Call Midtrans API:
   POST /v2/charge
   Body: {
     payment_type: "qris",
     transaction_details: {
       order_id: "TRX-123-20250211",
       gross_amount: 5000
     }
   }
   ↓
4. [Midtrans] Response dengan QR string
   ↓
5. [Frontend] Render QR code untuk customer
   ↓
6. [Customer] Scan QR dengan mobile banking
   ↓
7. [Customer] Konfirmasi pembayaran di mobile
   ↓
8. [Midtrans] Send webhook notification ke backend:
   POST /api/payment/notification
   Body: {
     order_id: "TRX-123-20250211",
     transaction_status: "settlement",
     payment_type: "qris"
   }
   ↓
9. [Backend] Verify signature
   ↓
10. [Backend] Update transaction status = 'paid'
    ↓
11. [Backend] Emit event ke frontend (WebSocket/SSE)
    ↓
12. [Frontend] Show success message
    ↓
13. [Frontend] Print struk otomatis
```

**Error Handling:**
- Timeout (5 menit): Auto-cancel transaction
- Network error: Retry mechanism dengan exponential backoff
- Invalid signature: Reject notification & alert admin
- Duplicate notification: Check idempotency

---

## 9. TEKNOLOGI STACK

### 9.1 Frontend (Next.js)

**Framework:** Next.js 14 (App Router)

**Key Libraries:**
```json
{
  "next": "^14.0.0",
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  
  "// UI Components": "",
  "@shadcn/ui": "latest",
  "tailwindcss": "^3.4.0",
  
  "// Forms & Validation": "",
  "react-hook-form": "^7.48.0",
  "zod": "^3.22.0",
  
  "// State Management": "",
  "zustand": "^4.4.0",
  
  "// Data Fetching": "",
  "axios": "^1.6.0",
  "swr": "^2.2.0",
  
  "// Charts & Visualization": "",
  "recharts": "^2.10.0",
  "react-chartjs-2": "^5.2.0",
  
  "// QR Code": "",
  "qrcode.react": "^3.1.0",
  
  "// PDF Generation": "",
  "jspdf": "^2.5.0",
  "html2canvas": "^1.4.0",
  
  "// Date Handling": "",
  "date-fns": "^2.30.0"
}
```

**Struktur Folder:**
```
/app
  /(auth)
    /login
      page.tsx
  /admin
    /dashboard
    /users
    /branches
    /areas
    /rates
    /vehicles
    /logs
  /petugas
    /transaction
      /in
      /out
  /owner
    /statistics
    /reports
/components
  /ui (shadcn components)
  /forms
  /charts
  /layout
/lib
  /api (API client functions)
  /utils (helper functions)
  /validations (zod schemas)
/hooks
  /useAuth.ts
  /useTransaction.ts
  /useStats.ts
```

---

### 9.2 Backend (Node.js + Express)

**Framework:** Express.js

**Key Dependencies:**
```json
{
  "express": "^4.18.2",
  
  "// Database": "",
  "mysql2": "^3.6.0",
  "sequelize": "^6.35.0",
  
  "// Authentication": "",
  "jsonwebtoken": "^9.0.2",
  "bcrypt": "^5.1.1",
  
  "// Validation": "",
  "joi": "^17.11.0",
  "express-validator": "^7.0.0",
  
  "// Security": "",
  "helmet": "^7.1.0",
  "cors": "^2.8.5",
  "express-rate-limit": "^7.1.0",
  
  "// Payment Gateway": "",
  "midtrans-client": "^1.3.1",
  
  "// Logging": "",
  "winston": "^3.11.0",
  "morgan": "^1.10.0",
  
  "// Environment": "",
  "dotenv": "^16.3.0",
  
  "// Development": "",
  "nodemon": "^3.0.0"
}
```

**Struktur Folder:**
```
/src
  /config
    db.js (database connection)
    midtrans.js (payment config)
  /controllers
    authController.js
    userController.js
    branchController.js
    areaController.js
    rateController.js
    vehicleController.js
    transactionController.js
    statisticController.js
    logController.js
  /models
    User.js
    Branch.js
    ParkingArea.js
    VehicleType.js
    ParkingRate.js
    Vehicle.js
    Transaction.js
    ActivityLog.js
  /middlewares
    auth.js (JWT verification)
    role.js (role-based access)
    validate.js (request validation)
    errorHandler.js
    logger.js
  /routes
    auth.routes.js
    user.routes.js
    branch.routes.js
    area.routes.js
    rate.routes.js
    vehicle.routes.js
    transaction.routes.js
    statistic.routes.js
    log.routes.js
    payment.routes.js
  /services
    authService.js
    transactionService.js
    paymentService.js
    statisticService.js
  /utils
    helpers.js
    validators.js
    constants.js
  app.js
  server.js
```

---

### 9.3 Database (MySQL)

**Version:** MySQL 8.0+

**Configuration:**
```
Character Set: utf8mb4
Collation: utf8mb4_unicode_ci
Engine: InnoDB
```

**Performance Optimization:**

**Indexes:**
```sql
-- Users table
CREATE INDEX idx_username ON users(username);
CREATE INDEX idx_role ON users(role);
CREATE INDEX idx_branch ON users(branch_id);

-- Transactions table
CREATE INDEX idx_ticket ON transactions(ticket_number);
CREATE INDEX idx_payment_status ON transactions(payment_status);
CREATE INDEX idx_entry_time ON transactions(entry_time);
CREATE INDEX idx_exit_time ON transactions(exit_time);
CREATE INDEX idx_vehicle ON transactions(vehicle_id);
CREATE INDEX idx_officer ON transactions(officer_id);

-- Vehicles table
CREATE INDEX idx_license_plate ON vehicles(license_plate);
CREATE INDEX idx_vehicle_type ON vehicles(vehicle_type_id);

-- Activity Logs
CREATE INDEX idx_user_id ON activity_logs(user_id);
CREATE INDEX idx_created_at ON activity_logs(created_at);
CREATE INDEX idx_action ON activity_logs(action);

-- Parking Rates
CREATE INDEX idx_branch_vehicle ON parking_rates(branch_id, vehicle_type_id);
CREATE INDEX idx_effective_date ON parking_rates(effective_date);
```

**Query Optimization Tips:**
- Use EXPLAIN untuk analyze query performance
- Avoid SELECT * (pilih kolom yang dibutuhkan saja)
- Use LIMIT untuk pagination
- Use JOIN instead of subquery jika memungkinkan
- Use prepared statements (prevent SQL injection)

---

### 9.4 Payment Gateway (Midtrans)

**Product:** Midtrans Snap - QRIS

**Integration Type:** Server-side

**Key Features:**
- Generate QR Code untuk QRIS payment
- Real-time payment notification via webhook
- Transaction status inquiry
- Refund support

**API Endpoints Used:**
```
POST https://api.sandbox.midtrans.com/v2/charge
  - Generate QRIS payment

GET https://api.sandbox.midtrans.com/v2/{order_id}/status
  - Check transaction status

POST https://api.sandbox.midtrans.com/v2/{order_id}/refund
  - Refund transaction
```

**Webhook Handler:**
```javascript
// POST /api/payment/notification
async function handleNotification(req, res) {
  const notification = req.body;
  
  // 1. Verify signature
  const serverKey = process.env.MIDTRANS_SERVER_KEY;
  const hash = crypto.createHash('sha512')
    .update(`${notification.order_id}${notification.status_code}${notification.gross_amount}${serverKey}`)
    .digest('hex');
  
  if (hash !== notification.signature_key) {
    return res.status(403).json({ error: 'Invalid signature' });
  }
  
  // 2. Update transaction based on status
  if (notification.transaction_status === 'settlement') {
    await updateTransaction(notification.order_id, 'paid');
  } else if (notification.transaction_status === 'expire') {
    await updateTransaction(notification.order_id, 'cancelled');
  }
  
  res.status(200).json({ status: 'ok' });
}
```

---

## 10. BEST PRACTICES & CODING GUIDELINES

### 10.1 Query Optimization

#### ✅ DO: Use Efficient Queries

```javascript
// GOOD: Select only needed columns
const users = await db.query(
  'SELECT user_id, username, full_name, role FROM users WHERE is_active = TRUE'
);

// GOOD: Use pagination
const transactions = await db.query(
  'SELECT * FROM transactions ORDER BY entry_time DESC LIMIT ? OFFSET ?',
  [limit, offset]
);

// GOOD: Use JOIN instead of multiple queries
const result = await db.query(`
  SELECT t.*, v.license_plate, vt.type_name, u.full_name as officer_name
  FROM transactions t
  JOIN vehicles v ON t.vehicle_id = v.vehicle_id
  JOIN vehicle_types vt ON v.vehicle_type_id = vt.vehicle_type_id
  JOIN users u ON t.officer_id = u.user_id
  WHERE t.payment_status = 'paid'
  LIMIT 100
`);

// GOOD: Use indexes for WHERE clauses
CREATE INDEX idx_payment_status ON transactions(payment_status);
CREATE INDEX idx_entry_time ON transactions(entry_time);
```

#### ❌ DON'T: Inefficient Queries

```javascript
// BAD: Select all columns when not needed
const users = await db.query('SELECT * FROM users');

// BAD: No pagination for large datasets
const allTransactions = await db.query('SELECT * FROM transactions');

// BAD: N+1 query problem
const transactions = await db.query('SELECT * FROM transactions');
for (let t of transactions) {
  const vehicle = await db.query('SELECT * FROM vehicles WHERE vehicle_id = ?', [t.vehicle_id]);
}

// BAD: No index on frequently queried column
// Missing: CREATE INDEX idx_ticket ON transactions(ticket_number);
```

---

### 10.2 Array Usage

#### ✅ DO: Use Arrays Effectively

```javascript
// GOOD: Map array for transformation
const vehicleIds = vehicles.map(v => v.vehicle_id);

// GOOD: Filter array
const activeUsers = users.filter(u => u.is_active === true);

// GOOD: Reduce for aggregation
const totalRevenue = transactions.reduce((sum, t) => sum + t.total_amount, 0);

// GOOD: Find specific item
const admin = users.find(u => u.role === 'admin');

// GOOD: Use array methods for bulk operations
const userIds = [1, 2, 3, 4, 5];
const placeholders = userIds.map(() => '?').join(',');
const query = `SELECT * FROM users WHERE user_id IN (${placeholders})`;
await db.query(query, userIds);
```

#### ❌ DON'T: Inefficient Array Operations

```javascript
// BAD: Unnecessary loop
const ids = [];
for (let i = 0; i < vehicles.length; i++) {
  ids.push(vehicles[i].vehicle_id);
}
// Use: const ids = vehicles.map(v => v.vehicle_id);

// BAD: Multiple loops when one is enough
const activeUsers = [];
for (let user of users) {
  if (user.is_active) activeUsers.push(user);
}
const adminUsers = [];
for (let user of activeUsers) {
  if (user.role === 'admin') adminUsers.push(user);
}
// Use: const adminUsers = users.filter(u => u.is_active && u.role === 'admin');
```

---

### 10.3 Avoid Unnecessary Loops

#### ✅ DO: Optimize Loops

```javascript
// GOOD: Use database aggregation instead of loop
const stats = await db.query(`
  SELECT 
    DATE(entry_time) as date,
    COUNT(*) as total_vehicles,
    SUM(total_amount) as revenue
  FROM transactions
  WHERE payment_status = 'paid'
  GROUP BY DATE(entry_time)
`);

// GOOD: Use Map/Set for O(1) lookup
const userMap = new Map(users.map(u => [u.user_id, u]));
const user = userMap.get(userId); // O(1) instead of O(n)

// GOOD: Batch database operations
const values = vehicles.map(v => [v.license_plate, v.type_id, v.color]);
await db.query(
  'INSERT INTO vehicles (license_plate, vehicle_type_id, color) VALUES ?',
  [values]
);
```

#### ❌ DON'T: Unnecessary Loops

```javascript
// BAD: Loop to calculate sum (use reduce or SQL SUM)
let total = 0;
for (let t of transactions) {
  total += t.total_amount;
}

// BAD: Nested loops for searching (use Map)
for (let transaction of transactions) {
  for (let user of users) {
    if (user.user_id === transaction.officer_id) {
      transaction.officer_name = user.full_name;
    }
  }
}

// BAD: Multiple database queries in loop
for (let vehicle of vehicles) {
  await db.query('INSERT INTO vehicles VALUES (?)', [vehicle]);
}
```

---

### 10.4 Functions and Procedures

#### ✅ DO: Create Reusable Functions

```javascript
// GOOD: Utility function
function formatCurrency(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR'
  }).format(amount);
}

// GOOD: Service layer function
async function calculateParkingFee(vehicleTypeId, branchId, duration) {
  const rate = await db.query(
    'SELECT first_hour_rate, next_hour_rate FROM parking_rates WHERE vehicle_type_id = ? AND branch_id = ? ORDER BY effective_date DESC LIMIT 1',
    [vehicleTypeId, branchId]
  );
  
  if (!rate[0]) throw new Error('Rate not found');
  
  const { first_hour_rate, next_hour_rate } = rate[0];
  const hours = Math.max(Math.ceil(duration), 1); // Minimum 1 hour
  
  return hours === 1 
    ? first_hour_rate 
    : first_hour_rate + ((hours - 1) * next_hour_rate);
}

// GOOD: Middleware function
function validateRequest(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    next();
  };
}

// GOOD: MySQL Stored Procedure for complex logic
DELIMITER $$
CREATE PROCEDURE update_parking_occupancy(
  IN p_area_id INT,
  IN p_action ENUM('increment', 'decrement')
)
BEGIN
  IF p_action = 'increment' THEN
    UPDATE parking_areas 
    SET current_occupancy = current_occupancy + 1 
    WHERE area_id = p_area_id AND current_occupancy < capacity;
  ELSE
    UPDATE parking_areas 
    SET current_occupancy = GREATEST(current_occupancy - 1, 0) 
    WHERE area_id = p_area_id;
  END IF;
END$$
DELIMITER ;
```

---

### 10.5 Error Handling

#### ✅ DO: Comprehensive Error Handling

```javascript
// GOOD: Try-catch with specific error handling
async function createTransaction(vehicleData) {
  try {
    // Validate input
    if (!vehicleData.license_plate) {
      throw new ValidationError('License plate is required');
    }
    
    // Check parking availability
    const area = await checkAvailability(vehicleData.area_id);
    if (!area) {
      throw new BusinessError('No parking slot available');
    }
    
    // Create transaction
    const result = await db.query('INSERT INTO transactions SET ?', vehicleData);
    
    return { success: true, transaction_id: result.insertId };
    
  } catch (error) {
    if (error instanceof ValidationError) {
      throw error; // Re-throw validation errors
    } else if (error instanceof BusinessError) {
      throw error;
    } else {
      logger.error('Error creating transaction:', error);
      throw new Error('Failed to create transaction');
    }
  }
}

// GOOD: Global error handler middleware
app.use((error, req, res, next) => {
  logger.error('Error:', error);
  
  if (error instanceof ValidationError) {
    return res.status(400).json({ error: error.message });
  }
  
  if (error instanceof AuthenticationError) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  if (error instanceof BusinessError) {
    return res.status(422).json({ error: error.message });
  }
  
  res.status(500).json({ error: 'Internal server error' });
});
```

---

### 10.6 Code Structure and Naming

#### ✅ DO: Clean Code Principles

```javascript
// GOOD: Descriptive variable names
const totalParkingFee = calculateFee(duration, rate);
const activeUserCount = users.filter(u => u.is_active).length;

// GOOD: Function names describe action
async function validateUserCredentials(username, password) { }
async function generateTicketNumber(branchId) { }
async function sendPaymentNotification(transactionId) { }

// GOOD: Constants for magic numbers
const MINIMUM_PARKING_HOURS = 1;
const SESSION_TIMEOUT_MINUTES = 30;
const MAX_LOGIN_ATTEMPTS = 5;

// GOOD: Comments for complex logic
/**
 * Calculate parking fee based on duration and vehicle type
 * @param {number} duration - Duration in hours
 * @param {number} vehicleTypeId - Vehicle type ID
 * @param {number} branchId - Branch ID
 * @returns {Promise<number>} Total parking fee
 */
async function calculateParkingFee(duration, vehicleTypeId, branchId) {
  // Implementation
}
```

---

### 10.7 Security Best Practices

```javascript
// GOOD: Password hashing
const bcrypt = require('bcrypt');
const hashedPassword = await bcrypt.hash(password, 10);

// GOOD: Prepared statements (prevent SQL injection)
const result = await db.query(
  'SELECT * FROM users WHERE username = ? AND is_active = TRUE',
  [username]
);

// GOOD: JWT token with expiration
const token = jwt.sign(
  { user_id, username, role },
  process.env.JWT_SECRET,
  { expiresIn: '8h' }
);

// GOOD: Input validation
const schema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().min(8).required(),
  email: Joi.string().email().required()
});

// GOOD: Rate limiting
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);
```

---

## 11. STRUKTUR DATABASE SQL

### 11.1 Create Database

```sql
CREATE DATABASE parkir_app 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE parkir_app;
```

---

### 11.2 Create Tables

```sql
-- Table: branches
CREATE TABLE branches (
  branch_id INT AUTO_INCREMENT PRIMARY KEY,
  branch_name VARCHAR(100) NOT NULL,
  address TEXT,
  phone VARCHAR(20),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Table: users
CREATE TABLE users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  role ENUM('admin', 'petugas', 'owner') NOT NULL,
  branch_id INT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (branch_id) REFERENCES branches(branch_id) ON DELETE SET NULL,
  INDEX idx_username (username),
  INDEX idx_role (role),
  INDEX idx_branch (branch_id)
) ENGINE=InnoDB;

-- Table: parking_areas
CREATE TABLE parking_areas (
  area_id INT AUTO_INCREMENT PRIMARY KEY,
  branch_id INT NOT NULL,
  area_name VARCHAR(50) NOT NULL,
  capacity INT NOT NULL,
  current_occupancy INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (branch_id) REFERENCES branches(branch_id) ON DELETE CASCADE,
  INDEX idx_branch (branch_id),
  CHECK (current_occupancy >= 0),
  CHECK (current_occupancy <= capacity)
) ENGINE=InnoDB;

-- Table: vehicle_types
CREATE TABLE vehicle_types (
  vehicle_type_id INT AUTO_INCREMENT PRIMARY KEY,
  type_name VARCHAR(50) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Table: parking_rates
CREATE TABLE parking_rates (
  rate_id INT AUTO_INCREMENT PRIMARY KEY,
  branch_id INT NOT NULL,
  vehicle_type_id INT NOT NULL,
  first_hour_rate DECIMAL(10,2) NOT NULL,
  next_hour_rate DECIMAL(10,2) NOT NULL,
  effective_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (branch_id) REFERENCES branches(branch_id) ON DELETE CASCADE,
  FOREIGN KEY (vehicle_type_id) REFERENCES vehicle_types(vehicle_type_id) ON DELETE CASCADE,
  INDEX idx_branch_vehicle (branch_id, vehicle_type_id),
  INDEX idx_effective_date (effective_date),
  UNIQUE KEY unique_rate (branch_id, vehicle_type_id, effective_date)
) ENGINE=InnoDB;

-- Table: vehicles
CREATE TABLE vehicles (
  vehicle_id INT AUTO_INCREMENT PRIMARY KEY,
  license_plate VARCHAR(20) NOT NULL UNIQUE,
  vehicle_type_id INT NOT NULL,
  color VARCHAR(30),
  brand VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (vehicle_type_id) REFERENCES vehicle_types(vehicle_type_id),
  INDEX idx_license_plate (license_plate),
  INDEX idx_vehicle_type (vehicle_type_id)
) ENGINE=InnoDB;

-- Table: transactions
CREATE TABLE transactions (
  transaction_id INT AUTO_INCREMENT PRIMARY KEY,
  ticket_number VARCHAR(20) UNIQUE NOT NULL,
  vehicle_id INT NOT NULL,
  area_id INT NOT NULL,
  entry_time TIMESTAMP NOT NULL,
  exit_time TIMESTAMP NULL,
  duration_hours DECIMAL(5,2),
  total_amount DECIMAL(10,2),
  payment_method ENUM('cash', 'qris'),
  payment_status ENUM('pending', 'paid', 'cancelled') DEFAULT 'pending',
  officer_id INT,
  midtrans_order_id VARCHAR(100),
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
  INDEX idx_officer (officer_id)
) ENGINE=InnoDB;

-- Table: activity_logs
CREATE TABLE activity_logs (
  log_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  action VARCHAR(100) NOT NULL,
  table_name VARCHAR(50),
  record_id INT,
  description TEXT,
  ip_address VARCHAR(45),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL,
  INDEX idx_user_id (user_id),
  INDEX idx_created_at (created_at),
  INDEX idx_action (action)
) ENGINE=InnoDB;
```

---

### 11.3 Insert Sample Data

```sql
-- Insert vehicle types
INSERT INTO vehicle_types (type_name, description) VALUES
('Motor', 'Sepeda motor dan skuter'),
('Mobil', 'Mobil penumpang'),
('Bus/Truk', 'Bus, truk, dan kendaraan besar');

-- Insert branches
INSERT INTO branches (branch_name, address, phone) VALUES
('Cabang Pusat', 'Jl. Sudirman No. 123, Jakarta', '021-1234567'),
('Cabang Utara', 'Jl. Ahmad Yani No. 456, Jakarta', '021-7654321');

-- Insert parking areas
INSERT INTO parking_areas (branch_id, area_name, capacity, current_occupancy) VALUES
(1, 'Area A - Motor', 100, 0),
(1, 'Area B - Mobil', 50, 0),
(2, 'Area A - Motor', 80, 0),
(2, 'Area B - Mobil', 40, 0);

-- Insert parking rates
INSERT INTO parking_rates (branch_id, vehicle_type_id, first_hour_rate, next_hour_rate, effective_date) VALUES
-- Cabang Pusat
(1, 1, 2000.00, 1000.00, '2024-01-01'), -- Motor
(1, 2, 5000.00, 3000.00, '2024-01-01'), -- Mobil
(1, 3, 10000.00, 5000.00, '2024-01-01'), -- Bus/Truk
-- Cabang Utara
(2, 1, 2000.00, 1000.00, '2024-01-01'),
(2, 2, 5000.00, 3000.00, '2024-01-01'),
(2, 3, 10000.00, 5000.00, '2024-01-01');

-- Insert users (password: 'password123' - hashed with bcrypt)
INSERT INTO users (username, password, full_name, role, branch_id, is_active) VALUES
('admin1', '$2b$10$YourHashedPasswordHere', 'Admin Utama', 'admin', 1, TRUE),
('petugas1', '$2b$10$YourHashedPasswordHere', 'Petugas Satu', 'petugas', 1, TRUE),
('petugas2', '$2b$10$YourHashedPasswordHere', 'Petugas Dua', 'petugas', 2, TRUE),
('owner1', '$2b$10$YourHashedPasswordHere', 'Owner Bisnis', 'owner', NULL, TRUE);
```

---

### 11.4 Useful Queries

```sql
-- Get current parking occupancy by area
SELECT 
  pa.area_name,
  pa.capacity,
  pa.current_occupancy,
  ROUND((pa.current_occupancy / pa.capacity * 100), 2) as occupancy_percentage,
  b.branch_name
FROM parking_areas pa
JOIN branches b ON pa.branch_id = b.branch_id
ORDER BY b.branch_name, pa.area_name;

-- Get daily revenue report
SELECT 
  DATE(exit_time) as date,
  COUNT(*) as total_transactions,
  SUM(total_amount) as total_revenue,
  AVG(duration_hours) as avg_duration
FROM transactions
WHERE payment_status = 'paid'
  AND exit_time >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
GROUP BY DATE(exit_time)
ORDER BY date DESC;

-- Get active parking (not yet paid)
SELECT 
  t.ticket_number,
  v.license_plate,
  vt.type_name,
  t.entry_time,
  TIMESTAMPDIFF(HOUR, t.entry_time, NOW()) as current_duration,
  pa.area_name
FROM transactions t
JOIN vehicles v ON t.vehicle_id = v.vehicle_id
JOIN vehicle_types vt ON v.vehicle_type_id = vt.vehicle_type_id
JOIN parking_areas pa ON t.area_id = pa.area_id
WHERE t.payment_status = 'pending'
ORDER BY t.entry_time;

-- Get user activity summary
SELECT 
  u.full_name,
  u.role,
  COUNT(al.log_id) as total_activities,
  MAX(al.created_at) as last_activity
FROM users u
LEFT JOIN activity_logs al ON u.user_id = al.user_id
WHERE u.is_active = TRUE
GROUP BY u.user_id
ORDER BY total_activities DESC;

-- Get payment method statistics
SELECT 
  payment_method,
  COUNT(*) as transaction_count,
  SUM(total_amount) as total_amount,
  AVG(total_amount) as avg_amount
FROM transactions
WHERE payment_status = 'paid'
  AND exit_time >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
GROUP BY payment_method;
```

---

## 12. RENCANA IMPLEMENTASI

### 12.1 Timeline (11 Jam Total)

#### Fase 1: Setup & Planning (1 jam)
- ✅ Install dependencies (Node.js, MySQL, Next.js)
- ✅ Setup project structure
- ✅ Review requirements
- ✅ Create ERD dan DFD
- ✅ Design flowcharts

#### Fase 2: Database Setup (1 jam)
- ✅ Create database
- ✅ Create all tables with proper constraints
- ✅ Create indexes
- ✅ Insert sample data
- ✅ Test queries

#### Fase 3: Backend Development (3 jam)
- ✅ Setup Express server
- ✅ Configure database connection
- ✅ Create models (Sequelize/raw MySQL)
- ✅ Implement authentication (JWT)
- ✅ Create API routes:
  - Auth (login/logout)
  - Users CRUD
  - Branches CRUD
  - Areas CRUD
  - Rates CRUD
  - Vehicles CRUD
  - Transactions (in/out)
  - Statistics
  - Logs
- ✅ Midtrans integration
- ✅ Error handling middleware
- ✅ Logging

#### Fase 4: Frontend Development (4 jam)
- ✅ Setup Next.js with App Router
- ✅ Create layouts (admin, petugas, owner)
- ✅ Implement pages:
  - Login page
  - Admin dashboard
  - User management
  - Branch/Area management
  - Rate management
  - Vehicle management
  - Transaction entry (petugas)
  - Transaction exit & payment (petugas)
  - Statistics dashboard (owner)
  - Activity logs (admin)
- ✅ Form validation
- ✅ API integration
- ✅ Payment flow (QRIS QR code display)
- ✅ Receipt printing

#### Fase 5: Testing & Documentation (1.5 jam)
- ✅ Test all CRUD operations
- ✅ Test transaction flow
- ✅ Test payment integration
- ✅ Test role-based access
- ✅ Fix bugs
- ✅ Write documentation
- ✅ Create user manual

#### Fase 6: Final Review (0.5 jam)
- ✅ Code review
- ✅ Performance check
- ✅ Security audit
- ✅ Prepare presentation

---

### 12.2 Deliverables Checklist

#### ✅ Source Code
- [ ] Backend code (Node.js + Express)
- [ ] Frontend code (Next.js)
- [ ] .env.example file
- [ ] README.md dengan setup instructions

#### ✅ Database
- [ ] SQL file untuk create tables
- [ ] SQL file untuk sample data
- [ ] Database schema diagram

#### ✅ Documentation
- [ ] ERD (Entity Relationship Diagram)
- [ ] DFD Level 0 dan Level 1
- [ ] Flowchart (5 proses utama)
- [ ] API Documentation
- [ ] User Manual
- [ ] Technical Documentation

#### ✅ Testing
- [ ] Test results screenshot
- [ ] Bug list (jika ada)
- [ ] Performance test results

#### ✅ Presentation
- [ ] Demo video/screenshots
- [ ] Slide presentasi
- [ ] Laporan evaluasi

---

### 12.3 Post-Implementation Tasks

#### Bug Fixes
- Monitor error logs
- Fix critical bugs first
- Document all fixes

#### Future Enhancements
1. **Mobile App**: Develop mobile version untuk petugas
2. **Auto-gate Integration**: Integrasi dengan palang parkir otomatis
3. **License Plate Recognition**: OCR untuk auto-detect plat nomor
4. **SMS/Email Notification**: Notifikasi untuk customer
5. **Membership System**: Program member untuk pelanggan loyal
6. **Advanced Analytics**: Machine learning untuk predict demand

---

## 📚 REFERENSI

### Dokumentasi Teknologi
- **Next.js**: https://nextjs.org/docs
- **Express.js**: https://expressjs.com/
- **MySQL**: https://dev.mysql.com/doc/
- **Midtrans**: https://docs.midtrans.com/

### Best Practices
- **Clean Code**: Robert C. Martin
- **REST API Design**: https://restfulapi.net/
- **Database Design**: https://www.mysqltutorial.org/

### Tools
- **Postman**: API testing
- **MySQL Workbench**: Database management
- **VS Code**: Code editor
- **Git**: Version control

---

## 👨‍💻 AUTHOR

**Nama**: [Nama Siswa]  
**Kelas**: XII RPL  
**Sekolah**: SMK [Nama Sekolah]  
**Tanggal**: 11 Februari 2025

---

## 📝 NOTES

Dokumentasi ini dibuat sebagai panduan lengkap untuk pengembangan Aplikasi Parkir Desktop sesuai dengan requirements ujian praktik kejuruan. Semua flowchart, ERD, dan DFD harus digambarkan dalam bentuk diagram visual menggunakan tools seperti:

- **Draw.io**: https://app.diagrams.net/
- **Lucidchart**: https://www.lucidchart.com/
- **Microsoft Visio**: Untuk diagram professional

Pastikan untuk mengikuti best practices dan coding guidelines yang telah dijelaskan untuk menghasilkan aplikasi yang berkualitas tinggi.

---

**Good Luck! 🚀**
