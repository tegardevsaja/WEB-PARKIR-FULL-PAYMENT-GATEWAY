# 📋 REQUIREMENTS - APLIKASI PARKIR

## Kebutuhan Sistem (Simple & Clear)

---

## 🖥️ TEKNOLOGI STACK

### FRONTEND
- **Framework:** Next.js 14
- **UI Library:** Shadcn/UI + Tailwind CSS
- **State Management:** Zustand
- **Form Handling:** React Hook Form + Zod
- **HTTP Client:** Axios
- **Charts:** Recharts
- **QR Code Display:** qrcode.react
- **PDF Generation:** jsPDF + html2canvas

### BACKEND
- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Database Driver:** mysql2
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** bcrypt
- **Validation:** express-validator
- **CORS:** cors
- **Environment:** dotenv

### DATABASE
- **DBMS:** MySQL 8.0+
- **Character Set:** utf8mb4
- **Collation:** utf8mb4_unicode_ci

### PAYMENT GATEWAY
- **Provider:** Midtrans
- **Method:** QRIS (QR Code Indonesian Standard)
- **SDK:** midtrans-client (Node.js)
- **API:** Snap API / Core API

### ADDITIONAL TOOLS
- **Version Control:** Git
- **Package Manager:** npm / yarn
- **Code Editor:** VS Code
- **API Testing:** Postman / Thunder Client
- **Database Tool:** MySQL Workbench / phpMyAdmin

---

## 💻 SPESIFIKASI MINIMUM

### Development Machine
- **OS:** Windows 10/11, Linux, atau macOS
- **RAM:** 8 GB (recommended 16 GB)
- **Storage:** 10 GB free space
- **Processor:** Intel i5 / AMD Ryzen 5 atau lebih tinggi
- **Internet:** Stable connection (untuk QRIS)

### Production Server
- **OS:** Linux (Ubuntu 20.04+ recommended)
- **RAM:** 4 GB minimum
- **Storage:** 20 GB
- **Database:** MySQL 8.0+
- **Node.js:** v18+

---

## 📦 NPM PACKAGES

### Frontend Dependencies
```json
{
  "next": "^14.0.0",
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "axios": "^1.6.0",
  "zustand": "^4.4.0",
  "react-hook-form": "^7.48.0",
  "zod": "^3.22.0",
  "@shadcn/ui": "latest",
  "tailwindcss": "^3.4.0",
  "recharts": "^2.10.0",
  "qrcode.react": "^3.1.0",
  "jspdf": "^2.5.0",
  "html2canvas": "^1.4.0",
  "date-fns": "^2.30.0"
}
```

### Backend Dependencies
```json
{
  "express": "^4.18.0",
  "mysql2": "^3.6.0",
  "jsonwebtoken": "^9.0.0",
  "bcrypt": "^5.1.0",
  "express-validator": "^7.0.0",
  "cors": "^2.8.5",
  "dotenv": "^16.3.0",
  "midtrans-client": "^1.3.0"
}
```

---

## 🔧 ENVIRONMENT VARIABLES

### Backend (.env)
```env
# Server
PORT=5000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=parkir_app

# JWT
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=30m

# Midtrans
MIDTRANS_SERVER_KEY=your_midtrans_server_key
MIDTRANS_CLIENT_KEY=your_midtrans_client_key
MIDTRANS_IS_PRODUCTION=false
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=your_midtrans_client_key
```

---

## 🎯 FITUR UTAMA

### 1. AUTENTIKASI
- Login dengan username & password
- Password hashing dengan bcrypt
- JWT token untuk session
- Role-based access (admin/petugas/owner)
- Auto-logout setelah 30 menit

### 2. MANAJEMEN MASTER DATA (Admin)
- CRUD User
- CRUD Cabang
- CRUD Area Parkir
- CRUD Tarif Parkir
- CRUD Kendaraan

### 3. TRANSAKSI PARKIR (Petugas)
- Input kendaraan masuk (Quick mode: Plat + Jenis)
- Generate ticket otomatis
- Scan ticket untuk keluar
- Auto-calculate biaya parkir
- Pembayaran Cash
- Pembayaran QRIS (Midtrans)
- Print struk

### 4. LAPORAN & STATISTIK (Owner)
- Dashboard dengan key metrics
- Filter by date range, cabang, jenis kendaraan
- Charts: Line, Bar, Pie
- Export to PDF/Excel
- Real-time occupancy

### 5. ACTIVITY LOGGING (Admin)
- Log semua aktivitas penting
- Filter by user, action, date
- Audit trail

---

## 🔐 KEAMANAN

### Authentication
- Password hashing: bcrypt (cost factor 10)
- JWT token dengan expiry
- Session timeout: 30 menit

### Authorization
- Role-based access control (RBAC)
- Middleware untuk protect routes
- Unauthorized access blocked

### Data Protection
- SQL injection prevention (prepared statements)
- XSS protection
- Input validation & sanitization
- HTTPS untuk production

---

## 📊 DATABASE

### Tables (8)
1. branches (cabang)
2. users (pengguna)
3. parking_areas (area parkir)
4. vehicle_types (jenis kendaraan)
5. parking_rates (tarif parkir)
6. vehicles (kendaraan)
7. transactions (transaksi)
8. activity_logs (log aktivitas)

### Features
- Foreign key constraints
- Indexes untuk performance
- Stored procedures
- Views
- Triggers
- Sample data

---

## 💳 PAYMENT INTEGRATION

### Midtrans QRIS Flow
1. Generate order_id unique
2. Call Midtrans API: `/v2/charge`
3. Receive QR code string
4. Display QR code untuk customer scan
5. Wait for webhook notification
6. Update payment status
7. Print struk

### Midtrans Configuration
- **Environment:** Sandbox (testing) / Production
- **Server Key:** Required untuk API calls
- **Client Key:** Required untuk frontend
- **Webhook URL:** `/api/payment/notification`

---

## 🖨️ PRINTER SUPPORT

### Thermal Printer
- Support 58mm / 80mm
- ESC/POS commands
- USB / Bluetooth connection

### A4 Printer
- Standard office printer
- PDF format
- Print via browser

---

## 📱 BROWSER SUPPORT

- Chrome (latest)
- Firefox (latest)
- Edge (latest)
- Safari (latest)

---

## 🚀 DEPLOYMENT

### Development
```bash
# Backend
cd backend
npm install
npm run dev

# Frontend
cd frontend
npm install
npm run dev
```

### Production
```bash
# Backend
npm run build
npm start

# Frontend
npm run build
npm start
```

---

## 📝 DOKUMENTASI

### Yang Harus Ada
- [x] README.md
- [x] API Documentation
- [x] Database Schema
- [x] ERD
- [x] Flowchart
- [x] User Manual
- [x] Installation Guide

---

## ✅ CHECKLIST REQUIREMENTS

### Software
- [x] Node.js 18+ installed
- [x] MySQL 8.0+ installed
- [x] Git installed
- [x] VS Code installed

### Accounts
- [x] Midtrans account (sandbox)
- [x] GitHub account (optional)

### Knowledge
- [x] JavaScript/TypeScript
- [x] React/Next.js basics
- [x] Node.js/Express basics
- [x] MySQL/SQL basics
- [x] REST API concepts

---

## 🎓 UNTUK UJIAN

### Yang Harus Disiapkan
1. Laptop dengan spesifikasi minimum
2. Software sudah terinstall
3. Midtrans sandbox account
4. Sample data di database
5. Dokumentasi lengkap
6. Presentasi slides

### Yang Harus Bisa Dijelaskan
1. Teknologi stack yang digunakan
2. Alasan pemilihan teknologi
3. Cara kerja payment gateway
4. Database design
5. Security measures
6. Error handling

---

## 📞 SUPPORT & RESOURCES

### Documentation
- Next.js: https://nextjs.org/docs
- Express.js: https://expressjs.com/
- MySQL: https://dev.mysql.com/doc/
- Midtrans: https://docs.midtrans.com/

### Community
- Stack Overflow
- GitHub Issues
- Discord communities

---

## 🎯 KESIMPULAN

**Stack Utama:**
- Frontend: Next.js + Tailwind
- Backend: Node.js + Express
- Database: MySQL
- Payment: Midtrans QRIS

**Fitur Utama:**
- Multi-role authentication
- CRUD master data
- Transaction management
- Dual payment (Cash/QRIS)
- Reports & statistics

**Keamanan:**
- Password hashing (bcrypt)
- JWT authentication
- SQL injection prevention
- Input validation

**Simple, Modern, dan Production-Ready! 🚀**

---

**Good luck dengan ujian! 🎓**
