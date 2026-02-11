"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

export default function Home() {
  const router = useRouter();
  const { user, isAuthenticated, initAuth } = useAuthStore();

  useEffect(() => {
    // Initialize auth once on mount
    initAuth();
  }, []); // Empty dependency array - run only once

  useEffect(() => {
    // Redirect based on authentication and role
    if (!isAuthenticated || !user) {
      router.push("/login");
    } else if (user.role === "admin") {
      router.push("/admin/dashboard");
    } else if (user.role === "petugas") {
      router.push("/petugas/dashboard");
    } else if (user.role === "owner") {
      router.push("/owner/dashboard");
    }
  }, [router, user, isAuthenticated]); // Removed initAuth from dependencies

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
}
