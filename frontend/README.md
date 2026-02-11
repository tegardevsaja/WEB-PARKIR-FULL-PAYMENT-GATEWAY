# Aplikasi Parkir - Frontend

Frontend aplikasi parkir menggunakan Next.js 14, TypeScript, dan Tailwind CSS.

## Tech Stack

- **Framework:** Next.js 14
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **HTTP Client:** Axios
- **Charts:** Recharts
- **QR Code:** qrcode.react
- **PDF:** jsPDF + html2canvas

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Setup environment variables:
```bash
cp .env.local.example .env.local
```

3. Run development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000)

## Default Credentials

- **Admin:** admin / password123
- **Petugas:** petugas1 / password123
- **Owner:** owner / password123

## Features

### Admin
- Dashboard dengan statistik
- Manajemen User (CRUD)
- Manajemen Cabang (CRUD)
- Manajemen Area Parkir (CRUD)
- Manajemen Tarif Parkir (CRUD)
- Log Aktivitas

### Petugas
- Dashboard transaksi
- Input kendaraan masuk
- Proses kendaraan keluar
- Pembayaran (Cash/QRIS)
- Cetak tiket & struk

### Owner
- Dashboard statistik
- Laporan pendapatan
- Grafik & charts
- Export PDF

## Project Structure

```
frontend/
├── src/
│   ├── app/              # Next.js App Router
│   ├── components/       # Reusable components
│   ├── lib/             # Utilities & configs
│   └── store/           # Zustand stores
├── public/              # Static files
└── package.json
```
