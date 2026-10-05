# ⚖️ ScaleTrack — Smart IoT Digital Weighing & Computing Web Application

**ScaleTrack** adalah aplikasi web berbasis IoT untuk manajemen penimbangan digital, pencatatan transaksi barang/komoditas secara akurat, serta analisis performa operasional penimbangan secara real-time.

---

## 🚀 Panduan Memulai Cepat

### 1. Instal Dependensi
```bash
npm install
```

### 2. Jalankan Server Pengembangan (Local Dev)
```bash
npm run dev
```
Buka browser di: [http://localhost:3000](http://localhost:3000)

---

## 📑 Halaman & Fitur Utama

1. **📊 Menu Utama (`/`)**
   - **Timbangan Digital Realtime**: Pembacaan bobot sensor akurat dengan indikator bar kapasitas maksimum (0.00 kg - 5.0 kg) dan status kestabilan.
   - **Rekap Penjualan Barang**: Metrik omset penjualan, total berat tertimbang, dan margin keuntungan.
   - **Produk Terlaris & Rincian Penjualan**: Breakdown komoditas barang umum (Beras, Daging, Telur, Gula, dll).
   - **Diagnostik Hardware**: Raw ADC, tegangan baterai, suhu ESP32, dan faktor kalibrasi HX711.

2. **⚖️ Stasiun Timbang (`/weighing`)**
   - Layar display timbangan digital kontras tinggi (*Industrial Viewport*).
   - Pemilihan kategori & produk (*Sembako, Daging & Protein, Pangan, Bahan Pokok, Buah & Sayur, Bumbu & Rempah*).
   - Kalkulasi otomatis total harga berdasarkan bobot (kg) dan harga satuan.
   - Tombol operasional cepat: `TARE`, `ZERO`, `CETAK STRUK / NOTA`, dan `SIMPAN PENIMBANGAN`.

3. **📋 Statistik & Riwayat (`/history`)**
   - **Filter Periode Dinamis**: Hari Ini, Seminggu, Sebulan, dan Setahun yang mengubah seluruh metrik & visualisasi.
   - **Grafik Batang (*Bar Chart*) & Garis (*Area Chart*)**: Tampilan visual terintegrasi dengan tombol pengalih tipe grafik (*single full-width display*).
   - **Distribusi Produk & Analisis Jam Sibuk**: Komposisi komoditas serta konsentrasi beban kerja operasional harian/tahunan.
   - **Tabel Transaksi Spreadsheet/Excel**: Format bersih dengan ID transaksi, rincian produk, operator kasir, total harga, kalkulasi ringkasan otomatis, dan pagination.

---

## 🛠️ Teknologi & Stack

- **Framework**: Next.js 16 (App Router, React 19)
- **Styling**: Tailwind CSS v4
- **Visualisasi Data**: Recharts
- **Icons**: Lucide React
- **Integrasi Hardware**: Serial Web API / WebSocket ESP32 HX711 Loadcell
- **Database (Opsional)**: Supabase PostgreSQL (tersedia di `supabase/schema.sql`)

---

## 📡 Simulator Sensor ESP32 (Testing)

Untuk mensimulasikan pengiriman data berat dari sensor hardware secara lokal:
```bash
npm run simulate
```
