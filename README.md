# Knitto Group Backend Interview Test

### Nama: Fajar Habib Zaelani  
### Posisi: IT Back End  
### Tanggal: 12 Oktober 2024  

## Deskripsi

Repository ini berisi hasil pengerjaan **Backend Interview Test** untuk Knitto Group. Proyek ini dibangun menggunakan TypeScript dan PostgreSQL sebagai database. Tujuan utamanya adalah menguji pengetahuan dan keterampilan dalam pengelolaan database, pembuatan REST API, dan mekanisme penanganan kesalahan.

## Struktur Proyek

- src/
  - controllers/
    - productController.ts
    - orderController.ts
    - errorHandler.ts
  - routes/
    - productRoutes.ts
    - orderRoutes.ts
    - index.ts
  - services/
    - productService.ts
    - orderService.ts
  - db/
    - pool.ts
  - middlewares/
    - errorHandler.ts
  - index.ts

- **controllers/**: Menyimpan semua controller untuk setiap fitur API.
- **routes/**: Menyimpan definisi rute API untuk setiap modul.
- **services/**: Menyimpan logika bisnis yang terpisah dari controller.
- **db/**: Menyimpan koneksi database.
- **middlewares/**: Menyimpan middleware untuk penanganan kesalahan.
- **utils/**: Menyimpan fungsi utilitas seperti validasi.
- **index.ts**: Entry point utama aplikasi.

## Endpoint dan Implementasi

1. **Autentikasi**
   - Endpoint untuk mengelola autentikasi dengan minimal 2 metode login (misalnya, login dengan password dan token).

2. **Data Unik dan Race Condition Handling**
   - Endpoint untuk menyimpan data tertentu dengan kode unik dan running number, termasuk penanganan race condition.

3. **Integrasi API Eksternal**
   - Endpoint untuk mengelola proses integrasi dengan API eksternal.

4. **Penjadwalan Task**
   - Endpoint dan contoh backend untuk penjadwalan task secara sederhana.

5. **Transaction Handling**
   - Endpoint yang menggunakan transaksi ketika mengeksekusi lebih dari 2 query.

6. **Laporan Data**
   - Endpoint untuk mengembalikan data laporan, seperti:
     - Customer dengan pembelian terbanyak
     - Pembelian produk per kota
     - Laporan stok
     - Jumlah request user per jam
     - Jumlah rata-rata produk yang terjual per bulan

## Clone Repository:
git clone https://github.com/fajar551/test_it_backend.git

## Install Dependencies:
npm install

## Jalankan Server:
npm run dev
|| atau ||
npx ts-node src/index.ts

Terima kasih! 🎉

Best Regards,
Fajar Habib Zaelani
