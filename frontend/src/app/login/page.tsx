"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import api from "@/lib/axios";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card from "@/components/ui/Card";
import { LogIn, Loader2, Car } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", { username, password });
      const { user, token } = response.data;
      
      login(user, token);
      
      if (user.role === "admin") {
        router.push("/admin/dashboard");
      } else if (user.role === "petugas") {
        router.push("/petugas/dashboard");
      } else if (user.role === "owner") {
        router.push("/owner/dashboard");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Login gagal. Periksa username dan password Anda.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-blue-50 to-primary-100 p-4">
      <Card className="w-full max-w-md p-8 shadow-xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl mb-4 shadow-lg">
            <Car className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Aplikasi Parkir</h1>
          <p className="text-gray-600 mt-2">Sistem Manajemen Parkir Modern</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Masukkan username"
            required
            disabled={loading}
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Masukkan password"
            required
            disabled={loading}
          />

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Memproses...
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4 mr-2" />
                Login
              </>
            )}
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-center text-sm text-gray-600 mb-3 font-medium">
            Demo Credentials:
          </p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded">
              <span className="text-gray-600">Admin:</span>
              <span className="font-mono text-gray-900">admin / password123</span>
            </div>
            <div className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded">
              <span className="text-gray-600">Petugas:</span>
              <span className="font-mono text-gray-900">petugas1 / password123</span>
            </div>
            <div className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded">
              <span className="text-gray-600">Owner:</span>
              <span className="font-mono text-gray-900">owner / password123</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
