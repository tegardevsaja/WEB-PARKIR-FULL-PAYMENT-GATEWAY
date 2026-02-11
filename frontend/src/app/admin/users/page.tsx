"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Modal from "@/components/ui/Modal";
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from "@/components/ui/Table";
import { Users, Plus, Edit, Trash2, Search } from "lucide-react";

interface User {
  user_id: number;
  username: string;
  full_name: string;
  role: string;
  branch_name: string;
  is_active: boolean;
}

export default function UsersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Dummy data
  const users: User[] = [
    { user_id: 1, username: "admin", full_name: "Administrator Utama", role: "admin", branch_name: "Cabang Pusat", is_active: true },
    { user_id: 2, username: "admin2", full_name: "Administrator Cabang Utara", role: "admin", branch_name: "Cabang Utara", is_active: true },
    { user_id: 3, username: "petugas1", full_name: "Petugas Shift Pagi", role: "petugas", branch_name: "Cabang Pusat", is_active: true },
    { user_id: 4, username: "petugas2", full_name: "Petugas Shift Siang", role: "petugas", branch_name: "Cabang Pusat", is_active: true },
    { user_id: 5, username: "petugas3", full_name: "Petugas Cabang Utara", role: "petugas", branch_name: "Cabang Utara", is_active: true },
    { user_id: 6, username: "owner", full_name: "Owner Bisnis", role: "owner", branch_name: "-", is_active: true },
  ];

  const filteredUsers = users.filter(user =>
    user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDelete = (user: User) => {
    if (confirm(`Hapus user ${user.full_name}?`)) {
      alert("User berhasil dihapus!");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manajemen User</h1>
            <p className="text-gray-600 mt-1">Kelola user sistem (Admin, Petugas, Owner)</p>
          </div>
          <Button onClick={handleAdd}>
            <Plus className="w-4 h-4 mr-2" />
            Tambah User
          </Button>
        </div>

        <Card className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Cari user..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>ID</TableHeader>
                <TableHeader>Username</TableHeader>
                <TableHeader>Nama Lengkap</TableHeader>
                <TableHeader>Role</TableHeader>
                <TableHeader>Cabang</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader>Aksi</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.user_id}>
                  <TableCell>{user.user_id}</TableCell>
                  <TableCell className="font-medium">{user.username}</TableCell>
                  <TableCell>{user.full_name}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                      user.role === "admin" ? "bg-purple-100 text-purple-700" :
                      user.role === "petugas" ? "bg-blue-100 text-blue-700" :
                      "bg-green-100 text-green-700"
                    }`}>
                      {user.role.toUpperCase()}
                    </span>
                  </TableCell>
                  <TableCell>{user.branch_name}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                      user.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}>
                      {user.is_active ? "Aktif" : "Non-aktif"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" onClick={() => handleEdit(user)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleDelete(user)}>
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={selectedUser ? "Edit User" : "Tambah User"}
          size="md"
        >
          <form className="space-y-4">
            <Input
              label="Username"
              type="text"
              placeholder="Masukkan username"
              defaultValue={selectedUser?.username}
            />
            <Input
              label="Password"
              type="password"
              placeholder={selectedUser ? "Kosongkan jika tidak diubah" : "Masukkan password"}
            />
            <Input
              label="Nama Lengkap"
              type="text"
              placeholder="Masukkan nama lengkap"
              defaultValue={selectedUser?.full_name}
            />
            <Select
              label="Role"
              options={[
                { value: "", label: "Pilih Role" },
                { value: "admin", label: "Admin" },
                { value: "petugas", label: "Petugas" },
                { value: "owner", label: "Owner" },
              ]}
              defaultValue={selectedUser?.role}
            />
            <Select
              label="Cabang"
              options={[
                { value: "", label: "Pilih Cabang" },
                { value: "1", label: "Cabang Pusat" },
                { value: "2", label: "Cabang Utara" },
                { value: "3", label: "Cabang Selatan" },
              ]}
            />
            <Select
              label="Status"
              options={[
                { value: "1", label: "Aktif" },
                { value: "0", label: "Non-aktif" },
              ]}
              defaultValue={selectedUser?.is_active ? "1" : "0"}
            />
            <div className="flex gap-3 pt-4">
              <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)} className="flex-1">
                Batal
              </Button>
              <Button type="submit" className="flex-1">
                {selectedUser ? "Update" : "Simpan"}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </DashboardLayout>
  );
}
