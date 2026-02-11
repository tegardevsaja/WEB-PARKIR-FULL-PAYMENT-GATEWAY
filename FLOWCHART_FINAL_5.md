# 🔄 5 FLOWCHART FINAL - APLIKASI PARKIR

## Sesuai Soal: 3 Flowchart + 2 Tambahan

---

## FLOWCHART 1: PROSES LOGIN (dari soal a)

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

## FLOWCHART 2: PROSES TRANSAKSI (dari soal b)

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

## FLOWCHART 3: CETAK STRUK (dari soal c)

```mermaid
flowchart TD
    Start([START]) --> Input[Petugas input nomor tiket]
    Input --> SearchTicket[Cari data tiket di database]
    SearchTicket --> TicketValid{Tiket valid & aktif?}
    TicketValid -->|Tidak| Error1[Tampilkan: Tiket tidak valid]
    Error1 --> End([END])
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

## FLOWCHART 4: CRUD USER - LENGKAP (tambahan 1)

```mermaid
flowchart TD
    Start([START]) --> AdminLogin[Admin Login]
    AdminLogin --> MenuUser[Menu Manajemen User]
    MenuUser --> ChooseAction{Pilih Aksi}
    
    %% CREATE FLOW
    ChooseAction -->|CREATE| ClickAdd[Klik Tambah User]
    ClickAdd --> ShowFormCreate[Tampilkan Form Input]
    ShowFormCreate --> InputData[Input: Username, Password, Nama, Role, Cabang]
    InputData --> ValidateCreate{Validasi Input?}
    ValidateCreate -->|INVALID| ErrorCreate[Error: Field tidak valid]
    ErrorCreate --> ShowFormCreate
    ValidateCreate -->|VALID| CheckUsername[Query: Cek Username Exist]
    CheckUsername --> UsernameExist{Username Sudah Ada?}
    UsernameExist -->|YES| ErrorDup[Error: Username sudah digunakan]
    ErrorDup --> ShowFormCreate
    UsernameExist -->|NO| ValidatePass{Password >= 8 char?}
    ValidatePass -->|NO| ErrorPass[Error: Password terlalu pendek]
    ErrorPass --> ShowFormCreate
    ValidatePass -->|YES| CheckRole{Role = petugas?}
    CheckRole -->|YES| ValidateBranch{Branch ID diisi?}
    CheckRole -->|NO| HashPassword
    ValidateBranch -->|NO| ErrorBranch[Error: Petugas harus punya cabang]
    ErrorBranch --> ShowFormCreate
    ValidateBranch -->|YES| HashPassword[Hash Password dengan bcrypt]
    HashPassword --> InsertUser[INSERT INTO users]
    InsertUser --> LogCreate[Log: USER_CREATED]
    LogCreate --> SuccessCreate[Success: User dibuat]
    SuccessCreate --> RefreshList
    
    %% READ FLOW
    ChooseAction -->|READ| QueryUsers[Query: SELECT users + JOIN branches]
    QueryUsers --> ShowTable[Tampilkan Tabel User]
    ShowTable --> FilterOpt{Filter?}
    FilterOpt -->|YES| ApplyFilter[Filter: Role, Cabang, Status]
    ApplyFilter --> QueryUsers
    FilterOpt -->|NO| ShowTable
    
    %% UPDATE FLOW
    ChooseAction -->|UPDATE| ClickEdit[Klik Edit User]
    ClickEdit --> QueryUser[Query: SELECT user by ID]
    QueryUser --> UserFound{User Found?}
    UserFound -->|NO| ErrorNotFound[Error: User tidak ditemukan]
    ErrorNotFound --> End
    UserFound -->|YES| PopulateForm[Populate Form]
    PopulateForm --> EditData[Admin Ubah Data]
    EditData --> ValidateEdit{Validasi?}
    ValidateEdit -->|INVALID| ErrorEdit[Error: Input tidak valid]
    ErrorEdit --> PopulateForm
    ValidateEdit -->|VALID| UsernameChanged{Username Berubah?}
    UsernameChanged -->|YES| CheckDupEdit[Cek Username Exist]
    CheckDupEdit --> IsDup{Sudah Dipakai?}
    IsDup -->|YES| ErrorDupEdit[Error: Username sudah ada]
    ErrorDupEdit --> PopulateForm
    IsDup -->|NO| PassChanged
    UsernameChanged -->|NO| PassChanged{Password Berubah?}
    PassChanged -->|YES| HashNewPass[Hash Password Baru]
    PassChanged -->|NO| UpdateUser
    HashNewPass --> UpdateUser[UPDATE users]
    UpdateUser --> LogUpdate[Log: USER_UPDATED]
    LogUpdate --> SuccessUpdate[Success: User diupdate]
    SuccessUpdate --> RefreshList
    
    %% DELETE FLOW
    ChooseAction -->|DELETE| ClickDelete[Klik Hapus User]
    ClickDelete --> ConfirmDelete[Konfirmasi: Yakin hapus?]
    ConfirmDelete --> UserConfirm{Konfirmasi?}
    UserConfirm -->|NO| End
    UserConfirm -->|YES| CheckSelf{Hapus Diri Sendiri?}
    CheckSelf -->|YES| ErrorSelf[Error: Tidak bisa hapus diri sendiri]
    ErrorSelf --> End
    CheckSelf -->|NO| CheckActive{User Sedang Login?}
    CheckActive -->|YES| ErrorActive[Error: User sedang aktif]
    ErrorActive --> End
    CheckActive -->|NO| CheckTrans[Cek Transaksi Terkait]
    CheckTrans --> HasTrans{Ada Transaksi?}
    HasTrans -->|YES| SoftDelete[Soft Delete: is_active = FALSE]
    HasTrans -->|NO| HardDelete[Hard Delete: DELETE FROM users]
    SoftDelete --> LogDelete[Log: USER_DELETED]
    HardDelete --> LogDelete
    LogDelete --> SuccessDelete[Success: User dihapus]
    SuccessDelete --> RefreshList
    
    %% COMMON END
    RefreshList[Refresh List User] --> MenuUser
    ShowTable --> End([END])
    
    style Start fill:#90EE90
    style End fill:#FFB6C1
    style ErrorCreate fill:#FF6B6B
    style ErrorDup fill:#FF6B6B
    style ErrorPass fill:#FF6B6B
    style ErrorBranch fill:#FF6B6B
    style ErrorNotFound fill:#FF6B6B
    style ErrorEdit fill:#FF6B6B
    style ErrorDupEdit fill:#FF6B6B
    style ErrorSelf fill:#FF6B6B
    style ErrorActive fill:#FF6B6B
    style ChooseAction fill:#FFD700
    style ValidateCreate fill:#FFD700
    style UsernameExist fill:#FFD700
    style ValidatePass fill:#FFD700
    style CheckRole fill:#FFD700
    style ValidateBranch fill:#FFD700
    style FilterOpt fill:#FFD700
    style UserFound fill:#FFD700
    style ValidateEdit fill:#FFD700
    style UsernameChanged fill:#FFD700
    style IsDup fill:#FFD700
    style PassChanged fill:#FFD700
    style UserConfirm fill:#FFD700
    style CheckSelf fill:#FFD700
    style CheckActive fill:#FFD700
    style HasTrans fill:#FFD700
    style SuccessCreate fill:#87CEEB
    style SuccessUpdate fill:#87CEEB
    style SuccessDelete fill:#87CEEB
    style ShowTable fill:#87CEEB
```

---

## FLOWCHART 5: CRUD AREA PARKIR - LENGKAP (tambahan 2)

```mermaid
flowchart TD
    Start([START]) --> AdminLogin[Admin Login]
    AdminLogin --> MenuArea[Menu Manajemen Area Parkir]
    MenuArea --> ChooseAction{Pilih Aksi}
    
    %% CREATE FLOW
    ChooseAction -->|CREATE| ClickAdd[Klik Tambah Area]
    ClickAdd --> ShowFormCreate[Tampilkan Form Input]
    ShowFormCreate --> InputData[Input: Cabang, Nama Area, Kapasitas]
    InputData --> ValidateCreate{Validasi Input?}
    ValidateCreate -->|INVALID| ErrorCreate[Error: Field tidak valid]
    ErrorCreate --> ShowFormCreate
    ValidateCreate -->|VALID| CheckCapacity{Kapasitas > 0?}
    CheckCapacity -->|NO| ErrorCap[Error: Kapasitas harus > 0]
    ErrorCap --> ShowFormCreate
    CheckCapacity -->|YES| CheckDup[Query: Cek Nama Area di Cabang]
    CheckDup --> IsDup{Area Sudah Ada?}
    IsDup -->|YES| ErrorDup[Error: Nama area sudah digunakan]
    ErrorDup --> ShowFormCreate
    IsDup -->|NO| InsertArea[INSERT INTO parking_areas]
    InsertArea --> LogCreate[Log: AREA_CREATED]
    LogCreate --> SuccessCreate[Success: Area dibuat]
    SuccessCreate --> RefreshList
    
    %% READ FLOW
    ChooseAction -->|READ| QueryAreas[Query: SELECT areas + JOIN branches]
    QueryAreas --> CalcStats[Hitung: Available Slots, Occupancy %]
    CalcStats --> ShowTable[Tampilkan Tabel dengan Real-time Data]
    ShowTable --> FilterOpt{Filter?}
    FilterOpt -->|YES| ApplyFilter[Filter: By Cabang]
    ApplyFilter --> QueryAreas
    FilterOpt -->|NO| ShowTable
    
    %% UPDATE FLOW
    ChooseAction -->|UPDATE| ClickEdit[Klik Edit Area]
    ClickEdit --> QueryArea[Query: SELECT area by ID]
    QueryArea --> AreaFound{Area Found?}
    AreaFound -->|NO| ErrorNotFound[Error: Area tidak ditemukan]
    ErrorNotFound --> End
    AreaFound -->|YES| PopulateForm[Populate Form]
    PopulateForm --> EditData[Admin Ubah Data]
    EditData --> ValidateEdit{Validasi?}
    ValidateEdit -->|INVALID| ErrorEdit[Error: Input tidak valid]
    ErrorEdit --> PopulateForm
    ValidateEdit -->|VALID| CheckNewCap{Kapasitas Baru >= Okupansi?}
    CheckNewCap -->|NO| ErrorCapEdit[Error: Kapasitas < okupansi]
    ErrorCapEdit --> PopulateForm
    CheckNewCap -->|YES| NameChanged{Nama Berubah?}
    NameChanged -->|YES| CheckDupEdit[Cek Nama di Cabang]
    CheckDupEdit --> IsDupEdit{Sudah Dipakai?}
    IsDupEdit -->|YES| ErrorDupEdit[Error: Nama sudah ada]
    ErrorDupEdit --> PopulateForm
    IsDupEdit -->|NO| UpdateArea
    NameChanged -->|NO| UpdateArea[UPDATE parking_areas]
    UpdateArea --> LogUpdate[Log: AREA_UPDATED]
    LogUpdate --> SuccessUpdate[Success: Area diupdate]
    SuccessUpdate --> RefreshList
    
    %% DELETE FLOW
    ChooseAction -->|DELETE| ClickDelete[Klik Hapus Area]
    ClickDelete --> ConfirmDelete[Konfirmasi: Yakin hapus?]
    ConfirmDelete --> UserConfirm{Konfirmasi?}
    UserConfirm -->|NO| End
    UserConfirm -->|YES| CheckOcc[Query: Cek current_occupancy]
    CheckOcc --> HasVehicles{Ada Kendaraan?}
    HasVehicles -->|YES| ErrorOcc[Error: Area masih ada kendaraan]
    ErrorOcc --> End
    HasVehicles -->|NO| CheckTrans[Query: Cek Transaksi History]
    CheckTrans --> HasTrans{Ada History?}
    HasTrans -->|YES| ErrorHist[Error: Area punya history transaksi]
    ErrorHist --> ShowOption[Opsi: Deactivate saja?]
    ShowOption --> UserChoice{Pilih Deactivate?}
    UserChoice -->|YES| SoftDelete[Soft Delete: is_active = FALSE]
    UserChoice -->|NO| End
    HasTrans -->|NO| HardDelete[Hard Delete: DELETE FROM parking_areas]
    SoftDelete --> LogDelete[Log: AREA_DELETED]
    HardDelete --> LogDelete
    LogDelete --> SuccessDelete[Success: Area dihapus]
    SuccessDelete --> RefreshList
    
    %% COMMON END
    RefreshList[Refresh List Area] --> MenuArea
    ShowTable --> End([END])
    
    style Start fill:#90EE90
    style End fill:#FFB6C1
    style ErrorCreate fill:#FF6B6B
    style ErrorCap fill:#FF6B6B
    style ErrorDup fill:#FF6B6B
    style ErrorNotFound fill:#FF6B6B
    style ErrorEdit fill:#FF6B6B
    style ErrorCapEdit fill:#FF6B6B
    style ErrorDupEdit fill:#FF6B6B
    style ErrorOcc fill:#FF6B6B
    style ErrorHist fill:#FF6B6B
    style ChooseAction fill:#FFD700
    style ValidateCreate fill:#FFD700
    style CheckCapacity fill:#FFD700
    style IsDup fill:#FFD700
    style FilterOpt fill:#FFD700
    style AreaFound fill:#FFD700
    style ValidateEdit fill:#FFD700
    style CheckNewCap fill:#FFD700
    style NameChanged fill:#FFD700
    style IsDupEdit fill:#FFD700
    style UserConfirm fill:#FFD700
    style HasVehicles fill:#FFD700
    style HasTrans fill:#FFD700
    style UserChoice fill:#FFD700
    style SuccessCreate fill:#87CEEB
    style SuccessUpdate fill:#87CEEB
    style SuccessDelete fill:#87CEEB
    style ShowTable fill:#87CEEB
```

---

## RINGKASAN 5 FLOWCHART

### Dari Soal (3 Flowchart Terpisah):
1. ✅ **Proses Login** (soal a)
2. ✅ **Proses Transaksi** (soal b)
3. ✅ **Cetak Struk** (soal c)

### Tambahan (2 Flowchart CRUD Lengkap):
4. ✅ **CRUD User** - Semua operasi dalam 1 diagram
5. ✅ **CRUD Area Parkir** - Semua operasi dalam 1 diagram

---

## PENJELASAN STRUKTUR

### Yang Terpisah (a, b, c):
- Flowchart 1, 2, 3 adalah proses yang berbeda
- Tidak ada hubungan CRUD
- Masing-masing standalone process

### Yang Digabung (4, 5):
- Flowchart 4 dan 5 adalah CRUD operations
- Digabung karena satu kesatuan (Create, Read, Update, Delete)
- Lebih efisien dan jelas dalam 1 diagram

---

## TIPS PRESENTASI

### Script:
```
"Pak/Bu, saya buat 5 flowchart sesuai requirement:

3 dari soal (terpisah):
a. Proses Login
b. Proses Transaksi
c. Cetak Struk

2 tambahan (CRUD lengkap):
4. CRUD User - semua operasi dalam 1 diagram
5. CRUD Area Parkir - semua operasi dalam 1 diagram

Saya gabung CRUD karena lebih efisien dan jelas 
melihat keseluruhan proses dalam 1 flowchart."
```

---

**Good luck dengan ujian! 🎓**
