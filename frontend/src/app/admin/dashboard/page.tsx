"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Card from "@/components/ui/Card";
import { formatCurrency } from "@/lib/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faCar,
  faDollarSign,
  faChartLine,
  faSquareParking,
  faBuilding,
  faArrowUp,
  faArrowDown,
  faChartArea,
  faClock,
} from "@fortawesome/free-solid-svg-icons";

interface Stats {
  totalUsers: number;
  totalBranches: number;
  totalAreas: number;
  totalVehicles: number;
  todayRevenue: number;
  todayTransactions: number;
  activeVehicles: number;
  occupancyRate: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalBranches: 0,
    totalAreas: 0,
    totalVehicles: 0,
    todayRevenue: 0,
    todayTransactions: 0,
    activeVehicles: 0,
    occupancyRate: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setTimeout(() => {
      setStats({
        totalUsers: 15,
        totalBranches: 3,
        totalAreas: 7,
        totalVehicles: 245,
        todayRevenue: 2450000,
        todayTransactions: 87,
        activeVehicles: 142,
        occupancyRate: 68,
      });
      setLoading(false);
    }, 500);
  };

  const recentActivities = [
    { id: 1, action: "User baru ditambahkan", user: "Admin", time: "5 menit lalu", type: "user" },
    { id: 2, action: "Kendaraan masuk - B 1234 XYZ", user: "Petugas 1", time: "12 menit lalu", type: "entry" },
    { id: 3, action: "Pembayaran berhasil - Rp 15.000", user: "Petugas 2", time: "18 menit lalu", type: "payment" },
    { id: 4, action: "Tarif parkir diupdate", user: "Admin", time: "1 jam lalu", type: "update" },
    { id: 5, action: "Kendaraan keluar - D 5678 ABC", user: "Petugas 1", time: "1 jam lalu", type: "exit" },
  ];

  const parkingAreas = [
    { name: "Area A - Lantai 1", total: 50, occupied: 42, percentage: 84 },
    { name: "Area B - Lantai 2", total: 50, occupied: 35, percentage: 70 },
    { name: "Area C - Lantai 3", total: 50, occupied: 28, percentage: 56 },
    { name: "Area D - VIP", total: 20, occupied: 18, percentage: 90 },
  ];

  const statCards = [
    {
      title: "Pendapatan Hari Ini",
      value: formatCurrency(stats.todayRevenue),
      change: "+12.5%",
      isPositive: true,
      icon: faDollarSign,
      iconBg: "bg-emerald-500",
      lightBg: "bg-emerald-50",
    },
    {
      title: "Transaksi Hari Ini",
      value: stats.todayTransactions.toString(),
      change: "+8.2%",
      isPositive: true,
      icon: faChartLine,
      iconBg: "bg-blue-500",
      lightBg: "bg-blue-50",
    },
    {
      title: "Kendaraan Aktif",
      value: stats.activeVehicles.toString(),
      change: "-3.1%",
      isPositive: false,
      icon: faCar,
      iconBg: "bg-purple-500",
      lightBg: "bg-purple-50",
    },
    {
      title: "Tingkat Okupansi",
      value: `${stats.occupancyRate}%`,
      change: "+5.4%",
      isPositive: true,
      icon: faSquareParking,
      iconBg: "bg-orange-500",
      lightBg: "bg-orange-50",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard Admin</h1>
            <p className="text-sm text-gray-500 mt-1">
              Selamat datang kembali! Berikut ringkasan sistem hari ini
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200 shadow-sm">
            <FontAwesomeIcon icon={faClock} className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">
              {new Date().toLocaleDateString("id-ID", { 
                weekday: "long", 
                year: "numeric", 
                month: "long", 
                day: "numeric" 
              })}
            </span>
          </div>
        </div>

        {/* Banner Image - Full Width with Overlay Text */}
        <div className="relative w-full h-48 rounded-2xl overflow-hidden shadow-lg">
          <img 
            src="/images/BANNER.png" 
            alt="Banner Dashboard" 
            className="w-full h-full object-cover"
          />
          {/* Overlay Text */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent flex items-center px-8">
            <div className="text-white">
              <h2 className="text-4xl md:text-5xl font-bold mb-2 tracking-tight">
                LaVista Parking
              </h2>
              <p className="text-lg md:text-xl font-light opacity-90">
                Sistem Manajemen Parkir Modern & Terpercaya
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="p-5 animate-pulse">
                <div className="h-24 bg-gray-100 rounded"></div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {statCards.map((stat, index) => {
              return (
                <Card key={index} className="p-5 hover:shadow-md transition-all border border-gray-100">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`${stat.iconBg} p-2.5 rounded-lg shadow-sm`}>
                      <FontAwesomeIcon icon={stat.icon} className="w-5 h-5 text-white" />
                    </div>
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                      stat.isPositive 
                        ? "bg-emerald-50 text-emerald-700" 
                        : "bg-red-50 text-red-700"
                    }`}>
                      <FontAwesomeIcon icon={stat.isPositive ? faArrowUp : faArrowDown} className="w-3 h-3" />
                      {stat.change}
                    </div>
                  </div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </Card>
              );
            })}
          </div>
        )}

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <Card className="p-5 border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="bg-blue-50 p-2.5 rounded-lg">
                <FontAwesomeIcon icon={faUsers} className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Total User</p>
                <p className="text-xl font-bold text-gray-900">{stats.totalUsers}</p>
              </div>
            </div>
          </Card>
          <Card className="p-5 border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="bg-green-50 p-2.5 rounded-lg">
                <FontAwesomeIcon icon={faBuilding} className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Total Cabang</p>
                <p className="text-xl font-bold text-gray-900">{stats.totalBranches}</p>
              </div>
            </div>
          </Card>
          <Card className="p-5 border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="bg-purple-50 p-2.5 rounded-lg">
                <FontAwesomeIcon icon={faSquareParking} className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Area Parkir</p>
                <p className="text-xl font-bold text-gray-900">{stats.totalAreas}</p>
              </div>
            </div>
          </Card>
          <Card className="p-5 border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="bg-orange-50 p-2.5 rounded-lg">
                <FontAwesomeIcon icon={faCar} className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Total Kendaraan</p>
                <p className="text-xl font-bold text-gray-900">{stats.totalVehicles}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activities */}
          <Card className="p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <FontAwesomeIcon icon={faChartArea} className="w-5 h-5 text-rose-500" />
                Aktivitas Terbaru
              </h2>
              <button className="text-xs font-medium text-rose-600 hover:text-rose-700">
                Lihat Semua
              </button>
            </div>
            <div className="space-y-3">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.type === "entry" ? "bg-blue-500" :
                    activity.type === "exit" ? "bg-orange-500" :
                    activity.type === "payment" ? "bg-emerald-500" :
                    activity.type === "user" ? "bg-purple-500" :
                    "bg-gray-400"
                  }`}></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {activity.user} • {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Parking Areas Status */}
          <Card className="p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <FontAwesomeIcon icon={faSquareParking} className="w-5 h-5 text-rose-500" />
                Status Area Parkir
              </h2>
              <button className="text-xs font-medium text-rose-600 hover:text-rose-700">
                Lihat Detail
              </button>
            </div>
            <div className="space-y-4">
              {parkingAreas.map((area, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-900">{area.name}</span>
                    <span className="text-gray-600">
                      {area.occupied}/{area.total}
                    </span>
                  </div>
                  <div className="relative w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`absolute top-0 left-0 h-full rounded-full transition-all ${
                        area.percentage >= 80 ? "bg-red-500" :
                        area.percentage >= 60 ? "bg-orange-500" :
                        "bg-emerald-500"
                      }`}
                      style={{ width: `${area.percentage}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500">{area.percentage}% terisi</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
