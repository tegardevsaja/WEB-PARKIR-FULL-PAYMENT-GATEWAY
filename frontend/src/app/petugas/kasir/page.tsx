"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { formatCurrency } from "@/lib/utils";
import { Car, Printer, QrCode, Banknote, CheckCircle2 } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

export default function KasirPage() {
  const [activeTab, setActiveTab] = useState<"masuk" | "keluar">("masuk");
  
  // State untuk Masuk
  const [licensePlate, setLicensePlate] = useState("");
  const [selectedVehicleType, setSelectedVehicleType] = useState<string>("");
  const [availableSlots, setAvailableSlots] = useState(37);
  const [totalSlots] = useState(300);

  // State untuk Keluar
  const [ticketNumber, setTicketNumber] = useState("");
  const [ticketInfo, setTicketInfo] = useState<any>(null);
  const [selectedPayment, setSelectedPayment] = useState<"cash" | "qris" | null>(null);
  const [showQR, setShowQR] = useState(false);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (activeTab === "masuk") {
        if (e.key === "F1") {
          e.preventDefault();
          setSelectedVehicleType("motor");
        } else if (e.key === "F2") {
          e.preventDefault();
          setSelectedVehicleType("mobil");
        } else if (e.key === "F3") {
          e.preventDefault();
          setSelectedVehicleType("bus");
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [activeTab]);

  const handleMasukSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ticketNum = `TKT-${Date.now()}`;
    alert(`Tiket berhasil dicetak!\nNomor: ${ticketNum}\nPlat: ${licensePlate}\nJenis: ${selectedVehicleType}`);
    handleClearMasuk();
  };

  const handleClearMasuk = () => {
    setLicensePlate("");
    setSelectedVehicleType("");
  };

  const handleSearchTicket = (e: React.FormEvent) => {
    e.preventDefault();
    const entryTime = new Date();
    entryTime.setHours(entryTime.getHours() - 3);
    const exitTime = new Date();
    const duration = 3;
    const totalAmount = 11000;

    setTicketInfo({
      ticket_number: ticketNumber,
      license_plate: "B 1234 ABC",
      vehicle_type: "Mobil",
      entry_time: entryTime.toLocaleString("id-ID"),
      exit_time: exitTime.toLocaleString("id-ID"),
      duration: duration,
      total_amount: totalAmount,
    });
  };

  const handlePayment = (method: "cash" | "qris") => {
    setSelectedPayment(method);
    if (method === "qris") {
      setShowQR(true);
      setTimeout(() => {
        setShowQR(false);
        alert("Pembayaran QRIS berhasil!");
        handleClearKeluar();
      }, 3000);
    } else {
      alert("Pembayaran Cash berhasil!");
      handleClearKeluar();
    }
  };

  const handleClearKeluar = () => {
    setTicketNumber("");
    setTicketInfo(null);
    setSelectedPayment(null);
    setShowQR(false);
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        <Card className="overflow-hidden shadow-lg">
          {/* Tabs Header */}
          <div className="grid grid-cols-2 bg-white">
            <button
              onClick={() => setActiveTab("masuk")}
              className={`relative py-5 text-xl font-bold transition-all ${
                activeTab === "masuk"
                  ? "text-secondary-700"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Car className="w-6 h-6 inline-block mr-2 mb-1" />
              Masuk
              {activeTab === "masuk" && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-secondary-500 to-primary-500"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab("keluar")}
              className={`relative py-5 text-xl font-bold transition-all ${
                activeTab === "keluar"
                  ? "text-secondary-700"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <CheckCircle2 className="w-6 h-6 inline-block mr-2 mb-1" />
              Keluar
              {activeTab === "keluar" && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-secondary-500 to-primary-500"></div>
              )}
            </button>
          </div>

          <div className="h-1 bg-gray-100"></div>

          {/* Content */}
          <div className="p-10 bg-gradient-to-br from-gray-50 to-white min-h-[600px]">
            {activeTab === "masuk" ? (
              <form onSubmit={handleMasukSubmit} className="space-y-8">
                {/* Plat Nomor */}
                <div>
                  <label className="block text-base font-bold text-gray-700 mb-3 uppercase tracking-wide">
                    Plat Nomor
                  </label>
                  <Input
                    type="text"
                    value={licensePlate}
                    onChange={(e) => setLicensePlate(e.target.value.toUpperCase())}
                    placeholder="B 1234 ABC"
                    className="text-3xl h-20 text-center font-bold tracking-wider border-2 focus:border-secondary-500"
                    required
                    autoFocus
                  />
                </div>

                {/* Jenis Kendaraan */}
                <div>
                  <label className="block text-base font-bold text-gray-700 mb-4 uppercase tracking-wide">
                    Jenis Kendaraan
                  </label>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <button
                      type="button"
                      onClick={() => setSelectedVehicleType("motor")}
                      className={`relative py-8 text-2xl font-bold rounded-2xl transition-all transform ${
                        selectedVehicleType === "motor"
                          ? "bg-white text-secondary-700 border-4 border-secondary-500 scale-105"
                          : "bg-white text-gray-700 border-2 border-gray-300 hover:border-secondary-300 hover:shadow-lg"
                      }`}
                    >
                      {selectedVehicleType === "motor" && (
                        <div className="absolute top-3 right-3">
                          <CheckCircle2 className="w-7 h-7 text-secondary-600" />
                        </div>
                      )}
                      Motor
                      <div className={`text-xs mt-1 ${selectedVehicleType === "motor" ? "text-secondary-600" : "text-gray-500"}`}>F1</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedVehicleType("mobil")}
                      className={`relative py-8 text-2xl font-bold rounded-2xl transition-all transform ${
                        selectedVehicleType === "mobil"
                          ? "bg-white text-secondary-700 border-4 border-secondary-500 scale-105"
                          : "bg-white text-gray-700 border-2 border-gray-300 hover:border-secondary-300 hover:shadow-lg"
                      }`}
                    >
                      {selectedVehicleType === "mobil" && (
                        <div className="absolute top-3 right-3">
                          <CheckCircle2 className="w-7 h-7 text-secondary-600" />
                        </div>
                      )}
                      Mobil
                      <div className={`text-xs mt-1 ${selectedVehicleType === "mobil" ? "text-secondary-600" : "text-gray-500"}`}>F2</div>
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedVehicleType("bus")}
                    className={`relative w-full py-8 text-2xl font-bold rounded-2xl transition-all transform ${
                      selectedVehicleType === "bus"
                        ? "bg-white text-secondary-700 border-4 border-secondary-500 scale-105"
                        : "bg-white text-gray-700 border-2 border-gray-300 hover:border-secondary-300 hover:shadow-lg"
                    }`}
                  >
                    {selectedVehicleType === "bus" && (
                      <div className="absolute top-3 right-3">
                        <CheckCircle2 className="w-7 h-7 text-secondary-600" />
                      </div>
                    )}
                    Bus/Truck
                    <div className={`text-xs mt-1 ${selectedVehicleType === "bus" ? "text-secondary-600" : "text-gray-500"}`}>F3</div>
                  </button>
                </div>

                {/* Slot Info */}
                <div className="bg-gradient-to-r from-accent-200 to-accent-300 rounded-2xl p-6 text-center border-2 border-accent-400">
                  <p className="text-sm font-semibold text-gray-600 mb-1 uppercase tracking-wide">Slot Tersedia</p>
                  <p className="text-4xl font-bold text-secondary-700">
                    {availableSlots}<span className="text-2xl text-gray-600">/{totalSlots}</span>
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-5 pt-4">
                  <Button
                    type="button"
                    variant="secondary"
                    size="lg"
                    onClick={handleClearMasuk}
                    className="h-20 text-xl font-bold rounded-xl"
                  >
                    Clear
                  </Button>
                  <Button
                    type="submit"
                    size="lg"
                    className="h-20 text-xl font-bold rounded-xl"
                    style={{
                      backgroundColor: !licensePlate || !selectedVehicleType ? '#d1d5db' : '#5465FF',
                      color: 'white'
                    }}
                    disabled={!licensePlate || !selectedVehicleType}
                  >
                    <Printer className="w-6 h-6 mr-3" />
                    Cetak Tiket
                  </Button>
                </div>

                {/* Shortcuts Info */}
                <div className="text-center text-sm text-gray-500 pt-2 font-medium">
                  💡 Shortcut: <span className="font-bold">F1</span>=Motor <span className="font-bold">F2</span>=Mobil <span className="font-bold">F3</span>=Bus/Truck
                </div>
              </form>
            ) : (
              <div className="space-y-8">
                {!ticketInfo ? (
                  <form onSubmit={handleSearchTicket} className="space-y-8">
                    {/* Input Tiket */}
                    <div>
                      <label className="block text-base font-bold text-gray-700 mb-3 uppercase tracking-wide">
                        Nomor Tiket
                      </label>
                      <Input
                        type="text"
                        value={ticketNumber}
                        onChange={(e) => setTicketNumber(e.target.value.toUpperCase())}
                        placeholder="TKT-20250211-0001"
                        className="text-3xl h-20 text-center font-bold tracking-wider border-2 focus:border-secondary-500"
                        required
                        autoFocus
                      />
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full h-20 text-xl font-bold rounded-xl"
                      style={{ backgroundColor: '#5465FF', color: 'white' }}
                    >
                      Cari Tiket
                    </Button>
                  </form>
                ) : (
                  <>
                    {/* Ticket Info */}
                    <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-200">
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-1">
                          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Jenis Kendaraan</p>
                          <p className="text-xl font-bold text-gray-900">{ticketInfo.vehicle_type}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Plat Nomor</p>
                          <p className="text-xl font-bold text-gray-900">{ticketInfo.license_plate}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Waktu Masuk</p>
                          <p className="text-lg font-semibold text-gray-700">{ticketInfo.entry_time}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Waktu Keluar</p>
                          <p className="text-lg font-semibold text-gray-700">{ticketInfo.exit_time}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Durasi Parkir</p>
                          <p className="text-xl font-bold text-gray-900">{ticketInfo.duration} Jam</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Total Biaya</p>
                          <p className="text-3xl font-bold text-secondary-600">
                            {formatCurrency(ticketInfo.total_amount)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {!showQR && !selectedPayment && (
                      <>
                        {/* Payment Buttons */}
                        <div>
                          <label className="block text-base font-bold text-gray-700 mb-4 uppercase tracking-wide">
                            Metode Pembayaran
                          </label>
                          <div className="grid grid-cols-2 gap-5">
                            <button
                              onClick={() => handlePayment("cash")}
                              className="py-10 bg-white border-2 border-gray-300 rounded-2xl hover:border-secondary-500 hover:bg-secondary-50 transition-all shadow-md hover:shadow-xl flex flex-col items-center gap-4"
                            >
                              <Banknote className="w-16 h-16 text-secondary-600" />
                              <span className="text-2xl font-bold text-gray-900">Cash</span>
                            </button>
                            <button
                              onClick={() => handlePayment("qris")}
                              className="py-10 bg-white border-2 border-gray-300 rounded-2xl hover:border-secondary-500 hover:bg-secondary-50 transition-all shadow-md hover:shadow-xl flex flex-col items-center gap-4"
                            >
                              <QrCode className="w-16 h-16 text-secondary-600" />
                              <span className="text-2xl font-bold text-gray-900">QRIS</span>
                            </button>
                          </div>
                        </div>

                        {/* Action Button */}
                        <Button
                          type="button"
                          variant="secondary"
                          size="lg"
                          onClick={handleClearKeluar}
                          className="w-full h-20 text-xl font-bold rounded-xl"
                        >
                          Clear
                        </Button>
                      </>
                    )}

                    {showQR && (
                      <div className="text-center py-10">
                        <h3 className="text-2xl font-bold text-gray-900 mb-8">
                          Scan QR Code untuk Pembayaran
                        </h3>
                        <div className="inline-block p-8 bg-white border-4 border-secondary-600 rounded-3xl shadow-2xl">
                          <QRCodeSVG
                            value={`QRIS-${ticketInfo.ticket_number}-${ticketInfo.total_amount}`}
                            size={280}
                          />
                        </div>
                        <p className="text-xl text-gray-600 mt-8 font-semibold">Menunggu pembayaran...</p>
                        <div className="flex items-center justify-center gap-3 mt-6">
                          <div className="w-4 h-4 bg-secondary-600 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                          <div className="w-4 h-4 bg-secondary-600 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                          <div className="w-4 h-4 bg-secondary-600 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
