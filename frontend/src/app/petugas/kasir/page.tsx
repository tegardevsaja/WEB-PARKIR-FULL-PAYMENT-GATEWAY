"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { formatCurrency } from "@/lib/utils";
import { 
  Car, 
  Printer, 
  QrCode, 
  Banknote, 
  CheckCircle2,
  Loader2,
  Search,
  MapPin,
  Clock,
  Receipt,
  RotateCcw
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { ticketService, paymentService } from "@/services/ticketService";
import { areaService } from "@/services/areaService";

interface Area {
  area_id: number;
  area_name: string;
  capacity: number;
  current_occupancy: number;
  branch_name: string;
  branch_id: number;
}

interface VehicleType {
  vehicle_type_id: number;
  type_name: string;
}

interface TicketInfo {
  ticket_id: number;
  ticket_number: string;
  license_plate: string;
  vehicle_type: string;
  vehicle_type_id: number;
  entry_time: string;
  area_name: string;
  branch_name: string;
  calculated_amount: number;
  first_hour_rate: number;
  next_hour_rate: number;
}

export default function KasirPage() {
  const [activeTab, setActiveTab] = useState<"masuk" | "keluar">("masuk");
  const [loading, setLoading] = useState(false);
  
  // Entry state
  const [licensePlate, setLicensePlate] = useState("");
  const [selectedVehicleType, setSelectedVehicleType] = useState<string>("");
  const [selectedArea, setSelectedArea] = useState<string>("");
  const [areas, setAreas] = useState<Area[]>([]);
  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([]);
  const [availableSlots, setAvailableSlots] = useState(0);
  const [totalSlots, setTotalSlots] = useState(0);

  // Exit state
  const [ticketNumber, setTicketNumber] = useState("");
  const [ticketInfo, setTicketInfo] = useState<TicketInfo | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<"cash" | "qris" | null>(null);
  const [showQR, setShowQR] = useState(false);
  const [qrData, setQrData] = useState<{order_id: string; qr_string: string; amount: number; is_mock?: boolean} | null>(null);
  const [checkingPayment, setCheckingPayment] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'pending' | 'success' | 'failed'>('idle');

  // Load areas and vehicle types on mount
  useEffect(() => {
    loadInitialData();
  }, []);

  // Update available slots when area changes
  useEffect(() => {
    if (selectedArea) {
      const area = areas.find(a => a.area_id.toString() === selectedArea);
      if (area) {
        setAvailableSlots(area.capacity - area.current_occupancy);
        setTotalSlots(area.capacity);
      }
    }
  }, [selectedArea, areas]);

  const loadInitialData = async () => {
    try {
      console.log('🔄 [KasirPage] Loading initial data...');
      
      // Load areas
      const areasData = await areaService.getAll();
      console.log('✅ [KasirPage] Areas loaded:', areasData);
      setAreas(areasData || []);

      // Fallback vehicle types
      setVehicleTypes([
        { vehicle_type_id: 1, type_name: 'Motor' },
        { vehicle_type_id: 2, type_name: 'Mobil' },
        { vehicle_type_id: 3, type_name: 'Bus/Truk' }
      ]);
    } catch (error) {
      console.error('❌ [KasirPage] Error loading initial data:', error);
      setVehicleTypes([
        { vehicle_type_id: 1, type_name: 'Motor' },
        { vehicle_type_id: 2, type_name: 'Mobil' },
        { vehicle_type_id: 3, type_name: 'Bus/Truk' }
      ]);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (activeTab === "masuk") {
        if (e.key === "F1") {
          e.preventDefault();
          setSelectedVehicleType("1");
        } else if (e.key === "F2") {
          e.preventDefault();
          setSelectedVehicleType("2");
        } else if (e.key === "F3") {
          e.preventDefault();
          setSelectedVehicleType("3");
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [activeTab]);

  // Vehicle Entry Handler
  const handleMasukSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!licensePlate || !selectedVehicleType || !selectedArea) {
      alert('Harap isi semua field: Plat Nomor, Jenis Kendaraan, dan Area Parkir');
      return;
    }

    try {
      setLoading(true);
      console.log('🔄 [KasirPage] Processing vehicle entry...');

      const response = await ticketService.entry({
        license_plate: licensePlate,
        vehicle_type_id: parseInt(selectedVehicleType),
        area_id: parseInt(selectedArea)
      });

      if (response.success) {
        const ticket = response.data;
        console.log('✅ [KasirPage] Ticket created:', ticket);
        
        alert(`Tiket berhasil dibuat!\nNomor Tiket: ${ticket.ticket_number}\nPlat: ${ticket.license_plate}\nArea: ${ticket.area_name}`);
        
        // Print ticket
        printTicket(ticket);
        
        handleClearMasuk();
        
        // Refresh areas to update slot count
        loadInitialData();
      } else {
        alert('Gagal membuat tiket: ' + response.message);
      }
    } catch (error: any) {
      console.error('❌ [KasirPage] Entry error:', error);
      alert(error.response?.data?.message || 'Gagal membuat tiket. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const printTicket = (ticket: any) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Tiket Parkir - ${ticket.ticket_number}</title>
            <style>
              body { font-family: monospace; text-align: center; padding: 20px; }
              .ticket { border: 2px dashed #000; padding: 20px; max-width: 300px; margin: 0 auto; }
              h2 { margin: 0 0 10px 0; }
              .info { margin: 10px 0; }
              .barcode { margin: 20px 0; font-size: 24px; }
            </style>
          </head>
          <body>
            <div class="ticket">
              <h2>TIKET PARKIR</h2>
              <div class="info"><strong>${ticket.branch_name}</strong></div>
              <div class="info">${ticket.area_name}</div>
              <div class="barcode">${ticket.ticket_number}</div>
              <div class="info">Plat: ${ticket.license_plate}</div>
              <div class="info">Jenis: ${ticket.vehicle_type_name}</div>
              <div class="info">Masuk: ${new Date(ticket.entry_time).toLocaleString('id-ID')}</div>
              <hr>
              <div style="font-size: 12px;">Simpan tiket ini sebagai bukti parkir</div>
            </div>
            <script>window.print(); window.close();</script>
          </body>
        </html>
      `);
    }
  };

  const handleClearMasuk = () => {
    setLicensePlate("");
    setSelectedVehicleType("");
    setSelectedArea("");
    setAvailableSlots(0);
    setTotalSlots(0);
  };

  // Search Ticket Handler
  const handleSearchTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!ticketNumber.trim()) {
      alert('Harap masukkan nomor tiket');
      return;
    }

    try {
      setLoading(true);
      console.log('🔄 [KasirPage] Searching ticket...');

      const response = await ticketService.search({
        ticket_number: ticketNumber.toUpperCase()
      });

      if (response.success && response.data) {
        console.log('✅ [KasirPage] Ticket found:', response.data);
        setTicketInfo(response.data);
      } else {
        alert('Tiket tidak ditemukan atau sudah keluar');
      }
    } catch (error: any) {
      console.error('❌ [KasirPage] Search error:', error);
      alert(error.response?.data?.message || 'Gagal mencari tiket');
    } finally {
      setLoading(false);
    }
  };

  // Payment Handler
  const handlePayment = async (method: "cash" | "qris") => {
    if (!ticketInfo) return;

    setSelectedPayment(method);
    setPaymentStatus('pending');

    try {
      console.log('🔄 [KasirPage] Processing payment...', method);

      if (method === 'qris') {
        setLoading(true);
        const qrisResponse = await paymentService.generateQRIS({
          ticket_id: ticketInfo.ticket_id,
          amount: ticketInfo.calculated_amount,
          ticket_number: ticketInfo.ticket_number,
          license_plate: ticketInfo.license_plate
        });

        if (qrisResponse.success) {
          setQrData(qrisResponse.data);
          setShowQR(true);
          
          // Start polling for payment status
          startPaymentPolling(qrisResponse.data.order_id);
        } else {
          alert('Gagal generate QRIS: ' + qrisResponse.message);
          setPaymentStatus('failed');
        }
        setLoading(false);
      } else {
        // Cash payment - process immediately
        setLoading(true);
        const exitResponse = await ticketService.exit({
          ticket_id: ticketInfo.ticket_id,
          payment_method: 'cash'
        });

        if (exitResponse.success) {
          console.log('✅ [KasirPage] Cash payment successful');
          setPaymentStatus('success');
          
          // Print receipt
          printReceipt(ticketInfo, exitResponse.data);
          
          setTimeout(() => {
            handleClearKeluar();
            alert('Pembayaran Cash berhasil! Tiket telah dicetak.');
          }, 500);
        } else {
          alert('Gagal proses pembayaran: ' + exitResponse.message);
          setPaymentStatus('failed');
        }
        setLoading(false);
      }
    } catch (error: any) {
      console.error('❌ [KasirPage] Payment error:', error);
      alert(error.response?.data?.message || 'Gagal proses pembayaran');
      setPaymentStatus('failed');
      setLoading(false);
    }
  };

  const startPaymentPolling = (orderId: string) => {
    let attempts = 0;
    const maxAttempts = 60;
    
    const checkStatus = async () => {
      if (attempts >= maxAttempts || !showQR) {
        setCheckingPayment(false);
        return;
      }

      attempts++;
      setCheckingPayment(true);

      try {
        // For mock orders, auto-success after 5 seconds
        if (orderId.includes('MOCK') && attempts >= 3) {
          console.log('✅ [KasirPage] Mock payment auto-success');
          
          if (ticketInfo) {
            await ticketService.exit({
              ticket_id: ticketInfo.ticket_id,
              payment_method: 'qris'
            });
          }
          
          setPaymentStatus('success');
          setShowQR(false);
          setCheckingPayment(false);
          
          printReceipt(ticketInfo!, { payment_method: 'qris', payment_status: 'paid' });
          
          setTimeout(() => {
            handleClearKeluar();
            alert('Pembayaran QRIS berhasil!');
          }, 500);
          return;
        }

        const statusResponse = await paymentService.checkQRISStatus(orderId);
        
        if (statusResponse.data?.transaction_status === 'settlement' ||
            statusResponse.data?.transaction_status === 'capture') {
          if (ticketInfo) {
            await ticketService.exit({
              ticket_id: ticketInfo.ticket_id,
              payment_method: 'qris'
            });
          }
          
          setPaymentStatus('success');
          setShowQR(false);
          setCheckingPayment(false);
          
          printReceipt(ticketInfo!, { payment_method: 'qris', payment_status: 'paid' });
          
          setTimeout(() => {
            handleClearKeluar();
            alert('Pembayaran QRIS berhasil!');
          }, 500);
          return;
        }
      } catch (error) {
        console.error('❌ [KasirPage] Status check error:', error);
      }

      setTimeout(checkStatus, 2000);
    };

    checkStatus();
  };

  const printReceipt = (ticket: TicketInfo, paymentData: any) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const duration = Math.ceil((new Date().getTime() - new Date(ticket.entry_time).getTime()) / (1000 * 60 * 60));
      
      printWindow.document.write(`
        <html>
          <head>
            <title>Struk Parkir - ${ticket.ticket_number}</title>
            <style>
              body { font-family: monospace; text-align: center; padding: 20px; }
              .receipt { border: 1px solid #000; padding: 20px; max-width: 300px; margin: 0 auto; }
              h2 { margin: 0 0 10px 0; }
              .info { margin: 5px 0; text-align: left; }
              .total { font-size: 24px; font-weight: bold; margin: 20px 0; }
              .line { border-top: 1px dashed #000; margin: 10px 0; }
            </style>
          </head>
          <body>
            <div class="receipt">
              <h2>STRUK PARKIR</h2>
              <div>${ticket.branch_name}</div>
              <div class="line"></div>
              <div class="info"><strong>No Tiket:</strong> ${ticket.ticket_number}</div>
              <div class="info"><strong>Plat:</strong> ${ticket.license_plate}</div>
              <div class="info"><strong>Jenis:</strong> ${ticket.vehicle_type}</div>
              <div class="info"><strong>Area:</strong> ${ticket.area_name}</div>
              <div class="line"></div>
              <div class="info"><strong>Masuk:</strong> ${new Date(ticket.entry_time).toLocaleString('id-ID')}</div>
              <div class="info"><strong>Keluar:</strong> ${new Date().toLocaleString('id-ID')}</div>
              <div class="info"><strong>Durasi:</strong> ${duration} jam</div>
              <div class="line"></div>
              <div class="total">${formatCurrency(ticket.calculated_amount)}</div>
              <div><strong>Metode: ${paymentData.payment_method?.toUpperCase() || 'CASH'}</strong></div>
              <div class="line"></div>
              <div style="font-size: 12px;">Terima kasih atas kunjungan Anda</div>
            </div>
            <script>window.print(); window.close();</script>
          </body>
        </html>
      `);
    }
  };

  const handleClearKeluar = () => {
    setTicketNumber("");
    setTicketInfo(null);
    setSelectedPayment(null);
    setShowQR(false);
    setQrData(null);
    setPaymentStatus('idle');
    setCheckingPayment(false);
  };

  const getDuration = () => {
    if (!ticketInfo) return 0;
    const entry = new Date(ticketInfo.entry_time);
    const now = new Date();
    const diffMs = now.getTime() - entry.getTime();
    const diffHours = Math.ceil(diffMs / (1000 * 60 * 60));
    return diffHours;
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
                    disabled={loading}
                  />
                </div>

                {/* Area Parkir */}
                <div>
                  <label className="block text-base font-bold text-gray-700 mb-3 uppercase tracking-wide flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Area Parkir
                  </label>
                  <Select
                    options={[
                      { value: "", label: "Pilih Area Parkir" },
                      ...areas.map(area => ({
                        value: area.area_id.toString(),
                        label: `${area.area_name} (${area.branch_name}) - Tersedia: ${area.capacity - area.current_occupancy}/${area.capacity}`
                      }))
                    ]}
                    value={selectedArea}
                    onChange={(e) => setSelectedArea(e.target.value)}
                    className="text-lg h-16"
                    required
                    disabled={loading}
                  />
                </div>

                {/* Jenis Kendaraan */}
                <div>
                  <label className="block text-base font-bold text-gray-700 mb-4 uppercase tracking-wide">
                    Jenis Kendaraan
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    {vehicleTypes.map((vt) => (
                      <button
                        key={vt.vehicle_type_id}
                        type="button"
                        onClick={() => setSelectedVehicleType(vt.vehicle_type_id.toString())}
                        disabled={loading}
                        className={`relative py-8 text-xl font-bold rounded-2xl transition-all transform ${
                          selectedVehicleType === vt.vehicle_type_id.toString()
                            ? "bg-white text-secondary-700 border-4 border-secondary-500 scale-105 shadow-lg"
                            : "bg-white text-gray-700 border-2 border-gray-300 hover:border-secondary-300 hover:shadow-lg"
                        } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {selectedVehicleType === vt.vehicle_type_id.toString() && (
                          <div className="absolute top-3 right-3">
                            <CheckCircle2 className="w-7 h-7 text-secondary-600" />
                          </div>
                        )}
                        {vt.type_name}
                        <div className={`text-xs mt-1 ${selectedVehicleType === vt.vehicle_type_id.toString() ? "text-secondary-600" : "text-gray-500"}`}>
                          F{vt.vehicle_type_id}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Slot Info */}
                {selectedArea && (
                  <div className={`rounded-2xl p-6 text-center border-2 ${
                    availableSlots > 0 
                      ? 'bg-gradient-to-r from-green-100 to-green-200 border-green-400' 
                      : 'bg-gradient-to-r from-red-100 to-red-200 border-red-400'
                  }`}>
                    <p className="text-sm font-semibold text-gray-600 mb-1 uppercase tracking-wide">Slot Tersedia</p>
                    <p className={`text-4xl font-bold ${availableSlots > 0 ? 'text-green-700' : 'text-red-700'}`}>
                      {availableSlots}<span className="text-2xl text-gray-600">/{totalSlots}</span>
                    </p>
                    {availableSlots === 0 && (
                      <p className="text-red-600 font-semibold mt-2">Area penuh! Pilih area lain.</p>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-5 pt-4">
                  <Button
                    type="button"
                    variant="secondary"
                    size="lg"
                    onClick={handleClearMasuk}
                    disabled={loading}
                    className="h-20 text-xl font-bold rounded-xl"
                  >
                    <RotateCcw className="w-6 h-6 mr-3" />
                    Clear
                  </Button>
                  <Button
                    type="submit"
                    size="lg"
                    disabled={loading || !licensePlate || !selectedVehicleType || !selectedArea || availableSlots === 0}
                    className="h-20 text-xl font-bold rounded-xl"
                    style={{
                      backgroundColor: (!licensePlate || !selectedVehicleType || !selectedArea || availableSlots === 0 || loading) ? '#d1d5db' : '#5465FF',
                      color: 'white'
                    }}
                  >
                    {loading ? (
                      <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                    ) : (
                      <Printer className="w-6 h-6 mr-3" />
                    )}
                    {loading ? 'Memproses...' : 'Cetak Tiket'}
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
                      <label className="block text-base font-bold text-gray-700 mb-3 uppercase tracking-wide flex items-center gap-2">
                        <Receipt className="w-5 h-5" />
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
                        disabled={loading}
                      />
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      disabled={loading}
                      className="w-full h-20 text-xl font-bold rounded-xl"
                      style={{ backgroundColor: '#5465FF', color: 'white' }}
                    >
                      {loading ? (
                        <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                      ) : (
                        <Search className="w-6 h-6 mr-3" />
                      )}
                      {loading ? 'Mencari...' : 'Cari Tiket'}
                    </Button>
                  </form>
                ) : (
                  <>
                    {/* Ticket Info */}
                    <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-200">
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-1">
                          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">No. Tiket</p>
                          <p className="text-xl font-bold text-gray-900">{ticketInfo.ticket_number}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Plat Nomor</p>
                          <p className="text-xl font-bold text-gray-900">{ticketInfo.license_plate}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Jenis Kendaraan</p>
                          <p className="text-xl font-bold text-gray-900">{ticketInfo.vehicle_type}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Area</p>
                          <p className="text-xl font-bold text-gray-900">{ticketInfo.area_name}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            Waktu Masuk
                          </p>
                          <p className="text-lg font-semibold text-gray-700">{new Date(ticketInfo.entry_time).toLocaleString('id-ID')}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Durasi Parkir</p>
                          <p className="text-xl font-bold text-secondary-600">{getDuration()} Jam</p>
                        </div>
                        <div className="col-span-2 space-y-1 bg-gradient-to-r from-secondary-50 to-secondary-100 rounded-xl p-4">
                          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Total Biaya</p>
                          <p className="text-4xl font-bold text-secondary-600">
                            {formatCurrency(ticketInfo.calculated_amount)}
                          </p>
                          <p className="text-sm text-gray-500">
                            Tarif: {formatCurrency(ticketInfo.first_hour_rate)}/jam pertama, {formatCurrency(ticketInfo.next_hour_rate)}/jam berikutnya
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
                              disabled={loading}
                              className="py-10 bg-white border-2 border-gray-300 rounded-2xl hover:border-secondary-500 hover:bg-secondary-50 transition-all shadow-md hover:shadow-xl flex flex-col items-center gap-4 disabled:opacity-50"
                            >
                              <Banknote className="w-16 h-16 text-secondary-600" />
                              <span className="text-2xl font-bold text-gray-900">Cash</span>
                            </button>
                            <button
                              onClick={() => handlePayment("qris")}
                              disabled={loading}
                              className="py-10 bg-white border-2 border-gray-300 rounded-2xl hover:border-secondary-500 hover:bg-secondary-50 transition-all shadow-md hover:shadow-xl flex flex-col items-center gap-4 disabled:opacity-50"
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
                          disabled={loading}
                          className="w-full h-20 text-xl font-bold rounded-xl"
                        >
                          <RotateCcw className="w-6 h-6 mr-3" />
                          Clear / Cari Lagi
                        </Button>
                      </>
                    )}

                    {showQR && qrData && (
                      <div className="text-center py-6">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                          Scan QR Code untuk Pembayaran
                        </h3>
                        <p className="text-gray-600 mb-6">
                          Total: <span className="font-bold text-secondary-600">{formatCurrency(qrData.amount)}</span>
                        </p>
                        
                        <div className="inline-block p-8 bg-white border-4 border-secondary-600 rounded-3xl shadow-2xl">
                          {qrData.is_mock ? (
                            <div className="w-[280px] h-[280px] flex items-center justify-center bg-gray-100 rounded-lg">
                              <div className="text-center">
                                <QrCode className="w-24 h-24 text-gray-400 mx-auto mb-4" />
                                <p className="text-sm text-gray-500">MOCK QRIS</p>
                                <p className="text-xs text-gray-400">Auto-success in 5s</p>
                              </div>
                            </div>
                          ) : (
                            <QRCodeSVG
                              value={qrData.qr_string}
                              size={280}
                            />
                          )}
                        </div>
                        
                        <div className="mt-6">
                          {checkingPayment ? (
                            <div className="flex items-center justify-center gap-3">
                              <Loader2 className="w-6 h-6 text-secondary-600 animate-spin" />
                              <p className="text-xl text-gray-600 font-semibold">Menunggu pembayaran...</p>
                            </div>
                          ) : paymentStatus === 'success' ? (
                            <div className="flex items-center justify-center gap-3 text-green-600">
                              <CheckCircle2 className="w-8 h-8" />
                              <p className="text-2xl font-bold">Pembayaran Berhasil!</p>
                            </div>
                          ) : null}
                        </div>

                        {/* Cancel Button */}
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() => {
                            setShowQR(false);
                            setQrData(null);
                            setCheckingPayment(false);
                          }}
                          disabled={paymentStatus === 'success'}
                          className="mt-6"
                        >
                          Batal
                        </Button>
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
