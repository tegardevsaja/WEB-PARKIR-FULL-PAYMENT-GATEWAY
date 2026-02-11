# 📋 SOFTWARE REQUIREMENTS SPECIFICATION (SRS)

## APLIKASI PARKIR DESKTOP
**Versi 1.0**  
**SMK - Rekayasa Perangkat Lunak**  
**Ujian Praktik Kejuruan**

---

## DAFTAR ISI

1. [Pendahuluan](#1-pendahuluan)
2. [Deskripsi Umum](#2-deskripsi-umum)
3. [Kebutuhan Fungsional](#3-kebutuhan-fungsional)
4. [Kebutuhan Non-Fungsional](#4-kebutuhan-non-fungsional)
5. [Kebutuhan Interface](#5-kebutuhan-interface)
6. [Kebutuhan Data](#6-kebutuhan-data)
7. [Constraint dan Asumsi](#7-constraint-dan-asumsi)

---

## 1. PENDAHULUAN

### 1.1 Tujuan Dokumen

Dokumen ini menjelaskan spesifikasi kebutuhan perangkat lunak untuk **Aplikasi Parkir Desktop** yang akan dikembangkan sebagai bagian dari Ujian Praktik Kejuruan RPL.

### 1.2 Scope Project

**Aplikasi Parkir Desktop** adalah sistem manajemen parkir berbasis desktop yang dirancang untuk:
- Mengelola operasional parkir multi-cabang
- Memfasilitasi transaksi parkir (masuk/keluar)
- Mendukung pembayaran Cash dan QRIS
- Menyediakan laporan dan statistik bisnis
- Mencatat aktivitas untuk audit trail

### 1.3 Definisi dan Akronim

| Term | Definisi |
|------|----------|
| **SRS** | Software Requirements Specification |
| **CRUD** | Create, Read, Update, Delete |
| **QRIS** | Quick Response Code Indonesian Standard |
| **JWT** | JSON Web Token |
| **API** | Application Programming Interface |
| **ERD** | Entity Relationship Diagram |
| **DFD** | Data Flow Diagram |

### 1.4 Referensi

- Soal Ujian Praktik Kejuruan RPL (P2-SPK)
- Database Schema (database_schema.sql)
- Metodologi Waterfall Documentation

---

## 2. DESKRIPSI UMUM

### 2.1 Perspektif Produk

Aplikasi ini adalah sistem standalone desktop yang terintegrasi dengan:
- Database MySQL (lokal/server)
- Midtrans Payment Gateway (untuk QRIS)
- Printer (untuk cetak tiket dan struk)

### 2.2 Fungsi Produk

Fungsi utama aplikasi:
1. Autentikasi dan otorisasi multi-role
2. Manajemen data master (user, cabang, area, tarif, kendaraan)
3. Transaksi parkir (entry/exit)
4. Pembayaran (Cash/QRIS)
5. Pelaporan dan statistik
6. Activity logging

### 2.3 Karakteristik User

| Role | Karakteristik | Kebutuhan |
|------|---------------|-----------|
| **Admin** | IT literate, full access | CRUD semua data, monitoring |
| **Petugas** | Basic computer skills | Quick entry, simple UI |
| **Owner** | Business oriented | Dashboard, reports, analytics |

### 2.4 Constraint

- Waktu pengembangan: 11 jam
- Platform: Desktop (Windows/Linux/Mac)
- Database: MySQL
- Bahasa: Indonesia
- Internet: Required (untuk QRIS payment)

### 2.5 Asumsi dan Dependencies

**Asumsi:**
- User memiliki komputer dengan spesifikasi minimal
- Database MySQL sudah terinstall
- Koneksi internet stabil (untuk QRIS)
- Printer tersedia untuk cetak tiket/struk

**Dependencies:**
- Node.js runtime
- MySQL database server
- Midtrans API (untuk QRIS)
- Browser modern (untuk Next.js)

---

## 3. KEBUTUHAN FUNGSIONAL

### 3.1 Autentikasi dan Otorisasi

#### FR-001: Login
**Deskripsi:** User dapat login ke sistem dengan username dan password.

**Input:**
- Username (string, required)
- Password (string, required)

**Proses:**
1. Validasi input tidak kosong
2. Query database untuk cek username
3. Verify password dengan bcrypt
4. Cek status is_active
5. Generate JWT token
6. Log aktivitas login

**Output:**
- Success: Redirect ke dashboard sesuai role
- Error: Pesan error yang jelas

**Business Rules:**
- Password harus di-hash dengan bcrypt
- User non-aktif tidak bisa login
- Session timeout setelah 30 menit idle

#### FR-002: Logout
**Deskripsi:** User dapat logout dari sistem.

**Proses:**
1. Hapus JWT token
2. Clear session
3. Log aktivitas logout
4. Redirect ke halaman login


#### FR-003: Role-Based Access Control
**Deskripsi:** Sistem membatasi akses berdasarkan role user.

**Roles:**
- Admin: Full access
- Petugas: Transaction only
- Owner: Read-only reports

**Business Rules:**
- Setiap user hanya punya 1 role
- Role menentukan menu yang bisa diakses
- Unauthorized access ditolak dengan error 403

---

### 3.2 Manajemen User (Admin Only)

#### FR-004: Create User
**Input:**
- Username (unique, required)
- Password (required, min 8 char)
- Full Name (required)
- Role (admin/petugas/owner)
- Branch ID (required untuk petugas)
- Is Active (boolean, default true)

**Validasi:**
- Username harus unique
- Password minimal 8 karakter
- Role harus valid
- Branch ID harus exist (untuk petugas)

**Proses:**
1. Validasi input
2. Hash password dengan bcrypt
3. Insert ke database
4. Log aktivitas

#### FR-005: Read User
**Output:** List user dengan filter dan pagination

**Filter:**
- By role
- By branch
- By status (active/inactive)

**Pagination:** 20 records per page

#### FR-006: Update User
**Input:** User ID + field yang diupdate

**Validasi:**
- User ID harus exist
- Username tetap unique jika diubah
- Password di-hash jika diubah

#### FR-007: Delete User
**Proses:**
- Soft delete (set is_active = false)
- Tidak bisa delete user yang sedang login
- Log aktivitas

---

### 3.3 Manajemen Cabang (Admin Only)

#### FR-008: CRUD Cabang
**Fields:**
- Branch Name (required)
- Address (optional)
- Phone (optional)
- Is Active (boolean)

**Business Rules:**
- Branch name harus unique
- Tidak bisa delete cabang yang punya transaksi aktif
- Soft delete (set is_active = false)

---

### 3.4 Manajemen Area Parkir (Admin Only)

#### FR-009: CRUD Area Parkir
**Fields:**
- Branch ID (required)
- Area Name (required)
- Capacity (required, integer > 0)
- Current Occupancy (auto-calculated)

**Business Rules:**
- Area name unique per cabang
- Capacity tidak boleh < current occupancy
- Current occupancy auto-update saat entry/exit

---

### 3.5 Manajemen Tarif Parkir (Admin Only)

#### FR-010: CRUD Tarif Parkir
**Fields:**
- Branch ID (required)
- Vehicle Type ID (required)
- First Hour Rate (required, decimal)
- Next Hour Rate (required, decimal)
- Effective Date (required)

**Business Rules:**
- Kombinasi (branch, vehicle_type, effective_date) harus unique
- Rate harus > 0
- Effective date bisa di masa depan
- Tidak bisa delete tarif yang digunakan transaksi

---

### 3.6 Manajemen Kendaraan (Admin Only)

#### FR-011: CRUD Kendaraan
**Fields:**
- License Plate (required, unique)
- Vehicle Type ID (required)
- Color (optional)
- Brand (optional)

**Business Rules:**
- License plate harus unique
- Auto-uppercase untuk license plate
- Color dan brand bisa NULL

---

### 3.7 Transaksi Parkir - Entry (Petugas)

#### FR-012: Kendaraan Masuk
**Input:**
- License Plate (required)
- Vehicle Type ID (required)
- Color (optional)
- Brand (optional)

**Proses:**
1. Validasi input
2. Check slot parkir tersedia
3. Check/register kendaraan
4. Generate ticket number (TKT-YYYYMMDD-XXXX)
5. Insert transaction (status: pending)
6. Update occupancy +1
7. Log aktivitas
8. Print ticket

**Output:**
- Ticket number
- Entry time
- Vehicle info
- Area info

**Business Rules:**
- Tidak bisa masuk jika parkir penuh
- Ticket number harus unique
- Auto-register kendaraan baru
- Occupancy tidak boleh > capacity

---

### 3.8 Transaksi Parkir - Exit (Petugas)

#### FR-013: Kendaraan Keluar
**Input:**
- Ticket Number (required)

**Proses:**
1. Validasi ticket
2. Check status = pending
3. Calculate duration (TIMESTAMPDIFF)
4. Get tarif terbaru
5. Calculate total amount
6. Update transaction (exit_time, duration, amount)
7. Tampilkan summary untuk payment

**Output:**
- Vehicle info
- Entry time
- Exit time
- Duration (hours)
- Total amount
- Payment options (Cash/QRIS)

**Business Rules:**
- Minimum charge: 1 jam
- Duration dibulatkan ke atas (CEIL)
- Formula: first_hour + (duration-1) * next_hour
- Ticket harus valid dan pending

---

### 3.9 Pembayaran (Petugas)

#### FR-014: Pembayaran Cash
**Proses:**
1. Update payment_method = 'cash'
2. Update payment_status = 'paid'
3. Update occupancy -1
4. Log aktivitas
5. Print struk

**Output:** Struk pembayaran

#### FR-015: Pembayaran QRIS
**Proses:**
1. Generate order_id unique
2. Call Midtrans API
3. Receive QR code string
4. Update midtrans_order_id
5. Display QR code
6. Wait for webhook notification
7. Update payment_status = 'paid'
8. Update occupancy -1
9. Log aktivitas
10. Print struk

**Output:** 
- QR code untuk scan
- Struk pembayaran (setelah paid)

**Business Rules:**
- Timeout: 5 menit
- Auto-cancel jika timeout
- Verify signature dari webhook
- Idempotency check untuk duplicate notification

---

### 3.10 Laporan dan Statistik (Owner & Admin)

#### FR-016: Dashboard Statistik
**Output:**
- Total pendapatan (hari ini, bulan ini)
- Jumlah kendaraan (masuk/keluar)
- Occupancy rate (real-time)
- Peak hours
- Payment method distribution
- Revenue by vehicle type

**Filter:**
- Date range
- Branch
- Vehicle type

#### FR-017: Laporan Transaksi
**Output:** List transaksi dengan detail

**Filter:**
- Date range
- Branch
- Payment status
- Payment method
- Vehicle type

**Export:** PDF, Excel

#### FR-018: Laporan Pendapatan
**Output:** Revenue summary

**Breakdown:**
- Per hari
- Per cabang
- Per jenis kendaraan
- Per metode pembayaran

**Visualisasi:**
- Line chart: Revenue trend
- Bar chart: Revenue by branch
- Pie chart: Payment method distribution

---

### 3.11 Activity Logging (Admin)

#### FR-019: View Activity Logs
**Output:** List aktivitas dengan detail

**Info:**
- User yang melakukan
- Action (LOGIN, CREATE_USER, UPDATE_RATE, dll)
- Table name
- Record ID
- Description
- IP address
- Timestamp

**Filter:**
- Date range
- User
- Action type

---

## 4. KEBUTUHAN NON-FUNGSIONAL

### 4.1 Performance

#### NFR-001: Response Time
- Query database: < 1 detik
- Page load: < 2 detik
- Transaction processing: < 3 detik
- Report generation: < 5 detik

#### NFR-002: Throughput
- Support 100+ concurrent users
- Handle 1000+ transactions per day
- Database query optimization dengan indexes

#### NFR-003: Scalability
- Database design support multi-cabang
- Horizontal scaling ready
- Pagination untuk large datasets

### 4.2 Security

#### NFR-004: Authentication
- Password hashing dengan bcrypt (cost factor 10)
- JWT token untuk session management
- Session timeout: 30 menit idle
- Auto-logout setelah timeout

#### NFR-005: Authorization
- Role-based access control (RBAC)
- Principle of least privilege
- Unauthorized access blocked

#### NFR-006: Data Protection
- SQL injection prevention (prepared statements)
- XSS protection
- CSRF token untuk forms
- Input validation dan sanitization
- Sensitive data encrypted

#### NFR-007: Audit Trail
- Log semua aktivitas penting
- Log tidak bisa dihapus/diubah
- Timestamp untuk setiap log
- IP address tracking

### 4.3 Usability

#### NFR-008: User Interface
- User-friendly dan intuitive
- Consistent design language
- Responsive layout
- Clear error messages
- Loading indicators
- Success/error notifications

#### NFR-009: Accessibility
- Keyboard navigation support
- Keyboard shortcuts (F1/F2/F3)
- Clear labels dan instructions
- Readable fonts (min 12pt)
- High contrast colors

#### NFR-010: Learning Curve
- Minimal training required (< 1 jam)
- Inline help/tooltips
- User manual tersedia
- Demo mode untuk training

### 4.4 Reliability

#### NFR-011: Availability
- Uptime: 99% (8 jam downtime per bulan)
- Graceful degradation
- Error recovery mechanism

#### NFR-012: Error Handling
- Comprehensive error handling
- User-friendly error messages
- Error logging untuk debugging
- Transaction rollback on error

#### NFR-013: Data Integrity
- Foreign key constraints
- Check constraints
- Transaction ACID properties
- Backup dan restore mechanism

### 4.5 Maintainability

#### NFR-014: Code Quality
- Clean code principles
- Modular architecture
- Separation of concerns (MVC)
- DRY (Don't Repeat Yourself)
- SOLID principles

#### NFR-015: Documentation
- Inline code comments (JSDoc)
- API documentation
- Database schema documentation
- User manual
- Technical documentation

#### NFR-016: Testability
- Unit tests untuk business logic
- Integration tests untuk API
- Test coverage > 70%
- Automated testing

### 4.6 Portability

#### NFR-017: Platform Support
- Windows 10/11
- Linux (Ubuntu 20.04+)
- macOS (10.15+)

#### NFR-018: Browser Support
- Chrome (latest)
- Firefox (latest)
- Edge (latest)
- Safari (latest)

---

## 5. KEBUTUHAN INTERFACE

### 5.1 User Interface

#### UI-001: Login Page
- Form: Username, Password
- Button: Login
- Link: Forgot Password (optional)
- Responsive design

#### UI-002: Admin Dashboard
- Sidebar menu: User, Cabang, Area, Tarif, Kendaraan, Logs
- Main content: Statistics cards
- Header: User info, Logout button

#### UI-003: Petugas Transaction Page
- Quick entry form (Plat + Jenis)
- Toggle: Detail mode
- Active transactions list
- Slot availability indicator

#### UI-004: Owner Statistics Page
- Filter: Date range, Branch, Vehicle type
- Charts: Line, Bar, Pie
- Export button: PDF, Excel
- Real-time data

### 5.2 Hardware Interface

#### HW-001: Printer
- Support thermal printer
- Support A4 printer
- Print ticket (entry)
- Print struk (exit)

### 5.3 Software Interface

#### SW-001: Database (MySQL)
- Connection: TCP/IP
- Port: 3306 (default)
- Character set: utf8mb4
- Collation: utf8mb4_unicode_ci

#### SW-002: Midtrans API
- Endpoint: https://api.midtrans.com
- Method: POST /v2/charge
- Authentication: Server Key
- Format: JSON

---

## 6. KEBUTUHAN DATA

### 6.1 Database Tables

Total: 8 tabel utama

1. **branches** - Master cabang
2. **users** - User dengan multi-role
3. **parking_areas** - Area parkir per cabang
4. **vehicle_types** - Jenis kendaraan
5. **parking_rates** - Tarif parkir
6. **vehicles** - Registry kendaraan
7. **transactions** - Transaksi parkir
8. **activity_logs** - Log aktivitas

### 6.2 Data Volume (Estimasi)

| Table | Records/Year | Growth Rate |
|-------|--------------|-------------|
| branches | 10 | 10%/year |
| users | 50 | 20%/year |
| parking_areas | 30 | 10%/year |
| vehicle_types | 3 | Static |
| parking_rates | 100 | 20%/year |
| vehicles | 10,000 | 50%/year |
| transactions | 100,000 | 50%/year |
| activity_logs | 500,000 | 100%/year |

### 6.3 Data Retention

- transactions: 2 tahun (archive setelahnya)
- activity_logs: 1 tahun (archive setelahnya)
- vehicles: Permanent
- Master data: Permanent

### 6.4 Backup Strategy

- Full backup: Daily (midnight)
- Incremental backup: Every 6 hours
- Retention: 30 days
- Location: Local + Cloud

---

## 7. CONSTRAINT DAN ASUMSI

### 7.1 Constraint

#### Technical Constraints:
- Waktu pengembangan: 11 jam
- Database: MySQL only
- Platform: Desktop only (no mobile)
- Payment gateway: Midtrans only

#### Business Constraints:
- Budget: Minimal (ujian praktik)
- Resources: 1 developer
- Timeline: Fixed (tidak bisa extend)

#### Regulatory Constraints:
- Data privacy: Sesuai regulasi lokal
- Payment: Sesuai standar QRIS

### 7.2 Asumsi

#### Technical Assumptions:
- MySQL sudah terinstall
- Node.js sudah terinstall
- Internet connection available
- Printer available

#### Business Assumptions:
- User sudah familiar dengan komputer
- Petugas sudah ditraining
- Parkir buka 24/7
- Tarif tidak berubah sering

#### User Assumptions:
- Admin: IT literate
- Petugas: Basic computer skills
- Owner: Business oriented

---

## 8. ACCEPTANCE CRITERIA

### 8.1 Functional Acceptance

- [ ] Semua fitur sesuai FR berfungsi
- [ ] Login/logout works untuk semua role
- [ ] CRUD master data works
- [ ] Transaction entry/exit works
- [ ] Payment Cash works
- [ ] Payment QRIS works
- [ ] Reports dan statistics works
- [ ] Activity logging works

### 8.2 Non-Functional Acceptance

- [ ] Response time < 2 detik
- [ ] Password di-hash dengan bcrypt
- [ ] SQL injection prevented
- [ ] Error handling comprehensive
- [ ] UI user-friendly
- [ ] Documentation lengkap

### 8.3 Quality Acceptance

- [ ] No critical bugs
- [ ] Test coverage > 70%
- [ ] Code review passed
- [ ] UAT approved
- [ ] Performance test passed

---

## 9. APPROVAL

### 9.1 Document Approval

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Developer | [Nama Siswa] | _________ | _____ |
| Reviewer | [Nama Guru] | _________ | _____ |
| Approver | [Kepala Sekolah] | _________ | _____ |

### 9.2 Change History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-02-11 | [Nama] | Initial version |

---

## LAMPIRAN

### A. Use Case Diagram
[Lihat file terpisah: USE_CASE_DIAGRAM.png]

### B. User Stories
[Lihat file terpisah: USER_STORIES.md]

### C. Glossary
[Lihat file terpisah: GLOSSARY.md]

---

**END OF DOCUMENT**

---

**Catatan untuk Ujian:**

Dokumen SRS ini adalah deliverable dari **Fase 1: Requirements Analysis** dalam metodologi Waterfall. Dokumen ini menjadi foundation untuk fase-fase berikutnya (Design, Implementation, Testing, Deployment).

**Tips Presentasi:**
1. Tunjukkan dokumen ini sebagai bukti analisis requirements yang lengkap
2. Highlight FR dan NFR yang penting
3. Jelaskan bahwa semua requirement sudah diimplementasikan
4. Tunjukkan traceability: Requirement → Design → Implementation → Testing

**Good luck! 🎓**
