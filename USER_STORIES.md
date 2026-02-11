# 📖 USER STORIES

## Aplikasi Parkir Desktop

User stories untuk semua stakeholder dalam format standar Agile.

---

## FORMAT

```
As a [role]
I want to [action]
So that [benefit]

Acceptance Criteria:
- [ ] Criteria 1
- [ ] Criteria 2
```

---

## ADMIN USER STORIES

### US-001: Login sebagai Admin
```
As an Admin
I want to login dengan username dan password
So that saya bisa mengakses sistem dan mengelola data

Acceptance Criteria:
- [ ] Form login tersedia dengan field username dan password
- [ ] Password di-hash dengan bcrypt
- [ ] Setelah login sukses, redirect ke admin dashboard
- [ ] Error message jelas jika login gagal
- [ ] Session timeout setelah 30 menit idle
```

### US-002: Mengelola User
```
As an Admin
I want to create, read, update, dan delete user
So that saya bisa mengontrol siapa yang bisa akses sistem

Acceptance Criteria:
- [ ] Bisa tambah user baru dengan role (admin/petugas/owner)
- [ ] Bisa lihat list semua user dengan filter
- [ ] Bisa edit data user existing
- [ ] Bisa deactivate user (soft delete)
- [ ] Username harus unique
- [ ] Password minimal 8 karakter
```

### US-003: Mengelola Cabang
```
As an Admin
I want to manage data cabang parkir
So that sistem bisa support multi-cabang

Acceptance Criteria:
- [ ] Bisa tambah cabang baru
- [ ] Bisa edit data cabang
- [ ] Bisa deactivate cabang
- [ ] Branch name harus unique
- [ ] Tidak bisa delete cabang yang punya transaksi aktif
```

### US-004: Mengelola Area Parkir
```
As an Admin
I want to manage area parkir per cabang
So that sistem bisa track kapasitas dan okupansi

Acceptance Criteria:
- [ ] Bisa tambah area baru per cabang
- [ ] Bisa set kapasitas area
- [ ] Bisa lihat current occupancy real-time
- [ ] Capacity tidak boleh < current occupancy
- [ ] Area name unique per cabang
```

### US-005: Mengelola Tarif Parkir
```
As an Admin
I want to set dan update tarif parkir
So that tarif bisa disesuaikan dengan kebijakan bisnis

Acceptance Criteria:
- [ ] Bisa set tarif per jenis kendaraan per cabang
- [ ] Tarif jam pertama dan jam berikutnya terpisah
- [ ] Bisa set effective date untuk tarif baru
- [ ] Tarif harus > 0
- [ ] Tidak bisa delete tarif yang digunakan transaksi
```

### US-006: Melihat Activity Logs
```
As an Admin
I want to view semua aktivitas user
So that saya bisa monitor dan audit sistem

Acceptance Criteria:
- [ ] Bisa lihat list semua aktivitas
- [ ] Info: user, action, timestamp, IP address
- [ ] Bisa filter by date range, user, action type
- [ ] Log tidak bisa dihapus/diubah
- [ ] Pagination untuk large datasets
```

---

## PETUGAS USER STORIES

### US-007: Login sebagai Petugas
```
As a Petugas
I want to login dengan username dan password
So that saya bisa melakukan transaksi parkir

Acceptance Criteria:
- [ ] Form login tersedia
- [ ] Setelah login sukses, redirect ke transaction page
- [ ] Hanya bisa akses fitur transaksi (tidak bisa CRUD master data)
```

### US-008: Input Kendaraan Masuk (Quick Mode)
```
As a Petugas
I want to input kendaraan masuk dengan cepat
So that tidak ada antrian panjang

Acceptance Criteria:
- [ ] Form hanya 2 field: Plat Nomor + Jenis Kendaraan
- [ ] Auto-uppercase untuk plat nomor
- [ ] Dropdown jenis: Motor/Mobil/Bus
- [ ] Keyboard shortcuts (F1/F2/F3)
- [ ] Auto-focus ke plat nomor setelah submit
- [ ] Total waktu < 10 detik per kendaraan
```

### US-009: Input Kendaraan Masuk (Detail Mode)
```
As a Petugas
I want to input data kendaraan lengkap
So that data lebih akurat untuk identifikasi

Acceptance Criteria:
- [ ] Toggle untuk switch ke detail mode
- [ ] Field tambahan: Warna, Merk (optional)
- [ ] Semua field dari quick mode tetap ada
- [ ] Bisa switch kembali ke quick mode
```

### US-010: Generate Ticket
```
As a Petugas
I want sistem auto-generate ticket number
So that setiap kendaraan punya identifikasi unique

Acceptance Criteria:
- [ ] Format: TKT-YYYYMMDD-XXXX
- [ ] Ticket number unique
- [ ] Auto-increment per hari
- [ ] Print ticket otomatis setelah entry
```

### US-011: Check Slot Parkir
```
As a Petugas
I want to lihat slot parkir tersedia
So that saya tahu apakah masih bisa terima kendaraan

Acceptance Criteria:
- [ ] Display: "Slot Tersedia: X/Y"
- [ ] Real-time update
- [ ] Error message jika parkir penuh
- [ ] Tidak bisa input jika penuh
```

### US-012: Proses Kendaraan Keluar
```
As a Petugas
I want to proses kendaraan keluar dengan scan ticket
So that customer bisa bayar dan keluar

Acceptance Criteria:
- [ ] Input ticket number
- [ ] Sistem auto-calculate durasi dan biaya
- [ ] Display summary: plat, jenis, masuk, keluar, durasi, biaya
- [ ] Minimum charge: 1 jam
- [ ] Duration dibulatkan ke atas
```

### US-013: Pembayaran Cash
```
As a Petugas
I want to proses pembayaran cash
So that customer bisa bayar tunai

Acceptance Criteria:
- [ ] Button "CASH" tersedia
- [ ] Instant update status ke "paid"
- [ ] Update occupancy -1
- [ ] Print struk otomatis
- [ ] Total waktu < 10 detik
```

### US-014: Pembayaran QRIS
```
As a Petugas
I want to proses pembayaran QRIS
So that customer bisa bayar digital

Acceptance Criteria:
- [ ] Button "QRIS" tersedia
- [ ] Generate QR code via Midtrans
- [ ] Display QR code untuk customer scan
- [ ] Wait for payment confirmation
- [ ] Timeout: 5 menit
- [ ] Auto-cancel jika timeout
- [ ] Print struk setelah paid
```

### US-015: Print Struk
```
As a Petugas
I want to print struk pembayaran
So that customer punya bukti bayar

Acceptance Criteria:
- [ ] Struk berisi: ticket, plat, jenis, masuk, keluar, durasi, biaya, metode
- [ ] Format rapi dan readable
- [ ] Support thermal printer dan A4
- [ ] Auto-print setelah payment sukses
```

---

## OWNER USER STORIES

### US-016: Login sebagai Owner
```
As an Owner
I want to login dengan username dan password
So that saya bisa lihat laporan dan statistik bisnis

Acceptance Criteria:
- [ ] Form login tersedia
- [ ] Setelah login sukses, redirect ke statistics dashboard
- [ ] Hanya bisa view (tidak bisa edit/delete)
```

### US-017: View Dashboard Statistik
```
As an Owner
I want to lihat dashboard dengan key metrics
So that saya bisa monitor performa bisnis

Acceptance Criteria:
- [ ] Display: Total pendapatan (hari ini, bulan ini)
- [ ] Display: Jumlah kendaraan (masuk/keluar)
- [ ] Display: Occupancy rate (real-time)
- [ ] Display: Peak hours
- [ ] Display: Payment method distribution
- [ ] Real-time data
```

### US-018: Filter Laporan
```
As an Owner
I want to filter laporan by date range, cabang, jenis kendaraan
So that saya bisa analisis data spesifik

Acceptance Criteria:
- [ ] Filter: Date range (default: bulan ini)
- [ ] Filter: Cabang (default: semua)
- [ ] Filter: Jenis kendaraan (default: semua)
- [ ] Apply filter dengan button
- [ ] Clear filter dengan button
```

### US-019: View Revenue Trend
```
As an Owner
I want to lihat trend pendapatan dalam chart
So that saya bisa lihat growth/decline

Acceptance Criteria:
- [ ] Line chart: Pendapatan per hari
- [ ] X-axis: Tanggal
- [ ] Y-axis: Rupiah
- [ ] Tooltip: Detail per hari
- [ ] Responsive chart
```

### US-020: View Revenue Breakdown
```
As an Owner
I want to lihat breakdown pendapatan
So that saya tahu kontribusi per kategori

Acceptance Criteria:
- [ ] Bar chart: Revenue by branch
- [ ] Bar chart: Revenue by vehicle type
- [ ] Pie chart: Payment method distribution
- [ ] Percentage dan nominal
```

### US-021: Export Report
```
As an Owner
I want to export laporan ke PDF/Excel
So that saya bisa share atau present

Acceptance Criteria:
- [ ] Button "Export PDF"
- [ ] Button "Export Excel"
- [ ] File include: Data + charts
- [ ] Filename: Report_YYYYMMDD.pdf/xlsx
- [ ] Auto-download setelah generate
```

### US-022: Compare Performance
```
As an Owner
I want to compare performance antar cabang
So that saya bisa identify cabang terbaik/terburuk

Acceptance Criteria:
- [ ] Table: Revenue per cabang
- [ ] Table: Jumlah kendaraan per cabang
- [ ] Table: Occupancy rate per cabang
- [ ] Sortable columns
- [ ] Highlight top performer
```

---

## SYSTEM USER STORIES

### US-023: Auto-Register Kendaraan
```
As a System
I want to auto-register kendaraan baru
So that petugas tidak perlu manual register

Acceptance Criteria:
- [ ] Check kendaraan exist by license plate
- [ ] Jika tidak exist, auto-insert ke vehicles table
- [ ] Jika exist, gunakan vehicle_id existing
- [ ] Seamless untuk petugas (tidak perlu tahu)
```

### US-024: Real-time Occupancy Update
```
As a System
I want to update occupancy real-time
So that data selalu akurat

Acceptance Criteria:
- [ ] Occupancy +1 saat kendaraan masuk
- [ ] Occupancy -1 saat kendaraan keluar (paid)
- [ ] Check constraint: occupancy <= capacity
- [ ] Transaction rollback jika error
```

### US-025: Auto-Calculate Parking Fee
```
As a System
I want to auto-calculate biaya parkir
So that tidak ada human error

Acceptance Criteria:
- [ ] Calculate duration: TIMESTAMPDIFF(HOUR, entry, exit)
- [ ] Minimum: 1 jam
- [ ] Round up: CEIL(duration)
- [ ] Get tarif terbaru by effective_date
- [ ] Formula: first_hour + (duration-1) * next_hour
- [ ] Accurate calculation
```

### US-026: Activity Logging
```
As a System
I want to log semua aktivitas penting
So that ada audit trail

Acceptance Criteria:
- [ ] Log: LOGIN, LOGOUT, CREATE, UPDATE, DELETE
- [ ] Info: user_id, action, table_name, record_id, description, IP, timestamp
- [ ] Auto-log (tidak perlu manual)
- [ ] Log tidak bisa dihapus/diubah
```

### US-027: Session Management
```
As a System
I want to manage user session dengan JWT
So that authentication secure

Acceptance Criteria:
- [ ] Generate JWT token saat login
- [ ] Token include: user_id, username, role
- [ ] Token expire: 30 menit
- [ ] Auto-logout saat expire
- [ ] Refresh token jika ada activity
```

---

## PRIORITY MATRIX

| Priority | User Stories | Reason |
|----------|--------------|--------|
| **P0 (Must Have)** | US-001, US-007, US-008, US-012, US-013 | Core functionality |
| **P1 (Should Have)** | US-002, US-005, US-014, US-017 | Important features |
| **P2 (Nice to Have)** | US-009, US-021, US-022 | Enhancement |
| **P3 (Future)** | Advanced analytics, Mobile app | Post-MVP |

---

## STORY POINTS ESTIMATION

| User Story | Story Points | Complexity |
|------------|--------------|------------|
| US-001 | 3 | Medium |
| US-002 | 5 | High |
| US-008 | 2 | Low |
| US-012 | 5 | High |
| US-013 | 2 | Low |
| US-014 | 8 | Very High |
| US-017 | 5 | High |
| US-021 | 3 | Medium |

**Total Story Points:** ~50 points

---

## ACCEPTANCE TESTING CHECKLIST

### For Each User Story:
- [ ] Functionality works as described
- [ ] All acceptance criteria met
- [ ] No critical bugs
- [ ] Performance acceptable
- [ ] UI/UX user-friendly
- [ ] Error handling proper
- [ ] Documentation updated

---

**Note:** User stories ini adalah bagian dari Requirements Analysis (Fase 1 Waterfall). Setiap story akan di-implement di Fase 3 dan di-test di Fase 4.

**Good luck! 🎓**
