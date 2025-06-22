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