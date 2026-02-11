# 🔐 Login Credentials

All users have the same password: `password123`

## Admin Account
- **Username**: `admin`
- **Password**: `password123`
- **Role**: Admin (Super Administrator)
- **Branch**: Cabang Pusat
- **Access**: Full system access, all branches

## Owner Accounts

### Owner 1 - Cabang Pusat
- **Username**: `owner`
- **Password**: `password123`
- **Role**: Owner
- **Branch**: Cabang Pusat
- **Access**: View reports, manage petugas in their branch

## Petugas Accounts

### Petugas 1 - Cabang Pusat
- **Username**: `petugas1`
- **Password**: `password123`
- **Role**: Petugas
- **Branch**: Cabang Pusat
- **Access**: Entry, exit, kasir operations

### Petugas 2 - Cabang Pusat
- **Username**: `petugas2`
- **Password**: `password123`
- **Role**: Petugas
- **Branch**: Cabang Pusat

### Petugas 3 - Cabang Utara
- **Username**: `petugas3`
- **Password**: `password123`
- **Role**: Petugas
- **Branch**: Cabang Utara

---

## Quick Test

```bash
# Test login from command line
cd backend
npm run test-login
```

## Frontend Login

1. Start frontend: `cd frontend && npm run dev`
2. Open: http://localhost:3000
3. Login with any credentials above
4. You'll be redirected to the appropriate dashboard based on role

---

**Note**: These are development credentials. In production, use strong, unique passwords for each user.
