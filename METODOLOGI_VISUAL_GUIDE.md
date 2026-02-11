# 🎨 METODOLOGI WATERFALL - VISUAL GUIDE

Panduan visual untuk presentasi metodologi di ujian.

---

## 📊 DIAGRAM 1: WATERFALL MODEL (Basic)

```
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║                    WATERFALL MODEL                        ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝

    ┌─────────────────────────────────────────────┐
    │                                             │
    │   1. REQUIREMENTS ANALYSIS                 │
    │      (Analisis Kebutuhan)                  │
    │                                             │
    │   • Baca soal ujian                        │
    │   • Identifikasi fitur                     │
    │   • Analisis stakeholder                   │
    │                                             │
    └──────────────────┬──────────────────────────┘
                       │
                       │ Output: SRS, Use Case
                       │
                       ▼
    ┌─────────────────────────────────────────────┐
    │                                             │
    │   2. SYSTEM DESIGN                         │
    │      (Desain Sistem)                       │
    │                                             │
    │   • Buat ERD                               │
    │   • Buat DFD                               │
    │   • Buat Flowchart                         │
    │   • Design database                        │
    │                                             │
    └──────────────────┬──────────────────────────┘
                       │
                       │ Output: ERD, DFD, Flowchart
                       │
                       ▼
    ┌─────────────────────────────────────────────┐
    │                                             │
    │   3. IMPLEMENTATION                        │
    │      (Implementasi/Coding)                 │
    │                                             │
    │   • Setup environment                      │
    │   • Create database                        │
    │   • Coding backend                         │
    │   • Coding frontend                        │
    │                                             │
    └──────────────────┬──────────────────────────┘
                       │
                       │ Output: Source Code
                       │
                       ▼
    ┌─────────────────────────────────────────────┐
    │                                             │
    │   4. TESTING                               │
    │      (Pengujian)                           │
    │                                             │
    │   • Unit testing                           │
    │   • Integration testing                    │
    │   • System testing                         │
    │   • Bug fixing                             │
    │                                             │
    └──────────────────┬──────────────────────────┘
                       │
                       │ Output: Test Results
                       │
                       ▼
    ┌─────────────────────────────────────────────┐
    │                                             │
    │   5. DEPLOYMENT & MAINTENANCE              │
    │      (Deployment & Pemeliharaan)           │
    │                                             │
    │   • Deploy aplikasi                        │
    │   • User training                          │
    │   • Documentation                          │
    │   • Maintenance plan                       │
    │                                             │
    └─────────────────────────────────────────────┘
                       │
                       │ Output: Production System
                       │
                       ▼
                  [END USER]
```

---

## ⏱️ DIAGRAM 2: TIMELINE (11 Jam)

```
╔═══════════════════════════════════════════════════════════╗
║                  TIMELINE PENGERJAAN                      ║
║                     Total: 11 Jam                         ║
╚═══════════════════════════════════════════════════════════╝

JAM 1-2    │ ████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
           │ FASE 1: Requirements Analysis (1-2 jam)
           │ • Analisis soal
           │ • Identifikasi fitur
           │ • Dokumentasi requirements
           │
JAM 3-5    │ ████████████████████████████░░░░░░░░░░░░░░░░░░
           │ FASE 2: System Design (2-3 jam)
           │ • Buat ERD
           │ • Buat DFD Level 0 & 1
           │ • Buat 5 Flowchart
           │ • Design database schema
           │ • Design API
           │
JAM 6-11   │ ████████████████████████████████████████████████
           │ FASE 3: Implementation (5-6 jam)
           │ • Setup environment
           │ • Create database
           │ • Coding backend (3 jam)
           │ • Coding frontend (2 jam)
           │ • Integration (1 jam)
           │
JAM 11-12  │ ████████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
           │ FASE 4: Testing (1-2 jam)
           │ • Unit testing
           │ • Integration testing
           │ • Bug fixing
           │
JAM 12-13  │ ████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
           │ FASE 5: Deployment (1 jam)
           │ • Final deployment
           │ • Documentation
           │ • Persiapan presentasi

LEGEND:
████ = Completed
░░░░ = Remaining
```

---

## 📈 DIAGRAM 3: EFFORT DISTRIBUTION

```
╔═══════════════════════════════════════════════════════════╗
║              DISTRIBUSI EFFORT (Persentase)               ║
╚═══════════════════════════════════════════════════════════╝

Requirements     │ ████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░
Analysis         │ 15% (1-2 jam)
                 │
System           │ ████████████████████████░░░░░░░░░░░░░░░░
Design           │ 25% (2-3 jam)
                 │
Implementation   │ ████████████████████████████████████████████████
                 │ 55% (5-6 jam)
                 │
Testing          │ ████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░
                 │ 15% (1-2 jam)
                 │
Deployment       │ ████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
                 │ 10% (1 jam)

0%              25%             50%             75%          100%
```

---

## 🔄 DIAGRAM 4: WATERFALL WITH FEEDBACK

```
╔═══════════════════════════════════════════════════════════╗
║         WATERFALL MODEL WITH FEEDBACK LOOPS               ║
╚═══════════════════════════════════════════════════════════╝

    ┌─────────────────────┐
    │   REQUIREMENTS      │
    │     ANALYSIS        │
    └──────────┬──────────┘
               │
               │ Forward
               ▼
    ┌─────────────────────┐
    │   SYSTEM DESIGN     │◄──────┐
    └──────────┬──────────┘       │
               │                   │ Feedback
               │ Forward           │ (jika ada error)
               ▼                   │
    ┌─────────────────────┐       │
    │  IMPLEMENTATION     │◄──────┤
    └──────────┬──────────┘       │
               │                   │
               │ Forward           │
               ▼                   │
    ┌─────────────────────┐       │
    │     TESTING         │───────┘
    └──────────┬──────────┘
               │
               │ Forward
               ▼
    ┌─────────────────────┐
    │   DEPLOYMENT        │
    └─────────────────────┘

NOTE: Feedback loop hanya untuk bug fixing,
      bukan untuk perubahan requirement!
```

---

## 📦 DIAGRAM 5: DELIVERABLES PER FASE

```
╔═══════════════════════════════════════════════════════════╗
║                  DELIVERABLES OVERVIEW                    ║
╚═══════════════════════════════════════════════════════════╝

FASE 1                      FASE 2
Requirements                System Design
┌─────────────┐            ┌─────────────┐
│ • SRS       │            │ • ERD       │
│ • Use Case  │            │ • DFD       │
│ • User      │            │ • Flowchart │
│   Stories   │            │ • DB Schema │
└─────────────┘            │ • API Docs  │
                           └─────────────┘

FASE 3                      FASE 4
Implementation              Testing
┌─────────────┐            ┌─────────────┐
│ • Backend   │            │ • Test      │
│   Code      │            │   Cases     │
│ • Frontend  │            │ • Test      │
│   Code      │            │   Results   │
│ • Database  │            │ • Bug       │
│ • Working   │            │   Report    │
│   App       │            └─────────────┘
└─────────────┘

FASE 5
Deployment
┌─────────────┐
│ • Deployed  │
│   App       │
│ • User      │
│   Manual    │
│ • Tech      │
│   Docs      │
└─────────────┘
```

---

## 🎯 DIAGRAM 6: CRITICAL PATH

```
╔═══════════════════════════════════════════════════════════╗
║              CRITICAL PATH (Must Complete)                ║
╚═══════════════════════════════════════════════════════════╝

START
  │
  ├─► [Baca Soal] ──────────────────────────► MUST DO
  │
  ├─► [Buat ERD] ───────────────────────────► MUST DO
  │
  ├─► [Buat DFD] ───────────────────────────► MUST DO
  │
  ├─► [Buat Flowchart] ─────────────────────► MUST DO
  │
  ├─► [Create Database] ────────────────────► MUST DO
  │
  ├─► [Implement Login] ────────────────────► MUST DO
  │
  ├─► [Implement Entry] ────────────────────► MUST DO
  │
  ├─► [Implement Exit] ─────────────────────► MUST DO
  │
  ├─► [Implement Payment] ──────────────────► MUST DO
  │
  ├─► [Testing] ────────────────────────────► MUST DO
  │
  └─► [Documentation] ──────────────────────► MUST DO
  │
END

OPTIONAL (Nice to Have):
  • Advanced UI/UX
  • Complex statistics
  • Export to Excel
  • Email notifications
```

---

## ⚠️ DIAGRAM 7: RISK MATRIX

```
╔═══════════════════════════════════════════════════════════╗
║                      RISK MATRIX                          ║
╚═══════════════════════════════════════════════════════════╝

IMPACT
  │
H │     [Database Error]      [Waktu Tidak Cukup]
I │                                    ▲
G │                                    │ HIGH PRIORITY
H │                                    │
  │
M │  [Teknologi Tidak      [Bug di Production]
E │   Familiar]
D │
  │
L │  [Minor UI Bug]        [Requirement Berubah]
O │
W │
  └─────────────────────────────────────────────────►
      LOW        MEDIUM        HIGH      PROBABILITY

MITIGATION STRATEGY:
• High Impact + High Probability = PREVENT
• High Impact + Low Probability = PREPARE
• Low Impact + High Probability = REDUCE
• Low Impact + Low Probability = ACCEPT
```

---

## 📊 DIAGRAM 8: QUALITY GATES

```
╔═══════════════════════════════════════════════════════════╗
║                     QUALITY GATES                         ║
╚═══════════════════════════════════════════════════════════╝

Requirements ──► [GATE 1] ──► System Design
                    │
                    ├─ Requirements complete? ✓
                    ├─ Stakeholders identified? ✓
                    └─ Scope clear? ✓

System Design ──► [GATE 2] ──► Implementation
                    │
                    ├─ ERD complete? ✓
                    ├─ DFD complete? ✓
                    ├─ Flowchart complete? ✓
                    └─ Database schema ready? ✓

Implementation ──► [GATE 3] ──► Testing
                    │
                    ├─ All features coded? ✓
                    ├─ Database created? ✓
                    ├─ API working? ✓
                    └─ UI functional? ✓

Testing ──► [GATE 4] ──► Deployment
                    │
                    ├─ All tests passed? ✓
                    ├─ Bugs fixed? ✓
                    ├─ Performance OK? ✓
                    └─ UAT approved? ✓

Deployment ──► [GATE 5] ──► Production
                    │
                    ├─ Deployed successfully? ✓
                    ├─ Documentation complete? ✓
                    ├─ Training done? ✓
                    └─ Backup ready? ✓
```

---

## 🎓 TIPS PRESENTASI METODOLOGI

### 1. Opening Statement

```
"Pak/Bu, untuk project aplikasi parkir ini, 
saya menggunakan metodologi WATERFALL.

Alasannya:
1. Requirements dari soal sudah jelas
2. Timeline fixed (11 jam)
3. Dokumentasi lengkap diperlukan
4. Proses terstruktur dan predictable"
```

### 2. Tunjukkan Diagram

```
[Tunjukkan Diagram Waterfall]

"Ini diagram waterfall saya. Ada 5 fase:
1. Requirements Analysis - 1-2 jam
2. System Design - 2-3 jam
3. Implementation - 5-6 jam
4. Testing - 1-2 jam
5. Deployment - 1 jam

Total 11 jam sesuai waktu ujian."
```

### 3. Jelaskan Deliverables

```
[Tunjukkan Deliverables]

"Setiap fase menghasilkan deliverables:
- Fase 1: SRS, Use Case
- Fase 2: ERD, DFD, Flowchart
- Fase 3: Source Code
- Fase 4: Test Results
- Fase 5: Deployed App

Semua dokumentasi lengkap."
```

### 4. Highlight Critical Path

```
[Tunjukkan Critical Path]

"Ini critical path saya. Fitur yang MUST DO:
- Login system
- Vehicle entry
- Vehicle exit
- Payment (Cash & QRIS)
- Basic reports

Fitur optional saya skip untuk fokus ke core features."
```

### 5. Closing

```
"Jadi dengan metodologi Waterfall, 
saya bisa deliver project ini on time, 
dengan dokumentasi lengkap, dan quality terjaga.

Terima kasih."
```

---

## ✅ CHECKLIST PRESENTASI

- [ ] Siap jelaskan kenapa pilih Waterfall
- [ ] Siap tunjukkan diagram Waterfall
- [ ] Siap jelaskan setiap fase
- [ ] Siap tunjukkan timeline 11 jam
- [ ] Siap tunjukkan deliverables
- [ ] Siap jelaskan critical path
- [ ] Siap jawab pertanyaan tentang metodologi

---

## 💡 COMMON QUESTIONS & ANSWERS

### Q: "Kenapa tidak pakai Agile?"

**A:** 
```
"Pak/Bu, Agile cocok untuk project dengan:
- Requirements yang berubah-ubah
- Timeline yang flexible
- Iterative development

Tapi untuk ujian ini:
- Requirements sudah fixed dari soal
- Timeline fixed (11 jam)
- Tidak ada waktu untuk iterasi

Jadi Waterfall lebih cocok dan aman."
```

### Q: "Bagaimana kalau ada bug di tengah jalan?"

**A:**
```
"Pak/Bu, Waterfall memang sequential, 
tapi ada feedback loop untuk bug fixing.

Jika di fase Testing ketemu bug, 
saya bisa balik ke Implementation untuk fix.

Tapi ini bukan perubahan requirement, 
hanya bug fixing. Masih dalam scope Waterfall."
```

### Q: "Waterfall kan kuno, kenapa tidak pakai yang modern?"

**A:**
```
"Pak/Bu, Waterfall memang metodologi klasik, 
tapi bukan berarti kuno atau buruk.

Waterfall masih widely used untuk project dengan:
- Requirements yang jelas
- Timeline yang fixed
- Dokumentasi yang penting

Contoh: Government projects, banking systems.

Untuk ujian praktik ini, Waterfall adalah 
pilihan yang tepat dan proven."
```

---

**Good luck dengan presentasi metodologi! 🎓**

**Remember:** Confidence is key! 💪
