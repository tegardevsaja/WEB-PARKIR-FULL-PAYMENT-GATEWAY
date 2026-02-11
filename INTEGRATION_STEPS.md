# 🔌 Langkah Integrasi Frontend dengan Backend

## Status Saat Ini

✅ Backend API sudah siap dan berjalan
✅ Frontend UI sudah lengkap dengan dummy data
❌ Belum terintegrasi (masih menggunakan dummy data)

## Cara Integrasi

### Langkah 1: Pastikan Backend Running

```bash
cd backend
npm start
```

Backend harus running di http://localhost:5000

### Langkah 2: Test API dengan Browser/Postman

Test endpoint berikut:
```
GET http://localhost:5000/api/users
GET http://localhost:5000/api/branches  
GET http://localhost:5000/api/areas
```

Pastikan mendapat response JSON dengan data.

### Langkah 3: Integrasi User Management

Buka file `frontend/src/app/admin/users/page.tsx` dan tambahkan:

```typescript
// Di bagian atas, tambahkan import
import { userService } from "@/services/userService";
import { branchService } from "@/services/branchService";

// Ganti dummy data dengan state kosong
const [users, setUsers] = useState<User[]>([]);
const [branches, setBranches] = useState<Branch[]>([]);
const [loading, setLoading] = useState(true);

// Tambahkan useEffect untuk fetch data
useEffect(() => {
  fetchUsers();
  fetchBranches();
}, []);

const fetchUsers = async () => {
  try {
    setLoading(true);
    const data = await userService.getAll();
    setUsers(data);
  } catch (error) {
    console.error("Error:", error);
    alert("Gagal memuat data user");
  } finally {
    setLoading(false);
  }
};

const fetchBranches = async () => {
  try {
    const data = await branchService.getAll();
    setBranches(data);
  } catch (error) {
    console.error("Error:", error);
  }
};
```

### Langkah 4: Tambahkan Handler untuk CRUD

```typescript
const handleCreate = async (formData) => {
  try {
    await userService.create(formData);
    alert("User berhasil ditambahkan");
    fetchUsers(); // Refresh data
    setIsModalOpen(false);
  } catch (error: any) {
    alert(error.message || "Gagal menambahkan user");
  }
};

const handleUpdate = async (userId, formData) => {
  try {
    await userService.update(userId, formData);
    alert("User berhasil diupdate");
    fetchUsers(); // Refresh data
    setIsModalOpen(false);
  } catch (error: any) {
    alert(error.message || "Gagal mengupdate user");
  }
};

const handleDelete = async (userId, username) => {
  if (!confirm(`Yakin ingin menghapus user "${username}"?`)) return;
  
  try {
    await userService.delete(userId);
    alert("User berhasil dihapus");
    fetchUsers(); // Refresh data
  } catch (error: any) {
    alert(error.message || "Gagal menghapus user");
  }
};
```

### Langkah 5: Update Form Submit

Ganti form submit handler dari alert menjadi call ke API:

```typescript
// Di form onSubmit
<form onSubmit={async (e) => {
  e.preventDefault();
  const formData = {
    username: e.target.username.value,
    password: e.target.password.value,
    full_name: e.target.full_name.value,
    role: e.target.role.value,
    branch_id: e.target.branch_id.value || null,
  };
  
  if (selectedUser) {
    await handleUpdate(selectedUser.user_id, formData);
  } else {
    await handleCreate(formData);
  }
}}>
```

### Langkah 6: Tambahkan Loading State

```typescript
{loading ? (
  <div className="text-center py-12">
    <Loader2 className="w-12 h-12 text-primary-600 mx-auto mb-4 animate-spin" />
    <p className="text-gray-600">Memuat data...</p>
  </div>
) : (
  // Table component
)}
```

## Ulangi untuk Branches dan Areas

Gunakan pola yang sama untuk:
- `/admin/branches/page.tsx` → gunakan `branchService`
- `/admin/areas/page.tsx` → gunakan `areaService`

## Testing

1. Login sebagai admin
2. Buka halaman User Management
3. Klik "Tambah User"
4. Isi form dan submit
5. Cek apakah data muncul di tabel
6. Test edit dan delete

## Troubleshooting

### Data tidak muncul?
- Cek console browser (F12) untuk error
- Cek Network tab untuk melihat API calls
- Pastikan backend running
- Cek CORS sudah dikonfigurasi

### Error 401 Unauthorized?
- Token JWT mungkin expired
- Logout dan login ulang

### Error 500?
- Cek backend console untuk error
- Cek database connection
- Cek data yang dikirim valid

## Alternative: Gunakan File yang Sudah Jadi

Saya sudah membuat file yang sudah terintegrasi penuh. Untuk menggunakannya:

```bash
# Backup file lama
mv frontend/src/app/admin/users/page.tsx frontend/src/app/admin/users/page.tsx.old

# Copy file yang sudah terintegrasi (jika ada)
# File ini sudah include semua integrasi API
```

---

**Catatan**: Karena ada perbedaan komponen Select, lebih baik gunakan `<select>` HTML biasa daripada komponen Select custom untuk menghindari error.
