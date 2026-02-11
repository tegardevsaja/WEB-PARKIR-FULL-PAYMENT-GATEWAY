# 🚀 Quick Start Guide - LaVista Parking

Panduan cepat untuk menjalankan aplikasi parkir LaVista (Frontend + Backend).

## ⚡ Super Quick Start (5 Menit)

### Step 1: Setup Backend (2 menit)

```bash
# 1. Masuk ke folder backend
cd backend

# 2. Install dependencies
npm install

# 3. Test koneksi database
npm run test-db

# 4. Setup database (jika belum ada)
npm run setup

# 5. Seed data awal
npm run seed

# 6. Jalankan server
npm run dev
```

✅ Backend berjalan di: `http://localhost:5000`

### Step 2: Setup Frontend (2 menit)

```bash
# 1. Buka terminal baru, masuk ke folder frontend
cd frontend

# 2. Install dependencies
npm install

# 3. Jalankan development server
npm run dev
```

✅ Frontend berjalan di: `http://localhost:3000`

### Step 3: Login & Test (1 menit)

1. Buka browser: `http://localhost:3000`
2. Login dengan:
   - Username: `admin`
   - Password: `admin123`
3. Explore dashboard!

## 🔐 Login Credentials

```
Admin (Full Access):
  Username: admin
  Password: admin123

Owner (Cabang Pusat):
  Username: owner1
  Password: owner123

Petugas (Cabang Pusat):
  Username: petugas1
  Password: petugas123
```

## 📋 Prerequisites

Pastikan sudah terinstall:
- ✅ Node.js v14+ ([Download](https://nodejs.org/))
- ✅ MySQL v5.7+ ([Download](https://dev.mysql.com/downloads/mysql/))
- ✅ npm (included with Node.js)

## 🐛 Troubleshooting

### Backend tidak bisa connect ke database?

```bash
# Test koneksi
cd backend
npm run test-db
```

Jika gagal:
1. Pastikan MySQL berjalan
2. Check username/password di `backend/.env`
3. Buat database manual:
   ```sql
   CREATE DATABASE parking_db;
   ```

### Port 5000 sudah dipakai?

Edit `backend/.env`:
```env
PORT=5001
```

Lalu edit `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5001/api
```

### Frontend tidak bisa connect ke backend?

1. Pastikan backend berjalan di port 5000
2. Check `frontend/.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```
3. Restart frontend

### Login gagal?

1. Pastikan backend berjalan
2. Pastikan database sudah di-seed: `npm run seed`
3. Check console browser untuk error
4. Check terminal backend untuk error

## 📁 Project Structure

```
.
├── backend/              # Backend API (Express + MySQL)
│   ├── controllers/      # Business logic
│   ├── routes/          # API endpoints
│   ├── config/          # Database config
│   ├── middleware/      # Auth middleware
│   ├── .env             # Environment variables
│   ├── server.js        # Main server
│   └── seed.js          # Database seeder
│
├── frontend/            # Frontend (Next.js 14)
│   ├── src/
│   │   ├── app/        # Pages & routes
│   │   ├── components/ # UI components
│   │   ├── services/   # API services
│   │   ├── store/      # Zustand store
│   │   └── lib/        # Utilities
│   └── .env.local      # Environment variables
│
└── database_schema.sql  # Database schema
```

## 🎯 What's Next?

1. ✅ Login berhasil
2. ✅ Explore dashboard
3. ✅ Test CRUD operations
4. ✅ Test entry/exit flow
5. ✅ Check payment history
6. ✅ View statistics

## 📚 Documentation

- **Backend API**: `backend/API_DOCUMENTATION.md`
- **Backend Setup**: `BACKEND_INSTALLATION.md`
- **Integration**: `INTEGRATION_COMPLETE.md`
- **Frontend**: `FRONTEND_SUMMARY.md`

## 🆘 Need Help?

### Check Logs

**Backend logs:**
```bash
cd backend
npm run dev
# Check terminal output
```

**Frontend logs:**
```bash
cd frontend
npm run dev
# Check terminal output
# Also check browser console (F12)
```

### Common Commands

```bash
# Backend
cd backend
npm run test-db    # Test database connection
npm run setup      # Create database
npm run seed       # Seed data
npm run dev        # Run server

# Frontend
cd frontend
npm run dev        # Run development server
npm run build      # Build for production
npm start          # Run production build
```

## ✅ Success Indicators

Aplikasi berjalan dengan baik jika:
- ✅ Backend terminal shows: "Server running on port 5000"
- ✅ Backend terminal shows: "Database connected successfully"
- ✅ Frontend terminal shows: "Ready on http://localhost:3000"
- ✅ Login berhasil dan redirect ke dashboard
- ✅ Data muncul di dashboard (tidak kosong)
- ✅ Tidak ada error di console browser

## 🎉 You're Ready!

Aplikasi sudah berjalan! Sekarang bisa:
- Manage users, branches, areas, rates
- Process vehicle entry/exit
- View payment history
- Check statistics & reports

Happy coding! 🚀
