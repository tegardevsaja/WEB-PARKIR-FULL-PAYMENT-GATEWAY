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
import { areaService } from "@/services/areaService";
import { branchService } from "@/services/branchService";

interface Area {
  area_id: number;
  branch_id: number;
  branch_name: string;
  area_name: string;
  capacity: number;
  current_occupancy: number;
  created_at?: string;
}

interface Branch {
  branch_id: number;
  branch_name: string;
}

export default function AreasPage() {
  const [areas, setAreas] = useState<Area[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedArea, setSelectedArea] = useState<Area | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    branch_id: "",
    area_name: "",
    capacity: "",
  });

  useEffect(() => {
    fetchAreas();
    fetchBranches();
  }, []);

  const fetchAreas = async () => {
    try {
      setLoading(true);
      console.log('🔄 [fetchAreas] Memuat data dari API...');
      const data = await areaService.getAll();
      console.log('✅ [fetchAreas] Data diterima:', data);
      console.log('📊 [fetchAreas] Jumlah area:', data.length);
      console.table(data);
      setAreas(data);
    } catch (error) {
      console.error('❌ [fetchAreas] Error:', error);
      alert('Gagal memuat data area parkir');
    } finally {
      setLoading(false);
    }
  };

  const fetchBranches = async () => {
    try {
      const data = await branchService.getAll();
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
        branch_id: parseInt(formData.branch_id),
        area_name: formData.area_name,
        capacity: parseInt(formData.capacity),
      };

      if (selectedArea) {
        console.log('📝 [handleSubmit] UPDATE area:', selectedArea.area_id, payload);
        const result = await areaService.update(selectedArea.area_id, payload);
        console.log('✅ [handleSubmit] UPDATE result:', result);
        alert("Area parkir berhasil diupdate!");
      } else {
        console.log('➕ [handleSubmit] CREATE area:', payload);
        const result = await areaService.create(payload);
        console.log('✅ [handleSubmit] CREATE result:', result);
        alert("Area parkir berhasil ditambahkan!");
      }
      setIsModalOpen(false);
      resetForm();
      console.log('🔄 [handleSubmit] Refresh data...');
      await fetchAreas();
      console.log('✅ [handleSubmit] Data refreshed');
    } catch (error: any) {
      alert(error.message || "Gagal menyimpan area parkir");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (area: Area) => {
    if (!confirm(`Yakin ingin menghapus area "${area.area_name}"?`)) return;

    try {
      console.log('🗑️ [handleDelete] Menghapus area:', area.area_id, area.area_name);
      const result = await areaService.delete(area.area_id);
      console.log('✅ [handleDelete] DELETE result:', result);
      alert("Area parkir berhasil dihapus!");
      console.log('🔄 [handleDelete] Refresh data...');
      await fetchAreas();
      console.log('✅ [handleDelete] Data refreshed');
    } catch (error: any) {
      alert(error.message || "Gagal menghapus area parkir");
    }
  };

  const handleAdd = () => {
    resetForm();
    setSelectedArea(null);
    setIsModalOpen(true);
  };

  const handleEdit = (area: Area) => {
    setSelectedArea(area);
    setFormData({
      branch_id: area.branch_id.toString(),
      area_name: area.area_name,
      capacity: area.capacity.toString(),
    });
    setIsModalOpen(true);
  };

  const handleView = (area: Area) => {
    setSelectedArea(area);
    setIsViewModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      branch_id: "",
      area_name: "",
      capacity: "",
    });
  };

  const getOccupancyColor = (occupancy: number, capacity: number) => {
    const percentage = (occupancy / capacity) * 100;
    if (percentage >= 90) return "text-red-600";
    if (percentage >= 70) return "text-orange-600";
    return "text-green-600";
  };

  const filteredAreas = areas.filter(area =>
    area.area_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    area.branch_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredAreas.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAreas = filteredAreas.slice(startIndex, startIndex + itemsPerPage);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Area Parkir</h1>
            <p className="text-gray-600 mt-1">Kelola area parkir per cabang</p>
          </div>
          <Button onClick={handleAdd}>
            <Plus className="w-4 h-4 mr-2" />
            Tambah Area
          </Button>
        </div>

        <Card className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Cari area..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <Loader2 className="w-12 h-12 text-primary-600 mx-auto mb-4 animate-spin" />
              <p className="text-gray-600">Memuat data dari database...</p>
            </div>
          ) : (
            <>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeader>No</TableHeader>
                    <TableHeader>Cabang</TableHeader>
                    <TableHeader>Nama Area</TableHeader>
                    <TableHeader>Kapasitas</TableHeader>
                    <TableHeader>Okupansi</TableHeader>
                    <TableHeader>Tersedia</TableHeader>
                    <TableHeader>Persentase</TableHeader>
                    <TableHeader>Aksi</TableHeader>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedAreas.map((area, index) => {
                    const available = area.capacity - area.current_occupancy;
                    const percentage = ((area.current_occupancy / area.capacity) * 100).toFixed(0);
                    return (
                      <TableRow key={area.area_id}>
                        <TableCell>{startIndex + index + 1}</TableCell>
                        <TableCell>{area.branch_name}</TableCell>
                        <TableCell className="font-medium">{area.area_name}</TableCell>
                        <TableCell>{area.capacity}</TableCell>
                        <TableCell>{area.current_occupancy}</TableCell>
                        <TableCell className={getOccupancyColor(area.current_occupancy, area.capacity)}>
                          {available}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  parseInt(percentage) >= 90 ? "bg-red-600" :
                                  parseInt(percentage) >= 70 ? "bg-orange-600" :
                                  "bg-green-600"
                                }`}
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium">{percentage}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="ghost" onClick={() => handleView(area)} title="Lihat Detail">
                              <Eye className="w-4 h-4 text-blue-600" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => handleEdit(area)} title="Edit">
                              <Edit className="w-4 h-4 text-primary-600" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => handleDelete(area)} title="Hapus">
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              {filteredAreas.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-600">Tidak ada data area parkir</p>
                </div>
              )}

              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  itemsPerPage={itemsPerPage}
                  totalItems={filteredAreas.length}
                />
              )}
            </>
          )}
        </Card>

        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            resetForm();
          }}
          title={selectedArea ? "Edit Area Parkir" : "Tambah Area Parkir"}
          size="md"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <Select
              label="Cabang"
              options={[
                { value: "", label: "Pilih Cabang" },
                ...branches.map(b => ({ 
                  value: b.branch_id.toString(), 
                  label: b.branch_name 
                }))
              ]}
              value={formData.branch_id}
              onChange={(e) => setFormData({ ...formData, branch_id: e.target.value })}
              disabled={submitting}
            />
            <Input
              label="Nama Area"
              type="text"
              placeholder="Contoh: Area A - Motor"
              value={formData.area_name}
              onChange={(e) => setFormData({ ...formData, area_name: e.target.value })}
              required
              disabled={submitting}
            />
            <Input
              label="Kapasitas"
              type="number"
              placeholder="Masukkan kapasitas maksimal"
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
              required
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
                  selectedArea ? "Update" : "Simpan"
                )}
              </Button>
            </div>
          </form>
        </Modal>

        <Modal
          isOpen={isViewModalOpen}
          onClose={() => {
            setIsViewModalOpen(false);
            setSelectedArea(null);
          }}
          title="Detail Area Parkir"
          size="md"
        >
          {selectedArea && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">ID</label>
                <p className="mt-1 text-gray-900">{selectedArea.area_id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Cabang</label>
                <p className="mt-1 text-gray-900">{selectedArea.branch_name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Nama Area</label>
                <p className="mt-1 text-gray-900">{selectedArea.area_name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Kapasitas</label>
                <p className="mt-1 text-gray-900">{selectedArea.capacity}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Okupansi Saat Ini</label>
                <p className="mt-1 text-gray-900">{selectedArea.current_occupancy}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Slot Tersedia</label>
                <p className="mt-1 text-gray-900">{selectedArea.capacity - selectedArea.current_occupancy}</p>
              </div>
              {selectedArea.created_at && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Dibuat Pada</label>
                  <p className="mt-1 text-gray-900">
                    {new Date(selectedArea.created_at).toLocaleString("id-ID")}
                  </p>
                </div>
              )}
              <div className="pt-4">
                <Button
                  onClick={() => {
                    setIsViewModalOpen(false);
                    setSelectedArea(null);
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
