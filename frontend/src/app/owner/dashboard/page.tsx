"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDollarSign,
  faChartLine,
  faCar,
  faChartBar,
  faFileAlt,
  faArrowRight,
  faArrowUp,
  faArrowDown,
  faClock,
  faUsers,
  faChartArea,
} from "@fortawesome/free-solid-svg-icons";

interface OwnerStats {
  totalRevenue: number;
  todayRevenue: number;
  totalTransactions: number;
  todayTransactions: number;
  averageParking: number;
  monthlyGrowth: number;
  activeVehicles: number;
  peakHour: string;
}

export default function OwnerDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<OwnerStats>({
    totalRevenue: 0,
    todayRevenue: 0,
    totalTransactions: 0,
    todayTransactions: 0,
    averageParking: 0,
    monthlyGrowth: 0,
    activeVehicles: 0,
    peakHour: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setTimeout(() => {
      setStats({
        totalRevenue: 15750000,
        todayRevenue: 2450000,
        totalTransactions: 1250,
        todayTransactions: 87,
        averageParking: 2.5,
        monthlyGrowth: 15.3,
        activeVehicles: 142,
        peakHour: "14:00 - 16:00",
      });
      setLoading(false);
    }, 500);
  };

  const branchPerformance = [
    { name: "Cabang Sudirman", revenue: 5250000, transactions: 420, growth: 18.5 },
    { name: "Cabang Thamrin", revenue: 6100000, transactions: 485, growth: 22.3 },
    { name: "Cabang Kuningan", revenue: 4400000, transactions: 345, growth: 8.7 },
  ];

  const weeklyRevenue = [
    { day: "Sen", amount: 1850000 },
    { day: "Sel", amount: 2100000 },
    { day: "Rab", amount: 1950000 },
    { day: "Kam", amount: 2300000 },
    { day: "Jum", amount: 2650000 },
    { day: "Sab", amount: 2900000 },
    { day: "Min", amount: 2000000 },
  ];

  const maxRevenue = Math.max(...weeklyRevenue.map(d => d.amount));

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard Owner</h1>
            <p className="text-sm text-gray-500 mt-1">
              Pantau performa bisnis parkir Anda secara real-time
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200 shadow-sm">
            <FontAwesomeIcon icon={faClock} className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">
              {new Date().toLocaleDateString("id-ID", { 
                month: "long", 
                year: "numeric" 
              })}
            </span>
          </div>
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <Card className="p-5 hover:shadow-md transition-all border border-gray-100 bg-gradient-to-br from-emerald-50 to-white">
            <div className="flex items-start justify-between mb-4">
              <div className="bg-emerald-500 p-2.5 rounded-lg shadow-sm">
                <FontAwesomeIcon icon={faDollarSign} className="w-5 h-5 text-white" />
              </div>
              <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                <FontAwesomeIcon icon={faArrowUp} className="w-3 h-3" />
                {stats.monthlyGrowth}%
              </div>
            </div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
              Total Pendapatan
            </p>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              {formatCurrency(stats.totalRevenue)}
            </p>
            <p className="text-xs text-gray-600">Bulan ini</p>
          </Card>

          <Card className="p-5 hover:shadow-md transition-all border border-gray-100 bg-gradient-to-br from-blue-50 to-white">
            <div className="flex items-start justify-between mb-4">
              <div className="bg-blue-500 p-2.5 rounded-lg shadow-sm">
                <FontAwesomeIcon icon={faChartLine} className="w-5 h-5 text-white" />
              </div>
              <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                <FontAwesomeIcon icon={faArrowUp} className="w-3 h-3" />
                12%
              </div>
            </div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
              Hari Ini
            </p>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              {formatCurrency(stats.todayRevenue)}
            </p>
            <p className="text-xs text-gray-600">{stats.todayTransactions} transaksi</p>
          </Card>

          <Card className="p-5 hover:shadow-md transition-all border border-gray-100 bg-gradient-to-br from-purple-50 to-white">
            <div className="flex items-start justify-between mb-4">
              <div className="bg-purple-500 p-2.5 rounded-lg shadow-sm">
                <FontAwesomeIcon icon={faCar} className="w-5 h-5 text-white" />
              </div>
              <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
                <FontAwesomeIcon icon={faChartArea} className="w-3 h-3" />
                Live
              </div>
            </div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
              Kendaraan Aktif
            </p>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              {stats.activeVehicles}
            </p>
            <p className="text-xs text-gray-600">Sedang parkir</p>
          </Card>

          <Card className="p-5 hover:shadow-md transition-all border border-gray-100 bg-gradient-to-br from-orange-50 to-white">
            <div className="flex items-start justify-between mb-4">
              <div className="bg-orange-500 p-2.5 rounded-lg shadow-sm">
                <FontAwesomeIcon icon={faClock} className="w-5 h-5 text-white" />
              </div>
              <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700">
                Peak
              </div>
            </div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
              Rata-rata Parkir
            </p>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              {stats.averageParking.toFixed(1)} jam
            </p>
            <p className="text-xs text-gray-600">Jam sibuk: {stats.peakHour}</p>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weekly Revenue Chart */}
          <Card className="p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <FontAwesomeIcon icon={faChartBar} className="w-5 h-5 text-rose-500" />
                Pendapatan Mingguan
              </h2>
              <button className="text-xs font-medium text-rose-600 hover:text-rose-700">
                Lihat Detail
              </button>
            </div>
            <div className="space-y-3">
              {weeklyRevenue.map((item, index) => (
                <div key={index} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-700">{item.day}</span>
                    <span className="font-bold text-gray-900">{formatCurrency(item.amount)}</span>
                  </div>
                  <div className="relative w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-rose-500 to-pink-600 rounded-full transition-all"
                      style={{ width: `${(item.amount / maxRevenue) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Branch Performance */}
          <Card className="p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <FontAwesomeIcon icon={faChartArea} className="w-5 h-5 text-rose-500" />
                Performa Cabang
              </h2>
              <button className="text-xs font-medium text-rose-600 hover:text-rose-700">
                Lihat Semua
              </button>
            </div>
            <div className="space-y-4">
              {branchPerformance.map((branch, index) => (
                <div key={index} className="p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-gray-900">{branch.name}</h3>
                    <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                      <FontAwesomeIcon icon={faArrowUp} className="w-3 h-3" />
                      {branch.growth}%
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Pendapatan</p>
                      <p className="text-sm font-bold text-gray-900">{formatCurrency(branch.revenue)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Transaksi</p>
                      <p className="text-sm font-bold text-gray-900">{branch.transactions}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Card className="p-6 hover:shadow-md transition-all border border-gray-100 group">
            <div className="flex items-start gap-4 mb-4">
              <div className="bg-gradient-to-br from-rose-500 to-pink-600 p-3 rounded-xl shadow-md group-hover:scale-110 transition-transform">
                <FontAwesomeIcon icon={faFileAlt} className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-gray-900 mb-1">Laporan Detail</h2>
                <p className="text-sm text-gray-600">
                  Lihat laporan pendapatan lengkap dengan filter periode
                </p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Harian</p>
                  <p className="text-sm font-bold text-gray-900">✓</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Mingguan</p>
                  <p className="text-sm font-bold text-gray-900">✓</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Bulanan</p>
                  <p className="text-sm font-bold text-gray-900">✓</p>
                </div>
              </div>
            </div>
            <Button
              onClick={() => router.push("/owner/reports")}
              className="w-full"
              style={{ backgroundColor: '#e11d48', color: 'white' }}
            >
              <FontAwesomeIcon icon={faFileAlt} className="w-4 h-4 mr-2" />
              Buka Laporan
              <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4 ml-2" />
            </Button>
          </Card>

          <Card className="p-6 hover:shadow-md transition-all border border-gray-100 group">
            <div className="flex items-start gap-4 mb-4">
              <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-3 rounded-xl shadow-md group-hover:scale-110 transition-transform">
                <FontAwesomeIcon icon={faChartBar} className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-gray-900 mb-1">Statistik & Grafik</h2>
                <p className="text-sm text-gray-600">
                  Visualisasi data dengan grafik interaktif
                </p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Charts</p>
                  <p className="text-sm font-bold text-gray-900">5+</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Metrics</p>
                  <p className="text-sm font-bold text-gray-900">10+</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Export</p>
                  <p className="text-sm font-bold text-gray-900">✓</p>
                </div>
              </div>
            </div>
            <Button
              onClick={() => router.push("/owner/statistics")}
              className="w-full"
              style={{ backgroundColor: '#8b5cf6', color: 'white' }}
            >
              <FontAwesomeIcon icon={faChartBar} className="w-4 h-4 mr-2" />
              Lihat Statistik
              <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4 ml-2" />
            </Button>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
