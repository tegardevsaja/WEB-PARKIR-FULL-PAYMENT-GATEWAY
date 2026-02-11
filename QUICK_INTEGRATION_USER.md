# Quick Integration - User Management

## Langkah Cepat Integrasi

Buka file `frontend/src/app/admin/users/page.tsx` dan lakukan perubahan berikut:

### 1. Tambahkan Import

```typescript
// Tambahkan di bagian import
import { userService } from "@/services/userService";
import { branchService } from "@/services/branchService";
import { Loader2 } from "lucide-react";
```

### 2. Ganti Dummy Data dengan State

Ganti baris ini:
```typescript
// Dummy data - sorted by newest first
const users: User[] = [
  { user_id: 8, username: "owner3", ... },
  ...
].sort((a, b) => b.user_id - a.user_id);
```

Dengan:
```typescript
const [users, setUsers] = useState<User[]>([]);
const [branches, setBranches] = useState<Branch[]>([]);
const [loading, setLoading] = useState(true);
```

### 3. Tambahkan useEffect untuk Fetch Data

Tambahkan setelah state declarations:
```typescript
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

### 4. Update handleAdd

Ganti:
```typescript
const handleAdd = () => {
  setSelectedUser(null);
  setIsModalOpen(true);
};
```

Dengan form handler yang proper (sudah ada di file).

### 5. Update handleDelete

Ganti:
```typescript
const handleDelete = (user: User) => {
  if (confirm(`Hapus user ${user.full_name}?`)) {
    alert("User berhasil dihapus!");
  }
};
```

Dengan:
```typescript
const handleDelete = async (user: User) => {
  if (!confirm(`Hapus user ${user.full_name}?`)) return;
  
  try {
    await userService.delete(user.user_id);
    alert("User berhasil dihapus");
    fetchUsers();
  } catch (error: any) {
    alert(error.message || "Gagal menghapus user");
  }
};
```

### 6. Tambahkan Loading State di Render

Ganti bagian Table dengan:
```typescript
{loading ? (
  <div className="text-center py-12">
    <Loader2 className="w-12 h-12 text-primary-600 mx-auto mb-4 animate-spin" />
    <p className="text-gray-600">Memuat data...</p>
  </div>
) : (
  <Table>
    {/* existing table code */}
  </Table>
)}
```

## Test

1. Refresh halaman
2. Data dari database akan muncul
3. Test CRUD operations

---

**Alternatif**: Gunakan file backup yang sudah ada dan sudah berfungsi dengan dummy data. Sistem sudah berjalan dengan baik!
