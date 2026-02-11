# LaVista Parking - API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
Semua endpoint (kecuali login) memerlukan JWT token di header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 1. Authentication Endpoints

### 1.1 Login
**POST** `/auth/login`

Request Body:
```json
{
  "username": "admin",
  "password": "admin123"
}
```

Response:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "user_id": 1,
      "username": "admin",
      "full_name": "Super Administrator",
      "role": "admin",
      "branch_id": null
    }
  }
}
```

### 1.2 Get Profile
**GET** `/auth/profile`

Response:
```json
{
  "success": true,
  "data": {
    "user_id": 1,
    "username": "admin",
    "full_name": "Super Administrator",
    "role": "admin",
    "branch_id": null,
    "branch_name": null
  }
}
```

### 1.3 Logout
**POST** `/auth/logout`

Response:
```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

## 2. User Management Endpoints

### 2.1 Get All Users (Admin Only)
**GET** `/users?search=&role=&branch_id=`

Query Parameters:
- `search` (optional): Search by username or full name
- `role` (optional): Filter by role (admin/petugas/owner)
- `branch_id` (optional): Filter by branch

Response:
```json
{
  "success": true,
  "data": [
    {
      "user_id": 1,
      "username": "admin",
      "full_name": "Super Administrator",
      "role": "admin",
      "branch_id": null,
      "branch_name": null,
      "created_at": "2025-01-01T00:00:00.000Z"
    }
  ]
}
```

### 2.2 Get Users by Branch (Owner Only)
**GET** `/users/branch`

Response: Same as Get All Users

### 2.3 Create User
**POST** `/users`

Request Body:
```json
{
  "username": "petugas6",
  "password": "password123",
  "full_name": "Petugas Baru",
  "role": "petugas",
  "branch_id": 1
}
```

Response:
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "user_id": 10
  }
}
```

### 2.4 Update User
**PUT** `/users/:id`

Request Body:
```json
{
  "username": "petugas6",
  "password": "newpassword123",
  "full_name": "Petugas Updated",
  "role": "petugas",
  "branch_id": 1
}
```

Note: Password is optional. If not provided, password won't be changed.

### 2.5 Delete User
**DELETE** `/users/:id`

Response:
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

---

## 3. Branch Management Endpoints

### 3.1 Get All Branches
**GET** `/branches`

Response:
```json
{
  "success": true,
  "data": [
    {
      "branch_id": 1,
      "branch_name": "Cabang Pusat",
      "address": "Jl. Sudirman No. 123, Jakarta Pusat",
      "phone": "021-1234567",
      "total_areas": 3,
      "total_petugas": 2
    }
  ]
}
```

### 3.2 Get Branch by ID
**GET** `/branches/:id`

### 3.3 Create Branch (Admin Only)
**POST** `/branches`

Request Body:
```json
{
  "branch_name": "Cabang Barat",
  "address": "Jl. Kebon Jeruk No. 100, Jakarta Barat",
  "phone": "021-5555555"
}
```

### 3.4 Update Branch (Admin Only)
**PUT** `/branches/:id`

### 3.5 Delete Branch (Admin Only)
**DELETE** `/branches/:id`

---

## 4. Parking Area Endpoints

### 4.1 Get All Areas
**GET** `/areas?branch_id=`

Query Parameters:
- `branch_id` (optional): Filter by branch

Response:
```json
{
  "success": true,
  "data": [
    {
      "area_id": 1,
      "branch_id": 1,
      "branch_name": "Cabang Pusat",
      "area_name": "Area A - Motor",
      "capacity": 100,
      "current_occupancy": 45
    }
  ]
}
```

### 4.2 Create Area (Admin Only)
**POST** `/areas`

Request Body:
```json
{
  "branch_id": 1,
  "area_name": "Area D - VIP",
  "capacity": 30
}
```

### 4.3 Update Area (Admin Only)
**PUT** `/areas/:id`

### 4.4 Delete Area (Admin Only)
**DELETE** `/areas/:id`

---

## 5. Parking Rate Endpoints

### 5.1 Get All Rates
**GET** `/rates?branch_id=&vehicle_type_id=`

Response:
```json
{
  "success": true,
  "data": [
    {
      "rate_id": 1,
      "branch_id": 1,
      "branch_name": "Cabang Pusat",
      "vehicle_type_id": 1,
      "vehicle_type_name": "Motor",
      "first_hour_rate": 2000,
      "next_hour_rate": 1000,
      "effective_date": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### 5.2 Get Active Rate
**GET** `/rates/active?branch_id=1&vehicle_type_id=1`

Returns the most recent rate for calculation.

### 5.3 Get Vehicle Types
**GET** `/rates/vehicle-types`

Response:
```json
{
  "success": true,
  "data": [
    {
      "vehicle_type_id": 1,
      "vehicle_type_name": "Motor"
    },
    {
      "vehicle_type_id": 2,
      "vehicle_type_name": "Mobil"
    },
    {
      "vehicle_type_id": 3,
      "vehicle_type_name": "Bus/Truk"
    }
  ]
}
```

### 5.4 Create Rate (Admin Only)
**POST** `/rates`

Request Body:
```json
{
  "branch_id": 1,
  "vehicle_type_id": 1,
  "first_hour_rate": 2000,
  "next_hour_rate": 1000,
  "effective_date": "2025-01-01"
}
```

### 5.5 Update Rate (Admin Only)
**PUT** `/rates/:id`

### 5.6 Delete Rate (Admin Only)
**DELETE** `/rates/:id`

---

## 6. Ticket Endpoints (Entry/Exit)

### 6.1 Vehicle Entry (Petugas Only)
**POST** `/tickets/entry`

Request Body:
```json
{
  "license_plate": "B 1234 ABC",
  "vehicle_type_id": 1,
  "area_id": 1
}
```

Response:
```json
{
  "success": true,
  "message": "Ticket created successfully",
  "data": {
    "ticket_id": 1,
    "ticket_number": "TKT-20250211-0001",
    "license_plate": "B 1234 ABC",
    "vehicle_type_id": 1,
    "vehicle_type_name": "Motor",
    "area_id": 1,
    "area_name": "Area A - Motor",
    "branch_name": "Cabang Pusat",
    "entry_time": "2025-02-11T10:00:00.000Z",
    "entry_user_id": 5
  }
}
```

### 6.2 Search Ticket for Exit (Petugas Only)
**GET** `/tickets/search?ticket_number=TKT-20250211-0001`

OR

**GET** `/tickets/search?license_plate=B1234ABC`

Response:
```json
{
  "success": true,
  "data": {
    "ticket_id": 1,
    "ticket_number": "TKT-20250211-0001",
    "license_plate": "B 1234 ABC",
    "vehicle_type_id": 1,
    "vehicle_type_name": "Motor",
    "area_id": 1,
    "area_name": "Area A - Motor",
    "branch_id": 1,
    "branch_name": "Cabang Pusat",
    "entry_time": "2025-02-11T10:00:00.000Z",
    "calculated_amount": 3000,
    "first_hour_rate": 2000,
    "next_hour_rate": 1000
  }
}
```

### 6.3 Vehicle Exit & Payment (Petugas Only)
**POST** `/tickets/exit`

Request Body:
```json
{
  "ticket_id": 1,
  "payment_method": "cash"
}
```

Payment methods: `cash` or `qris`

Response:
```json
{
  "success": true,
  "message": "Exit processed successfully",
  "data": {
    "payment_id": 1,
    "ticket_number": "TKT-20250211-0001",
    "license_plate": "B 1234 ABC",
    "entry_time": "2025-02-11T10:00:00.000Z",
    "exit_time": "2025-02-11T13:00:00.000Z",
    "amount": 3000,
    "payment_method": "cash",
    "payment_status": "paid"
  }
}
```

### 6.4 Get Active Tickets
**GET** `/tickets/active?branch_id=`

Returns all tickets that haven't exited yet.

---

## 7. Payment Endpoints

### 7.1 Get All Payments (History)
**GET** `/payments?search=&payment_method=&payment_status=&branch_id=&start_date=&end_date=`

Query Parameters:
- `search`: Search by ticket number or license plate
- `payment_method`: Filter by cash/qris
- `payment_status`: Filter by paid/pending/failed
- `branch_id`: Filter by branch
- `start_date`: Filter from date (YYYY-MM-DD)
- `end_date`: Filter to date (YYYY-MM-DD)

Response:
```json
{
  "success": true,
  "data": [
    {
      "payment_id": 1,
      "ticket_id": 1,
      "ticket_number": "TKT-20250211-0001",
      "license_plate": "B 1234 ABC",
      "vehicle_type_name": "Motor",
      "entry_time": "2025-02-11T10:00:00.000Z",
      "exit_time": "2025-02-11T13:00:00.000Z",
      "amount": 3000,
      "payment_method": "cash",
      "payment_status": "paid",
      "payment_time": "2025-02-11T13:00:00.000Z",
      "area_name": "Area A - Motor",
      "branch_id": 1,
      "branch_name": "Cabang Pusat",
      "officer_name": "Petugas Shift Pagi"
    }
  ]
}
```

### 7.2 Get Payment by ID
**GET** `/payments/:id`

### 7.3 Update Payment Status (Petugas/Admin)
**PUT** `/payments/:id/status`

Request Body:
```json
{
  "payment_status": "paid"
}
```

Status options: `paid` or `failed`

### 7.4 Get Payment Statistics
**GET** `/payments/stats?branch_id=&start_date=&end_date=`

Response:
```json
{
  "success": true,
  "data": {
    "total_revenue": 150000,
    "revenue_by_method": [
      {
        "payment_method": "cash",
        "total": 100000
      },
      {
        "payment_method": "qris",
        "total": 50000
      }
    ],
    "revenue_by_vehicle": [
      {
        "vehicle_type_name": "Motor",
        "total": 50000,
        "count": 25
      },
      {
        "vehicle_type_name": "Mobil",
        "total": 100000,
        "count": 20
      }
    ],
    "transactions_by_status": [
      {
        "payment_status": "paid",
        "count": 45
      },
      {
        "payment_status": "pending",
        "count": 3
      }
    ]
  }
}
```

### 7.5 Get Daily Revenue
**GET** `/payments/daily-revenue?branch_id=&days=7`

Response:
```json
{
  "success": true,
  "data": [
    {
      "date": "2025-02-11",
      "revenue": 50000,
      "transactions": 15
    },
    {
      "date": "2025-02-10",
      "revenue": 45000,
      "transactions": 12
    }
  ]
}
```

---

## 8. Activity Log Endpoints (Admin Only)

### 8.1 Get All Logs
**GET** `/logs?search=&action=&user_id=&start_date=&end_date=`

Response:
```json
{
  "success": true,
  "data": [
    {
      "log_id": 1,
      "user_id": 1,
      "username": "admin",
      "full_name": "Super Administrator",
      "role": "admin",
      "action": "login",
      "description": "User admin logged in",
      "timestamp": "2025-02-11T08:00:00.000Z"
    }
  ]
}
```

### 8.2 Get Log by ID
**GET** `/logs/:id`

---

## 9. Dashboard Endpoints

### 9.1 Get Dashboard Statistics
**GET** `/dashboard/stats?branch_id=`

Query Parameters:
- `branch_id` (optional): Filter by branch (Admin only)
- For Owner/Petugas: automatically filtered by their branch

Response:
```json
{
  "success": true,
  "data": {
    "current_vehicles": 45,
    "today_revenue": 150000,
    "today_transactions": 30,
    "total_capacity": 170,
    "current_occupancy": 45,
    "occupancy_percentage": "26.5",
    "recent_transactions": [...],
    "vehicle_breakdown": [
      {
        "vehicle_type_name": "Motor",
        "count": 30
      },
      {
        "vehicle_type_name": "Mobil",
        "count": 15
      }
    ],
    "monthly_revenue": [
      {
        "month": "2025-02",
        "revenue": 500000
      },
      {
        "month": "2025-01",
        "revenue": 450000
      }
    ]
  }
}
```

### 9.2 Get Branch Comparison (Admin Only)
**GET** `/dashboard/branch-comparison`

Response:
```json
{
  "success": true,
  "data": [
    {
      "branch_id": 1,
      "branch_name": "Cabang Pusat",
      "current_vehicles": 45,
      "today_revenue": 150000,
      "month_revenue": 500000
    },
    {
      "branch_id": 2,
      "branch_name": "Cabang Utara",
      "current_vehicles": 32,
      "today_revenue": 120000,
      "month_revenue": 450000
    }
  ]
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation error message"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Access denied. No token provided."
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Access forbidden. Insufficient permissions."
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Server error"
}
```

---

## Role-Based Access Control

### Admin
- Full access to all endpoints
- Can manage users, branches, areas, rates
- Can view all logs and statistics

### Owner
- Can view their branch data
- Can manage petugas in their branch
- Can view payments and statistics for their branch

### Petugas
- Can process vehicle entry/exit
- Can view payments
- Can update QRIS payment status
- Limited to their branch

---

## Testing with Postman/Thunder Client

1. Login to get token
2. Copy the token
3. Add to Authorization header: `Bearer <token>`
4. Test other endpoints

Example using curl:

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Get users (with token)
curl -X GET http://localhost:5000/api/users \
  -H "Authorization: Bearer <your_token>"
```
