"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { Car, Printer, CheckCircle } from "lucide-react";
import { generateTicketNumber } from "@/lib/utils";

export default function EntryPage() {
  const [licensePlate, setLicensePlate] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [area, setArea] = useState("");
  const [ticketNumber, setTicketNumber] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Generate ticket number
    const ticket = generateTicketNumber();
    setTicketNumber(ticket);
    setShowSuccess(true);

    // Reset form after 3 seconds
    setTimeout(() => {
      setLicensePlate("");
      setVehicleType("");
      setArea("");
      setShowSuccess(false);
    }, 3000);
  };

  const handlePrint = () => {
    alert(`Print tiket: ${ticketNumber}`);
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Transaksi Masuk</h1>
          <p className="text-gray-600 mt-1">Input kendaraan yang masuk area parkir</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Slot Tersedia</p>
              <p className="text-3xl font-bold text-green-600 mt-2">45</p>
              <p className="text-xs text-gray-500 mt-1">dari 100 slot</p>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Kendaraan Aktif</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">55</p>
              <p className="text-xs text-gray-500 mt-1">sedang parkir</p>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Hari Ini</p>
              <p className="text-3xl font-bold text-purple-600 mt-2">87</p>
              <p className="text-xs text-gray-500 mt-1">total transaksi</p>
            </div>
          </Card>
        </div>

        <Card className="p-8">
          {!showSuccess ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-primary-100 p-3 rounded-lg">
                  <Car className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Form Input Kendaraan</h2>
                  <p className="text-sm text-gray-600">Masukkan data kendaraan yang masuk</p>
                </div>
              </div>

              <Input
                label="Plat Nomor"
                type="text"
                placeholder="Contoh: B 1234 ABC"
                value={licensePlate}
                onChange={(e) => setLicensePlate(e.target.value.toUpperCase())}
                required
              />

              <Select
                label="Jenis Kendaraan"
                options={[
                  { value: "", label: "Pilih Jenis Kendaraan" },
                  { value: "1", label: "Motor" },
                  { value: "2", label: "Mobil" },
                  { value: "3", label: "Bus/Truk" },
                ]}
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
                required
              />

              <Select
                label="Area Parkir"
                options={[
                  { value: "", label: "Pilih Area Parkir" },
                  { value: "1", label: "Area A - Motor (45 slot tersedia)" },
                  { value: "2", label: "Area B - Mobil (22 slot tersedia)" },
                  { value: "3", label: "Area C - Bus/Truk (15 slot tersedia)" },
                ]}
                value={area}
                onChange={(e) => setArea(e.target.value)}
                required
              />

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Info:</strong> Tiket akan digenerate otomatis setelah submit. Pastikan data sudah benar sebelum melanjutkan.
                </p>
              </div>

              <Button type="submit" className="w-full" size="lg">
                <Car className="w-5 h-5 mr-2" />
                Daftarkan Kendaraan
              </Button>
            </form>
          ) : (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Berhasil!</h2>
              <p className="text-gray-600 mb-6">Kendaraan berhasil didaftarkan</p>
              
              <Card className="p-6 bg-gray-50 mb-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nomor Tiket:</span>
                    <span className="font-bold text-primary-600">{ticketNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Plat Nomor:</span>
                    <span className="font-medium">{licensePlate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Waktu Masuk:</span>
                    <span className="font-medium">{new Date().toLocaleString("id-ID")}</span>
                  </div>
                </div>
              </Card>

              <Button onClick={handlePrint} className="w-full" size="lg">
                <Printer className="w-5 h-5 mr-2" />
                Cetak Tiket
              </Button>
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}
