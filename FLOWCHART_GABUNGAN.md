# 🔄 FLOWCHART 4 & 5 - GABUNGAN (Lengkap & Jelas)

## Flowchart Master Data yang Digabung

---

## FLOWCHART 4: CRUD USER - LENGKAP (Semua dalam 1 Diagram)

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

## PENJELASAN FLOWCHART 4 (CRUD USER)

### Alur CREATE (Tambah User):
1. Admin pilih "CREATE"
2. Input data user (username, password, nama, role, cabang)
3. Validasi:
   - Field tidak boleh kosong
   - Username harus unique
   - Password minimal 8 karakter
   - Jika role = petugas, branch_id wajib diisi
4. Hash password dengan bcrypt
5. Insert ke database
6. Log aktivitas
7. Refresh list

### Alur READ (Lihat User):
1. Admin pilih "READ"
2. Query semua user dengan JOIN branches
3. Tampilkan dalam tabel
4. Bisa filter by role, cabang, status
5. Loop kembali ke menu

### Alur UPDATE (Edit User):
1. Admin pilih "UPDATE" dan klik user
2. Query user by ID
3. Populate form dengan data existing
4. Admin ubah data
5. Validasi:
   - Jika username berubah, cek duplikasi
   - Jika password berubah, hash password baru
6. Update database
7. Log aktivitas
8. Refresh list

### Alur DELETE (Hapus User):
1. Admin pilih "DELETE" dan klik user
2. Konfirmasi hapus
3. Validasi:
   - Tidak bisa hapus diri sendiri
   - Tidak bisa hapus user yang sedang login
4. Cek transaksi terkait:
   - Jika ada transaksi: Soft delete (is_active = FALSE)
   - Jika tidak ada: Hard delete (DELETE FROM users)
5. Log aktivitas
6. Refresh list

---

## FLOWCHART 5: CRUD AREA PARKIR - LENGKAP (Semua dalam 1 Diagram)

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

## PENJELASAN FLOWCHART 5 (CRUD AREA PARKIR)

### Alur CREATE (Tambah Area):
1. Admin pilih "CREATE"
2. Input data area (cabang, nama area, kapasitas)
3. Validasi:
   - Field tidak boleh kosong
   - Kapasitas harus > 0
   - Nama area unique per cabang
4. Insert ke database
5. Log aktivitas
6. Refresh list

### Alur READ (Lihat Area):
1. Admin pilih "READ"
2. Query semua area dengan JOIN branches
3. Hitung statistik real-time:
   - Available slots = capacity - current_occupancy
   - Occupancy % = (current_occupancy / capacity) * 100
4. Tampilkan dalam tabel
5. Bisa filter by cabang
6. Loop kembali ke menu

### Alur UPDATE (Edit Area):
1. Admin pilih "UPDATE" dan klik area
2. Query area by ID
3. Populate form dengan data existing
4. Admin ubah data
5. Validasi:
   - Kapasitas baru tidak boleh < okupansi saat ini
   - Jika nama berubah, cek duplikasi
6. Update database
7. Log aktivitas
8. Refresh list

### Alur DELETE (Hapus Area):
1. Admin pilih "DELETE" dan klik area
2. Konfirmasi hapus
3. Validasi:
   - Tidak bisa hapus jika masih ada kendaraan (current_occupancy > 0)
   - Jika ada history transaksi, tawarkan soft delete
4. Pilihan:
   - Soft delete (is_active = FALSE) jika ada history
   - Hard delete (DELETE) jika tidak ada history
5. Log aktivitas
6. Refresh list

---

## KEUNGGULAN FLOWCHART GABUNGAN

### 1. Lengkap dalam 1 Diagram
- Semua operasi CRUD dalam 1 flowchart
- Mudah melihat keseluruhan proses
- Tidak perlu buka-buka banyak diagram

### 2. Jelas dan Terstruktur
- Decision point (diamond) jelas
- Error handling comprehensive
- Success path dan error path terpisah

### 3. Real-world Implementation
- Validasi lengkap
- Soft delete vs hard delete
- Activity logging
- Business rules enforcement

---

## TIPS PRESENTASI

### Script:
```
"Pak/Bu, ini flowchart CRUD User dan CRUD Area Parkir.
Saya gabung semua operasi (Create, Read, Update, Delete) 
dalam 1 diagram agar lebih lengkap dan jelas.

Flowchart ini menunjukkan:
- Validasi input yang comprehensive
- Error handling yang proper
- Soft delete vs hard delete
- Activity logging untuk audit
- Business rules enforcement"
```

### Highlight:
1. **Decision Points** - Semua kondisi jelas (diamond kuning)
2. **Error Handling** - Semua error case tertangani (kotak merah)
3. **Success Flow** - Happy path jelas (kotak biru)
4. **Business Logic** - Constraint checking (password >= 8, capacity > 0, dll)

---

**Good luck! 🎓**
    