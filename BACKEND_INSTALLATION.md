# 🚀 Backend Installation Guide - LaVista Parking

Panduan lengkap instalasi dan setup backend API untuk sistem parkir LaVista.

## 📋 Prerequisites

Pastikan sudah terinstall:
- **Node.js** v14+ ([Download](https://nodejs.org/))
- **MySQL** v5.7+ ([Download](https://dev.mysql.com/downloads/mysql/))
- **npm** atau **yarn** (included with Node.js)

## 🛠️ Step-by-Step Installation

### Step 1: Setup Database

1. Buka MySQL Command Line atau MySQL Workbench

2. Buat database baru:
```sql
CREATE DATABASE parking_db;
```

3. Import schema database:
```bash
# Dari root project
mysql -u root -p parking_db < database_schema.sql
```

Atau copy-paste isi file `database_schema.sql` ke MySQL Workbench dan execute.

### Step 2: Install Dependencies

```bash
cd backend
npm install
```

Dependencies yang akan terinstall:
- express - Web framework
- mysql2 - MySQL driver
- cors - CORS middleware
- dotenv - Environment variables
- bcryptjs - Password hashing
- jsonwebtoken - JWT authentication
- express-validator - Input validation
- nodemon - Auto-reload (dev only)

### Step 3: Configure Environment

1. Copy file environment template:
```bash
cp .env.example .env
```

2. Edit file `.env` sesuai konfigurasi Anda:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=parking_db
DB_PORT=3306

# JWT Configuration
JWT_SECRET=parking_secret_key_2025_lavista
JWT_EXPIRES_IN=24h

# CORS Configuration
FRONTEND_URL=http://localhost:3000
```

**Penting:** Ganti `DB_PASSWORD` dengan password MySQL Anda!

### Step 4: Seed Database (Data Awal)

Jalankan seeder untuk mengisi data awal:

```bash
npm run seed
```

Atau:

```bash
node seed.js
```

Output yang diharapkan:
```
🌱 Starting database seeding...

📦 Seeding vehicle types...
✅ Vehicle types seeded

🏢 Seeding branches...
✅ Branches seeded

👥 Seeding users...
✅ Users seeded
   - Admin: admin / admin123
   - Owner: owner1 / owner123
   - Petugas: petugas1 / petugas123

🅿️  Seeding parking areas...
✅ Parking areas seeded

💰 Seeding parking rates...
✅ Parking rates seeded

🎉 Database seeding completed successfully!
```

### Step 5: Run Server

**Development mode** (dengan auto-reload):
```bash
npm run dev
```

**Production mode**:
```bash
npm start
```

Output yang diharapkan:
```
=================================
🚀 LaVista Parking API Server
=================================
📡 Server running on port 5000
🌍 Environment: development
🔗 API URL: http://localhost:5000
🎯 Frontend URL: http://localhost:3000
=================================
✅ Database connected successfully
```

### Step 6: Test API

Buka browser atau Postman dan akses:

**Health Check:**
```
http://localhost:5000/api/health
```

Response:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2025-02-11T..."
}
```

**Test Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

## 🔐 Default Login Credentials

Setelah seeding, gunakan kredensial berikut:

### Admin (Super Admin)
```
Username: admin
Password: admin123
Role: Kelola semua sistem
```

### Owner (Pemilik Cabang)
```
Username: owner1
Password: owner123
Role: Kelola cabang Pusat
Branch: Cabang Pusat
```

### Petugas (Staff Operasional)
```
Username: petugas1
Password: petugas123
Role: Entry/Exit kendaraan
Branch: Cabang Pusat
```

## 📚 API Endpoints

Lihat dokumentasi lengkap di: `backend/API_DOCUMENTATION.md`

Endpoint utama:
- `/api/auth/login` - Login
- `/api/users` - User management
- `/api/branches` - Branch management
- `/api/areas` - Parking area management
- `/api/rates` - Parking rate management
- `/api/tickets/entry` - Vehicle entry
- `/api/tickets/exit` - Vehicle exit & payment
- `/api/payments` - Payment history
- `/api/dashboard/stats` - Dashboard statistics

## 🔧 Troubleshooting

### Error: Database connection failed

**Solusi:**
1. Pastikan MySQL service berjalan
2. Cek kredensial di file `.env`
3. Pastikan database `parking_db` sudah dibuat

```bash
# Windows - Check MySQL service
net start MySQL80

# Linux/Mac - Check MySQL service
sudo systemctl status mysql
```

### Error: Port 5000 already in use

**Solusi:**
Ubah PORT di file `.env`:
```env
PORT=5001
```

### Error: Cannot find module

**Solusi:**
Install ulang dependencies:
```bash
rm -rf node_modules
npm install
```

### Error: CORS policy

**Solusi:**
Pastikan `FRONTEND_URL` di `.env` sesuai dengan URL frontend:
```env
FRONTEND_URL=http://localhost:3000
```

### Error: JWT token invalid

**Solusi:**
1. Login ulang untuk mendapatkan token baru
2. Pastikan token disertakan di header:
```
Authorization: Bearer <your_token>
```

## 📁 Project Structure

```
backend/
├── config/
│   └── database.js          # Database connection
├── controllers/
│   ├── authController.js    # Login/logout logic
│   ├── userController.js    # User CRUD
│   ├── branchController.js  # Branch CRUD
│   ├── areaController.js    # Area CRUD
│   ├── rateController.js    # Rate CRUD
│   ├── ticketController.js  # Entry/Exit logic
│   ├── paymentController.js # Payment processing
│   ├── logController.js     # Activity logs
│   └── dashboardController.js # Statistics
├── middleware/
│   └── auth.js              # JWT verification
├── routes/
│   ├── auth.js
│   ├── users.js
│   ├── branches.js
│   ├── areas.js
│   ├── rates.js
│   ├── tickets.js
│   ├── payments.js
│   ├── logs.js
│   └── dashboard.js
├── .env                     # Environment config
├── .env.example             # Environment template
├── .gitignore
├── package.json
├── seed.js                  # Database seeder
├── server.js                # Main server
├── README.md
└── API_DOCUMENTATION.md     # API docs
```

## 🧪 Testing API

### Menggunakan Postman

1. Import collection atau buat request manual
2. Login untuk mendapatkan token
3. Copy token ke Authorization header
4. Test endpoint lainnya

### Menggunakan curl

```bash
# 1. Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# 2. Copy token dari response

# 3. Get users (ganti <TOKEN> dengan token Anda)
curl -X GET http://localhost:5000/api/users \
  -H "Authorization: Bearer <TOKEN>"

# 4. Vehicle Entry
curl -X POST http://localhost:5000/api/tickets/entry \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "license_plate": "B 1234 ABC",
    "vehicle_type_id": 1,
    "area_id": 1
  }'
```

## 🔄 Development Workflow

1. **Start MySQL** - Pastikan MySQL berjalan
2. **Run Backend** - `npm run dev`
3. **Run Frontend** - Di terminal lain: `cd frontend && npm run dev`
4. **Test** - Akses http://localhost:3000

## 📝 Notes

- Backend berjalan di port **5000**
- Frontend berjalan di port **3000**
- Database menggunakan **MySQL**
- Authentication menggunakan **JWT**
- Password di-hash dengan **bcrypt**
- CORS enabled untuk frontend

## 🆘 Need Help?

Jika mengalami masalah:
1. Cek log error di terminal
2. Pastikan semua prerequisites terinstall
3. Cek file `.env` sudah benar
4. Pastikan database sudah di-seed
5. Restart server setelah perubahan config

## ✅ Checklist Installation

- [ ] Node.js terinstall
- [ ] MySQL terinstall dan berjalan
- [ ] Database `parking_db` sudah dibuat
- [ ] Schema database sudah di-import
- [ ] Dependencies sudah di-install (`npm install`)
- [ ] File `.env` sudah dikonfigurasi
- [ ] Database sudah di-seed (`npm run seed`)
- [ ] Server berjalan tanpa error (`npm run dev`)
- [ ] Health check endpoint berhasil diakses
- [ ] Login berhasil dan mendapat token

Jika semua checklist ✅, backend siap digunakan! 🎉
