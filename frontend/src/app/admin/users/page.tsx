"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Modal from "@/components/ui/Modal";
import Pagination from "@/components/ui/Pagination";
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from "@/components/ui/Table";
import { Plus, Edit, Trash2, Search, Loader2, Eye } from "lucide-react";
import { userService } from "@/services/userService";
import { branchService } from "@/services/branchService";

interface User {
  user_id: number;
  username: string;
  full_name: string;
  role: string;
  branch_name?: string;
  branch_id?: number | null;
  created_at?: string;
}

interface Branch {
  branch_id: number;
  branch_name: string;
}

export default function UsersPage() {
  // State untuk data
  const [users, setUsers] = useState<User[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State untuk UI
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [submitting, setSubmitting] = useState(false);

  // State untuk form
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    full_name: "",
    role: "petugas",
    branch_id: "",
  });

  // Fetch data saat component mount
  useEffect(() => {
    console.log("Component mounted, fetching data...");
    fetchUsers();
    fetchBranches();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      console.log("Fetching users from API...");
      const data = await userService.getAll();
      console.log("Users fetched:", data);
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
      alert("Gagal memuat data user. Pastikan backend running.");
    } finally {
      setLoading(false);
    }
  };

  const fetchBranches = async () => {
    try {
      console.log("Fetching branches from API...");
      const data = await branchService.getAll();
      console.log("Branches fetched:", data);
      setBranches(data);
    } catch (error) {
      console.error("Error fetching branches:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        username: formData.username,
        password: formData.password,
        full_name: formData.full_name,
        role: formData.role,
        branch_id: formData.branch_id ? parseInt(formData.branch_id) : null,
      };

      console.log("Submitting:", payload);

      if (selectedUser) {
        // Update
        await userService.update(selectedUser.user_id, payload);
        alert("User berhasil diupdate!");
      } else {
        // Create
        await userService.create(payload);
        alert("User berhasil ditambahkan!");
      }

      setIsModalOpen(false);
      resetForm();
      fetchUsers(); // Refresh data
    } catch (error: any) {
      console.error("Submit error:", error);
      alert(error.message || "Gagal menyimpan user");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (user: User) => {
    if (!confirm(`Yakin ingin menghapus user "${user.full_name}"?`)) return;

    try {
      console.log("Deleting user:", user.user_id);
      await userService.delete(user.user_id);
      alert("User berhasil dihapus!");
      fetchUsers(); // Refresh data
    } catch (error: any) {
      console.error("Delete error:", error);
      alert(error.message || "Gagal menghapus user");
    }
  };

  const handleAdd = () => {
    resetForm();
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const handleEdit = (user: User) => {
    console.log("Editing user:", user);
    setSelectedUser(user);
    setFormData({
      username: user.username,
      password: "", // Kosongkan password saat edit
      full_name: user.full_name,
      role: user.role,
      branch_id: user.branch_id?.toString() || "",
    });
    setIsModalOpen(true);
  };

  const handleView = (user: User) => {
    setSelectedUser(user);
    setIsViewModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      username: "",
      password: "",
      full_name: "",
      role: "petugas",
      branch_id: "",
    });
  };

  // Filter dan pagination
  const filteredUsers = users.filter(user =>
    user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
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

        {/* Search */}
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

          {/* Loading State */}
          {loading ? (
            <div className="text-center py-12">
              <Loader2 className="w-12 h-12 text-primary-600 mx-auto mb-4 animate-spin" />
              <p className="text-gray-600">Memuat data dari database...</p>
            </div>
          ) : (
            <>
              {/* Table */}
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeader>No</TableHeader>
                    <TableHeader>Username</TableHeader>
                    <TableHeader>Nama Lengkap</TableHeader>
                    <TableHeader>Role</TableHeader>
                    <TableHeader>Cabang</TableHeader>
                    <TableHeader>Aksi</TableHeader>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedUsers.map((user, index) => (
                    <TableRow key={user.user_id}>
                      <TableCell>{startIndex + index + 1}</TableCell>
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
                      <TableCell>{user.branch_name || "-"}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost" onClick={() => handleView(user)} title="Lihat Detail">
                            <Eye className="w-4 h-4 text-blue-600" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleEdit(user)} title="Edit">
                            <Edit className="w-4 h-4 text-primary-600" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleDelete(user)} title="Hapus">
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Empty State */}
              {filteredUsers.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-600">Tidak ada data user</p>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  itemsPerPage={itemsPerPage}
                  totalItems={filteredUsers.length}
                />
              )}
            </>
          )}
        </Card>

        {/* Create/Edit Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            resetForm();
          }}
          title={selectedUser ? "Edit User" : "Tambah User Baru"}
          size="md"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Username"
              type="text"
              placeholder="Masukkan username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
              disabled={submitting}
            />
            <Input
              label={selectedUser ? "Password (kosongkan jika tidak diubah)" : "Password"}
              type="password"
              placeholder="Masukkan password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required={!selectedUser}
              disabled={submitting}
            />
            <Input
              label="Nama Lengkap"
              type="text"
              placeholder="Masukkan nama lengkap"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              required
              disabled={submitting}
            />
            <Select
              label="Role"
              options={[
                { value: "admin", label: "Admin (Super Admin)" },
                { value: "petugas", label: "Petugas (Staff Operasional)" },
                { value: "owner", label: "Owner (Pemilik Cabang)" },
              ]}
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              disabled={submitting}
            />
            <Select
              label="Cabang"
              options={[
                { value: "", label: "Tidak ada cabang" },
                ...branches.map(b => ({ 
                  value: b.branch_id.toString(), 
                  label: b.branch_name 
                }))
              ]}
              value={formData.branch_id}
              onChange={(e) => setFormData({ ...formData, branch_id: e.target.value })}
              disabled={submitting}
            />
            <div className="flex gap-3 pt-4">
              <Button 
                type="button" 
                variant="secondary" 
                onClick={() => {
                  setIsModalOpen(false);
                  resetForm();
                }} 
                className="flex-1"
                disabled={submitting}
              >
                Batal
              </Button>
              <Button type="submit" className="flex-1" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  selectedUser ? "Update" : "Simpan"
                )}
              </Button>
            </div>
          </form>
        </Modal>

        {/* View Modal */}
        <Modal
          isOpen={isViewModalOpen}
          onClose={() => {
            setIsViewModalOpen(false);
            setSelectedUser(null);
          }}
          title="Detail User"
          size="md"
        >
          {selectedUser && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">ID</label>
                <p className="mt-1 text-gray-900">{selectedUser.user_id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Username</label>
                <p className="mt-1 text-gray-900">{selectedUser.username}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Nama Lengkap</label>
                <p className="mt-1 text-gray-900">{selectedUser.full_name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Role</label>
                <p className="mt-1 text-gray-900 capitalize">{selectedUser.role}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Cabang</label>
                <p className="mt-1 text-gray-900">{selectedUser.branch_name || "-"}</p>
              </div>
              {selectedUser.created_at && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Dibuat Pada</label>
                  <p className="mt-1 text-gray-900">
                    {new Date(selectedUser.created_at).toLocaleString("id-ID")}
                  </p>
                </div>
              )}
              <div className="pt-4">
                <Button
                  onClick={() => {
                    setIsViewModalOpen(false);
                    setSelectedUser(null);
                  }}
                  className="w-full"
                >
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
