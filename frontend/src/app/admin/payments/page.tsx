"use client";

import { useState, useMemo } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Pagination from "@/components/ui/Pagination";
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from "@/components/ui/Table";
import { formatCurrency, formatDate } from "@/lib/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoneyBill, faQrcode, faSearch, faFileExport, faEye } from "@fortawesome/free-solid-svg-icons";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";

interface Payment {
  payment_id: number;
  ticket_number: string;
  license_plate: string;
  vehicle_type: string;
  entry_time: string;
  exit_time: string;
  duration_hours: number;
  amount: number;
  payment_method: "cash" | "qris";
  payment_status: "paid" | "pending" | "failed";
  branch_name: string;
  officer_name: string;
  created_at: string;
}

export default function PaymentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMethod, setFilterMethod] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterBranch, setFilterBranch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(15);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Generate dummy data
  const generatePayments = (): Payment[] => {
    const payments: Payment[] = [];
    const methods: ("cash" | "qris")[] = ["cash", "qris"];
    const branches = ["Cabang Pusat", "Cabang Utara", "Cabang Selatan"];
    const officers = ["Petugas Shift Pagi", "Petugas Shift Siang", "Petugas Shift Malam"];
    const vehicleTypes = ["Motor", "Mobil", "Bus/Truck"];
    
    for (let i = 1; i <= 100; i++) {
      const method = methods[Math.floor(Math.random() * methods.length)];
      
      // Cash: selalu paid atau kadang failed (tidak ada pending)
      // QRIS: bisa paid, pending, atau failed
      let status: "paid" | "pending" | "failed";
      if (method === "cash") {
        status = Math.random() > 0.95 ? "failed" : "paid"; // 95% paid, 5% failed
      } else {
        const rand = Math.random();
        if (rand > 0.85) status = "pending"; // 15% pending
        else if (rand > 0.80) status = "failed"; // 5% failed
        else status = "paid"; // 80% paid
      }
      
      const branch = branches[Math.floor(Math.random() * branches.length)];
      const officer = officers[Math.floor(Math.random() * officers.length)];
      const vehicleType = vehicleTypes[Math.floor(Math.random() * vehicleTypes.length)];
      const duration = Math.floor(Math.random() * 8) + 1;
      const baseRate = vehicleType === "Motor" ? 2000 : vehicleType === "Mobil" ? 5000 : 10000;
      const amount = duration === 1 ? baseRate : baseRate + ((duration - 1) * (baseRate / 2));
      
      const day = Math.floor(Math.random() * 10) + 1;
      const hour = Math.floor(Math.random() * 12) + 8;
      const minute = Math.floor(Math.random() * 60);
      
      payments.push({
        payment_id: i,
        ticket_number: `TKT-2025021${day.toString().padStart(2, '0')}-${i.toString().padStart(4, '0')}`,
        license_plate: `B ${1000 + i} ${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`,
        vehicle_type: vehicleType,
        entry_time: `2025-02-${day.toString().padStart(2, '0')} ${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00`,
        exit_time: `2025-02-${day.toString().padStart(2, '0')} ${(hour + duration).toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00`,
        duration_hours: duration,
        amount: amount,
        payment_method: method,
        payment_status: status,
        branch_name: branch,
        officer_name: officer,
        created_at: `2025-02-${day.toString().padStart(2, '0')} ${(hour + duration).toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00`,
      });
    }
    
    return payments.sort((a, b) => b.payment_id - a.payment_id);
  };

  const payments = generatePayments();

  const filteredPayments = payments.filter(payment => {
    const matchSearch = payment.ticket_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       payment.license_plate.toLowerCase().includes(searchTerm.toLowerCase());
    const matchMethod = filterMethod === "" || payment.payment_method === filterMethod;
    const matchStatus = filterStatus === "" || payment.payment_status === filterStatus;
    const matchBranch = filterBranch === "" || payment.branch_name === filterBranch;
    return matchSearch && matchMethod && matchStatus && matchBranch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const paginatedPayments = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredPayments.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredPayments, currentPage, itemsPerPage]);

  const getStatusColor = (status: string) => {
    if (status === "paid") return "bg-green-100 text-green-700";
    if (status === "pending") return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  };

  const getMethodIcon = (method: string) => {
    return method === "cash" ? faMoneyBill : faQrcode;
  };

  const handleViewDetail = (payment: Payment) => {
    setSelectedPayment(payment);
    setShowDetailModal(true);
  };

  const handleExport = () => {
    alert("Export to Excel/PDF - Feature coming soon!");
  };

  // Calculate summary
  const totalRevenue = filteredPayments
    .filter(p => p.payment_status === "paid")
    .reduce((sum, p) => sum + p.amount, 0);
  const totalCash = filteredPayments
    .filter(p => p.payment_status === "paid" && p.payment_method === "cash")
    .reduce((sum, p) => sum + p.amount, 0);
  const totalQris = filteredPayments
    .filter(p => p.payment_status === "paid" && p.payment_method === "qris")
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">History Pembayaran</h1>
            <p className="text-gray-600 mt-1">Riwayat transaksi pembayaran parkir</p>
          </div>
          <Button onClick={handleExport}>
            <FontAwesomeIcon icon={faFileExport} className="w-4 h-4 mr-2" />
            Export Data
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Card className="p-5 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                  Total Pendapatan
                </p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalRevenue)}</p>
              </div>
              <div className="bg-emerald-500 p-3 rounded-lg">
                <FontAwesomeIcon icon={faMoneyBill} className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>
          <Card className="p-5 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                  Pembayaran Cash
                </p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalCash)}</p>
              </div>
              <div className="bg-blue-500 p-3 rounded-lg">
                <FontAwesomeIcon icon={faMoneyBill} className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>
          <Card className="p-5 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                  Pembayaran QRIS
                </p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalQris)}</p>
              </div>
              <div className="bg-purple-500 p-3 rounded-lg">
                <FontAwesomeIcon icon={faQrcode} className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-6">
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="relative">
              <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Cari tiket/plat..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              options={[
                { value: "", label: "Semua Metode" },
                { value: "cash", label: "Cash" },
                { value: "qris", label: "QRIS" },
              ]}
              value={filterMethod}
              onChange={(e) => setFilterMethod(e.target.value)}
            />
            <Select
              options={[
                { value: "", label: "Semua Status" },
                { value: "paid", label: "Paid" },
                { value: "pending", label: "Pending" },
                { value: "failed", label: "Failed" },
              ]}
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            />
            <Select
              options={[
                { value: "", label: "Semua Cabang" },
                { value: "Cabang Pusat", label: "Cabang Pusat" },
                { value: "Cabang Utara", label: "Cabang Utara" },
                { value: "Cabang Selatan", label: "Cabang Selatan" },
              ]}
              value={filterBranch}
              onChange={(e) => setFilterBranch(e.target.value)}
            />
          </div>

          {/* Table */}
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Tiket</TableHeader>
                <TableHeader>Plat Nomor</TableHeader>
                <TableHeader>Jenis</TableHeader>
                <TableHeader>Durasi</TableHeader>
                <TableHeader>Jumlah</TableHeader>
                <TableHeader>Metode</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader>Cabang</TableHeader>
                <TableHeader>Waktu</TableHeader>
                <TableHeader>Aksi</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedPayments.map((payment) => (
                <TableRow key={payment.payment_id}>
                  <TableCell className="font-mono text-xs">{payment.ticket_number}</TableCell>
                  <TableCell className="font-medium">{payment.license_plate}</TableCell>
                  <TableCell>{payment.vehicle_type}</TableCell>
                  <TableCell>{payment.duration_hours} jam</TableCell>
                  <TableCell className="font-bold">{formatCurrency(payment.amount)}</TableCell>
                  <TableCell>
                    <span className="flex items-center gap-2">
                      <FontAwesomeIcon icon={getMethodIcon(payment.payment_method)} className="w-4 h-4" />
                      {payment.payment_method.toUpperCase()}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(payment.payment_status)}`}>
                      {payment.payment_status.toUpperCase()}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm">{payment.branch_name}</TableCell>
                  <TableCell className="text-xs">{formatDate(payment.created_at)}</TableCell>
                  <TableCell>
                    <Button size="sm" variant="ghost" onClick={() => handleViewDetail(payment)}>
                      <FontAwesomeIcon icon={faEye} className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredPayments.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              itemsPerPage={itemsPerPage}
              totalItems={filteredPayments.length}
            />
          )}
        </Card>

        {/* Detail Modal */}
        <Modal
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          title="Detail Pembayaran"
          size="md"
        >
          {selectedPayment && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Nomor Tiket</p>
                  <p className="font-mono text-sm font-medium">{selectedPayment.ticket_number}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Plat Nomor</p>
                  <p className="text-sm font-medium">{selectedPayment.license_plate}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Jenis Kendaraan</p>
                  <p className="text-sm font-medium">{selectedPayment.vehicle_type}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Cabang</p>
                  <p className="text-sm font-medium">{selectedPayment.branch_name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Waktu Masuk</p>
                  <p className="text-sm">{formatDate(selectedPayment.entry_time)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Waktu Keluar</p>
                  <p className="text-sm">{formatDate(selectedPayment.exit_time)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Durasi Parkir</p>
                  <p className="text-sm font-medium">{selectedPayment.duration_hours} Jam</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Total Biaya</p>
                  <p className="text-lg font-bold text-emerald-600">{formatCurrency(selectedPayment.amount)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Metode Pembayaran</p>
                  <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    <FontAwesomeIcon icon={getMethodIcon(selectedPayment.payment_method)} />
                    {selectedPayment.payment_method.toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Status</p>
                  <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(selectedPayment.payment_status)}`}>
                    {selectedPayment.payment_status.toUpperCase()}
                  </span>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-gray-500 mb-1">Petugas</p>
                  <p className="text-sm font-medium">{selectedPayment.officer_name}</p>
                </div>
              </div>
              <div className="pt-4 border-t">
                <Button onClick={() => setShowDetailModal(false)} className="w-full">
                  Tutup
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </DashboardLayout>
  );
}
