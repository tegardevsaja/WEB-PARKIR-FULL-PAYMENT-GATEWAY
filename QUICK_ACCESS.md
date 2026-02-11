# 🚀 Quick Access - Frontend UI (No Auth)

## ⚡ Akses Langsung (Tanpa Login)

Auth sudah di-disable untuk development. Semua halaman bisa diakses langsung!

---

## 🔗 Direct Links

### 📊 Dashboard Pages

#### Admin Dashboard
```
http://localhost:3000/admin/dashboard
```
- 6 stat cards dengan dummy data
- Total User: 15
- Total Cabang: 3
- Total Area: 7
- Total Kendaraan: 245
- Transaksi Hari Ini: 87
- Pendapatan: Rp 2.450.000

#### Petugas Dashboard
```
http://localhost:3000/petugas/dashboard
```
- 3 stat cards dengan dummy data
- Kendaraan Aktif: 12
- Transaksi Hari Ini: 45
- Pendapatan: Rp 850.000
- 2 action cards (Entry & Exit)

#### Owner Dashboard
```
http://localhost:3000/owner/dashboard
```
- 4 stat cards dengan dummy data
- Total Pendapatan: Rp 15.750.000
- Hari Ini: Rp 2.450.000
- Total Transaksi: 1.250
- Rata-rata Parkir: 2.5 jam

---

## 🎨 Role Switcher

Di sidebar ada **Role Switcher** (kotak kuning) untuk ganti role dengan mudah:

```
┌─────────────────────────┐
│ Switch Role (Dev)       │
│ [Admin] [Petugas] [Owner]│
└─────────────────────────┘
```

Klik button untuk switch role dan menu akan berubah otomatis!

---

## 📱 Testing UI

### 1. Test Admin Role
```
1. Buka: http://localhost:3000/admin/dashboard
2. Klik "Admin" di role switcher
3. Menu akan show: Users, Cabang, Area, Tarif, Laporan, Statistik, Logs
```

### 2. Test Petugas Role
```
1. Buka: http://localhost:3000/petugas/dashboard
2. Klik "Petugas" di role switcher
3. Menu akan show: Transaksi Masuk, Transaksi Keluar
```

### 3. Test Owner Role
```
1. Buka: http://localhost:3000/owner/dashboard
2. Klik "Owner" di role switcher
3. Menu akan show: Laporan, Statistik
```

---

## 🎯 Features yang Sudah Aktif

### ✅ Working Features
- ✅ Sidebar responsive (mobile + desktop)
- ✅ Role switcher untuk testing
- ✅ Dummy data di semua dashboard
- ✅ Smooth transitions & animations
- ✅ Modern UI dengan gradients
- ✅ Icons dari Lucide React
- ✅ Responsive grid layouts
- ✅ Hover effects
- ✅ Loading states (500ms delay)

### 🚧 Coming Soon (Belum Dibuat)
- 🚧 CRUD pages (Users, Cabang, Area, Tarif)
- 🚧 Form Entry/Exit
- 🚧 Payment QRIS
- 🚧 Reports & Charts
- 🚧 Log Aktivitas

---

## 💡 Tips Development

### Ganti Role Cepat
Gunakan role switcher di sidebar (kotak kuning) untuk testing menu berbeda

### Test Responsive
- Desktop: Resize browser
- Mobile: Buka DevTools (F12) → Toggle device toolbar (Ctrl+Shift+M)

### Lihat Dummy Data
Semua stats menggunakan dummy data dengan delay 500ms untuk simulasi loading

---

## 🎨 UI Components Available

### Button Variants
```tsx
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="success">Success</Button>
<Button variant="danger">Danger</Button>
<Button variant="ghost">Ghost</Button>
```

### Card
```tsx
<Card className="p-6">
  <h2>Title</h2>
  <p>Content</p>
</Card>
```

### Input
```tsx
<Input
  label="Label"
  placeholder="Placeholder"
  error="Error message"
/>
```

### Select
```tsx
<Select
  label="Label"
  options={[
    { value: "1", label: "Option 1" },
    { value: "2", label: "Option 2" },
  ]}
/>
```

### Modal
```tsx
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Modal Title"
  size="md"
>
  Content here
</Modal>
```

### Table
```tsx
<Table>
  <TableHead>
    <TableRow>
      <TableHeader>Column 1</TableHeader>
    </TableRow>
  </TableHead>
  <TableBody>
    <TableRow>
      <TableCell>Data 1</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

---

## 🔧 Development Mode

### Current Setup
- ✅ Auth disabled
- ✅ Dummy user auto-set (default: Admin)
- ✅ All routes accessible
- ✅ No API calls (dummy data only)
- ✅ Role switcher enabled

### To Enable Auth Later
1. Restore `DashboardLayout.tsx` auth check
2. Remove dummy data from dashboards
3. Enable API calls
4. Remove role switcher from Sidebar

---

## 📋 Next Steps

Sekarang fokus buat halaman-halaman ini dengan UI yang bagus:

1. **Admin Pages**
   - `/admin/users` - Table + CRUD modal
   - `/admin/branches` - Table + CRUD modal
   - `/admin/areas` - Table + CRUD modal
   - `/admin/rates` - Table + CRUD modal
   - `/admin/logs` - Table dengan filter

2. **Petugas Pages**
   - `/petugas/entry` - Form input kendaraan
   - `/petugas/exit` - Form + payment + QR

3. **Owner Pages**
   - `/owner/reports` - Table + filter + export
   - `/owner/statistics` - Charts (Recharts)

---

## 🚀 Quick Start

```bash
# 1. Jalankan dev server
cd frontend
npm run dev

# 2. Buka browser
http://localhost:3000/admin/dashboard

# 3. Test role switcher
Klik button Admin/Petugas/Owner di sidebar

# 4. Explore UI
Navigate ke halaman lain via sidebar menu
```

---

**Happy UI Development! 🎨**

No auth, no API, just pure UI focus! 🚀
