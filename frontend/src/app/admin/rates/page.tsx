"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Modal from "@/components/ui/Modal";
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from "@/components/ui/Table";
import { formatCurrency } from "@/lib/utils";
import { DollarSign, Plus, Edit, Trash2, Search } from "lucide-react";

interface Rate {
  rate_id: number;
  branch_name: string;
  vehicle_type: string;
  first_hour_rate: number;
  next_hour_rate: number;
  effective_date: string;
}

export default function RatesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRate, setSelectedRate] = useState<Rate | null>(null);

  // Dummy data
  const rates: Rate[] = [
    { rate_id: 1, branch_name: "Cabang Pusat", vehicle_type: "Motor", first_hour_rate: 2000, next_hour_rate: 1000, effective_date: "2024-01-01" },
    { rate_id: 2, branch_name: "Cabang Pusat", vehicle_type: "Mobil", first_hour_rate: 5000, next_hour_rate: 3000, effective_date: "2024-01-01" },
    { rate_id: 3, branch_name: "Cabang Pusat", vehicle_type: "Bus/Truk", first_hour_rate: 10000, next_hour_rate: 5000, effective_date: "2024-01-01" },
    { rate_id: 4, branch_name: "Cabang Utara", vehicle_type: "Motor", first_hour_rate: 2000, next_hour_rate: 1000, effective_date: "2024-01-01" },
    { rate_id: 5, branch_name: "Cabang Utara", vehicle_type: "Mobil", first_hour_rate: 5000, next_hour_rate: 3000, effective_date: "2024-01-01" },
    { rate_id: 6, branch_name: "Cabang Utara", vehicle_type: "Bus/Truk", first_hour_rate: 10000, next_hour_rate: 5000, effective_date: "2024-01-01" },
    { rate_id: 7, branch_name: "Cabang Selatan", vehicle_type: "Motor", first_hour_rate: 2500, next_hour_rate: 1500, effective_date: "2024-01-01" },
    { rate_id: 8, branch_name: "Cabang Selatan", vehicle_type: "Mobil", first_hour_rate: 6000, next_hour_rate: 3500, effective_date: "2024-01-01" },
    { rate_id: 9, branch_name: "Cabang Selatan", vehicle_type: "Bus/Truk", first_hour_rate: 12000, next_hour_rate: 6000, effective_date: "2024-01-01" },
  ];

  const filteredRates = rates.filter(rate =>
    rate.branch_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rate.vehicle_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    setSelectedRate(null);
    setIsModalOpen(true);
  };

  const handleEdit = (rate: Rate) => {
    setSelectedRate(rate);
    setIsModalOpen(true);
  };

  const handleDelete = (rate: Rate) => {
    if (confirm(`Hapus tarif ${rate.vehicle_type} di ${rate.branch_name}?`)) {
      alert("Tarif berhasil dihapus!");
    }
  };

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
                placeholder="Cari tarif..."
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
                <TableHeader>Cabang</TableHeader>
                <TableHeader>Jenis Kendaraan</TableHeader>
                <TableHeader>Tarif Jam 1</TableHeader>
                <TableHeader>Tarif Per Jam</TableHeader>
                <TableHeader>Tanggal Berlaku</TableHeader>
                <TableHeader>Aksi</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRates.map((rate) => (
                <TableRow key={rate.rate_id}>
                  <TableCell>{rate.rate_id}</TableCell>
                  <TableCell>{rate.branch_name}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                      rate.vehicle_type === "Motor" ? "bg-blue-100 text-blue-700" :
                      rate.vehicle_type === "Mobil" ? "bg-green-100 text-green-700" :
                      "bg-purple-100 text-purple-700"
                    }`}>
                      {rate.vehicle_type}
                    </span>
                  </TableCell>
                  <TableCell className="font-medium">{formatCurrency(rate.first_hour_rate)}</TableCell>
                  <TableCell className="font-medium">{formatCurrency(rate.next_hour_rate)}</TableCell>
                  <TableCell>{new Date(rate.effective_date).toLocaleDateString("id-ID")}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" onClick={() => handleEdit(rate)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleDelete(rate)}>
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
          title={selectedRate ? "Edit Tarif Parkir" : "Tambah Tarif Parkir"}
          size="md"
        >
          <form className="space-y-4">
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
              label="Jenis Kendaraan"
              options={[
                { value: "", label: "Pilih Jenis Kendaraan" },
                { value: "1", label: "Motor" },
                { value: "2", label: "Mobil" },
                { value: "3", label: "Bus/Truk" },
              ]}
            />
            <Input
              label="Tarif Jam Pertama"
              type="number"
              placeholder="Contoh: 2000"
              defaultValue={selectedRate?.first_hour_rate}
            />
            <Input
              label="Tarif Per Jam Berikutnya"
              type="number"
              placeholder="Contoh: 1000"
              defaultValue={selectedRate?.next_hour_rate}
            />
            <Input
              label="Tanggal Berlaku"
              type="date"
              defaultValue={selectedRate?.effective_date}
            />
            <div className="flex gap-3 pt-4">
              <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)} className="flex-1">
                Batal
              </Button>
              <Button type="submit" className="flex-1">
                {selectedRate ? "Update" : "Simpan"}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </DashboardLayout>
  );
}
