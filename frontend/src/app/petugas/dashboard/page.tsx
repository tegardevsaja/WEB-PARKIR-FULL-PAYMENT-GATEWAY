"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faCar, 
  faDollarSign, 
  faClock, 
  faArrowRight, 
  faChartLine,
  faRightToBracket,
  faRightFromBracket,
  faWallet,
  faChartArea,
  faArrowUp,
  faArrowDown,
} from "@fortawesome/free-solid-svg-icons";

interface PetugasStats {
  activeTransactions: number;
  todayTransactions: number;
  todayRevenue: number;
  todayEntry: number;
  todayExit: number;
  averageTime: number;
}

export default function PetugasDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<PetugasStats>({
    activeTransactions: 0,
    todayTransactions: 0,
    todayRevenue: 0,
    todayEntry: 0,
    todayExit: 0,
    averageTime: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setTimeout(() => {
      setStats({
        activeTransactions: 12,
        todayTransactions: 45,
        todayRevenue: 850000,
        todayEntry: 28,
        todayExit: 17,
        averageTime: 2.3,
      });
      setLoading(false);
    }, 500);
  };

  const recentTransactions = [
    { id: 1, plate: "B 1234 XYZ", type: "Mobil", action: "Masuk", time: "5 menit lalu", status: "active" },
    { id: 2, plate: "D 5678 ABC", type: "Motor", action: "Keluar", time: "12 menit lalu", status: "completed", amount: 5000 },
    { id: 3, plate: "F 9012 DEF", type: "Mobil", action: "Keluar", time: "18 menit lalu", status: "completed", amount: 15000 },
    { id: 4, plate: "B 3456 GHI", type: "Motor", action: "Masuk", time: "25 menit lalu", status: "active" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard Petugas</h1>
            <p className="text-sm text-gray-500 mt-1">Kelola transaksi parkir dengan cepat dan mudah</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200 shadow-sm">
            <FontAwesomeIcon icon={faClock} className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">
              {new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Card className="p-5 hover:shadow-md transition-all border border-gray-100 bg-gradient-to-br from-blue-50 to-white">
            <div className="flex items-start justify-between mb-4">
              <div className="bg-blue-500 p-2.5 rounded-lg shadow-sm">
                <FontAwesomeIcon icon={faClock} className="w-5 h-5 text-white" />
              </div>
              <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                <FontAwesomeIcon icon={faChartArea} className="w-3 h-3" />
                Live
              </div>
            </div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
              Kendaraan Aktif
            </p>
            <p className="text-3xl font-bold text-gray-900 mb-1">{stats.activeTransactions}</p>
            <p className="text-xs text-gray-600">Sedang parkir saat ini</p>
          </Card>

          <Card className="p-5 hover:shadow-md transition-all border border-gray-100 bg-gradient-to-br from-emerald-50 to-white">
            <div className="flex items-start justify-between mb-4">
              <div className="bg-emerald-500 p-2.5 rounded-lg shadow-sm">
                <FontAwesomeIcon icon={faCar} className="w-5 h-5 text-white" />
              </div>
              <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                <FontAwesomeIcon icon={faArrowUp} className="w-3 h-3" />
                +12%
              </div>
            </div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
              Transaksi Hari Ini
            </p>
            <p className="text-3xl font-bold text-gray-900 mb-1">{stats.todayTransactions}</p>
            <p className="text-xs text-gray-600">
              <span className="text-emerald-600 font-semibold">{stats.todayEntry}</span> masuk • {" "}
              <span className="text-orange-600 font-semibold">{stats.todayExit}</span> keluar
            </p>
          </Card>

          <Card className="p-5 hover:shadow-md transition-all border border-gray-100 bg-gradient-to-br from-purple-50 to-white">
            <div className="flex items-start justify-between mb-4">
              <div className="bg-purple-500 p-2.5 rounded-lg shadow-sm">
                <FontAwesomeIcon icon={faDollarSign} className="w-5 h-5 text-white" />
              </div>
              <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
                <FontAwesomeIcon icon={faArrowUp} className="w-3 h-3" />
                +8%
              </div>
            </div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
              Pendapatan Hari Ini
            </p>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              {formatCurrency(stats.todayRevenue)}
            </p>
            <p className="text-xs text-gray-600">Rata-rata {formatCurrency(stats.todayRevenue / stats.todayTransactions)} per transaksi</p>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Card className="p-6 hover:shadow-md transition-all border border-gray-100 group">
            <div className="flex items-start gap-4 mb-4">
              <div className="bg-gradient-to-br from-rose-500 to-pink-600 p-3 rounded-xl shadow-md group-hover:scale-110 transition-transform">
                <FontAwesomeIcon icon={faRightToBracket} className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-gray-900 mb-1">
                  Kendaraan Masuk
                </h2>
                <p className="text-sm text-gray-600">
                  Daftarkan kendaraan baru yang masuk area parkir
                </p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Hari ini</span>
                <span className="font-bold text-gray-900">{stats.todayEntry} kendaraan</span>
              </div>
            </div>
            <Button
              onClick={() => router.push("/petugas/kasir")}
              className="w-full"
              style={{ backgroundColor: '#e11d48', color: 'white' }}
            >
              <FontAwesomeIcon icon={faRightToBracket} className="w-4 h-4 mr-2" />
              Proses Kendaraan Masuk
              <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4 ml-2" />
            </Button>
          </Card>

          <Card className="p-6 hover:shadow-md transition-all border border-gray-100 group">
            <div className="flex items-start gap-4 mb-4">
              <div className="bg-gradient-to-br from-emerald-500 to-green-600 p-3 rounded-xl shadow-md group-hover:scale-110 transition-transform">
                <FontAwesomeIcon icon={faRightFromBracket} className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-gray-900 mb-1">
                  Kendaraan Keluar
                </h2>
                <p className="text-sm text-gray-600">
                  Proses pembayaran dan kendaraan keluar
                </p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Hari ini</span>
                <span className="font-bold text-gray-900">{stats.todayExit} kendaraan</span>
              </div>
            </div>
            <Button
              onClick={() => router.push("/petugas/kasir")}
              className="w-full"
              style={{ backgroundColor: '#10b981', color: 'white' }}
            >
              <FontAwesomeIcon icon={faRightFromBracket} className="w-4 h-4 mr-2" />
              Proses Kendaraan Keluar
              <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4 ml-2" />
            </Button>
          </Card>
        </div>

        {/* Recent Transactions */}
        <Card className="p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <FontAwesomeIcon icon={faChartArea} className="w-5 h-5 text-rose-500" />
              Transaksi Terbaru
            </h2>
            <button className="text-xs font-medium text-rose-600 hover:text-rose-700">
              Lihat Semua
            </button>
          </div>
          <div className="space-y-3">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
                <div className={`p-2.5 rounded-lg ${
                  transaction.action === "Masuk" ? "bg-blue-50" : "bg-emerald-50"
                }`}>
                  <FontAwesomeIcon 
                    icon={transaction.action === "Masuk" ? faRightToBracket : faRightFromBracket} 
                    className={`w-5 h-5 ${transaction.action === "Masuk" ? "text-blue-600" : "text-emerald-600"}`} 
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-bold text-gray-900">{transaction.plate}</p>
                    <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-700 rounded">
                      {transaction.type}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">{transaction.time}</p>
                </div>
                <div className="text-right">
                  {transaction.status === "active" ? (
                    <span className="px-3 py-1 text-xs font-semibold bg-blue-100 text-blue-700 rounded-full">
                      Aktif
                    </span>
                  ) : (
                    <div>
                      <p className="text-sm font-bold text-gray-900">
                        {formatCurrency(transaction.amount || 0)}
                      </p>
                      <span className="px-3 py-1 text-xs font-semibold bg-emerald-100 text-emerald-700 rounded-full">
                        Selesai
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
