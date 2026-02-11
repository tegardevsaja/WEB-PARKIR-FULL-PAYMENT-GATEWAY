# 🔧 Quick Fix - Login Error 500

## Langkah Cepat (5 Menit)

### Step 1: Stop Semua Server
```bash
# Tekan Ctrl+C di semua terminal yang running
```

### Step 2: Test Database Connection
```bash
cd backend
npm run test-db
```

**Jika gagal:**
```bash
# Pastikan MySQL running
# Windows: net start MySQL80

# Buat database manual
mysql -u root -p
CREATE DATABASE parking_db;
exit

# Import schema
mysql -u root -p parking_db < ../database_schema.sql

# Atau gunakan setup script
npm run setup
```

### Step 3: Seed Database
```bash
cd backend
npm run seed
```

**Expected output:**
```
✅ Vehicle types seeded
✅ Branches seeded
✅ Users seeded
   - Admin: admin / admin123
   - Owner: owner1 / owner123
   - Petugas: petugas1 / petugas123
✅ Parking areas seeded
✅ Parking rates seeded
🎉 Database seeding completed successfully!
```

### Step 4: Test Login Endpoint
```bash
cd backend
npm run test-login
```

**Expected output:**
```
✅ Server is running
✅ Login successful!
Response: {
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "...",
    "user": { ... }
  }
}
```

### Step 5: Start Backend
```bash
cd backend
npm run dev
```

**Expected output:**
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

### Step 6: Start Frontend (Terminal Baru)
```bash
cd frontend
npm run dev
```

### Step 7: Test Login
1. Buka: `http://localhost:3000/login`
2. Login: `admin` / `admin123`
3. Should redirect to dashboard ✅

## Jika Masih Error

### Error: "Database connection failed"

**Check `.env` file:**
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password_here  # ⚠️ Ganti dengan password MySQL Anda
DB_NAME=parking_db
DB_PORT=3306
```

**Test connection:**
```bash
mysql -u root -p
# Masukkan password
# Jika berhasil, berarti credentials benar
```

### Error: "Unknown database 'parking_db'"

**Solution:**
```bash
cd backend
npm run setup
```

### Error: "User not found" atau "Invalid password"

**Solution:**
```bash
cd backend
npm run seed
```

### Error: "Port 5000 already in use"

**Solution:**
```bash
# Windows - Find and kill process
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F

# Or change port in backend/.env
PORT=5001

# Then update frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:5001/api
```

### Error: "CORS policy blocked"

**Check backend/.env:**
```env
FRONTEND_URL=http://localhost:3000
```

**Restart backend after changing.**

## Complete Reset (Nuclear Option)

If nothing works, complete reset:

```bash
# 1. Stop all servers (Ctrl+C)

# 2. Drop and recreate database
mysql -u root -p
DROP DATABASE IF EXISTS parking_db;
CREATE DATABASE parking_db;
exit

# 3. Setup from scratch
cd backend
npm run setup
npm run seed

# 4. Test
npm run test-db
npm run test-login

# 5. Start servers
npm run dev

# In new terminal
cd frontend
npm run dev
```

## Verification Checklist

Run these commands to verify everything:

```bash
# 1. Database connection
cd backend
npm run test-db
# Should show: ✅ All tests passed!

# 2. Login endpoint
npm run test-login
# Should show: ✅ Login successful!

# 3. Backend running
npm run dev
# Should show: ✅ Database connected successfully

# 4. Frontend running (new terminal)
cd frontend
npm run dev
# Should show: Ready on http://localhost:3000

# 5. Browser test
# Open: http://localhost:3000/login
# Login: admin / admin123
# Should redirect to dashboard
```

## Common Mistakes

❌ **Forgot to seed database**
```bash
npm run seed
```

❌ **Wrong password in .env**
```env
DB_PASSWORD=your_actual_mysql_password
```

❌ **Backend not running**
```bash
npm run dev
```

❌ **Wrong API URL in frontend**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

❌ **MySQL not running**
```bash
# Windows
net start MySQL80
```

## Success Indicators

✅ `npm run test-db` → All tests passed
✅ `npm run test-login` → Login successful
✅ Backend terminal → "Database connected successfully"
✅ Frontend terminal → "Ready on http://localhost:3000"
✅ Browser → Login works, redirects to dashboard
✅ No errors in browser console

## Still Having Issues?

1. **Check backend terminal** - Look for error messages
2. **Check browser console (F12)** - Look for network errors
3. **Check Network tab** - Look at request/response details
4. **Try incognito mode** - Clear cache issues
5. **Restart computer** - Sometimes helps with port issues

## Get Help

Share these details:
1. Output of `npm run test-db`
2. Output of `npm run test-login`
3. Backend terminal errors
4. Browser console errors
5. Network tab screenshot

Good luck! 🚀
