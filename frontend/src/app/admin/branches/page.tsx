"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from "@/components/ui/Table";
import { Building2, Plus, Edit, Trash2, Search } from "lucide-react";

interface Branch {
  branch_id: number;
  branch_name: string;
  address: string;
  phone: string;
  is_active: boolean;
}

export default function BranchesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);

  // Dummy data
  const branches: Branch[] = [
    { branch_id: 1, branch_name: "Cabang Pusat", address: "Jl. Sudirman No. 123, Jakarta Pusat", phone: "021-1234567", is_active: true },
    { branch_id: 2, branch_name: "Cabang Utara", address: "Jl. Ahmad Yani No. 456, Jakarta Utara", phone: "021-7654321", is_active: true },
    { branch_id: 3, branch_name: "Cabang Selatan", address: "Jl. Fatmawati No. 789, Jakarta Selatan", phone: "021-9876543", is_active: true },
  ];

  const filteredBranches = branches.filter(branch =>
    branch.branch_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    branch.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    setSelectedBranch(null);
    setIsModalOpen(true);
  };

  const handleEdit = (branch: Branch) => {
    setSelectedBranch(branch);
    setIsModalOpen(true);
  };

  const handleDelete = (branch: Branch) => {
    if (confirm(`Hapus cabang ${branch.branch_name}?`)) {
      alert("Cabang berhasil dihapus!");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manajemen Cabang</h1>
            <p className="text-gray-600 mt-1">Kelola cabang parkir</p>
          </div>
          <Button onClick={handleAdd}>
            <Plus className="w-4 h-4 mr-2" />
            Tambah Cabang
          </Button>
        </div>

        <Card className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Cari cabang..."
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
                <TableHeader>Nama Cabang</TableHeader>
                <TableHeader>Alamat</TableHeader>
                <TableHeader>Telepon</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader>Aksi</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredBranches.map((branch) => (
                <TableRow key={branch.branch_id}>
                  <TableCell>{branch.branch_id}</TableCell>
                  <TableCell className="font-medium">{branch.branch_name}</TableCell>
                  <TableCell>{branch.address}</TableCell>
                  <TableCell>{branch.phone}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                      branch.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}>
                      {branch.is_active ? "Aktif" : "Non-aktif"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" onClick={() => handleEdit(branch)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleDelete(branch)}>
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
          title={selectedBranch ? "Edit Cabang" : "Tambah Cabang"}
          size="md"
        >
          <form className="space-y-4">
            <Input
              label="Nama Cabang"
              type="text"
              placeholder="Masukkan nama cabang"
              defaultValue={selectedBranch?.branch_name}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                rows={3}
                placeholder="Masukkan alamat lengkap"
                defaultValue={selectedBranch?.address}
              />
            </div>
            <Input
              label="Telepon"
              type="text"
              placeholder="Masukkan nomor telepon"
              defaultValue={selectedBranch?.phone}
            />
            <div className="flex gap-3 pt-4">
              <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)} className="flex-1">
                Batal
              </Button>
              <Button type="submit" className="flex-1">
                {selectedBranch ? "Update" : "Simpan"}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </DashboardLayout>
  );
}
