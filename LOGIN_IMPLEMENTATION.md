# Implementasi Login dengan Axios - Best Practice

## 🎯 Overview
Implementasi login yang menggunakan axios dengan best practice, termasuk:
- Service layer untuk API calls
- Custom hook untuk state management
- Error handling yang proper
- Loading states
- Form validation

## 📁 File Structure

```
src/
├── services/
│   └── api.js              # Konfigurasi axios dan auth service
├── hooks/
│   └── useAuth.js          # Custom hook untuk authentication
├── components/
│   └── Button.jsx          # Komponen button dengan loading state
└── app/login/
    └── page.js             # Halaman login yang diupdate
```

## 🚀 Fitur yang Diimplementasikan

### 1. Service Layer (`src/services/api.js`)
- ✅ Konfigurasi axios dengan base URL
- ✅ Request/Response interceptors
- ✅ Automatic token handling
- ✅ Error handling untuk 401 unauthorized
- ✅ Auth service dengan methods: login, logout, getCurrentUser

### 2. Custom Hook (`src/hooks/useAuth.js`)
- ✅ State management untuk user, loading, error
- ✅ Login function dengan proper error handling
- ✅ Logout function
- ✅ Check authentication status
- ✅ Automatic token storage di localStorage

### 3. Komponen Button (`src/components/Button.jsx`)
- ✅ Loading state dengan spinner
- ✅ Disabled state
- ✅ Animation dengan framer-motion
- ✅ Proper accessibility

### 4. Halaman Login (`src/app/login/page.js`)
- ✅ Form validation
- ✅ Error display
- ✅ Loading states
- ✅ Keyboard support (Enter key)
- ✅ Automatic redirect setelah login
- ✅ Disabled inputs saat loading

## 🛠️ Cara Penggunaan

### 1. Setup Environment
Buat file `.env.local` di root project:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### 2. API Endpoint yang Diharapkan
Backend harus menyediakan endpoint:
```javascript
POST /api/auth/login
Body: { 
  username: string, 
  password: string 
}
Response: { 
  token: string, 
  user: object 
}
```

### 3. Menggunakan di Komponen Lain
```javascript
import { useAuth } from '@/hooks/useAuth';

function MyComponent() {
  const { user, login, logout, isAuthenticated } = useAuth();
  
  // Gunakan sesuai kebutuhan
}
```

## 🎨 Best Practices yang Diterapkan

1. **Separation of Concerns**: Service layer terpisah dari UI
2. **Error Handling**: Proper error handling di semua level
3. **Loading States**: User feedback saat proses async
4. **Form Validation**: Client-side validation
5. **Security**: Token management yang proper
6. **Accessibility**: Proper ARIA labels dan keyboard support
7. **Performance**: Memoization dengan useCallback
8. **Type Safety**: Proper prop validation

## 🔒 Error Handling

- Network errors ditangani di service layer
- Authentication errors (401) otomatis redirect ke login
- Form validation errors ditampilkan ke user
- Loading states mencegah multiple submissions

## 🛡️ Security Considerations

- Token disimpan di localStorage (bisa diubah ke httpOnly cookies)
- Automatic token cleanup saat expired
- Proper CORS handling di backend
- Input validation di client dan server

## 🧪 Testing

Untuk testing, pastikan:
1. Backend API berjalan di port yang sesuai
2. Environment variables sudah diset
3. CORS sudah dikonfigurasi di backend
4. Database connection sudah siap

## 📝 Contoh Response API

### Success Response:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

### Error Response:
```json
{
  "success": false,
  "message": "Username atau password salah"
}
```

## 🔄 Flow Login

1. User mengisi form username dan password
2. Validasi client-side (tidak boleh kosong)
3. Klik tombol login atau tekan Enter
4. Loading state ditampilkan
5. Request dikirim ke API
6. Response diproses:
   - Success: Token disimpan, user di-redirect
   - Error: Pesan error ditampilkan
7. Form di-reset jika berhasil

## 🎯 Keunggulan Implementasi

- **Modular**: Mudah di-maintain dan di-scale
- **Reusable**: Hook dan service bisa digunakan di komponen lain
- **User-friendly**: Loading states dan error handling yang baik
- **Secure**: Proper token management
- **Accessible**: Keyboard support dan ARIA labels
- **Performance**: Optimized dengan memoization 