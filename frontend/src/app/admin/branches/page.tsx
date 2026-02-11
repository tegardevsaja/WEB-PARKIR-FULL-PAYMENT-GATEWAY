"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import Pagination from "@/components/ui/Pagination";
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from "@/components/ui/Table";
import { Plus, Edit, Trash2, Search, Loader2, Eye, MapPin, Phone, Users, LayoutGrid } from "lucide-react";
import { branchService } from "@/services/branchService";

interface Branch {
  branch_id: number;
  branch_name: string;
  address: string;
  phone: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  total_areas?: number;
  total_petugas?: number;
}

export default function BranchesPage() {
  // State untuk data branches
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State untuk UI
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [submitting, setSubmitting] = useState(false);

  // State untuk form
  const [formData, setFormData] = useState({
    branch_name: "",
    address: "",
    phone: "",
    is_active: true,
  });

  // Fetch data saat component mount
  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      setLoading(true);
      console.log('🔄 [fetchBranches] Memuat data dari API...');
      const data = await branchService.getAll();
      console.log('✅ [fetchBranches] Data diterima:', data);
      console.log('📊 [fetchBranches] Jumlah cabang:', data.length);
      console.table(data);
      setBranches(data);
    } catch (error) {
      console.error('❌ [fetchBranches] Error:', error);
      alert('Gagal memuat data cabang. Pastikan backend running.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        branch_name: formData.branch_name,
        address: formData.address,
        phone: formData.phone,
      };

      if (selectedBranch) {
        // Update
        console.log('📝 [handleSubmit] UPDATE cabang:', selectedBranch.branch_id, payload);
        const result = await branchService.update(selectedBranch.branch_id, payload);
        console.log('✅ [handleSubmit] UPDATE result:', result);
        alert('Cabang berhasil diupdate!');
      } else {
        // Create
        console.log('➕ [handleSubmit] CREATE cabang:', payload);
        const result = await branchService.create(payload);
        console.log('✅ [handleSubmit] CREATE result:', result);
        alert('Cabang berhasil ditambahkan!');
      }

      setIsModalOpen(false);
      resetForm();
      console.log('🔄 [handleSubmit] Refresh data setelah submit...');
      await fetchBranches(); // Refresh data
      console.log('✅ [handleSubmit] Data refreshed');
    } catch (error: any) {
      console.error("Submit error:", error);
      alert(error.message || "Gagal menyimpan cabang");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (branch: Branch) => {
    if (!confirm(`Yakin ingin menghapus cabang "${branch.branch_name}"?\n\nPERINGATAN: Semua area parkir dan data terkait cabang ini akan ikut terhapus!`)) return;

    try {
      console.log('🗑️ [handleDelete] Menghapus cabang:', branch.branch_id, branch.branch_name);
      const result = await branchService.delete(branch.branch_id);
      console.log('✅ [handleDelete] DELETE result:', result);
      alert('Cabang berhasil dihapus!');
      console.log('🔄 [handleDelete] Refresh data setelah hapus...');
      await fetchBranches(); // Refresh data
      console.log('✅ [handleDelete] Data refreshed');
    } catch (error: any) {
      console.error("Delete error:", error);
      alert(error.message || "Gagal menghapus cabang");
    }
  };

  const handleAdd = () => {
    resetForm();
    setSelectedBranch(null);
    setIsModalOpen(true);
  };

  const handleEdit = (branch: Branch) => {
    setSelectedBranch(branch);
    setFormData({
      branch_name: branch.branch_name,
      address: branch.address,
      phone: branch.phone || "",
      is_active: branch.is_active,
    });
    setIsModalOpen(true);
  };

  const handleView = (branch: Branch) => {
    setSelectedBranch(branch);
    setIsViewModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      branch_name: "",
      address: "",
      phone: "",
      is_active: true,
    });
  };

  // Filter dan pagination
  const filteredBranches = branches.filter(branch =>
    branch.branch_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    branch.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (branch.phone && branch.phone.includes(searchTerm))
  );

  const totalPages = Math.ceil(filteredBranches.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBranches = filteredBranches.slice(startIndex, startIndex + itemsPerPage);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manajemen Cabang</h1>
            <p className="text-gray-600 mt-1">Kelola data cabang parkir</p>
          </div>
          <Button onClick={handleAdd}>
            <Plus className="w-4 h-4 mr-2" />
            Tambah Cabang
          </Button>
        </div>

        {/* Search */}
        <Card className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Cari cabang berdasarkan nama, alamat, atau telepon..."
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
              <div className="overflow-x-auto">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableHeader>No</TableHeader>
                      <TableHeader>Nama Cabang</TableHeader>
                      <TableHeader>Alamat</TableHeader>
                      <TableHeader>Telepon</TableHeader>
                      <TableHeader>Total Area</TableHeader>
                      <TableHeader>Total Petugas</TableHeader>
                      <TableHeader>Aksi</TableHeader>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedBranches.map((branch, index) => (
                      <TableRow key={branch.branch_id}>
                        <TableCell>{startIndex + index + 1}</TableCell>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-primary-600" />
                            {branch.branch_name}
                          </div>
                        </TableCell>
                        <TableCell className="max-w-xs truncate" title={branch.address}>
                          {branch.address}
                        </TableCell>
                        <TableCell>
                          {branch.phone ? (
                            <div className="flex items-center gap-1">
                              <Phone className="w-3 h-3 text-gray-400" />
                              {branch.phone}
                            </div>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <LayoutGrid className="w-3 h-3 text-blue-500" />
                            <span className="font-medium">{branch.total_areas || 0}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3 text-green-500" />
                            <span className="font-medium">{branch.total_petugas || 0}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="ghost" onClick={() => handleView(branch)} title="Lihat Detail">
                              <Eye className="w-4 h-4 text-blue-600" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => handleEdit(branch)} title="Edit">
                              <Edit className="w-4 h-4 text-primary-600" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => handleDelete(branch)} title="Hapus">
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Empty State */}
              {filteredBranches.length === 0 && (
                <div className="text-center py-12">
                  <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg">Tidak ada data cabang</p>
                  <p className="text-gray-400 text-sm mt-1">
                    {searchTerm ? "Coba ubah kata kunci pencarian" : "Klik 'Tambah Cabang' untuk membuat cabang baru"}
                  </p>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  itemsPerPage={itemsPerPage}
                  totalItems={filteredBranches.length}
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
          title={selectedBranch ? "Edit Cabang" : "Tambah Cabang Baru"}
          size="md"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Nama Cabang"
              type="text"
              placeholder="Masukkan nama cabang (contoh: Cabang Pusat)"
              value={formData.branch_name}
              onChange={(e) => setFormData({ ...formData, branch_name: e.target.value })}
              required
              disabled={submitting}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Alamat <span className="text-red-500">*</span>
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                rows={3}
                placeholder="Masukkan alamat lengkap cabang"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                required
                disabled={submitting}
              />
            </div>
            <Input
              label="Telepon"
              type="text"
              placeholder="Masukkan nomor telepon (contoh: 021-1234567)"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
                  selectedBranch ? "Update" : "Simpan"
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
            setSelectedBranch(null);
          }}
          title="Detail Cabang"
          size="md"
        >
          {selectedBranch && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 pb-4 border-b">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{selectedBranch.branch_name}</h3>
                  <p className="text-sm text-gray-500">ID: #{selectedBranch.branch_id}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                    <LayoutGrid className="w-4 h-4" /> Total Area Parkir
                  </label>
                  <p className="text-xl font-bold text-gray-900 mt-1">{selectedBranch.total_areas || 0}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                    <Users className="w-4 h-4" /> Total Petugas
                  </label>
                  <p className="text-xl font-bold text-gray-900 mt-1">{selectedBranch.total_petugas || 0}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  <MapPin className="w-4 h-4" /> Alamat
                </label>
                <p className="mt-1 text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedBranch.address}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  <Phone className="w-4 h-4" /> Telepon
                </label>
                <p className="mt-1 text-gray-900">{selectedBranch.phone || "-"}</p>
              </div>

              {selectedBranch.created_at && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Dibuat Pada</label>
                  <p className="mt-1 text-gray-900">
                    {new Date(selectedBranch.created_at).toLocaleString("id-ID", {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              )}

              <div className="pt-4">
                <Button
                  onClick={() => {
                    setIsViewModalOpen(false);
                    setSelectedBranch(null);
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

