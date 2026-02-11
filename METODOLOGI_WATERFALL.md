# 📊 METODOLOGI PENGEMBANGAN - WATERFALL

## Aplikasi Parkir Desktop
**SMK - Rekayasa Perangkat Lunak**  
**Ujian Praktik Kejuruan**

---

## 📋 DAFTAR ISI

1. [Pengenalan Metodologi Waterfall](#1-pengenalan-metodologi-waterfall)
2. [Alasan Pemilihan Waterfall](#2-alasan-pemilihan-waterfall)
3. [Fase-Fase Waterfall](#3-fase-fase-waterfall)
4. [Timeline Pengerjaan](#4-timeline-pengerjaan)
5. [Deliverables per Fase](#5-deliverables-per-fase)
6. [Diagram Waterfall](#6-diagram-waterfall)

---

## 1. PENGENALAN METODOLOGI WATERFALL

### Definisi

**Waterfall** adalah metodologi pengembangan perangkat lunak yang bersifat **sekuensial** dan **linear**, di mana setiap fase harus diselesaikan sepenuhnya sebelum fase berikutnya dimulai.

### Karakteristik Utama

1. **Sequential** - Fase berjalan berurutan
2. **Linear** - Tidak ada iterasi mundur
3. **Documented** - Setiap fase menghasilkan dokumentasi
4. **Structured** - Proses terstruktur dan jelas
5. **Predictable** - Timeline dan deliverables jelas

### Model Waterfall

```
┌─────────────────────────────────────────────────┐
│                                                 │
│  1. REQUIREMENTS ANALYSIS                      │
│     (Analisis Kebutuhan)                       │
│                                                 │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│                                                 │
│  2. SYSTEM DESIGN                              │
│     (Desain Sistem)                            │
│                                                 │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│                                                 │
│  3. IMPLEMENTATION                             │
│     (Implementasi/Coding)                      │
│                                                 │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│                                                 │
│  4. TESTING                                    │
│     (Pengujian)                                │
│                                                 │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│                                                 │
│  5. DEPLOYMENT & MAINTENANCE                   │
│     (Deployment & Pemeliharaan)                │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## 2. ALASAN PEMILIHAN WATERFALL

### Mengapa Waterfall untuk Project Ini?

#### ✅ Kelebihan yang Sesuai:

1. **Requirements Jelas**
   - Soal ujian sudah spesifik
   - Fitur sudah ditentukan
   - Tidak ada perubahan requirement di tengah jalan

2. **Timeline Terbatas**
   - Ujian praktik: 11 jam
   - Perlu struktur yang jelas
   - Tidak ada waktu untuk iterasi

3. **Dokumentasi Lengkap**
   - Ujian memerlukan dokumentasi
   - ERD, DFD, Flowchart wajib
   - Waterfall menghasilkan dokumentasi di setiap fase

4. **Proses Terstruktur**
   - Mudah diikuti
   - Jelas kapan selesai
   - Cocok untuk pemula

5. **Predictable**
   - Timeline bisa diprediksi
   - Progress bisa diukur
   - Risk minimal

#### ❌ Kekurangan (Tapi Tidak Masalah):

1. **Tidak Flexible** - OK, karena requirement tidak berubah
2. **Tidak Ada Iterasi** - OK, karena waktu terbatas
3. **Testing di Akhir** - OK, karena scope kecil

### Perbandingan dengan Metodologi Lain

| Aspek | Waterfall | Agile | RAD |
|-------|-----------|-------|-----|
| **Flexibility** | Rendah | Tinggi | Sedang |
| **Documentation** | Lengkap | Minimal | Sedang |
| **Timeline** | Fixed | Iterative | Cepat |
| **Cocok untuk Ujian?** | ✅ Ya | ❌ Tidak | ⚠️ Mungkin |

**Kesimpulan:** Waterfall paling cocok untuk ujian praktik dengan requirement jelas dan timeline terbatas.

---

## 3. FASE-FASE WATERFALL

### FASE 1: REQUIREMENTS ANALYSIS (Analisis Kebutuhan)

#### Tujuan:
Memahami dan mendokumentasikan semua kebutuhan sistem.

#### Aktivitas:

1. **Analisis Soal Ujian**
   - Baca dan pahami requirement dari PDF soal
   - Identifikasi fitur yang wajib ada
   - Identifikasi constraint dan batasan

2. **Identifikasi Stakeholder**
   - Admin (mengelola master data)
   - Petugas (transaksi harian)
   - Owner (laporan dan statistik)

3. **Analisis Kebutuhan Fungsional**
   - Login/Logout multi-role
   - CRUD master data (user, tarif, area, kendaraan, cabang)
   - Transaksi parkir (masuk/keluar)
   - Pembayaran (Cash & QRIS)
   - Laporan dan statistik
   - Activity logging

4. **Analisis Kebutuhan Non-Fungsional**
   - Performance: Response time < 2 detik
   - Security: Password hashing, SQL injection prevention
   - Usability: User-friendly interface
   - Reliability: Error handling yang baik

5. **Identifikasi Teknologi**
   - Frontend: Next.js
   - Backend: Node.js + Express
   - Database: MySQL
   - Payment Gateway: Midtrans

#### Output:

- ✅ Dokumen SRS (Software Requirements Specification)
- ✅ Use Case Diagram
- ✅ User Stories
- ✅ Functional Requirements List
- ✅ Non-Functional Requirements List

#### Durasi: **1-2 jam**

---

### FASE 2: SYSTEM DESIGN (Desain Sistem)

#### Tujuan:
Merancang arsitektur dan desain sistem berdasarkan requirements.

#### Aktivitas:

1. **Database Design**
   - Identifikasi entitas (8 tabel)
   - Tentukan atribut setiap entitas
   - Tentukan relasi antar tabel
   - Normalisasi database (3NF)
   - Buat ERD (Entity Relationship Diagram)

2. **Process Design**
   - Buat DFD Level 0 (Context Diagram)
   - Buat DFD Level 1 (6 proses utama)
   - Buat Flowchart (5 proses kritis):
     * Login
     * Kendaraan Masuk
     * Kendaraan Keluar & Cetak Struk
     * CRUD Tarif Parkir
     * Generate Laporan Statistik

3. **Architecture Design**
   - 3-Tier Architecture:
     * Presentation Layer (Next.js)
     * Business Logic Layer (Node.js API)
     * Data Layer (MySQL)

4. **API Design**
   - Tentukan endpoints
   - Tentukan request/response format
   - Tentukan authentication method (JWT)

5. **UI/UX Design**
   - Wireframe untuk setiap halaman
   - User flow
   - Navigation structure

6. **Security Design**
   - Password hashing strategy (bcrypt)
   - Session management (JWT)
   - Input validation rules
   - SQL injection prevention

#### Output:

- ✅ ERD (Entity Relationship Diagram)
- ✅ DFD Level 0 dan Level 1
- ✅ Flowchart (5 proses)
- ✅ Database Schema SQL
- ✅ API Documentation
- ✅ UI Wireframes
- ✅ Architecture Diagram

#### Durasi: **2-3 jam**

---

### FASE 3: IMPLEMENTATION (Implementasi/Coding)

#### Tujuan:
Mengimplementasikan desain menjadi kode yang berfungsi.

#### Aktivitas:

1. **Setup Environment**
   - Install Node.js, MySQL
   - Setup project structure
   - Install dependencies (Next.js, Express, MySQL2, dll)
   - Setup Git repository

2. **Database Implementation**
   - Create database
   - Create tables (8 tabel)
   - Create indexes
   - Create stored procedures
   - Create views
   - Create triggers
   - Insert sample data

3. **Backend Implementation**
   - Setup Express server
   - Create database connection
   - Implement authentication (login/logout)
   - Implement API endpoints:
     * User management
     * Branch management
     * Parking area management
     * Vehicle type management
     * Parking rate management
     * Vehicle management
     * Transaction management (entry/exit)
     * Payment processing (Cash/QRIS)
     * Statistics and reports
     * Activity logs
   - Implement middleware (auth, validation, error handling)
   - Integrate Midtrans API

4. **Frontend Implementation**
   - Setup Next.js project
   - Create layout components
   - Create pages:
     * Login page
     * Admin dashboard
     * Petugas transaction page
     * Owner statistics page
   - Create forms (with validation)
   - Create tables (with pagination)
   - Create charts (for statistics)
   - Implement state management
   - Implement API calls
   - Implement error handling

5. **Integration**
   - Connect frontend dengan backend
   - Test API calls
   - Handle loading states
   - Handle error states

#### Output:

- ✅ Source code lengkap (frontend + backend)
- ✅ Database dengan sample data
- ✅ Working application
- ✅ API endpoints yang functional
- ✅ UI yang terintegrasi

#### Durasi: **5-6 jam**

---

### FASE 4: TESTING (Pengujian)

#### Tujuan:
Memastikan sistem berfungsi sesuai requirements dan bebas dari bug.

#### Aktivitas:

1. **Unit Testing**
   - Test setiap function/method
   - Test business logic
   - Test validation rules
   - Test error handling

2. **Integration Testing**
   - Test API endpoints
   - Test database queries
   - Test frontend-backend integration
   - Test Midtrans integration

3. **System Testing**
   - Test complete user flows:
     * Login flow
     * Vehicle entry flow
     * Vehicle exit flow
     * Payment flow (Cash & QRIS)
     * CRUD operations
     * Report generation
   - Test dengan berbagai skenario
   - Test edge cases

4. **User Acceptance Testing (UAT)**
   - Test dari perspektif user
   - Test usability
   - Test performance
   - Collect feedback

5. **Bug Fixing**
   - Identifikasi bugs
   - Prioritize bugs
   - Fix bugs
   - Re-test

6. **Performance Testing**
   - Test response time
   - Test dengan data besar
   - Test concurrent users
   - Optimize jika perlu

#### Output:

- ✅ Test cases dan test results
- ✅ Bug report dan fix documentation
- ✅ Performance test results
- ✅ UAT sign-off
- ✅ Aplikasi yang stable dan tested

#### Durasi: **1-2 jam**

---

### FASE 5: DEPLOYMENT & MAINTENANCE (Deployment & Pemeliharaan)

#### Tujuan:
Deploy aplikasi dan siapkan untuk production use.

#### Aktivitas:

1. **Deployment Preparation**
   - Final testing
   - Backup database
   - Prepare deployment package
   - Create deployment documentation

2. **Deployment**
   - Setup production environment
   - Deploy database
   - Deploy backend
   - Deploy frontend
   - Configure environment variables
   - Test production deployment

3. **Documentation**
   - User manual
   - Technical documentation
   - API documentation
   - Deployment guide
   - Troubleshooting guide

4. **Training**
   - User training (Admin, Petugas, Owner)
   - Demo aplikasi
   - Q&A session

5. **Maintenance Plan**
   - Backup strategy
   - Update strategy
   - Bug fix process
   - Support plan

#### Output:

- ✅ Deployed application
- ✅ User manual
- ✅ Technical documentation
- ✅ Training materials
- ✅ Maintenance plan

#### Durasi: **1 jam**

---

## 4. TIMELINE PENGERJAAN

### Total Waktu: **11 Jam**

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  FASE 1: Requirements Analysis                             │
│  ████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│  Durasi: 1-2 jam (10-15%)                                  │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  FASE 2: System Design                                     │
│  ████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│  Durasi: 2-3 jam (20-25%)                                  │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  FASE 3: Implementation                                    │
│  ████████████████████████████████░░░░░░░░░░░░░░░░░░░░░░░░  │
│  Durasi: 5-6 jam (50-55%)                                  │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  FASE 4: Testing                                           │
│  ████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│  Durasi: 1-2 jam (10-15%)                                  │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  FASE 5: Deployment & Maintenance                          │
│  ████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│  Durasi: 1 jam (5-10%)                                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Breakdown Detail:

| Fase | Aktivitas | Durasi | Persentase |
|------|-----------|--------|------------|
| **1. Requirements** | Analisis soal, identifikasi fitur | 1-2 jam | 10-15% |
| **2. Design** | ERD, DFD, Flowchart, API design | 2-3 jam | 20-25% |
| **3. Implementation** | Coding frontend + backend | 5-6 jam | 50-55% |
| **4. Testing** | Unit, integration, system testing | 1-2 jam | 10-15% |
| **5. Deployment** | Deploy, dokumentasi, training | 1 jam | 5-10% |
| **TOTAL** | | **11 jam** | **100%** |

### Timeline Harian (Contoh):

```
08:00 - 09:30  │ FASE 1: Requirements Analysis
               │ - Baca soal, analisis kebutuhan
               │
09:30 - 12:30  │ FASE 2: System Design
               │ - Buat ERD, DFD, Flowchart
               │ - Design database schema
               │
12:30 - 13:00  │ ISTIRAHAT MAKAN SIANG
               │
13:00 - 18:00  │ FASE 3: Implementation
               │ - Setup environment
               │ - Create database
               │ - Coding backend API
               │ - Coding frontend UI
               │ - Integration
               │
18:00 - 19:30  │ FASE 4: Testing
               │ - Test semua fitur
               │ - Bug fixing
               │
19:30 - 20:30  │ FASE 5: Deployment
               │ - Final deployment
               │ - Dokumentasi
               │ - Persiapan presentasi
```

---

## 5. DELIVERABLES PER FASE

### Fase 1: Requirements Analysis

| No | Deliverable | Format | Status |
|----|-------------|--------|--------|
| 1 | Dokumen SRS | PDF/Word | ✅ |
| 2 | Use Case Diagram | Image | ✅ |
| 3 | User Stories | Document | ✅ |
| 4 | Requirements List | Document | ✅ |

### Fase 2: System Design

| No | Deliverable | Format | Status |
|----|-------------|--------|--------|
| 1 | ERD | Image/Draw.io | ✅ |
| 2 | DFD Level 0 | Image/Draw.io | ✅ |
| 3 | DFD Level 1 | Image/Draw.io | ✅ |
| 4 | Flowchart (5 proses) | Image/Draw.io | ✅ |
| 5 | Database Schema SQL | .sql file | ✅ |
| 6 | API Documentation | Markdown/PDF | ✅ |
| 7 | UI Wireframes | Image/Figma | ✅ |

### Fase 3: Implementation

| No | Deliverable | Format | Status |
|----|-------------|--------|--------|
| 1 | Source Code Backend | .js/.ts files | ✅ |
| 2 | Source Code Frontend | .jsx/.tsx files | ✅ |
| 3 | Database dengan Data | .sql file | ✅ |
| 4 | Working Application | Running app | ✅ |

### Fase 4: Testing

| No | Deliverable | Format | Status |
|----|-------------|--------|--------|
| 1 | Test Cases | Document | ✅ |
| 2 | Test Results | Document | ✅ |
| 3 | Bug Report | Document | ✅ |
| 4 | Performance Report | Document | ✅ |

### Fase 5: Deployment

| No | Deliverable | Format | Status |
|----|-------------|--------|--------|
| 1 | Deployed Application | URL/Executable | ✅ |
| 2 | User Manual | PDF | ✅ |
| 3 | Technical Documentation | PDF | ✅ |
| 4 | Presentation Slides | PPT | ✅ |

---

## 6. DIAGRAM WATERFALL

### Diagram Lengkap dengan Feedback Loop

```
                    ┌─────────────────────┐
                    │   REQUIREMENTS      │
                    │     ANALYSIS        │
                    └──────────┬──────────┘
                               │
                               │ Requirements Document
                               │
                               ▼
                    ┌─────────────────────┐
                    │   SYSTEM DESIGN     │
                    │                     │
                    └──────────┬──────────┘
                               │
                               │ Design Documents
                               │ (ERD, DFD, Flowchart)
                               │
                               ▼
                    ┌─────────────────────┐
                    │  IMPLEMENTATION     │
                    │     (CODING)        │
                    └──────────┬──────────┘
                               │
                               │ Source Code
                               │
                               ▼
                    ┌─────────────────────┐
                    │     TESTING         │
                    │                     │
                    └──────────┬──────────┘
                               │
                               │ Test Results
                               │
                               ▼
                    ┌─────────────────────┐
                    │   DEPLOYMENT &      │
                    │   MAINTENANCE       │
                    └─────────────────────┘
                               │
                               │ Production System
                               │
                               ▼
                         [END USER]
```

### Waterfall dengan Verification & Validation

```
PHASES                  VERIFICATION              VALIDATION
                       (Are we building          (Are we building
                        it right?)               the right thing?)

Requirements    ──────────────────────────────────────────────
Analysis               │                              │
                       │ Review                       │
                       ▼                              │
System          ──────────────────────────────────────│────────
Design                 │                              │
                       │ Design Review                │
                       ▼                              │
Implementation  ──────────────────────────────────────│────────
                       │                              │
                       │ Code Review                  │
                       ▼                              │
Testing         ──────────────────────────────────────│────────
                       │                              │
                       │ Test Review                  │
                       ▼                              ▼
Deployment      ──────────────────────────────────────────────
                                                      │
                                                      │ UAT
                                                      ▼
                                                [ACCEPTANCE]
```

---

## 7. RISK MANAGEMENT

### Potential Risks & Mitigation

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| **Waktu tidak cukup** | High | High | Prioritize fitur utama, skip nice-to-have |
| **Bug di production** | Medium | High | Thorough testing, error handling |
| **Requirement berubah** | Low | Medium | Waterfall tidak flexible, tapi bisa adjust minor |
| **Teknologi tidak familiar** | Medium | Medium | Study sebelum ujian, prepare boilerplate |
| **Database error** | Low | High | Backup, transaction rollback |

---

## 8. QUALITY ASSURANCE

### Quality Metrics

1. **Functionality** - Semua fitur works sesuai requirement
2. **Reliability** - Aplikasi stable, minimal bugs
3. **Usability** - User-friendly, easy to use
4. **Performance** - Response time < 2 detik
5. **Security** - Password hashed, SQL injection prevented
6. **Maintainability** - Code clean, well-documented

### Quality Checklist

- [ ] Semua requirement terpenuhi
- [ ] Database normalized (3NF)
- [ ] API endpoints tested
- [ ] UI responsive dan user-friendly
- [ ] Error handling comprehensive
- [ ] Security measures implemented
- [ ] Documentation lengkap
- [ ] Code clean dan readable

---

## 9. KESIMPULAN

### Mengapa Waterfall Cocok?

1. ✅ **Requirements jelas** dari soal ujian
2. ✅ **Timeline fixed** (11 jam)
3. ✅ **Dokumentasi lengkap** diperlukan
4. ✅ **Proses terstruktur** mudah diikuti
5. ✅ **Predictable** progress dan deliverables

### Key Success Factors

1. **Planning** - Alokasi waktu yang tepat
2. **Discipline** - Ikuti fase secara berurutan
3. **Documentation** - Dokumentasi di setiap fase
4. **Testing** - Jangan skip testing
5. **Time Management** - Jangan stuck di satu fase

### Final Notes

Waterfall adalah metodologi yang **proven** dan **reliable** untuk project dengan:
- Requirements yang jelas
- Timeline yang terbatas
- Dokumentasi yang diperlukan
- Scope yang fixed

Untuk ujian praktik kejuruan, Waterfall adalah pilihan yang **tepat** dan **aman**.

---

**Good luck dengan ujian! 🎓**

**Remember:** Plan your work, work your plan! 💪
