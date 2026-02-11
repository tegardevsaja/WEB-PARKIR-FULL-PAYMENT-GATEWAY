# 🔗 Frontend Routes - Aplikasi Parkir

## 📍 Base URL
```
http://localhost:3000
```

---

## 🔓 Public Routes (Tidak Perlu Login)

### Login Page
```
http://localhost:3000/login
```
- Halaman login untuk semua role
- Redirect otomatis ke dashboard sesuai role setelah login

---

## 🔐 Protected Routes (Perlu Login)

### 👨‍💼 ADMIN ROUTES

#### Dashboard Admin
```
http://localhost:3000/admin/dashboard
```
- Statistik: Total User, Cabang, Area, Kendaraan, Transaksi, Pendapatan
- Overview sistem

#### Manajemen User
```
http://localhost:3000/admin/users
```
- CRUD User (Create, Read, Update, Delete)
- Manage: Admin, Petugas, Owner
- Status: Active/Inactive

#### Manajemen Cabang
```
http://localhost:3000/admin/branches
```
- CRUD Cabang parkir
- Data: Nama, Alamat, Telepon, Status

#### Manajemen Area Parkir
```
http://localhost:3000/admin/areas
```
- CRUD Area parkir per cabang
- Data: Nama area, Kapasitas, Okupansi real-time

#### Manajemen Tarif Parkir
```
http://localhost:3000/admin/rates
```
- CRUD Tarif parkir
- Data: Cabang, Jenis kendaraan, Tarif jam 1, Tarif per jam, Tanggal berlaku

#### Log Aktivitas
```
http://localhost:3000/admin/logs
```
- View semua aktivitas sistem
- Filter: User, Action, Date range
- Audit trail

---

### 👮 PETUGAS ROUTES

#### Dashboard Petugas
```
http://localhost:3000/petugas/dashboard
```
- Statistik: Kendaraan aktif, Transaksi hari ini, Pendapatan
- Quick access ke Entry & Exit

#### Transaksi Masuk (Entry)
```
http://localhost:3000/petugas/entry
```
- Form input kendaraan masuk
- Input: Plat nomor, Jenis kendaraan
- Generate tiket otomatis
- Print tiket

#### Transaksi Keluar (Exit)
```
http://localhost:3000/petugas/exit
```
- Input nomor tiket
- Tampilkan info: Plat, Jenis, Waktu masuk/keluar, Durasi, Biaya
- Pilih metode pembayaran: Cash / QRIS
- Proses pembayaran
- Print struk

---

### 👔 OWNER ROUTES

#### Dashboard Owner
```
http://localhost:3000/owner/dashboard
```
- Statistik: Total pendapatan, Hari ini, Total transaksi, Rata-rata parkir
- Business metrics

#### Laporan
```
http://localhost:3000/owner/reports
```
- Laporan pendapatan detail
- Filter: Date range, Cabang, Jenis kendaraan
- Export PDF/Excel

#### Statistik
```
http://localhost:3000/owner/statistics
```
- Grafik interaktif (Recharts)
- Line chart: Pendapatan per hari
- Bar chart: Transaksi per cabang
- Pie chart: Distribusi jenis kendaraan
- Peak hours analysis

---

## 🎯 Route Access Matrix

| Route                          | Admin | Petugas | Owner |
|--------------------------------|-------|---------|-------|
| `/login`                       | ✅    | ✅      | ✅    |
| `/admin/dashboard`             | ✅    | ❌      | ❌    |
| `/admin/users`                 | ✅    | ❌      | ❌    |
| `/admin/branches`              | ✅    | ❌      | ❌    |
| `/admin/areas`                 | ✅    | ❌      | ❌    |
| `/admin/rates`                 | ✅    | ❌      | ❌    |
| `/admin/logs`                  | ✅    | ❌      | ❌    |
| `/petugas/dashboard`           | ❌    | ✅      | ❌    |
| `/petugas/entry`               | ❌    | ✅      | ❌    |
| `/petugas/exit`                | ❌    | ✅      | ❌    |
| `/owner/dashboard`             | ❌    | ❌      | ✅    |
| `/owner/reports`               | ✅    | ❌      | ✅    |
| `/owner/statistics`            | ✅    | ❌      | ✅    |

---

## 🔄 Auto Redirect Logic

### Setelah Login
```
Admin     → /admin/dashboard
Petugas   → /petugas/dashboard
Owner     → /owner/dashboard
```

### Akses Unauthorized Route
```
Redirect → /login
```

### Root Path (/)
```
/ → /login (jika belum login)
```

---

## 📋 Status Halaman

### ✅ Sudah Dibuat (Bisa Diakses)
- ✅ `/login` - Login page
- ✅ `/admin/dashboard` - Admin dashboard
- ✅ `/petugas/dashboard` - Petugas dashboard
- ✅ `/owner/dashboard` - Owner dashboard

### 🚧 Belum Dibuat (Coming Soon)
- 🚧 `/admin/users` - CRUD User
- 🚧 `/admin/branches` - CRUD Cabang
- 🚧 `/admin/areas` - CRUD Area Parkir
- 🚧 `/admin/rates` - CRUD Tarif Parkir
- 🚧 `/admin/logs` - Log Aktivitas
- 🚧 `/petugas/entry` - Form Entry
- 🚧 `/petugas/exit` - Form Exit & Payment
- 🚧 `/owner/reports` - Laporan
- 🚧 `/owner/statistics` - Statistik & Charts

---

## 🧪 Testing Routes

### 1. Test Login
```
1. Buka: http://localhost:3000
2. Auto redirect ke: http://localhost:3000/login
3. Login dengan: admin / password123
4. Redirect ke: http://localhost:3000/admin/dashboard
```

### 2. Test Role Access
```
# Login sebagai Admin
- Bisa akses: /admin/*
- Tidak bisa akses: /petugas/*, /owner/*

# Login sebagai Petugas
- Bisa akses: /petugas/*
- Tidak bisa akses: /admin/*, /owner/*

# Login sebagai Owner
- Bisa akses: /owner/*
- Tidak bisa akses: /admin/*, /petugas/*
```

### 3. Test Protected Routes
```
1. Logout dari aplikasi
2. Coba akses: http://localhost:3000/admin/dashboard
3. Akan redirect ke: http://localhost:3000/login
```

---

## 🎨 Sidebar Menu (Sesuai Role)

### Admin Menu
```
📊 Dashboard          → /admin/dashboard
👥 Manajemen User     → /admin/users
🏢 Manajemen Cabang   → /admin/branches
🅿️ Area Parkir        → /admin/areas
💰 Tarif Parkir       → /admin/rates
📄 Laporan            → /owner/reports
📊 Statistik          → /owner/statistics
⚙️ Log Aktivitas      → /admin/logs
🚪 Logout
```

### Petugas Menu
```
📊 Dashboard          → /petugas/dashboard
🚗 Transaksi Masuk    → /petugas/entry
🔄 Transaksi Keluar   → /petugas/exit
🚪 Logout
```

### Owner Menu
```
📊 Dashboard          → /owner/dashboard
📄 Laporan            → /owner/reports
📊 Statistik          → /owner/statistics
🚪 Logout
```

---

## 🔗 Quick Links (Copy & Paste)

### Admin
```
http://localhost:3000/login
http://localhost:3000/admin/dashboard
http://localhost:3000/admin/users
http://localhost:3000/admin/branches
http://localhost:3000/admin/areas
http://localhost:3000/admin/rates
http://localhost:3000/admin/logs
```

### Petugas
```
http://localhost:3000/login
http://localhost:3000/petugas/dashboard
http://localhost:3000/petugas/entry
http://localhost:3000/petugas/exit
```

### Owner
```
http://localhost:3000/login
http://localhost:3000/owner/dashboard
http://localhost:3000/owner/reports
http://localhost:3000/owner/statistics
```

---

## 📝 Notes

1. **Port Default:** 3000 (bisa diganti dengan `PORT=3001 npm run dev`)
2. **Backend API:** Harus running di `http://localhost:5000`
3. **Authentication:** Menggunakan JWT token di localStorage
4. **Session:** Auto-logout setelah 30 menit (sesuai JWT expiry)
5. **Responsive:** Semua halaman responsive untuk mobile & desktop

---

**Happy Testing! 🚀**
