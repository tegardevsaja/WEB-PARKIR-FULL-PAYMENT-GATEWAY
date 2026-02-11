"use client";

import { useState, useMemo } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Pagination from "@/components/ui/Pagination";
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from "@/components/ui/Table";
import { formatDate } from "@/lib/utils";
import { Settings, Search } from "lucide-react";

interface Log {
  log_id: number;
  user_name: string;
  action: string;
  table_name: string;
  description: string;
  ip_address: string;
  created_at: string;
}

export default function LogsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAction, setFilterAction] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Dummy data - Generate more logs for pagination demo
  const generateLogs = (): Log[] => {
    const baseLog: Log[] = [
      { log_id: 1, user_name: "Administrator Utama", action: "LOGIN", table_name: "-", description: "Admin login successful", ip_address: "127.0.0.1", created_at: "2025-02-11 08:00:00" },
      { log_id: 2, user_name: "Petugas Shift Pagi", action: "LOGIN", table_name: "-", description: "Petugas login successful", ip_address: "127.0.0.1", created_at: "2025-02-11 08:15:00" },
      { log_id: 3, user_name: "Petugas Shift Pagi", action: "VEHICLE_ENTRY", table_name: "transactions", description: "Kendaraan B 1234 ABC masuk parkir", ip_address: "127.0.0.1", created_at: "2025-02-11 08:30:00" },
      { log_id: 4, user_name: "Petugas Shift Pagi", action: "VEHICLE_EXIT", table_name: "transactions", description: "Kendaraan B 1234 ABC keluar dan bayar", ip_address: "127.0.0.1", created_at: "2025-02-11 10:30:00" },
      { log_id: 5, user_name: "Administrator Utama", action: "CREATE_USER", table_name: "users", description: "Membuat user baru: petugas3", ip_address: "127.0.0.1", created_at: "2025-02-11 11:00:00" },
      { log_id: 6, user_name: "Administrator Utama", action: "UPDATE_RATE", table_name: "parking_rates", description: "Update tarif parkir Motor di Cabang Pusat", ip_address: "127.0.0.1", created_at: "2025-02-11 11:30:00" },
      { log_id: 7, user_name: "Petugas Shift Siang", action: "LOGIN", table_name: "-", description: "Petugas login successful", ip_address: "127.0.0.1", created_at: "2025-02-11 14:00:00" },
      { log_id: 8, user_name: "Petugas Shift Siang", action: "VEHICLE_ENTRY", table_name: "transactions", description: "Kendaraan B 5678 XYZ masuk parkir", ip_address: "127.0.0.1", created_at: "2025-02-11 14:15:00" },
      { log_id: 9, user_name: "Owner Bisnis", action: "LOGIN", table_name: "-", description: "Owner login successful", ip_address: "127.0.0.1", created_at: "2025-02-11 15:00:00" },
      { log_id: 10, user_name: "Owner Bisnis", action: "VIEW_REPORT", table_name: "-", description: "Melihat laporan pendapatan bulan ini", ip_address: "127.0.0.1", created_at: "2025-02-11 15:05:00" },
    ];

    // Generate more dummy logs
    const actions = ["LOGIN", "VEHICLE_ENTRY", "VEHICLE_EXIT", "CREATE_USER", "UPDATE_RATE", "DELETE_USER", "VIEW_REPORT"];
    const users = ["Administrator Utama", "Petugas Shift Pagi", "Petugas Shift Siang", "Owner Bisnis"];
    const tables = ["-", "users", "transactions", "parking_rates", "branches"];
    
    for (let i = 11; i <= 50; i++) {
      const action = actions[Math.floor(Math.random() * actions.length)];
      const user = users[Math.floor(Math.random() * users.length)];
      const table = tables[Math.floor(Math.random() * tables.length)];
      const hour = 8 + Math.floor(Math.random() * 10);
      const minute = Math.floor(Math.random() * 60);
      
      baseLog.push({
        log_id: i,
        user_name: user,
        action: action,
        table_name: table,
        description: `${action} - Activity log entry #${i}`,
        ip_address: `192.168.1.${Math.floor(Math.random() * 255)}`,
        created_at: `2025-02-11 ${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00`
      });
    }
    
    return baseLog.sort((a, b) => b.log_id - a.log_id); // Sort by newest first
  };

  const logs = generateLogs();

  const filteredLogs = logs.filter(log => {
    const matchSearch = log.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       log.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchFilter = filterAction === "" || log.action === filterAction;
    return matchSearch && matchFilter;
  });

  // Pagination
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const paginatedLogs = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredLogs.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredLogs, currentPage, itemsPerPage]);

  const getActionColor = (action: string) => {
    if (action === "LOGIN") return "bg-blue-100 text-blue-700";
    if (action.includes("CREATE")) return "bg-green-100 text-green-700";
    if (action.includes("UPDATE")) return "bg-yellow-100 text-yellow-700";
    if (action.includes("DELETE")) return "bg-red-100 text-red-700";
    if (action.includes("VEHICLE")) return "bg-purple-100 text-purple-700";
    return "bg-gray-100 text-gray-700";
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Log Aktivitas</h1>
          <p className="text-gray-600 mt-1">Riwayat aktivitas sistem untuk audit trail</p>
        </div>

        <Card className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Cari log..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              options={[
                { value: "", label: "Semua Aksi" },
                { value: "LOGIN", label: "Login" },
                { value: "CREATE_USER", label: "Create User" },
                { value: "UPDATE_RATE", label: "Update Rate" },
                { value: "VEHICLE_ENTRY", label: "Vehicle Entry" },
                { value: "VEHICLE_EXIT", label: "Vehicle Exit" },
              ]}
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
            />
          </div>

          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>ID</TableHeader>
                <TableHeader>User</TableHeader>
                <TableHeader>Aksi</TableHeader>
                <TableHeader>Tabel</TableHeader>
                <TableHeader>Deskripsi</TableHeader>
                <TableHeader>IP Address</TableHeader>
                <TableHeader>Waktu</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedLogs.map((log) => (
                <TableRow key={log.log_id}>
                  <TableCell>{log.log_id}</TableCell>
                  <TableCell className="font-medium">{log.user_name}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 text-xs font-medium rounded ${getActionColor(log.action)}`}>
                      {log.action}
                    </span>
                  </TableCell>
                  <TableCell>{log.table_name}</TableCell>
                  <TableCell>{log.description}</TableCell>
                  <TableCell className="font-mono text-xs">{log.ip_address}</TableCell>
                  <TableCell className="text-sm">{formatDate(log.created_at)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {paginatedLogs.length === 0 && (
            <div className="text-center py-12">
              <Settings className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">Tidak ada log yang ditemukan</p>
            </div>
          )}

          {filteredLogs.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              itemsPerPage={itemsPerPage}
              totalItems={filteredLogs.length}
            />
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}
