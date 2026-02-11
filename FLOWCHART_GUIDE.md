# FLOWCHART DOCUMENTATION - APLIKASI PARKIR

## Panduan Pembuatan Flowchart

File ini berisi deskripsi detail untuk membuat 5 flowchart utama menggunakan tools seperti:
- Draw.io (https://app.diagrams.net/)
- Lucidchart (https://www.lucidchart.com/)
- Microsoft Visio

---

## SIMBOL FLOWCHART STANDAR

```
┌─────────────┐
│   Oval      │  → START / END (Terminator)
└─────────────┘

┌─────────────┐
│ Rectangle   │  → PROCESS (Proses/Aksi)
└─────────────┘

◇─────────────◇
│  Diamond    │  → DECISION (Keputusan/Kondisi)
◇─────────────◇

┌─────────────┐
│  Paralel.   │  → INPUT/OUTPUT (Data)
└─────────────┘

      →         → ARROW (Alur/Flow)
```

---

## FLOWCHART 1: PROSES LOGIN

### Deskripsi
Flowchart ini menggambarkan alur autentikasi user dari input credentials hingga redirect ke dashboard sesuai role.

### Simbol dan Alur

```
[START] (Oval)
   ↓
[Tampilkan Form Login] (Parallelogram - I/O)
   ↓
[User Input Username & Password] (Parallelogram - I/O)
   ↓
<Username & Password Kosong?> (Diamond)
   ├── YES → [Error: Field Required] (Rectangle) → (kembali ke Form)
   ↓ NO
[Query Database: SELECT FROM users] (Rectangle)
   ↓
<User Ditemukan?> (Diamond)
   ├── NO → [Error: Username Tidak Ditemukan] (Rectangle) → (kembali)
   ↓ YES
[Verify Password dengan bcrypt] (Rectangle)
   ↓
<Password Cocok?> (Diamond)
   ├── NO → [Error: Password Salah] (Rectangle) → (kembali)
   ↓ YES
<is_active = TRUE?> (Diamond)
   ├── NO → [Error: Akun Non-Aktif] (Rectangle) → [END]
   ↓ YES
[Generate JWT Token] (Rectangle)
   ↓
[Simpan Token ke Session] (Rectangle)
   ↓
[INSERT INTO activity_logs] (Rectangle)
   ↓
<Cek Role> (Diamond)
   ├── admin → [Redirect /admin/dashboard] (Rectangle)
   ├── petugas → [Redirect /petugas/transaction] (Rectangle)
   └── owner → [Redirect /owner/statistics] (Rectangle)
   ↓
[END] (Oval)
```

### Detail Proses
1. **Validasi Input**: Cek apakah field kosong sebelum query
2. **Query Database**: Gunakan prepared statement untuk keamanan
3. **Password Verification**: Gunakan bcrypt.compare()
4. **Status Check**: Pastikan user masih aktif
5. **Token Generation**: JWT dengan payload user_id, username, role
6. **Activity Log**: Catat setiap login untuk audit
7. **Role-based Redirect**: Sesuaikan dashboard dengan role

---

## FLOWCHART 2: PROSES TRANSAKSI (KENDARAAN MASUK)

### Deskripsi
Flowchart untuk proses kendaraan masuk parkir, dari input data hingga generate tiket.

### Simbol dan Alur

```
[START] (Oval)
   ↓
[Petugas Login] (Rectangle)
   ↓
[Tampilkan Form Input Kendaraan] (Parallelogram)
   ↓
[Input: Plat Nomor (wajib), Jenis Kendaraan (dropdown)] (Parallelogram)
   ↓
<Validasi Input?> (Diamond)
   ├── INVALID → [Error Message] (Rectangle) → (kembali)
   ↓ VALID
[Query: SELECT parking_areas] (Rectangle)
   ↓
<Ada Slot Kosong?> (Diamond)
   ├── NO → [Error: Parkir Penuh] (Rectangle) → [END]
   ↓ YES
[Query: Cek Kendaraan Terdaftar] (Rectangle)
   ↓
<Kendaraan Sudah Ada?> (Diamond)
   ├── NO → [INSERT INTO vehicles] (Rectangle)
   └── YES → [Gunakan vehicle_id existing]
   ↓
[Generate Ticket Number] (Rectangle)
   ↓
[INSERT INTO transactions] (Rectangle)
   ↓
[UPDATE current_occupancy + 1] (Rectangle)
   ↓
[INSERT INTO activity_logs] (Rectangle)
   ↓
[Cetak Tiket Masuk] (Parallelogram)
   ↓
[END] (Oval)
```

### Detail Proses
1. **Check Availability**: Query kapasitas vs okupansi saat ini
2. **Vehicle Registration**: Auto-register jika kendaraan baru
3. **Ticket Generation**: Format TKT-YYYYMMDD-XXXX
4. **Occupancy Update**: Real-time tracking
5. **Activity Logging**: Catat vehicle entry

---

## FLOWCHART 3: CETAK STRUK PARKIR (KENDARAAN KELUAR)

### Deskripsi
Flowchart lengkap untuk proses kendaraan keluar, kalkulasi biaya, payment (Cash/QRIS), dan cetak struk.

### Simbol dan Alur

```
[START] (Oval)
   ↓
[Input Ticket Number] (Parallelogram)
   ↓
[Query Transaction Data + JOIN] (Rectangle)
   ↓
<Tiket Valid & Pending?> (Diamond)
   ├── NO → [Error: Tiket Tidak Valid] → [END]
   ↓ YES
[Catat exit_time = NOW()] (Rectangle)
   ↓
[Hitung duration_hours] (Rectangle)
   ↓
<duration < 1?> (Diamond)
   ├── YES → [Set duration = 1]
   ↓ NO
[Query Tarif Parkir] (Rectangle)
   ↓
[Kalkulasi Total Amount] (Rectangle)
   Formula: first_hour + (duration-1) * next_hour
   ↓
[UPDATE transactions] (Rectangle)
   ↓
[Tampilkan Pilihan: CASH / QRIS] (Parallelogram)
   ↓
<Pilih Metode> (Diamond)
   ├── CASH → [Proses Cash Payment]
   └── QRIS → [Proses QRIS Payment]

[PROSES CASH:]
   ↓
[UPDATE payment_status = 'paid'] (Rectangle)
   ↓
[Jump ke Cetak Struk]

[PROSES QRIS:]
   ↓
[Generate order_id] (Rectangle)
   ↓
[Call Midtrans API] (Rectangle)
   ↓
<API Success?> (Diamond)
   ├── NO → [Error: Gagal Generate QR] → [END]
   ↓ YES
[Terima QR Code] (Rectangle)
   ↓
[UPDATE midtrans_order_id] (Rectangle)
   ↓
[Tampilkan QR Code] (Parallelogram)
   ↓
[Polling/Webhook Midtrans] (Rectangle)
   ↓
<Pembayaran Berhasil?> (Diamond)
   ├── NO → [Error: Pembayaran Gagal] → [END]
   ↓ YES
[UPDATE payment_status = 'paid'] (Rectangle)

[CETAK STRUK:]
   ↓
[UPDATE current_occupancy - 1] (Rectangle)
   ↓
[INSERT INTO activity_logs] (Rectangle)
   ↓
[Generate Struk PDF] (Rectangle)
   Isi: Ticket, Plat, Type, Time, Duration, Amount, Method
   ↓
[Print/Download Struk] (Parallelogram)
   ↓
[Konfirmasi Sukses] (Parallelogram)
   ↓
[END] (Oval)
```

### Detail Proses
1. **Minimum Charge**: Parkir < 1 jam dikenakan tarif 1 jam
2. **Rate Query**: Ambil tarif terbaru berdasarkan effective_date
3. **Payment Branching**: Dua flow berbeda untuk Cash dan QRIS
4. **Midtrans Integration**: API call untuk generate QR code
5. **Webhook**: Real-time notification dari Midtrans
6. **Receipt**: Detail lengkap untuk customer record

---

## FLOWCHART 4: CRUD TARIF PARKIR (MASTER DATA)

### Sub-Flowchart A: CREATE (Tambah Tarif)

```
[START] (Oval)
   ↓
[Admin Login & Menu Tarif] (Rectangle)
   ↓
[Klik 'Tambah Tarif'] (Rectangle)
   ↓
[Tampilkan Form] (Parallelogram)
   Input: Cabang, Jenis Kendaraan, Tarif 1 Jam, Tarif Per Jam, Tgl Berlaku
   ↓
[Admin Isi & Submit] (Parallelogram)
   ↓
<Validasi Input?> (Diamond)
   ├── INVALID → [Error] → (kembali)
   ↓ VALID
[Query: Check Duplikasi] (Rectangle)
   ↓
<Tarif Sudah Ada?> (Diamond)
   ├── YES → [Error: Duplikasi] → (kembali)
   ↓ NO
[INSERT INTO parking_rates] (Rectangle)
   ↓
[INSERT INTO activity_logs] (Rectangle)
   ↓
[Notifikasi Sukses] (Parallelogram)
   ↓
[Refresh List] (Rectangle)
   ↓
[END] (Oval)
```

### Sub-Flowchart B: READ (Lihat/Filter)

```
[START] (Oval)
   ↓
[Query: SELECT parking_rates + JOIN] (Rectangle)
   ↓
[Tampilkan dalam Tabel] (Parallelogram)
   Kolom: Cabang, Jenis, Tarif 1, Tarif Per Jam, Tgl, Aksi
   ↓
[Sediakan Filter] (Parallelogram)
   Filter by: Cabang, Jenis, Tanggal
   ↓
<Filter Diterapkan?> (Diamond)
   ├── YES → [Re-query dengan WHERE] → (Tampilkan)
   ↓ NO
[END] (Oval)
```

### Sub-Flowchart C: UPDATE (Edit)

```
[START] (Oval)
   ↓
[Klik 'Edit' pada Row] (Rectangle)
   ↓
[Query: SELECT rate by ID] (Rectangle)
   ↓
[Populate Form] (Parallelogram)
   ↓
[Admin Ubah Data] (Parallelogram)
   ↓
[Submit] (Rectangle)
   ↓
<Validasi?> (Diamond)
   ├── INVALID → [Error] → (kembali)
   ↓ VALID
[UPDATE parking_rates] (Rectangle)
   ↓
[INSERT activity_log] (Rectangle)
   ↓
[Notifikasi Sukses] (Parallelogram)
   ↓
[Refresh] (Rectangle)
   ↓
[END] (Oval)
```

### Sub-Flowchart D: DELETE (Hapus)

```
[START] (Oval)
   ↓
[Klik 'Hapus'] (Rectangle)
   ↓
[Konfirmasi Dialog] (Parallelogram)
   "Yakin hapus?"
   ↓
<Konfirmasi?> (Diamond)
   ├── NO → [END]
   ↓ YES
[Query: Check Transaksi Terkait] (Rectangle)
   ↓
<Ada Transaksi?> (Diamond)
   ├── YES → [Error: Tidak Bisa Hapus] → [END]
   ↓ NO
[DELETE FROM parking_rates] (Rectangle)
   ↓
[INSERT activity_log] (Rectangle)
   ↓
[Notifikasi Sukses] (Parallelogram)
   ↓
[Refresh] (Rectangle)
   ↓
[END] (Oval)
```

---

## FLOWCHART 5: GENERATE LAPORAN STATISTIK

### Deskripsi
Flowchart untuk Owner mengakses dan generate laporan statistik dengan berbagai filter.

### Simbol dan Alur

```
[START] (Oval)
   ↓
[Owner Login] (Rectangle)
   ↓
[Tampilkan Dashboard] (Parallelogram)
   ↓
[Input Filter] (Parallelogram)
   - Tanggal Mulai (default: awal bulan)
   - Tanggal Akhir (default: hari ini)
   - Cabang (optional)
   - Jenis Kendaraan (optional)
   ↓
[Submit Filter] (Rectangle)
   ↓
[Query 1: Total Pendapatan] (Rectangle)
   SELECT SUM(total_amount) WHERE paid
   ↓
[Query 2: Jumlah Kendaraan] (Rectangle)
   SELECT COUNT(*) by date
   ↓
[Query 3: Average Duration] (Rectangle)
   SELECT AVG(duration_hours)
   ↓
[Query 4: Breakdown by Type] (Rectangle)
   GROUP BY vehicle_type
   ↓
[Query 5: Peak Hours] (Rectangle)
   GROUP BY HOUR(entry_time)
   ↓
[Query 6: Okupansi Rate] (Rectangle)
   current_occupancy / capacity
   ↓
[Query 7: Payment Distribution] (Rectangle)
   GROUP BY payment_method
   ↓
[Generate Visualisasi] (Rectangle)
   - Line Chart: Pendapatan per Hari
   - Bar Chart: Kendaraan by Type
   - Pie Chart: Payment Method
   - Heat Map: Peak Hours
   - Gauge: Occupancy Rate
   ↓
[Tampilkan Dashboard] (Parallelogram)
   ↓
<Export Report?> (Diamond)
   ├── YES → [Generate PDF/Excel] → [Download]
   ↓ NO
[END] (Oval)
```

### Detail Queries
1. **Total Revenue**: Aggregasi SUM dengan filter tanggal
2. **Vehicle Count**: COUNT dengan GROUP BY date
3. **Average Duration**: AVG untuk insight durasi parkir
4. **Breakdown by Type**: Analisis per jenis kendaraan
5. **Peak Hours**: Identifikasi jam sibuk untuk staffing
6. **Occupancy**: Real-time capacity usage
7. **Payment Method**: Preferensi customer (Cash vs QRIS)

---

## PANDUAN DRAWING DI DRAW.IO

### Langkah-langkah:

1. **Buka Draw.io**
   - Kunjungi https://app.diagrams.net/
   - Pilih "Create New Diagram"
   - Pilih "Blank Diagram"

2. **Sidebar Shapes**
   - Basic Shapes → Untuk Oval, Rectangle, Diamond
   - Flowchart → Untuk simbol flowchart standar
   - Arrows & Connectors → Untuk panah alur

3. **Best Practices**
   - Gunakan warna konsisten:
     * START/END: Hijau
     * Process: Biru
     * Decision: Kuning
     * I/O: Abu-abu
     * Error: Merah
   - Alignment: Gunakan Align tools (Ctrl+Shift+H/V)
   - Spacing: Jaga jarak konsisten antar shape
   - Label: Font Arial 10-12pt

4. **Export**
   - File → Export as → PNG (untuk presentasi)
   - File → Export as → PDF (untuk dokumentasi)
   - File → Download → .drawio (untuk edit kemudian)

---

## CHECKLIST FLOWCHART

### Untuk Setiap Flowchart, Pastikan:

- ✅ Ada START dan END yang jelas
- ✅ Semua decision diamond punya 2+ output (YES/NO)
- ✅ Tidak ada dead-end (kecuali END)
- ✅ Label jelas di setiap shape
- ✅ Arrow menunjukkan arah flow dengan jelas
- ✅ Warna konsisten dan readable
- ✅ Layout rapi dan mudah diikuti
- ✅ Kompleksitas cukup (tidak terlalu simple/complex)

---

## TIPS PRESENTASI FLOWCHART

### Saat Mempresentasikan:

1. **Mulai dengan Context**
   - Jelaskan tujuan proses
   - Siapa yang terlibat (actor)
   - Kapan proses ini terjadi

2. **Walk Through**
   - Ikuti alur dari START
   - Jelaskan setiap decision point
   - Highlight happy path vs error handling

3. **Highlight Key Points**
   - Security measures (password hashing, validation)
   - Business logic (minimum charge, rate calculation)
   - Integration points (Midtrans API)

4. **Q&A Preparation**
   - Siap jelaskan edge cases
   - Backup plan untuk error scenarios
   - Scalability considerations

---

## CONTOH SKENARIO UNTUK TESTING

### Login Flowchart
- ✅ Username/password benar → Success
- ❌ Username salah → Error message
- ❌ Password salah → Error message
- ❌ User non-aktif → Blocked
- ✅ Admin login → Admin dashboard
- ✅ Petugas login → Transaction page

### Transaction In Flowchart
- ✅ Parkir kosong → Admit vehicle
- ❌ Parkir penuh → Reject
- ✅ Kendaraan baru → Auto-register
- ✅ Kendaraan existing → Use existing data

### Transaction Out Flowchart
- ✅ Tiket valid → Calculate fee
- ❌ Tiket invalid → Error
- ✅ Parkir 30 menit → Charge 1 jam
- ✅ Cash payment → Instant paid
- ✅ QRIS payment → Wait confirmation
- ❌ QRIS timeout → Transaction cancelled

---

## FILE EXPORT RECOMMENDATIONS

Untuk submission ujian:

1. **PNG Files** (untuk insert ke dokumen Word/PowerPoint)
   - Resolution: 300 DPI
   - Background: White
   - Size: A4 landscape

2. **PDF Files** (untuk dokumentasi standalone)
   - Include: All 5 flowcharts
   - Layout: One flowchart per page
   - Metadata: Title, author, date

3. **Source Files** (.drawio)
   - Keep for future edits
   - Include in submission folder

---

## AKHIR DOKUMENTASI

Semua flowchart harus mencerminkan:
- ✅ Logical flow yang benar
- ✅ Error handling yang comprehensive
- ✅ Best practices (validation, logging, security)
- ✅ Real-world implementation considerations

**Good luck dengan pembuatan flowchart! 🎯**
