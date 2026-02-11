"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from "@/components/ui/Table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit, faTrash, faSearch, faUserTie } from "@fortawesome/free-solid-svg-icons";
import { useAuthStore } from "@/store/authStore";

interface User {
  user_id: number;
  username: string;
  full_name: string;
  role: string;
  branch_id: number;
  branch_name: string;
  phone: string;
  status: string;
  created_at: string;
}

export default function OwnerUsersPage() {
  const { user: currentUser } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    username: "",
    full_name: "",
    password: "",
    phone: "",
  });

  // Dummy data - hanya petugas di cabang owner, sorted by newest first
  const users: User[] = [
    {
      user_id: 12,
      username: "petugas3",
      full_name: "Budi Santoso",
      role: "petugas",
      branch_id: currentUser?.branch_id || 1,
      branch_name: "Cabang Pusat",
      phone: "081234567892",
      status: "active",
      created_at: "2025-02-01",
    },
    {
      user_id: 11,
      username: "petugas2",
      full_name: "Siti Nurhaliza",
      role: "petugas",
      branch_id: currentUser?.branch_id || 1,
      branch_name: "Cabang Pusat",
      phone: "081234567891",
      status: "active",
      created_at: "2025-01-20",
    },
    {
      user_id: 10,
      username: "petugas1",
      full_name: "Ahmad Rizki",
      role: "petugas",
      branch_id: currentUser?.branch_id || 1,
      branch_name: "Cabang Pusat",
      phone: "081234567890",
      status: "active",
      created_at: "2025-01-15",
    },
  ].sort((a, b) => b.user_id - a.user_id);

  const filteredUsers = users.filter(
    (user) =>
      user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    console.log("Add petugas:", formData);
    setShowAddModal(false);
    setFormData({ username: "", full_name: "", password: "", phone: "" });
  };

  const handleEdit = () => {
    console.log("Edit petugas:", selectedUser?.user_id, formData);
    setShowEditModal(false);
    setSelectedUser(null);
    setFormData({ username: "", full_name: "", password: "", phone: "" });
  };

  const handleDelete = (userId: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus petugas ini?")) {
      console.log("Delete petugas:", userId);
    }
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setFormData({
      username: user.username,
      full_name: user.full_name,
      password: "",
      phone: user.phone,
    });
    setShowEditModal(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manajemen Petugas</h1>
            <p className="text-gray-600 mt-1">Kelola petugas di cabang Anda</p>
          </div>
          <Button onClick={() => setShowAddModal(true)}>
            <FontAwesomeIcon icon={faPlus} className="w-4 h-4 mr-2" />
            Tambah Petugas
          </Button>
        </div>

        {/* Info Card */}
        <Card className="p-5 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100">
          <div className="flex items-start gap-3">
            <div className="bg-blue-500 p-3 rounded-lg">
              <FontAwesomeIcon icon={faUserTie} className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Informasi</h3>
              <p className="text-sm text-gray-600">
                Sebagai Owner, Anda hanya dapat mengelola akun Petugas di cabang <span className="font-semibold">{currentUser?.branch_id === 1 ? "Cabang Pusat" : `Cabang ${currentUser?.branch_id}`}</span>.
                Admin yang mengelola akun Owner dan Admin lainnya.
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          {/* Search */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Cari nama atau username..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Table */}
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>ID</TableHeader>
                <TableHeader>Username</TableHeader>
                <TableHeader>Nama Lengkap</TableHeader>
                <TableHeader>No. Telepon</TableHeader>
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
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 text-xs font-medium rounded bg-green-100 text-green-700">
                      {user.status.toUpperCase()}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" onClick={() => openEditModal(user)}>
                        <FontAwesomeIcon icon={faEdit} className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleDelete(user.user_id)}>
                        <FontAwesomeIcon icon={faTrash} className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredUsers.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Tidak ada data petugas
            </div>
          )}
        </Card>

        {/* Add Modal */}
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Tambah Petugas Baru"
          size="md"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <Input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="Masukkan username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama Lengkap
              </label>
              <Input
                type="text"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                placeholder="Masukkan nama lengkap"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <Input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Masukkan password"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                No. Telepon
              </label>
              <Input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="Masukkan nomor telepon"
              />
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Cabang:</span> {currentUser?.branch_id === 1 ? "Cabang Pusat" : `Cabang ${currentUser?.branch_id}`}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                <span className="font-medium">Role:</span> Petugas
              </p>
            </div>
            <div className="flex gap-3 pt-4">
              <Button onClick={handleAdd} className="flex-1">
                Simpan
              </Button>
              <Button onClick={() => setShowAddModal(false)} variant="outline" className="flex-1">
                Batal
              </Button>
            </div>
          </div>
        </Modal>

        {/* Edit Modal */}
        <Modal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          title="Edit Petugas"
          size="md"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <Input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="Masukkan username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama Lengkap
              </label>
              <Input
                type="text"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                placeholder="Masukkan nama lengkap"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password Baru (kosongkan jika tidak ingin mengubah)
              </label>
              <Input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Masukkan password baru"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                No. Telepon
              </label>
              <Input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="Masukkan nomor telepon"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button onClick={handleEdit} className="flex-1">
                Update
              </Button>
              <Button onClick={() => setShowEditModal(false)} variant="outline" className="flex-1">
                Batal
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  );
}
