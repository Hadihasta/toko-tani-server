# 🛍️ Modul Menu & Keranjang Belanja Pengguna

## 🎯 **Gambaran Umum**
Dokumen ini menjelaskan implementasi fitur menu produk dan keranjang belanja (cart) untuk pengguna. Fitur ini dirancang agar mobile-friendly dan interaktif, sesuai dengan desain yang diberikan.

---

## 🚀 **Fitur yang Diimplementasikan**

- **Tampilan Menu Produk**: Halaman utama untuk menampilkan semua produk yang tersedia dengan desain kartu yang menarik.
- **Filter Kategori**: Pengguna dapat memfilter produk berdasarkan kategori (Semua, Pupuk, Obat, Alat Tani).
- **Keranjang Belanja (Cart)**: Fungsionalitas penuh untuk menambah, mengurangi, dan menghapus item dari keranjang.
- **State Management Lokal**: State keranjang disimpan di `localStorage` sehingga tidak hilang saat browser ditutup atau di-refresh.
- **Navigasi Bawah**: Navigasi yang mudah diakses di bagian bawah layar untuk berpindah antara Menu dan Keranjang.
- **Notifikasi Toast**: Memberikan feedback instan kepada pengguna saat mereka berinteraksi dengan keranjang.
- **Desain Responsif & Animasi**: Tampilan yang menarik secara visual dengan animasi halus menggunakan `framer-motion`.

---

## 📁 **Struktur File & Komponen**

- **API Endpoint**:
  - `src/app/api/public/stock/route.js`: Menyediakan data produk untuk umum (tidak perlu login).

- **Halaman Utama**:
  - `src/app/menu/page.js`: Halaman utama tempat pengguna melihat dan memilih produk.
  - `src/app/cart/page.js`: Halaman untuk menampilkan isi keranjang belanja, total, dan tombol checkout.

- **Hooks (Logika & State)**:
  - `src/hooks/useCart.js`: Custom hook untuk mengelola semua logika keranjang belanja (tambah, hapus, update kuantitas, dll).

- **Komponen UI**:
  - `src/components/menu/ProductCard.jsx`: Kartu individual untuk setiap produk di halaman menu.
  - `src/app/layout.js`: Diupdate dengan `CartProvider` dan `Toaster` agar notifikasi dan state keranjang tersedia secara global.

---

## 🛠️ **Cara Kerja & Alur Pengguna**

1.  **Melihat Menu**: Pengguna membuka halaman `/menu`. Aplikasi akan memanggil API `/api/public/stock` untuk mendapatkan daftar produk.
2.  **Filter Produk**: Pengguna dapat menekan tombol kategori di bagian atas untuk menyaring produk yang ditampilkan.
3.  **Menambah ke Keranjang**: Pengguna menekan tombol `+` pada `ProductCard`. Hook `useCart` akan menambahkan produk ke dalam state keranjang di `localStorage`.
4.  **Melihat Keranjang**: Jumlah item di keranjang akan muncul di ikon keranjang pada navigasi bawah. Pengguna dapat menekan ikon ini untuk pindah ke halaman `/cart`.
5.  **Mengelola Keranjang**: Di halaman `/cart`, pengguna dapat mengubah kuantitas item atau menghapusnya. Total harga akan terupdate secara otomatis.
6.  **Checkout**: Pengguna menekan tombol "Lanjut ke Pembayaran" untuk melanjutkan proses (logika pembayaran dapat diimplementasikan di langkah selanjutnya).

---

## ✨ **Best Practice yang Diterapkan**

- **Separation of Concerns**: Logika (hook), Tampilan (komponen), dan Data (API) dipisahkan dengan jelas.
- **Client-Side Rendering (CSR)**: Menggunakan `"use client"` karena halaman ini sangat interaktif dan bergantung pada state di browser (seperti `localStorage`).
- **Reusable Components**: `ProductCard` dirancang untuk bisa digunakan kembali di mana saja.
- **Optimistic UI**: Keranjang belanja terasa instan karena state diupdate langsung di client, memberikan pengalaman pengguna yang responsif.
- **Efficient State Management**: Menggunakan `localStorage` untuk persistensi data keranjang tanpa memerlukan database untuk pengguna yang belum login.
- **Visual Feedback**: Menggunakan `react-hot-toast` untuk notifikasi dan `framer-motion` untuk animasi yang memberikan feedback visual yang jelas kepada pengguna.

---

## 🔮 **Langkah Selanjutnya yang Mungkin**

- **Integrasi Proses Checkout**: Menambahkan logika untuk tombol "Lanjut ke Pembayaran", seperti mengarahkan ke form data diri atau gateway pembayaran.
- **Sinkronisasi Keranjang ke Akun**: Jika pengguna login, sinkronisasikan keranjang dari `localStorage` ke database agar bisa diakses dari perangkat lain.
- **Halaman Detail Produk**: Membuat halaman terpisah untuk setiap produk yang menampilkan deskripsi lebih lengkap.
- **Fitur Pencarian**: Menambahkan bar pencarian untuk mencari produk berdasarkan nama. 