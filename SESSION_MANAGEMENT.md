# 🔐 Session Management & Route Protection

## ✅ Implemented Features

### 1. Authentication Protection
- ✅ All dashboard routes protected
- ✅ Auto redirect to login if not authenticated
- ✅ Session persistence with localStorage
- ✅ Auto logout on token expiration (401)

### 2. Route Protection
- ✅ Role-based access control
- ✅ Auto redirect based on user role
- ✅ Prevent access to unauthorized pages

### 3. Session Management
- ✅ Token stored in localStorage
- ✅ User data stored in localStorage
- ✅ Auto init on page load
- ✅ Auto clear on logout

## 📁 Files Created/Updated

### New Files
1. `frontend/src/hooks/useAuth.ts` - Auth hook
2. `frontend/src/components/auth/ProtectedRoute.tsx` - Route protection component
3. `frontend/src/components/auth/AuthProvider.tsx` - Auth initialization

### Updated Files
1. `frontend/src/components/layout/DashboardLayout.tsx` - Added auth check
2. `frontend/src/app/layout.tsx` - Added AuthProvider
3. `frontend/src/app/page.tsx` - Added redirect logic
4. `frontend/src/app/login/page.tsx` - Added redirect if logged in
5. `frontend/src/components/layout/Header.tsx` - Updated logout function

## 🔒 How It Works

### 1. App Initialization
```typescript
// Root layout initializes auth
<AuthProvider>
  {children}
</AuthProvider>

// AuthProvider loads user from localStorage
useEffect(() => {
  initAuth(); // Load token & user from localStorage
}, []);
```

### 2. Route Protection
```typescript
// DashboardLayout checks auth
useEffect(() => {
  initAuth();
  
  if (!isAuthenticated || !user) {
    router.push('/login'); // Redirect to login
  }
}, [isAuthenticated, user]);
```

### 3. Login Flow
```
1. User enters credentials
2. API call to /auth/login
3. Store token & user in localStorage
4. Update Zustand store
5. Redirect based on role:
   - admin → /admin/dashboard
   - petugas → /petugas/dashboard
   - owner → /owner/dashboard
```

### 4. Logout Flow
```
1. User clicks logout
2. API call to /auth/logout
3. Clear localStorage (token & user)
4. Clear Zustand store
5. Redirect to /login
```

### 5. Session Persistence
```
1. User refreshes page
2. AuthProvider runs initAuth()
3. Load token & user from localStorage
4. Validate and restore session
5. User stays logged in
```

### 6. Auto Logout on 401
```
1. API request returns 401
2. Axios interceptor catches error
3. Clear localStorage
4. Redirect to /login
```

## 🎯 Protected Routes

All routes under these paths are protected:
- `/admin/*` - Admin only
- `/petugas/*` - Petugas only
- `/owner/*` - Owner only

### Access Control Matrix

| Route | Admin | Petugas | Owner | Guest |
|-------|-------|---------|-------|-------|
| `/login` | ✅ (redirect) | ✅ (redirect) | ✅ (redirect) | ✅ |
| `/admin/*` | ✅ | ❌ | ❌ | ❌ |
| `/petugas/*` | ❌ | ✅ | ❌ | ❌ |
| `/owner/*` | ❌ | ❌ | ✅ | ❌ |

## 🔧 Usage Examples

### Using useAuth Hook
```typescript
import { useAuth } from '@/hooks/useAuth';

export default function MyPage() {
  const { user, isAuthenticated } = useAuth(['admin']); // Only admin
  
  // Component will auto redirect if not admin
  return <div>Admin only content</div>;
}
```

### Using ProtectedRoute Component
```typescript
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function MyPage() {
  return (
    <ProtectedRoute allowedRoles={['admin', 'owner']}>
      <div>Admin & Owner content</div>
    </ProtectedRoute>
  );
}
```

### Manual Auth Check
```typescript
import { useAuthStore } from '@/store/authStore';

export default function MyComponent() {
  const { user, isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated) {
    return <div>Please login</div>;
  }
  
  return <div>Welcome {user?.full_name}</div>;
}
```

## 🧪 Testing

### Test Login Protection
1. Open browser in incognito mode
2. Go to `http://localhost:3000/admin/dashboard`
3. Should redirect to `/login`

### Test Session Persistence
1. Login with credentials
2. Refresh page (F5)
3. Should stay logged in

### Test Role-Based Access
1. Login as Petugas
2. Try to access `/admin/dashboard`
3. Should redirect to `/petugas/dashboard`

### Test Logout
1. Login
2. Click logout
3. Should redirect to `/login`
4. Try to access dashboard
5. Should redirect to `/login`

### Test Token Expiration
1. Login
2. Wait 24 hours (or manually delete token from backend)
3. Make any API request
4. Should auto logout and redirect to `/login`

## 📊 Session Data

### Stored in localStorage
```javascript
// Token
localStorage.getItem('token')
// "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

// User
localStorage.getItem('user')
// {"user_id":1,"username":"admin","full_name":"Super Administrator","role":"admin","branch_id":null}
```

### Stored in Zustand
```typescript
{
  user: {
    user_id: 1,
    username: "admin",
    full_name: "Super Administrator",
    role: "admin",
    branch_id: null
  },
  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  isAuthenticated: true,
  isLoading: false,
  error: null
}
```

## 🔐 Security Features

### 1. Token Security
- ✅ JWT token with expiration (24h)
- ✅ Token sent in Authorization header
- ✅ Token validated on every request
- ✅ Auto logout on invalid token

### 2. Route Security
- ✅ All dashboard routes protected
- ✅ Role-based access control
- ✅ Auto redirect on unauthorized access
- ✅ No direct URL access without auth

### 3. Session Security
- ✅ Session data in localStorage (client-side)
- ✅ Token expiration enforced by backend
- ✅ Auto clear on logout
- ✅ Auto clear on 401 error

## ⚠️ Important Notes

### localStorage vs Cookies
This implementation uses localStorage for simplicity. For production:
- Consider using httpOnly cookies for better security
- Implement refresh token mechanism
- Add CSRF protection

### Token Expiration
- Default: 24 hours
- Configurable in backend `.env`: `JWT_EXPIRES_IN=24h`
- No auto-refresh implemented (user must login again)

### Multiple Tabs
- Session shared across tabs (same localStorage)
- Logout in one tab = logout in all tabs
- Login in one tab = login in all tabs

## 🎉 Summary

✅ Complete session management implemented
✅ All routes protected
✅ Role-based access control
✅ Auto redirect on unauthorized access
✅ Session persistence
✅ Auto logout on token expiration

Users MUST login to access any dashboard page!
