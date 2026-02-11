# 🚀 Instalasi Frontend - Aplikasi Parkir

## Prerequisites

Pastikan sudah terinstall:
- Node.js 18+ ([Download](https://nodejs.org/))
- npm atau yarn
- Backend API sudah running di `http://localhost:5000`

## Langkah Instalasi

### 1. Install Dependencies

```bash
cd frontend
npm install
```

atau dengan yarn:

```bash
cd frontend
yarn install
```

### 2. Setup Environment Variables

File `.env.local` sudah tersedia dengan konfigurasi default:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=your_midtrans_client_key
```

Sesuaikan jika backend API berjalan di port lain.

### 3. Run Development Server

```bash
npm run dev
```

atau:

```bash
yarn dev
```

### 4. Buka Browser

Akses aplikasi di: [http://localhost:3000](http://localhost:3000)

## 🎯 Default Login Credentials

### Admin
- Username: `admin`
- Password: `password123`
- Akses: Full access (CRUD semua master data)

### Petugas
- Username: `petugas1`
- Password: `password123`
- Akses: Transaksi masuk/keluar, pembayaran

### Owner
- Username: `owner`
- Password: `password123`
- Akses: Laporan, statistik, dashboard

## 📁 Struktur Project

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── login/             # Halaman login
│   │   ├── admin/             # Dashboard & fitur admin
│   │   ├── petugas/           # Dashboard & fitur petugas
│   │   └── owner/             # Dashboard & fitur owner
│   ├── components/
│   │   ├── ui/                # Reusable UI components
│   │   └── layout/            # Layout components (Sidebar, etc)
│   ├── lib/                   # Utilities & configs
│   │   ├── axios.ts           # API client
│   │   └── utils.ts           # Helper functions
│   └── store/                 # Zustand state management
│       └── authStore.ts       # Authentication state
├── public/                    # Static files
├── .env.local                 # Environment variables
├── package.json               # Dependencies
└── tailwind.config.ts         # Tailwind CSS config
```

## 🎨 Fitur UI

### ✅ Sudah Dibuat
- Login page dengan gradient modern
- Sidebar responsive (mobile & desktop)
- Dashboard untuk 3 role (Admin, Petugas, Owner)
- UI Components:
  - Button (5 variants)
  - Input
  - Card
  - Select
  - Modal
  - Table
- State management dengan Zustand
- Axios interceptor untuk auth
- Responsive design (mobile-first)

### 🚧 Akan Dibuat Selanjutnya
- Halaman CRUD User (Admin)
- Halaman CRUD Cabang (Admin)
- Halaman CRUD Area Parkir (Admin)
- Halaman CRUD Tarif Parkir (Admin)
- Halaman Transaksi Masuk (Petugas)
- Halaman Transaksi Keluar (Petugas)
- Halaman Laporan (Owner)
- Halaman Statistik dengan Charts (Owner)
- Halaman Log Aktivitas (Admin)

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **HTTP Client:** Axios
- **Icons:** Lucide React
- **Charts:** Recharts (untuk statistik)
- **QR Code:** qrcode.react (untuk QRIS)
- **PDF:** jsPDF + html2canvas (untuk export)

## 📝 Scripts

```bash
# Development
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## 🎯 Next Steps

1. Jalankan backend API terlebih dahulu
2. Install dependencies frontend
3. Run development server
4. Login dengan credentials di atas
5. Explore dashboard sesuai role

## 🐛 Troubleshooting

### Port 3000 sudah digunakan
```bash
# Gunakan port lain
PORT=3001 npm run dev
```

### API connection error
- Pastikan backend running di `http://localhost:5000`
- Cek `.env.local` untuk URL yang benar
- Cek CORS di backend sudah enable

### Module not found
```bash
# Clear cache dan reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📞 Support

Jika ada masalah, cek:
1. Console browser (F12) untuk error
2. Terminal untuk error server
3. Network tab untuk API calls

---

**Happy Coding! 🚀**
