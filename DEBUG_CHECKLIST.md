# 🐛 Debug Checklist - Login Error 500

## Error yang Terjadi
- ❌ Server error during login
- ❌ Failed to load resource: 500 (Internal Server Error)
- ❌ Endpoint: `/api/auth/login`

## Langkah Debug

### 1. Cek Backend Running
```bash
cd backend
npm run dev
```

**Expected Output:**
```
✅ Database connected successfully
🚀 Server running on port 5000
```

### 2. Cek Database Connection
```bash
cd backend
npm run test-db
```

**Expected Output:**
```
✅ Connected to MySQL server successfully!
✅ Database 'parking_db' exists!
✅ Connected to database successfully!
✅ Found 8 tables
✅ Database has data (X users found)
```

### 3. Test Login Endpoint Manually

**Using curl:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "user_id": 1,
      "username": "admin",
      "full_name": "Super Administrator",
      "role": "admin",
      "branch_id": null
    }
  }
}
```

### 4. Common Issues & Solutions

#### Issue 1: Backend Not Running
**Symptom:** Cannot connect to localhost:5000

**Solution:**
```bash
cd backend
npm run dev
```

#### Issue 2: Database Not Connected
**Symptom:** "Database connection failed"

**Solution:**
```bash
# Check MySQL is running
# Windows:
net start MySQL80

# Then test connection
npm run test-db
```

#### Issue 3: Database Not Seeded
**Symptom:** "User not found" or empty database

**Solution:**
```bash
cd backend
npm run seed
```

#### Issue 4: Wrong Password Hash
**Symptom:** "Invalid username or password"

**Solution:**
Database might have wrong password hash. Re-seed:
```bash
cd backend
npm run seed
```

#### Issue 5: CORS Error
**Symptom:** "CORS policy blocked"

**Solution:**
Check `backend/.env`:
```env
FRONTEND_URL=http://localhost:3000
```

Restart backend after changing.

#### Issue 6: Port Already in Use
**Symptom:** "Port 5000 already in use"

**Solution:**
```bash
# Kill process on port 5000
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Or change port in backend/.env
PORT=5001
```

### 5. Check Backend Logs

When you run `npm run dev`, check terminal for errors:

**Good logs:**
```
✅ Database connected successfully
🚀 Server running on port 5000
POST /api/auth/login
```

**Bad logs:**
```
❌ Database connection failed
❌ Error: ...
```

### 6. Check Frontend API URL

File: `frontend/.env.local`
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

If backend on different port, update this.

### 7. Browser Console Errors

Open DevTools (F12) → Console tab

Look for:
- Network errors
- CORS errors
- 500 errors with details

### 8. Network Tab

Open DevTools (F12) → Network tab

1. Try login
2. Find `/login` request
3. Click on it
4. Check:
   - Request URL: Should be `http://localhost:5000/api/auth/login`
   - Request Method: POST
   - Status Code: Should be 200, not 500
   - Response: Check error message

## Quick Fix Commands

```bash
# Terminal 1 - Backend
cd backend
npm run test-db    # Test database
npm run seed       # Re-seed if needed
npm run dev        # Start server

# Terminal 2 - Frontend
cd frontend
npm run dev        # Start frontend

# Terminal 3 - Test
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

## Expected Working State

✅ Backend running on port 5000
✅ Frontend running on port 3000
✅ Database connected
✅ Database seeded with users
✅ Login endpoint returns 200
✅ Token received
✅ Redirect to dashboard

## Still Not Working?

1. **Check backend terminal** for error messages
2. **Check browser console** for error details
3. **Check Network tab** for request/response
4. **Try different browser** or incognito mode
5. **Clear localStorage** and try again
6. **Restart both servers**

## Contact Points

If still having issues, check:
1. Backend terminal output
2. Browser console errors
3. Network tab request details
4. Database connection status

Share these details for further debugging.
