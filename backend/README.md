# LaVista Parking - Backend API

Backend API untuk sistem manajemen parkir LaVista menggunakan Node.js, Express, dan MySQL.

## 🚀 Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MySQL** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

## 📋 Prerequisites

- Node.js (v14 atau lebih baru)
- MySQL (v5.7 atau lebih baru)
- npm atau yarn

## 🛠️ Installation

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Setup Database

Buat database MySQL:

```sql
CREATE DATABASE parking_db;
```

Import schema dari file `database_schema.sql` di root project:

```bash
mysql -u root -p parking_db < ../database_schema.sql
```

### 3. Configure Environment

Copy file `.env.example` ke `.env`:

```bash
cp .env.example .env
```

Edit file `.env` sesuai konfigurasi database Anda:

```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=parking_db
DB_PORT=3306

JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=24h

FRONTEND_URL=http://localhost:3000
```

### 4. Seed Database

Jalankan seeder untuk mengisi data awal:

```bash
npm run seed
```

Atau:

```bash
node seed.js
```

## 🏃 Running the Server

### Development Mode (with auto-reload)

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

Server akan berjalan di `http://localhost:5000`

## 📚 API Endpoints

### Authentication

- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)
- `POST /api/auth/logout` - Logout user (protected)

### Users

- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/branch` - Get users by branch (Owner only)
- `POST /api/users` - Create user (Admin/Owner)
- `PUT /api/users/:id` - Update user (Admin/Owner)
- `DELETE /api/users/:id` - Delete user (Admin/Owner)

### Branches

- `GET /api/branches` - Get all branches
- `GET /api/branches/:id` - Get branch by ID
- `POST /api/branches` - Create branch (Admin only)
- `PUT /api/branches/:id` - Update branch (Admin only)
- `DELETE /api/branches/:id` - Delete branch (Admin only)

### Parking Areas

- `GET /api/areas` - Get all parking areas
- `POST /api/areas` - Create parking area (Admin only)
- `PUT /api/areas/:id` - Update parking area (Admin only)
- `DELETE /api/areas/:id` - Delete parking area (Admin only)

### Parking Rates

- `GET /api/rates` - Get all parking rates
- `GET /api/rates/active` - Get active rate for calculation
- `GET /api/rates/vehicle-types` - Get vehicle types
- `POST /api/rates` - Create parking rate (Admin only)
- `PUT /api/rates/:id` - Update parking rate (Admin only)
- `DELETE /api/rates/:id` - Delete parking rate (Admin only)

### Tickets (Entry/Exit)

- `POST /api/tickets/entry` - Create ticket (vehicle entry) (Petugas only)
- `GET /api/tickets/search` - Search ticket for exit (Petugas only)
- `POST /api/tickets/exit` - Process exit and payment (Petugas only)
- `GET /api/tickets/active` - Get active tickets

### Payments

- `GET /api/payments` - Get all payments (history)
- `GET /api/payments/:id` - Get payment by ID
- `GET /api/payments/stats` - Get payment statistics
- `GET /api/payments/daily-revenue` - Get daily revenue report
- `PUT /api/payments/:id/status` - Update payment status (Petugas/Admin)

### Activity Logs

- `GET /api/logs` - Get all activity logs (Admin only)
- `GET /api/logs/:id` - Get log by ID (Admin only)

### Dashboard

- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/branch-comparison` - Get branch comparison (Admin only)

## 🔐 Authentication

API menggunakan JWT (JSON Web Token) untuk authentication. Setelah login, token akan diberikan dan harus disertakan di header request:

```
Authorization: Bearer <token>
```

## 👥 Default Users

Setelah seeding, Anda dapat login dengan:

### Admin
- Username: `admin`
- Password: `admin123`
- Role: Super Admin (kelola semua)

### Owner
- Username: `owner1`
- Password: `owner123`
- Role: Owner Cabang Pusat

### Petugas
- Username: `petugas1`
- Password: `petugas123`
- Role: Petugas Cabang Pusat

## 📝 Response Format

### Success Response

```json
{
  "success": true,
  "message": "Success message",
  "data": {}
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error message"
}
```

## 🔧 Development

### Project Structure

```
backend/
├── config/
│   └── database.js          # Database configuration
├── controllers/
│   ├── authController.js    # Authentication logic
│   ├── userController.js    # User management
│   ├── branchController.js  # Branch management
│   ├── areaController.js    # Parking area management
│   ├── rateController.js    # Parking rate management
│   ├── ticketController.js  # Ticket (entry/exit) logic
│   ├── paymentController.js # Payment processing
│   ├── logController.js     # Activity logs
│   └── dashboardController.js # Dashboard statistics
├── middleware/
│   └── auth.js              # Authentication middleware
├── routes/
│   ├── auth.js              # Auth routes
│   ├── users.js             # User routes
│   ├── branches.js          # Branch routes
│   ├── areas.js             # Area routes
│   ├── rates.js             # Rate routes
│   ├── tickets.js           # Ticket routes
│   ├── payments.js          # Payment routes
│   ├── logs.js              # Log routes
│   └── dashboard.js         # Dashboard routes
├── .env                     # Environment variables
├── .env.example             # Environment template
├── package.json             # Dependencies
├── seed.js                  # Database seeder
├── server.js                # Main server file
└── README.md                # This file
```

## 🐛 Troubleshooting

### Database Connection Error

Pastikan MySQL berjalan dan kredensial di `.env` benar.

### Port Already in Use

Ubah PORT di file `.env` ke port lain (misalnya 5001).

### CORS Error

Pastikan `FRONTEND_URL` di `.env` sesuai dengan URL frontend Anda.

## 📄 License

ISC
