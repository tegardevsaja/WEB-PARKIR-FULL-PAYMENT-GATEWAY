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
import { formatCurrency } from "@/lib/utils";
import { DollarSign, Plus, Edit, Trash2, Search, Loader2, Eye } from "lucide-react";
import { rateService } from "@/services/rateService";
import { branchService } from "@/services/branchService";

interface Rate {
  rate_id: number;
  branch_id: number;
  branch_name: string;
  vehicle_type_id: number;
  vehicle_type_name: string;
  first_hour_rate: number;
  next_hour_rate: number;
  effective_date: string;
}

interface Branch {
  branch_id: number;
  branch_name: string;
}

interface VehicleType {
  vehicle_type_id: number;
  type_name: string;
}

export default function RatesPage() {
  const [rates, setRates] = useState<Rate[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRate, setSelectedRate] = useState<Rate | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    branch_id: "",
    vehicle_type_id: "",
    first_hour_rate: "",
    next_hour_rate: "",
    effective_date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    fetchRates();
    fetchBranches();
    fetchVehicleTypes();
  }, []);

  const fetchRates = async () => {
    try {
      setLoading(true);
      console.log('🔄 [fetchRates] Memuat data dari API...');
      const response = await rateService.getAll();
      console.log('✅ [fetchRates] Response:', response);
      const data = response.data || response;
      console.log('📊 [fetchRates] Jumlah tarif:', data.length);
      console.table(data);
      setRates(data);
    } catch (error) {
      console.error('❌ [fetchRates] Error:', error);
      alert('Gagal memuat data tarif parkir');
    } finally {
      setLoading(false);
    }
  };

  const fetchBranches = async () => {
    try {
      const data = await branchService.getAll();
      setBranches(data);
    } catch (error) {
      console.error('❌ [fetchBranches] Error:', error);
    }
  };

  const fetchVehicleTypes = async () => {
    try {
      const response = await rateService.getVehicleTypes();
      const data = response.data || response;
      setVehicleTypes(data);
    } catch (error) {
      console.error('❌ [fetchVehicleTypes] Error:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        branch_id: parseInt(formData.branch_id),
        vehicle_type_id: parseInt(formData.vehicle_type_id),
        first_hour_rate: parseFloat(formData.first_hour_rate),
        next_hour_rate: parseFloat(formData.next_hour_rate),
        effective_date: formData.effective_date,
      };

      if (selectedRate) {
        console.log('📝 [handleSubmit] UPDATE tarif:', selectedRate.rate_id, payload);
        const result = await rateService.update(selectedRate.rate_id, payload);
        console.log('✅ [handleSubmit] UPDATE result:', result);
        alert('Tarif parkir berhasil diupdate!');
      } else {
        console.log('➕ [handleSubmit] CREATE tarif:', payload);
        const result = await rateService.create(payload);
        console.log('✅ [handleSubmit] CREATE result:', result);
        alert('Tarif parkir berhasil ditambahkan!');
      }

      setIsModalOpen(false);
      resetForm();
      console.log('🔄 [handleSubmit] Refresh data...');
      await fetchRates();
      console.log('✅ [handleSubmit] Data refreshed');
    } catch (error: any) {
      console.error('❌ [handleSubmit] Error:', error);
      alert(error.message || 'Gagal menyimpan tarif parkir');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (rate: Rate) => {
    if (!confirm(`Yakin ingin menghapus tarif ${rate.vehicle_type_name} di ${rate.branch_name}?`)) return;

    try {
      console.log('🗑️ [handleDelete] Menghapus tarif:', rate.rate_id);
      const result = await rateService.delete(rate.rate_id);
      console.log('✅ [handleDelete] DELETE result:', result);
      alert('Tarif parkir berhasil dihapus!');
      console.log('🔄 [handleDelete] Refresh data...');
      await fetchRates();
      console.log('✅ [handleDelete] Data refreshed');
    } catch (error: any) {
      console.error('❌ [handleDelete] Error:', error);
      alert(error.message || 'Gagal menghapus tarif parkir');
    }
  };

  const handleAdd = () => {
    resetForm();
    setSelectedRate(null);
    setIsModalOpen(true);
  };

  const handleEdit = (rate: Rate) => {
    setSelectedRate(rate);
    setFormData({
      branch_id: rate.branch_id.toString(),
      vehicle_type_id: rate.vehicle_type_id.toString(),
      first_hour_rate: rate.first_hour_rate.toString(),
      next_hour_rate: rate.next_hour_rate.toString(),
      effective_date: rate.effective_date.split('T')[0],
    });
    setIsModalOpen(true);
  };

  const handleView = (rate: Rate) => {
    setSelectedRate(rate);
    setIsViewModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      branch_id: "",
      vehicle_type_id: "",
      first_hour_rate: "",
      next_hour_rate: "",
      effective_date: new Date().toISOString().split('T')[0],
    });
  };

  const getVehicleTypeColor = (typeName: string) => {
    if (typeName === "Motor") return "bg-blue-100 text-blue-700";
    if (typeName === "Mobil") return "bg-green-100 text-green-700";
    return "bg-purple-100 text-purple-700";
  };

  const filteredRates = rates.filter(rate =>
    rate.branch_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rate.vehicle_type_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredRates.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRates = filteredRates.slice(startIndex, startIndex + itemsPerPage);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tarif Parkir</h1>
            <p className="text-gray-600 mt-1">Kelola tarif parkir per cabang dan jenis kendaraan</p>
          </div>
          <Button onClick={handleAdd}>
            <Plus className="w-4 h-4 mr-2" />
            Tambah Tarif
          </Button>
        </div>

        <Card className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Cari tarif berdasarkan cabang atau jenis kendaraan..."
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
              <div className="overflow-x-auto">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableHeader>No</TableHeader>
                      <TableHeader>Cabang</TableHeader>
                      <TableHeader>Jenis Kendaraan</TableHeader>
                      <TableHeader>Tarif Jam 1</TableHeader>
                      <TableHeader>Tarif Per Jam</TableHeader>
                      <TableHeader>Tanggal Berlaku</TableHeader>
                      <TableHeader>Aksi</TableHeader>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedRates.map((rate, index) => (
                      <TableRow key={rate.rate_id}>
                        <TableCell>{startIndex + index + 1}</TableCell>
                        <TableCell className="font-medium">{rate.branch_name}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 text-xs font-medium rounded ${getVehicleTypeColor(rate.vehicle_type_name)}`}>
                            {rate.vehicle_type_name}
                          </span>
                        </TableCell>
                        <TableCell className="font-medium text-green-600">{formatCurrency(rate.first_hour_rate)}</TableCell>
                        <TableCell className="font-medium text-blue-600">{formatCurrency(rate.next_hour_rate)}</TableCell>
                        <TableCell>{new Date(rate.effective_date).toLocaleDateString('id-ID')}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="ghost" onClick={() => handleView(rate)} title="Lihat Detail">
                              <Eye className="w-4 h-4 text-blue-600" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => handleEdit(rate)} title="Edit">
                              <Edit className="w-4 h-4 text-primary-600" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => handleDelete(rate)} title="Hapus">
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {filteredRates.length === 0 && (
                <div className="text-center py-12">
                  <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg">Tidak ada data tarif</p>
                  <p className="text-gray-400 text-sm mt-1">
                    {searchTerm ? 'Coba ubah kata kunci pencarian' : "Klik 'Tambah Tarif' untuk membuat tarif baru"}
                  </p>
                </div>
              )}

              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  itemsPerPage={itemsPerPage}
                  totalItems={filteredRates.length}
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
          title={selectedRate ? "Edit Tarif Parkir" : "Tambah Tarif Parkir"}
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
              required
              disabled={submitting}
            />
            <Select
              label="Jenis Kendaraan"
              options={[
                { value: "", label: "Pilih Jenis Kendaraan" },
                ...vehicleTypes.map(vt => ({
                  value: vt.vehicle_type_id.toString(),
                  label: vt.type_name
                }))
              ]}
              value={formData.vehicle_type_id}
              onChange={(e) => setFormData({ ...formData, vehicle_type_id: e.target.value })}
              required
              disabled={submitting}
            />
            <Input
              label="Tarif Jam Pertama (Rp)"
              type="number"
              placeholder="Contoh: 2000"
              value={formData.first_hour_rate}
              onChange={(e) => setFormData({ ...formData, first_hour_rate: e.target.value })}
              required
              disabled={submitting}
            />
            <Input
              label="Tarif Per Jam Berikutnya (Rp)"
              type="number"
              placeholder="Contoh: 1000"
              value={formData.next_hour_rate}
              onChange={(e) => setFormData({ ...formData, next_hour_rate: e.target.value })}
              required
              disabled={submitting}
            />
            <Input
              label="Tanggal Berlaku"
              type="date"
              value={formData.effective_date}
              onChange={(e) => setFormData({ ...formData, effective_date: e.target.value })}
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
                  selectedRate ? "Update" : "Simpan"
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
            setSelectedRate(null);
          }}
          title="Detail Tarif Parkir"
          size="md"
        >
          {selectedRate && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 pb-4 border-b">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{selectedRate.vehicle_type_name}</h3>
                  <p className="text-sm text-gray-500">{selectedRate.branch_name}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 p-3 rounded-lg">
                  <label className="text-sm font-medium text-gray-600">Tarif Jam Pertama</label>
                  <p className="text-xl font-bold text-green-600 mt-1">{formatCurrency(selectedRate.first_hour_rate)}</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <label className="text-sm font-medium text-gray-600">Tarif Per Jam</label>
                  <p className="text-xl font-bold text-blue-600 mt-1">{formatCurrency(selectedRate.next_hour_rate)}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Tanggal Berlaku</label>
                <p className="mt-1 text-gray-900">
                  {new Date(selectedRate.effective_date).toLocaleDateString('id-ID', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>

              <div className="pt-4">
                <Button
                  onClick={() => {
                    setIsViewModalOpen(false);
                    setSelectedRate(null);
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
