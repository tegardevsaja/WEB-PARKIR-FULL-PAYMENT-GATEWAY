"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from "@/components/ui/Table";
import { formatCurrency, formatDate } from "@/lib/utils";
import { FileText, Download, Filter, Calendar } from "lucide-react";

interface Report {
  date: string;
  branch: string;
  total_transactions: number;
  cash_count: number;
  qris_count: number;
  total_revenue: number;
}

export default function ReportsPage() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");

  // Dummy data
  const reports: Report[] = [
    { date: "2025-02-11", branch: "Cabang Pusat", total_transactions: 87, cash_count: 45, qris_count: 42, total_revenue: 2450000 },
    { date: "2025-02-10", branch: "Cabang Pusat", total_transactions: 92, cash_count: 50, qris_count: 42, total_revenue: 2680000 },
    { date: "2025-02-09", branch: "Cabang Pusat", total_transactions: 78, cash_count: 38, qris_count: 40, total_revenue: 2150000 },
    { date: "2025-02-11", branch: "Cabang Utara", total_transactions: 65, cash_count: 32, qris_count: 33, total_revenue: 1850000 },
    { date: "2025-02-10", branch: "Cabang Utara", total_transactions: 71, cash_count: 35, qris_count: 36, total_revenue: 2020000 },
    { date: "2025-02-11", branch: "Cabang Selatan", total_transactions: 95, cash_count: 48, qris_count: 47, total_revenue: 2890000 },
    { date: "2025-02-10", branch: "Cabang Selatan", total_transactions: 88, cash_count: 44, qris_count: 44, total_revenue: 2650000 },
  ];

  const filteredReports = reports.filter(report => {
    const matchBranch = selectedBranch === "" || report.branch === selectedBranch;
    return matchBranch;
  });

  const totalRevenue = filteredReports.reduce((sum, r) => sum + r.total_revenue, 0);
  const totalTransactions = filteredReports.reduce((sum, r) => sum + r.total_transactions, 0);
  const totalCash = filteredReports.reduce((sum, r) => sum + r.cash_count, 0);
  const totalQris = filteredReports.reduce((sum, r) => sum + r.qris_count, 0);

  const handleExportPDF = () => {
    alert("Export laporan ke PDF");
  };

  const handleExportExcel = () => {
    alert("Export laporan ke Excel");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Laporan Pendapatan</h1>
            <p className="text-gray-600 mt-1">Laporan detail transaksi dan pendapatan</p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={handleExportExcel}>
              <Download className="w-4 h-4 mr-2" />
              Excel
            </Button>
            <Button onClick={handleExportPDF}>
              <Download className="w-4 h-4 mr-2" />
              PDF
            </Button>
          </div>
        </div>

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
                { value: "Cabang Pusat", label: "Cabang Pusat" },
                { value: "Cabang Utara", label: "Cabang Utara" },
                { value: "Cabang Selatan", label: "Cabang Selatan" },
              ]}
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
            />
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6">
            <p className="text-sm text-gray-600 mb-2">Total Pendapatan</p>
            <p className="text-2xl font-bold text-emerald-600">{formatCurrency(totalRevenue)}</p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-gray-600 mb-2">Total Transaksi</p>
            <p className="text-2xl font-bold text-blue-600">{totalTransactions}</p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-gray-600 mb-2">Pembayaran Cash</p>
            <p className="text-2xl font-bold text-purple-600">{totalCash}</p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-gray-600 mb-2">Pembayaran QRIS</p>
            <p className="text-2xl font-bold text-orange-600">{totalQris}</p>
          </Card>
        </div>

        <Card className="p-6">
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
              {filteredReports.map((report, index) => (
                <TableRow key={index}>
                  <TableCell>{new Date(report.date).toLocaleDateString("id-ID")}</TableCell>
                  <TableCell className="font-medium">{report.branch}</TableCell>
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
        </Card>
      </div>
    </DashboardLayout>
  );
}
