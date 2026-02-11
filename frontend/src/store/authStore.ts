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
  login: (username: string, password: string) => Promise<User | undefined>;
  logout: () => Promise<void>;
  initAuth: () => void;
  setDummyUser: (role: "admin" | "petugas" | "owner") => void;
}

// Dummy users untuk development (fallback)
const dummyUsers = {
  admin: {
    user_id: 1,
    username: "admin",
    full_name: "Super Administrator",
    role: "admin" as const,
    branch_id: null,
  },
  petugas: {
    user_id: 2,
    username: "petugas1",
    full_name: "Petugas Cabang Pusat",
    role: "petugas" as const,
    branch_id: 1,
  },
  owner: {
    user_id: 3,
    username: "owner1",
    full_name: "Owner Cabang Pusat",
    role: "owner" as const,
    branch_id: 1,
  },
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (username, password) => {
    set({ isLoading: true, error: null });
    try {
      console.log('AuthStore: Calling login API...');
      const response = await api.post('/auth/login', { username, password });
      console.log('AuthStore: API response:', response.data);
      
      if (response.data.success) {
        const { token, user } = response.data.data;
        console.log('AuthStore: Login successful, user:', user);
        
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));
          console.log('AuthStore: Saved to localStorage');
        }
        
        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
          error: null
        });
        
        console.log('AuthStore: State updated, returning user');
        return user; // Return user data
      } else {
        throw new Error('Login response was not successful');
      }
    } catch (error: any) {
      console.error('AuthStore: Login error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      set({
        error: errorMessage,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        token: null
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
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
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
          set({ user: null, token: null, isAuthenticated: false });
        }
      }
    }
  },

  // For development/testing only
  setDummyUser: (role) => {
    const user = dummyUsers[role];
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', 'dummy-token');
    }
    set({ user, token: 'dummy-token', isAuthenticated: true });
  },
}));
