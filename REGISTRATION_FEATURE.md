# 👤 **Modul Registrasi Pengguna**

## 🎯 **Gambaran Umum**
Dokumen ini merinci implementasi fitur registrasi pengguna baru. Fitur ini dirancang dengan fokus pada keamanan, validasi data, dan pengalaman pengguna yang baik, mengikuti praktik terbaik pengembangan web modern.

---

## 🚀 **Fitur yang Diimplementasikan**

- **Halaman Registrasi Khusus**: Halaman `/register` yang didedikasikan untuk pendaftaran pengguna baru.
- **Validasi Form Real-time**: Menggunakan `react-hook-form` dan `zod` untuk memvalidasi input pengguna secara *client-side* sebelum mengirim data ke server, memberikan feedback instan.
- **Keamanan Password**: Password pengguna di-*hash* menggunakan `bcrypt` di sisi server sebelum disimpan ke database, sehingga tidak ada password mentah yang tersimpan.
- **Pencegahan Duplikasi**: Sistem secara otomatis memeriksa apakah nama pengguna atau nomor telepon sudah terdaftar untuk mencegah akun ganda.
- **Feedback Pengguna yang Jelas**: Notifikasi `toast` digunakan untuk memberitahu pengguna tentang status proses registrasi (berhasil, gagal, atau sedang diproses).
- **Pengalihan Otomatis**: Setelah registrasi berhasil, pengguna secara otomatis diarahkan ke halaman login untuk melanjutkan.

---

## 📁 **Struktur File & Komponen**

- **API Endpoint**:
  - `src/app/api/auth/register/route.js`: Endpoint tunggal yang menangani semua logika backend untuk registrasi, termasuk validasi, hashing, dan pembuatan user di database.

- **Halaman Frontend**:
  - `src/app/register/page.js`: Komponen halaman yang berisi form registrasi dan logika interaksi pengguna.
  - `src/app/login/page.js`: Diperbarui dengan menambahkan tautan/link yang mengarah ke halaman registrasi.

- **Library & Teknologi Utama**:
  - **`bcrypt`**: Untuk hashing password yang aman di backend.
  - **`react-hook-form`**: Untuk manajemen state form yang efisien di frontend.
  - **`zod`**: Untuk mendefinisikan skema dan aturan validasi data yang kuat.
  - **`react-hot-toast`**: Untuk menampilkan notifikasi yang tidak mengganggu.

---

## 🛠️ **Cara Kerja & Alur Pengguna**

1.  **Akses Halaman Registrasi**: Pengguna mengklik link "Daftar sekarang" di halaman login dan diarahkan ke `/register`.
2.  **Mengisi Form**: Pengguna mengisi nama, nomor telepon, dan password. Aturan validasi (misalnya, panjang minimal password) akan langsung ditampilkan jika input tidak sesuai.
3.  **Kirim Form**: Pengguna menekan tombol "Daftar".
4.  **Proses Frontend**:
    - `react-hook-form` dan `zod` memastikan semua data valid.
    - Tombol "Daftar" dinonaktifkan dan menampilkan status *loading* untuk mencegah pengiriman ganda.
5.  **Proses Backend**:
    - API `/api/auth/register` menerima data.
    - Server memvalidasi ulang data dan memeriksa duplikasi di database.
    - Jika data unik dan valid, password di-*hash*.
    - User baru dibuat dan disimpan di database.
6.  **Hasil**:
    - **Jika berhasil**: API mengembalikan respons sukses. Frontend menampilkan notifikasi "Registrasi berhasil!" dan mengarahkan pengguna ke halaman login.
    - **Jika gagal** (misal, nama sudah ada): API mengembalikan pesan error yang spesifik. Frontend menampilkan pesan error tersebut kepada pengguna.

---

## ✨ **Best Practice yang Diterapkan**

- **Validasi Ganda (Client & Server)**: Memastikan integritas data dengan memvalidasi di frontend untuk UX yang baik dan di backend untuk keamanan.
- **Prinsip Keamanan "Never Trust The Client"**: Semua logika keamanan kritis seperti hashing password dan pengecekan duplikasi dilakukan di sisi server.
- **Pengalaman Pengguna (UX) yang Baik**: Memberikan feedback yang jelas dan instan melalui validasi form, status loading, dan notifikasi toast.
- **State Management Form yang Efisien**: Menggunakan `react-hook-form` meminimalkan re-render yang tidak perlu dan menyederhanakan pengelolaan state form.
- **Penggunaan Kode yang Terstruktur**: Memisahkan logika API (backend) dari logika tampilan (frontend) menjaga kode tetap bersih dan mudah dikelola. 