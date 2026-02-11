"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Modal from "@/components/ui/Modal";
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from "@/components/ui/Table";
import { ParkingSquare, Plus, Edit, Trash2, Search } from "lucide-react";

interface Area {
  area_id: number;
  branch_name: string;
  area_name: string;
  capacity: number;
  current_occupancy: number;
}

export default function AreasPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedArea, setSelectedArea] = useState<Area | null>(null);

  // Dummy data
  const areas: Area[] = [
    { area_id: 1, branch_name: "Cabang Pusat", area_name: "Area A - Motor", capacity: 100, current_occupancy: 45 },
    { area_id: 2, branch_name: "Cabang Pusat", area_name: "Area B - Mobil", capacity: 50, current_occupancy: 28 },
    { area_id: 3, branch_name: "Cabang Pusat", area_name: "Area C - Bus/Truk", capacity: 20, current_occupancy: 5 },
    { area_id: 4, branch_name: "Cabang Utara", area_name: "Area A - Motor", capacity: 80, current_occupancy: 32 },
    { area_id: 5, branch_name: "Cabang Utara", area_name: "Area B - Mobil", capacity: 40, current_occupancy: 15 },
    { area_id: 6, branch_name: "Cabang Selatan", area_name: "Area A - Motor", capacity: 120, current_occupancy: 67 },
    { area_id: 7, branch_name: "Cabang Selatan", area_name: "Area B - Mobil", capacity: 60, current_occupancy: 38 },
  ];

  const filteredAreas = areas.filter(area =>
    area.area_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    area.branch_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getOccupancyColor = (occupancy: number, capacity: number) => {
    const percentage = (occupancy / capacity) * 100;
    if (percentage >= 90) return "text-red-600";
    if (percentage >= 70) return "text-orange-600";
    return "text-green-600";
  };

  const handleAdd = () => {
    setSelectedArea(null);
    setIsModalOpen(true);
  };

  const handleEdit = (area: Area) => {
    setSelectedArea(area);
    setIsModalOpen(true);
  };

  const handleDelete = (area: Area) => {
    if (confirm(`Hapus area ${area.area_name}?`)) {
      alert("Area berhasil dihapus!");
    }
  };

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

          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>ID</TableHeader>
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
              {filteredAreas.map((area) => {
                const available = area.capacity - area.current_occupancy;
                const percentage = ((area.current_occupancy / area.capacity) * 100).toFixed(0);
                return (
                  <TableRow key={area.area_id}>
                    <TableCell>{area.area_id}</TableCell>
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
                        <Button size="sm" variant="ghost" onClick={() => handleEdit(area)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDelete(area)}>
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={selectedArea ? "Edit Area Parkir" : "Tambah Area Parkir"}
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
            <Input
              label="Nama Area"
              type="text"
              placeholder="Contoh: Area A - Motor"
              defaultValue={selectedArea?.area_name}
            />
            <Input
              label="Kapasitas"
              type="number"
              placeholder="Masukkan kapasitas maksimal"
              defaultValue={selectedArea?.capacity}
            />
            <div className="flex gap-3 pt-4">
              <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)} className="flex-1">
                Batal
              </Button>
              <Button type="submit" className="flex-1">
                {selectedArea ? "Update" : "Simpan"}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </DashboardLayout>
  );
}
