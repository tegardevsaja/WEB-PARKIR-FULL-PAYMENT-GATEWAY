# 🔗 Frontend-Backend Integration Guide

Panduan untuk menghubungkan frontend Next.js dengan backend Express API.

## 📋 Overview

- **Frontend**: Next.js 14 (Port 3000)
- **Backend**: Express.js (Port 5000)
- **Connection**: Axios with CORS
- **Auth**: JWT Token in localStorage

## 🚀 Quick Setup

### 1. Start Backend

```bash
cd backend
npm install
npm run seed  # First time only
npm run dev
```

Backend akan berjalan di: `http://localhost:5000`

### 2. Start Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend akan berjalan di: `http://localhost:3000`

## 🔧 Frontend Configuration

### Update Axios Base URL

File: `frontend/src/lib/axios.ts`

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### Update Environment Variables

File: `frontend/.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## 📝 Update Auth Store

File: `frontend/src/store/authStore.ts`

```typescript
import { create } from "zustand";
import api from "@/lib/axios";

interface User {
  user_id: number;
  username: string;
  full_name: string;
  role: "admin" | "petugas" | "owner";
  branch_id: number | null;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  initAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (username, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/auth/login', { username, password });
      
      if (response.data.success) {
        const { token, user } = response.data.data;
        
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
          error: null
        });
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      set({
        error: errorMessage,
        isLoading: false,
        isAuthenticated: false
      });
      throw new Error(errorMessage);
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      set({
        user: null,
        token: null,
        isAuthenticated: false
      });
    }
  },

  initAuth: () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      
      if (token && userStr) {
        try {
          const user = JSON.parse(userStr);
          set({ user, token, isAuthenticated: true });
        } catch (error) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
    }
  },
}));
```

## 🔐 Update Login Page

File: `frontend/src/app/login/page.tsx`

```typescript
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error } = useAuthStore();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await login(username, password);
      
      // Redirect based on role
      const user = useAuthStore.getState().user;
      if (user?.role === 'admin') {
        router.push('/admin/dashboard');
      } else if (user?.role === 'petugas') {
        router.push('/petugas/dashboard');
      } else if (user?.role === 'owner') {
        router.push('/owner/dashboard');
      }
    } catch (error) {
      // Error handled by store
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">LaVista Parking</h1>
          <p className="text-gray-600 mt-2">Sistem Manajemen Parkir</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <Input
            label="Username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Masukkan username"
            required
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Masukkan password"
            required
          />

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Login'}
          </Button>
        </form>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600 font-medium mb-2">Demo Credentials:</p>
          <p className="text-xs text-gray-600">Admin: admin / admin123</p>
          <p className="text-xs text-gray-600">Owner: owner1 / owner123</p>
          <p className="text-xs text-gray-600">Petugas: petugas1 / petugas123</p>
        </div>
      </Card>
    </div>
  );
}
```

## 📡 API Service Examples

### User Service

File: `frontend/src/services/userService.ts`

```typescript
import api from '@/lib/axios';

export const userService = {
  // Get all users
  getAll: async (params?: { search?: string; role?: string; branch_id?: number }) => {
    const response = await api.get('/users', { params });
    return response.data;
  },

  // Get users by branch (Owner)
  getByBranch: async () => {
    const response = await api.get('/users/branch');
    return response.data;
  },

  // Create user
  create: async (data: any) => {
    const response = await api.post('/users', data);
    return response.data;
  },

  // Update user
  update: async (id: number, data: any) => {
    const response = await api.put(`/users/${id}`, data);
    return response.data;
  },

  // Delete user
  delete: async (id: number) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },
};
```

### Ticket Service

File: `frontend/src/services/ticketService.ts`

```typescript
import api from '@/lib/axios';

export const ticketService = {
  // Vehicle entry
  entry: async (data: {
    license_plate: string;
    vehicle_type_id: number;
    area_id: number;
  }) => {
    const response = await api.post('/tickets/entry', data);
    return response.data;
  },

  // Search ticket
  search: async (params: { ticket_number?: string; license_plate?: string }) => {
    const response = await api.get('/tickets/search', { params });
    return response.data;
  },

  // Vehicle exit
  exit: async (data: {
    ticket_id: number;
    payment_method: 'cash' | 'qris';
  }) => {
    const response = await api.post('/tickets/exit', data);
    return response.data;
  },

  // Get active tickets
  getActive: async (branch_id?: number) => {
    const response = await api.get('/tickets/active', {
      params: { branch_id }
    });
    return response.data;
  },
};
```

### Payment Service

File: `frontend/src/services/paymentService.ts`

```typescript
import api from '@/lib/axios';

export const paymentService = {
  // Get all payments
  getAll: async (params?: {
    search?: string;
    payment_method?: string;
    payment_status?: string;
    branch_id?: number;
    start_date?: string;
    end_date?: string;
  }) => {
    const response = await api.get('/payments', { params });
    return response.data;
  },

  // Get payment by ID
  getById: async (id: number) => {
    const response = await api.get(`/payments/${id}`);
    return response.data;
  },

  // Update payment status
  updateStatus: async (id: number, status: 'paid' | 'failed') => {
    const response = await api.put(`/payments/${id}/status`, {
      payment_status: status
    });
    return response.data;
  },

  // Get statistics
  getStats: async (params?: {
    branch_id?: number;
    start_date?: string;
    end_date?: string;
  }) => {
    const response = await api.get('/payments/stats', { params });
    return response.data;
  },
};
```

### Dashboard Service

File: `frontend/src/services/dashboardService.ts`

```typescript
import api from '@/lib/axios';

export const dashboardService = {
  // Get dashboard stats
  getStats: async (branch_id?: number) => {
    const response = await api.get('/dashboard/stats', {
      params: { branch_id }
    });
    return response.data;
  },

  // Get branch comparison (Admin only)
  getBranchComparison: async () => {
    const response = await api.get('/dashboard/branch-comparison');
    return response.data;
  },
};
```

## 🎯 Usage Example in Component

```typescript
"use client";

import { useState, useEffect } from "react";
import { userService } from "@/services/userService";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await userService.getAll();
      if (response.success) {
        setUsers(response.data);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure?')) {
      try {
        await userService.delete(id);
        loadUsers(); // Reload data
      } catch (err: any) {
        alert(err.message);
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {users.map((user) => (
        <div key={user.user_id}>
          {user.full_name}
          <button onClick={() => handleDelete(user.user_id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
```

## 🔄 Complete Integration Checklist

### Backend Setup
- [ ] Install dependencies (`npm install`)
- [ ] Configure `.env` file
- [ ] Create database
- [ ] Import schema
- [ ] Run seeder (`npm run seed`)
- [ ] Start server (`npm run dev`)
- [ ] Test health endpoint

### Frontend Setup
- [ ] Install dependencies (`npm install`)
- [ ] Update `axios.ts` with API URL
- [ ] Create `.env.local` with API URL
- [ ] Update `authStore.ts` with API calls
- [ ] Update login page
- [ ] Create service files
- [ ] Test login functionality

### Testing
- [ ] Login with admin credentials
- [ ] Check token in localStorage
- [ ] Test protected routes
- [ ] Test CRUD operations
- [ ] Test entry/exit flow
- [ ] Test payment processing
- [ ] Test dashboard statistics

## 🐛 Common Issues & Solutions

### CORS Error
**Problem**: "Access to XMLHttpRequest has been blocked by CORS policy"

**Solution**: 
1. Check backend `.env`: `FRONTEND_URL=http://localhost:3000`
2. Restart backend server

### 401 Unauthorized
**Problem**: "Access denied. No token provided"

**Solution**:
1. Check if token exists in localStorage
2. Check axios interceptor is adding token
3. Login again to get new token

### Network Error
**Problem**: "Network Error" or "ERR_CONNECTION_REFUSED"

**Solution**:
1. Check backend is running on port 5000
2. Check API URL in frontend config
3. Check firewall settings

### Token Expired
**Problem**: Token expired after 24 hours

**Solution**:
1. Implement token refresh logic
2. Or login again to get new token

## 📚 Additional Resources

- Backend API Docs: `backend/API_DOCUMENTATION.md`
- Backend Installation: `BACKEND_INSTALLATION.md`
- Frontend Summary: `FRONTEND_SUMMARY.md`

## ✅ Success Indicators

When integration is successful:
- ✅ Login works and redirects to dashboard
- ✅ Token stored in localStorage
- ✅ Protected routes accessible
- ✅ CRUD operations work
- ✅ Real-time data from database
- ✅ No CORS errors
- ✅ Error handling works

## 🎉 Next Steps

1. Remove dummy data from frontend
2. Replace with API calls
3. Add loading states
4. Add error handling
5. Add success notifications
6. Test all features
7. Deploy to production

Happy coding! 🚀
