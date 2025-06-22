# 🚀 **Dokumentasi Final & Panduan Aplikasi**

## 🎯 **Gambaran Umum**
Aplikasi ini telah mencapai tahap final dengan fungsionalitas penuh untuk pengguna dan admin. Dokumen ini merangkum semua fitur utama, arsitektur, dan best practice yang telah diterapkan, serta panduan untuk pengembangan lebih lanjut.

---

## ✨ **Fitur Unggulan**

### Untuk Pengguna:
- **Registrasi & Login**: Alur otentikasi yang aman.
- **Menu Produk**: Tampilan produk yang interaktif dengan filter kategori.
- **Keranjang Belanja**: Manajemen keranjang yang persisten menggunakan `localStorage`.
- **Proses Checkout**: Alur checkout yang aman, mewajibkan login dan upload bukti transfer.
- **Halaman Sukses**: Konfirmasi instan setelah pesanan berhasil dibuat.
- **Riwayat Pesanan**: (Konsep) Pengguna dapat melihat riwayat pesanan mereka (dapat dikembangkan di `/profile/orders`).

### Untuk Admin:
- **Dashboard Admin**: Panel khusus di `/admin` untuk manajemen.
- **Manajemen Pesanan**: Admin dapat melihat semua pesanan, memfilternya berdasarkan status, dan melihat detailnya.
- **Persetujuan Pembayaran**: Admin dapat **melihat bukti transfer** dan **menyetujui** atau **menolak** pesanan.
- **Penyesuaian Stok Otomatis**: Stok produk otomatis dikembalikan jika pesanan ditolak.
- **Keamanan Rute**: Halaman admin dilindungi oleh middleware, hanya bisa diakses oleh role `admin`.

---

## 🏛️ **Arsitektur & Teknologi**

- **Framework**: Next.js (App Router)
- **Database**: MySQL dengan Prisma ORM
- **Styling**: Tailwind CSS & Bootstrap
- **Manajemen Form**: React Hook Form & Zod
- **Animasi**: Framer Motion
- **Notifikasi**: React Hot Toast
- **Otentikasi**: JWT (JSON Web Tokens) disimpan dalam Cookies.
- **File Upload**: Ditangani oleh `formidable` di backend.

---

## 📁 **Struktur Proyek**

```
src/
├── app/
│   ├── (public)/
│   │   ├── menu/
│   │   ├── cart/
│   │   └── ...
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   ├── (protected)/
│   │   ├── admin/
│   │   │   ├── orders/
│   │   │   └── layout.js
│   │   ├── checkout/
│   │   └── profile/
│   ├── api/
│   │   ├── auth/
│   │   ├── admin/
│   │   └── ...
│   └── layout.js
├── components/
│   ├── admin/
│   │   ├── OrderTable.jsx
│   │   └── OrderDetailModal.jsx
│   └── ...
├── hooks/
│   ├── useAuth.js
│   └── useCart.js
├── lib/
│   └── auth.js
├── services/
│   └── api.js
└── middleware.js
```

---

## 🛠️ **Alur Kerja Kritis**

### 1. **Alur Checkout & Approval**
1.  **User**: Melakukan checkout dan mengunggah bukti transfer.
2.  **Sistem**: Membuat pesanan dengan status `PENDING` dan menyimpan bukti transfer.
3.  **Admin**: Masuk ke Dashboard -> Manajemen Pesanan.
4.  **Admin**: Membuka detail pesanan `PENDING`, memeriksa bukti transfer.
5.  **Admin**: Menekan "Setujui" atau "Tolak".
    - **Disetujui**: Status pesanan berubah menjadi `APPROVED`.
    - **Ditolak**: Status berubah menjadi `REJECTED`, dan stok produk dikembalikan ke sistem secara otomatis.

### 2. **Keamanan Rute (Middleware)**
1.  Setiap request ke rute yang dilindungi (misal, `/admin/orders`) akan dicegat oleh `middleware.js`.
2.  Middleware memeriksa keberadaan dan validitas `token` JWT di cookie.
3.  Jika token valid, ia memeriksa `role` pengguna.
4.  Jika `role` tidak sesuai (misal, `user` mencoba mengakses `/admin`), pengguna akan diarahkan ke halaman "Unauthorized" atau halaman login.

---

## 🧪 **Unit Testing (Setup Awal)**

Meskipun belum diimplementasikan sepenuhnya, fondasi untuk unit testing dapat ditambahkan:

1.  **Install Dependencies**:
    ```bash
    npm install --save-dev jest @testing-library/react @testing-library/jest-dom jest-environment-jsdom
    ```
2.  **Konfigurasi Jest**: Buat file `jest.config.js` dan `jest.setup.js`.
3.  **Contoh Test Komponen**:
    ```jsx
    // __tests__/Button.test.jsx
    import { render, screen } from '@testing-library/react';
    import Button from '../src/components/Button';

    it('renders a button', () => {
      render(<Button text="Click Me" />);
      const button = screen.getByText('Click Me');
      expect(button).toBeInTheDocument();
    });
    ```

---

## ✨ **Penyempurnaan & Langkah Selanjutnya**

- **Dashboard Statistik**: Tambahkan grafik dan statistik penjualan di halaman utama dashboard admin.
- **Manajemen Produk & Pengguna**: Buat halaman di dashboard admin untuk CRUD (Create, Read, Update, Delete) produk dan pengguna.
- **Riwayat Pesanan Pengguna**: Implementasikan UI untuk halaman `/profile/orders`.
- **Notifikasi Real-time**: Gunakan WebSockets (misalnya dengan Socket.IO) untuk notifikasi pesanan baru secara real-time bagi admin.
- **Deployment**: Siapkan aplikasi untuk production build (`npm run build`) dan hosting di platform seperti Vercel atau Netlify.

Aplikasi ini sekarang berada dalam kondisi yang sangat solid, fungsional, dan mengikuti praktik terbaik pengembangan modern. 

# Toko Tani - E-commerce Platform Guide

## Overview
Toko Tani adalah platform e-commerce lengkap yang menghubungkan petani (supplier) dengan pembeli. Aplikasi ini memiliki dua role utama: **User (Petani)** dan **Admin**, masing-masing dengan dashboard dan fitur yang berbeda.

## 🏗️ Architecture & Tech Stack

### Frontend
- **Next.js 15** dengan App Router
- **React 18** dengan hooks dan functional components
- **Tailwind CSS** untuk styling
- **Framer Motion** untuk animasi
- **React Hook Form** + **Zod** untuk validasi form
- **Tabler Icons** untuk iconography

### Backend
- **Next.js API Routes** untuk backend
- **Prisma ORM** untuk database management
- **MySQL** sebagai database
- **JWT** untuk authentication
- **bcryptjs** untuk password hashing
- **Formidable** untuk file upload

### Database Schema
- **User**: Petani dan admin
- **Product**: Produk pertanian
- **Category**: Kategori produk
- **Cart**: Keranjang belanja
- **Checkout**: Proses checkout dengan status
- **Transaction**: Transaksi pembayaran

## 🔐 Authentication & Authorization

### Login Flow
1. User mengakses `/login`
2. Input username dan password
3. Backend memverifikasi credentials
4. JWT token dibuat dan disimpan di localStorage + cookie
5. User diarahkan ke dashboard sesuai role:
   - **Admin** → `/admin/dashboard`
   - **User** → `/user/dashboard`

### Role-Based Access Control
- **Admin**: Akses penuh ke semua fitur admin
- **User**: Akses terbatas ke fitur petani
- **Middleware** melindungi route berdasarkan role

### Protected Routes
- `/admin/*` - Hanya untuk admin
- `/user/*` - Hanya untuk user
- `/dashboard` - Redirect berdasarkan role
- `/checkout` - Hanya untuk user yang login

## 📊 Dashboard System

### User Dashboard (`/user/dashboard`)
**Fitur untuk Petani:**
- Statistik produk dan penjualan
- Manajemen produk (tambah, edit, hapus)
- Monitoring pesanan (pending, selesai)
- Akses ke toko publik

**Statistik yang Ditampilkan:**
- Total produk yang dimiliki
- Total penjualan
- Pesanan pending
- Pesanan selesai

### Admin Dashboard (`/admin/dashboard`)
**Fitur untuk Admin:**
- Overview sistem keseluruhan
- Manajemen pesanan (approve/reject)
- Manajemen produk dan kategori
- Laporan penjualan dan user

**Statistik yang Ditampilkan:**
- Total users (petani)
- Total produk
- Total pesanan
- Total revenue
- Pesanan pending
- Pesanan selesai

## 🛒 E-commerce Flow

### Customer Journey
1. **Browse Products** (`/menu`)
   - Lihat produk tanpa login
   - Filter berdasarkan kategori
   - Tambah ke keranjang

2. **Shopping Cart** (`/cart`)
   - Review produk yang dipilih
   - Update quantity
   - Lihat total harga

3. **Checkout** (`/checkout`)
   - Login required
   - Upload bukti pembayaran
   - Konfirmasi pesanan

4. **Order Success** (`/order-success`)
   - Konfirmasi pesanan berhasil
   - Menunggu approval admin

### Admin Order Management
1. **View Orders** (`/admin/orders`)
   - Lihat semua pesanan
   - Filter berdasarkan status

2. **Order Details**
   - Lihat detail customer
   - Lihat produk yang dipesan
   - Lihat bukti pembayaran

3. **Approve/Reject**
   - Approve: Stock berkurang, status jadi PAID
   - Reject: Stock kembali, status jadi REJECTED

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - Login user
- `POST /api/auth/register` - Register user baru

### Public APIs
- `GET /api/public/stock` - Get semua produk (public)

### User APIs
- `GET /api/user/stats` - Get statistik user dashboard
- `GET /api/user/products` - Get produk user
- `POST /api/user/products` - Tambah produk baru

### Admin APIs
- `GET /api/admin/stats` - Get statistik admin dashboard
- `GET /api/admin/orders` - Get semua pesanan
- `PUT /api/admin/orders/[id]` - Update status pesanan

### Checkout
- `POST /api/checkout` - Proses checkout dengan bukti pembayaran

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MySQL database
- Git

### Installation
```bash
# Clone repository
git clone <repository-url>
cd toko-tani-server

# Install dependencies
npm install

# Setup environment variables
cp ENV_EXAMPLE .env.local
# Edit .env.local dengan konfigurasi database dan JWT secret

# Setup database
npx prisma generate
npx prisma db push

# Run development server
npm run dev
```

### Environment Variables
```env
DATABASE_URL="mysql://user:password@localhost:3306/toko_tani"
NODE_ENV="development"
JWT_SECRET="your-super-secret-jwt-key"
NEXT_PUBLIC_API_URL="http://localhost:3000/api"
```

## 📁 Project Structure
```
src/
├── app/
│   ├── admin/           # Admin dashboard & features
│   ├── user/            # User dashboard & features
│   ├── api/             # API routes
│   ├── login/           # Login page
│   ├── register/        # Register page
│   ├── menu/            # Public product catalog
│   ├── cart/            # Shopping cart
│   ├── checkout/        # Checkout process
│   └── order-success/   # Order confirmation
├── components/          # Reusable components
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries
├── services/           # API services
└── styles/             # Global styles
```

## 🔒 Security Features

### Authentication
- JWT token dengan expiration
- Password hashing dengan bcrypt
- Token disimpan di localStorage + cookie

### Authorization
- Role-based access control
- Middleware protection untuk semua route
- API endpoint protection

### Data Validation
- Server-side validation dengan Prisma
- Client-side validation dengan Zod
- Input sanitization

## 🎨 UI/UX Features

### Design System
- Consistent color scheme (green theme)
- Responsive design
- Smooth animations dengan Framer Motion
- Modern card-based layout

### User Experience
- Loading states
- Error handling
- Success feedback
- Intuitive navigation

## 🧪 Testing & Quality

### Code Quality
- ESLint configuration
- Prettier formatting
- TypeScript-like structure dengan JSDoc

### Best Practices
- Component reusability
- Custom hooks untuk logic separation
- Service layer untuk API calls
- Error boundary implementation

## 🚀 Deployment

### Production Build
```bash
npm run build
npm start
```

### Environment Setup
- Set `NODE_ENV=production`
- Configure production database
- Set secure JWT secret
- Configure domain URLs

## 📈 Future Enhancements

### Planned Features
- Real-time notifications
- Payment gateway integration
- Advanced reporting
- Mobile app
- Email notifications
- Product reviews & ratings

### Performance Optimizations
- Image optimization
- Code splitting
- Caching strategies
- Database indexing

## 🤝 Contributing

### Development Workflow
1. Create feature branch
2. Implement changes
3. Test thoroughly
4. Update documentation
5. Submit pull request

### Code Standards
- Follow existing code style
- Add proper comments
- Update documentation
- Include error handling

## 📞 Support

Untuk pertanyaan atau masalah:
1. Check documentation
2. Review existing issues
3. Create new issue dengan detail lengkap

---

**Toko Tani** - Empowering farmers through digital commerce 🚀 