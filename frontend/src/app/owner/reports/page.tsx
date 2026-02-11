"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from "@/components/ui/Table";
import { formatCurrency } from "@/lib/utils";
import { 
  FileText, 
  Download, 
  Filter, 
  Calendar, 
  DollarSign,
  CreditCard,
  Banknote,
  Car,
  Loader2,
  RefreshCw
} from "lucide-react";
import { reportService } from "@/services/reportService";
import { branchService } from "@/services/branchService";

interface DailyRevenue {
  date: string;
  branch_name: string;
  total_transactions: number;
  total_revenue: number;
  cash_count: number;
  qris_count: number;
  cash_revenue: number;
  qris_revenue: number;
}

interface Transaction {
  transaction_id: number;
  ticket_number: string;
  entry_time: string;
  exit_time: string;
  duration_hours: number;
  total_amount: number;
  payment_method: string;
  payment_status: string;
  license_plate: string;
  vehicle_type: string;
  area_name: string;
  branch_name: string;
  officer_name: string;
}

interface RevenueStats {
  total_revenue: number;
  total_transactions: number;
  avg_duration: number;
  revenue_by_method: Array<{ payment_method: string; total: number; count: number }>;
  revenue_by_vehicle: Array<{ vehicle_type: string; total: number; count: number }>;
  revenue_by_branch: Array<{ branch_name: string; total: number; count: number }>;
}

interface Branch {
  branch_id: number;
  branch_name: string;
}

export default function ReportsPage() {
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return date.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [selectedBranch, setSelectedBranch] = useState("");
  const [branches, setBranches] = useState<Branch[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [loadingTransactions, setLoadingTransactions] = useState(false);
  const [dailyRevenue, setDailyRevenue] = useState<DailyRevenue[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState<RevenueStats | null>(null);
  const [activeTab, setActiveTab] = useState<'summary' | 'transactions'>('summary');

  useEffect(() => {
    fetchBranches();
  }, []);

  useEffect(() => {
    fetchReportData();
  }, [startDate, endDate, selectedBranch]);

  const fetchBranches = async () => {
    try {
      const data = await branchService.getAll();
      setBranches(data);
    } catch (error) {
      console.error('❌ [fetchBranches] Error:', error);
    }
  };

  const fetchReportData = async () => {
    try {
      setLoading(true);
      console.log('🔄 [fetchReportData] Fetching report data...');
      
      const params = {
        start_date: startDate,
        end_date: endDate,
        ...(selectedBranch && { branch_id: parseInt(selectedBranch) })
      };

      const [revenueResponse, statsResponse] = await Promise.all([
        reportService.getDailyRevenue(params),
        reportService.getStats(params)
      ]);

      console.log('✅ [fetchReportData] Daily revenue:', revenueResponse);
      console.log('✅ [fetchReportData] Stats:', statsResponse);

      setDailyRevenue(revenueResponse.data || []);
      setStats(statsResponse.data || null);
    } catch (error) {
      console.error('❌ [fetchReportData] Error:', error);
      alert('Gagal memuat data laporan');
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      setLoadingTransactions(true);
      console.log('🔄 [fetchTransactions] Fetching transactions...');
      
      const params = {
        start_date: startDate,
        end_date: endDate,
        ...(selectedBranch && { branch_id: parseInt(selectedBranch) })
      };

      const response = await reportService.getTransactions(params);
      console.log('✅ [fetchTransactions] Transactions:', response);
      
      setTransactions(response.data || []);
    } catch (error) {
      console.error('❌ [fetchTransactions] Error:', error);
      alert('Gagal memuat data transaksi');
    } finally {
      setLoadingTransactions(false);
    }
  };

  const handleRefresh = () => {
    fetchReportData();
    if (activeTab === 'transactions') {
      fetchTransactions();
    }
  };

  const handleExportPDF = () => {
    alert('Fitur export PDF akan segera tersedia');
  };

  const handleExportExcel = () => {
    alert('Fitur export Excel akan segera tersedia');
  };

  const handleTabChange = (tab: 'summary' | 'transactions') => {
    setActiveTab(tab);
    if (tab === 'transactions' && transactions.length === 0) {
      fetchTransactions();
    }
  };

  const totalRevenue = dailyRevenue.reduce((sum, r) => sum + (r.total_revenue || 0), 0);
  const totalTransactions = dailyRevenue.reduce((sum, r) => sum + (r.total_transactions || 0), 0);
  const totalCash = dailyRevenue.reduce((sum, r) => sum + (r.cash_count || 0), 0);
  const totalQris = dailyRevenue.reduce((sum, r) => sum + (r.qris_count || 0), 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Laporan Pendapatan</h1>
            <p className="text-gray-600 mt-1">Laporan detail transaksi dan pendapatan real-time</p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={handleRefresh}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button variant="secondary" onClick={handleExportExcel}>
              <Download className="w-4 h-4 mr-2" />
              Excel
            </Button>
            <Button onClick={handleExportPDF}>
              <FileText className="w-4 h-4 mr-2" />
              PDF
            </Button>
          </div>
        </div>

        {/* Filter Card */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <h3 className="font-semibold text-gray-900">Filter Laporan</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Tanggal Mulai"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <Input
              label="Tanggal Akhir"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
            <Select
              label="Cabang"
              options={[
                { value: "", label: "Semua Cabang" },
                ...branches.map(b => ({ 
                  value: b.branch_id.toString(), 
                  label: b.branch_name 
                }))
              ]}
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
            />
          </div>
        </Card>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Pendapatan</p>
                <p className="text-2xl font-bold text-emerald-600">
                  {loading ? '-' : formatCurrency(totalRevenue)}
                </p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Car className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Transaksi</p>
                <p className="text-2xl font-bold text-blue-600">
                  {loading ? '-' : totalTransactions.toLocaleString('id-ID')}
                </p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Banknote className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pembayaran Cash</p>
                <p className="text-2xl font-bold text-purple-600">
                  {loading ? '-' : totalCash.toLocaleString('id-ID')}
                </p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pembayaran QRIS</p>
                <p className="text-2xl font-bold text-orange-600">
                  {loading ? '-' : totalQris.toLocaleString('id-ID')}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Stats by Category */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Pendapatan per Metode</h3>
              <div className="space-y-3">
                {stats.revenue_by_method?.map((method) => (
                  <div key={method.payment_method} className="flex justify-between items-center">
                    <span className="capitalize">{method.payment_method}</span>
                    <span className="font-semibold">{formatCurrency(method.total)}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Pendapatan per Kendaraan</h3>
              <div className="space-y-3">
                {stats.revenue_by_vehicle?.map((vehicle) => (
                  <div key={vehicle.vehicle_type} className="flex justify-between items-center">
                    <span>{vehicle.vehicle_type}</span>
                    <span className="font-semibold">{formatCurrency(vehicle.total)}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Pendapatan per Cabang</h3>
              <div className="space-y-3">
                {stats.revenue_by_branch?.map((branch) => (
                  <div key={branch.branch_name} className="flex justify-between items-center">
                    <span>{branch.branch_name}</span>
                    <span className="font-semibold">{formatCurrency(branch.total)}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 border-b">
          <button
            onClick={() => handleTabChange('summary')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'summary'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Ringkasan Harian
          </button>
          <button
            onClick={() => handleTabChange('transactions')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'transactions'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Detail Transaksi
          </button>
        </div>

        {/* Summary Tab */}
        {activeTab === 'summary' && (
          <Card className="p-6">
            {loading ? (
              <div className="text-center py-12">
                <Loader2 className="w-12 h-12 text-primary-600 mx-auto mb-4 animate-spin" />
                <p className="text-gray-600">Memuat data laporan...</p>
              </div>
            ) : dailyRevenue.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">Tidak ada data untuk periode ini</p>
                <p className="text-gray-400 text-sm mt-1">Coba ubah rentang tanggal filter</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableHeader>Tanggal</TableHeader>
                      <TableHeader>Cabang</TableHeader>
                      <TableHeader>Total Transaksi</TableHeader>
                      <TableHeader>Cash</TableHeader>
                      <TableHeader>QRIS</TableHeader>
                      <TableHeader>Total Pendapatan</TableHeader>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dailyRevenue.map((report, index) => (
                      <TableRow key={index}>
                        <TableCell>{new Date(report.date).toLocaleDateString('id-ID', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}</TableCell>
                        <TableCell className="font-medium">{report.branch_name}</TableCell>
                        <TableCell>{report.total_transactions}</TableCell>
                        <TableCell>{report.cash_count}</TableCell>
                        <TableCell>{report.qris_count}</TableCell>
                        <TableCell className="font-bold text-emerald-600">
                          {formatCurrency(report.total_revenue)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </Card>
        )}

        {/* Transactions Tab */}
        {activeTab === 'transactions' && (
          <Card className="p-6">
            {loadingTransactions ? (
              <div className="text-center py-12">
                <Loader2 className="w-12 h-12 text-primary-600 mx-auto mb-4 animate-spin" />
                <p className="text-gray-600">Memuat data transaksi...</p>
              </div>
            ) : transactions.length === 0 ? (
              <div className="text-center py-12">
                <Car className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">Tidak ada transaksi untuk periode ini</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableHeader>No</TableHeader>
                      <TableHeader>No. Tiket</TableHeader>
                      <TableHeader>Plat Nomor</TableHeader>
                      <TableHeader>Jenis</TableHeader>
                      <TableHeader>Cabang</TableHeader>
                      <TableHeader>Masuk</TableHeader>
                      <TableHeader>Keluar</TableHeader>
                      <TableHeader>Durasi (jam)</TableHeader>
                      <TableHeader>Metode</TableHeader>
                      <TableHeader>Total</TableHeader>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {transactions.map((t, index) => (
                      <TableRow key={t.transaction_id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell className="font-medium">{t.ticket_number}</TableCell>
                        <TableCell>{t.license_plate}</TableCell>
                        <TableCell>{t.vehicle_type}</TableCell>
                        <TableCell>{t.branch_name}</TableCell>
                        <TableCell>{new Date(t.entry_time).toLocaleString('id-ID')}</TableCell>
                        <TableCell>{t.exit_time ? new Date(t.exit_time).toLocaleString('id-ID') : '-'}</TableCell>
                        <TableCell>{t.duration_hours}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 text-xs font-medium rounded ${
                            t.payment_method === 'cash' 
                              ? 'bg-purple-100 text-purple-700' 
                              : 'bg-orange-100 text-orange-700'
                          }`}>
                            {t.payment_method?.toUpperCase()}
                          </span>
                        </TableCell>
                        <TableCell className="font-bold text-emerald-600">
                          {formatCurrency(t.total_amount)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
