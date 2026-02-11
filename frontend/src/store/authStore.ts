import { create } from "zustand";

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
  login: (user: User, token: string) => void;
  logout: () => void;
  initAuth: () => void;
  setDummyUser: (role: "admin" | "petugas" | "owner") => void;
}

// Dummy users untuk development
const dummyUsers = {
  admin: {
    user_id: 1,
    username: "admin",
    full_name: "Administrator",
    role: "admin" as const,
    branch_id: 1,
  },
  petugas: {
    user_id: 2,
    username: "petugas1",
    full_name: "Petugas Parkir",
    role: "petugas" as const,
    branch_id: 1,
  },
  owner: {
    user_id: 3,
    username: "owner",
    full_name: "Owner Bisnis",
    role: "owner" as const,
    branch_id: null,
  },
};

export const useAuthStore = create<AuthState>((set) => ({
  user: dummyUsers.admin, // Default dummy user
  token: "dummy-token",
  isAuthenticated: true,
  login: (user, token) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
    }
    set({ user, token, isAuthenticated: true });
  },
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    set({ user: null, token: null, isAuthenticated: false });
  },
  initAuth: () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem("token");
      const userStr = localStorage.getItem("user");
      if (token && userStr) {
        const user = JSON.parse(userStr);
        set({ user, token, isAuthenticated: true });
      } else {
        // Set default dummy user jika tidak ada
        set({ user: dummyUsers.admin, token: "dummy-token", isAuthenticated: true });
      }
    }
  },
  setDummyUser: (role) => {
    const user = dummyUsers[role];
    set({ user, token: "dummy-token", isAuthenticated: true });
  },
}));
