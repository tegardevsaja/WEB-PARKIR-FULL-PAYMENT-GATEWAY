# 🔄 FLOWCHART TAMBAHAN (2 Master Data)

## Flowchart 4 & 5 - Master Data Management

---

## FLOWCHART 4: CRUD USER (Admin)

### Flowchart 4A: CREATE USER (Tambah User Baru)

```mermaid
flowchart TD
    Start([START]) --> AdminLogin[Admin Login]
    AdminLogin --> MenuUser[Menu Manajemen User]
    MenuUser --> ClickAdd[Klik Tambah User]
    ClickAdd --> ShowForm[Tampilkan Form Input User]
    ShowForm --> InputData[Input: Username, Password, Nama, Role, Cabang]
    InputData --> ValidateInput{Validasi Input?}
    
    ValidateInput -->|INVALID| ErrorValidation[Error: Field tidak valid]
    ErrorValidation --> ShowForm
    
    V ID diisi?}
    CheckRole -->|NO| HashPassword
    
    ValidateBranch -->|NO| ErrorBranch[Error: Petugas harus punya cabang]
    ErrorBranch --> ShowForm
    ValidateBranch -->|YES| HashPassword
    
    HashPassword[Hash Password dengan bcrypt] --> InsertUser[INSERT INTO users]
    InsertUser --> LogActivity[INSERT INTO activity_logs]
    LogActivity --> ShowSuccess[Notifikasi: User berhasil dibuat]
    ShowSuccess --> RefreshList[Refresh List User]
    RefreshList --> End([END])
    
    style Start fill:#90EE90
    style End fill:#FFB6C1
    style ErrorValidation fill:#FF6B6B
    style ErrorDuplicate fill:#FF6B6B
    style ErrorPassword fill:#FF6B6B
    style ErrorBranch fill:#FF6B6B
    style ValidateInput fill:#FFD700
    style UsernameExist fill:#FFD700
    style ValidatePassword fill:#FFD700
    style CheckRole fill:#FFD700
    style ValidateBranch fill:#FFD700
    style ShowSuccess fill:#87CEEB
```

---

### Flowchart 4B: READ USER (Lihat & Filter User)

```mermaid
flowchart TD
    Start([START]) --> AdminLogin[Admin Login]
    AdminLogin --> MenuUser[Menu Manajemen User]
    MenuUser --> QueryUsers[Query: SELECT users + JOIN branches]
    QueryUsers --> ShowTable[Tampilkan Tabel User]
    ShowTable --> ShowFilter[Tampilkan Filter Options]
    
    ShowFilter --> FilterApplied{Filter Diterapkan?}
    FilterApplied -->|NO| WaitAction{Aksi User?}
    
    FilterApplied -->|YES| GetFilter[Ambil Filter: Role, Cabang, Status]
    GetFilter --> ReQuery[Re-query dengan WHERE clause]
    ReQuery --> ShowTable
    
    WaitAction -->|View Detail| ShowDetail[Tampilkan Detail User]
    WaitAction -->|Edit| GoEdit[Lanjut ke Update Flow]
    WaitAction -->|Delete| GoDelete[Lanjut ke Delete Flow]
    WaitAction -->|Refresh| QueryUsers
    WaitAction -->|Exit| End([END])
    
    ShowDetail --> WaitAction
    GoEdit --> End
    GoDelete --> End
    
    style Start fill:#90EE90
    style End fill:#FFB6C1
    style FilterApplied fill:#FFD700
    style WaitAction fill:#FFD700
    style ShowTable fill:#87CEEB
```

---

### Flowchart 4C: UPDATE USER (Edit User)

```mermaid
flowchart TD
    Start([START]) --> ClickEdit[Klik Edit pada User]
    ClickEdit --> QueryUser[Query: SELECT user WHERE user_id]
    QueryUser --> UserFound{User Ditemukan?}
    
    UserFound -->|NO| ErrorNotFound[Error: User tidak ditemukan]
    ErrorNotFound --> End([END])
    
    UserFound -->|YES| PopulateForm[Populate Form dengan Data Existing]
    PopulateForm --> AdminEdit[Admin Ubah Data]
    AdminEdit --> Submit[Submit Form]
    
    Submit --> ValidateInput{Validasi Input?}
    ValidateInput -->|INVALID| ErrorValidation[Error: Input tidak valid]
    ErrorValidation --> PopulateForm
    
    ValidateInput -->|VALID| CheckUsernameChange{Username Berubah?}
    CheckUsernameChange -->|YES| CheckDuplicate[Query: Cek Username Exist]
    CheckUsernameChange -->|NO| CheckPasswordChange
    
    CheckDuplicate --> IsDuplicate{Username Sudah Dipakai?}
    IsDuplicate -->|YES| ErrorDuplicate[Error: Username sudah ada]
    ErrorDuplicate --> PopulateForm
    IsDuplicate -->|NO| CheckPasswordChange
    
    CheckPasswordChange{Password Berubah?}
    CheckPasswordChange -->|YES| HashNewPassword[Hash Password Baru]
    CheckPasswordChange -->|NO| UpdateUser
    
    HashNewPassword --> UpdateUser[UPDATE users SET ...]
    UpdateUser --> LogUpdate[INSERT INTO activity_logs]
    LogUpdate --> ShowSuccess[Notifikasi: User berhasil diupdate]
    ShowSuccess --> RefreshList[Refresh List]
    RefreshList --> End
    
    style Start fill:#90EE90
    style End fill:#FFB6C1
    style ErrorNotFound fill:#FF6B6B
    style ErrorValidation fill:#FF6B6B
    style ErrorDuplicate fill:#FF6B6B
    style UserFound fill:#FFD700
    style ValidateInput fill:#FFD700
    style CheckUsernameChange fill:#FFD700
    style IsDuplicate fill:#FFD700
    style CheckPasswordChange fill:#FFD700
    style ShowSuccess fill:#87CEEB
```

---

### Flowchart 4D: DELETE USER (Hapus/Deactivate User)

```mermaid
flowchart TD
    Start([START]) --> ClickDelete[Klik Hapus pada User]
    ClickDelete --> ShowConfirm[Konfirmasi Dialog: Yakin hapus user ini?]
    ShowConfirm --> UserConfirm{User Konfirmasi?}
    
    UserConfirm -->|NO| End([END])
    
    UserConfirm -->|YES| CheckSelf{User Hapus Diri Sendiri?}
    CheckSelf -->|YES| ErrorSelf[Error: Tidak bisa hapus diri sendiri]
    ErrorSelf --> End
    
    CheckSelf -->|NO| CheckActive{User Sedang Login?}
    CheckActive -->|YES| ErrorActive[Error: User sedang aktif]
    ErrorActive --> End
    
    CheckActive -->|NO| CheckTransactions[Query: Cek Transaksi Terkait]
    CheckTransactions --> HasTransactions{Ada Transaksi?}
    
    HasTransactions -->|YES| SoftDelete[UPDATE users SET is_active = FALSE]
    HasTransactions -->|NO| HardDelete[DELETE FROM users]
    
    SoftDelete --> LogDelete[INSERT INTO activity_logs]
    HardDelete --> LogDelete
    
    LogDelete --> ShowSuccess[Notifikasi: User berhasil dihapus]
    ShowSuccess --> RefreshList[Refresh List]
    RefreshList --> End
    
    style Start fill:#90EE90
    style End fill:#FFB6C1
    style ErrorSelf fill:#FF6B6B
    style ErrorActive fill:#FF6B6B
    style UserConfirm fill:#FFD700
    style CheckSelf fill:#FFD700
    style CheckActive fill:#FFD700
    style HasTransactions fill:#FFD700
    style ShowSuccess fill:#87CEEB
```

---

## FLOWCHART 5: CRUD AREA PARKIR (Admin)

### Flowchart 5A: CREATE AREA PARKIR (Tambah Area)

```mermaid
flowchart TD
    Start([START]) --> AdminLogin[Admin Login]
    AdminLogin --> MenuArea[Menu Manajemen Area Parkir]
    MenuArea --> ClickAdd[Klik Tambah Area]
    ClickAdd --> ShowForm[Tampilkan Form Input Area]
    ShowForm --> InputData[Input: Cabang, Nama Area, Kapasitas]
    InputData --> ValidateInput{Validasi Input?}
    
    ValidateInput -->|INVALID| ErrorValidation[Error: Field tidak valid]
    ErrorValidation --> ShowForm
    
    ValidateInput -->|VALID| CheckCapacity{Kapasitas > 0?}
    CheckCapacity -->|NO| ErrorCapacity[Error: Kapasitas harus > 0]
    ErrorCapacity --> ShowForm
    
    CheckCapacity -->|YES| CheckDuplicate[Query: Cek Area dengan Nama Sama di Cabang]
    CheckDuplicate --> IsDuplicate{Area Sudah Ada?}
    
    IsDuplicate -->|YES| ErrorDuplicate[Error: Nama area sudah digunakan]
    ErrorDuplicate --> ShowForm
    
    IsDuplicate -->|NO| InsertArea[INSERT INTO parking_areas]
    InsertArea --> LogActivity[INSERT INTO activity_logs]
    LogActivity --> ShowSuccess[Notifikasi: Area berhasil dibuat]
    ShowSuccess --> RefreshList[Refresh List Area]
    RefreshList --> End([END])
    
    style Start fill:#90EE90
    style End fill:#FFB6C1
    style ErrorValidation fill:#FF6B6B
    style ErrorCapacity fill:#FF6B6B
    style ErrorDuplicate fill:#FF6B6B
    style ValidateInput fill:#FFD700
    style CheckCapacity fill:#FFD700
    style IsDuplicate fill:#FFD700
    style ShowSuccess fill:#87CEEB
```

---

### Flowchart 5B: READ AREA PARKIR (Lihat & Monitor)

```mermaid
flowchart TD
    Start([START]) --> AdminLogin[Admin Login]
    AdminLogin --> MenuArea[Menu Manajemen Area Parkir]
    MenuArea --> QueryAreas[Query: SELECT parking_areas + JOIN branches]
    QueryAreas --> CalculateStats[Hitung: Available Slots, Occupancy %]
    CalculateStats --> ShowTable[Tampilkan Tabel Area dengan Real-time Data]
    
    ShowTable --> ShowFilter[Tampilkan Filter: By Cabang]
    ShowFilter --> FilterApplied{Filter Diterapkan?}
    
    FilterApplied -->|YES| ReQuery[Re-query dengan WHERE branch_id]
    ReQuery --> CalculateStats
    
    FilterApplied -->|NO| WaitAction{Aksi User?}
    
    WaitAction -->|View Detail| ShowDetail[Tampilkan Detail Area + History]
    WaitAction -->|Edit| GoEdit[Lanjut ke Update Flow]
    WaitAction -->|Delete| GoDelete[Lanjut ke Delete Flow]
    WaitAction -->|Refresh| QueryAreas
    WaitAction -->|Exit| End([END])
    
    ShowDetail --> WaitAction
    GoEdit --> End
    GoDelete --> End
    
    style Start fill:#90EE90
    style End fill:#FFB6C1
    style FilterApplied fill:#FFD700
    style WaitAction fill:#FFD700
    style ShowTable fill:#87CEEB
```

---

### Flowchart 5C: UPDATE AREA PARKIR (Edit Area)

```mermaid
flowchart TD
    Start([START]) --> ClickEdit[Klik Edit pada Area]
    ClickEdit --> QueryArea[Query: SELECT area WHERE area_id]
    QueryArea --> AreaFound{Area Ditemukan?}
    
    AreaFound -->|NO| ErrorNotFound[Error: Area tidak ditemukan]
    ErrorNotFound --> End([END])
    
    AreaFound -->|YES| PopulateForm[Populate Form dengan Data Existing]
    PopulateForm --> AdminEdit[Admin Ubah Data]
    AdminEdit --> Submit[Submit Form]
    
    Submit --> ValidateInput{Validasi Input?}
    ValidateInput -->|INVALID| ErrorValidation[Error: Input tidak valid]
    ErrorValidation --> PopulateForm
    
    ValidateInput -->|VALID| CheckCapacity{Kapasitas Baru >= Okupansi Saat Ini?}
    CheckCapacity -->|NO| ErrorCapacity[Error: Kapasitas tidak boleh < okupansi]
    ErrorCapacity --> PopulateForm
    
    CheckCapacity -->|YES| CheckNameChange{Nama Area Berubah?}
    CheckNameChange -->|YES| CheckDuplicate[Query: Cek Nama di Cabang yang Sama]
    CheckNameChange -->|NO| UpdateArea
    
    CheckDuplicate --> IsDuplicate{Nama Sudah Dipakai?}
    IsDuplicate -->|YES| ErrorDuplicate[Error: Nama sudah ada]
    ErrorDuplicate --> PopulateForm
    
    IsDuplicate -->|NO| UpdateArea[UPDATE parking_areas SET ...]
    UpdateArea --> LogUpdate[INSERT INTO activity_logs]
    LogUpdate --> ShowSuccess[Notifikasi: Area berhasil diupdate]
    ShowSuccess --> RefreshList[Refresh List]
    RefreshList --> End
    
    style Start fill:#90EE90
    style End fill:#FFB6C1
    style ErrorNotFound fill:#FF6B6B
    style ErrorValidation fill:#FF6B6B
    style ErrorCapacity fill:#FF6B6B
    style ErrorDuplicate fill:#FF6B6B
    style AreaFound fill:#FFD700
    style ValidateInput fill:#FFD700
    style CheckCapacity fill:#FFD700
    style CheckNameChange fill:#FFD700
    style IsDuplicate fill:#FFD700
    style ShowSuccess fill:#87CEEB
```

---

### Flowchart 5D: DELETE AREA PARKIR (Hapus Area)

```mermaid
flowchart TD
    Start([START]) --> ClickDelete[Klik Hapus pada Area]
    ClickDelete --> ShowConfirm[Konfirmasi Dialog: Yakin hapus area ini?]
    ShowConfirm --> UserConfirm{User Konfirmasi?}
    
    UserConfirm -->|NO| End([END])
    
    UserConfirm -->|YES| CheckOccupancy[Query: Cek current_occupancy]
    CheckOccupancy --> HasVehicles{Ada Kendaraan di Area?}
    
    HasVehicles -->|YES| ErrorOccupied[Error: Area masih ada kendaraan]
    ErrorOccupied --> End
    
    HasVehicles -->|NO| CheckTransactions[Query: Cek Transaksi Terkait]
    CheckTransactions --> HasTransactions{Ada Transaksi History?}
    
    HasTransactions -->|YES| ErrorHistory[Error: Area punya history transaksi]
    ErrorHistory --> ShowOption[Opsi: Deactivate saja?]
    ShowOption --> UserChoice{User Pilih Deactivate?}
    
    UserChoice -->|YES| SoftDelete[UPDATE parking_areas SET is_active = FALSE]
    UserChoice -->|NO| End
    
    HasTransactions -->|NO| HardDelete[DELETE FROM parking_areas]
    
    SoftDelete --> LogDelete[INSERT INTO activity_logs]
    HardDelete --> LogDelete
    
    LogDelete --> ShowSuccess[Notifikasi: Area berhasil dihapus]
    ShowSuccess --> RefreshList[Refresh List]
    RefreshList --> End
    
    style Start fill:#90EE90
    style End fill:#FFB6C1
    style ErrorOccupied fill:#FF6B6B
    style ErrorHistory fill:#FF6B6B
    style UserConfirm fill:#FFD700
    style HasVehicles fill:#FFD700
    style HasTransactions fill:#FFD700
    style UserChoice fill:#FFD700
    style ShowSuccess fill:#87CEEB
```

---

## RINGKASAN 5 FLOWCHART

### Flowchart dari Soal (3):
1. ✅ **Login** - Autentikasi dengan validasi lengkap
2. ✅ **Kendaraan Masuk** - Entry dengan quick mode
3. ✅ **Kendaraan Keluar & Cetak Struk** - Exit dengan dual payment

### Flowchart Tambahan Master Data (2):
4. ✅ **CRUD User** - Manajemen pengguna sistem
5. ✅ **CRUD Area Parkir** - Manajemen area dengan occupancy tracking

---

## ALASAN PEMILIHAN 2 FLOWCHART TAMBAHAN

### 1. CRUD User (Flowchart 4)
**Alasan:**
- User management adalah fitur critical untuk security
- Multi-role system memerlukan validasi kompleks
- Password hashing dan validation penting untuk dijelaskan
- Menunjukkan pemahaman tentang authentication & authorization

**Kompleksitas:**
- Validasi username unique
- Password hashing dengan bcrypt
- Role-based validation (petugas harus punya cabang)
- Soft delete vs hard delete
- Self-deletion prevention

### 2. CRUD Area Parkir (Flowchart 5)
**Alasan:**
- Core business logic (occupancy tracking)
- Real-time data management
- Constraint checking (capacity vs occupancy)
- Menunjukkan pemahaman tentang business rules

**Kompleksitas:**
- Capacity validation (tidak boleh < occupancy)
- Occupancy checking sebelum delete
- Transaction history checking
- Real-time statistics calculation
- Soft delete untuk data integrity

---

## TIPS PRESENTASI

### Opening
```
"Pak/Bu, saya buat 5 flowchart:
- 3 dari soal: Login, Entry, Exit
- 2 tambahan master data: User dan Area Parkir

Saya pilih User dan Area karena paling critical 
untuk security dan business logic."
```

### Highlight Kompleksitas
```
"Flowchart User menunjukkan:
- Password hashing dengan bcrypt
- Role-based validation
- Duplicate checking
- Soft delete untuk data integrity

Flowchart Area Parkir menunjukkan:
- Real-time occupancy tracking
- Capacity constraint checking
- Business rule enforcement
- Transaction history protection"
```

### Closing
```
"Semua flowchart sudah diimplementasikan 
dan tested di aplikasi saya."
```

---

## CHECKLIST PRESENTASI

- [ ] Render semua 5 flowchart
- [ ] Siap jelaskan alasan pemilihan 2 tambahan
- [ ] Siap jelaskan kompleksitas setiap flowchart
- [ ] Siap tunjukkan implementasi di code
- [ ] Siap jawab pertanyaan

---

**Good luck dengan presentasi! 🎓**

**Remember:** Flowchart harus menunjukkan pemahaman tentang business logic dan technical implementation! 💪
