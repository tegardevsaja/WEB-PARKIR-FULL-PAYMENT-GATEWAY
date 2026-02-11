"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

export default function Home() {
  const router = useRouter();
  const { user } = useAuthStore();

  useEffect(() => {
    // Redirect based on role
    if (user?.role === "admin") {
      router.push("/admin/dashboard");
    } else if (user?.role === "petugas") {
      router.push("/petugas/dashboard");
    } else if (user?.role === "owner") {
      router.push("/owner/dashboard");
    } else {
      router.push("/admin/dashboard"); // default
    }
  }, [router, user]);

  return null;
}
