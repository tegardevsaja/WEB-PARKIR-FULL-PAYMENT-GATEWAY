"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Card from "@/components/ui/Card";
import Select from "@/components/ui/Select";
import { BarChart3, TrendingUp, PieChart as PieChartIcon } from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function StatisticsPage() {
  const [period, setPeriod] = useState("7days");

  // Dummy data untuk charts
  const revenueData = [
    { date: "05 Feb", revenue: 2150000, transactions: 78 },
    { date: "06 Feb", revenue: 2380000, transactions: 85 },
    { date: "07 Feb", revenue: 2520000, transactions: 92 },
    { date: "08 Feb", revenue: 2290000, transactions: 81 },
    { date: "09 Feb", revenue: 2680000, transactions: 95 },
    { date: "10 Feb", revenue: 2850000, transactions: 102 },
    { date: "11 Feb", revenue: 2450000, transactions: 87 },
  ];

  const branchData = [
    { branch: "Cabang Pusat", transactions: 247, revenue: 7180000 },
    { branch: "Cabang Utara", transactions: 207, revenue: 5870000 },
    { branch: "Cabang Selatan", transactions: 271, revenue: 8430000 },
  ];

  const vehicleData = [
    { name: "Motor", value: 45, color: "#3b82f6" },
    { name: "Mobil", value: 35, color: "#10b981" },
    { name: "Bus/Truk", value: 20, color: "#8b5cf6" },
  ];

  const paymentData = [
    { name: "Cash", value: 52, color: "#f59e0b" },
    { name: "QRIS", value: 48, color: "#06b6d4" },
  ];

  const peakHoursData = [
    { hour: "06:00", count: 12 },
    { hour: "08:00", count: 45 },
    { hour: "10:00", count: 38 },
    { hour: "12:00", count: 52 },
    { hour: "14:00", count: 48 },
    { hour: "16:00", count: 65 },
    { hour: "18:00", count: 72 },
    { hour: "20:00", count: 35 },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Statistik & Analisis</h1>
            <p className="text-gray-600 mt-1">Visualisasi data untuk analisis bisnis</p>
          </div>
          <Select
            options={[
              { value: "7days", label: "7 Hari Terakhir" },
              { value: "30days", label: "30 Hari Terakhir" },
              { value: "90days", label: "90 Hari Terakhir" },
            ]}
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
          />
        </div>

        {/* Revenue Trend */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-primary-600" />
            <h2 className="text-lg font-semibold text-gray-900">Tren Pendapatan</h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip
                formatter={(value: any) =>
                  new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    minimumFractionDigits: 0,
                  }).format(value)
                }
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#0ea5e9"
                strokeWidth={2}
                name="Pendapatan"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Branch Performance */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 className="w-5 h-5 text-primary-600" />
              <h2 className="text-lg font-semibold text-gray-900">Performa per Cabang</h2>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={branchData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="branch" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="transactions" fill="#3b82f6" name="Transaksi" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Peak Hours */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 className="w-5 h-5 text-primary-600" />
              <h2 className="text-lg font-semibold text-gray-900">Jam Sibuk</h2>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={peakHoursData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#10b981" name="Kendaraan Masuk" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Vehicle Type Distribution */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <PieChartIcon className="w-5 h-5 text-primary-600" />
              <h2 className="text-lg font-semibold text-gray-900">Distribusi Jenis Kendaraan</h2>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={vehicleData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {vehicleData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          {/* Payment Method Distribution */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <PieChartIcon className="w-5 h-5 text-primary-600" />
              <h2 className="text-lg font-semibold text-gray-900">Metode Pembayaran</h2>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={paymentData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {paymentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6">
            <p className="text-sm text-gray-600 mb-2">Rata-rata Durasi Parkir</p>
            <p className="text-3xl font-bold text-blue-600">2.5 jam</p>
            <p className="text-xs text-gray-500 mt-1">Per kendaraan</p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-gray-600 mb-2">Rata-rata Pendapatan/Hari</p>
            <p className="text-3xl font-bold text-emerald-600">Rp 2.5 jt</p>
            <p className="text-xs text-gray-500 mt-1">7 hari terakhir</p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-gray-600 mb-2">Okupansi Rata-rata</p>
            <p className="text-3xl font-bold text-purple-600">68%</p>
            <p className="text-xs text-gray-500 mt-1">Dari total kapasitas</p>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
