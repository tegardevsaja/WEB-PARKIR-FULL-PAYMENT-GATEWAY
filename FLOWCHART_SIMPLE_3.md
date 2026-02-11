# 🔄 3 FLOWCHART DARI SOAL (Simple & Clear)

## Flowchart Sederhana Sesuai Soal

---

## FLOWCHART A: PROSES LOGIN

```mermaid
flowchart TD
    Start([Mulai]) --> Input[User input username & password]
    Input --> Validate{Data valid?}
    Validate -->|Tidak| Error1[Tampilkan pesan error]
    Error1 --> Input
    Validate -->|Ya| CheckDB[Cek data di database]
    CheckDB --> UserExist{User ditemukan?}
    UserExist -->|Tidak| Error2[Tampilkan: Username tidak ditemukan]
    Error2 --> Input
    UserExist -->|Ya| CheckPass{Password cocok?}
    CheckPass -->|Tidak| Error3[Tampilkan: Password salah]
    Error3 --> Input
    CheckPass -->|Ya| CheckActive{Akun aktif?}
    CheckActive -->|Tidak| Error4[Tampilkan: Akun non-aktif]
    Error4 --> End([Selesai])
    CheckActive -->|Ya| CreateSession[Buat session login]
    CreateSession --> SaveLog[Simpan log aktivitas]
    SaveLog --> CheckRole{Cek role user}
    CheckRole -->|Admin| Dashboard1[Tampilkan dashboard admin]
    CheckRole -->|Petugas| Dashboard2[Tampilkan halaman transaksi]
    CheckRole -->|Owner| Dashboard3[Tampilkan halaman statistik]
    Dashboard1 --> End
    Dashboard2 --> End
    Dashboard3 --> End
    
    style Start fill:#90EE90
    style End fill:#FFB6C1
    style Error1 fill:#FF6B6B
    style Error2 fill:#FF6B6B
    style Error3 fill:#FF6B6B
    style Error4 fill:#FF6B6B
    style Validate fill:#FFD700
    style UserExist fill:#FFD700
    style CheckPass fill:#FFD700
    style CheckActive fill:#FFD700
    style CheckRole fill:#FFD700
```

---

## FLOWCHART B: PROSES TRANSAKSI (Kendaraan Masuk)

```mermaid
flowchart TD
    Start([Mulai]) --> ShowForm[Tampilkan form input kendaraan]
    ShowForm --> Input[Petugas input plat nomor & jenis kendaraan]
    Input --> Validate{Data valid?}
    Validate -->|Tidak| Error1[Tampilkan pesan error]
    Error1 --> ShowForm
    Validate -->|Ya| CheckSlot[Cek ketersediaan slot parkir]
    CheckSlot --> SlotAvail{Slot tersedia?}
    SlotAvail -->|Tidak| Error2[Tampilkan: Parkir penuh]
    Error2 --> End([Selesai])
    SlotAvail -->|Ya| CheckVehicle[Cek kendaraan di database]
    CheckVehicle --> VehicleExist{Kendaraan sudah terdaftar?}
    VehicleExist -->|Tidak| RegisterVehicle[Daftarkan kendaraan baru]
    VehicleExist -->|Ya| UseExisting[Gunakan data kendaraan existing]
    RegisterVehicle --> GenTicket[Generate nomor tiket]
    UseExisting --> GenTicket
    GenTicket --> SaveTransaction[Simpan data transaksi]
    SaveTransaction --> UpdateSlot[Update jumlah kendaraan parkir]
    UpdateSlot --> SaveLog[Simpan log aktivitas]
    SaveLog --> PrintTicket[Cetak tiket parkir]
    PrintTicket --> Success[Tampilkan pesan berhasil]
    Success --> End
    
    style Start fill:#90EE90
    style End fill:#FFB6C1
    style Error1 fill:#FF6B6B
    style Error2 fill:#FF6B6B
    style Validate fill:#FFD700
    style SlotAvail fill:#FFD700
    style VehicleExist fill:#FFD700
    style PrintTicket fill:#87CEEB
    style Success fill:#87CEEB
```

---

## FLOWCHART C: CETAK STRUK (Kendaraan Keluar & Pembayaran)

```mermaid
flowchart TD
    Start([Mulai]) --> Input[Petugas input nomor tiket]
    Input --> SearchTicket[Cari data tiket di database]
    SearchTicket --> TicketValid{Tiket valid & aktif?}
    TicketValid -->|Tidak| Error1[Tampilkan: Tiket tidak valid]
    Error1 --> End([Selesai])
    TicketValid -->|Ya| RecordExit[Catat waktu keluar]
    RecordExit --> CalcDuration[Hitung durasi parkir]
    CalcDuration --> CheckDuration{Durasi < 1 jam?}
    CheckDuration -->|Ya| SetMinDuration[Set durasi = 1 jam]
    CheckDuration -->|Tidak| UseDuration[Gunakan durasi sebenarnya]
    SetMinDuration --> GetRate[Ambil tarif parkir]
    UseDuration --> GetRate
    GetRate --> CalcTotal[Hitung total biaya]
    CalcTotal --> ShowInfo[Tampilkan informasi tiket:<br/>- Plat Nomor<br/>- Jenis Kendaraan<br/>- Waktu Masuk<br/>- Waktu Keluar<br/>- Durasi Parkir<br/>- Total Biaya]
    ShowInfo --> ShowPayment[Tampilkan pilihan pembayaran:<br/>CASH atau QRIS]
    ShowPayment --> ChooseMethod{Pilih metode pembayaran}
    
    ChooseMethod -->|CASH| ProcessCash[Proses pembayaran tunai]
    ProcessCash --> MarkPaid[Tandai pembayaran lunas]
    
    ChooseMethod -->|QRIS| GenQR[Generate QR Code via Midtrans]
    GenQR --> CheckQR{QR berhasil dibuat?}
    CheckQR -->|Tidak| Error2[Tampilkan: Gagal membuat QR]
    Error2 --> End
    CheckQR -->|Ya| ShowQR[Tampilkan QR Code ke customer]
    ShowQR --> WaitPayment[Tunggu customer scan & bayar]
    WaitPayment --> PaymentSuccess{Pembayaran berhasil?}
    PaymentSuccess -->|Tidak| Error3[Tampilkan: Pembayaran gagal/timeout]
    Error3 --> End
    PaymentSuccess -->|Ya| MarkPaid
    
    MarkPaid --> PrintReceipt[Cetak struk pembayaran]
    PrintReceipt --> UpdateSlot[Kurangi jumlah kendaraan parkir]
    UpdateSlot --> SaveLog[Simpan log aktivitas]
    SaveLog --> Success[Tampilkan pesan: Transaksi berhasil]
    Success --> End
    
    style Start fill:#90EE90
    style End fill:#FFB6C1
    style Error1 fill:#FF6B6B
    style Error2 fill:#FF6B6B
    style Error3 fill:#FF6B6B
    style TicketValid fill:#FFD700
    style CheckDuration fill:#FFD700
    style ChooseMethod fill:#FFD700
    style CheckQR fill:#FFD700
    style PaymentSuccess fill:#FFD700
    style ShowInfo fill:#87CEEB
    style PrintReceipt fill:#87CEEB
    style Success fill:#87CEEB
```

---

## FLOWCHART D: CRUD TARIF PARKIR - LENGKAP (Master Data Tambahan 1)

```mermaid
flowchart TD
    Start([Mulai]) --> AdminLogin[Admin Login]
    AdminLogin --> MenuTarif[Menu Manajemen Tarif Parkir]
    MenuTarif --> ChooseAction{Pilih Aksi}
    
    %% CREATE FLOW
    ChooseAction -->|TAMBAH| ClickAdd[Klik Tambah Tarif]
    ClickAdd --> ShowFormCreate[Tampilkan Form Input]
    ShowFormCreate --> InputData[Input: Cabang, Jenis Kendaraan,<br/>Tarif Jam 1, Tarif Per Jam, Tanggal Berlaku]
    InputData --> ValidateCreate{Data valid?}
    ValidateCreate -->|Tidak| ErrorCreate[Tampilkan pesan error]
    ErrorCreate --> ShowFormCreate
    ValidateCreate -->|Ya| CheckRate{Tarif > 0?}
    CheckRate -->|Tidak| ErrorRate[Tampilkan: Tarif harus lebih dari 0]
    ErrorRate --> ShowFormCreate
    CheckRate -->|Ya| CheckDup[Cek tarif sudah ada?]
    CheckDup --> IsDup{Tarif sudah ada?}
    IsDup -->|Ya| ErrorDup[Tampilkan: Tarif sudah ada untuk<br/>cabang & jenis ini]
    ErrorDup --> ShowFormCreate
    IsDup -->|Tidak| InsertRate[Simpan tarif baru]
    InsertRate --> LogCreate[Simpan log aktivitas]
    LogCreate --> SuccessCreate[Tampilkan: Tarif berhasil ditambahkan]
    SuccessCreate --> RefreshList
    
    %% READ FLOW
    ChooseAction -->|LIHAT| QueryRates[Ambil semua data tarif]
    QueryRates --> ShowTable[Tampilkan tabel tarif]
    ShowTable --> FilterOpt{Gunakan filter?}
    FilterOpt -->|Ya| ApplyFilter[Filter: Cabang, Jenis Kendaraan]
    ApplyFilter --> QueryRates
    FilterOpt -->|Tidak| ShowTable
    
    %% UPDATE FLOW
    ChooseAction -->|EDIT| ClickEdit[Klik Edit Tarif]
    ClickEdit --> QueryRate[Ambil data tarif]
    QueryRate --> RateFound{Tarif ditemukan?}
    RateFound -->|Tidak| ErrorNotFound[Tampilkan: Tarif tidak ditemukan]
    ErrorNotFound --> End
    RateFound -->|Ya| PopulateForm[Tampilkan form dengan data existing]
    PopulateForm --> EditData[Admin ubah data]
    EditData --> ValidateEdit{Data valid?}
    ValidateEdit -->|Tidak| ErrorEdit[Tampilkan pesan error]
    ErrorEdit --> PopulateForm
    ValidateEdit -->|Ya| CheckNewRate{Tarif baru > 0?}
    CheckNewRate -->|Tidak| ErrorRateEdit[Tampilkan: Tarif harus > 0]
    ErrorRateEdit --> PopulateForm
    CheckNewRate -->|Ya| UpdateRate[Update data tarif]
    UpdateRate --> LogUpdate[Simpan log aktivitas]
    LogUpdate --> SuccessUpdate[Tampilkan: Tarif berhasil diupdate]
    SuccessUpdate --> RefreshList
    
    %% DELETE FLOW
    ChooseAction -->|HAPUS| ClickDelete[Klik Hapus Tarif]
    ClickDelete --> ConfirmDelete[Konfirmasi: Yakin hapus tarif ini?]
    ConfirmDelete --> UserConfirm{Konfirmasi?}
    UserConfirm -->|Tidak| End
    UserConfirm -->|Ya| CheckUsage[Cek apakah tarif sedang digunakan]
    CheckUsage --> InUse{Tarif digunakan transaksi?}
    InUse -->|Ya| ErrorUsage[Tampilkan: Tidak bisa hapus,<br/>tarif sedang digunakan]
    ErrorUsage --> End
    InUse -->|Tidak| DeleteRate[Hapus tarif]
    DeleteRate --> LogDelete[Simpan log aktivitas]
    LogDelete --> SuccessDelete[Tampilkan: Tarif berhasil dihapus]
    SuccessDelete --> RefreshList
    
    %% COMMON END
    RefreshList[Refresh daftar tarif] --> MenuTarif
    ShowTable --> End([Selesai])
    
    style Start fill:#90EE90
    style End fill:#FFB6C1
    style ErrorCreate fill:#FF6B6B
    style ErrorRate fill:#FF6B6B
    style ErrorDup fill:#FF6B6B
    style ErrorNotFound fill:#FF6B6B
    style ErrorEdit fill:#FF6B6B
    style ErrorRateEdit fill:#FF6B6B
    style ErrorUsage fill:#FF6B6B
    style ChooseAction fill:#FFD700
    style ValidateCreate fill:#FFD700
    style CheckRate fill:#FFD700
    style IsDup fill:#FFD700
    style FilterOpt fill:#FFD700
    style RateFound fill:#FFD700
    style ValidateEdit fill:#FFD700
    style CheckNewRate fill:#FFD700
    style UserConfirm fill:#FFD700
    style InUse fill:#FFD700
    style SuccessCreate fill:#87CEEB
    style SuccessUpdate fill:#87CEEB
    style SuccessDelete fill:#87CEEB
    style ShowTable fill:#87CEEB
```

---

## FLOWCHART E: CRUD AREA PARKIR - LENGKAP (Master Data Tambahan 2)

```mermaid
flowchart TD
    Start([Mulai]) --> AdminLogin[Admin Login]
    AdminLogin --> MenuArea[Menu Manajemen Area Parkir]
    MenuArea --> ChooseAction{Pilih Aksi}
    
    %% CREATE FLOW
    ChooseAction -->|TAMBAH| ClickAdd[Klik Tambah Area]
    ClickAdd --> ShowFormCreate[Tampilkan Form Input]
    ShowFormCreate --> InputData[Input: Cabang, Nama Area, Kapasitas]
    InputData --> ValidateCreate{Data valid?}
    ValidateCreate -->|Tidak| ErrorCreate[Tampilkan pesan error]
    ErrorCreate --> ShowFormCreate
    ValidateCreate -->|Ya| CheckCapacity{Kapasitas > 0?}
    CheckCapacity -->|Tidak| ErrorCap[Tampilkan: Kapasitas harus > 0]
    ErrorCap --> ShowFormCreate
    CheckCapacity -->|Ya| CheckDup[Cek nama area di cabang]
    CheckDup --> IsDup{Area sudah ada?}
    IsDup -->|Ya| ErrorDup[Tampilkan: Nama area sudah digunakan]
    ErrorDup --> ShowFormCreate
    IsDup -->|Tidak| InsertArea[Simpan area baru]
    InsertArea --> LogCreate[Simpan log aktivitas]
    LogCreate --> SuccessCreate[Tampilkan: Area berhasil ditambahkan]
    SuccessCreate --> RefreshList
    
    %% READ FLOW
    ChooseAction -->|LIHAT| QueryAreas[Ambil semua data area]
    QueryAreas --> CalcStats[Hitung: Slot tersedia, Okupansi %]
    CalcStats --> ShowTable[Tampilkan tabel area dengan data real-time]
    ShowTable --> FilterOpt{Gunakan filter?}
    FilterOpt -->|Ya| ApplyFilter[Filter: Cabang]
    ApplyFilter --> QueryAreas
    FilterOpt -->|Tidak| ShowTable
    
    %% UPDATE FLOW
    ChooseAction -->|EDIT| ClickEdit[Klik Edit Area]
    ClickEdit --> QueryArea[Ambil data area]
    QueryArea --> AreaFound{Area ditemukan?}
    AreaFound -->|Tidak| ErrorNotFound[Tampilkan: Area tidak ditemukan]
    ErrorNotFound --> End
    AreaFound -->|Ya| PopulateForm[Tampilkan form dengan data existing]
    PopulateForm --> EditData[Admin ubah data]
    EditData --> ValidateEdit{Data valid?}
    ValidateEdit -->|Tidak| ErrorEdit[Tampilkan pesan error]
    ErrorEdit --> PopulateForm
    ValidateEdit -->|Ya| CheckNewCap{Kapasitas baru >= Okupansi saat ini?}
    CheckNewCap -->|Tidak| ErrorCapEdit[Tampilkan: Kapasitas tidak boleh<br/>kurang dari okupansi]
    ErrorCapEdit --> PopulateForm
    CheckNewCap -->|Ya| UpdateArea[Update data area]
    UpdateArea --> LogUpdate[Simpan log aktivitas]
    LogUpdate --> SuccessUpdate[Tampilkan: Area berhasil diupdate]
    SuccessUpdate --> RefreshList
    
    %% DELETE FLOW
    ChooseAction -->|HAPUS| ClickDelete[Klik Hapus Area]
    ClickDelete --> ConfirmDelete[Konfirmasi: Yakin hapus area ini?]
    ConfirmDelete --> UserConfirm{Konfirmasi?}
    UserConfirm -->|Tidak| End
    UserConfirm -->|Ya| CheckOcc[Cek okupansi area]
    CheckOcc --> HasVehicles{Ada kendaraan di area?}
    HasVehicles -->|Ya| ErrorOcc[Tampilkan: Tidak bisa hapus,<br/>masih ada kendaraan]
    ErrorOcc --> End
    HasVehicles -->|Tidak| CheckHistory[Cek history transaksi]
    CheckHistory --> HasHistory{Ada history transaksi?}
    HasHistory -->|Ya| SoftDelete[Non-aktifkan area saja]
    HasHistory -->|Tidak| HardDelete[Hapus area permanent]
    SoftDelete --> LogDelete[Simpan log aktivitas]
    HardDelete --> LogDelete
    LogDelete --> SuccessDelete[Tampilkan: Area berhasil dihapus]
    SuccessDelete --> RefreshList
    
    %% COMMON END
    RefreshList[Refresh daftar area] --> MenuArea
    ShowTable --> End([Selesai])
    
    style Start fill:#90EE90
    style End fill:#FFB6C1
    style ErrorCreate fill:#FF6B6B
    style ErrorCap fill:#FF6B6B
    style ErrorDup fill:#FF6B6B
    style ErrorNotFound fill:#FF6B6B
    style ErrorEdit fill:#FF6B6B
    style ErrorCapEdit fill:#FF6B6B
    style ErrorOcc fill:#FF6B6B
    style ChooseAction fill:#FFD700
    style ValidateCreate fill:#FFD700
    style CheckCapacity fill:#FFD700
    style IsDup fill:#FFD700
    style FilterOpt fill:#FFD700
    style AreaFound fill:#FFD700
    style ValidateEdit fill:#FFD700
    style CheckNewCap fill:#FFD700
    style UserConfirm fill:#FFD700
    style HasVehicles fill:#FFD700
    style HasHistory fill:#FFD700
    style SuccessCreate fill:#87CEEB
    style SuccessUpdate fill:#87CEEB
    style SuccessDelete fill:#87CEEB
    style ShowTable fill:#87CEEB
```

---

## PENJELASAN SINGKAT

### Flowchart A (Login):
1. Input username & password
2. Validasi data
3. Cek di database
4. Verifikasi password
5. Cek status aktif
6. Buat session
7. Redirect sesuai role

### Flowchart B (Transaksi Masuk):
1. Input plat nomor & jenis kendaraan
2. Validasi data
3. Cek slot tersedia
4. Cek/daftar kendaraan
5. Generate tiket
6. Simpan transaksi
7. Update slot
8. Cetak tiket

### Flowchart C (Cetak Struk):
1. Input nomor tiket
2. Validasi tiket
3. Catat waktu keluar
4. Hitung durasi & biaya
5. Tampilkan informasi tiket
6. Pilih metode pembayaran (Cash/QRIS)
7. Proses pembayaran
8. Cetak struk
9. Update slot

### Flowchart D (CRUD Tarif Parkir):
1. Admin login & pilih menu tarif
2. Pilih aksi: Tambah/Lihat/Edit/Hapus
3. Validasi data & business rules
4. Proses sesuai aksi
5. Simpan log aktivitas
6. Refresh daftar

### Flowchart E (CRUD Area Parkir):
1. Admin login & pilih menu area
2. Pilih aksi: Tambah/Lihat/Edit/Hapus
3. Validasi kapasitas & okupansi
4. Proses sesuai aksi
5. Simpan log aktivitas
6. Refresh daftar

---

## RINGKASAN 5 FLOWCHART

### 3 Flowchart dari Soal:
- ✅ **A. Login** - Autentikasi user dengan role-based access
- ✅ **B. Transaksi Masuk** - Proses kendaraan masuk parkir
- ✅ **C. Cetak Struk** - Proses keluar, pembayaran, dan cetak struk

### 2 Flowchart Master Tambahan:
- ✅ **D. CRUD Tarif Parkir** - Manajemen tarif per cabang & jenis kendaraan
- ✅ **E. CRUD Area Parkir** - Manajemen area parkir dengan monitoring real-time

---

## PERBEDAAN DENGAN VERSI SEBELUMNYA

### Lebih Simple:
- ✅ Bahasa lebih sederhana
- ✅ Fokus ke proses utama
- ✅ Tidak terlalu detail teknis
- ✅ Mudah dipahami

### Tetap Lengkap:
- ✅ Semua decision point ada
- ✅ Error handling jelas
- ✅ Happy path dan error path terpisah
- ✅ Sesuai dengan business logic
- ✅ CRUD operations digabung dalam 1 flowchart

---

## TIPS PRESENTASI

### Script Simple:
```
"Pak/Bu, ini 5 flowchart yang diminta:

3 dari soal:
A. Login - User masuk ke sistem dengan role
B. Transaksi - Kendaraan masuk parkir
C. Cetak Struk - Kendaraan keluar dan bayar (Cash/QRIS)

2 master tambahan:
D. CRUD Tarif Parkir - Manajemen tarif per cabang
E. CRUD Area Parkir - Manajemen area dengan monitoring

Semua flowchart punya validasi dan error handling 
yang jelas, tapi saya buat simple agar mudah dipahami."
```

---

**Good luck! 🎓**
