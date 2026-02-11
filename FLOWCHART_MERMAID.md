# 🔄 FLOWCHART - MERMAID FORMAT

## 5 Flowchart Utama Aplikasi Parkir

---

## FLOWCHART 1: PROSES LOGIN

```mermaid
flowchart TD
    Start([START]) --> ShowForm[Tampilkan Form Login]
    ShowForm --> InputCred[User Input Username & Password]
    InputCred --> CheckEmpty{Username & Password Kosong?}
    CheckEmpty -->|YES| ErrorEmpty[Error: Field Required]
    ErrorEmpty --> ShowForm
    CheckEmpty -->|NO| QueryDB[Query Database: SELECT FROM users]
    QueryDB --> UserFound{User Ditemukan?}
    UserFound -->|NO| ErrorUser[Error: Username Tidak Ditemukan]
    ErrorUser --> ShowForm
    UserFound -->|YES| VerifyPass[Verify Password dengan bcrypt]
    VerifyPass --> PassMatch{Password Cocok?}
    PassMatch -->|NO| ErrorPass[Error: Password Salah]
    ErrorPass --> ShowForm
    PassMatch -->|YES| CheckActive{is_active = TRUE?}
    CheckActive -->|NO| ErrorActive[Error: Akun Non-Aktif]
    ErrorActive --> End([END])
    CheckActive -->|YES| GenToken[Generate JWT Token]
    GenToken --> SaveSession[Simpan Token ke Session]
    SaveSession --> LogActivity[INSERT INTO activity_logs]
    LogActivity --> CheckRole{Cek Role}
    CheckRole -->|admin| RedirectAdmin[Redirect /admin/dashboard]
    CheckRole -->|petugas| RedirectPetugas[Redirect /petugas/transaction]
    CheckRole -->|owner| RedirectOwner[Redirect /owner/statistics]
    RedirectAdmin --> End
    RedirectPetugas --> End
    RedirectOwner --> End
    
    style Start fill:#90EE90
    style End fill:#FFB6C1
    style ErrorEmpty fill:#FF6B6B
    style ErrorUser fill:#FF6B6B
    style ErrorPass fill:#FF6B6B
    style ErrorActive fill:#FF6B6B
    style CheckEmpty fill:#FFD700
    style UserFound fill:#FFD700
    style PassMatch fill:#FFD700
    style CheckActive fill:#FFD700
    style CheckRole fill:#FFD700
```

---

## FLOWCHART 2: PROSES TRANSAKSI (KENDARAAN MASUK)

```mermaid
flowchart TD
    Start([START]) --> PetugasLogin[Petugas Login]
    PetugasLogin --> ShowForm[Tampilkan Form Input Kendaraan]
    ShowForm --> InputData[Input: Plat Nomor, Jenis Kendaraan]
    InputData --> Validate{Validasi Input?}
    Validate -->|INVALID| ErrorMsg[Error Message]
    ErrorMsg --> ShowForm
    Validate -->|VALID| CheckSlot[Query: SELECT parking_areas]
    CheckSlot --> SlotAvail{Ada Slot Kosong?}
    SlotAvail -->|NO| ErrorFull[Error: Parkir Penuh]
    ErrorFull --> End([END])
    SlotAvail -->|YES| CheckVehicle[Query: Cek Kendaraan Terdaftar]
    CheckVehicle --> VehicleExist{Kendaraan Sudah Ada?}
    VehicleExist -->|NO| InsertVehicle[INSERT INTO vehicles]
    VehicleExist -->|YES| UseExisting[Gunakan vehicle_id existing]
    InsertVehicle --> GenTicket[Generate Ticket Number]
    UseExisting --> GenTicket
    GenTicket --> InsertTrans[INSERT INTO transactions]
    InsertTrans --> UpdateOcc[UPDATE current_occupancy + 1]
    UpdateOcc --> LogAct[INSERT INTO activity_logs]
    LogAct --> PrintTicket[Cetak Tiket Masuk]
    PrintTicket --> End
    
    style Start fill:#90EE90
    style End fill:#FFB6C1
    style ErrorMsg fill:#FF6B6B
    style ErrorFull fill:#FF6B6B
    style Validate fill:#FFD700
    style SlotAvail fill:#FFD700
    style VehicleExist fill:#FFD700
    style PrintTicket fill:#87CEEB
```

---

## FLOWCHART 3: CETAK STRUK PARKIR (KENDARAAN KELUAR)

```mermaid
flowchart TD
    Start([START]) --> InputTicket[Input Ticket Number]
    InputTicket --> QueryTrans[Query Transaction Data + JOIN]
    QueryTrans --> ValidTicket{Tiket Valid & Pending?}
    ValidTicket -->|NO| ErrorTicket[Error: Tiket Tidak Valid]
    ErrorTicket --> End([END])
    ValidTicket -->|YES| SetExit[Catat exit_time = NOW]
    SetExit --> CalcDuration[Hitung duration_hours]
    CalcDuration --> CheckMin{duration < 1?}
    CheckMin -->|YES| SetMin[Set duration = 1]
    CheckMin -->|NO| QueryRate[Query Tarif Parkir]
    SetMin --> QueryRate
    QueryRate --> CalcAmount[Kalkulasi Total Amount]
    CalcAmount --> UpdateTrans[UPDATE transactions]
    UpdateTrans --> ShowPayment[Tampilkan Pilihan: CASH / QRIS]
    ShowPayment --> ChooseMethod{Pilih Metode}
    
    ChooseMethod -->|CASH| ProcessCash[UPDATE payment_status = paid]
    ProcessCash --> PrintReceipt
    
    ChooseMethod -->|QRIS| GenOrder[Generate order_id]
    GenOrder --> CallMidtrans[Call Midtrans API]
    CallMidtrans --> APISuccess{API Success?}
    APISuccess -->|NO| ErrorAPI[Error: Gagal Generate QR]
    ErrorAPI --> End
    APISuccess -->|YES| ReceiveQR[Terima QR Code]
    ReceiveQR --> UpdateOrder[UPDATE midtrans_order_id]
    UpdateOrder --> ShowQR[Tampilkan QR Code]
    ShowQR --> WaitPayment[Polling/Webhook Midtrans]
    WaitPayment --> PaymentSuccess{Pembayaran Berhasil?}
    PaymentSuccess -->|NO| ErrorPayment[Error: Pembayaran Gagal]
    ErrorPayment --> End
    PaymentSuccess -->|YES| UpdatePaid[UPDATE payment_status = paid]
    UpdatePaid --> PrintReceipt
    
    PrintReceipt[Cetak Struk] --> DecOcc[UPDATE current_occupancy - 1]
    DecOcc --> LogExit[INSERT INTO activity_logs]
    LogExit --> ShowSuccess[Konfirmasi Sukses]
    ShowSuccess --> End
    
    style Start fill:#90EE90
    style End fill:#FFB6C1
    style ErrorTicket fill:#FF6B6B
    style ErrorAPI fill:#FF6B6B
    style ErrorPayment fill:#FF6B6B
    style ValidTicket fill:#FFD700
    style CheckMin fill:#FFD700
    style ChooseMethod fill:#FFD700
    style APISuccess fill:#FFD700
    style PaymentSuccess fill:#FFD700
    style PrintReceipt fill:#87CEEB
```

---

## FLOWCHART 4: CRUD TARIF PARKIR

### 4A. CREATE (Tambah Tarif)

```mermaid
flowchart TD
    Start([START]) --> AdminLogin[Admin Login & Menu Tarif]
    AdminLogin --> ClickAdd[Klik Tambah Tarif]
    ClickAdd --> ShowForm[Tampilkan Form Input]
    ShowForm --> FillForm[Admin Isi Form & Submit]
    FillForm --> ValidateInput{Validasi Input?}
    ValidateInput -->|INVALID| ErrorInput[Error Message]
    ErrorInput --> ShowForm
    ValidateInput -->|VALID| CheckDup[Query: Check Duplikasi]
    CheckDup --> IsDup{Tarif Sudah Ada?}
    IsDup -->|YES| ErrorDup[Error: Duplikasi]
    ErrorDup --> ShowForm
    IsDup -->|NO| InsertRate[INSERT INTO parking_rates]
    InsertRate --> LogCreate[INSERT INTO activity_logs]
    LogCreate --> ShowSuccess[Notifikasi Sukses]
    ShowSuccess --> RefreshList[Refresh List]
    RefreshList --> End([END])
    
    style Start fill:#90EE90
    style End fill:#FFB6C1
    style ErrorInput fill:#FF6B6B
    style ErrorDup fill:#FF6B6B
    style ValidateInput fill:#FFD700
    style IsDup fill:#FFD700
    style ShowSuccess fill:#87CEEB
```

### 4B. READ (Lihat/Filter)

```mermaid
flowchart TD
    Start([START]) --> QueryRates[Query: SELECT parking_rates + JOIN]
    QueryRates --> ShowTable[Tampilkan dalam Tabel]
    ShowTable --> ProvideFilter[Sediakan Filter]
    ProvideFilter --> FilterApplied{Filter Diterapkan?}
    FilterApplied -->|YES| ReQuery[Re-query dengan WHERE]
    ReQuery --> ShowTable
    FilterApplied -->|NO| End([END])
    
    style Start fill:#90EE90
    style End fill:#FFB6C1
    style FilterApplied fill:#FFD700
```

### 4C. UPDATE (Edit)

```mermaid
flowchart TD
    Start([START]) --> ClickEdit[Klik Edit pada Row]
    ClickEdit --> QueryRate[Query: SELECT rate by ID]
    QueryRate --> PopulateForm[Populate Form]
    PopulateForm --> AdminEdit[Admin Ubah Data]
    AdminEdit --> Submit[Submit]
    Submit --> ValidateEdit{Validasi?}
    ValidateEdit -->|INVALID| ErrorEdit[Error]
    ErrorEdit --> PopulateForm
    ValidateEdit -->|VALID| UpdateRate[UPDATE parking_rates]
    UpdateRate --> LogUpdate[INSERT activity_log]
    LogUpdate --> ShowSuccess[Notifikasi Sukses]
    ShowSuccess --> Refresh[Refresh]
    Refresh --> End([END])
    
    style Start fill:#90EE90
    style End fill:#FFB6C1
    style ErrorEdit fill:#FF6B6B
    style ValidateEdit fill:#FFD700
    style ShowSuccess fill:#87CEEB
```

### 4D. DELETE (Hapus)

```mermaid
flowchart TD
    Start([START]) --> ClickDelete[Klik Hapus]
    ClickDelete --> ShowConfirm[Konfirmasi Dialog: Yakin hapus?]
    ShowConfirm --> UserConfirm{Konfirmasi?}
    UserConfirm -->|NO| End([END])
    UserConfirm -->|YES| CheckUsage[Query: Check Transaksi Terkait]
    CheckUsage --> HasTrans{Ada Transaksi?}
    HasTrans -->|YES| ErrorUsage[Error: Tidak Bisa Hapus]
    ErrorUsage --> End
    HasTrans -->|NO| DeleteRate[DELETE FROM parking_rates]
    DeleteRate --> LogDelete[INSERT activity_log]
    LogDelete --> ShowSuccess[Notifikasi Sukses]
    ShowSuccess --> Refresh[Refresh]
    Refresh --> End
    
    style Start fill:#90EE90
    style End fill:#FFB6C1
    style ErrorUsage fill:#FF6B6B
    style UserConfirm fill:#FFD700
    style HasTrans fill:#FFD700
    style ShowSuccess fill:#87CEEB
```

---

## FLOWCHART 5: GENERATE LAPORAN STATISTIK

```mermaid
flowchart TD
    Start([START]) --> OwnerLogin[Owner Login]
    OwnerLogin --> ShowDash[Tampilkan Dashboard]
    ShowDash --> InputFilter[Input Filter: Date, Branch, Vehicle Type]
    InputFilter --> SubmitFilter[Submit Filter]
    SubmitFilter --> Query1[Query 1: Total Pendapatan]
    Query1 --> Query2[Query 2: Jumlah Kendaraan]
    Query2 --> Query3[Query 3: Average Duration]
    Query3 --> Query4[Query 4: Breakdown by Type]
    Query4 --> Query5[Query 5: Peak Hours]
    Query5 --> Query6[Query 6: Okupansi Rate]
    Query6 --> Query7[Query 7: Payment Distribution]
    Query7 --> GenViz[Generate Visualisasi]
    GenViz --> LineChart[Line Chart: Pendapatan per Hari]
    LineChart --> BarChart[Bar Chart: Kendaraan by Type]
    BarChart --> PieChart[Pie Chart: Payment Method]
    PieChart --> HeatMap[Heat Map: Peak Hours]
    HeatMap --> Gauge[Gauge: Occupancy Rate]
    Gauge --> ShowDashboard[Tampilkan Dashboard]
    ShowDashboard --> ExportQ{Export Report?}
    ExportQ -->|YES| GenExport[Generate PDF/Excel]
    GenExport --> Download[Download]
    Download --> End([END])
    ExportQ -->|NO| End
    
    style Start fill:#90EE90
    style End fill:#FFB6C1
    style ExportQ fill:#FFD700
    style ShowDashboard fill:#87CEEB
    style Download fill:#87CEEB
```

---

## CARA RENDER FLOWCHART

### 1. GitHub/GitLab
Paste code di file .md, akan auto-render

### 2. Mermaid Live Editor
https://mermaid.live/
- Paste code
- Export as PNG/SVG/PDF

### 3. VS Code
Install extension: "Markdown Preview Mermaid Support"
- Open .md file
- Preview (Ctrl+Shift+V)

### 4. Draw.io
Import → Advanced → Mermaid
- Paste code
- Auto-convert to diagram

---

## LEGEND WARNA

```mermaid
flowchart LR
    Start([START/END]) 
    Process[Process/Action]
    Decision{Decision/Condition}
    Error[Error Message]
    Success[Success/Output]
    
    style Start fill:#90EE90
    style Process fill:#E0E0E0
    style Decision fill:#FFD700
    style Error fill:#FF6B6B
    style Success fill:#87CEEB
```

**Keterangan:**
- 🟢 Hijau: START/END
- ⚪ Abu-abu: Process/Action
- 🟡 Kuning: Decision/Condition
- 🔴 Merah: Error
- 🔵 Biru: Success/Output

---

## SIMBOL FLOWCHART

| Simbol | Mermaid Code | Keterangan |
|--------|--------------|------------|
| `([text])` | Rounded | START/END |
| `[text]` | Rectangle | Process |
| `{text}` | Diamond | Decision |
| `((text))` | Circle | Connector |
| `>text]` | Flag | Output |
| `[(text)]` | Cylinder | Database |

---

## ARROW TYPES

| Code | Tampilan | Keterangan |
|------|----------|------------|
| `-->` | Solid arrow | Normal flow |
| `-.->` | Dotted arrow | Alternative flow |
| `==>` | Thick arrow | Important flow |
| `--text-->` | Labeled arrow | With label |

---

## TIPS PRESENTASI FLOWCHART

### 1. Opening
```
"Pak/Bu, ini 5 flowchart utama sistem saya 
dalam format Mermaid yang bisa langsung di-render."
```

### 2. Highlight Each Flowchart
```
"Flowchart 1: Login dengan validasi lengkap
Flowchart 2: Entry kendaraan dengan quick mode
Flowchart 3: Exit dengan dual payment (Cash/QRIS)
Flowchart 4: CRUD tarif dengan constraint checking
Flowchart 5: Generate laporan dengan visualisasi"
```

### 3. Explain Decision Points
```
"Setiap decision point (diamond) punya 2+ output:
- YES/NO untuk boolean
- Multiple options untuk pilihan
- Error handling untuk exceptional cases"
```

### 4. Show Error Handling
```
"Setiap flowchart punya comprehensive error handling:
- Validasi input
- Check constraints
- User-friendly error messages
- Graceful error recovery"
```

### 5. Closing
```
"Semua flowchart sudah diimplementasikan 
dan tested di aplikasi saya."
```

---

## CHECKLIST PRESENTASI

- [ ] Render semua 5 flowchart
- [ ] Export as PNG/PDF untuk backup
- [ ] Siap jelaskan setiap decision point
- [ ] Siap jelaskan error handling
- [ ] Siap tunjukkan implementasi di code
- [ ] Siap jawab pertanyaan

---

## EXPORT RECOMMENDATIONS

### Untuk Presentasi:
1. Export as PNG (300 DPI)
2. Background: White
3. Size: A4 landscape

### Untuk Dokumentasi:
1. Export as PDF
2. Include: All 5 flowcharts
3. Layout: One per page

### Untuk Editing:
1. Keep .md file with Mermaid code
2. Easy to update
3. Version control friendly

---

**Good luck dengan presentasi flowchart! 🎓**

**Remember:** Flowchart harus jelas, lengkap, dan mudah diikuti! 💪
