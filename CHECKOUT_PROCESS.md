# 💳 **Modul Checkout & Pembayaran**

## 🎯 **Gambaran Umum**
Dokumen ini menjelaskan implementasi alur checkout yang aman, di mana pengguna harus login dan mengunggah bukti transfer untuk menyelesaikan pesanan. Admin kemudian akan memvalidasi pembayaran ini.

---

## 🚀 **Fitur yang Diimplementasikan**

- **Checkout Aman**: Alur checkout hanya bisa diakses oleh pengguna yang sudah login.
- **Upload Bukti Transfer**: Pengguna wajib mengunggah gambar sebagai bukti pembayaran.
- **Form Checkout Terpadu**: Halaman checkout menampilkan ringkasan, tujuan transfer, dan form upload dalam satu tampilan yang intuitif.
- **API Transaksional**: Proses checkout di backend (pengurangan stok, pembuatan pesanan) dijalankan dalam satu transaksi database untuk memastikan konsistensi data.
- **Penyimpanan File**: Bukti transfer disimpan di server pada direktori `public/uploads/proofs`.
- **Halaman Konfirmasi**: Pengguna akan diarahkan ke halaman sukses yang menampilkan ID pesanan setelah checkout berhasil.

---

## 📁 **Struktur File & Komponen**

- **API Endpoint**:
  - `src/app/api/checkout/route.js`: Satu endpoint untuk menangani seluruh logika checkout, termasuk parsing form, upload file, dan transaksi database.

- **Halaman Checkout**:
  - `src/app/checkout/page.js`: Halaman utama tempat pengguna melakukan pembayaran dan mengunggah bukti.
  - `src/app/order-success/page.js`: Halaman yang ditampilkan setelah pesanan berhasil dibuat.

- **Perubahan Logika**:
  - `src/app/cart/page.js`: Logika tombol "Lanjut ke Pembayaran" diubah untuk memeriksa status login pengguna.
  - `src/services/api.js`: Port API diubah ke `3000` untuk mengatasi masalah CORS.

- **Library Tambahan**:
  - `formidable`: Digunakan di backend untuk mem-parsing `multipart/form-data` (teks dan file).

---

## 🛠️ **Cara Kerja & Alur Pengguna**

1.  **Mulai Checkout**: Di halaman keranjang, pengguna menekan "Lanjut ke Pembayaran".
2.  **Validasi Login**:
    - **Jika belum login**: Pengguna diarahkan ke `/login`. Setelah berhasil login, mereka akan otomatis diarahkan kembali ke halaman checkout.
    - **Jika sudah login**: Pengguna langsung diarahkan ke `/checkout`.
3.  **Proses Pembayaran**: Di halaman `/checkout`:
    - Pengguna melihat total yang harus dibayar dan detail rekening tujuan.
    - Pengguna mengunggah gambar bukti transfer. Terdapat preview gambar sebelum submit.
    - Pengguna menekan "Konfirmasi Pembayaran".
4.  **Proses Backend**:
    - API `/api/checkout` menerima data.
    - Bukti transfer disimpan di server.
    - Database `transaction` dimulai: stok produk dikurangi dan data pesanan baru dibuat dengan status `PENDING`.
    - Jika ada masalah (misal: stok habis), transaksi dibatalkan dan pengguna mendapat pesan error.
5.  **Pesanan Selesai**:
    - Keranjang belanja pengguna dikosongkan secara otomatis.
    - Pengguna diarahkan ke halaman `/order-success` yang menampilkan pesan konfirmasi dan nomor pesanan.

---

## ✨ **Best Practice yang Diterapkan**

- **Atomic Transactions**: Menggunakan `prisma.$transaction` memastikan bahwa semua operasi database (mengurangi stok, membuat pesanan) berhasil atau gagal bersamaan. Ini mencegah inkonsistensi data, seperti stok berkurang tapi pesanan tidak tercatat.
- **Middleware Logic in Pages**: Logika untuk melindungi rute (mewajibkan login) ditempatkan di level komponen halaman (`CartPage` dan `CheckoutPage`), yang merupakan pendekatan umum di Next.js App Router.
- **Secure File Handling**: File yang diunggah diberi nama unik berbasis waktu untuk mencegah konflik dan disimpan di direktori publik yang ditentukan.
- **Graceful Error Handling**: Baik di frontend maupun backend, pesan error yang jelas diberikan kepada pengguna jika terjadi masalah (misal: stok tidak cukup, file tidak valid).
- **User-Friendly Feedback**: Proses yang berjalan lama (seperti upload dan proses pesanan) dilengkapi dengan status loading pada tombol dan notifikasi `toast` untuk menjaga pengguna tetap terinformasi. 