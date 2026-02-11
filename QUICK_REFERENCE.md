# 🚀 Quick Reference Card

## Start Servers

```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

## Login

**URL**: http://localhost:3000

| Role | Username | Password | Access |
|------|----------|----------|--------|
| Admin | `admin` | `password123` | Full system |
| Owner | `owner` | `password123` | Branch reports |
| Petugas | `petugas1` | `password123` | Entry/Exit/Kasir |

## API Endpoints

**Base**: http://localhost:5000/api

```bash
# Login
POST /auth/login
Body: { "username": "admin", "password": "password123" }

# Get Dashboard Stats
GET /dashboard/stats
Headers: { "Authorization": "Bearer <token>" }

# Vehicle Entry
POST /tickets/entry
Body: { "license_plate": "B1234ABC", "vehicle_type_id": 1, "area_id": 1 }

# Vehicle Exit
POST /tickets/exit
Body: { "ticket_id": 1, "payment_method": "cash" }
```

## Database

```bash
# Connect to database
mysql -u root parkir_app

# View users
SELECT username, role, branch_id FROM users;

# View active tickets
SELECT * FROM tickets WHERE exit_time IS NULL;

# View today's revenue
SELECT SUM(amount) FROM payments 
WHERE payment_status='paid' AND DATE(payment_time)=CURDATE();
```

## Common Tasks

### Reset Password
```bash
cd backend
node -e "const bcrypt=require('bcryptjs'); bcrypt.hash('newpass',10).then(h=>console.log(h))"
# Copy hash and update in database
```

### Clear Database
```bash
mysql -u root -e "DROP DATABASE parkir_app; SOURCE database_schema.sql"
```

### View Logs
```bash
# Backend logs
cd backend
npm start

# Check activity logs
mysql -u root parkir_app -e "SELECT * FROM activity_logs ORDER BY created_at DESC LIMIT 10"
```

## File Locations

| What | Where |
|------|-------|
| Backend API | `backend/server.js` |
| Database Config | `backend/.env` |
| Controllers | `backend/controllers/` |
| Frontend Pages | `frontend/src/app/` |
| API Services | `frontend/src/services/` |
| Auth Store | `frontend/src/store/authStore.ts` |
| Database Schema | `database_schema.sql` |

## Port Numbers

- Backend API: `5000`
- Frontend: `3000` (or `3001`)
- MySQL: `3306`

## Environment Variables

### Backend (.env)
```
PORT=5000
DB_NAME=parkir_app
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
JWT_SECRET=parking_secret_key_2025_lavista
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

**Need help?** Check [SETUP_COMPLETE.md](SETUP_COMPLETE.md) for detailed documentation.
