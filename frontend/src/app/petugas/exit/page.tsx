"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { formatCurrency } from "@/lib/utils";
import { Search, DollarSign, Printer, CheckCircle, QrCode, Banknote } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

interface TicketInfo {
  ticket_number: string;
  license_plate: string;
  vehicle_type: string;
  entry_time: string;
  exit_time: string;
  duration: number;
  total_amount: number;
}

export default function ExitPage() {
  const [ticketNumber, setTicketNumber] = useState("");
  const [ticketInfo, setTicketInfo] = useState<TicketInfo | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "qris" | null>(null);
  const [showQR, setShowQR] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Dummy ticket info
    const entryTime = new Date();
    entryTime.setHours(entryTime.getHours() - 3); // 3 jam yang lalu
    
    const exitTime = new Date();
    const duration = 3;
    const firstHourRate = 5000;
    const nextHourRate = 3000;
    const totalAmount = firstHourRate + ((duration - 1) * nextHourRate);

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
    setPaymentMethod(method);
    if (method === "qris") {
      setShowQR(true);
      // Simulate payment success after 3 seconds
      setTimeout(() => {
        setShowQR(false);
        setPaymentSuccess(true);
      }, 3000);
    } else {
      setPaymentSuccess(true);
    }
  };

  const handlePrintReceipt = () => {
    alert("Cetak struk pembayaran");
    // Reset
    setTicketNumber("");
    setTicketInfo(null);
    setPaymentMethod(null);
    setPaymentSuccess(false);
  };

  const handleNewTransaction = () => {
    setTicketNumber("");
    setTicketInfo(null);
    setPaymentMethod(null);
    setPaymentSuccess(false);
    setShowQR(false);
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Transaksi Keluar</h1>
          <p className="text-gray-600 mt-1">Proses pembayaran dan cetak struk</p>
        </div>

        {!ticketInfo && (
          <Card className="p-8">
            <form onSubmit={handleSearch} className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-primary-100 p-3 rounded-lg">
                  <Search className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Cari Tiket</h2>
                  <p className="text-sm text-gray-600">Masukkan nomor tiket untuk melihat detail</p>
                </div>
              </div>

              <Input
                label="Nomor Tiket"
                type="text"
                placeholder="Contoh: TKT-20250211-0001"
                value={ticketNumber}
                onChange={(e) => setTicketNumber(e.target.value.toUpperCase())}
                required
              />

              <Button type="submit" className="w-full" size="lg">
                <Search className="w-5 h-5 mr-2" />
                Cari Tiket
              </Button>
            </form>
          </Card>
        )}

        {ticketInfo && !paymentSuccess && (
          <Card className="p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Informasi Tiket</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between py-3 border-b border-gray-200">
                <span className="text-gray-600">Nomor Tiket:</span>
                <span className="font-bold text-primary-600">{ticketInfo.ticket_number}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-200">
                <span className="text-gray-600">Plat Nomor:</span>
                <span className="font-medium">{ticketInfo.license_plate}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-200">
                <span className="text-gray-600">Jenis Kendaraan:</span>
                <span className="font-medium">{ticketInfo.vehicle_type}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-200">
                <span className="text-gray-600">Waktu Masuk:</span>
                <span className="font-medium">{ticketInfo.entry_time}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-200">
                <span className="text-gray-600">Waktu Keluar:</span>
                <span className="font-medium">{ticketInfo.exit_time}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-200">
                <span className="text-gray-600">Durasi Parkir:</span>
                <span className="font-medium">{ticketInfo.duration} jam</span>
              </div>
              <div className="flex justify-between py-4 bg-primary-50 px-4 rounded-lg">
                <span className="text-lg font-semibold text-gray-900">Total Biaya:</span>
                <span className="text-2xl font-bold text-primary-600">{formatCurrency(ticketInfo.total_amount)}</span>
              </div>
            </div>

            {!showQR && !paymentMethod && (
              <>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Pilih Metode Pembayaran</h3>
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    onClick={() => handlePayment("cash")}
                    variant="secondary"
                    size="lg"
                    className="h-24 flex-col"
                  >
                    <Banknote className="w-8 h-8 mb-2" />
                    <span>Cash</span>
                  </Button>
                  <Button
                    onClick={() => handlePayment("qris")}
                    variant="secondary"
                    size="lg"
                    className="h-24 flex-col"
                  >
                    <QrCode className="w-8 h-8 mb-2" />
                    <span>QRIS</span>
                  </Button>
                </div>
              </>
            )}

            {showQR && (
              <div className="text-center py-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Scan QR Code untuk Pembayaran</h3>
                <div className="inline-block p-6 bg-white border-4 border-primary-600 rounded-lg">
                  <QRCodeSVG
                    value={`QRIS-${ticketInfo.ticket_number}-${ticketInfo.total_amount}`}
                    size={200}
                  />
                </div>
                <p className="text-sm text-gray-600 mt-4">Menunggu pembayaran...</p>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                  <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                  <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                </div>
              </div>
            )}
          </Card>
        )}

        {paymentSuccess && (
          <Card className="p-8">
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Pembayaran Berhasil!</h2>
              <p className="text-gray-600 mb-2">Transaksi telah selesai</p>
              <p className="text-sm text-gray-500 mb-6">Metode: {paymentMethod === "cash" ? "Cash" : "QRIS"}</p>
              
              <div className="flex gap-3">
                <Button onClick={handlePrintReceipt} className="flex-1" size="lg">
                  <Printer className="w-5 h-5 mr-2" />
                  Cetak Struk
                </Button>
                <Button onClick={handleNewTransaction} variant="secondary" className="flex-1" size="lg">
                  Transaksi Baru
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
