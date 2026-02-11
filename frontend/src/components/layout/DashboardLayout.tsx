"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import Sidebar from "./Sidebar";
import Header from "./Header";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, initAuth } = useAuthStore();

  useEffect(() => {
    // Set dummy user jika belum ada
    if (!user) {
      initAuth();
    }
  }, [user, initAuth]);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col lg:ml-64">
        <Header />
        <main className="flex-1 overflow-y-auto mt-16">
          <div className="p-4 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}

