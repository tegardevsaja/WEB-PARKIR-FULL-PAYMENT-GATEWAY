# ⚡ QUICK IMPLEMENTATION GUIDE

Panduan cepat untuk mulai coding aplikasi parkir dengan desain yang sudah disederhanakan.

---

## 🎯 FORM INPUT KENDARAAN MASUK

### Frontend (Next.js/React)

```tsx
// components/VehicleEntryForm.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';

interface EntryForm {
  licensePlate: string;
  vehicleTypeId: number;
}

export default function VehicleEntryForm() {
  const { register, handleSubmit, reset } = useForm<EntryForm>();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: EntryForm) => {
    setLoading(true);
    try {
      // Auto-uppercase plat nomor
      const payload = {
        licensePlate: data.licensePlate.toUpperCase(),
        vehicleTypeId: data.vehicleTypeId,
      };

      const response = await fetch('/api/transactions/entry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const result = await response.json();
        // Print ticket
        printTicket(result.ticketNumber);
        // Auto-clear form untuk kendaraan berikutnya
        reset();
        // Sound notification
        playSuccessSound();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Plat Nomor - Auto focus */}
      <div>
        <label>Plat Nomor</label>
        <input
          {...register('licensePlate', { 
            required: true, 
            minLength: 5 
          })}
          type="text"
          placeholder="B 1234 ABC"
          autoFocus
          className="uppercase"
        />
      </div>

      {/* Jenis Kendaraan - 3 tombol besar */}
      <div className="grid grid-cols-3 gap-4">
        <button
          type="button"
          onClick={() => handleSubmit({ vehicleTypeId: 1 })}
          className="btn-vehicle"
        >
          🏍️ MOTOR (F1)
        </button>
        <button
          type="button"
          onClick={() => handleSubmit({ vehicleTypeId: 2 })}
          className="btn-vehicle"
        >
          🚗 MOBIL (F2)
        </button>
        <button
          type="button"
          onClick={() => handleSubmit({ vehicleTypeId: 3 })}
          className="btn-vehicle"
        >
          🚚 BUS/TRUK (F3)
        </button>
      </div>

      {/* Atau dropdown tradisional */}
      <select {...register('vehicleTypeId', { required: true })}>
        <option value="">Pilih Jenis</option>
        <option value="1">Motor</option>
        <option value="2">Mobil</option>
        <option value="3">Bus/Truk</option>
      </select>

      <button type="submit" disabled={loading}>
        {loading ? 'Processing...' : 'PROSES MASUK (Enter)'}
      </button>
    </form>
  );
}
```

### Keyboard Shortcuts

```tsx
// hooks/useKeyboardShortcuts.ts
import { useEffect } from 'react';

export function useVehicleEntryShortcuts(onSelectType: (typeId: number) => void) {
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'F1') {
        e.preventDefault();
        onSelectType(1); // Motor
      } else if (e.key === 'F2') {
        e.preventDefault();
        onSelectType(2); // Mobil
      } else if (e.key === 'F3') {
        e.preventDefault();
        onSelectType(3); // Bus/Truk
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [onSelectType]);
}
```

---

## 🔧 BACKEND API

### Entry Endpoint

```typescript
// app/api/transactions/entry/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { licensePlate, vehicleTypeId } = await req.json();

    // 1. Validasi input
    if (!licensePlate || !vehicleTypeId) {
      return NextResponse.json(
        { error: 'Plat nomor dan jenis kendaraan wajib diisi' },
        { status: 400 }
      );
    }

    // 2. Check slot tersedia
    const [slots] = await db.query(`
      SELECT area_id, capacity, current_occupancy
      FROM parking_areas
      WHERE branch_id = ? AND current_occupancy < capacity
      LIMIT 1
    `, [req.user.branchId]);

    if (!slots.length) {
      return NextResponse.json(
        { error: 'Parkir penuh' },
        { status: 400 }
      );
    }

    const areaId = slots[0].area_id;

    // 3. Check/Register vehicle
    let [vehicle] = await db.query(`
      SELECT vehicle_id FROM vehicles WHERE license_plate = ?
    `, [licensePlate]);

    if (!vehicle.length) {
      // Auto-register kendaraan baru
      const [result] = await db.query(`
        INSERT INTO vehicles (license_plate, vehicle_type_id)
        VALUES (?, ?)
      `, [licensePlate, vehicleTypeId]);
      
      vehicle = [{ vehicle_id: result.insertId }];
    }

    const vehicleId = vehicle[0].vehicle_id;

    // 4. Generate ticket number
    const ticketNumber = generateTicketNumber();

    // 5. Insert transaction
    await db.query(`
      INSERT INTO transactions 
      (ticket_number, vehicle_id, area_id, entry_time, officer_id, payment_status)
      VALUES (?, ?, ?, NOW(), ?, 'pending')
    `, [ticketNumber, vehicleId, areaId, req.user.userId]);

    // 6. Update occupancy
    await db.query(`
      UPDATE parking_areas 
      SET current_occupancy = current_occupancy + 1
      WHERE area_id = ?
    `, [areaId]);

    // 7. Log activity
    await db.query(`
      INSERT INTO activity_logs (user_id, action, description)
      VALUES (?, 'VEHICLE_ENTRY', ?)
    `, [req.user.userId, `Kendaraan ${licensePlate} masuk`]);

    return NextResponse.json({
      success: true,
      ticketNumber,
      licensePlate,
      entryTime: new Date(),
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function generateTicketNumber(): string {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `TKT-${dateStr}-${random}`;
}
```

---

## 📊 SQL QUERIES PENTING

### Check Slot Tersedia

```sql
-- Quick check
SELECT 
  area_name,
  capacity,
  current_occupancy,
  (capacity - current_occupancy) AS available_slots
FROM parking_areas
WHERE branch_id = ? 
  AND current_occupancy < capacity;
```

### Insert Kendaraan Baru (Simplified)

```sql
-- Hanya 2 field wajib
INSERT INTO vehicles (license_plate, vehicle_type_id)
VALUES (?, ?);

-- Color dan brand NULL (optional)
```

### Get Active Transactions

```sql
SELECT 
  t.ticket_number,
  v.license_plate,
  vt.type_name,
  t.entry_time,
  TIMESTAMPDIFF(HOUR, t.entry_time, NOW()) AS hours_parked
FROM transactions t
JOIN vehicles v ON t.vehicle_id = v.vehicle_id
JOIN vehicle_types vt ON v.vehicle_type_id = vt.vehicle_type_id
WHERE t.payment_status = 'pending'
ORDER BY t.entry_time DESC;
```

---

## 🎨 UI/UX BEST PRACTICES

### 1. Auto-Focus
```tsx
// Form auto-focus ke plat nomor setelah submit
useEffect(() => {
  if (submitSuccess) {
    inputRef.current?.focus();
  }
}, [submitSuccess]);
```

### 2. Visual Feedback
```tsx
// Success animation
const [showSuccess, setShowSuccess] = useState(false);

if (response.ok) {
  setShowSuccess(true);
  setTimeout(() => setShowSuccess(false), 2000);
}

{showSuccess && (
  <div className="success-toast">
    ✅ Kendaraan berhasil masuk!
  </div>
)}
```

### 3. Sound Notification
```tsx
// Play beep on success
const playSuccessSound = () => {
  const audio = new Audio('/sounds/success.mp3');
  audio.play();
};
```

### 4. Real-time Slot Counter
```tsx
// WebSocket atau polling
const [availableSlots, setAvailableSlots] = useState(0);

useEffect(() => {
  const interval = setInterval(async () => {
    const response = await fetch('/api/parking-areas/availability');
    const data = await response.json();
    setAvailableSlots(data.available);
  }, 5000); // Update setiap 5 detik

  return () => clearInterval(interval);
}, []);

<div className="slot-counter">
  Slot Tersedia: {availableSlots}/100
</div>
```

---

## 🧪 TESTING

### Unit Test - Entry Logic

```typescript
// __tests__/entry.test.ts
import { POST } from '@/app/api/transactions/entry/route';

describe('Vehicle Entry', () => {
  it('should accept valid entry', async () => {
    const req = new Request('http://localhost/api/transactions/entry', {
      method: 'POST',
      body: JSON.stringify({
        licensePlate: 'B 1234 ABC',
        vehicleTypeId: 1,
      }),
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.ticketNumber).toMatch(/^TKT-\d{8}-\d{4}$/);
  });

  it('should reject when parking full', async () => {
    // Mock full parking
    jest.spyOn(db, 'query').mockResolvedValueOnce([[]]);

    const req = new Request('http://localhost/api/transactions/entry', {
      method: 'POST',
      body: JSON.stringify({
        licensePlate: 'B 5678 XYZ',
        vehicleTypeId: 2,
      }),
    });

    const response = await POST(req);
    expect(response.status).toBe(400);
  });
});
```

---

## 📱 MOBILE-FRIENDLY (Bonus)

Jika ingin support tablet untuk petugas:

```tsx
// Responsive design
<div className="entry-form">
  {/* Mobile: Stack vertical */}
  <div className="md:grid md:grid-cols-3 space-y-4 md:space-y-0">
    <button className="w-full h-24 text-2xl">
      🏍️ MOTOR
    </button>
    <button className="w-full h-24 text-2xl">
      🚗 MOBIL
    </button>
    <button className="w-full h-24 text-2xl">
      🚚 BUS
    </button>
  </div>
</div>
```

---

## ✅ CHECKLIST IMPLEMENTASI

- [ ] Setup database dengan schema yang sudah disederhanakan
- [ ] Buat API endpoint `/api/transactions/entry`
- [ ] Buat form dengan 2 field (plat + jenis)
- [ ] Implement auto-uppercase untuk plat nomor
- [ ] Implement keyboard shortcuts (F1/F2/F3)
- [ ] Auto-focus ke input setelah submit
- [ ] Visual feedback (success toast)
- [ ] Sound notification
- [ ] Real-time slot counter
- [ ] Print ticket functionality
- [ ] Error handling yang user-friendly
- [ ] Loading state saat processing
- [ ] Unit tests untuk business logic
- [ ] Integration tests untuk API

---

## 🚀 NEXT STEPS

1. Implement exit flow (scan ticket → calculate → payment)
2. Add QRIS integration (Midtrans)
3. Build admin dashboard (CRUD master data)
4. Build owner dashboard (statistics & reports)
5. Add activity logging
6. Performance optimization
7. Security hardening
8. User acceptance testing

**Remember:** Start simple, iterate fast! 🎯
